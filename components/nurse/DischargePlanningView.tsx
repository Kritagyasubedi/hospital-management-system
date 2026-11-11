import React, { useState } from 'react';
import type { Patient } from '../../types';
import { TriageRiskBadge } from '../TriageRiskBadge';

interface DischargePlanningViewProps {
    patients: Patient[];
    onDischargePatient: (patientId: string) => void;
}

export const DischargePlanningView: React.FC<DischargePlanningViewProps> = ({
    patients,
    onDischargePatient
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('All');
    
    // Get unique departments from patients
    const departments = ['All', ...new Set(patients.map(p => p.department).filter(Boolean))] as string[];
    
    // Filter patients based on search and department
    const filteredPatients = patients.filter(patient => {
        const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             patient.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDepartment = selectedDepartment === 'All' || patient.department === selectedDepartment;
        return matchesSearch && matchesDepartment;
    });

    const handleDischarge = (patientId: string) => {
        if (window.confirm('Are you sure you want to discharge this patient?')) {
            onDischargePatient(patientId);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h3 className="text-xl font-semibold text-srm-darkgray">Discharge Planning</h3>
                    <p className="text-gray-500 mt-1">Plan and manage patient discharges.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search patients..."
                            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-srm-blue pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                    <select
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-srm-blue bg-white"
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                    >
                        {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b">
                    <h4 className="text-lg font-semibold text-srm-darkgray">Patients Ready for Discharge ({filteredPatients.length})</h4>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-xs text-gray-700 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-3">Patient Name</th>
                                <th className="px-6 py-3">Patient ID</th>
                                <th className="px-6 py-3">Department</th>
                                <th className="px-6 py-3">Assigned Doctor</th>
                                <th className="px-6 py-3">Admission Date</th>
                                <th className="px-6 py-3">Risk Level</th>
                                <th className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-8 text-gray-500">
                                        No patients ready for discharge.
                                    </td>
                                </tr>
                            ) : (
                                filteredPatients.map(patient => (
                                    <tr key={patient.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{patient.name}</td>
                                        <td className="px-6 py-4 font-mono text-xs">{patient.id}</td>
                                        <td className="px-6 py-4">{patient.department || 'Not assigned'}</td>
                                        <td className="px-6 py-4">{patient.assignedDoctorId || 'Not assigned'}</td>
                                        <td className="px-6 py-4">
                                            {new Date(patient.triageInfo.triageDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <TriageRiskBadge risk={patient.triageInfo.risk} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <button 
                                                onClick={() => handleDischarge(patient.id)}
                                                className="font-medium text-srm-blue hover:underline"
                                            >
                                                Discharge
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h4 className="text-lg font-semibold text-srm-darkgray mb-4">Discharge Summary</h4>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span>Total Patients</span>
                            <span className="font-medium">{patients.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Average Stay</span>
                            <span className="font-medium">4.2 days</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Discharge Today</span>
                            <span className="font-medium text-green-600">8</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h4 className="text-lg font-semibold text-srm-darkgray mb-4">Pending Discharges</h4>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span>Medical Clearance</span>
                            <span className="font-medium">3</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Billing Clearance</span>
                            <span className="font-medium">5</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Nursing Clearance</span>
                            <span className="font-medium">2</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h4 className="text-lg font-semibold text-srm-darkgray mb-4">Discharge Efficiency</h4>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span>On-time Discharges</span>
                            <span className="font-medium text-green-600">92%</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Delayed Discharges</span>
                            <span className="font-medium text-yellow-600">8%</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Avg. Discharge Time</span>
                            <span className="font-medium">10:30 AM</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};