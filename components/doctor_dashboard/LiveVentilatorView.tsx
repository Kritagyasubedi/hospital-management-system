import React, { useState } from 'react';
import type { Patient } from '../../types';
import { VitalsChart } from '../VitalsChart';

interface VitalsMonitoringProps {
    patients: Patient[];
}

export const LiveVentilatorView: React.FC<VitalsMonitoringProps> = ({ patients }) => {
    const [selectedPatientId, setSelectedPatientId] = useState<string>('');
    
    const selectedPatient = patients.find(p => p.id === selectedPatientId);

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm max-w-lg mx-auto">
                <label htmlFor="patient-select" className="block text-sm font-medium text-gray-700">Select Patient to Monitor</label>
                <select
                    id="patient-select"
                    value={selectedPatientId}
                    onChange={e => setSelectedPatientId(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-srm-blue focus:border-srm-blue sm:text-sm rounded-md"
                >
                    <option value="">-- Choose a patient --</option>
                    {patients.map(p => (
                        <option key={p.id} value={p.id}>
                            {p.name} ({p.id})
                        </option>
                    ))}
                </select>
            </div>

            {selectedPatient ? (
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold text-srm-darkgray mb-4">Vitals History: {selectedPatient.name}</h3>
                    <VitalsChart patient={selectedPatient} />
                </div>
            ) : (
                <div className="text-center p-12 bg-white rounded-xl shadow-sm">
                    <p className="text-gray-500 font-semibold">Please select a patient to view their vitals chart.</p>
                </div>
            )}
        </div>
    );
};
