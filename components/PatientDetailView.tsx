import React from 'react';
import type { Patient } from '../types';
import { VitalsChart } from './VitalsChart';
import { Examiner } from './DischargeSummary';
import { MedicalHistoryView } from './MedicalHistoryView';

interface PatientDetailViewProps {
  patient: Patient;
}

const PatientInfoCard: React.FC<{patient: Patient}> = ({ patient }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm">
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
                <p className="font-medium">{patient.bloodType}</p>
            </div>
             <div>
                <p className="text-gray-500">Patient ID</p>
                <p className="font-medium">{patient.id}</p>
            </div>
            {patient.gender === 'Female' && patient.isPregnant !== undefined && (
                <div>
                    <p className="text-gray-500">Pregnancy Status</p>
                    <p className="font-medium">{patient.isPregnant ? 'Pregnant' : 'Not Pregnant'}</p>
                </div>
            )}
        </div>
    </div>
);

const SymptomsAndSurgeriesView: React.FC<{patient: Patient}> = ({ patient }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-srm-darkgray mb-4">Symptoms & Surgical History</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h4 className="font-semibold text-srm-darkgray mb-2">Symptoms</h4>
                {patient.symptoms && patient.symptoms.length > 0 ? (
                    <ul className="space-y-2 text-sm">
                        {patient.symptoms.map((symptom, index) => (
                            <li key={index} className="p-3 bg-gray-50 rounded-md border">
                                <p className="font-medium text-gray-800">{symptom}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500">No symptoms recorded.</p>
                )}
            </div>
            <div>
                <h4 className="font-semibold text-srm-darkgray mb-2">Surgical History</h4>
                {patient.surgeries && patient.surgeries.length > 0 ? (
                    <ul className="space-y-2 text-sm">
                        {patient.surgeries.map((surgery, index) => (
                            <li key={index} className="p-3 bg-gray-50 rounded-md border">
                                <p className="font-medium text-gray-800">{surgery}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500">No surgical history recorded.</p>
                )}
            </div>
        </div>
    </div>
);

export const PatientDetailView: React.FC<PatientDetailViewProps> = ({ patient }) => {
  return (
    <div className="space-y-8">
      <PatientInfoCard patient={patient} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <VitalsChart patient={patient} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
           <Examiner patient={patient} />
        </div>
      </div>

      <SymptomsAndSurgeriesView patient={patient} />
      
      <MedicalHistoryView patient={patient} />
    </div>
  );
};