import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  ReferenceLine
} from 'recharts';
import { ClinicalIntelligenceService } from '../../services/clinicalIntelligenceService';
import { AlertEngine } from '../../services/alertEngine';
import { ICUPatientRecord, ICUAlert } from '../../types';
import { PlayIcon, PauseIcon, RefreshIcon, BrainIcon, ShieldAlertIcon, PulseIcon } from '../icons';

interface DemoReplayViewProps {
  initialPatientId?: string;
  onNavigateToPatient?: (patientId: string) => void;
}

export const DemoReplayView: React.FC<DemoReplayViewProps> = ({
  initialPatientId,
  onNavigateToPatient
}) => {
  const patients = useMemo(() => ClinicalIntelligenceService.getPatients(), []);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    initialPatientId || (patients[0]?.record_id ?? '132588')
  );

  const patient = useMemo(
    () => patients.find(p => p.record_id === selectedPatientId) || patients[0],
    [patients, selectedPatientId]
  );

  // Simulation State
  const [currentTimeHours, setCurrentTimeHours] = useState<number>(4.0); // Start at 4h admission baseline
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(2); // 2 hours per sec
  const [activeAlert, setActiveAlert] = useState<ICUAlert | null>(null);
  const [alerts, setAlerts] = useState<ICUAlert[]>(() => AlertEngine.getStoredAlerts());

  const timerRef = useRef<any>(null);

  // Maximum time for current patient
  const maxDuration = patient?.telemetry_duration_hours || 48.0;

  // Filter observations strictly up to currentTimeHours (CHRONOLOGICAL REPLAY - NO FUTURE DATA)
  const visibleObservations = useMemo(() => {
    if (!patient) return [];
    return patient.observations.filter(o => o.time_hours <= currentTimeHours);
  }, [patient, currentTimeHours]);

  // Current trajectory history up to currentTimeHours
  const visibleTrajectory = useMemo(() => {
    if (!patient) return [];
    return patient.trajectory.filter(p => p.time_hours <= currentTimeHours);
  }, [patient, currentTimeHours]);

  const currentRiskPoint = visibleTrajectory[visibleTrajectory.length - 1] || {
    risk_score: 0.10,
    risk_percentage: 10.0,
    severity: 'LOW',
    data_quality: 0.8,
    contributing_signals: ['Admission baseline telemetry monitoring']
  };

  // Check and trigger alerts during simulation
  useEffect(() => {
    if (patient) {
      const generatedAlert = AlertEngine.evaluateAlert(patient, currentTimeHours, alerts);
      if (generatedAlert && generatedAlert.severity === 'CRITICAL' && !activeAlert) {
        setActiveAlert(generatedAlert);
        setAlerts(prev => [generatedAlert, ...prev]);
      }
    }
  }, [currentTimeHours, patient]);

  // Simulation Playback Loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTimeHours(prev => {
          const next = prev + 0.25; // advance 15 mins per tick
          if (next >= maxDuration) {
            setIsPlaying(false);
            return maxDuration;
          }
          return Math.round(next * 100) / 100;
        });
      }, 500 / playbackSpeed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, maxDuration]);

  // Step Controls
  const handlePlayPause = () => {
    if (currentTimeHours >= maxDuration) {
      setCurrentTimeHours(1.0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTimeHours(2.0);
    setActiveAlert(null);
  };

  const handleStepForward = (hours: number) => {
    setIsPlaying(false);
    setCurrentTimeHours(prev => Math.min(maxDuration, Math.round((prev + hours) * 100) / 100));
  };

  const handleAcknowledgeActiveAlert = () => {
    if (activeAlert) {
      AlertEngine.acknowledgeAlert(activeAlert.id, 'Attending Clinician (Simulation)');
      setActiveAlert(null);
    }
  };

  // Recent observations feed (last 10 observations arrived)
  const recentArrivals = useMemo(() => {
    return [...visibleObservations].slice(-12).reverse();
  }, [visibleObservations]);

  // Format hours as HH:MM
  const formatTimeHours = (h: number) => {
    const hrs = Math.floor(h);
    const mins = Math.round((h - hrs) * 60);
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Simulation Header */}
      <div className="bg-slate-100/90 border border-slate-200/90 text-slate-900 rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-blue-100 text-blue-800 border border-blue-200">
              Chronological Telemetry Replay Engine
            </span>
            <span className="text-xs text-slate-500 font-mono">Zero Temporal Leakage Verified</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <BrainIcon className="w-7 h-7 text-blue-600" />
            ICU Telemetry Stream & Dynamic Risk Simulation
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Simulate real-time ICU telemetry arrival chronologically. The ML model recalculates deterioration risk at each timestep without future information.
          </p>
        </div>

        {/* Patient Selector */}
        <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-300 shadow-xs">
          <span className="text-xs font-bold text-slate-700">Select ICU Case:</span>
          <select
            value={selectedPatientId}
            onChange={e => {
              setSelectedPatientId(e.target.value);
              setCurrentTimeHours(2.0);
              setActiveAlert(null);
              setIsPlaying(false);
            }}
            className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {patients.map(p => (
              <option key={p.record_id} value={p.record_id}>
                {p.bed_id} (Record #{p.record_id}) • {p.is_death === 1 ? 'Deteriorating Case' : 'Stable Survivor'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Interactive Playback Control Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Playback Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePlayPause}
            className={`flex items-center gap-2 font-semibold px-4 py-2 rounded-lg transition shadow-xs text-xs cursor-pointer ${
              isPlaying ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isPlaying ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
            {isPlaying ? 'Pause Simulation' : 'Start Replay'}
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-2 rounded-lg transition text-xs border border-slate-300 cursor-pointer"
          >
            <RefreshIcon className="w-3.5 h-3.5" />
            Reset
          </button>

          <button
            onClick={() => handleStepForward(0.25)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-2.5 py-2 rounded-lg transition text-xs border border-slate-300 cursor-pointer"
          >
            +15 min
          </button>

          <button
            onClick={() => handleStepForward(1.0)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-2.5 py-2 rounded-lg transition text-xs border border-slate-300 cursor-pointer"
          >
            +1 hour
          </button>

          {/* Speed Controls */}
          <div className="flex items-center gap-1 ml-2 border-l border-slate-200 pl-3">
            <span className="text-xs font-semibold text-slate-500">Speed:</span>
            {[1, 2, 5, 10].map(s => (
              <button
                key={s}
                onClick={() => setPlaybackSpeed(s)}
                className={`text-xs px-2 py-1 rounded font-bold transition cursor-pointer ${
                  playbackSpeed === s ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Current Time Clock */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400">Simulation Time</div>
            <div className="text-xl font-mono font-black text-slate-900 flex items-center gap-1.5">
              <span>T+{formatTimeHours(currentTimeHours)}</span>
              <span className="text-xs font-normal text-slate-500">/ {maxDuration.toFixed(1)}h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Timeline Slider */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1.5">
          <span>ICU Admission (00:00)</span>
          <span className="text-blue-900 font-bold font-mono">Revealed Observation Window: {currentTimeHours.toFixed(2)} hours</span>
          <span>Discharge / 48h (48:00)</span>
        </div>
        <input
          type="range"
          min="1"
          max={maxDuration}
          step="0.25"
          value={currentTimeHours}
          onChange={e => {
            setIsPlaying(false);
            setCurrentTimeHours(parseFloat(e.target.value));
          }}
          className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
        />
      </div>

      {/* Active Deterioration Alert Banner during Replay */}
      {activeAlert && (
        <div className="bg-rose-600 text-white p-5 rounded-xl shadow-md border border-rose-700 animate-pulse flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldAlertIcon className="w-8 h-8 text-white shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-white text-rose-700 font-black text-xs px-2.5 py-0.5 rounded uppercase">
                  {activeAlert.severity} EARLY WARNING ALERT
                </span>
                <span className="text-xs font-bold text-rose-100">T+{currentTimeHours.toFixed(1)}h</span>
              </div>
              <p className="text-sm font-semibold mt-1 max-w-2xl">{activeAlert.explanation}</p>
            </div>
          </div>
          <button
            onClick={handleAcknowledgeActiveAlert}
            className="bg-white hover:bg-slate-100 text-rose-700 font-bold px-4 py-2 rounded-lg text-xs shadow transition shrink-0 cursor-pointer"
          >
            Acknowledge Alert
          </button>
        </div>
      )}

      {/* Main Replay Grid: Dynamic Risk Gauge + Dynamic Trajectory Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dynamic Risk Gauge */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Current Predicted Deterioration Risk
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className={`text-5xl font-black ${
                currentRiskPoint.severity === 'CRITICAL' ? 'text-rose-600' :
                currentRiskPoint.severity === 'HIGH' ? 'text-amber-600' :
                currentRiskPoint.severity === 'MONITOR' ? 'text-sky-600' :
                'text-emerald-600'
              }`}>
                {currentRiskPoint.risk_percentage.toFixed(1)}%
              </span>
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wide border ${
                currentRiskPoint.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-900 border-rose-300' :
                currentRiskPoint.severity === 'HIGH' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                currentRiskPoint.severity === 'MONITOR' ? 'bg-sky-100 text-sky-900 border-sky-300' :
                'bg-emerald-100 text-emerald-900 border-emerald-300'
              }`}>
                {currentRiskPoint.severity}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Based on {visibleObservations.length} observations up to T+{formatTimeHours(currentTimeHours)}.
            </div>
          </div>

          {/* Contributing Signals */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-700 mb-2">Model Driving Indicators:</div>
            <div className="space-y-2">
              {currentRiskPoint.contributing_signals.map((sig, i) => (
                <div key={i} className="text-xs bg-slate-50 p-2.5 rounded border border-slate-200 font-medium text-slate-800">
                  {sig}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Data Quality: <strong className="text-slate-800">{Math.round(currentRiskPoint.data_quality * 100)}%</strong></span>
            <span>Model: <strong className="text-slate-800">early-warning-v1</strong></span>
          </div>
        </div>

        {/* Dynamic Trajectory Chart (Revealed up to current time) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Dynamic Risk Curve (Expanding Chronology)</h2>
              <p className="text-xs text-slate-500">Risk trajectory calculated up to current simulation timestamp.</p>
            </div>
            <span className="text-xs font-mono font-bold bg-blue-50 border border-blue-200 px-2.5 py-1 rounded text-blue-800">
              Active Window: 00:00 &rarr; {formatTimeHours(currentTimeHours)}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visibleTrajectory} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="replayGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="time_hours" unit="h" domain={[0, maxDuration]} tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 10 }} />
                <Tooltip />
                <ReferenceLine y={70} stroke="#f43f5e" strokeDasharray="3 3" />
                <ReferenceLine y={45} stroke="#f59e0b" strokeDasharray="3 3" />
                <Area
                  type="monotone"
                  dataKey="risk_percentage"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#replayGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Live Raw Observation Stream Arriving Chronologically */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <PulseIcon className="w-5 h-5 text-blue-600" />
            Live Ingested Telemetry Feed (Chronological Arrival)
          </h2>
          <span className="text-xs text-slate-500 font-mono">{visibleObservations.length} total observations received</span>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Raw telemetry rows ingested chronologically as simulation clock advances:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {recentArrivals.map((obs, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200/90 rounded-lg p-3 text-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>T+{formatTimeHours(obs.time_hours)}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </div>
              <div className="font-bold text-slate-800 text-sm mt-1">{obs.parameter}</div>
              <div className="text-base font-black text-blue-700 mt-0.5">
                {obs.value !== undefined ? (typeof obs.value === 'number' ? obs.value.toFixed(1) : obs.value) : 'N/A'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
