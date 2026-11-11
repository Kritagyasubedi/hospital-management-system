import React from 'react';
import type { Patient } from '../../types';

interface PatientQueueViewProps {
    patients: Patient[];
    onPatientSelect: (patient: Patient) => void;
}

export const PatientQueueView: React.FC<PatientQueueViewProps> = ({ patients, onPatientSelect }) => {
    // Show patients awaiting intern assessment — only those not yet assigned to a doctor
    const waitingPatients = [...patients].filter(p => 
        (p.status === 'WAITING_FOR_INTERN' || p.status === 'REGISTERED') && !p.assignedDoctorId
    ).reverse();

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-srm-darkgray">Patients Awaiting Assessment</h3>
                <p className="text-gray-500 mt-1">These patients have been registered and are ready for preliminary assessment.</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs text-gray-700 uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-3">Patient Name</th>
                            <th className="px-6 py-3">Patient ID</th>
                            <th className="px-6 py-3">Age</th>
                            <th className="px-6 py-3">Gender</th>
                            <th className="px-6 py-3">Pregnancy Status</th>
                            <th className="px-6 py-3">Symptoms</th>
                            <th className="px-6 py-3">Latest BP</th>
                            <th className="px-6 py-3">Latest Temp</th>
                            <th className="px-6 py-3">Latest Pulse</th>
                            <th className="px-6 py-3">Last Vitals Time</th>
                            <th className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {waitingPatients.length === 0 ? (
                            <tr>
                                <td colSpan={11} className="text-center py-8 text-gray-500">The patient queue is currently empty.</td>
                            </tr>
                        ) : (
                            waitingPatients.map(patient => {
                                // Get the latest vitals instead of just the initial ones
                                const latestVitals = patient.vitals && patient.vitals.length > 0 
                                    ? patient.vitals[patient.vitals.length - 1] 
                                    : null;
                                
                                return (
                                    <tr key={patient.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{patient.name}</td>
                                        <td className="px-6 py-4 font-mono text-xs">{patient.id}</td>
                                        <td className="px-6 py-4">{patient.age}</td>
                                        <td className="px-6 py-4">{patient.gender}</td>
                                        <td className="px-6 py-4">
                                            {patient.gender === 'Female' ? (
                                                patient.isPregnant !== undefined ? (
                                                    <span className={`font-medium ${patient.isPregnant ? 'text-red-600' : 'text-green-600'}`}>
                                                        {patient.isPregnant ? 'Pregnant' : 'Not Pregnant'}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">Not specified</span>
                                                )
                                            ) : (
                                                <span className="text-gray-400">N/A</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 max-w-xs truncate" title={patient.triageInfo?.chiefComplaint || (patient.symptoms ? patient.symptoms.join(', ') : 'Awaiting assessment')}>
                                            {patient.triageInfo?.chiefComplaint || (patient.symptoms && patient.symptoms.length > 0 ? patient.symptoms.join(', ') : 'Awaiting assessment')}
                                        </td>
                                        <td className="px-6 py-4 font-semibold">{latestVitals ? `${latestVitals.bloodPressure.systolic}/${latestVitals.bloodPressure.diastolic}` : 'N/A'}</td>
                                        <td className="px-6 py-4 font-semibold">{latestVitals ? `${latestVitals.temperature}°C` : 'N/A'}</td>
                                        <td className="px-6 py-4 font-semibold">{latestVitals ? `${latestVitals.heartRate} bpm` : 'N/A'}</td>
                                        <td className="px-6 py-4">{latestVitals ? new Date(latestVitals.timestamp).toLocaleTimeString() : 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => onPatientSelect(patient)} className="font-medium text-srm-blue hover:underline">
                                                Assess Patient
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
