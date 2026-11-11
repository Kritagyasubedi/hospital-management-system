import React, { useState, useEffect } from 'react';
import type { Patient, Appointment, Doctor, Notification } from '../../types';
import { 
    LogoutIcon, 
    ArrowLeftIcon, 
    ProfileDobIcon, 
    ProfileGenderIcon, 
    ProfileMobileIcon, 
    ProfileMaritalStatusIcon,
    BellIcon
} from '../icons';
import { PatientSidebar } from './PatientSidebar';
import { AppointmentBooking } from './AppointmentBooking';
import { VitalsMonitoringView } from './VitalsMonitoringView';
import { PrescriptionHistory } from './PrescriptionHistory';
import { ReferralHistory } from './ReferralHistory';
import { UrgencyStatus } from './UrgencyStatus';
import { MedicalHistoryView } from '../MedicalHistoryView';
import { AIHealthAdvisor } from './AIHealthAdvisor';

type PatientView = 'dashboard' | 'book-appointment' | 'vitals' | 'prescriptions' | 'referrals' | 'ai-advisor';

const PatientProfileHeader: React.FC = () => (
    <header className="bg-srm-blue text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-2xl font-bold text-srm-gold-text">NEURONEXUS</h1>
            <p className="text-sm opacity-90">AI-Powered Supporter System</p>
        </div>
    </header>
);

const ProfileInfoRow: React.FC<{ icon: React.ElementType, label: string, value: string | null }> = ({ icon: Icon, label, value }) => (
    <div className="flex items-start space-x-3">
        <Icon className="w-6 h-6 text-srm-header-green mt-1" />
        <div>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="font-semibold text-gray-800">{value || 'N/A'}</p>
        </div>
    </div>
);

const DashboardContent: React.FC<{ patient: Patient, appointments: Appointment[] }> = ({ patient, appointments }) => {
    const formatDate = (dateString: string) => {
        try {
            // Handle dd.mm.yyyy format from signup
            const parts = dateString.split('.');
            if (parts.length === 3) {
                dateString = `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return 'Invalid Date';
            }
            const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
            return date.toLocaleDateString('en-GB', options);
        } catch (error) {
            return 'Invalid Date';
        }
    };
    
    const getStatusColor = (status: Appointment['status']) => {
        switch (status) {
            case 'Confirmed': return 'bg-green-100 text-green-800';
            case 'PendingApproval': return 'bg-yellow-100 text-yellow-800';
            case 'PendingDoctorAssignment': return 'bg-blue-100 text-blue-800';
            case 'Cancelled': return 'bg-gray-100 text-gray-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: Appointment['status']) => {
        switch (status) {
            case 'Confirmed': return 'Confirmed';
            case 'PendingApproval': return 'Pending Approval';
            case 'PendingDoctorAssignment': return 'Awaiting Doctor Assignment';
            case 'Cancelled': return 'Cancelled';
            case 'Rejected': return 'Rejected';
            default: return status;
        }
    };


    return (
         <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-srm-darkgray">Welcome, {patient.name.split(' ')[0]}</h2>
                    <p className="text-sm text-gray-500 font-semibold">Patient ID: <span className="font-bold text-srm-header-green">{patient.id}</span></p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-bold text-srm-darkgray mb-6">My Profile</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                        <ProfileInfoRow icon={ProfileDobIcon} label="Date of Birth" value={formatDate(patient.dob)} />
                        <ProfileInfoRow icon={ProfileGenderIcon} label="Gender" value={patient.gender} />
                        <ProfileInfoRow icon={ProfileMobileIcon} label="Mobile Number" value={patient.phoneNumber} />
                        <ProfileInfoRow icon={ProfileMaritalStatusIcon} label="Marital Status" value={patient.maritalStatus} />
                    </div>
                </div>
                 <div className="space-y-6">
                    <UrgencyStatus risk={patient.triageInfo.risk} />
                 </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-srm-darkgray mb-4">My Appointments</h3>
                {appointments.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                             <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                                <tr>
                                    <th className="px-4 py-2 text-left">Date & Time</th>
                                    <th className="px-4 py-2 text-left">Department</th>
                                    <th className="px-4 py-2 text-left">Doctor</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map(appt => (
                                    <tr key={appt.id} className="border-b">
                                        <td className="px-4 py-3 font-semibold">{new Date(appt.date).toLocaleDateString('en-GB')} at {appt.time}</td>
                                        <td className="px-4 py-3">{appt.department}</td>
                                        <td className="px-4 py-3">{appt.doctor}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appt.status)}`}>
                                                {getStatusLabel(appt.status)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-8">
                        <p>No upcoming appointments found.</p>
                    </div>
                )}
            </div>

            <MedicalHistoryView patient={patient} />

            <AIHealthAdvisor patient={patient} />
        </div>
    );
}


export const PatientDashboard: React.FC<{ 
    patient: Patient; 
    doctors: Doctor[];
    appointments: Appointment[];
    notifications: Notification[];
    onLogout: () => void; 
    onBookAppointment: (details: Omit<Appointment, 'id' | 'status'>) => void; 
    onMarkNotificationsAsRead: () => void;
    logPatientActivity: (patientId: string, action: string) => void;
}> = ({ patient, doctors, appointments, notifications, onLogout, onBookAppointment, onMarkNotificationsAsRead, logPatientActivity }) => {
    const [activeView, setActiveView] = useState<PatientView>('dashboard');
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        // Log activity when the view changes, but not for the initial 'dashboard' view
        if (activeView !== 'dashboard') {
            const viewToActionMap = {
                'book-appointment': 'Viewed Appointment Booking Page',
                'vitals': 'Viewed Vitals Monitoring',
                'prescriptions': 'Viewed Prescription History',
                'referrals': 'Viewed Referral History',
            };
            logPatientActivity(patient.id, viewToActionMap[activeView]);
        }
    }, [activeView, patient.id, logPatientActivity]);


    const unreadCount = notifications.filter(n => !n.read).length;

    const handleToggleNotifications = () => {
        setShowNotifications(prev => !prev);
        if (!showNotifications && unreadCount > 0) {
            onMarkNotificationsAsRead();
        }
    };

    const renderContent = () => {
        switch (activeView) {
          case 'dashboard':
            return <DashboardContent patient={patient} appointments={appointments} />;
          case 'book-appointment':
            return <AppointmentBooking 
              patient={patient}
              doctors={doctors}
              appointments={appointments} 
              onBookAppointment={onBookAppointment} 
            />;
          case 'vitals':
            return <VitalsMonitoringView patient={patient} />;
          case 'prescriptions':
            return <PrescriptionHistory prescriptions={patient.prescriptions} />;
          case 'referrals':
            return <ReferralHistory referrals={patient.referrals} />;
          case 'ai-advisor':
            return <AIHealthAdvisor patient={patient} />;
          default:
            return <DashboardContent patient={patient} appointments={appointments} />;
        }
    };

    return (
        <div className="min-h-screen bg-srm-bg-body font-sans flex">
            <PatientSidebar activeView={activeView} setActiveView={setActiveView} />
            <div className="flex-1 flex flex-col">
                <PatientProfileHeader />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                         <div className="flex justify-between items-center mb-6">
                            <button 
                                onClick={onLogout}
                                className="flex items-center space-x-2 bg-srm-yellow-action text-gray-800 font-bold py-2 px-4 rounded-lg shadow hover:opacity-90 transition-opacity"
                            >
                                <ArrowLeftIcon className="w-5 h-5"/>
                                <span>Back to Roles</span>
                            </button>
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <button onClick={handleToggleNotifications} className="relative text-gray-600 hover:text-srm-blue p-2 rounded-full hover:bg-gray-100 transition-colors">
                                        <BellIcon className="w-6 h-6" />
                                        {unreadCount > 0 && (
                                            <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center ring-2 ring-white text-[10px]">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>
                                    {showNotifications && (
                                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-10">
                                            <div className="p-3 font-semibold text-sm border-b">Notifications</div>
                                            <ul className="py-1 max-h-80 overflow-y-auto">
                                                {notifications.length === 0 ? (
                                                    <li className="px-4 py-3 text-sm text-gray-500 text-center">No notifications yet.</li>
                                                ) : (
                                                    notifications.map(n => (
                                                        <li key={n.id} className={`border-l-4 px-4 py-3 ${n.type === 'success' ? 'border-green-500' : 'border-red-500'} ${!n.read ? 'bg-srm-lightblue' : 'bg-white'}`}>
                                                            <p className="text-sm text-gray-800">{n.message}</p>
                                                            <p className="text-xs text-gray-400 mt-1">{new Date(n.timestamp).toLocaleString()}</p>
                                                        </li>
                                                    ))
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                <button 
                                    onClick={onLogout}
                                    className="flex items-center space-x-2 bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-red-700 transition-colors"
                                >
                                    <LogoutIcon className="w-5 h-5" />
                                    <span>Logout</span>
                                </button>
                            </div>
                         </div>
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};
