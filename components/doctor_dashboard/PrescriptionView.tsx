import React, { useState } from 'react';
import type { Patient, PatientPrescription } from '../../types';

interface PrescriptionViewProps {
    onAddPrescription: (patientId: string, prescriptionData: Omit<PatientPrescription, 'id' | 'doctor'>, doctorName: string) => void;
    patients: Patient[];
    doctorName: string;
}

// Define a type for the medication entry
interface MedicationEntry {
    id: string;
    medication: string;
    dosage: string;
    instructions: string;
}

export const PrescriptionView: React.FC<PrescriptionViewProps> = ({ onAddPrescription, patients, doctorName }) => {
    const initialState = {
        patientId: '',
        reason: '',
        date: new Date().toISOString().split('T')[0],
        patientType: 'outpatient' as 'inpatient' | 'outpatient' // Add this field
    };
    
    const [formData, setFormData] = useState(initialState);
    const [medications, setMedications] = useState<MedicationEntry[]>([{ id: Date.now().toString(), medication: '', dosage: '', instructions: '' }]);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle changes to medication entries
    const handleMedicationChange = (id: string, field: keyof MedicationEntry, value: string) => {
        setMedications(prev => 
            prev.map(med => 
                med.id === id ? { ...med, [field]: value } : med
            )
        );
    };

    // Add a new medication entry
    const addMedication = () => {
        setMedications(prev => [...prev, { id: Date.now().toString(), medication: '', dosage: '', instructions: '' }]);
    };

    // Remove a medication entry
    const removeMedication = (id: string) => {
        if (medications.length > 1) {
            setMedications(prev => prev.filter(med => med.id !== id));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate that at least one medication is filled
        const hasValidMedication = medications.some(
            med => med.medication.trim() !== '' && med.dosage.trim() !== ''
        );
        
        if (!hasValidMedication) {
            alert('Please add at least one medication with name and dosage.');
            return;
        }
        
        // Submit each medication as a separate prescription
        medications
            .filter(med => med.medication.trim() !== '' && med.dosage.trim() !== '')
            .forEach(med => {
                const prescriptionData = {
                    medication: med.medication,
                    dosage: med.dosage,
                    instructions: med.instructions,
                    date: formData.date,
                    reason: formData.reason,
                    patientType: formData.patientType // Add this field
                };
                onAddPrescription(formData.patientId, prescriptionData, doctorName);
            });
            
        setIsSubmitted(true);
        setFormData({...initialState, date: new Date().toISOString().split('T')[0]});
        setMedications([{ id: Date.now().toString(), medication: '', dosage: '', instructions: '' }]);
        setTimeout(() => setIsSubmitted(false), 3000);
    };
    
    const selectedPatient = patients.find(p => p.id === formData.patientId);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold text-srm-darkgray mb-6 border-b pb-4">Create E-Prescription</h3>
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
                    
                    <div>
                        <label className="font-medium text-gray-700">Reason / Diagnosis</label>
                        <input type="text" name="reason" value={formData.reason} onChange={handleChange} required className="w-full mt-1 p-2 border border-gray-300 rounded-md" />
                    </div>
                    
                    <div>
                        <label className="font-medium text-gray-700">Date</label>
                        <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full mt-1 p-2 border border-gray-300 rounded-md" />
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="font-medium text-gray-700">Medications</h4>
                            <button 
                                type="button" 
                                onClick={addMedication}
                                className="text-srm-blue hover:text-srm-darkblue text-sm font-medium"
                            >
                                + Add Medication
                            </button>
                        </div>
                        
                        {medications.map((med, index) => (
                            <div key={med.id} className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50">
                                <div className="flex justify-between items-start mb-2">
                                    <h5 className="font-medium text-gray-700">Medication {index + 1}</h5>
                                    {medications.length > 1 && (
                                        <button 
                                            type="button" 
                                            onClick={() => removeMedication(med.id)}
                                            className="text-red-500 hover:text-red-700 text-sm"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="font-medium text-gray-700 text-xs">Medication Name</label>
                                        <input 
                                            type="text" 
                                            value={med.medication} 
                                            onChange={(e) => handleMedicationChange(med.id, 'medication', e.target.value)} 
                                            required 
                                            className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm" 
                                            placeholder="e.g., Paracetamol"
                                        />
                                    </div>
                                    <div>
                                        <label className="font-medium text-gray-700 text-xs">Dosage</label>
                                        <input 
                                            type="text" 
                                            value={med.dosage} 
                                            onChange={(e) => handleMedicationChange(med.id, 'dosage', e.target.value)} 
                                            required 
                                            className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm" 
                                            placeholder="e.g., 500mg"
                                        />
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <label className="font-medium text-gray-700 text-xs">Instructions / Frequency</label>
                                    <textarea 
                                        value={med.instructions} 
                                        onChange={(e) => handleMedicationChange(med.id, 'instructions', e.target.value)} 
                                        rows={2} 
                                        className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm" 
                                        placeholder="e.g., Take 1 tablet twice daily after meals"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="pt-2">
                        <button type="submit" className="w-full bg-srm-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors">
                            Finalize & Send to Pharmacy
                        </button>
                    </div>
                </form>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold text-srm-darkgray mb-6 border-b pb-4">Patient's Prescription History</h3>
                {selectedPatient ? (
                    selectedPatient.prescriptions.length > 0 ? (
                        <ul className="space-y-3 max-h-96 overflow-y-auto">
                            {selectedPatient.prescriptions.map(rx => (
                                <li key={rx.id} className="p-3 bg-gray-50 rounded-md border text-sm">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-srm-darkgray">{rx.medication} ({rx.dosage})</p>
                                            <p className="text-gray-600">{rx.instructions}</p>
                                        </div>
                                        {rx.patientType && (
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                rx.patientType === 'inpatient' 
                                                    ? 'bg-purple-100 text-purple-800' 
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                                {rx.patientType.charAt(0).toUpperCase() + rx.patientType.slice(1)}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Prescribed by {rx.doctor} on {rx.date}</p>
                                    {rx.reason && (
                                        <p className="text-xs text-gray-500 mt-1">Reason: {rx.reason}</p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500 text-center py-8">No prescription history for this patient.</p>
                    )
                ) : (
                    <p className="text-sm text-gray-500 text-center py-8">Select a patient to view their history.</p>
                )}
            </div>
        </div>
    );
};