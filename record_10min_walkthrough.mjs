import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function recordComprehensiveWalkthrough() {
  const outputDir = 'C:/Users/shiva/.gemini/antigravity-ide/brain/dde2f1a0-96d9-480e-a57d-9bf16bebc257/video_recordings';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Launching browser with native video recording...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: {
      dir: outputDir,
      size: { width: 1440, height: 900 }
    }
  });

  const page = await context.newPage();

  // Helper for timed narration steps
  async function step(description, durationMs) {
    console.log(`[Step] ${description} (${(durationMs/1000).toFixed(0)}s)...`);
    await page.evaluate((desc) => {
      let banner = document.getElementById('jury-narration-banner');
      if (!banner) {
        banner = document.createElement('div');
        banner.id = 'jury-narration-banner';
        banner.style.position = 'fixed';
        banner.style.bottom = '20px';
        banner.style.left = '50%';
        banner.style.transform = 'translateX(-50%)';
        banner.style.background = 'rgba(11, 30, 51, 0.95)';
        banner.style.color = '#ffffff';
        banner.style.padding = '12px 24px';
        banner.style.borderRadius = '10px';
        banner.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
        banner.style.zIndex = '999999';
        banner.style.fontFamily = 'system-ui, -apple-system, sans-serif';
        banner.style.fontSize = '14px';
        banner.style.fontWeight = '600';
        banner.style.border = '1px solid rgba(59, 130, 246, 0.5)';
        banner.style.maxWidth = '800px';
        banner.style.textAlign = 'center';
        banner.style.backdropFilter = 'blur(8px)';
        document.body.appendChild(banner);
      }
      banner.innerHTML = `<span style="color:#60a5fa;margin-right:8px;">● JURY DEMO:</span> ${desc}`;
    }, description);

    // Smooth chunked delay
    const chunks = Math.floor(durationMs / 1000);
    for (let i = 0; i < chunks; i++) {
      await page.waitForTimeout(1000);
    }
    const rem = durationMs % 1000;
    if (rem > 0) await page.waitForTimeout(rem);
  }

  // --- ACT 1: Welcome & Landing Page (45s) ---
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await step('Welcome to NeuroNexus_24: ICU Clinical Intelligence & Early Warning Platform', 25000);
  await step('SRM Trichy Hospital Information System Integration Overview', 20000);

  // --- ACT 2: Authentication & Portal Login (40s) ---
  await page.click('text=Get Started');
  await step('Role-Based Access Control: Intern, Doctor, Nurse, Admin Portals', 20000);
  const adminBtn = page.locator('text=Admin').first();
  if (await adminBtn.isVisible()) await adminBtn.click();
  const signInBtn = page.locator('button:has-text("Sign In"), button:has-text("Login")').first();
  if (await signInBtn.isVisible()) await signInBtn.click();
  await page.waitForTimeout(1000);
  await step('Authenticated into Clinical Intelligence Command Center with Light Grey Banner', 20000);

  // --- ACT 3: ICU Early Warning Live Deterioration Grid (80s) ---
  await step('ICU Early Warning Grid: 12 Active In-Unit Telemetry Beds Ranked by Risk', 25000);
  // Scroll down smoothly
  await page.evaluate(() => window.scrollBy({ top: 300, behavior: 'smooth' }));
  await step('Examining Risk Tier Breakdown: Critical (≥70%), High (45-69%), Monitor (25-44%), Low (<25%)', 25000);
  await page.evaluate(() => window.scrollBy({ top: 300, behavior: 'smooth' }));
  await step('Reviewing Live Multi-Channel Deterioration Trends: Escalating vs Stable Profiles', 30000);

  // --- ACT 4: Deep Patient Risk Trajectory & XAI Feature Contributions (100s) ---
  const firstPatientBtn = page.locator('button:has-text("View Trajectory")').first();
  if (await firstPatientBtn.isVisible()) await firstPatientBtn.click();
  await step('Deep Patient Risk Detail (Record #132588, MICU): 48-Hour Continuous Risk Curve', 30000);
  await page.evaluate(() => window.scrollBy({ top: 300, behavior: 'smooth' }));
  await step('Multi-Channel Telemetry Stream: Heart Rate, MAP Blood Pressure, Resp Rate, GCS', 35000);
  await page.evaluate(() => window.scrollBy({ top: 300, behavior: 'smooth' }));
  await step('XAI Explainability: Shapley-aligned Top Feature Contributions driving the warning', 35000);

  // --- ACT 5: Chronological Telemetry Replay Simulation (110s) ---
  const replayTab = page.locator('button:has-text("Chronological Replay"), a:has-text("Chronological Replay"), div:has-text("Chronological Replay")').first();
  if (await replayTab.isVisible()) await replayTab.click();
  await page.waitForTimeout(1000);
  await step('Chronological Telemetry Replay Engine: Zero Temporal Leakage Simulation Mode', 25000);
  const playBtn = page.locator('button:has-text("Play"), button:has-text("Start Simulation")').first();
  if (await playBtn.isVisible()) await playBtn.click();
  await step('Simulating Time Progression T=0h to T=48h: Streamed Vital Signs & Real-Time Inferences', 45000);
  await step('Observing Dynamic Risk Gauge & Alert Trigger as MAP Drops Below Safe Thresholds', 40000);

  // --- ACT 6: ICU Alert Center & Clinical Action Log (90s) ---
  const alertsTab = page.locator('text=Alert Center & Audit Log').first();
  if (await alertsTab.isVisible()) await alertsTab.click();
  await page.waitForTimeout(1000);
  await step('ICU Alert Center: Unacknowledged Warnings with Severity Filtering and Timestamps', 25000);
  await page.evaluate(() => window.scrollBy({ top: 250, behavior: 'smooth' }));
  await step('Alert Distribution by Severity & Status BarChart + Detection Window Frequency LineChart', 35000);
  const ackBtn = page.locator('button:has-text("Acknowledge")').first();
  if (await ackBtn.isVisible()) await ackBtn.click();
  await step('Clinician 1-Click Action: Acknowledging Alert & Logging Timestamped Audit Event', 30000);

  // --- ACT 7: Machine Learning Model Benchmarks & Platt Calibration (100s) ---
  const modelTab = page.locator('text=Model Performance & Benchmark').first();
  if (await modelTab.isVisible()) await modelTab.click();
  await page.waitForTimeout(1000);
  await step('ML Model Architecture: Comparing LightGBM (AUC 0.88), Random Forest (0.84), Baseline LR (0.78)', 35000);
  await step('Platt-Calibration Reliability Curve: Perfect Alignment with Ideal 45° Diagnostic Line', 35000);
  const rocTabBtn = page.locator('button:has-text("ROC Curves"), button:has-text("Operating Points")').first();
  if (await rocTabBtn.isVisible()) await rocTabBtn.click();
  await step('Multi-Model ROC Comparison Curve & Clinical Operating Decision Points', 30000);

  // --- ACT 8: Alert Analytics & Alarm Fatigue Control (80s) ---
  const fatigueTab = page.locator('text=Alert Analytics & Fatigue').first();
  if (await fatigueTab.isVisible()) await fatigueTab.click();
  await page.waitForTimeout(1000);
  await step('Alarm Fatigue Mitigation Funnel: 1,420 Raw Signals Filtered to 240 Actionable Alerts', 25000);
  await step('Lead Time Distribution Histogram: 4-8 Hour Pre-Decompensation Warning Horizon', 30000);
  await step('Clinician Response Latency Area Curve: Demonstrating Rapid Bedside Triage', 25000);

  // --- ACT 9: Telemetry Data Quality & Cohort Missingness Audit (80s) ---
  const qualityTab = page.locator('text=Telemetry Data Quality').first();
  if (await qualityTab.isVisible()) await qualityTab.click();
  await page.waitForTimeout(1000);
  await step('Telemetry Data Quality Engine: 3,200 Cohort Telemetry Audit & Completeness BarChart', 30000);
  await step('ICU Cohort Distribution PieChart: Medical (MICU), Surgical (SICU), Cardiac (CCU), Trauma (CSRU)', 25000);
  await page.evaluate(() => window.scrollBy({ top: 300, behavior: 'smooth' }));
  await step('Missingness Matrix & Sentinel Value (-1) Masking Protocol Verification', 25000);

  // --- ACT 10: Doctor Portal & Clinical Workflow Interoperability (60s) ---
  await page.goto('http://localhost:3000/#/doctor', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await step('Doctor Portal Overview: High-Risk Patient Watchlist & Department Metrics', 30000);
  const docAnalytics = page.locator('text=Analytics & Reports').first();
  if (await docAnalytics.isVisible()) await docAnalytics.click();
  await step('Hospital Operational Analytics: Monthly Admission Flow & Department Recovery Rates', 30000);

  console.log('Finalizing recording...');
  await page.close();
  await context.close();
  await browser.close();

  // Find generated video
  const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.webm'));
  if (files.length > 0) {
    const latestFile = path.join(outputDir, files[files.length - 1]);
    const finalPath = 'C:/Users/shiva/.gemini/antigravity-ide/brain/dde2f1a0-96d9-480e-a57d-9bf16bebc257/neuronexus_jury_walkthrough_10min.webm';
    fs.copyFileSync(latestFile, finalPath);
    console.log(`Video successfully recorded and saved to: ${finalPath}`);
  }
}

recordComprehensiveWalkthrough().catch(console.error);
