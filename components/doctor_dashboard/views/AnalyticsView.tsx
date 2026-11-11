import React, { useState } from 'react';
import {
    AreaChart, Area, BarChart, Bar, ResponsiveContainer,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

export const AnalyticsView: React.FC = () => {
    const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('month');

    // Clinical dataset metrics
    const volumeData = [
        { period: 'Jan', admissions: 142, discharges: 138, icuTransfers: 18 },
        { period: 'Feb', admissions: 168, discharges: 155, icuTransfers: 22 },
        { period: 'Mar', admissions: 195, discharges: 182, icuTransfers: 25 },
        { period: 'Apr', admissions: 178, discharges: 174, icuTransfers: 19 },
        { period: 'May', admissions: 210, discharges: 198, icuTransfers: 28 },
        { period: 'Jun', admissions: 235, discharges: 220, icuTransfers: 31 },
        { period: 'Jul', admissions: 248, discharges: 236, icuTransfers: 29 },
    ];

    const departmentPerformanceData = [
        { dept: 'Cardiology', recoveryRate: 94.2, targetRate: 90, bedOccupancy: 88 },
        { dept: 'Neurology', recoveryRate: 89.7, targetRate: 85, bedOccupancy: 92 },
        { dept: 'Orthopedics', recoveryRate: 91.5, targetRate: 88, bedOccupancy: 76 },
        { dept: 'Gen Medicine', recoveryRate: 87.3, targetRate: 85, bedOccupancy: 84 },
        { dept: 'Emergency', recoveryRate: 93.1, targetRate: 90, bedOccupancy: 95 },
        { dept: 'Pediatrics', recoveryRate: 96.4, targetRate: 92, bedOccupancy: 70 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
                <div>
                    <h3 className="text-xl font-bold text-slate-900">Hospital & Clinical Analytics</h3>
                    <p className="text-sm text-slate-500 mt-0.5">Comprehensive telemetry, patient outcome rates, and operational throughput insights.</p>
                </div>
                <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
                    <button 
                        onClick={() => setTimeframe('week')}
                        className={`px-3 py-1.5 rounded-md transition-colors ${timeframe === 'week' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                        7 Days
                    </button>
                    <button 
                        onClick={() => setTimeframe('month')}
                        className={`px-3 py-1.5 rounded-md transition-colors ${timeframe === 'month' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                        30 Days
                    </button>
                    <button 
                        onClick={() => setTimeframe('quarter')}
                        className={`px-3 py-1.5 rounded-md transition-colors ${timeframe === 'quarter' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                        Quarterly
                    </button>
                </div>
            </div>
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 hover:shadow-md transition-shadow">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Patient Outcomes</p>
                    <p className="text-3xl font-black text-slate-900 mt-2">92.4%</p>
                    <div className="flex items-center space-x-1 text-xs font-semibold text-emerald-600 mt-2">
                        <span>↑ +2.1%</span>
                        <span className="text-slate-400 font-normal">vs last period</span>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 hover:shadow-md transition-shadow">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Avg. Length of Stay</p>
                    <p className="text-3xl font-black text-slate-900 mt-2">4.2 <span className="text-base font-medium text-slate-500">days</span></p>
                    <div className="flex items-center space-x-1 text-xs font-semibold text-emerald-600 mt-2">
                        <span>↓ -0.3 days</span>
                        <span className="text-slate-400 font-normal">improved efficiency</span>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 hover:shadow-md transition-shadow">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Readmission Rate</p>
                    <p className="text-3xl font-black text-amber-600 mt-2">8.7%</p>
                    <div className="flex items-center space-x-1 text-xs font-semibold text-amber-600 mt-2">
                        <span>• Stable</span>
                        <span className="text-slate-400 font-normal">(National Avg 11.2%)</span>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 hover:shadow-md transition-shadow">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Patient Satisfaction</p>
                    <p className="text-3xl font-black text-blue-600 mt-2">4.7 <span className="text-base font-medium text-slate-400">/ 5.0</span></p>
                    <div className="flex items-center space-x-1 text-xs font-semibold text-emerald-600 mt-2">
                        <span>★ 94%</span>
                        <span className="text-slate-400 font-normal">positive feedback</span>
                    </div>
                </div>
            </div>
            
            {/* Interactive Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Patient Volume Area Chart */}
                <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h4 className="font-bold text-base text-slate-900">Patient Flow & Admission Volume</h4>
                            <p className="text-xs text-slate-500">Admissions, successful discharges, and ICU transfers</p>
                        </div>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={volumeData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorAdm" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0}/>
                                    </linearGradient>
                                    <linearGradient id="colorDis" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                                <XAxis dataKey="period" stroke="#94A3B8" fontSize={12} tickLine={false} />
                                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#0B1E33', borderColor: '#1E293B', borderRadius: '8px', color: '#fff' }} />
                                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
                                <Area type="monotone" dataKey="admissions" name="Admissions" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAdm)" />
                                <Area type="monotone" dataKey="discharges" name="Discharges" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorDis)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
                {/* Department Recovery & Bed Occupancy BarChart */}
                <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h4 className="font-bold text-base text-slate-900">Department Recovery Rate vs Bed Occupancy</h4>
                            <p className="text-xs text-slate-500">Clinical recovery efficiency (%) and capacity utilization</p>
                        </div>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={departmentPerformanceData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                                <XAxis dataKey="dept" stroke="#94A3B8" fontSize={11} tickLine={false} />
                                <YAxis domain={[0, 100]} stroke="#94A3B8" fontSize={12} tickLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#0B1E33', borderColor: '#1E293B', borderRadius: '8px', color: '#fff' }} />
                                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
                                <Bar dataKey="recoveryRate" name="Recovery Rate (%)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="bedOccupancy" name="Bed Occupancy (%)" fill="#64748B" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            
            {/* Recent Reports Table */}
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
                <h4 className="font-bold text-base text-slate-900 mb-4">Recent Automated Clinical Reports</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-slate-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer bg-slate-50/50">
                        <div className="flex items-center mb-2">
                            <div className="bg-blue-100 p-2.5 rounded-lg mr-3 text-blue-600 font-bold">
                                📊
                            </div>
                            <div>
                                <h5 className="font-bold text-sm text-slate-800">Monthly ICU Performance</h5>
                                <p className="text-xs text-slate-500">July 2024 Deterioration Audit</p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">Generated 2 days ago • Automated</p>
                    </div>
                    
                    <div className="border border-slate-200 rounded-xl p-4 hover:border-emerald-400 hover:shadow-sm transition-all cursor-pointer bg-slate-50/50">
                        <div className="flex items-center mb-2">
                            <div className="bg-emerald-100 p-2.5 rounded-lg mr-3 text-emerald-600 font-bold">
                                📈
                            </div>
                            <div>
                                <h5 className="font-bold text-sm text-slate-800">Alarm Fatigue Reduction</h5>
                                <p className="text-xs text-slate-500">Suppression Filter Metrics</p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">Generated 1 week ago • Quality Assured</p>
                    </div>
                    
                    <div className="border border-slate-200 rounded-xl p-4 hover:border-purple-400 hover:shadow-sm transition-all cursor-pointer bg-slate-50/50">
                        <div className="flex items-center mb-2">
                            <div className="bg-purple-100 p-2.5 rounded-lg mr-3 text-purple-600 font-bold">
                                🛡️
                            </div>
                            <div>
                                <h5 className="font-bold text-sm text-slate-800">Clinical Safety Indicators</h5>
                                <p className="text-xs text-slate-500">Adverse Event Prevention Log</p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">Generated 3 days ago • Verified</p>
                    </div>
                </div>
            </div>
        </div>
    );
};