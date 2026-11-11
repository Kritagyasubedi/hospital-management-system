
import React, { useState } from 'react';
import type { Patient } from '../../types';
import { MedicalHistoryView } from '../MedicalHistoryView';

const PatientInfoCard: React.FC<{patient: Patient}> = ({ patient }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold text-srm-darkgray mb-4">Patient Demographics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
                <p className="text-gray-500">Full Name</p>
                <p className="font-medium">{patient.name}</p>
            </div>
            <div>
                <p className="text-gray-500">Age</p>
                <p className="font-medium">{patient.age}</p>
            </div>
            <div>
                <p className="text-gray-500">Gender</p>
                <p className="font-medium">{patient.gender}</p>
            </div>
             <div>
                <p className="text-gray-500">Date of Birth</p>
                <p className="font-medium">{patient.dob}</p>
            </div>
             <div>
                <p className="text-gray-500">Blood Type</p>
                <p className="font-medium">{patient.bloodType || 'N/A'}</p>
            </div>
             <div>
                <p className="text-gray-500">Patient ID</p>
                <p className="font-medium">{patient.id}</p>
            </div>
            {patient.gender === 'Female' && patient.isPregnant !== undefined && (
                <div>
                    <p className="text-gray-500">Pregnancy Status</p>
                    <p className={`font-medium ${patient.isPregnant ? 'text-red-600' : 'text-green-600'}`}>
                        {patient.isPregnant ? 'Pregnant' : 'Not Pregnant'}
                    </p>
                </div>
            )}
        </div>
        {patient.gender === 'Female' && patient.isPregnant === true && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-md text-yellow-800 text-sm">
                ⚠️ <strong>Caution:</strong> Patient is pregnant. Please consider pregnancy-related factors during assessment.
            </div>
        )}
    </div>
);


export const MedicalHistoryLookupView: React.FC<{ patients: Patient[] }> = ({ patients }) => {
    const [searchPid, setSearchPid] = useState('');
    const [foundPatient, setFoundPatient] = useState<Patient | null>(null);
    const [error, setError] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setFoundPatient(null);
        const patient = patients.find(p => p.id.toLowerCase() === searchPid.toLowerCase());
        if (patient) {
            setFoundPatient(patient);
        } else {
            setError('No patient found with that ID.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm max-w-2xl mx-auto">
                 <h3 className="text-xl font-bold text-srm-darkgray mb-4">Patient History Lookup</h3>
                 <form onSubmit={handleSearch} className="flex space-x-2">
                     <input
                        type="text"
                        value={searchPid}
                        onChange={e => setSearchPid(e.target.value)}
                        placeholder="Enter Patient ID (PID)..."
                        className="flex-grow w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-srm-blue focus:border-srm-blue"
                    />
                    <button type="submit" className="bg-srm-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90">
                        Search
                    </button>
                 </form>
                 {error && <p className="text-sm text-red-600 mt-2 text-center">{error}</p>}
            </div>
            {foundPatient && (
                <div className="space-y-6">
                    <PatientInfoCard patient={foundPatient} />
                    <MedicalHistoryView patient={foundPatient} />
                     <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="text-lg font-semibold text-srm-darkgray mb-4">Clinical Notes</h3>
                        <pre className="text-sm bg-gray-50 p-4 rounded-md border whitespace-pre-wrap font-sans max-h-60 overflow-y-auto">{foundPatient.clinicalNotes}</pre>
                    </div>
                </div>
            )}
        </div>
    );
};
