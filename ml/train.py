"""
Model Training, Calibration, and Evaluation Pipeline for NeuroNexus ICU Early Warning
Trains Baseline (Logistic Regression), Random Forest, and LightGBM models with patient-level splitting.
"""
import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import glob
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import (
    roc_auc_score, average_precision_score, precision_score,
    recall_score, f1_score, brier_score_loss, confusion_matrix,
    roc_curve, precision_recall_curve
)
import lightgbm as lgb

from ml.preprocessing import load_patient_raw_telemetry
from ml.features import extract_features_at_time, get_feature_names

def train_and_evaluate():
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'Dataset 2', 'train')
    outcomes_path = os.path.join(data_dir, 'Outcomes-train.txt')
    set_a_dir = os.path.join(data_dir, 'set-a')
    
    print("Loading outcomes and patient files...")
    outcomes_df = pd.read_csv(outcomes_path)
    patient_ids = outcomes_df['RecordID'].values
    labels = outcomes_df['In-hospital_death'].values
    
    print(f"Total Patients: {len(patient_ids)}, Deaths: {labels.sum()}, Survivors: {len(labels) - labels.sum()}")
    
    # 1. Patient-level Stratified Splitting (70% Train, 15% Val, 15% Test)
    train_ids, test_val_ids, train_y, test_val_y = train_test_split(
        patient_ids, labels, test_size=0.30, random_state=42, stratify=labels
    )
    val_ids, test_ids, val_y, test_y = train_test_split(
        test_val_ids, test_val_y, test_size=0.50, random_state=42, stratify=test_val_y
    )
    
    print(f"Train patients: {len(train_ids)} (Deaths: {train_y.sum()})")
    print(f"Validation patients: {len(val_ids)} (Deaths: {val_y.sum()})")
    print(f"Test patients: {len(test_ids)} (Deaths: {test_y.sum()})")
    
    outcome_map = {row['RecordID']: row['In-hospital_death'] for _, row in outcomes_df.iterrows()}
    
    feature_cols = get_feature_names()
    print(f"Total engineered features per window: {len(feature_cols)}")
    
    # Extract temporal windows for training & validation: t in [12h, 24h, 36h, 48h]
    window_cutoffs = [12.0, 24.0, 36.0, 48.0]
    
    def build_dataset_from_ids(target_ids, cutoffs):
        X_list = []
        y_list = []
        patient_meta = []
        
        for pid in target_ids:
            fpath = os.path.join(set_a_dir, f"{pid}.txt")
            if not os.path.exists(fpath):
                continue
                
            obs, _ = load_patient_raw_telemetry(fpath)
            if not obs:
                continue
                
            y_val = outcome_map[pid]
            max_t = max(o['time_hours'] for o in obs)
            
            for t_cut in cutoffs:
                # Only evaluate if patient has observations near/before cutoff
                if max_t >= min(t_cut, 12.0):
                    feat_dict = extract_features_at_time(obs, t_cut)
                    row = [feat_dict.get(c, 0.0) for c in feature_cols]
                    X_list.append(row)
                    y_list.append(y_val)
                    patient_meta.append({'patient_id': int(pid), 't_cutoff': t_cut, 'label': int(y_val)})
                    
        return np.array(X_list, dtype=np.float32), np.array(y_list, dtype=np.int32), patient_meta

    print("Building temporal feature matrices...")
    X_train, y_train, _ = build_dataset_from_ids(train_ids, window_cutoffs)
    X_val, y_val, _ = build_dataset_from_ids(val_ids, window_cutoffs)
    X_test, y_test, test_meta = build_dataset_from_ids(test_ids, window_cutoffs)
    
    print(f"Dataset matrix shapes -> Train: {X_train.shape}, Val: {X_val.shape}, Test: {X_test.shape}")
    
    # Preprocessing: StandardScaler
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_val_scaled = scaler.transform(X_val)
    X_test_scaled = scaler.transform(X_test)
    
    # 2. Train Baseline: Logistic Regression
    print("Training Baseline: Logistic Regression...")
    lr = LogisticRegression(class_weight='balanced', max_iter=1000, random_state=42)
    lr.fit(X_train_scaled, y_train)
    lr_probs_test = lr.predict_proba(X_test_scaled)[:, 1]
    
    # 3. Train Random Forest
    print("Training Random Forest...")
    rf = RandomForestClassifier(n_estimators=150, max_depth=8, class_weight='balanced', random_state=42, n_jobs=-1)
    rf.fit(X_train, y_train)
    rf_probs_test = rf.predict_proba(X_test)[:, 1]
    
    # 4. Train LightGBM Gradient Boosting with Probability Calibration
    print("Training LightGBM Classifier...")
    pos_weight = (len(y_train) - y_train.sum()) / (y_train.sum() + 1e-5)
    lgb_model = lgb.LGBMClassifier(
        n_estimators=200,
        learning_rate=0.04,
        max_depth=6,
        num_leaves=31,
        scale_pos_weight=pos_weight,
        random_state=42,
        verbose=-1
    )
    lgb_model.fit(X_train, y_train)
    
    # Calibrate LightGBM on Validation Set via Platt Scaling (Sigmoid)
    print("Calibrating model probabilities...")
    calibrated_model = CalibratedClassifierCV(estimator=lgb_model, method='sigmoid', cv='prefit')
    calibrated_model.fit(X_val, y_val)
    
    lgb_cal_probs_test = calibrated_model.predict_proba(X_test)[:, 1]
    
    # 5. Evaluate Metrics on Independent Patient Test Set
    def compute_metrics(y_true, y_probs, name):
        auroc = roc_auc_score(y_true, y_probs)
        auprc = average_precision_score(y_true, y_probs)
        brier = brier_score_loss(y_true, y_probs)
        
        # Standard threshold 0.5 & optimized operational threshold
        precisions, recalls, thresholds = precision_recall_curve(y_true, y_probs)
        f1_scores = 2 * (precisions * recalls) / (precisions + recalls + 1e-8)
        best_idx = np.argmax(f1_scores)
        best_threshold = float(thresholds[best_idx]) if best_idx < len(thresholds) else 0.5
        
        preds_05 = (y_probs >= 0.5).astype(int)
        preds_best = (y_probs >= best_threshold).astype(int)
        
        cm = confusion_matrix(y_true, preds_best).tolist()
        tn, fp, fn, tp = confusion_matrix(y_true, preds_best).ravel()
        
        return {
            'model_name': name,
            'auroc': round(float(auroc), 4),
            'auprc': round(float(auprc), 4),
            'brier_score': round(float(brier), 4),
            'optimal_threshold': round(best_threshold, 3),
            'precision_at_optimal': round(float(precision_score(y_true, preds_best, zero_division=0)), 4),
            'recall_at_optimal': round(float(recall_score(y_true, preds_best)), 4),
            'f1_at_optimal': round(float(f1_score(y_true, preds_best)), 4),
            'specificity_at_optimal': round(float(tn / (tn + fp + 1e-5)), 4),
            'precision_at_05': round(float(precision_score(y_true, preds_05, zero_division=0)), 4),
            'recall_at_05': round(float(recall_score(y_true, preds_05)), 4),
            'f1_at_05': round(float(f1_score(y_true, preds_05)), 4),
            'confusion_matrix': cm
        }
        
    lr_metrics = compute_metrics(y_test, lr_probs_test, "Baseline Logistic Regression")
    rf_metrics = compute_metrics(y_test, rf_probs_test, "Random Forest")
    lgb_metrics = compute_metrics(y_test, lgb_cal_probs_test, "Calibrated LightGBM (Production)")
    
    print("\n--- Test Set Performance ---")
    print(f"Baseline Logistic Regression -> AUROC: {lr_metrics['auroc']}, AUPRC: {lr_metrics['auprc']}, Brier: {lr_metrics['brier_score']}")
    print(f"Random Forest                -> AUROC: {rf_metrics['auroc']}, AUPRC: {rf_metrics['auprc']}, Brier: {rf_metrics['brier_score']}")
    print(f"Calibrated LightGBM          -> AUROC: {lgb_metrics['auroc']}, AUPRC: {lgb_metrics['auprc']}, Brier: {lgb_metrics['brier_score']}")
    
    # 6. Compute Threshold Operating Curve (Thresholds 0.10 to 0.90)
    threshold_curve = []
    total_test_patients = len(y_test)
    for thr in np.linspace(0.05, 0.95, 19):
        thr_f = float(thr)
        preds = (lgb_cal_probs_test >= thr_f).astype(int)
        tn, fp, fn, tp = confusion_matrix(y_test, preds).ravel()
        prec = precision_score(y_test, preds, zero_division=0)
        rec = recall_score(y_test, preds)
        spec = tn / (tn + fp + 1e-5)
        fpr = fp / (fp + tn + 1e-5)
        alert_count = int(tp + fp)
        
        threshold_curve.append({
            'threshold': round(thr_f, 2),
            'precision': round(float(prec), 4),
            'recall_sensitivity': round(float(rec), 4),
            'specificity': round(float(spec), 4),
            'false_positive_rate': round(float(fpr), 4),
            'alerts_count': alert_count,
            'alert_rate_percentage': round((alert_count / total_test_patients) * 100, 2),
            'tp': int(tp),
            'fp': int(fp),
            'tn': int(tn),
            'fn': int(fn)
        })
        
    # 7. Extract Feature Importances for Explainability
    importances = lgb_model.feature_importances_
    sorted_idx = np.argsort(importances)[::-1]
    
    feature_importance_list = [
        {
            'feature': feature_cols[idx],
            'importance': int(importances[idx]),
            'relative_weight': round(float(importances[idx] / np.sum(importances)), 4)
        }
        for idx in sorted_idx[:40]
    ]
    
    # 8. Calibration Curve data points
    prob_bins = np.linspace(0, 1, 11)
    cal_curve = []
    for i in range(len(prob_bins) - 1):
        bin_mask = (lgb_cal_probs_test >= prob_bins[i]) & (lgb_cal_probs_test < prob_bins[i+1])
        if bin_mask.sum() > 0:
            mean_pred = float(lgb_cal_probs_test[bin_mask].mean())
            actual_frac = float(y_test[bin_mask].mean())
            cal_curve.append({
                'bin_range': f"{round(prob_bins[i], 1)}-{round(prob_bins[i+1], 1)}",
                'mean_predicted_prob': round(mean_pred, 3),
                'observed_fraction_pos': round(actual_frac, 3),
                'sample_count': int(bin_mask.sum())
            })
            
    # Save artifacts
    models_dir = os.path.join(os.path.dirname(__file__), 'models')
    eval_dir = os.path.join(os.path.dirname(__file__), 'evaluation')
    
    joblib.dump(calibrated_model, os.path.join(models_dir, 'early_warning_calibrated_lgb.joblib'))
    joblib.dump(lgb_model, os.path.join(models_dir, 'early_warning_lgb.joblib'))
    joblib.dump(scaler, os.path.join(models_dir, 'scaler.joblib'))
    
    metrics_all = {
        'model_version': 'early-warning-v1.0',
        'dataset': 'PhysioNet 2012 Challenge (ICU Deterioration)',
        'baseline_logistic_regression': lr_metrics,
        'random_forest': rf_metrics,
        'calibrated_lightgbm_production': lgb_metrics,
        'calibration_curve': cal_curve
    }
    
    with open(os.path.join(eval_dir, 'metrics.json'), 'w') as f:
        json.dump(metrics_all, f, indent=2)
        
    with open(os.path.join(eval_dir, 'thresholds.json'), 'w') as f:
        json.dump(threshold_curve, f, indent=2)
        
    with open(os.path.join(eval_dir, 'feature_importance.json'), 'w') as f:
        json.dump(feature_importance_list, f, indent=2)
        
    print(f"\nAll models and evaluation metrics saved successfully to {models_dir} and {eval_dir}.")
    
    # 9. Curate Demo Patients for Frontend Interactive Replay
    curate_demo_patients(set_a_dir, outcome_map, calibrated_model, feature_cols)

def curate_demo_patients(set_a_dir, outcome_map, model, feature_cols):
    """
    Selects representative ICU patients from the dataset (deteriorating cases, stable survivors, complex cases)
    and saves their full chronological telemetry and pre-computed risk trajectories for the web UI.
    """
    print("Curating representative ICU patients for Demo Replay...")
    telemetry_files = glob.glob(os.path.join(set_a_dir, '*.txt'))
    
    deteriorating_candidates = []
    stable_candidates = []
    
    for fpath in telemetry_files:
        pid = int(os.path.splitext(os.path.basename(fpath))[0])
        obs, _ = load_patient_raw_telemetry(fpath)
        if len(obs) < 50:
            continue
            
        is_death = outcome_map.get(pid, 0)
        max_t = max(o['time_hours'] for o in obs)
        if max_t < 40.0:
            continue
            
        if is_death == 1:
            deteriorating_candidates.append((pid, fpath, obs))
        else:
            stable_candidates.append((pid, fpath, obs))
            
    selected_patients = deteriorating_candidates[:6] + stable_candidates[:6]
    
    curated_data = []
    
    for pid, fpath, obs in selected_patients:
        is_death = outcome_map.get(pid, 0)
        
        # Calculate chronological trajectory at 1-hour increments up to 48h
        trajectory = []
        time_steps = np.arange(1.0, 49.0, 1.0)
        
        for t_step in time_steps:
            sub_obs = [o for o in obs if o['time_hours'] <= t_step]
            if len(sub_obs) < 3:
                continue
                
            feat_dict = extract_features_at_time(obs, t_step)
            feat_row = np.array([[feat_dict.get(c, 0.0) for c in feature_cols]], dtype=np.float32)
            risk_prob = float(model.predict_proba(feat_row)[0, 1])
            
            # Extract top contributing signals at this step
            signals_contributing = []
            hr_val = feat_dict.get('HR_last', 78)
            map_val = feat_dict.get('MAP_last', 85)
            resp_val = feat_dict.get('RespRate_last', 16)
            gcs_val = feat_dict.get('GCS_last', 15)
            lactate_val = feat_dict.get('Lactate_last', 1.2)
            gcs_slope = feat_dict.get('GCS_slope', 0)
            rr_slope = feat_dict.get('RespRate_slope', 0)
            map_slope = feat_dict.get('MAP_slope', 0)
            
            if resp_val >= 24 or rr_slope > 0.5:
                signals_contributing.append('↑ Increasing respiratory rate / Tachypnea')
            if map_val < 65 or map_slope < -0.5:
                signals_contributing.append('↓ Declining MAP / Hypotension trajectory')
            if gcs_val < 12 or gcs_slope < -0.2:
                signals_contributing.append('↓ Worsening GCS / Neurological decline')
            if lactate_val >= 2.5:
                signals_contributing.append('↑ Elevated serum lactate / Metabolic stress')
            if hr_val > 105:
                signals_contributing.append('↑ Tachycardia (HR > 105 bpm)')
                
            if not signals_contributing:
                signals_contributing = ['Stable physiological vital signs within baseline range']
                
            trajectory.append({
                'time_hours': float(t_step),
                'risk_score': round(risk_prob, 3),
                'risk_percentage': round(risk_prob * 100, 1),
                'severity': 'CRITICAL' if risk_prob >= 0.70 else ('HIGH' if risk_prob >= 0.45 else ('MONITOR' if risk_prob >= 0.25 else 'LOW')),
                'data_quality': feat_dict.get('data_quality_score', 0.8),
                'contributing_signals': signals_contributing
            })
            
        # Get patient metadata
        age = next((o['value'] for o in obs if o['parameter'] == 'Age' and not np.isnan(o['value'])), 62)
        gender_code = next((o['value'] for o in obs if o['parameter'] == 'Gender' and not np.isnan(o['value'])), 1)
        icu_code = next((o['value'] for o in obs if o['parameter'] == 'ICUType' and not np.isnan(o['value'])), 3)
        icu_names = {1: 'CCU (Coronary Care)', 2: 'CSRU (Cardiac Recovery)', 3: 'MICU (Medical ICU)', 4: 'SICU (Surgical ICU)'}
        
        clean_obs = [
            {
                'time_hours': float(o['time_hours']),
                'parameter': str(o['parameter']),
                'value': float(o['value']) if not np.isnan(o['value']) else None,
                'is_valid': bool(o.get('is_valid', True)) and not np.isnan(o['value'])
            }
            for o in obs
        ]

        curated_data.append({
            'record_id': str(pid),
            'bed_id': f"ICU-B{pid % 20 + 1:02d}",
            'age': int(age) if not np.isnan(age) else 62,
            'gender': 'Male' if gender_code == 1 else ('Female' if gender_code == 0 else 'Unknown'),
            'icu_type': icu_names.get(int(icu_code), 'General ICU'),
            'outcome': 'In-Hospital Mortality' if is_death == 1 else 'Survived Hospitalization',
            'is_death': int(is_death),
            'total_observations': len(obs),
            'telemetry_duration_hours': max(o['time_hours'] for o in obs),
            'observations': clean_obs,
            'trajectory': trajectory,
            'final_risk_score': trajectory[-1]['risk_score'] if trajectory else 0.15,
            'final_severity': trajectory[-1]['severity'] if trajectory else 'LOW'
        })
        
    out_curated = os.path.join(os.path.dirname(__file__), 'reports', 'curated_demo_patients.json')
    with open(out_curated, 'w') as f:
        json.dump(curated_data, f, indent=2)
        
    # Also write a copy directly to frontend src for instant web consumption
    frontend_dir = os.path.join(os.path.dirname(__file__), '..', 'services')
    os.makedirs(frontend_dir, exist_ok=True)
    with open(os.path.join(frontend_dir, 'curatedDemoPatients.json'), 'w') as f:
        json.dump(curated_data, f, indent=2)
        
    print(f"Curated {len(curated_data)} demo patients with telemetry & pre-computed trajectories.")

if __name__ == '__main__':
    train_and_evaluate()
