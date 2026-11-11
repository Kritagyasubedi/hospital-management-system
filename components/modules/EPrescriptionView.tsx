
import React, { useState } from 'react';
import { mockPatients } from '../../services/mockData';
import type { Patient } from '../../types';

interface EPrescriptionViewProps {
    patients?: Patient[];
}

export const EPrescriptionView: React.FC<EPrescriptionViewProps> = ({ patients }) => {
    const allPatients = patients && patients.length > 0 ? patients : mockPatients;
    const [selectedPid, setSelectedPid] = useState(allPatients[0]?.id || '');

    const patient = allPatients.find(p => p.id === selectedPid) || allPatients[0];

    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-srm-darkgray">Consultation & E-Prescription Portal</h3>
                    <p className="text-xs text-gray-500">Prescribing for selected patient</p>
                </div>
                <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">Patient:</label>
                    <select 
                        value={patient?.id} 
                        onChange={(e) => setSelectedPid(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md text-sm bg-white"
                    >
                        {allPatients.map(p => (
                            <option key={p.id} value={p.id}>{p.name} ({p.id}) - {p.department || 'General'}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold text-srm-darkgray mb-4">Consultation Notes</h3>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm border h-96 overflow-y-auto">
                        <p className="font-semibold text-srm-blue">Patient: {patient?.name} ({patient?.id})</p>
                        <p className="text-xs text-gray-500 mt-0.5">Department: {patient?.department || 'General Medicine'} | Status: {patient?.status || 'Active'}</p>
                        <pre className="whitespace-pre-wrap font-sans mt-3 text-gray-700">{patient?.clinicalNotes || 'No previous clinical notes available.'}</pre>
                    </div>
                </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-srm-darkgray mb-4">Create E-Prescription</h3>
                <form className="space-y-4 text-sm">
                    <div>
                        <label className="font-medium text-gray-700">Medication</label>
                        <input type="text" className="w-full mt-1 p-2 border border-gray-300 rounded-md" placeholder="Search for medication (e.g., Augmentin)" />
                    </div>
                    <div>
                        <label className="font-medium text-gray-700">Dosage</label>
                        <input type="text" className="w-full mt-1 p-2 border border-gray-300 rounded-md" placeholder="e.g., 625mg" />
                    </div>
                    <div>
                        <label className="font-medium text-gray-700">Frequency</label>
                         <select className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            <option>Once a day (OD)</option>
                            <option>Twice a day (BD)</option>
                            <option>Three times a day (TDS)</option>
                             <option>As needed (PRN)</option>
                        </select>
                    </div>
                     <div>
                        <label className="font-medium text-gray-700">Duration</label>
                        <input type="text" className="w-full mt-1 p-2 border border-gray-300 rounded-md" placeholder="e.g., 7 days" />
                    </div>
                    <div>
                        <label className="font-medium text-gray-700">Notes for Pharmacist</label>
                        <textarea className="w-full mt-1 p-2 border border-gray-300 rounded-md" rows={2}></textarea>
                    </div>
                    <button type="submit" className="w-full bg-srm-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors">
                        Finalize & Send to Pharmacy
                    </button>
                </form>
            </div>
            </div>
        </div>
    );
};