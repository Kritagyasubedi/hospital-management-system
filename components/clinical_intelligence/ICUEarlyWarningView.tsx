import React, { useState, useMemo } from 'react';
import { ClinicalIntelligenceService } from '../../services/clinicalIntelligenceService';
import { AlertEngine } from '../../services/alertEngine';
import { ICUPatientRecord, ICUAlert } from '../../types';
import { PulseIcon, ShieldAlertIcon, BrainIcon, PlayIcon } from '../icons';

interface ICUEarlyWarningViewProps {
  onSelectPatient: (patientId: string) => void;
  onLaunchReplay: (patientId?: string) => void;
  onNavigateTab?: (viewId: string) => void;
}

export const ICUEarlyWarningView: React.FC<ICUEarlyWarningViewProps> = ({
  onSelectPatient,
  onLaunchReplay,
  onNavigateTab
}) => {
  const [patients] = useState<ICUPatientRecord[]>(() => ClinicalIntelligenceService.getPatients());
  const [alerts, setAlerts] = useState<ICUAlert[]>(() => AlertEngine.getStoredAlerts());
  const [selectedUnit, setSelectedUnit] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'risk' | 'bed' | 'trend' | 'quality'>('risk');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle alert acknowledge
  const handleAcknowledgeAlert = (alertId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = AlertEngine.acknowledgeAlert(alertId, 'Clinical Staff');
    setAlerts([...updated]);
  };

  // Metrics calculation
  const metrics = useMemo(() => {
    const total = patients.length;
    const critical = patients.filter(p => p.final_severity === 'CRITICAL').length;
    const high = patients.filter(p => p.final_severity === 'HIGH').length;
    const monitor = patients.filter(p => p.final_severity === 'MONITOR').length;
    const low = patients.filter(p => p.final_severity === 'LOW').length;
    const activeUnackAlerts = alerts.filter(a => a.status === 'NEW').length;
    const avgDataQuality = Math.round((patients.reduce((acc, p) => acc + (p.trajectory[p.trajectory.length - 1]?.data_quality || 0.8), 0) / (total || 1)) * 100);

    return { total, critical, high, monitor, low, activeUnackAlerts, avgDataQuality };
  }, [patients, alerts]);

  // Filter and sort patients
  const filteredPatients = useMemo(() => {
    return patients
      .filter(p => {
        if (selectedUnit !== 'ALL' && !p.icu_type.includes(selectedUnit)) return false;
        if (severityFilter !== 'ALL' && p.final_severity !== severityFilter) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          return p.record_id.includes(q) || p.bed_id.toLowerCase().includes(q) || p.icu_type.toLowerCase().includes(q);
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'risk') return b.final_risk_score - a.final_risk_score;
        if (sortBy === 'bed') return a.bed_id.localeCompare(b.bed_id);
        if (sortBy === 'quality') {
          const qA = a.trajectory[a.trajectory.length - 1]?.data_quality || 0;
          const qB = b.trajectory[b.trajectory.length - 1]?.data_quality || 0;
          return qB - qA;
        }
        return 0;
      });
  }, [patients, selectedUnit, severityFilter, sortBy, searchQuery]);

  const activeNewAlerts = alerts.filter(a => a.status === 'NEW').slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Top Banner / Disclaimer */}
      <div className="bg-slate-100/90 border border-slate-200/90 text-slate-900 rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-blue-100 text-blue-800 border border-blue-200">
              Calibrated ML Inference v1.0
            </span>
            <span className="text-xs text-slate-500 font-mono">Dataset 2 • 3,200 ICU Cohort</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <BrainIcon className="w-7 h-7 text-blue-600" />
            ICU Clinical Intelligence & Early Deterioration Warning
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mt-1 leading-relaxed">
            Continuous physiological telemetry interpretation estimating patient deterioration trajectory before acute decompensation. Powered by chronological gradient-boosted decision trees.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onLaunchReplay()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-lg shadow-sm transition text-sm cursor-pointer"
          >
            <PlayIcon className="w-4 h-4" />
            Launch Chronological Replay
          </button>
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('ci_model_performance')}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium px-4 py-2.5 rounded-lg transition text-sm shadow-xs cursor-pointer"
            >
              Model Metrics
            </button>
          )}
        </div>
      </div>

      {/* Safety Notice Badge */}
      <div className="bg-blue-50/80 border border-blue-200/80 p-3.5 rounded-xl text-xs text-blue-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 animate-ping"></span>
          <span>
            <strong className="font-semibold text-blue-900">Clinical Decision Support Prototype:</strong> Estimates predicted deterioration probability from retrospective ICU observations. Does not replace clinical evaluation or provide autonomous diagnostic decisions.
          </span>
        </span>
        <span className="font-semibold text-blue-700 bg-blue-100/80 px-2.5 py-1 rounded-md text-[11px] self-start sm:self-auto">
          Platt-Calibrated Probabilities
        </span>
      </div>

      {/* Critical Active Alert Bar if any */}
      {activeNewAlerts.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
              <ShieldAlertIcon className="w-5 h-5 text-rose-600 animate-pulse" />
              <span>Unacknowledged ICU Deterioration Alerts ({activeNewAlerts.length})</span>
            </div>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('ci_alerts')}
                className="text-xs text-rose-700 font-semibold hover:underline"
              >
                View All Alerts & Audit Log →
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {activeNewAlerts.map(alt => (
              <div key={alt.id} className="bg-white border border-rose-200 rounded-lg p-3.5 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{alt.bedId} (Record #{alt.patientId})</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-600 text-white uppercase tracking-wider">
                      {alt.severity} {(alt.riskScore * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">{alt.explanation}</p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">T+{alt.simulationTimeHours?.toFixed(0)}h</span>
                  <button
                    onClick={(e) => handleAcknowledgeAlert(alt.id, e)}
                    className="text-xs bg-rose-600 hover:bg-rose-700 text-white font-medium px-3 py-1 rounded-md transition shadow-xs cursor-pointer"
                  >
                    Acknowledge
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total In-Unit</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{metrics.total}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Active ICU telemetry</div>
        </div>

        <div className="bg-rose-50/50 border border-rose-200/80 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-rose-700 uppercase tracking-wider">Critical Risk</div>
          <div className="text-2xl font-black text-rose-600 mt-1">{metrics.critical}</div>
          <div className="text-[11px] text-rose-600/80 font-medium mt-0.5">Risk &ge; 70% (Immediate)</div>
        </div>

        <div className="bg-amber-50/50 border border-amber-200/80 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-amber-800 uppercase tracking-wider">High Risk</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{metrics.high}</div>
          <div className="text-[11px] text-amber-700/80 font-medium mt-0.5">Risk 45% - 69%</div>
        </div>

        <div className="bg-sky-50/50 border border-sky-200/80 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-sky-800 uppercase tracking-wider">Monitor State</div>
          <div className="text-2xl font-black text-sky-600 mt-1">{metrics.monitor}</div>
          <div className="text-[11px] text-sky-700/80 font-medium mt-0.5">Risk 25% - 44%</div>
        </div>

        <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Low Risk / Stable</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{metrics.low}</div>
          <div className="text-[11px] text-emerald-700/80 font-medium mt-0.5">Risk &lt; 25%</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Data Quality</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{metrics.avgDataQuality}%</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Telemetry Healthy</div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Unit Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500">Unit:</span>
            <select
              value={selectedUnit}
              onChange={e => setSelectedUnit(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All ICU Units</option>
              <option value="MICU">Medical ICU (MICU)</option>
              <option value="SICU">Surgical ICU (SICU)</option>
              <option value="CCU">Coronary Care (CCU)</option>
              <option value="CSRU">Cardiac Recovery (CSRU)</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500">Risk Tier:</span>
            <select
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Risk States</option>
              <option value="CRITICAL">Critical (&ge;70%)</option>
              <option value="HIGH">High (45-69%)</option>
              <option value="MONITOR">Monitor (25-44%)</option>
              <option value="LOW">Low (&lt;25%)</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500">Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="risk">Highest Risk First</option>
              <option value="bed">Bed Number</option>
              <option value="quality">Data Quality</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search by Bed ID or Record #..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Main Patient List Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Bed & Record ID</th>
                <th className="py-3.5 px-4">Demographics</th>
                <th className="py-3.5 px-4">ICU Unit</th>
                <th className="py-3.5 px-4">Deterioration Risk</th>
                <th className="py-3.5 px-4">Trajectory Trend</th>
                <th className="py-3.5 px-4">Data Quality</th>
                <th className="py-3.5 px-4">Telemetry Duration</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.map(pt => {
                const latestPt = pt.trajectory[pt.trajectory.length - 1];
                const riskPct = latestPt ? (latestPt.risk_score * 100).toFixed(1) : '0.0';
                const qualityPct = latestPt ? Math.round(latestPt.data_quality * 100) : 80;
                
                // Severity styling
                let badgeClass = 'bg-emerald-100 text-emerald-900 border-emerald-300';
                if (pt.final_severity === 'CRITICAL') badgeClass = 'bg-rose-100 text-rose-900 border-rose-300 font-bold animate-pulse';
                else if (pt.final_severity === 'HIGH') badgeClass = 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
                else if (pt.final_severity === 'MONITOR') badgeClass = 'bg-sky-100 text-sky-900 border-sky-300 font-bold';

                // Trend direction
                const firstPt = pt.trajectory[0];
                const deltaRisk = latestPt && firstPt ? latestPt.risk_score - firstPt.risk_score : 0;
                let trendBadge = <span className="text-slate-500 font-medium">→ Stable</span>;
                if (deltaRisk > 0.15) {
                  trendBadge = <span className="text-rose-600 font-semibold flex items-center gap-1">↑ Escalating (+{(deltaRisk * 100).toFixed(0)}%)</span>;
                } else if (deltaRisk < -0.10) {
                  trendBadge = <span className="text-emerald-600 font-semibold flex items-center gap-1">↓ Improving</span>;
                }

                return (
                  <tr
                    key={pt.record_id}
                    onClick={() => onSelectPatient(pt.record_id)}
                    className="hover:bg-slate-50/80 cursor-pointer transition"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{pt.bed_id}</div>
                      <div className="text-[11px] text-slate-400 font-mono">Record #{pt.record_id}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{pt.age} yrs • {pt.gender}</div>
                      <div className="text-[11px] text-slate-400">{pt.total_observations} observations</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-700">{pt.icu_type}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold border uppercase tracking-wider ${badgeClass}`}>
                          {pt.final_severity} {riskPct}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium">
                      {trendBadge}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${qualityPct >= 75 ? 'bg-emerald-500' : (qualityPct >= 50 ? 'bg-amber-500' : 'bg-rose-500')}`}
                            style={{ width: `${qualityPct}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono font-semibold text-slate-700">{qualityPct}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-600">
                      {pt.telemetry_duration_hours.toFixed(1)} hrs
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onLaunchReplay(pt.record_id);
                          }}
                          className="flex items-center gap-1 text-[11px] bg-white hover:bg-slate-100 text-slate-700 font-semibold border border-slate-300 px-2.5 py-1 rounded-md transition shadow-2xs"
                        >
                          <PlayIcon className="w-3 h-3 text-blue-600" />
                          Replay
                        </button>
                        <button
                          onClick={() => onSelectPatient(pt.record_id)}
                          className="text-[11px] bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1 rounded-md transition shadow-2xs"
                        >
                          View Trajectory →
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
