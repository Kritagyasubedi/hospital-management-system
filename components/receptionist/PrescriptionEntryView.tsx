
import React, { useState } from 'react';
import type { Patient, PatientPrescription } from '../../types';

interface PrescriptionEntryViewProps {
    onAddPrescription: (patientId: string, prescriptionData: Omit<PatientPrescription, 'id' | 'doctor'>) => void;
    patients: Patient[];
}

export const PrescriptionEntryView: React.FC<PrescriptionEntryViewProps> = ({ onAddPrescription, patients }) => {
    const initialState = {
        patientId: '', medication: '', dosage: '', instructions: '', date: new Date().toISOString().split('T')[0], reason: '', patientType: 'outpatient' as 'inpatient' | 'outpatient'
    };
    const [formData, setFormData] = useState(initialState);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { patientId, ...prescriptionData } = formData;
        onAddPrescription(patientId, prescriptionData);
        setIsSubmitted(true);
        setFormData({...initialState, date: new Date().toISOString().split('T')[0]});
        setTimeout(() => setIsSubmitted(false), 3000);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-srm-darkgray mb-6 border-b pb-4">Enter Prescription Details</h3>
             {isSubmitted && (
                 <div className="mb-4 p-3 bg-green-100 text-green-800 text-sm font-semibold rounded-md">
                    Prescription submitted to Pharmacy successfully!
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                 <div>
                    <label className="font-medium text-gray-700">Select Patient</label>
                    <select name="patientId" value={formData.patientId} onChange={handleChange} required className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white">
                        <option value="">-- Select a Patient --</option>
                        {patients.map(p => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}
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
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="font-medium text-gray-700">Medicine Name</label>
                        <input type="text" name="medication" value={formData.medication} onChange={handleChange} required className="w-full mt-1 p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="font-medium text-gray-700">Dosage (e.g., 500mg)</label>
                        <input type="text" name="dosage" value={formData.dosage} onChange={handleChange} required className="w-full mt-1 p-2 border border-gray-300 rounded-md" />
                    </div>
                </div>
                 <div>
                    <label className="font-medium text-gray-700">Instructions / Frequency</label>
                    <input type="text" name="instructions" value={formData.instructions} onChange={handleChange} required className="w-full mt-1 p-2 border border-gray-300 rounded-md" placeholder="e.g., 1 tablet twice a day after meals for 5 days"/>
                </div>
                <div>
                    <label className="font-medium text-gray-700">Reason for Prescription</label>
                    <input type="text" name="reason" value={formData.reason} onChange={handleChange} required className="w-full mt-1 p-2 border border-gray-300 rounded-md" placeholder="e.g., Fever and cough"/>
                </div>
                <div className="pt-2">
                     <button type="submit" className="w-full bg-srm-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors">
                        Send to Pharmacy
                    </button>
                </div>
            </form>
        </div>
    );
};
