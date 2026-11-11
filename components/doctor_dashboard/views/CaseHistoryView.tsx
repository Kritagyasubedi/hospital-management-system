import React, { useState, useMemo } from 'react';
import type { Patient } from '../../../types';
import { TriageRiskBadge } from '../../TriageRiskBadge';

interface CaseHistoryViewProps {
    patients: Patient[];
    onSelectPatient: (patient: Patient) => void;
}

export const CaseHistoryView: React.FC<CaseHistoryViewProps> = ({ patients, onSelectPatient }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter patients based on search term (PID or name)
    const filteredPatients = useMemo(() => {
        if (!searchTerm) return patients;
        
        const term = searchTerm.toLowerCase();
        return patients.filter(patient => 
            patient.id.toLowerCase().includes(term) || 
            patient.name.toLowerCase().includes(term)
        );
    }, [patients, searchTerm]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h3 className="text-xl font-semibold text-srm-darkgray">Case History</h3>
                    <p className="text-gray-500 mt-1">View and access complete medical records of all patients.</p>
                </div>
                <div className="w-full md:w-auto">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by Patient ID or Name..."
                            className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-srm-blue pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs text-gray-700 uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-3">Patient Name</th>
                            <th className="px-6 py-3">Patient ID</th>
                            <th className="px-6 py-3">Age</th>
                            <th className="px-6 py-3">Department</th>
                            <th className="px-6 py-3">Chief Complaint</th>
                            <th className="px-6 py-3">Risk Level</th>
                            <th className="px-6 py-3">Visit Date</th>
                            <th className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPatients.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center py-8 text-gray-500">
                                    {searchTerm ? 'No patients found matching your search.' : 'No patient records available.'}
                                </td>
                            </tr>
                        ) : (
                            filteredPatients.map(patient => (
                                <tr key={patient.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{patient.name}</td>
                                    <td className="px-6 py-4 font-mono text-xs">{patient.id}</td>
                                    <td className="px-6 py-4">{patient.age}</td>
                                    <td className="px-6 py-4">{patient.department || 'Not assigned'}</td>
                                    <td className="px-6 py-4">
                                        <div className="max-w-xs truncate" title={patient.triageInfo.chiefComplaint}>
                                            {patient.triageInfo.chiefComplaint}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <TriageRiskBadge risk={patient.triageInfo.risk} />
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(patient.triageInfo.triageDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => onSelectPatient(patient)} 
                                            className="font-medium text-srm-blue hover:underline"
                                        >
                                            View Records
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {filteredPatients.length > 0 && (
                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                        Showing {filteredPatients.length} of {patients.length} patients
                    </p>
                </div>
            )}
        </div>
    );
};