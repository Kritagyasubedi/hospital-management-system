
import React, { useState } from 'react';
import { mockAppointments } from '../../services/mockData';
import type { Appointment, Patient, Doctor } from '../../types';

const CalendarDay: React.FC<{ day: string, date: number, isToday?: boolean }> = ({ day, date, isToday }) => (
    <div className={`p-2 border-r border-b ${isToday ? 'bg-srm-lightblue' : 'bg-white'}`}>
        <p className={`text-xs ${isToday ? 'font-bold text-srm-blue' : 'text-gray-500'}`}>{day}</p>
        <p className={`text-lg font-semibold ${isToday ? 'text-srm-blue' : 'text-gray-800'}`}>{date}</p>
    </div>
);

interface RegistrationViewProps {
    appointments?: Appointment[];
    patients?: Patient[];
    doctors?: Doctor[];
    onBookAppointment?: (details: Omit<Appointment, 'id' | 'status'>) => void;
    onAddPatient?: (details: any) => Patient;
}

export const RegistrationView: React.FC<RegistrationViewProps> = ({ 
    appointments, 
    patients = [], 
    doctors = [], 
    onBookAppointment 
}) => {
    const [patientName, setPatientName] = useState('');
    const [selectedPid, setSelectedPid] = useState('');
    const [department, setDepartment] = useState('Cardiology');
    const [doctor, setDoctor] = useState('Dr. Evelyn Reed');
    const [dateTime, setDateTime] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    const activeAppointments = appointments && appointments.length > 0 ? appointments : mockAppointments;

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

    const handlePatientSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const pid = e.target.value;
        setSelectedPid(pid);
        if (pid) {
            const p = patients.find(pat => pat.id === pid);
            if (p) setPatientName(p.name);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalName = patientName.trim();
        if (!finalName) {
            alert('Please enter or select a patient name.');
            return;
        }

        const datePart = dateTime ? dateTime.split('T')[0] : new Date().toISOString().split('T')[0];
        const timePart = dateTime && dateTime.includes('T') ? dateTime.split('T')[1] : '10:00 AM';

        const finalPid = selectedPid || `PID${Math.floor(100000 + Math.random() * 900000)}`;

        if (onBookAppointment) {
            onBookAppointment({
                patientId: finalPid,
                patientName: finalName,
                department,
                doctor: doctor || 'Dr. Evelyn Reed',
                date: datePart,
                time: timePart,
                symptoms: symptoms || `${department} consultation`,
            });
            setStatusMessage(`Appointment successfully booked for ${finalName}!`);
            setPatientName('');
            setSelectedPid('');
            setSymptoms('');
            setDateTime('');
            setTimeout(() => setStatusMessage(''), 4000);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div>
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-srm-darkgray">Upcoming Appointments ({activeAppointments.length})</h3>
                        <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">Live Hospital Sync</span>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm mt-4 overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-xs text-gray-700 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-3">Time</th>
                                    <th className="px-6 py-3">Patient</th>
                                    <th className="px-6 py-3">Doctor</th>
                                    <th className="px-6 py-3">Department</th>
                                    <th className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeAppointments.map(appt => (
                                    <tr key={appt.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium">{appt.time} <span className="text-xs text-gray-400 block">{appt.date}</span></td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{appt.patientName}</td>
                                        <td className="px-6 py-4">{appt.doctor}</td>
                                        <td className="px-6 py-4">{appt.department}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appt.status)}`}>
                                                {appt.status.replace(/([A-Z])/g, ' $1').trim()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div>
                     <h3 className="text-xl font-semibold text-srm-darkgray">Weekly Schedule</h3>
                     <div className="grid grid-cols-7 border-t border-l border-gray-200 mt-4 rounded-lg overflow-hidden shadow-sm">
                        <CalendarDay day="Mon" date={18} />
                        <CalendarDay day="Tue" date={19} />
                        <CalendarDay day="Wed" date={20} />
                        <CalendarDay day="Thu" date={21} isToday />
                        <CalendarDay day="Fri" date={22} />
                        <CalendarDay day="Sat" date={23} />
                        <CalendarDay day="Sun" date={24} />
                     </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-srm-darkgray mb-4">Book New Appointment</h3>
                {statusMessage && (
                    <div className="mb-4 p-3 bg-green-100 text-green-800 text-xs font-semibold rounded-lg">
                        {statusMessage}
                    </div>
                )}
                <form onSubmit={handleFormSubmit} className="space-y-4 text-sm">
                    {patients.length > 0 && (
                        <div>
                            <label className="font-medium text-gray-700">Select Existing Patient (Optional)</label>
                            <select 
                                value={selectedPid} 
                                onChange={handlePatientSelectChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-srm-blue focus:border-srm-blue bg-white"
                            >
                                <option value="">-- Or enter new patient below --</option>
                                {patients.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div>
                        <label className="font-medium text-gray-700">Patient Full Name</label>
                        <input 
                            type="text" 
                            required
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-srm-blue focus:border-srm-blue" 
                            placeholder="e.g., John Doe"
                        />
                    </div>
                     <div>
                        <label className="font-medium text-gray-700">Department</label>
                        <select 
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-srm-blue focus:border-srm-blue bg-white"
                        >
                            <option value="Cardiology">Cardiology</option>
                            <option value="Neurology">Neurology</option>
                            <option value="Orthopedics">Orthopedics</option>
                            <option value="Pediatrics">Pediatrics</option>
                            <option value="General Medicine">General Medicine</option>
                            <option value="Emergency">Emergency</option>
                            <option value="Gynecology">Gynecology</option>
                        </select>
                    </div>
                    <div>
                        <label className="font-medium text-gray-700">Consulting Doctor</label>
                        <select 
                            value={doctor}
                            onChange={(e) => setDoctor(e.target.value)}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-srm-blue focus:border-srm-blue bg-white"
                        >
                            {doctors.map(d => (
                                <option key={d.id} value={d.name}>{d.name} ({d.department})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="font-medium text-gray-700">Date & Time</label>
                        <input 
                            type="datetime-local" 
                            required
                            value={dateTime}
                            onChange={(e) => setDateTime(e.target.value)}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-srm-blue focus:border-srm-blue"
                        />
                    </div>
                    <div>
                        <label className="font-medium text-gray-700">Symptoms / Chief Complaint</label>
                        <input 
                            type="text" 
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                            placeholder="e.g., Chest discomfort, palpitation"
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-srm-blue focus:border-srm-blue"
                        />
                    </div>
                    <button type="submit" className="w-full bg-srm-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors shadow-sm">
                        Book Appointment
                    </button>
                </form>
            </div>
        </div>
    );
};
