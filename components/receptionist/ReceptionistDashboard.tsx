

import React, { useState } from 'react';
import { ReceptionistSidebar } from './ReceptionistSidebar';
import { Header } from '../Header';
import { AppointmentsReceivedView } from './AppointmentsReceivedView';
import { WalkinRegistrationView } from './WalkinRegistrationView';
import { VitalEntriesView } from './VitalEntriesView';
import { MedicalHistoryLookupView } from './MedicalHistoryLookupView';
import { ActivityLogView } from './ActivityLogView';
import type { Patient, PatientPrescription, ReceptionistView, Appointment, VitalSignEntry, Doctor, ActivityLog } from '../../types';

interface ReceptionistDashboardProps {
    onLogout: () => void;
    userRole: string;
    patients: Patient[];
    appointments: Appointment[];
    doctors: Doctor[];
    activityLog: ActivityLog[];
    onAddPatient: (details: Omit<Patient, 'id' | 'triageInfo' | 'clinicalNotes' | 'prescriptions' | 'referrals' | 'bloodType' | 'password' | 'dob' | 'medicalHistory'> & { symptoms: string, bp: string, temp: string, pulse: string, dob: string }) => Patient;
    onAddVitals: (patientId: string, vitalsData: Omit<VitalSignEntry, 'timestamp'>) => void;
    onUpdateAppointmentStatus: (appointmentId: string, status: 'Confirmed' | 'Cancelled' | 'Rejected') => void;
    onAssignDoctorToAppointment: (appointmentId: string, doctorId: string) => void;
}

export const ReceptionistDashboard: React.FC<ReceptionistDashboardProps> = (props) => {
    const { 
        onLogout, userRole, patients, appointments, doctors, activityLog, onAddPatient,
        onAddVitals, onUpdateAppointmentStatus, onAssignDoctorToAppointment 
    } = props;
    const [activeView, setActiveView] = useState<ReceptionistView>('appointments');

    const getHeaderTitle = () => {
        switch(activeView) {
            case 'appointments': return "Appointments Received";
            case 'walkin': return "Walk-in Patient Registration";
            case 'assessment': return "Patient Vitals & Assessment";
            case 'history': return "Patient Medical History";
            case 'activity_log': return "Patient Activity Log";
            default: return "Receptionist Dashboard";
        }
    };

    const renderContent = () => {
        switch (activeView) {
            case 'appointments': 
                return <AppointmentsReceivedView 
                            appointments={appointments} 
                            doctors={doctors}
                            onUpdateStatus={onUpdateAppointmentStatus} 
                            onAssignDoctor={onAssignDoctorToAppointment}
                        />;
            case 'walkin': return <WalkinRegistrationView onAddPatient={onAddPatient} />;
            case 'assessment': return <VitalEntriesView onAddVitals={onAddVitals} patients={patients} />;
            case 'history': return <MedicalHistoryLookupView patients={patients} />;
            case 'activity_log': return <ActivityLogView logs={activityLog} />;
            default: 
                return <AppointmentsReceivedView 
                            appointments={appointments} 
                            doctors={doctors}
                            onUpdateStatus={onUpdateAppointmentStatus} 
                            onAssignDoctor={onAssignDoctorToAppointment}
                        />;
        }
    };

    return (
        <div className="flex h-screen bg-srm-gray font-sans text-srm-darkgray">
            <ReceptionistSidebar activeView={activeView} setActiveView={setActiveView} />
            <main className="flex-1 flex flex-col overflow-hidden">
                <Header title={getHeaderTitle()} onLogout={onLogout} userRole={userRole} />
                <div className="flex-1 overflow-y-auto p-6 lg:p-8">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};