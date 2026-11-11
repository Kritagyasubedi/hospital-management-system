# NeuroNexus ICU Clinical Intelligence — Architecture & Engineering Specification

## 1. Executive Summary
**NeuroNexus** is an integrated Hospital Management and Clinical Intelligence Platform designed for intensive care unit (ICU) monitoring. It addresses **"The Silent Window: Anticipating Patient Deterioration in Intensive Care"** by converting noisy, irregularly sampled, incomplete physiological telemetry into calibrated deterioration risk trajectories and controlled, explainable early-warning signals.

```
RAW ICU TELEMETRY
  (Irregular, noisy, incomplete observations)
        ↓
DATA QUALITY ENGINE
  (Sentinel masking, freshness, coverage scoring)
        ↓
CHRONOLOGICAL FEATURE ENGINE
  (Strictly retrospective temporal windows: obs_time <= t)
        ↓
ML RISK MODEL
  (Calibrated Gradient Boosted Trees: Platt Sigmoid scaling)
        ↓
EXPLAINABILITY ATTRIBUTION
  (SHAP / split-weight driving clinical indicators)
        ↓
ALERT ENGINE
  (Threshold, persistence, cooldown, suppression)
        ↓
CLINICIAN REVIEW & ACTION
  (ICU Command Center, Patient Risk Trajectory, Replay)
```

---

## 2. Integrated Platform Architecture
NeuroNexus unifies core hospital administration with specialized ICU clinical intelligence:

```
+-------------------------------------------------------------------------+
|                               NEURONEXUS                                |
+------------------------------------+------------------------------------+
|     EXISTING HOSPITAL MODULES      |        CLINICAL INTELLIGENCE       |
+------------------------------------+------------------------------------+
| • Patient Registration & EHR       | • ICU Early Warning Dashboard      |
| • Doctor & Nurse Portals           | • Chronological Replay Simulator   |
| • Emergency & Medico-Legal         | • Multi-Channel Telemetry Trends   |
| • Pharmacy & Drug Info (ADR)       | • Model Explainability (Attribution)|
| • Lab Information System (LIS)     | • Alert Center & Clinician Audit   |
| • Ward & Bed Management            | • ML Validation & Benchmark Report |
| • Hospital Billing & Analytics     | • Telemetry Data Quality Engine    |
+------------------------------------+------------------------------------+
```

---

## 3. Data Pipeline & Temporal Integrity
1. **Raw Telemetry Ingestion**: Parses `Time,Parameter,Value` logs with millisecond chronological sorting.
2. **Sentinel Value Handling**: Sentinel markers like `-1` (in `Age`, `Height`, `Weight`, `Gender`, and lab values) are masked to missing/NaN rather than treated as numeric values.
3. **Strict Retrospective Windows**: At prediction time $t$, all observations with $\text{observation\_time} > t$ are excluded. This guarantee is verified by the automated test suite `ml/test_leakage.py`.

---

## 4. Machine Learning & Probability Calibration
- **Baseline Model**: L2-Regularized Logistic Regression with StandardScaler.
- **Ensemble Model**: Random Forest (150 trees, max depth 8).
- **Production Engine**: LightGBM Classifier with Platt Sigmoid Probability Calibration (`CalibratedClassifierCV`).
- **Test Performance (Independent Patient Cohort)**:
  - **AUROC**: `0.8137`
  - **AUPRC**: `0.4456`
  - **Brier Score**: `0.0985` (calibrated probabilities)
  - **Optimal Threshold**: `0.28` (F1 Score: `0.5287`, Sensitivity: `84.8%`, Specificity: `67.8%`)

---

## 5. False Alarm & Alarm Fatigue Mitigation
To prevent sensor desensitization and alarm fatigue:
1. **Tiered Risk States**: Separates risk into `LOW` (<25%), `MONITOR` (25-44%), `HIGH` (45-69%), and `CRITICAL` (&ge;70%).
2. **Persistence Requirement**: Requires risk to remain elevated over consecutive observation windows or demonstrate a rapid acute spike (>0.20 jump).
3. **4-Hour Cooldown**: Suppresses redundant alerts for 4 hours unless severity escalates from HIGH to CRITICAL.
4. **Data Quality Gating**: Alerts are suppressed and flagged as DATA_QUALITY warnings if telemetry coverage drops below acceptable reliability thresholds.
