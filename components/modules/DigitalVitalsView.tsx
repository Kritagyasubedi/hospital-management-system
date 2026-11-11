import React, { useState } from 'react';
import { VitalsChart } from '../VitalsChart';
import { mockPatients } from '../../services/mockData';
import type { Patient } from '../../types';

interface DigitalVitalsViewProps {
    patients?: Patient[];
}

export const DigitalVitalsView: React.FC<DigitalVitalsViewProps> = ({ patients }) => {
    const allPatients = patients && patients.length > 0 ? patients : mockPatients;
    const [selectedPid, setSelectedPid] = useState(allPatients[0]?.id || '');

    const currentPatient = allPatients.find(p => p.id === selectedPid) || allPatients[0];

    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-srm-darkgray">Digital Vitals & Telemetry Feed</h3>
                    <p className="text-xs text-gray-500">Live monitoring per patient</p>
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <VitalsChart patient={currentPatient} />
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold text-srm-darkgray mb-4">Manual Vitals Entry</h3>
                    <p className="text-sm text-gray-500 mb-4">Recording vitals for <span className="font-semibold">{currentPatient?.name}</span>.</p>
                <form className="space-y-4 text-sm">
                    <div>
                        <label className="font-medium text-gray-700">Heart Rate (bpm)</label>
                        <input type="number" className="w-full mt-1 p-2 border border-gray-300 rounded-md" placeholder="e.g., 75" />
                    </div>
                     <div>
                        <label className="font-medium text-gray-700">Blood Pressure (Systolic/Diastolic)</label>
                        <div className="flex items-center space-x-2">
                           <input type="number" className="w-full mt-1 p-2 border border-gray-300 rounded-md" placeholder="120" />
                           <span>/</span>
                           <input type="number" className="w-full mt-1 p-2 border border-gray-300 rounded-md" placeholder="80" />
                        </div>
                    </div>
                     <div>
                        <label className="font-medium text-gray-700">SpO2 (%)</label>
                        <input type="number" className="w-full mt-1 p-2 border border-gray-300 rounded-md" placeholder="e.g., 98" />
                    </div>
                     <div>
                        <label className="font-medium text-gray-700">Temperature (°F)</label>
                        <input type="number" step="0.1" className="w-full mt-1 p-2 border border-gray-300 rounded-md" placeholder="e.g., 98.6" />
                    </div>
                    <button type="submit" className="w-full bg-srm-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors">
                        Submit Vitals
                    </button>
                </form>
            </div>
            </div>
        </div>
    );
};
