
import React, { useState } from 'react';
import type { Patient } from '../../types';

interface AssignDoctorViewProps {
    patients: Patient[];
}

const doctorsByDept = {
  'Cardiology': 'Dr. Evelyn Reed',
  'Orthopedics': 'Dr. Ben Carter',
  'Neurology': 'Dr. Alice Johnson',
  'ENT': 'Dr. Samuel Wilson',
  'General Medicine': 'Dr. Chloe Davis',
  'Pediatrics': 'Dr. Olivia Garcia',
  'Gynecology': 'Dr. Sarah Johnson'
};

export const AssignDoctorView: React.FC<AssignDoctorViewProps> = ({ patients }) => {
    const [patientId, setPatientId] = useState('');
    const [department, setDepartment] = useState('');
    const [isAssigned, setIsAssigned] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(patientId && department) {
            setIsAssigned(true);
            setTimeout(() => {
                setIsAssigned(false);
                setPatientId('');
                setDepartment('');
            }, 4000);
        }
    };
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-srm-darkgray mb-6 border-b pb-4">Assign Patient to Doctor</h3>
            {isAssigned && (
                 <div className="mb-4 p-3 bg-green-100 text-green-800 text-sm font-semibold rounded-md">
                    Patient assigned to {doctorsByDept[department as keyof typeof doctorsByDept]}'s queue successfully!
                </div>
            )}
             <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                <div>
                    <label className="font-medium text-gray-700">Select Patient</label>
                    <select value={patientId} onChange={e => setPatientId(e.target.value)} required className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white">
                        <option value="">-- Select a Patient --</option>
                        {patients.map(p => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}
                    </select>
                </div>
                 <div>
                    <label className="font-medium text-gray-700">Assign to Department/Doctor</label>
                    <select value={department} onChange={e => setDepartment(e.target.value)} required className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white">
                        <option value="">-- Select a Department --</option>
                        {Object.entries(doctorsByDept).map(([dept, doctor]) => (
                            <option key={dept} value={dept}>{dept} - {doctor}</option>
                        ))}
                    </select>
                </div>
                <div className="pt-2">
                    <button type="submit" className="w-full bg-srm-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors">
                        Assign to Doctor's Queue
                    </button>
                </div>
            </form>
        </div>
    );
};
