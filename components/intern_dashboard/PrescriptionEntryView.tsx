import React, { useState } from 'react';
import type { Patient, PatientPrescription, Doctor } from '../../types';

interface PrescriptionEntryViewProps {
    onAddPrescription: (patientId: string, prescriptionData: Omit<PatientPrescription, 'id' | 'doctor'>) => void;
    patients: Patient[];
    doctors: Doctor[];
}

export const PrescriptionEntryView: React.FC<PrescriptionEntryViewProps> = ({ onAddPrescription, patients, doctors }) => {
    const initialState = {
        patientId: '', medication: '', dosage: '', instructions: '', date: new Date().toISOString().split('T')[0], reason: '', instructingDoctorId: '', patientType: 'outpatient' as 'inpatient' | 'outpatient'
    };
    const [formData, setFormData] = useState(initialState);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { patientId, instructingDoctorId, ...rest } = formData;
        onAddPrescription(patientId, rest);
        setIsSubmitted(true);
        setFormData({...initialState, date: new Date().toISOString().split('T')[0]});
        setTimeout(() => setIsSubmitted(false), 3000);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-srm-darkgray mb-6 border-b pb-4">Enter Prescription (As Instructed)</h3>
             {isSubmitted && (
                 <div className="mb-4 p-3 bg-green-100 text-green-800 text-sm font-semibold rounded-md">
                    Prescription submitted successfully!
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                 <div>
                    <label className="font-medium text-gray-700">Select Patient</label>
                    <select name="patientId" value={formData.patientId} onChange={handleChange} required className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white">
                        <option value="">-- Select a Patient --</option>
                        {patients.filter(p => p.status === 'WAITING_FOR_DOCTOR' || p.assignedDoctorId).map(p => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}
                    </select>
                </div>
                
                <div>
                    <label className="font-medium text-gray-700">Patient Type</label>
                    <div className="flex space-x-4 mt-1">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="patientType"
                                value="outpatient"
                                checked={formData.patientType === 'outpatient'}
                                onChange={handleChange}
                                className="text-srm-blue focus:ring-srm-blue"
                            />
                            <span className="ml-2">Outpatient</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="patientType"
                                value="inpatient"
                                checked={formData.patientType === 'inpatient'}
                                onChange={handleChange}
                                className="text-srm-blue focus:ring-srm-blue"
                            />
                            <span className="ml-2">Inpatient</span>
                        </label>
                    </div>
                </div>
                
                <div>
                    <label className="font-medium text-gray-700">Instructing Doctor</label>
                    <select name="instructingDoctorId" value={formData.instructingDoctorId} onChange={handleChange} required className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white">
                        <option value="">-- Select Doctor --</option>
                        {doctors.map(d => <option key={d.id} value={d.id}>{d.name} - {d.department}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="medication" value={formData.medication} onChange={handleChange} required placeholder="Medicine Name" className="w-full p-2 border rounded-md" />
                    <input type="text" name="dosage" value={formData.dosage} onChange={handleChange} required placeholder="Dosage (e.g., 500mg)" className="w-full p-2 border rounded-md" />
                </div>
                <textarea name="instructions" value={formData.instructions} onChange={handleChange} required rows={2} placeholder="Instructions (e.g., 1 tablet twice a day for 5 days)" className="w-full p-2 border rounded-md" />
                <input type="text" name="reason" value={formData.reason} onChange={handleChange} required placeholder="Reason for Prescription" className="w-full p-2 border rounded-md" />
                <div className="pt-2">
                     <button type="submit" className="w-full bg-srm-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90">
                        Send to Pharmacy
                    </button>
                </div>
            </form>
        </div>
    );
};
