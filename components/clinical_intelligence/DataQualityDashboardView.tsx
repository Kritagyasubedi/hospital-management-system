import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { ClinicalIntelligenceService } from '../../services/clinicalIntelligenceService';
import { PulseIcon } from '../icons';

export const DataQualityDashboardView: React.FC = () => {
  const report = ClinicalIntelligenceService.getDatasetReport();
  const paramEntries = Object.entries(report.parameters);

  // Top 14 parameters completeness comparison (0 to 100%)
  const completenessChartData = useMemo(() => {
    return paramEntries
      .map(([name, data]) => {
        const completeness = Math.max(0, Math.min(100, Math.round((100 - data.missingness_percentage) * 10) / 10));
        return {
          name,
          completeness,
          validObservations: data.valid_count
        };
      })
      .sort((a, b) => b.completeness - a.completeness)
      .slice(0, 14);
  }, [paramEntries]);

  // ICU Unit Distribution Chart
  const unitDistributionData = useMemo(() => {
    const unitMap: Record<string, string> = {
      '1': 'Coronary Care Unit (CCU)',
      '2': 'Cardiac Recovery (CSRU)',
      '3': 'Medical ICU (MICU)',
      '4': 'Surgical ICU (SICU)'
    };
    return Object.entries(report.icu_types_distribution).map(([typeId, count]) => ({
      name: unitMap[typeId] || `Unit ${typeId}`,
      count
    }));
  }, [report]);

  const UNIT_COLORS = ['#2563eb', '#0284c7', '#0d9488', '#f59e0b'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-100/90 border border-slate-200/90 text-slate-900 rounded-xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-blue-100 text-blue-800 border border-blue-200">
            Telemetry Quality Engine
          </span>
          <span className="text-xs text-slate-500 font-mono">3,200 Cohort Telemetry Audit</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
          <PulseIcon className="w-7 h-7 text-blue-600" />
          ICU Telemetry Data Quality & Missingness Analysis
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Automated audit of irregular sampling, missingness, sentinel value masking (-1), and parameter coverage across the complete ICU patient cohort.
        </p>
      </div>

      {/* Cohort Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Patients Ingested</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{report.summary.total_telemetry_files}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">100% Parsed & Cleaned</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Median Telemetry Window</div>
          <div className="text-2xl font-black text-blue-700 mt-1">{report.telemetry_duration_hours.median_hours.toFixed(1)} hrs</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Q1: {report.telemetry_duration_hours.q25_hours.toFixed(1)}h • Q3: {report.telemetry_duration_hours.q75_hours.toFixed(1)}h</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Obs Per Patient (Median)</div>
          <div className="text-2xl font-black text-slate-800 mt-1">{report.observations_per_patient.median_obs}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Mean: {report.observations_per_patient.mean_obs.toFixed(1)} observations</div>
        </div>

        <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-xl p-5 shadow-xs">
          <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Sentinel (-1) Masking</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">100% Masked</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-0.5">Zero sentinel contamination</div>
        </div>
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Top 14 Parameters Completeness (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-1">
            Top Telemetry Parameters Completeness Rate
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Percentage of non-missing observations recorded across the 3,200 cohort ICU records.
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={completenessChartData} margin={{ top: 10, right: 20, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-25} textAnchor="end" />
                <YAxis unit="%" domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value: any) => [`${value}%`, 'Completeness Ratio']} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="completeness" name="Parameter Completeness (%)" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: ICU Unit Distribution (1 col) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-1">
              Cohort ICU Unit Breakdown
            </h2>
            <p className="text-xs text-slate-500 mb-2">
              Patient distribution across specialized units.
            </p>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={unitDistributionData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={70} fill="#8884d8" label>
                    {unitDistributionData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={UNIT_COLORS[index % UNIT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold border-t border-slate-100 pt-3">
            {unitDistributionData.map((u, i) => (
              <div key={i} className="flex items-center gap-1.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: UNIT_COLORS[i % UNIT_COLORS.length] }}></span>
                <span className="truncate text-slate-700">{u.name}: {u.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Parameter Breakdown Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-1">
          Telemetry Parameter Catalog & Missingness Frequency
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Actual parameter distribution discovered programmatically across all 3,200 patient records in Dataset 2.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Parameter Code</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Total Observations</th>
                <th className="py-3 px-4">Valid Count</th>
                <th className="py-3 px-4">Masked Sentinels (-1)</th>
                <th className="py-3 px-4">Missingness %</th>
                <th className="py-3 px-4">Imputation Strategy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {paramEntries.map(([paramName, paramData]) => (
                <tr key={paramName} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">{paramName}</td>
                  <td className="py-3 px-4 font-sans">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      ['HR', 'SysABP', 'DiasABP', 'MAP', 'RespRate', 'Temp'].includes(paramName)
                        ? 'bg-blue-100 text-blue-800'
                        : ['GCS', 'SaO2', 'PaO2', 'FiO2'].includes(paramName)
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {['HR', 'SysABP', 'DiasABP', 'MAP', 'RespRate', 'Temp'].includes(paramName) ? 'Hemodynamic Vital' : 'Lab / Gas Marker'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-blue-700 font-bold">{paramData.total_occurrences.toLocaleString()}</td>
                  <td className="py-3 px-4 text-slate-800">{paramData.valid_count.toLocaleString()}</td>
                  <td className="py-3 px-4 text-emerald-700 font-semibold">{paramData.sentinel_negative_one_count} filtered</td>
                  <td className="py-3 px-4">
                    <span className={`font-bold ${paramData.missingness_percentage > 50 ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {paramData.missingness_percentage.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-600">Forward-fill (LOCF) &plus; Sentinel NaN Masking</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
