"""
Dataset Audit & Analysis Script for NeuroNexus ICU Clinical Intelligence
Analyzes the entire supplied Dataset 2 (PhysioNet 2012 Challenge dataset format).
"""
import os
import glob
import json
import numpy as np
import pandas as pd

def parse_time_to_minutes(time_str):
    try:
        parts = time_str.strip().split(':')
        if len(parts) == 2:
            return int(parts[0]) * 60 + int(parts[1])
        return 0
    except Exception:
        return 0

def audit_dataset():
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'Dataset 2', 'train')
    outcomes_path = os.path.join(data_dir, 'Outcomes-train.txt')
    set_a_dir = os.path.join(data_dir, 'set-a')
    
    print(f"Reading outcomes from {outcomes_path}...")
    outcomes_df = pd.read_csv(outcomes_path)
    
    total_outcomes = len(outcomes_df)
    deaths = int((outcomes_df['In-hospital_death'] == 1).sum())
    survivors = int((outcomes_df['In-hospital_death'] == 0).sum())
    mortality_rate = (deaths / total_outcomes) * 100
    
    # Survival field analysis
    # Survival in PhysioNet 2012 Challenge: length of survival in days (-1 if survived or unknown)
    survival_stats = {
        "negative_one_count": int((outcomes_df['Survival'] == -1).sum()),
        "positive_count": int((outcomes_df['Survival'] > -1).sum()),
        "min": float(outcomes_df['Survival'].min()),
        "max": float(outcomes_df['Survival'].max()),
        "mean_positive": float(outcomes_df[outcomes_df['Survival'] > -1]['Survival'].mean()) if (outcomes_df['Survival'] > -1).any() else 0,
        "median_positive": float(outcomes_df[outcomes_df['Survival'] > -1]['Survival'].median()) if (outcomes_df['Survival'] > -1).any() else 0
    }
    
    # Check patient telemetry files
    telemetry_files = glob.glob(os.path.join(set_a_dir, '*.txt'))
    total_files = len(telemetry_files)
    print(f"Found {total_files} telemetry patient files in set-a.")
    
    param_counts = {}
    param_sentinel_counts = {}
    param_valid_counts = {}
    durations_minutes = []
    observation_counts = []
    icu_types = {}
    genders = {}
    ages = []
    
    for idx, fpath in enumerate(telemetry_files):
        rec_id = os.path.splitext(os.path.basename(fpath))[0]
        try:
            with open(fpath, 'r') as f:
                lines = f.readlines()
            
            if len(lines) <= 1:
                durations_minutes.append(0)
                observation_counts.append(0)
                continue
                
            header = lines[0].strip().split(',')
            # Expect Time,Parameter,Value
            max_t = 0
            obs_cnt = 0
            
            for line in lines[1:]:
                line = line.strip()
                if not line:
                    continue
                parts = line.split(',')
                if len(parts) < 3:
                    continue
                t_str, param, val_str = parts[0], parts[1], parts[2]
                t_min = parse_time_to_minutes(t_str)
                if t_min > max_t:
                    max_t = t_min
                obs_cnt += 1
                
                param_counts[param] = param_counts.get(param, 0) + 1
                
                try:
                    val = float(val_str)
                    if val == -1:
                        param_sentinel_counts[param] = param_sentinel_counts.get(param, 0) + 1
                    else:
                        param_valid_counts[param] = param_valid_counts.get(param, 0) + 1
                        
                    if param == 'ICUType':
                        icu_types[int(val)] = icu_types.get(int(val), 0) + 1
                    elif param == 'Gender':
                        genders[int(val)] = genders.get(int(val), 0) + 1
                    elif param == 'Age' and val != -1:
                        ages.append(val)
                except ValueError:
                    pass
                    
            durations_minutes.append(max_t)
            observation_counts.append(obs_cnt)
            
        except Exception as e:
            print(f"Error reading {fpath}: {e}")
            
    durations_hours = np.array(durations_minutes) / 60.0
    
    duration_stats = {
        "min_hours": float(np.min(durations_hours)) if len(durations_hours) > 0 else 0,
        "max_hours": float(np.max(durations_hours)) if len(durations_hours) > 0 else 0,
        "median_hours": float(np.median(durations_hours)) if len(durations_hours) > 0 else 0,
        "q25_hours": float(np.percentile(durations_hours, 25)) if len(durations_hours) > 0 else 0,
        "q75_hours": float(np.percentile(durations_hours, 75)) if len(durations_hours) > 0 else 0,
        "short_records_lt_24h": int((durations_hours < 24.0).sum()),
        "full_records_gte_48h": int((durations_hours >= 48.0).sum()),
    }
    
    obs_stats = {
        "min_obs": int(np.min(observation_counts)) if len(observation_counts) > 0 else 0,
        "max_obs": int(np.max(observation_counts)) if len(observation_counts) > 0 else 0,
        "median_obs": float(np.median(observation_counts)) if len(observation_counts) > 0 else 0,
        "mean_obs": float(np.mean(observation_counts)) if len(observation_counts) > 0 else 0,
    }
    
    report = {
        "summary": {
            "total_outcomes": total_outcomes,
            "total_telemetry_files": total_files,
            "in_hospital_deaths": deaths,
            "survivors": survivors,
            "mortality_percentage": round(mortality_rate, 2),
        },
        "survival_field_analysis": survival_stats,
        "telemetry_duration_hours": duration_stats,
        "observations_per_patient": obs_stats,
        "icu_types_distribution": icu_types,
        "gender_distribution": genders,
        "parameters": {
            param: {
                "total_occurrences": param_counts[param],
                "valid_count": param_valid_counts.get(param, 0),
                "sentinel_negative_one_count": param_sentinel_counts.get(param, 0),
                "missingness_percentage": round((param_sentinel_counts.get(param, 0) / param_counts[param]) * 100, 2)
            }
            for param in sorted(param_counts.keys())
        }
    }
    
    out_json = os.path.join(os.path.dirname(__file__), 'reports', 'dataset_report.json')
    with open(out_json, 'w') as f:
        json.dump(report, f, indent=2)
    print(f"Dataset report written to {out_json}")
    
    # Generate markdown report
    md_content = f"""# NeuroNexus ICU Clinical Intelligence — Dataset Audit Report

## 1. Overview
- **Total Outcomes Records**: {total_outcomes}
- **Total Telemetry Patient Files**: {total_files}
- **In-Hospital Deaths**: {deaths} ({mortality_rate:.2f}%)
- **Survivors**: {survivors} ({100 - mortality_rate:.2f}%)

## 2. Telemetry Duration Statistics
- **Minimum Duration**: {duration_stats['min_hours']:.2f} hours
- **25th Percentile (Q1)**: {duration_stats['q25_hours']:.2f} hours
- **Median Duration**: {duration_stats['median_hours']:.2f} hours
- **75th Percentile (Q3)**: {duration_stats['q75_hours']:.2f} hours
- **Maximum Duration**: {duration_stats['max_hours']:.2f} hours
- **Short Records (< 24h)**: {duration_stats['short_records_lt_24h']}
- **Records Reach 48h**: {duration_stats['full_records_gte_48h']}

## 3. Observation Counts Per Patient
- **Min Observations**: {obs_stats['min_obs']}
- **Median Observations**: {obs_stats['median_obs']}
- **Mean Observations**: {obs_stats['mean_obs']:.1f}
- **Max Observations**: {obs_stats['max_obs']}

## 4. Parameter Discovery & Quality Analysis
| Parameter | Total Occurrences | Valid Count | Sentinel (-1) Count | Sentinel % |
|:---|:---|:---|:---|:---|
"""
    for param, stats in sorted(report['parameters'].items()):
        md_content += f"| `{param}` | {stats['total_occurrences']} | {stats['valid_count']} | {stats['sentinel_negative_one_count']} | {stats['missingness_percentage']}% |\n"

    md_content += f"""
## 5. ICU Type & Demographics
- **ICU Types**: {icu_types} (1: Coronary Care Unit, 2: Cardiac Surgery Recovery Unit, 3: Medical ICU, 4: Surgical ICU)
- **Gender Distribution**: {genders} (0: Female, 1: Male, -1: Unknown)

## 6. Survival Field Semantics & Label Formulation Verification
- In the PhysioNet 2012 Challenge dataset, `In-hospital_death` is the gold-standard binary outcome (0: survived hospitalization, 1: died in hospital).
- `Survival` is the number of days between ICU admission and death (for non-survivors) or days of follow-up; `-1` denotes unknown or censored past hospital discharge.
- **Label Strategy Formulation**: Predicting acute patient deterioration and in-hospital mortality at sequential clinical decision windows (e.g. t = 6h, 12h, 24h, 36h, 48h) using only strictly retrospective telemetry up to time t, evaluating AUROC, AUPRC, and calibration without temporal leakage.
"""

    out_md = os.path.join(os.path.dirname(__file__), 'reports', 'dataset_report.md')
    with open(out_md, 'w') as f:
        f.write(md_content)
    print(f"Markdown report written to {out_md}")
    
    return report

if __name__ == '__main__':
    audit_dataset()
