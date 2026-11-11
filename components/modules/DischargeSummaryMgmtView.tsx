
import React, { useState } from 'react';
import { Examiner } from '../DischargeSummary';
import type { Patient } from '../../types';
import { mockPatients } from '../../services/mockData';

interface DischargeSummaryMgmtViewProps {
    patient?: Patient;
    patients?: Patient[];
}

export const DischargeSummaryMgmtView: React.FC<DischargeSummaryMgmtViewProps> = ({ patient, patients = [] }) => {
    const allPatients = patients.length > 0 ? patients : mockPatients;
    const [selectedPid, setSelectedPid] = useState(patient?.id || allPatients[0]?.id || '');

    const currentPatient = allPatients.find(p => p.id === selectedPid) || patient || allPatients[0];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="font-bold text-srm-darkgray text-lg">AI Discharge Summary & Clinical Report</h3>
                    <p className="text-xs text-gray-500">Comprehensive patient review and discharge synthesis</p>
                </div>
                <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">Patient:</label>
                    <select 
                        value={currentPatient?.id} 
                        onChange={(e) => setSelectedPid(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md text-sm bg-white"
                    >
                        {allPatients.map(p => (
                            <option key={p.id} value={p.id}>{p.name} ({p.id}) - {p.department || 'General'}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm min-h-[500px]">
                <Examiner patient={currentPatient} />
            </div>
        </div>
    );
};
