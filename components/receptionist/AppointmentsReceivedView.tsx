
import React, { useState } from 'react';
import type { Appointment, Doctor } from '../../types';

interface AppointmentsReceivedViewProps {
    appointments: Appointment[];
    doctors: Doctor[];
    onUpdateStatus: (appointmentId: string, status: 'Confirmed' | 'Cancelled' | 'Rejected') => void;
    onAssignDoctor: (appointmentId: string, doctorId: string) => void;
}

export const AppointmentsReceivedView: React.FC<AppointmentsReceivedViewProps> = ({ appointments, doctors, onUpdateStatus, onAssignDoctor }) => {

    const getStatusColor = (status: Appointment['status']) => {
        switch (status) {
            case 'Confirmed': return 'bg-green-100 text-green-800';
            case 'PendingApproval': return 'bg-yellow-100 text-yellow-800';
            case 'PendingDoctorAssignment': return 'bg-blue-100 text-blue-800';
            case 'Cancelled': return 'bg-gray-100 text-gray-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
        }
    };

    const getStatusLabel = (status: Appointment['status']) => {
        switch (status) {
            case 'Confirmed': return 'Confirmed';
            case 'PendingApproval': return 'Pending Approval';
            case 'PendingDoctorAssignment': return 'Pending Doctor Assignment';
            case 'Cancelled': return 'Cancelled';
            case 'Rejected': return 'Rejected';
        }
    };
    
    const pendingAppointments = appointments.filter(a => a.status === 'PendingApproval' || a.status === 'PendingDoctorAssignment');
    const processedAppointments = appointments.filter(a => a.status === 'Confirmed' || a.status === 'Cancelled' || a.status === 'Rejected');

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-semibold text-srm-darkgray">Online Appointments Received</h3>
                <p className="text-gray-500 mt-1">Review and manage appointments booked through the patient portal.</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <h4 className="text-lg font-semibold text-srm-darkgray p-4 border-b">Pending Actions ({pendingAppointments.length})</h4>
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs text-gray-700 uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-3">Patient Name</th>
                            <th className="px-6 py-3">Date & Time</th>
                            <th className="px-6 py-3">Department</th>
                            <th className="px-6 py-3">Doctor</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingAppointments.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-gray-500">No new appointments received.</td>
                            </tr>
                        )}
                        {pendingAppointments.map(appt => (
                            <tr key={appt.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{appt.patientName}</td>
                                <td className="px-6 py-4">{new Date(appt.date).toLocaleDateString()} at {appt.time}</td>
                                <td className="px-6 py-4">{appt.department}</td>
                                <td className="px-6 py-4">{appt.doctor || 'Not assigned'}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appt.status)}`}>
                                        {getStatusLabel(appt.status)}
                                    </span>
                                </td>
                                 <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                                    <button
                                        onClick={() => onUpdateStatus(appt.id, 'Confirmed')}
                                        className="px-3 py-1 text-xs font-semibold text-white bg-green-600 rounded-full hover:bg-green-700 transition-colors"
                                    >
                                        Confirm
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Are you sure you want to reject this appointment? This action cannot be undone.')) {
                                                onUpdateStatus(appt.id, 'Rejected');
                                            }
                                        }}
                                        className="px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded-full hover:bg-red-700 transition-colors"
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <h4 className="text-lg font-semibold text-srm-darkgray p-4 border-b">Processed Appointments ({processedAppointments.length})</h4>
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs text-gray-700 uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-3">Patient Name</th>
                            <th className="px-6 py-3">Date & Time</th>
                            <th className="px-6 py-3">Department</th>
                            <th className="px-6 py-3">Doctor</th>
                            <th className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                         {processedAppointments.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-500">No processed appointments yet.</td>
                            </tr>
                        )}
                         {processedAppointments.map(appt => (
                            <tr key={appt.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{appt.patientName}</td>
                                <td className="px-6 py-4">{new Date(appt.date).toLocaleDateString()} at {appt.time}</td>
                                <td className="px-6 py-4">{appt.department}</td>
                                <td className="px-6 py-4">{appt.doctor || 'Not assigned'}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appt.status)}`}>
                                        {getStatusLabel(appt.status)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};