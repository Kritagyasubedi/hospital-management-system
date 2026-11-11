import React, { useState } from 'react';
import type { Patient, Doctor } from '../../types';
import { VitalsChart } from '../VitalsChart';
import { VitalsExplainer } from '../VitalsExplainer';

const PatientInfoCard: React.FC<{patient: Patient}> = ({ patient }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold text-srm-darkgray mb-4">Patient Demographics</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
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


interface AssignDoctorViewProps {
    patient: Patient;
    doctors: Doctor[];
    onAssignDoctor: (patientId: string, doctorId: string) => void;
    onInternAssessment: (patientId: string, assessment: { notes: string; suspectedIssue: string; }) => void;
    onCancel: () => void;
    onComplete: () => void;
}

export const AssignDoctorView: React.FC<AssignDoctorViewProps> = ({ patient, doctors, onAssignDoctor, onInternAssessment, onCancel, onComplete }) => {
    const [doctorId, setDoctorId] = useState('');
    const [isAssigned, setIsAssigned] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (doctorId) {
            // Pass empty strings for notes and suspectedIssue since we're removing these fields
            onInternAssessment(patient.id, { notes: '', suspectedIssue: '' });
            onAssignDoctor(patient.id, doctorId);
            setIsAssigned(true);
            setTimeout(() => {
                onComplete();
            }, 3000);
        } else {
            alert("Please select a doctor before submitting.");
        }
    };

    if (isAssigned) {
        const assignedDoctor = doctors.find(d => d.id === doctorId);
        return (
            <div className="text-center p-8 bg-green-50 rounded-xl shadow-sm max-w-lg mx-auto">
                <h4 className="text-xl font-bold text-srm-green">Patient Assigned!</h4>
                <p className="text-gray-600 mt-2">
                    <span className="font-semibold">{patient.name}</span> has been successfully assigned to <span className="font-semibold">{assignedDoctor?.name}</span>.
                </p>
                <p className="mt-2 text-sm text-gray-500">Redirecting to patient queue...</p>
            </div>
        )
    }

    const latestVitals = patient.vitals && patient.vitals.length > 0 ? patient.vitals[patient.vitals.length - 1] : null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left Column: Patient Data */}
            <div className="space-y-6">
                <PatientInfoCard patient={patient} />
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h3 className="text-lg font-semibold text-srm-darkgray mb-4">Receptionist's Initial Assessment</h3>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">{latestVitals?.symptomsSummary || 'No summary provided.'}</p>
                </div>
                <VitalsExplainer patient={patient} />
                 <div>
                    <VitalsChart patient={patient} />
                </div>
            </div>

            {/* Right Column: Intern Assignment */}
            <div className="bg-white p-6 rounded-xl shadow-sm sticky top-8">
                <h3 className="text-xl font-bold text-srm-blue mb-6 border-b pb-4">Assign Patient to Department/Doctor</h3>
                <form onSubmit={handleSubmit} className="space-y-6 text-sm">
                     <div>
                        <label className="font-medium text-gray-700">Assign to Department/Doctor</label>
                        <select value={doctorId} onChange={e => setDoctorId(e.target.value)} required className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            <option value="">-- Select a Doctor --</option>
                            {doctors.map(doc => (
                                <option key={doc.id} value={doc.id}>{doc.department} - {doc.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="pt-2 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        <button type="button" onClick={onCancel} className="w-full bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300">
                            Back to Queue
                        </button>
                        <button type="submit" className="w-full bg-srm-blue text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90">
                            Assign Doctor
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};