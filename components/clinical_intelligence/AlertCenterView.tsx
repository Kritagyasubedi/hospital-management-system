import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';
import { AlertEngine } from '../../services/alertEngine';
import { ICUAlert, ICUAuditLog, ICUAlertStatus } from '../../types';
import { ShieldAlertIcon, PulseIcon, BrainIcon } from '../icons';

export const AlertCenterView: React.FC = () => {
  const [alerts, setAlerts] = useState<ICUAlert[]>(() => AlertEngine.getStoredAlerts());
  const [auditLogs, setAuditLogs] = useState<ICUAuditLog[]>(() => AlertEngine.getAuditLogs());
  const [activeTab, setActiveTab] = useState<'ALL' | 'NEW' | 'ACKNOWLEDGED' | 'RESOLVED'>('ALL');
  const [activeSection, setActiveSection] = useState<'ALERTS' | 'AUDIT'>('ALERTS');

  const handleAcknowledge = (id: string) => {
    const updated = AlertEngine.acknowledgeAlert(id, 'Dr. Evelyn Reed (Attending)');
    setAlerts([...updated]);
    setAuditLogs(AlertEngine.getAuditLogs());
  };

  const handleResolve = (id: string) => {
    const updated = AlertEngine.resolveAlert(id, 'Dr. Evelyn Reed (Attending)');
    setAlerts([...updated]);
    setAuditLogs(AlertEngine.getAuditLogs());
  };

  const newCount = alerts.filter(a => a.status === 'NEW').length;
  const ackCount = alerts.filter(a => a.status === 'ACKNOWLEDGED').length;
  const resCount = alerts.filter(a => a.status === 'RESOLVED').length;
  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL').length;
  const highCount = alerts.filter(a => a.severity === 'HIGH').length;

  const filteredAlerts = useMemo(() => {
    return alerts.filter(a => {
      if (activeTab === 'ALL') return true;
      return a.status === activeTab;
    });
  }, [alerts, activeTab]);

  // Chart 1: Alerts by Severity & Status
  const alertDistributionData = useMemo(() => {
    return [
      { name: 'Critical Alerts', New: alerts.filter(a => a.severity === 'CRITICAL' && a.status === 'NEW').length, Acknowledged: alerts.filter(a => a.severity === 'CRITICAL' && a.status === 'ACKNOWLEDGED').length, Resolved: alerts.filter(a => a.severity === 'CRITICAL' && a.status === 'RESOLVED').length },
      { name: 'High Risk Alerts', New: alerts.filter(a => a.severity === 'HIGH' && a.status === 'NEW').length, Acknowledged: alerts.filter(a => a.severity === 'HIGH' && a.status === 'ACKNOWLEDGED').length, Resolved: alerts.filter(a => a.severity === 'HIGH' && a.status === 'RESOLVED').length }
    ];
  }, [alerts]);

  // Chart 2: Alert Timeline Distribution (Admission hours: 0-12h, 12-24h, 24-36h, 36-48h)
  const timelineData = useMemo(() => {
    const buckets: Record<string, { interval: string; Critical: number; High: number }> = {
      '0-12h': { interval: '0 - 12h', Critical: 0, High: 0 },
      '12-24h': { interval: '12 - 24h', Critical: 0, High: 0 },
      '24-36h': { interval: '24 - 36h', Critical: 0, High: 0 },
      '36-48h': { interval: '36 - 48h', Critical: 0, High: 0 },
    };

    alerts.forEach(a => {
      const h = a.simulationTimeHours || 24;
      let b = '0-12h';
      if (h > 36) b = '36-48h';
      else if (h > 24) b = '24-36h';
      else if (h > 12) b = '12-24h';

      if (a.severity === 'CRITICAL') buckets[b].Critical++;
      else buckets[b].High++;
    });

    return Object.values(buckets);
  }, [alerts]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-rose-500/10 text-rose-700 border border-rose-200">
              Live Clinician Command
            </span>
            <span className="text-xs text-slate-400 font-mono">4-Hour Cooldown Suppression Active</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <ShieldAlertIcon className="w-7 h-7 text-rose-600" />
            ICU Alert Center & Clinical Action Log
          </h1>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            Review, acknowledge, and resolve active deterioration early warnings. Governed by persistence, confidence, and cooldown engines to minimize alarm fatigue.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-lg border border-slate-200">
          <button
            onClick={() => setActiveSection('ALERTS')}
            className={`text-xs font-semibold px-3.5 py-1.5 rounded-md transition cursor-pointer ${
              activeSection === 'ALERTS' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Alert Queue ({alerts.length})
          </button>
          <button
            onClick={() => setActiveSection('AUDIT')}
            className={`text-xs font-semibold px-3.5 py-1.5 rounded-md transition cursor-pointer ${
              activeSection === 'AUDIT' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Audit Trail ({auditLogs.length})
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Alerts</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{alerts.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">ICU Surveillance</div>
        </div>

        <div className="bg-rose-50/50 border border-rose-200/80 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-rose-700 uppercase tracking-wider">New (Unreviewed)</div>
          <div className="text-2xl font-black text-rose-600 mt-1">{newCount}</div>
          <div className="text-[11px] text-rose-600/80 font-medium mt-0.5">Require Clinical Action</div>
        </div>

        <div className="bg-amber-50/50 border border-amber-200/80 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Critical Severity</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{criticalCount}</div>
          <div className="text-[11px] text-amber-700/80 font-medium mt-0.5">Risk &ge; 70% Trajectory</div>
        </div>

        <div className="bg-sky-50/50 border border-sky-200/80 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-sky-800 uppercase tracking-wider">Acknowledged</div>
          <div className="text-2xl font-black text-sky-600 mt-1">{ackCount}</div>
          <div className="text-[11px] text-sky-700/80 font-medium mt-0.5">Intervention in progress</div>
        </div>

        <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Resolved</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{resCount}</div>
          <div className="text-[11px] text-emerald-700/80 font-medium mt-0.5">Stabilized Cases</div>
        </div>
      </div>

      {activeSection === 'ALERTS' && (
        <>
          {/* Charts Row: Alert Breakdown & Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chart 1: Alerts by Severity & State */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Alert Distribution by Severity & Workflow Status
              </h2>
              <div className="h-48 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={alertDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="New" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Acknowledged" fill="#0284c7" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Resolved" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Admission Timeline Alert Frequency */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Deterioration Detection Window Frequency (Admission Hours)
              </h2>
              <div className="h-48 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="interval" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line type="monotone" dataKey="Critical" stroke="#e11d48" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="High" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            {(['ALL', 'NEW', 'ACKNOWLEDGED', 'RESOLVED'] as const).map(tab => {
              const count = tab === 'ALL' ? alerts.length : tab === 'NEW' ? newCount : tab === 'ACKNOWLEDGED' ? ackCount : resCount;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{tab === 'ALL' ? 'All Alerts' : tab}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    activeTab === tab ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Alerts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAlerts.length === 0 ? (
              <div className="col-span-2 bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-400">
                No alerts found matching filter criteria.
              </div>
            ) : (
              filteredAlerts.map(alt => (
                <div
                  key={alt.id}
                  className={`bg-white border rounded-xl p-5 shadow-xs flex flex-col justify-between ${
                    alt.status === 'NEW' ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-base">{alt.bedId}</span>
                        <span className="text-xs text-slate-400 font-mono">Record #{alt.patientId}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                        alt.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {alt.severity} • {(alt.riskScore * 100).toFixed(0)}%
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 mt-2 font-medium leading-relaxed">{alt.explanation}</p>

                    <div className="mt-3 bg-slate-50 p-2.5 rounded-lg text-[11px] text-slate-600 space-y-1 border border-slate-100">
                      <div><strong>Generated:</strong> T+{(alt.simulationTimeHours || 0).toFixed(0)}h of admission</div>
                      <div><strong>Status:</strong> <span className="font-semibold text-slate-900">{alt.status}</span></div>
                      {alt.acknowledgedBy && (
                        <div><strong>Acknowledged:</strong> {alt.acknowledgedBy} at {new Date(alt.acknowledgedAt!).toLocaleTimeString()}</div>
                      )}
                      {alt.resolvedBy && (
                        <div><strong>Resolved:</strong> {alt.resolvedBy} at {new Date(alt.resolvedAt!).toLocaleTimeString()}</div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">ID: {alt.id.slice(0, 16)}</span>
                    <div className="flex items-center gap-2">
                      {alt.status === 'NEW' && (
                        <button
                          onClick={() => handleAcknowledge(alt.id)}
                          className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1.5 rounded-md transition shadow-xs cursor-pointer"
                        >
                          Acknowledge
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
                      {alt.status === 'RESOLVED' && (
                        <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                          ✓ Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {activeSection === 'AUDIT' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-1">
            Immutable Clinician Action Audit Log
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Audit record of clinician acknowledgments, notes, and actions on algorithmic early warning alerts.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Log ID</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Patient / Bed ID</th>
                  <th className="py-3 px-4">Clinical Action / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-xs">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="py-3 px-4 text-blue-700 font-semibold">{log.id}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.action === 'PREDICTION_GENERATED' ? 'bg-amber-100 text-amber-800' :
                        log.action === 'ALERT_ACKNOWLEDGED' ? 'bg-blue-100 text-blue-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans font-medium text-slate-800">{log.userId}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">Record #{log.patientId}</td>
                    <td className="py-3 px-4 font-sans text-slate-600">
                      {log.metadata?.note || (log.action === 'PREDICTION_GENERATED' ? `ML risk evaluated at ${(log.metadata?.riskScore * 100 || 50).toFixed(1)}%` : 'Clinician verified')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
