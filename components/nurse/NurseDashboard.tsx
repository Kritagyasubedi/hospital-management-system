import React, { useState } from 'react';
import type { Patient, WardBed, Appointment } from '../../types';
import { NurseSidebar } from './NurseSidebar';
import { Header } from '../Header';
import {
    InpatientManagementView,
    AdmissionQueueView,
    DischargePlanningView,
    ReportsAnalyticsView,
    SettingsView
} from './index';

type NurseView = 'inpatients' | 'admissions' | 'discharges' | 'reports' | 'settings';

interface NurseDashboardProps {
    onLogout: () => void;
    userRole: string;
    patients: Patient[];
    appointments?: Appointment[];
    beds: WardBed[];
    onAssignBed: (patientId: string, bedId: string) => void;
    onDischargePatient: (patientId: string) => void;
}

export const NurseDashboard: React.FC<NurseDashboardProps> = ({
    onLogout,
    userRole,
    patients,
    appointments = [],
    beds,
    onAssignBed,
    onDischargePatient
}) => {
    const [activeView, setActiveView] = useState<NurseView>('inpatients');

    // Filter patients who are inpatients (have assigned beds)
    const inpatients = patients.filter(patient => 
        patient.status === 'IN_CONSULTATION' || 
        patient.status === 'DISCHARGED' ||
        beds.some(bed => bed.patientName === patient.name)
    );

    // Filter patients waiting for admission
    const waitingPatients = patients.filter(patient => 
        patient.status === 'WAITING_FOR_INTERN' || 
        patient.status === 'WAITING_FOR_DOCTOR' ||
        patient.status === 'REGISTERED' ||
        appointments.some(a => a.patientId === patient.id)
    );

    const getHeaderTitle = () => {
        const viewTitles: Record<NurseView, string> = {
            inpatients: 'Inpatient Management',
            admissions: 'Admission Queue',
            discharges: 'Discharge Planning',
            reports: 'Reports & Analytics',
            settings: 'Settings'
        };
        return viewTitles[activeView] || 'Nurse Head Portal';
    };

    const renderContent = () => {
        switch (activeView) {
            case 'inpatients':
                return <InpatientManagementView 
                    patients={inpatients} 
                    beds={beds} 
                    onAssignBed={onAssignBed}
                />;
            case 'admissions':
                return <AdmissionQueueView 
                    patients={waitingPatients} 
                    beds={beds}
                    onAssignBed={onAssignBed}
                />;
            case 'discharges':
                return <DischargePlanningView 
                    patients={inpatients} 
                    onDischargePatient={onDischargePatient}
                />;
            case 'reports':
                return <ReportsAnalyticsView 
                    patients={patients} 
                    beds={beds}
                />;
            case 'settings':
                return <SettingsView />;
            default:
                return <InpatientManagementView 
                    patients={inpatients} 
                    beds={beds} 
                    onAssignBed={onAssignBed}
                />;
        }
    };

    return (
        <div className="flex h-screen bg-srm-gray font-sans text-srm-darkgray">
            <NurseSidebar activeView={activeView} setActiveView={setActiveView} />
            <main className="flex-1 flex flex-col overflow-hidden">
                <Header title={getHeaderTitle()} onLogout={onLogout} userRole={userRole} />
                <div className="flex-1 overflow-y-auto p-6 lg:p-8">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};