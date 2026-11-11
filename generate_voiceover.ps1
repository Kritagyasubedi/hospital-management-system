Add-Type -AssemblyName System.Speech

$audioDir = "C:\Users\shiva\.gemini\antigravity-ide\brain\dde2f1a0-96d9-480e-a57d-9bf16bebc257\voiceover_audio"
if (!(Test-Path -Path $audioDir)) {
    New-Item -ItemType Directory -Path $audioDir | Out-Null
}

$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.SelectVoice("Microsoft Zira Desktop")
$synth.Rate = 0  # Normal conversational speed

$scripts = @(
    @{
        File = "act1_intro.wav"
        Text = "Welcome to the NeuroNexus twenty-four ICU Clinical Intelligence and Early Deterioration Warning Platform. This system is fully integrated into the SRM Trichy Hospital Information System, providing real-time physiological monitoring and early warnings for critical care clinicians."
    },
    @{
        File = "act2_auth.wav"
        Text = "We begin by authenticating into the platform with role-based access control. Logging in as an ICU Administrator, we access the unified Clinical Intelligence Command Center, styled with our streamlined light grey interface."
    },
    @{
        File = "act3_grid.wav"
        Text = "Here is the live ICU Early Warning Grid, actively monitoring twelve in-unit telemetry beds. Patients are automatically sorted and stratified into four clinical risk tiers: Critical, High, Monitor, and Low. Clinicians can immediately observe real-time deterioration trajectories and multi-parameter vital sign trends."
    },
    @{
        File = "act4_trajectory.wav"
        Text = "Selecting Record thirteen twenty-five eighty-eight in the Medical ICU opens the deep Patient Risk Detail view. We see a continuous forty-eight hour risk trajectory curve, synchronized multi-channel telemetry streams for Heart Rate, Mean Arterial Pressure, Respiration Rate, and Glasgow Coma Scale, alongside explainable AI feature contribution weights."
    },
    @{
        File = "act5_replay.wav"
        Text = "Next, we enter the Chronological Telemetry Replay Engine. This simulation enforces zero temporal leakage, computing predictive inference strictly using retrospective data available at each timestep. As we simulate time progression, watch the live risk gauge and vital sign curves react dynamically to declining physiological stability."
    },
    @{
        File = "act6_alerts.wav"
        Text = "Moving to the ICU Alert Center and Clinical Action Log, clinicians manage active warnings governed by our persistence and cooldown suppression engines. We can review alert distributions across severity levels, track detection window timelines, and perform one-click clinical acknowledgments with timestamped audit trails."
    },
    @{
        File = "act7_ml_models.wav"
        Text = "In the ML Model Architecture and Benchmark tab, we evaluate our offline models trained on thirty-two hundred ICU records. LightGBM achieves an area under the curve of point eighty-eight, outperforming Random Forest and Baseline Logistic Regression. Notice the Platt-Calibration reliability curve, perfectly tracking the ideal forty-five degree diagnostic line with a Brier score of point zero eighty-two."
    },
    @{
        File = "act8_fatigue.wav"
        Text = "The Alert Analytics and Fatigue Control view demonstrates how our multi-stage suppression filter reduces raw telemetry noise by seventy-four percent, yielding actionable clinical alerts. The lead-time distribution confirms early warning anticipation four to eight hours prior to acute decompensation."
    },
    @{
        File = "act9_quality.wav"
        Text = "Under Telemetry Data Quality, we audit thirty-seven physiological parameters across four ICU types: Medical, Surgical, Cardiac, and Trauma. The system validates missingness ratios, sample density, and sentinel value masking protocols to ensure robust inference without data artifacts."
    },
    @{
        File = "act10_doctor.wav"
        Text = "Finally, we visit the Doctor Portal and Hospital Operational Analytics dashboard. This demonstrates seamless interoperability between machine learning intelligence and daily hospital workflows, including high-risk patient watchlists, inpatient department throughput, and recovery rate trends."
    }
)

foreach ($item in $scripts) {
    $outPath = Join-Path $audioDir $item.File
    $synth.SetOutputToWaveFile($outPath)
    $synth.Speak($item.Text)
    Write-Output "Generated voiceover audio: $($item.File)"
}
$synth.Dispose()
Write-Output "All voiceover tracks generated successfully!"
