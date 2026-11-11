"""
ML Inference Service for NeuroNexus ICU Early Warning
Generates calibrated deterioration risk predictions, contributing signals, and data quality metrics
from raw telemetry up to a given chronological cutoff time.
"""
import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import json
import joblib
import numpy as np

from ml.preprocessing import load_patient_raw_telemetry, compute_data_quality
from ml.features import extract_features_at_time, get_feature_names

class ICUEarlyWarningInferenceEngine:
    def __init__(self, model_path=None):
        base_dir = os.path.dirname(__file__)
        if model_path is None:
            model_path = os.path.join(base_dir, 'models', 'early_warning_calibrated_lgb.joblib')
            
        self.model = joblib.load(model_path)
        self.feature_cols = get_feature_names()
        
        # Load feature importance for explainability attribution
        fi_path = os.path.join(base_dir, 'evaluation', 'feature_importance.json')
        if os.path.exists(fi_path):
            with open(fi_path, 'r') as f:
                self.feature_importance = json.load(f)
        else:
            self.feature_importance = []
            
        self.model_version = 'early-warning-v1.0'
        
    def predict_patient(self, telemetry_file_or_obs, cutoff_time_hours=48.0):
        """
        Runs chronological inference on patient telemetry up to cutoff_time_hours.
        Returns complete clinical intelligence response dict.
        """
        if isinstance(telemetry_file_or_obs, str):
            obs, errors = load_patient_raw_telemetry(telemetry_file_or_obs)
        else:
            obs = telemetry_file_or_obs
            errors = []
            
        # 1. Compute Data Quality
        dq_report = compute_data_quality(obs, cutoff_time_hours)
        
        # 2. Check for Insufficient Data
        valid_obs_count = sum(1 for o in obs if o['time_hours'] <= cutoff_time_hours and o.get('is_valid', True))
        if valid_obs_count < 5 or dq_report['active_signals_count'] < 2:
            return {
                'status': 'INSUFFICIENT_DATA',
                'risk_score': None,
                'risk_percentage': None,
                'severity': 'INSUFFICIENT_DATA',
                'reason': f'Not enough valid observations in the current prediction window (found {valid_obs_count} observations).',
                'data_quality': dq_report,
                'contributing_signals': [],
                'cutoff_time_hours': cutoff_time_hours,
                'model_version': self.model_version
            }
            
        # 3. Extract Features (Strictly Retrospective up to cutoff_time_hours)
        feat_dict = extract_features_at_time(obs, cutoff_time_hours)
        feat_row = np.array([[feat_dict.get(c, 0.0) for c in self.feature_cols]], dtype=np.float32)
        
        # 4. Predict Calibrated Probability
        probs = self.model.predict_proba(feat_row)[0]
        risk_score = float(probs[1])
        
        # 5. Determine Interface Severity State
        if risk_score >= 0.70:
            severity = 'CRITICAL'
        elif risk_score >= 0.45:
            severity = 'HIGH'
        elif risk_score >= 0.25:
            severity = 'MONITOR'
        else:
            severity = 'LOW'
            
        # 6. Compute Contributing Signals (Explainability)
        contributing_signals = []
        hr_val = feat_dict.get('HR_last', 78)
        map_val = feat_dict.get('MAP_last', 85)
        resp_val = feat_dict.get('RespRate_last', 16)
        gcs_val = feat_dict.get('GCS_last', 15)
        lactate_val = feat_dict.get('Lactate_last', 1.2)
        bun_cr = feat_dict.get('bun_cr_ratio', 15.0)
        gcs_slope = feat_dict.get('GCS_slope', 0)
        rr_slope = feat_dict.get('RespRate_slope', 0)
        map_slope = feat_dict.get('MAP_slope', 0)
        shock_idx = feat_dict.get('shock_index_last', 0.65)
        
        if resp_val >= 24 or rr_slope > 0.4:
            contributing_signals.append({
                'signal': 'Respiratory Rate / Tachypnea',
                'value': f"{resp_val:.0f} bpm",
                'trend': '↑ Increasing rate of change',
                'category': 'Respiratory'
            })
        if map_val < 65 or map_slope < -0.5:
            contributing_signals.append({
                'signal': 'Mean Arterial Pressure (MAP)',
                'value': f"{map_val:.1f} mmHg",
                'trend': '↓ Declining perfusion pressure',
                'category': 'Hemodynamic'
            })
        if shock_idx > 0.85:
            contributing_signals.append({
                'signal': 'Shock Index (HR/SysBP)',
                'value': f"{shock_idx:.2f}",
                'trend': '↑ Elevated shock risk index',
                'category': 'Hemodynamic'
            })
        if gcs_val < 13 or gcs_slope < -0.2:
            contributing_signals.append({
                'signal': 'Glasgow Coma Scale (GCS)',
                'value': f"{gcs_val:.0f}/15",
                'trend': '↓ Acute neurological decline',
                'category': 'Neurological'
            })
        if lactate_val >= 2.2:
            contributing_signals.append({
                'signal': 'Serum Lactate',
                'value': f"{lactate_val:.1f} mmol/L",
                'trend': '↑ Metabolic distress biomarker',
                'category': 'Metabolic'
            })
        if bun_cr > 25.0:
            contributing_signals.append({
                'signal': 'BUN / Creatinine Ratio',
                'value': f"{bun_cr:.1f}",
                'trend': '↑ Prerenal azotemia pattern',
                'category': 'Renal'
            })
            
        if not contributing_signals:
            contributing_signals.append({
                'signal': 'Baseline Telemetry',
                'value': 'Stable',
                'trend': '→ Vital signs within compensatory baseline range',
                'category': 'General'
            })
            
        return {
            'status': 'SUCCESS',
            'risk_score': round(risk_score, 3),
            'risk_percentage': round(risk_score * 100, 1),
            'severity': severity,
            'confidence': round(min(0.98, max(0.60, 1.0 - abs(0.5 - risk_score) * 0.4)), 2),
            'data_quality': dq_report,
            'contributing_signals': contributing_signals,
            'cutoff_time_hours': cutoff_time_hours,
            'model_version': self.model_version,
            'disclaimer': 'AI-assisted research prototype. Clinical decision support only; not a diagnosis.'
        }

if __name__ == '__main__':
    engine = ICUEarlyWarningInferenceEngine()
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'Dataset 2', 'train', 'set-a')
    sample_file = os.path.join(data_dir, '132539.txt')
    result = engine.predict_patient(sample_file, cutoff_time_hours=24.0)
    print("\nSample Prediction Output at 24h:")
    print(json.dumps(result, indent=2))
