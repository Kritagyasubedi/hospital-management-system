import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

const ffmpegPath = 'c:\\Users\\shiva\\Downloads\\NeuroNexus_24\\node_modules\\ffmpeg-static\\ffmpeg.exe';
const audioDir = 'C:\\Users\\shiva\\.gemini\\antigravity-ide\\brain\\dde2f1a0-96d9-480e-a57d-9bf16bebc257\\voiceover_audio';
const outputDir = 'C:\\Users\\shiva\\.gemini\\antigravity-ide\\brain\\dde2f1a0-96d9-480e-a57d-9bf16bebc257\\video_recordings_voice';
const finalVideoWithAudio = 'C:\\Users\\shiva\\.gemini\\antigravity-ide\\brain\\dde2f1a0-96d9-480e-a57d-9bf16bebc257\\neuronexus_jury_walkthrough_with_voiceover.webm';
const finalVideoMp4 = 'C:\\Users\\shiva\\.gemini\\antigravity-ide\\brain\\dde2f1a0-96d9-480e-a57d-9bf16bebc257\\neuronexus_jury_walkthrough_with_voiceover.mp4';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function recordAndMux() {
  console.log('--- Step 1: Starting Browser Recording ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: {
      dir: outputDir,
      size: { width: 1440, height: 900 }
    }
  });

  const page = await context.newPage();

  async function step(title, description, durationMs) {
    console.log(`[Recording] ${title} (${(durationMs/1000).toFixed(0)}s)...`);
    await page.evaluate(({ t, d }) => {
      let banner = document.getElementById('jury-narration-banner');
      if (!banner) {
        banner = document.createElement('div');
        banner.id = 'jury-narration-banner';
        banner.style.position = 'fixed';
        banner.style.bottom = '24px';
        banner.style.left = '50%';
        banner.style.transform = 'translateX(-50%)';
        banner.style.background = 'rgba(15, 23, 42, 0.95)';
        banner.style.color = '#ffffff';
        banner.style.padding = '14px 28px';
        banner.style.borderRadius = '12px';
        banner.style.boxShadow = '0 10px 35px rgba(0,0,0,0.4)';
        banner.style.zIndex = '999999';
        banner.style.fontFamily = 'system-ui, -apple-system, sans-serif';
        banner.style.maxWidth = '850px';
        banner.style.textAlign = 'center';
        banner.style.backdropFilter = 'blur(10px)';
        banner.style.border = '1px solid rgba(59, 130, 246, 0.4)';
        document.body.appendChild(banner);
      }
      banner.innerHTML = `
        <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #60a5fa; margin-bottom: 4px;">
          🎙️ JURY VOICEOVER NARRATION • ${t}
        </div>
        <div style="font-size: 13.5px; font-weight: 500; color: #f1f5f9; line-height: 1.4;">
          ${d}
        </div>
      `;
    }, { t: title, d: description });

    const chunks = Math.floor(durationMs / 1000);
    for (let i = 0; i < chunks; i++) {
      await page.waitForTimeout(1000);
    }
    const rem = durationMs % 1000;
    if (rem > 0) await page.waitForTimeout(rem);
  }

  // Act 1: Welcome & Landing (35s)
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await step('Act 1: Introduction & SRM Trichy HIS Architecture', 'Welcome to the NeuroNexus-24 ICU Clinical Intelligence and Early Deterioration Warning Platform. Seamlessly integrated into hospital systems for real-time risk intelligence.', 35000);

  // Act 2: Role-Based Authentication (30s)
  await page.click('text=Get Started');
  const adminBtn = page.locator('text=Admin').first();
  if (await adminBtn.isVisible()) await adminBtn.click();
  const signInBtn = page.locator('button:has-text("Sign In"), button:has-text("Login")').first();
  if (await signInBtn.isVisible()) await signInBtn.click();
  await page.waitForTimeout(1000);
  await step('Act 2: Authentication & Clean Light Grey Command Center', 'Authenticating as ICU Administrator to access the unified command center with streamlined clinical headers and live surveillance views.', 30000);

  // Act 3: ICU Early Warning Live Bed Grid (65s)
  await step('Act 3: Live ICU Early Warning Surveillance Grid', 'Monitoring 12 in-unit telemetry beds. Patients are stratified into Critical, High, Monitor, and Low risk tiers with real-time trajectory curves.', 35000);
  await page.evaluate(() => window.scrollBy({ top: 300, behavior: 'smooth' }));
  await step('Act 3 (cont): Deterioration Tiers & Demographic Ranking', 'Reviewing escalating vs stable clinical trends across Medical, Surgical, Cardiac, and Trauma ICU beds.', 30000);

  // Act 4: Deep Patient Risk Detail & XAI (70s)
  const firstPatientBtn = page.locator('button:has-text("View Trajectory")').first();
  if (await firstPatientBtn.isVisible()) await firstPatientBtn.click();
  await step('Act 4: Deep Patient Trajectory (Record #132588, MICU)', '48-hour continuous risk curve with color-graded clinical safety bands and risk trigger lines.', 35000);
  await page.evaluate(() => window.scrollBy({ top: 350, behavior: 'smooth' }));
  await step('Act 4 (cont): Multi-Channel Vitals & XAI Feature Contributions', 'Synchronized telemetry streams (HR, MAP, RespRate, GCS) and Shapley-aligned feature weights driving the alert.', 35000);

  // Act 5: Chronological Telemetry Replay (80s)
  const replayTab = page.locator('button:has-text("Chronological Replay"), a:has-text("Chronological Replay"), div:has-text("Chronological Replay")').first();
  if (await replayTab.isVisible()) await replayTab.click();
  await page.waitForTimeout(1000);
  await step('Act 5: Chronological Replay Engine (Zero Temporal Leakage)', 'Simulating live ICU telemetry arrival chronologically. The ML model recalculates deterioration risk at each timestep without future information.', 40000);
  const playBtn = page.locator('button:has-text("Play"), button:has-text("Start Simulation")').first();
  if (await playBtn.isVisible()) await playBtn.click();
  await step('Act 5 (cont): Streaming Progression T=0h to T=48h', 'Observing dynamic risk gauge updates and alert triggering as MAP drops below safe thresholds.', 40000);

  // Act 6: Alert Center & Action Log (65s)
  const alertsTab = page.locator('text=Alert Center & Audit Log').first();
  if (await alertsTab.isVisible()) await alertsTab.click();
  await page.waitForTimeout(1000);
  await step('Act 6: ICU Alert Center & Clinical Action Log', 'Active warnings governed by persistence and cooldown suppression engines with severity breakdown charts.', 35000);
  const ackBtn = page.locator('button:has-text("Acknowledge")').first();
  if (await ackBtn.isVisible()) await ackBtn.click();
  await step('Act 6 (cont): 1-Click Clinician Acknowledgment & Audit Trail', 'Logging clinician actions, clinical notes, and timestamped resolution events in an immutable audit queue.', 30000);

  // Act 7: ML Architecture & Platt Calibration (75s)
  const modelTab = page.locator('text=Model Performance & Benchmark').first();
  if (await modelTab.isVisible()) await modelTab.click();
  await page.waitForTimeout(1000);
  await step('Act 7: ML Model Benchmarks (LightGBM vs RF vs Baseline LR)', 'Trained and validated on 3,200 ICU admissions. LightGBM achieves AUC 0.88 with Platt-calibrated probabilities (Brier 0.082).', 40000);
  const rocTabBtn = page.locator('button:has-text("ROC Curves"), button:has-text("Operating Points")').first();
  if (await rocTabBtn.isVisible()) await rocTabBtn.click();
  await step('Act 7 (cont): Calibration Reliability Curve & Operating Points', 'Reliability curve aligns closely with the ideal 45-degree diagnostic line, providing clinically trustworthy probabilities.', 35000);

  // Act 8: Alert Analytics & Fatigue Control (65s)
  const fatigueTab = page.locator('text=Alert Analytics & Fatigue').first();
  if (await fatigueTab.isVisible()) await fatigueTab.click();
  await page.waitForTimeout(1000);
  await step('Act 8: Alarm Fatigue Control & 74% Noise Suppression', 'Demonstrating our multi-stage alarm filter: 1,420 raw signals filtered to 240 actionable alerts.', 35000);
  await step('Act 8 (cont): 4-8 Hour Lead Time Anticipation Horizon', 'Early warning lead-time distribution confirms advance notice hours prior to acute decompensation.', 30000);

  // Act 9: Telemetry Data Quality & Missingness (65s)
  const qualityTab = page.locator('text=Telemetry Data Quality').first();
  if (await qualityTab.isVisible()) await qualityTab.click();
  await page.waitForTimeout(1000);
  await step('Act 9: Telemetry Data Quality Engine & Cohort Breakdown', 'Auditing 37 physiological parameters across MICU, SICU, CCU, and CSRU. Robust missingness & sentinel value handling.', 35000);
  await page.evaluate(() => window.scrollBy({ top: 300, behavior: 'smooth' }));
  await step('Act 9 (cont): Observation Completeness & Missingness Matrix', 'Visualizing parameter coverage percentages and data hygiene protocols.', 30000);

  // Act 10: Doctor Portal & Clinical Workflow Interoperability (60s)
  await page.goto('http://localhost:3000/#/doctor', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await step('Act 10: Doctor Portal & High-Risk Patient Watchlist', 'Direct clinical integration with doctor assignment queues and inpatient department overview.', 30000);
  const docAnalytics = page.locator('text=Analytics & Reports').first();
  if (await docAnalytics.isVisible()) await docAnalytics.click();
  await step('Act 10 (cont): Hospital Operational Analytics & Patient Flow', 'Monthly patient volume flow curves and department recovery rate comparisons.', 30000);

  console.log('Finalizing browser capture...');
  await page.close();
  await context.close();
  await browser.close();

  // Find generated video
  const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.webm'));
  if (files.length === 0) {
    throw new Error('No raw webm file found in output directory');
  }
  const rawVideoPath = path.join(outputDir, files[files.length - 1]);
  console.log(`Raw video captured at: ${rawVideoPath}`);

  // --- Step 2: Build Master Voiceover Audio Track ---
  console.log('--- Step 2: Merging Voiceover Audio Tracks with Timing ---');
  // We combine the wav files with precise audio offsets
  const acts = [
    { file: 'act1_intro.wav', offset: 2 },
    { file: 'act2_auth.wav', offset: 37 },
    { file: 'act3_grid.wav', offset: 68 },
    { file: 'act4_trajectory.wav', offset: 135 },
    { file: 'act5_replay.wav', offset: 206 },
    { file: 'act6_alerts.wav', offset: 288 },
    { file: 'act7_ml_models.wav', offset: 355 },
    { file: 'act8_fatigue.wav', offset: 432 },
    { file: 'act9_quality.wav', offset: 498 },
    { file: 'act10_doctor.wav', offset: 564 }
  ];

  // Create an ffmpeg filter complex to position all 10 audio clips at their respective timestamps
  let inputArgs = '';
  let filterInputs = '';
  acts.forEach((act, idx) => {
    const filePath = path.join(audioDir, act.file);
    inputArgs += ` -i "${filePath}"`;
    filterInputs += `[${idx}:a]adelay=${act.offset * 1000}|${act.offset * 1000}[a${idx}];`;
  });

  const amixInputs = acts.map((_, idx) => `[a${idx}]`).join('');
  const masterAudioPath = path.join(audioDir, 'master_voiceover.wav');
  const filterComplex = `${filterInputs}${amixInputs}amix=inputs=${acts.length}:dropout_transition=0,volume=2.2[aout]`;

  const audioMergeCmd = `"${ffmpegPath}" -y ${inputArgs} -filter_complex "${filterComplex}" -map "[aout]" "${masterAudioPath}"`;
  console.log('Executing audio merge command...');
  execSync(audioMergeCmd, { stdio: 'inherit' });
  console.log(`Master narration track created: ${masterAudioPath}`);

  // --- Step 3: Mux Video + Audio into Final Video Artifact ---
  console.log('--- Step 3: Muxing Video + Master Audio ---');
  const muxCmd = `"${ffmpegPath}" -y -i "${rawVideoPath}" -i "${masterAudioPath}" -c:v copy -c:a libopus -b:a 128k -shortest "${finalVideoWithAudio}"`;
  execSync(muxCmd, { stdio: 'inherit' });
  console.log(`Final video with voiceover created at: ${finalVideoWithAudio}`);

  // Also create MP4 version for universal playback
  try {
    const mp4Cmd = `"${ffmpegPath}" -y -i "${rawVideoPath}" -i "${masterAudioPath}" -c:v libx264 -pix_fmt yuv420p -preset fast -c:a aac -b:a 192k -shortest "${finalVideoMp4}"`;
    execSync(mp4Cmd, { stdio: 'inherit' });
    console.log(`MP4 version created at: ${finalVideoMp4}`);
  } catch (e) {
    console.warn('MP4 export note:', e.message);
  }
}

recordAndMux().catch(console.error);
