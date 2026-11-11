# NeuroNexus ICU Clinical Intelligence — Dataset Audit Report

## 1. Overview
- **Total Outcomes Records**: 3200
- **Total Telemetry Patient Files**: 3200
- **In-Hospital Deaths**: 443 (13.84%)
- **Survivors**: 2757 (86.16%)

## 2. Telemetry Duration Statistics
- **Minimum Duration**: 0.00 hours
- **25th Percentile (Q1)**: 47.23 hours
- **Median Duration**: 47.55 hours
- **75th Percentile (Q3)**: 47.80 hours
- **Maximum Duration**: 48.00 hours
- **Short Records (< 24h)**: 10
- **Records Reach 48h**: 66

## 3. Observation Counts Per Patient
- **Min Observations**: 6
- **Median Observations**: 427.0
- **Mean Observations**: 438.5
- **Max Observations**: 1502

## 4. Parameter Discovery & Quality Analysis
| Parameter | Total Occurrences | Valid Count | Sentinel (-1) Count | Sentinel % |
|:---|:---|:---|:---|:---|
| `ALP` | 2451 | 2451 | 0 | 0.0% |
| `ALT` | 2527 | 2527 | 0 | 0.0% |
| `AST` | 2530 | 2530 | 0 | 0.0% |
| `Age` | 3200 | 3200 | 0 | 0.0% |
| `Albumin` | 1898 | 1898 | 0 | 0.0% |
| `BUN` | 11078 | 11078 | 0 | 0.0% |
| `Bilirubin` | 2525 | 2525 | 0 | 0.0% |
| `Cholesterol` | 251 | 251 | 0 | 0.0% |
| `Creatinine` | 11132 | 11132 | 0 | 0.0% |
| `DiasABP` | 117346 | 117346 | 0 | 0.0% |
| `FiO2` | 25883 | 25883 | 0 | 0.0% |
| `GCS` | 49199 | 49199 | 0 | 0.0% |
| `Gender` | 3200 | 3198 | 2 | 0.06% |
| `Glucose` | 10326 | 10326 | 0 | 0.0% |
| `HCO3` | 10830 | 10830 | 0 | 0.0% |
| `HCT` | 14657 | 14657 | 0 | 0.0% |
| `HR` | 182280 | 182280 | 0 | 0.0% |
| `Height` | 3200 | 1697 | 1503 | 46.97% |
| `ICUType` | 3200 | 3200 | 0 | 0.0% |
| `K` | 11468 | 11468 | 0 | 0.0% |
| `Lactate` | 6335 | 6335 | 0 | 0.0% |
| `MAP` | 117502 | 117502 | 0 | 0.0% |
| `MechVent` | 24855 | 24855 | 0 | 0.0% |
| `Mg` | 10807 | 10807 | 0 | 0.0% |
| `NIDiasABP` | 77456 | 77456 | 0 | 0.0% |
| `NIMAP` | 76419 | 76419 | 0 | 0.0% |
| `NISysABP` | 77544 | 77544 | 0 | 0.0% |
| `Na` | 10769 | 10769 | 0 | 0.0% |
| `PaCO2` | 18808 | 18808 | 0 | 0.0% |
| `PaO2` | 18785 | 18785 | 0 | 0.0% |
| `Platelets` | 11260 | 11260 | 0 | 0.0% |
| `RecordID` | 3200 | 3200 | 0 | 0.0% |
| `RespRate` | 43663 | 43663 | 0 | 0.0% |
| `SaO2` | 6734 | 6734 | 0 | 0.0% |
| `SysABP` | 117408 | 117408 | 0 | 0.0% |
| `Temp` | 69491 | 69491 | 0 | 0.0% |
| `TroponinI` | 356 | 356 | 0 | 0.0% |
| `TroponinT` | 1643 | 1643 | 0 | 0.0% |
| `Urine` | 109818 | 109818 | 0 | 0.0% |
| `WBC` | 10310 | 10310 | 0 | 0.0% |
| `Weight` | 101282 | 101024 | 258 | 0.25% |
| `pH` | 19670 | 19670 | 0 | 0.0% |

## 5. ICU Type & Demographics
- **ICU Types**: {4: 852, 3: 1162, 1: 466, 2: 720} (1: Coronary Care Unit, 2: Cardiac Surgery Recovery Unit, 3: Medical ICU, 4: Surgical ICU)
- **Gender Distribution**: {0: 1427, 1: 1771, -1: 2} (0: Female, 1: Male, -1: Unknown)

## 6. Survival Field Semantics & Label Formulation Verification
- In the PhysioNet 2012 Challenge dataset, `In-hospital_death` is the gold-standard binary outcome (0: survived hospitalization, 1: died in hospital).
- `Survival` is the number of days between ICU admission and death (for non-survivors) or days of follow-up; `-1` denotes unknown or censored past hospital discharge.
- **Label Strategy Formulation**: Predicting acute patient deterioration and in-hospital mortality at sequential clinical decision windows (e.g. t = 6h, 12h, 24h, 36h, 48h) using only strictly retrospective telemetry up to time t, evaluating AUROC, AUPRC, and calibration without temporal leakage.
