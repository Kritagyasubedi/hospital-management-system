# NeuroNexus ICU Clinical Intelligence — Dataset Audit & Analysis

## 1. Actual Dataset Statistics (PhysioNet 2012 Challenge Format)
Audited programmatically via `python ml/dataset_report.py` across `Dataset 2/train/`:

- **Total Outcomes Records**: 3,200
- **Total Patient Telemetry Files**: 3,200
- **In-Hospital Mortality Count**: 443 patients (13.84%)
- **Survivor Count**: 2,757 patients (86.16%)
- **Telemetry Duration Statistics**:
  - Minimum: `0.0` hours
  - 25th Percentile (Q1): `47.23` hours
  - Median: `47.55` hours
  - 75th Percentile (Q3): `47.80` hours
  - Maximum: `48.00` hours
  - Records < 24 hours: `10` patients
  - Records &ge; 48 hours: `66` patients
- **Observations Per Patient**:
  - Min: `6`
  - Median: `427`
  - Mean: `438.5`
  - Max: `1,502`

---

## 2. Parameter Discovery & Quality Report
The dataset contains 37 distinct clinical parameters across demographics, vital signs, and laboratory panels:

| Parameter Category | Parameters Tracked |
|:---|:---|
| **Demographics** | `Age`, `Gender`, `Height`, `Weight`, `ICUType` |
| **Hemodynamics & Vitals** | `HR`, `SysABP`, `DiasABP`, `MAP`, `NISysABP`, `NIDiasABP`, `NIMAP`, `RespRate`, `Temp` |
| **Neurological** | `GCS` (Glasgow Coma Scale) |
| **Respiratory & Blood Gas** | `FiO2`, `MechVent`, `pH`, `PaCO2`, `PaO2`, `SaO2` |
| **Renal & Metabolic** | `Urine`, `Creatinine`, `BUN`, `Glucose`, `Lactate`, `Na`, `K`, `Mg`, `HCO3` |
| **Hematology & Hepatic** | `HCT`, `WBC`, `Platelets`, `Albumin`, `ALP`, `ALT`, `AST`, `Bilirubin` |
| **Cardiac Biomarkers** | `TroponinI`, `TroponinT`, `Cholesterol` |

---

## 3. Survival Field Semantics & Label Formulation
- `In-hospital_death` is the verified gold-standard binary clinical outcome (0 = survivor, 1 = in-hospital mortality).
- `Survival` represents days of post-admission survival or follow-up; `-1` indicates survivor / unknown follow-up.
- **Label Strategy**: Formulates dynamic deterioration risk estimation across sequential clinical decision points ($t = 12\text{h}, 24\text{h}, 36\text{h}, 48\text{h}$) to identify early physiologic instability before acute collapse.
