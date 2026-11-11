"""
Data Preprocessing & Ingestion Pipeline for ICU Telemetry
Provides canonical record parsing, sentinel value handling, and data quality assessment.
"""
import os
import re
import numpy as np
import pandas as pd

# Core Parameter Vocabulary
DEMOGRAPHIC_PARAMS = ['Age', 'Gender', 'Height', 'Weight', 'ICUType']
VITAL_PARAMS = ['HR', 'SysABP', 'DiasABP', 'MAP', 'NISysABP', 'NIDiasABP', 'NIMAP', 'RespRate', 'Temp']
LAB_PARAMS = [
    'GCS', 'FiO2', 'MechVent', 'pH', 'PaCO2', 'PaO2', 'SaO2', 'Lactate',
    'Creatinine', 'BUN', 'Glucose', 'WBC', 'Platelets', 'Na', 'K', 'Mg',
    'HCO3', 'HCT', 'Albumin', 'ALP', 'ALT', 'AST', 'Bilirubin',
    'TroponinI', 'TroponinT', 'Cholesterol', 'Urine'
]
ALL_TRACKED_PARAMS = DEMOGRAPHIC_PARAMS + VITAL_PARAMS + LAB_PARAMS

# Parameter Physiological Validity Ranges
PARAM_VALID_RANGES = {
    'HR': (20, 250),
    'SysABP': (40, 260),
    'DiasABP': (20, 160),
    'MAP': (30, 200),
    'NISysABP': (40, 260),
    'NIDiasABP': (20, 160),
    'NIMAP': (30, 200),
    'RespRate': (4, 60),
    'Temp': (25, 45),
    'GCS': (3, 15),
    'FiO2': (0.2, 1.0),
    'pH': (6.8, 7.8),
    'PaCO2': (10, 150),
    'PaO2': (20, 500),
    'SaO2': (50, 100),
    'Lactate': (0.3, 30.0),
    'Creatinine': (0.1, 25.0),
    'BUN': (1.0, 250.0),
    'Glucose': (20, 1000),
    'WBC': (0.1, 100.0),
    'Platelets': (5, 1500),
    'Na': (100, 180),
    'K': (1.5, 9.0),
    'Mg': (0.5, 6.0),
    'HCO3': (5, 50),
    'HCT': (10, 65),
    'Albumin': (0.5, 6.0),
    'Bilirubin': (0.1, 40.0),
    'Age': (15, 110),
    'Height': (100, 250),
    'Weight': (25, 300),
}

def parse_time_str(time_str):
    """Converts 'HH:MM' string to hours as float."""
    try:
        parts = time_str.strip().split(':')
        if len(parts) == 2:
            return int(parts[0]) + int(parts[1]) / 60.0
        return float(time_str)
    except Exception:
        return 0.0

def load_patient_raw_telemetry(filepath):
    """
    Parses raw patient telemetry file into canonical sorted observation list.
    Returns: list of dicts [{'time_hours': float, 'parameter': str, 'value': float, 'raw_value': str}]
    """
    observations = []
    errors = []
    
    with open(filepath, 'r') as f:
        lines = f.readlines()
        
    for line_idx, line in enumerate(lines[1:], start=2):
        line = line.strip()
        if not line:
            continue
        parts = line.split(',')
        if len(parts) < 3:
            errors.append(f"Line {line_idx}: Malformed row '{line}'")
            continue
            
        time_str, param, val_str = parts[0].strip(), parts[1].strip(), parts[2].strip()
        t_hours = parse_time_str(time_str)
        
        try:
            val = float(val_str)
        except ValueError:
            errors.append(f"Line {line_idx}: Non-numeric value '{val_str}' for {param}")
            continue
            
        # Sentinel Handling:
        # For demographic parameters and general lab tests, -1 indicates missing/unrecorded
        if val == -1 and param in ['Age', 'Gender', 'Height', 'Weight', 'SAPS-I', 'SOFA']:
            val = np.nan
        elif val == -1 and param not in ['Survival']:
            # Lab/Vital value of -1 is missing
            val = np.nan
            
        # Outlier validation (replace non-physiological artifacts with NaN or clip)
        if param in PARAM_VALID_RANGES and not np.isnan(val):
            vmin, vmax = PARAM_VALID_RANGES[param]
            if val < vmin or val > vmax:
                # Value outside physiological range - flagged as artifact
                val = np.nan
                
        observations.append({
            'time_hours': round(t_hours, 3),
            'parameter': param,
            'value': val,
            'is_valid': not np.isnan(val)
        })
        
    # Chronological sort: guaranteed stable ordering by time
    observations.sort(key=lambda x: x['time_hours'])
    return observations, errors

def compute_data_quality(observations, current_time_hours):
    """
    Calculates dynamic data quality score Q(t) in [0, 1] based on:
    - Signal freshness / latency
    - Vital sign coverage
    - Measurement density
    """
    if not observations:
        return {
            'overall_score': 0.0,
            'status': 'INSUFFICIENT_DATA',
            'active_signals_count': 0,
            'freshness_score': 0.0,
            'coverage_score': 0.0,
            'signal_freshness': {}
        }
        
    # Filter observations up to current_time_hours (NO LEAKAGE)
    valid_obs = [o for o in observations if o['time_hours'] <= current_time_hours and o['is_valid']]
    
    if len(valid_obs) < 5:
        return {
            'overall_score': 0.1,
            'status': 'INSUFFICIENT_DATA',
            'active_signals_count': len(set(o['parameter'] for o in valid_obs)),
            'freshness_score': 0.1,
            'coverage_score': 0.1,
            'signal_freshness': {}
        }
        
    vital_params_present = set(o['parameter'] for o in valid_obs if o['parameter'] in VITAL_PARAMS)
    lab_params_present = set(o['parameter'] for o in valid_obs if o['parameter'] in LAB_PARAMS)
    
    # Coverage score: based on core vital signals
    core_vitals = {'HR', 'SysABP', 'MAP', 'RespRate', 'Temp', 'GCS'}
    vitals_covered = core_vitals.intersection(set(o['parameter'] for o in valid_obs))
    coverage_score = len(vitals_covered) / len(core_vitals)
    
    # Freshness score: check how recent the latest vital observation is
    vital_obs = [o for o in valid_obs if o['parameter'] in core_vitals]
    if vital_obs:
        latest_vital_time = max(o['time_hours'] for o in vital_obs)
        latency_hours = max(0.0, current_time_hours - latest_vital_time)
        # Full freshness if within 1 hour, decays if > 4 hours
        freshness_score = max(0.0, min(1.0, 1.0 - (latency_hours / 6.0)))
    else:
        freshness_score = 0.2
        
    overall_score = round(0.5 * coverage_score + 0.5 * freshness_score, 2)
    status = 'EXCELLENT' if overall_score >= 0.8 else ('GOOD' if overall_score >= 0.6 else ('MODERATE' if overall_score >= 0.4 else 'LOW_QUALITY'))
    
    # Per-signal freshness lookup
    signal_freshness = {}
    for param in core_vitals:
        param_obs = [o for o in valid_obs if o['parameter'] == param]
        if param_obs:
            p_lat = max(0.0, current_time_hours - max(o['time_hours'] for o in param_obs))
            signal_freshness[param] = 'Fresh' if p_lat <= 2.0 else ('Moderate' if p_lat <= 6.0 else 'Stale')
        else:
            signal_freshness[param] = 'Missing'
            
    return {
        'overall_score': overall_score,
        'status': status,
        'active_signals_count': len(vital_params_present) + len(lab_params_present),
        'freshness_score': round(freshness_score, 2),
        'coverage_score': round(coverage_score, 2),
        'signal_freshness': signal_freshness
    }
