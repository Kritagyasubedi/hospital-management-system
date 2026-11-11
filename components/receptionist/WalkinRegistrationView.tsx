

import React, { useState } from 'react';
import type { Patient } from '../../types';

interface WalkinRegistrationViewProps {
    onAddPatient: (details: Omit<Patient, 'id' | 'triageInfo' | 'clinicalNotes' | 'prescriptions' | 'referrals' | 'bloodType' | 'password' | 'dob' | 'medicalHistory'> & { symptoms: string, bp: string, temp: string, pulse: string, dob: string }) => Patient;
}

export const WalkinRegistrationView: React.FC<WalkinRegistrationViewProps> = ({ onAddPatient }) => {
    const initialState = {
        name: '',
        age: '',
        gender: 'Male' as Patient['gender'],
        phoneNumber: '',
        symptoms: '',
        bp: '',
        temp: '',
        pulse: '',
        dob: '',
        maritalStatus: 'Single' as Patient['maritalStatus'],
        guardianName: '',
    };
    const [formData, setFormData] = useState(initialState);
    const [submittedPatient, setSubmittedPatient] = useState<Patient | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newPatient = onAddPatient({ ...formData, age: parseInt(formData.age, 10) || 0 });
        setSubmittedPatient(newPatient);
        setFormData(initialState);
    };

    if (submittedPatient) {
        return (
            <div className="text-center p-8 bg-green-50 rounded-xl shadow-sm max-w-lg mx-auto">
                <h4 className="text-xl font-bold text-srm-green">Patient Registered Successfully!</h4>
                <p className="text-gray-600 mt-2">
                    <span className="font-semibold">{submittedPatient.name}</span> has been registered.
                </p>
                <p className="mt-2 text-gray-700">Their unique Patient ID (PID) is:</p>
                <p className="mt-2 text-xl font-mono p-3 bg-srm-lightblue rounded-lg text-srm-blue tracking-wider font-bold">{submittedPatient.id}</p>
                <button onClick={() => setSubmittedPatient(null)} className="mt-6 bg-srm-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90">
                    Register Another Patient
                </button>
            </div>
        )
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-srm-darkgray mb-6 border-b pb-4">New Walk-in Patient Registration</h3>
            <form onSubmit={handleSubmit} className="space-y-6 text-sm">
                <fieldset className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <legend className="text-lg font-semibold text-srm-blue mb-2 col-span-full">Patient Details</legend>
                    <div className="lg:col-span-2">
                        <label className="font-medium text-gray-700">Full Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full mt-1 p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="font-medium text-gray-700">Age</label>
                        <input type="number" name="age" value={formData.age} onChange={handleChange} required className="w-full mt-1 p-2 border border-gray-300 rounded-md" />
                    </div>
                     <div>
                        <label className="font-medium text-gray-700">Date of Birth</label>
                        <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="w-full mt-1 p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="font-medium text-gray-700">Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white">
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="font-medium text-gray-700">Contact Number</label>
                        <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required className="w-full mt-1 p-2 border border-gray-300 rounded-md" />
                    </div>
                     <div>
                        <label className="font-medium text-gray-700">Guardian Name</label>
                        <input type="text" name="guardianName" value={formData.guardianName} onChange={handleChange} required className="w-full mt-1 p-2 border border-gray-300 rounded-md" />
                    </div>
                     <div>
                        <label className="font-medium text-gray-700">Marital Status</label>
                        <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white">
                             <option value="Single">Single</option>
                             <option value="Married">Married</option>
                             <option value="Divorced">Divorced</option>
                             <option value="Widowed">Widowed</option>
                        </select>
                    </div>
                </fieldset>

                <fieldset className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <legend className="text-lg font-semibold text-srm-blue mb-2 col-span-full">Symptoms & Initial Vitals</legend>
                    <div className="md:col-span-3">
                         <label className="font-medium text-gray-700">Presenting Symptoms</label>
                        <textarea name="symptoms" value={formData.symptoms} onChange={handleChange} required rows={3} className="w-full mt-1 p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="font-medium text-gray-700">Blood Pressure (e.g. 120/80)</label>
                        <input type="text" name="bp" value={formData.bp} onChange={handleChange} required className="w-full mt-1 p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="font-medium text-gray-700">Temperature (°C)</label>
                        <input type="text" name="temp" value={formData.temp} onChange={handleChange} required className="w-full mt-1 p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="font-medium text-gray-700">Pulse (bpm)</label>
                        <input type="number" name="pulse" value={formData.pulse} onChange={handleChange} required className="w-full mt-1 p-2 border border-gray-300 rounded-md" />
                    </div>
                </fieldset>

                <div className="pt-4 border-t">
                    <button type="submit" className="w-full bg-srm-blue text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors text-base">
                        Register Patient
                    </button>
                </div>
            </form>
        </div>
    );
};