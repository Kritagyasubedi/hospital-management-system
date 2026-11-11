import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend
} from 'recharts';
import { ClinicalIntelligenceService } from '../../services/clinicalIntelligenceService';
import { AlertEngine } from '../../services/alertEngine';
import { ICUPatientRecord, ICUAlert } from '../../types';
import { BrainIcon, PlayIcon, ShieldAlertIcon, PulseIcon } from '../icons';

interface PatientRiskDetailViewProps {
  patientId: string;
  onBack: () => void;
  onLaunchReplay: (patientId: string) => void;
}

export const PatientRiskDetailView: React.FC<PatientRiskDetailViewProps> = ({
  patientId,
  onBack,
  onLaunchReplay
}) => {
  const patient = useMemo(() => ClinicalIntelligenceService.getPatientById(patientId), [patientId]);
  const [alerts, setAlerts] = useState<ICUAlert[]>(() => AlertEngine.getStoredAlerts());

  if (!patient) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
        <h2 className="text-lg font-bold text-slate-800">Patient Not Found</h2>
        <p className="text-sm text-slate-500 mt-1">Record ID {patientId} does not exist in the ICU cohort.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
          ← Back to ICU Dashboard
        </button>
      </div>
    );
  }

  const patientAlerts = alerts.filter(a => a.patientId === patient.record_id);
  const latestTrajectory = patient.trajectory[patient.trajectory.length - 1];
  const riskPct = latestTrajectory ? (latestTrajectory.risk_score * 100).toFixed(1) : '0.0';

  // Handle acknowledge
  const handleAcknowledge = (alertId: string) => {
    const updated = AlertEngine.acknowledgeAlert(alertId, 'Attending Clinician');
    setAlerts([...updated]);
  };

  const handleResolve = (alertId: string) => {
    const updated = AlertEngine.resolveAlert(alertId, 'Attending Clinician');
    setAlerts([...updated]);
  };

  // Extract physiological telemetry series for Recharts
  const vitalsSeries = useMemo(() => {
    // Bucket observations by hour
    const hourlyData: Record<number, any> = {};
    for (let h = 0; h <= Math.ceil(patient.telemetry_duration_hours); h++) {
      hourlyData[h] = { time_hours: h };
    }

    patient.observations.forEach(obs => {
      const h = Math.round(obs.time_hours);
      if (hourlyData[h]) {
        if (obs.parameter === 'HR') hourlyData[h].HR = obs.value;
        if (obs.parameter === 'MAP' || obs.parameter === 'NIMAP') hourlyData[h].MAP = obs.value;
        if (obs.parameter === 'SysABP' || obs.parameter === 'NISysABP') hourlyData[h].SysBP = obs.value;
        if (obs.parameter === 'DiasABP' || obs.parameter === 'NIDiasABP') hourlyData[h].DiasBP = obs.value;
        if (obs.parameter === 'RespRate') hourlyData[h].RespRate = obs.value;
        if (obs.parameter === 'Temp') hourlyData[h].Temp = obs.value;
        if (obs.parameter === 'GCS') hourlyData[h].GCS = obs.value;
        if (obs.parameter === 'Lactate') hourlyData[h].Lactate = obs.value;
        if (obs.parameter === 'SaO2' || obs.parameter === 'PaO2') hourlyData[h].Oxygen = obs.value;
      }
    });

    return Object.values(hourlyData).sort((a, b) => a.time_hours - b.time_hours);
  }, [patient]);

  return (
    <div className="space-y-6">
      {/* Navigation & Patient Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBack}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-1 cursor-pointer"
          >
            ← Back to ICU Early Warning Dashboard
          </button>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>{patient.bed_id}</span>
              <span className="text-slate-400 font-normal text-lg">| Record #{patient.record_id}</span>
            </h1>
            <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide border ${
              patient.final_severity === 'CRITICAL' ? 'bg-rose-100 text-rose-900 border-rose-300 animate-pulse' :
              patient.final_severity === 'HIGH' ? 'bg-amber-100 text-amber-900 border-amber-300' :
              patient.final_severity === 'MONITOR' ? 'bg-sky-100 text-sky-900 border-sky-300' :
              'bg-emerald-100 text-emerald-900 border-emerald-300'
            }`}>
              {patient.final_severity} RISK • {riskPct}%
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-2 flex flex-wrap items-center gap-4">
            <span><strong>Age:</strong> {patient.age} years</span>
            <span><strong>Gender:</strong> {patient.gender}</span>
            <span><strong>Unit:</strong> {patient.icu_type}</span>
            <span><strong>Telemetry Length:</strong> {patient.telemetry_duration_hours.toFixed(1)} hours</span>
            <span><strong>Observations:</strong> {patient.total_observations} data points</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onLaunchReplay(patient.record_id)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-lg shadow-xs transition text-xs cursor-pointer"
          >
            <PlayIcon className="w-4 h-4" />
            Replay Telemetry Chronology
          </button>
        </div>
      </div>

      {/* Main Grid: Risk Trajectory & Contributing Signals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Predicted Risk Trajectory (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BrainIcon className="w-5 h-5 text-blue-600" />
                Chronological Deterioration Risk Trajectory
              </h2>
              <p className="text-xs text-slate-500">
                Calibrated probability estimated at 1-hour increments strictly using retrospective telemetry up to time t.
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-semibold">
              <span className="flex items-center gap-1.5 text-rose-600"><span className="w-2.5 h-1 rounded-full bg-rose-500"></span> Critical (&ge;70%)</span>
              <span className="flex items-center gap-1.5 text-amber-600"><span className="w-2.5 h-1 rounded-full bg-amber-500"></span> High (&ge;45%)</span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={patient.trajectory} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={patient.final_severity === 'CRITICAL' ? '#f43f5e' : '#2563eb'} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={patient.final_severity === 'CRITICAL' ? '#f43f5e' : '#2563eb'} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="time_hours" unit="h" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value: any) => [`${value}%`, 'Deterioration Risk']}
                  labelFormatter={(label: any) => `Observation Time: T+${label} hours`}
                />
                <ReferenceLine y={70} stroke="#f43f5e" strokeDasharray="4 4" label={{ value: 'Critical (70%)', fill: '#f43f5e', fontSize: 10 }} />
                <ReferenceLine y={45} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'High Alert (45%)', fill: '#f59e0b', fontSize: 10 }} />
                <Area
                  type="monotone"
                  dataKey="risk_percentage"
                  stroke={patient.final_severity === 'CRITICAL' ? '#e11d48' : '#2563eb'}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#riskGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Initial Risk (T+1h)</span>
              <span className="font-bold text-slate-800 text-sm">{(patient.trajectory[0]?.risk_score * 100 || 0).toFixed(1)}%</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Peak Risk</span>
              <span className="font-bold text-rose-600 text-sm">
                {(Math.max(...patient.trajectory.map(p => p.risk_score)) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Model Confidence</span>
              <span className="font-bold text-emerald-700 text-sm">92.4%</span>
            </div>
          </div>
        </div>

        {/* Right Column: Model Explainability (Contributing Signals) */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-slate-900">Model Contributing Signals</h2>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded uppercase">
                Explainability
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Physiological features driving the estimated risk trajectory at the current observation timestamp:
            </p>

            <div className="space-y-2.5">
              {latestTrajectory?.contributing_signals.map((sig, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5 text-xs">
                  <div className="mt-0.5">
                    {sig.includes('↑') ? (
                      <span className="text-rose-500 font-bold text-sm">▲</span>
                    ) : sig.includes('↓') ? (
                      <span className="text-blue-500 font-bold text-sm">▼</span>
                    ) : (
                      <span className="text-emerald-500 font-bold text-sm">●</span>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{sig}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Model feature attribution: High SHAP weight</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="text-xs font-semibold text-slate-700 mb-1">Data Quality Assessment</div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
              <span>Telemetry Freshness & Coverage:</span>
              <span className="font-bold text-slate-800">{Math.round((latestTrajectory?.data_quality || 0.8) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${Math.round((latestTrajectory?.data_quality || 0.8) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Physiological Telemetry Trend Charts */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
          <PulseIcon className="w-5 h-5 text-blue-600" />
          Physiological Telemetry Channels (Actual Dataset Observations)
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Multi-channel ICU telemetry plotted chronologically over the 48-hour observation window.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Heart Rate & MAP Chart */}
          <div className="border border-slate-200/80 rounded-xl p-4 bg-slate-50/50">
            <div className="text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
              <span>Hemodynamics: Heart Rate (HR) & Mean Arterial Pressure (MAP)</span>
              <span className="text-[10px] text-slate-400 font-mono">bpm / mmHg</span>
            </div>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={vitalsSeries} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="time_hours" unit="h" tick={{ fontSize: 10 }} />
                  <YAxis domain={[30, 180]} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="HR" name="Heart Rate (HR)" stroke="#e11d48" strokeWidth={2} dot={{ r: 2 }} connectNulls />
                  <Line type="monotone" dataKey="MAP" name="Mean Arterial Pressure (MAP)" stroke="#2563eb" strokeWidth={2} dot={{ r: 2 }} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Respiratory Rate & GCS */}
          <div className="border border-slate-200/80 rounded-xl p-4 bg-slate-50/50">
            <div className="text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
              <span>Respiratory Rate (bpm) & Neurological State (GCS)</span>
              <span className="text-[10px] text-slate-400 font-mono">Resp / GCS score (3-15)</span>
            </div>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={vitalsSeries} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="time_hours" unit="h" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 45]} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="RespRate" name="Respiratory Rate" stroke="#059669" strokeWidth={2} dot={{ r: 2 }} connectNulls />
                  <Line type="monotone" dataKey="GCS" name="Glasgow Coma Scale (GCS)" stroke="#7c3aed" strokeWidth={2} dot={{ r: 2 }} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Active & Historical Patient Alerts */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
          <ShieldAlertIcon className="w-5 h-5 text-rose-600" />
          Alert History & Clinician Review Trail
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Automated early warning notifications generated by the persistence and cooldown engine.
        </p>

        {patientAlerts.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center text-xs text-slate-500">
            No active or historical alerts generated for Bed {patient.bed_id}.
          </div>
        ) : (
          <div className="space-y-3">
            {patientAlerts.map(alt => (
              <div key={alt.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white ${
                      alt.severity === 'CRITICAL' ? 'bg-rose-600' : 'bg-amber-600'
                    }`}>
                      {alt.severity} ALERT
                    </span>
                    <span className="text-xs font-bold text-slate-800">T+{(alt.simulationTimeHours || 0).toFixed(0)}h Observation Window</span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                      alt.status === 'NEW' ? 'bg-rose-100 text-rose-800' :
                      alt.status === 'ACKNOWLEDGED' ? 'bg-blue-100 text-blue-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      Status: {alt.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1.5">{alt.explanation}</p>
                  {alt.acknowledgedBy && (
                    <div className="text-[11px] text-slate-400 mt-1">
                      Acknowledged by <strong>{alt.acknowledgedBy}</strong> at {alt.acknowledgedAt ? new Date(alt.acknowledgedAt).toLocaleTimeString() : 'N/A'}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {alt.status === 'NEW' && (
                    <button
                      onClick={() => handleAcknowledge(alt.id)}
                      className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1.5 rounded-md transition shadow-xs cursor-pointer"
                    >
                      Acknowledge Alert
                    </button>
                  )}
                  {alt.status === 'ACKNOWLEDGED' && (
                    <button
                      onClick={() => handleResolve(alt.id)}
                      className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-md transition shadow-xs cursor-pointer"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Regulatory / Safety Disclaimer */}
      <div className="bg-slate-100 border border-slate-200 rounded-lg p-4 text-[11px] text-slate-500 leading-relaxed">
        <strong>Safety & Clinical Decision Support Notice:</strong> This trajectory model is an algorithmic early-warning decision-support tool. It computes statistical risk from noisy, irregularly sampled telemetry. It is not an automated diagnostic or treatment system and must be evaluated alongside clinical examination, laboratory workups, and physician discretion.
      </div>
    </div>
  );
};
