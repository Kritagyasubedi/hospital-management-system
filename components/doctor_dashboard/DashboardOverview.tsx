import React from 'react';
import { Patient } from '../../types';
import { TriageRiskBadge } from '../TriageRiskBadge';

interface DashboardOverviewProps {
    patients: Patient[];
}

const StatCard: React.FC<{ label: string; value: string | number; color: string }> = ({ label, value, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className={`text-3xl font-bold ${color} mt-1`}>{value}</p>
    </div>
);

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ patients }) => {
    // Filter out unassigned patients (patients without assignedDoctorId)
    const assignedPatients = patients.filter(p => p.assignedDoctorId);
    
    // Calculate metrics for assigned patients only
    const totalPatients = assignedPatients.length;
    const highRiskPatients = assignedPatients.filter(p => p.triageInfo.risk === 'High');
    const pendingReports = 3; // This would typically come from a reports service

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Total Assigned Patients" value={totalPatients} color="text-srm-blue" />
                <StatCard label="High-Risk Cases" value={highRiskPatients.length} color="text-srm-red" />
                <StatCard label="Pending Reports" value={pendingReports} color="text-srm-yellow" />
            </div>

            <section>
                <h3 className="text-xl font-semibold mb-4 text-srm-darkgray">High-Risk Patient Watchlist</h3>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {highRiskPatients.length > 0 ? (
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-xs text-gray-700 uppercase tracking-wider">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Patient Name</th>
                                    <th scope="col" className="px-6 py-3">Department</th>
                                    <th scope="col" className="px-6 py-3">Age</th>
                                    <th scope="col" className="px-6 py-3">Chief Complaint</th>
                                    <th scope="col" className="px-6 py-3">Risk Level</th>
                                </tr>
                            </thead>
                            <tbody>
                                {highRiskPatients.map((patient) => (
                                    <tr key={patient.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{patient.name}</td>
                                        <td className="px-6 py-4">{patient.department || 'Unassigned'}</td>
                                        <td className="px-6 py-4">{patient.age}</td>
                                        <td className="px-6 py-4">{patient.triageInfo.chiefComplaint}</td>
                                        <td className="px-6 py-4"><TriageRiskBadge risk={patient.triageInfo.risk} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            No high-risk patients currently assigned.
                        </div>
                    )}
                </div>
            </section>

            <section>
                <h3 className="text-xl font-semibold mb-4 text-srm-darkgray">Department Overview</h3>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-xs text-gray-700 uppercase tracking-wider">
                            <tr>
                                <th scope="col" className="px-6 py-3">Department</th>
                                <th scope="col" className="px-6 py-3">Total Patients</th>
                                <th scope="col" className="px-6 py-3">High-Risk Patients</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(() => {
                                // Group assigned patients by department
                                const departmentStats: Record<string, { total: number; highRisk: number }> = {};
                                
                                assignedPatients.forEach(patient => {
                                    const department = patient.department || 'Unassigned';
                                    if (!departmentStats[department]) {
                                        departmentStats[department] = { total: 0, highRisk: 0 };
                                    }
                                    departmentStats[department].total += 1;
                                    if (patient.triageInfo.risk === 'High') {
                                        departmentStats[department].highRisk += 1;
                                    }
                                });
                                
                                // Convert to array for rendering
                                const departmentEntries = Object.entries(departmentStats);
                                
                                return departmentEntries.length > 0 ? (
                                    departmentEntries.map(([department, stats]) => (
                                        <tr key={department} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{department}</td>
                                            <td className="px-6 py-4">{stats.total}</td>
                                            <td className="px-6 py-4">
                                                <span className={`font-semibold ${stats.highRisk > 0 ? 'text-srm-red' : 'text-gray-500'}`}>
                                                    {stats.highRisk}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="p-8 text-center text-gray-500">
                                            No department data available.
                                        </td>
                                    </tr>
                                );
                            })()}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};