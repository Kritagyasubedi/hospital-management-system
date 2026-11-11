import React from 'react';
import type { Patient, Appointment } from '../types';
import { mockPatients, mockBedOccupancyData, mockAdmissionData } from '../services/mockData';
import { TriageRiskBadge } from './TriageRiskBadge';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, LineChart, Line } from 'recharts';

interface DashboardProps {
    onPatientSelect: (patient: Patient) => void;
    patients?: Patient[];
    appointments?: Appointment[];
}

export const DashboardView: React.FC<DashboardProps> = ({ onPatientSelect, patients, appointments }) => {
    const allPatients = patients && patients.length > 0 ? patients : mockPatients;
    const highRiskPatients = allPatients.filter(p => p.triageInfo && p.triageInfo.risk === 'High').slice(0, 5);
    const recentPatients = allPatients.slice(0, 8);

    return (
        <div className="space-y-8">
            <section>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="text-lg font-semibold text-srm-darkgray mb-4">Bed Occupancy Rate (%)</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={mockBedOccupancyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
                                    <Tooltip cursor={{fill: 'rgba(230, 240, 246, 0.5)'}} />
                                    <Bar dataKey="occupancy" fill="#005A9C" name="Occupancy" unit="%" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                     <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="text-lg font-semibold text-srm-darkgray mb-4">Patient Flow (Last 7 Days)</h3>
                        <div className="h-64 w-full">
                           <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={mockAdmissionData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="admissions" stroke="#3182CE" strokeWidth={2} name="Admissions" />
                                    <Line type="monotone" dataKey="discharges" stroke="#38A169" strokeWidth={2} name="Discharges" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </section>
            
            <section>
                <h3 className="text-xl font-semibold mb-4 text-srm-darkgray">High-Risk Patients (Triage)</h3>
                 <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-xs text-gray-700 uppercase tracking-wider">
                            <tr>
                                <th scope="col" className="px-6 py-3">Patient Name</th>
                                <th scope="col" className="px-6 py-3">Age</th>
                                <th scope="col" className="px-6 py-3">Chief Complaint</th>
                                <th scope="col" className="px-6 py-3">Risk Level</th>
                                <th scope="col" className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {highRiskPatients.map((patient) => (
                                <tr key={patient.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{patient.name}</td>
                                    <td className="px-6 py-4">{patient.age}</td>
                                    <td className="px-6 py-4">{patient.triageInfo.chiefComplaint}</td>
                                    <td className="px-6 py-4"><TriageRiskBadge risk={patient.triageInfo.risk} /></td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => onPatientSelect(patient)} className="font-medium text-srm-blue hover:underline">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-srm-darkgray">All Active Hospital Patients & Bookings ({allPatients.length})</h3>
                    {appointments && appointments.length > 0 && (
                        <span className="text-xs font-semibold px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                            {appointments.length} Total Appointments
                        </span>
                    )}
                </div>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-xs text-gray-700 uppercase tracking-wider">
                            <tr>
                                <th scope="col" className="px-6 py-3">Patient Name</th>
                                <th scope="col" className="px-6 py-3">PID</th>
                                <th scope="col" className="px-6 py-3">Department</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Complaint / Symptoms</th>
                                <th scope="col" className="px-6 py-3">Risk Level</th>
                                <th scope="col" className="px-6 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentPatients.map((patient) => (
                                <tr key={patient.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{patient.name}</td>
                                    <td className="px-6 py-4 font-mono text-xs">{patient.id}</td>
                                    <td className="px-6 py-4">{patient.department || 'General Medicine'}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                            {patient.status ? patient.status.replace(/_/g, ' ') : 'REGISTERED'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs truncate">{patient.triageInfo?.chiefComplaint || (patient.symptoms ? patient.symptoms.join(', ') : 'Registered')}</td>
                                    <td className="px-6 py-4"><TriageRiskBadge risk={patient.triageInfo?.risk || 'Low'} /></td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => onPatientSelect(patient)} className="font-medium text-srm-blue hover:underline">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};