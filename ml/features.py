"""
Temporal Feature Engineering Engine for ICU Telemetry
Extracts state, rolling statistics, physiological trajectories, and composite risk indices
strictly respecting chronological boundaries (No Temporal Leakage).
"""
import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import numpy as np
from ml.preprocessing import DEMOGRAPHIC_PARAMS, VITAL_PARAMS, LAB_PARAMS

# Core signals for statistical summary
DYNAMIC_SIGNALS = [
    'HR', 'SysABP', 'DiasABP', 'MAP', 'RespRate', 'Temp', 'GCS',
    'FiO2', 'pH', 'PaCO2', 'PaO2', 'SaO2', 'Lactate',
    'Creatinine', 'BUN', 'Glucose', 'WBC', 'Platelets',
    'Na', 'K', 'Mg', 'HCO3', 'HCT', 'Urine'
]

# Baseline normal physiological values for population imputation
NORMAL_DEFAULTS = {
    'Age': 60.0,
    'Gender': 1.0,
    'Height': 170.0,
    'Weight': 75.0,
    'ICUType': 3.0,
    'HR': 78.0,
    'SysABP': 120.0,
    'DiasABP': 70.0,
    'MAP': 85.0,
    'NISysABP': 120.0,
    'NIDiasABP': 70.0,
    'NIMAP': 85.0,
    'RespRate': 16.0,
    'Temp': 37.0,
    'GCS': 15.0,
    'FiO2': 0.21,
    'pH': 7.40,
    'PaCO2': 40.0,
    'PaO2': 90.0,
    'SaO2': 98.0,
    'Lactate': 1.2,
    'Creatinine': 1.0,
    'BUN': 15.0,
    'Glucose': 110.0,
    'WBC': 8.5,
    'Platelets': 220.0,
    'Na': 140.0,
    'K': 4.1,
    'Mg': 2.0,
    'HCO3': 24.0,
    'HCT': 38.0,
    'Albumin': 3.8,
    'ALP': 75.0,
    'ALT': 25.0,
    'AST': 25.0,
    'Bilirubin': 0.8,
    'TroponinI': 0.02,
    'TroponinT': 0.01,
    'Cholesterol': 170.0,
    'Urine': 80.0
}

def get_feature_names():
    """Returns ordered list of all engineered feature names."""
    features = []
    # Demographics
    for param in DEMOGRAPHIC_PARAMS:
        features.append(f"{param}_val")
        features.append(f"{param}_is_missing")
        
    # Dynamic Signals
    for param in DYNAMIC_SIGNALS:
        features.append(f"{param}_last")
        features.append(f"{param}_mean")
        features.append(f"{param}_min")
        features.append(f"{param}_max")
        features.append(f"{param}_std")
        features.append(f"{param}_slope")
        features.append(f"{param}_obs_count")
        features.append(f"{param}_time_since_last")
        features.append(f"{param}_is_missing")
        
    # Composite Indices
    features.extend([
        'shock_index_last',
        'shock_index_max',
        'bun_cr_ratio',
        'gcs_deterioration',
        'temp_fever_flag',
        'lactate_elevation_flag',
        'resp_distress_flag',
        't_cutoff_hours',
        'total_obs_in_window',
        'data_quality_score'
    ])
    return features

def extract_features_at_time(observations, cutoff_time_hours):
    """
    Extracts chronological features from observations with time_hours <= cutoff_time_hours.
    Returns: dict mapping feature_name -> float
    """
    # 1. Strict chronological filter - NO FUTURE LEAKAGE
    valid_window_obs = [
        o for o in observations 
        if o['time_hours'] <= cutoff_time_hours and o['is_valid']
    ]
    
    features = {}
    
    # Static / Demographic extraction
    for param in DEMOGRAPHIC_PARAMS:
        param_obs = [o for o in valid_window_obs if o['parameter'] == param]
        if param_obs:
            val = param_obs[-1]['value']
            features[f"{param}_val"] = float(val) if not np.isnan(val) else NORMAL_DEFAULTS.get(param, 0.0)
            features[f"{param}_is_missing"] = 0.0
        else:
            features[f"{param}_val"] = NORMAL_DEFAULTS.get(param, 0.0)
            features[f"{param}_is_missing"] = 1.0
            
    # Dynamic Signals extraction
    recent_window_hours = 6.0  # Last 6 hours for slope/trajectory
    
    for param in DYNAMIC_SIGNALS:
        param_obs = [o for o in valid_window_obs if o['parameter'] == param]
        
        # Also check MAP vs NIMAP, SysABP vs NISysABP fallback
        if not param_obs:
            if param == 'MAP':
                param_obs = [o for o in valid_window_obs if o['parameter'] == 'NIMAP']
            elif param == 'SysABP':
                param_obs = [o for o in valid_window_obs if o['parameter'] == 'NISysABP']
            elif param == 'DiasABP':
                param_obs = [o for o in valid_window_obs if o['parameter'] == 'NIDiasABP']
                
        if param_obs:
            values = np.array([o['value'] for o in param_obs if not np.isnan(o['value'])])
            times = np.array([o['time_hours'] for o in param_obs if not np.isnan(o['value'])])
            
            if len(values) > 0:
                last_val = float(values[-1])
                mean_val = float(np.mean(values))
                min_val = float(np.min(values))
                max_val = float(np.max(values))
                std_val = float(np.std(values)) if len(values) > 1 else 0.0
                obs_cnt = float(len(values))
                time_since = float(max(0.0, cutoff_time_hours - times[-1]))
                
                # Trajectory slope (change per hour over recent window)
                if len(values) >= 2:
                    dt = times[-1] - times[0]
                    slope = (values[-1] - values[0]) / (dt + 0.1) if dt > 0.1 else (values[-1] - values[0])
                else:
                    slope = 0.0
                    
                features[f"{param}_last"] = last_val
                features[f"{param}_mean"] = mean_val
                features[f"{param}_min"] = min_val
                features[f"{param}_max"] = max_val
                features[f"{param}_std"] = std_val
                features[f"{param}_slope"] = float(slope)
                features[f"{param}_obs_count"] = obs_cnt
                features[f"{param}_time_since_last"] = time_since
                features[f"{param}_is_missing"] = 0.0
            else:
                default_val = NORMAL_DEFAULTS.get(param, 0.0)
                features[f"{param}_last"] = default_val
                features[f"{param}_mean"] = default_val
                features[f"{param}_min"] = default_val
                features[f"{param}_max"] = default_val
                features[f"{param}_std"] = 0.0
                features[f"{param}_slope"] = 0.0
                features[f"{param}_obs_count"] = 0.0
                features[f"{param}_time_since_last"] = cutoff_time_hours
                features[f"{param}_is_missing"] = 1.0
        else:
            default_val = NORMAL_DEFAULTS.get(param, 0.0)
            features[f"{param}_last"] = default_val
            features[f"{param}_mean"] = default_val
            features[f"{param}_min"] = default_val
            features[f"{param}_max"] = default_val
            features[f"{param}_std"] = 0.0
            features[f"{param}_slope"] = 0.0
            features[f"{param}_obs_count"] = 0.0
            features[f"{param}_time_since_last"] = cutoff_time_hours
            features[f"{param}_is_missing"] = 1.0

    # Composite Clinical Indices
    hr_val = features.get('HR_last', 78.0)
    sys_val = features.get('SysABP_last', 120.0)
    features['shock_index_last'] = float(hr_val / (sys_val + 1e-5)) if sys_val > 20 else 0.65
    
    hr_max = features.get('HR_max', 78.0)
    sys_min = features.get('SysABP_min', 120.0)
    features['shock_index_max'] = float(hr_max / (sys_min + 1e-5)) if sys_min > 20 else 0.65
    
    bun_val = features.get('BUN_last', 15.0)
    cr_val = features.get('Creatinine_last', 1.0)
    features['bun_cr_ratio'] = float(bun_val / (cr_val + 1e-5)) if cr_val > 0.1 else 15.0
    
    gcs_val = features.get('GCS_last', 15.0)
    features['gcs_deterioration'] = 1.0 if gcs_val < 13.0 else (2.0 if gcs_val < 9.0 else 0.0)
    
    temp_val = features.get('Temp_last', 37.0)
    features['temp_fever_flag'] = 1.0 if (temp_val >= 38.3 or temp_val < 36.0) else 0.0
    
    lactate_val = features.get('Lactate_last', 1.2)
    features['lactate_elevation_flag'] = 1.0 if lactate_val >= 2.0 else (2.0 if lactate_val >= 4.0 else 0.0)
    
    resp_val = features.get('RespRate_last', 16.0)
    features['resp_distress_flag'] = 1.0 if (resp_val >= 24.0 or resp_val <= 8.0) else 0.0
    
    features['t_cutoff_hours'] = float(cutoff_time_hours)
    features['total_obs_in_window'] = float(len(valid_window_obs))
    
    # Data quality score
    # Score 0 to 1 based on vital count & coverage
    vitals_tracked = ['HR', 'SysABP', 'MAP', 'RespRate', 'Temp', 'GCS']
    present_vitals = sum(1 for v in vitals_tracked if features.get(f"{v}_is_missing", 1.0) == 0.0)
    features['data_quality_score'] = round(present_vitals / len(vitals_tracked), 2)
    
    return features
