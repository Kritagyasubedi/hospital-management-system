# NeuroNexus ICU Clinical Intelligence — Demo Flow & Walkthrough

## 1. Quick Demonstration Workflow

### Step 1: Access the Clinical Intelligence Command Center
1. Open the NeuroNexus application at [http://localhost:3000/](http://localhost:3000/).
2. In the left navigation sidebar, select **Clinical Intelligence (ICU)** &rarr; **ICU Early Warning**.
3. View the ICU Command Center dashboard with summary KPIs, risk tier distributions (Critical, High, Monitor, Low), and active unacknowledged alert banners.

### Step 2: Review Patient Deterioration Trajectory
1. From the ICU Patient Table, select a deteriorating case (e.g., **Bed ICU-B09 / Record #132588**).
2. The detailed **Patient Risk Trajectory** page opens, displaying:
   - Calibrated Deterioration Probability Area Chart over the 48-hour observation window.
   - Multi-channel physiological telemetry graphs (Heart Rate, Blood Pressure, Respiratory Rate, GCS, Lactate).
   - **Model Contributing Signals** explaining driving clinical indicators (e.g., *↑ Increasing respiratory rate*, *↓ Declining MAP trajectory*).
   - Telemetry Data Quality score and latency breakdown.
   - Active alert review trail with 1-click **Acknowledge** and **Resolve** actions.

### Step 3: Launch Chronological Replay Simulator
1. Click **"Launch Chronological Replay"** or navigate to **Chronological Replay** in the sidebar.
2. Select an ICU patient from the cohort selector.
3. Click **"Start Replay"** or use the **+15 min** / **+1 hour** step buttons.
4. Watch telemetry rows arrive chronologically. The machine learning model recalculates risk dynamically at each timestep without seeing future data.
5. When risk sustains above threshold, an early-warning alert banner fires in real-time. Click **"Acknowledge Alert"** to record the clinician action in the audit log.

### Step 4: Inspect Model Performance & Alert Analytics
1. Navigate to **Model Performance & Benchmark**:
   - Inspect the benchmark matrix comparing Baseline Logistic Regression, Random Forest, and Calibrated LightGBM.
   - View the **Threshold Operating Curve** table (operating points from 0.05 to 0.95).
   - Explore the **Top 15 Feature Importances** chart.
2. Navigate to **Alert Analytics & Fatigue**:
   - Inspect alarm fatigue mitigation metrics and suppressed redundancy statistics.
