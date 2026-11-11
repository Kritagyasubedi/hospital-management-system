
import React, { useState } from 'react';
import { InternSidebar } from './InternSidebar';
import { Header } from '../Header';
import { PatientQueueView } from './PatientQueueView';
import { VitalsAssessmentView } from './VitalsAssessmentView';
import { AssignDoctorView } from './AssignDoctorView';
import { PrescriptionEntryView } from './PrescriptionEntryView';
import { MedicalRecordView } from './MedicalRecordView';
import type { Patient, PatientPrescription, InternView, Doctor, VitalSignEntry } from '../../types';

interface InternDashboardProps {
    onLogout: () => void;
    userRole: string;
    patients: Patient[];
    doctors: Doctor[];
    onAddVitals: (patientId: string, vitalsData: Omit<VitalSignEntry, 'timestamp'>) => void;
    onAssignDoctor: (patientId: string, doctorId: string) => void;
    onInternAssessment: (patientId: string, assessment: { notes: string; suspectedIssue: string; }) => void;
    onAddPrescription: (patientId: string, prescriptionData: Omit<PatientPrescription, 'id' | 'doctor'>) => void;
}

export const InternDashboard: React.FC<InternDashboardProps> = (props) => {
    const { onLogout, userRole, patients, doctors } = props;
    const [activeView, setActiveView] = useState<InternView>('patient_queue');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    const getHeaderTitle = () => {
        if (selectedPatient && activeView !== 'patient_queue') {
            return `Assessing: ${selectedPatient.name} (${selectedPatient.id})`;
        }
        switch (activeView) {
            case 'patient_queue': return "Patient Queue";
            case 'assign_doctor': return "Intern Assessment & Assignment";
            case 'prescription_entry': return "Prescription Entry";
            case 'record_viewer': return "Patient Medical Record";
            default: return "Intern Dashboard";
        }
    };
    
    const handlePatientSelect = (patient: Patient) => {
        setSelectedPatient(patient);
        setActiveView('assign_doctor');
    }
    
    const handleAssignmentCancel = () => {
        setSelectedPatient(null);
        setActiveView('patient_queue');
    };

    const renderContent = () => {
        switch (activeView) {
            case 'patient_queue':
                return <PatientQueueView patients={patients} onPatientSelect={handlePatientSelect} />;
            case 'assign_doctor':
                 return selectedPatient 
                    ? <AssignDoctorView 
                        patient={selectedPatient} 
                        doctors={doctors}
                        onAssignDoctor={props.onAssignDoctor}
                        onInternAssessment={props.onInternAssessment}
                        onCancel={handleAssignmentCancel}
                        onComplete={() => { setSelectedPatient(null); setActiveView('patient_queue'); }}
                      /> 
                    : <p className="text-center text-gray-500 p-8">Please select a patient from the queue to assess and assign.</p>;
            case 'prescription_entry':
                return <PrescriptionEntryView patients={patients} onAddPrescription={props.onAddPrescription} doctors={doctors} />;
            case 'record_viewer':
                return <MedicalRecordView patients={patients} />;
            default:
                return <PatientQueueView patients={patients} onPatientSelect={handlePatientSelect} />;
        }
    };

    return (
        <div className="flex h-screen bg-srm-gray font-sans text-srm-darkgray">
            <InternSidebar activeView={activeView} setActiveView={setActiveView} />
            <main className="flex-1 flex flex-col overflow-hidden">
                <Header title={getHeaderTitle()} onLogout={onLogout} userRole={userRole} />
                <div className="flex-1 overflow-y-auto p-6 lg:p-8">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};
