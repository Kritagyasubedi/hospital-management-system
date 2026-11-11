import React, { useState } from 'react';
import type { Patient } from '../../types';
import { TriageRiskBadge } from '../TriageRiskBadge';

interface PatientListViewProps {
    patients: Patient[];
    allPatients?: Patient[];
    onSelectPatient: (patient: Patient) => void;
}

export const PatientListView: React.FC<PatientListViewProps> = ({ patients, allPatients = [], onSelectPatient }) => {
    const [viewMode, setViewMode] = useState<'assigned' | 'all'>('assigned');
    const displayPatients = viewMode === 'assigned' ? patients : allPatients;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h3 className="text-xl font-semibold text-srm-darkgray">
                        {viewMode === 'assigned' ? 'My Assigned Patients' : 'All Hospital Patients'}
                    </h3>
                    <p className="text-gray-500 mt-1">
                        {viewMode === 'assigned' ? 'Patients under your direct care and department.' : 'All registered patients across the hospital.'}
                    </p>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setViewMode('assigned')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                            viewMode === 'assigned' ? 'bg-white text-srm-blue shadow-xs' : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        My Patients ({patients.length})
                    </button>
                    <button
                        onClick={() => setViewMode('all')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                            viewMode === 'all' ? 'bg-white text-srm-blue shadow-xs' : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        All Patients ({allPatients.length})
                    </button>
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
                            <th className="px-6 py-3">Symptoms</th>
                            <th className="px-6 py-3">Risk Level</th>
                            <th className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayPatients.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center py-8 text-gray-500">
                                    {viewMode === 'assigned' ? 'No patients currently assigned to you.' : 'No patients registered in the hospital.'}
                                </td>
                            </tr>
                        )}
                        {displayPatients.map(patient => (
                            <tr key={patient.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{patient.name}</td>
                                <td className="px-6 py-4 font-mono text-xs">{patient.id}</td>
                                <td className="px-6 py-4">{patient.age}</td>
                                <td className="px-6 py-4">{patient.department}</td>
                                <td className="px-6 py-4">
                                    {patient.symptoms && patient.symptoms.length > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                            {patient.symptoms.slice(0, 2).map((symptom, index) => (
                                                <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {symptom}
                                                </span>
                                            ))}
                                            {patient.symptoms.length > 2 && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    +{patient.symptoms.length - 2} more
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-gray-500">No symptoms</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <TriageRiskBadge risk={patient.triageInfo.risk} />
                                </td>
                                 <td className="px-6 py-4">
                                    <button onClick={() => onSelectPatient(patient)} className="font-medium text-srm-blue hover:underline">
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};