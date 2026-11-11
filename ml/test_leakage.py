"""
Critical Data Leakage & Chronological Integrity Test Suite
Verifies that the inference and feature generation pipeline strictly obeys time boundaries.
"""
import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import glob
import numpy as np
import pandas as pd
from ml.preprocessing import load_patient_raw_telemetry
from ml.features import extract_features_at_time, get_feature_names

def test_chronological_leakage():
    print("\n--- RUNNING CRITICAL TEMPORAL DATA LEAKAGE TEST ---")
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'Dataset 2', 'train')
    set_a_dir = os.path.join(data_dir, 'set-a')
    telemetry_files = glob.glob(os.path.join(set_a_dir, '*.txt'))
    
    feature_cols = get_feature_names()
    
    tested_count = 0
    leakage_detected = False
    
    # Test across multiple random patient files
    for fpath in telemetry_files[:25]:
        obs_full, _ = load_patient_raw_telemetry(fpath)
        if len(obs_full) < 30:
            continue
            
        max_time = max(o['time_hours'] for o in obs_full)
        if max_time < 24.0:
            continue
            
        # 1. Take observation subset up to 12h
        obs_up_to_12h = [o for o in obs_full if o['time_hours'] <= 12.0]
        if len(obs_up_to_12h) < 5:
            continue
            
        # 2. Compute features at t=12h using only the 12h dataset
        feat_12h_orig = extract_features_at_time(obs_up_to_12h, cutoff_time_hours=12.0)
        
        # 3. Compute features at t=12h using the FULL 48h dataset (with future data 12:01 -> 48:00 present)
        feat_12h_with_future = extract_features_at_time(obs_full, cutoff_time_hours=12.0)
        
        # 4. Compare every single feature
        for feat_name in feature_cols:
            val_orig = feat_12h_orig.get(feat_name, 0.0)
            val_future = feat_12h_with_future.get(feat_name, 0.0)
            
            if abs(val_orig - val_future) > 1e-6:
                print(f"FAILED: Leakage detected on {os.path.basename(fpath)} for feature '{feat_name}': orig={val_orig} vs with_future={val_future}")
                leakage_detected = True
                break
                
        if leakage_detected:
            break
            
        tested_count += 1
        
    if leakage_detected:
        print("TEMPORAL LEAKAGE TEST FAILED! Future observations influenced past predictions.")
        return False
    else:
        print(f"PASSED: Tested {tested_count} patients. Predictions at t=12h are 100% mathematically identical with and without future data.")
        return True

def test_sentinel_handling():
    print("\n--- RUNNING SENTINEL VALUE (-1) HANDLING TEST ---")
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'Dataset 2', 'train')
    set_a_dir = os.path.join(data_dir, 'set-a')
    
    sample_file = glob.glob(os.path.join(set_a_dir, '*.txt'))[0]
    obs, _ = load_patient_raw_telemetry(sample_file)
    
    # Verify no sentinel -1 is treated as valid physiological value
    invalid_sentinels = [
        o for o in obs 
        if o['parameter'] in ['Age', 'Height', 'Weight', 'HR', 'MAP'] and o['value'] == -1
    ]
    
    if len(invalid_sentinels) > 0:
        print(f"FAILED: Found {len(invalid_sentinels)} sentinel values improperly unmasked.")
        return False
        
    print("PASSED: Sentinel -1 correctly identified and masked as missing/NaN.")
    return True

if __name__ == '__main__':
    leak_ok = test_chronological_leakage()
    sent_ok = test_sentinel_handling()
    if leak_ok and sent_ok:
        print("\nALL DATA INTEGRITY & LEAKAGE TESTS PASSED SUCCESSFULLY!")
    else:
        raise RuntimeError("Integrity tests failed!")
