import React, { useState, useEffect } from 'react';
import type { Patient, VitalSignEntry } from '../../types';

interface VitalEntriesViewProps {
    onAddVitals: (patientId: string, vitalsData: Omit<VitalSignEntry, 'timestamp'>) => void;
    patients: Patient[];
}

const COMMON_SYMPTOMS = [
    'Fever', 'Cough', 'Fatigue', 'Shortness of breath', 'Chest pain', 'Headache', 'Dizziness', 'Sore throat',
    'Nausea', 'Vomiting', 'Abdominal pain', 'Diarrhea', 'Rash', 'Confusion', 'Weakness', 'Back pain',
    'Palpitations', 'Syncope', 'Bleeding', 'Loss of appetite', 'Anosmia'
];

const COMMON_COMORBIDITIES = [
    'Hypertension', 'Diabetes (Type 2)', 'Asthma', 'COPD', 'Heart Disease',
    'Kidney Disease', 'Arthritis', 'Depression', 'High Cholesterol', 'Obesity', 'Thyroid Disorder'
];

const VITAL_RANGES = {
  temperature: { min: 36.1, max: 37.5, plausibleMax: 43, unit: '°C', label: 'Temperature', description: 'Body temperature. Normal range for an adult is typically 36.1°C to 37.5°C.' },
  heartRate: { min: 60, max: 100, plausibleMax: 250, unit: 'bpm', label: 'Heart Rate', description: 'Heart Rate (Pulse). The number of times your heart beats per minute. Normal resting rate for adults is 60-100 bpm.' },
  respirationRate: { min: 12, max: 20, plausibleMax: 60, unit: 'breaths/min', label: 'Respiration Rate', description: 'Respiration Rate. The number of breaths you take per minute. Normal for a resting adult is 12-20 breaths/min.' },
  bpSystolic: { min: 90, max: 120, plausibleMax: 300, unit: 'mmHg', label: 'BP Systolic', description: 'Systolic Blood Pressure (top number). The pressure in your arteries when your heart beats. Normal is typically below 120 mmHg.' },
  bpDiastolic: { min: 60, max: 80, plausibleMax: 200, unit: 'mmHg', label: 'BP Diastolic', description: 'Diastolic Blood Pressure (bottom number). The pressure in your arteries when your heart rests between beats. Normal is typically below 80 mmHg.' },
};

const InfoIcon: React.FC<{ tooltip: string }> = ({ tooltip }) => (
    <span className="ml-2 text-gray-400 hover:text-gray-600 cursor-help" title={tooltip}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    </span>
);


const ListInput: React.FC<{
    label: string;
    placeholder: string;
    items: string[];
    setItems: React.Dispatch<React.SetStateAction<string[]>>;
}> = ({ label, placeholder, items, setItems }) => {
    const [inputValue, setInputValue] = useState('');

    const handleAdd = () => {
        if (inputValue.trim() && !items.includes(inputValue.trim())) {
            setItems(prev => [...prev, inputValue.trim()]);
            setInputValue('');
        }
    };
    
    const handleRemove = (indexToRemove: number) => {
        setItems(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }}
                    placeholder={placeholder}
                    className="w-full bg-white text-gray-900 border border-gray-300 rounded-md p-2 focus:ring-srm-blue focus:border-srm-blue"
                />
                <button type="button" onClick={handleAdd} className="bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-md hover:bg-gray-300">Add</button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2" aria-live="polite">
                {items.map((item, index) => (
                    <span key={index} className="flex items-center bg-srm-lightblue text-srm-blue text-sm px-2 py-1 rounded-full">
                        {item}
                        <button type="button" onClick={() => handleRemove(index)} className="ml-2 text-srm-blue hover:text-srm-darkgray font-bold" aria-label={`Remove ${item}`}>&times;</button>
                    </span>
                ))}
            </div>
        </div>
    );
};


export const VitalEntriesView: React.FC<VitalEntriesViewProps> = ({ onAddVitals, patients }) => {
    const initialState = {
        patientId: '', temperature: '', heartRate: '', respirationRate: '', bpSystolic: '', bpDiastolic: '',
        height: '', weight: '', consciousness: 'Alert',
    };
    const [formData, setFormData] = useState(initialState);
    const [symptoms, setSymptoms] = useState<string[]>([]);
    const [comorbidities, setComorbidities] = useState<string[]>([]);
    const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);
    const [warnings, setWarnings] = useState<Partial<Record<keyof typeof VITAL_RANGES, string>>>({});

    const selectedPatient = patients.find(p => p.id === formData.patientId);

    // Effect to extract pregnancy status from symptoms summary
    const [pregnancyStatus, setPregnancyStatus] = useState<string | null>(null);
    
    useEffect(() => {
        if (selectedPatient?.triageInfo?.chiefComplaint) {
            setSymptoms(selectedPatient.triageInfo.chiefComplaint.split(/, | and /).map(s => s.trim()).filter(Boolean));
            
            // Extract pregnancy status from symptoms summary
            const symptomsSummary = selectedPatient.triageInfo.chiefComplaint;
            if (symptomsSummary.includes('Pregnancy Status: Yes')) {
                setPregnancyStatus('Yes');
            } else if (symptomsSummary.includes('Pregnancy Status: No')) {
                setPregnancyStatus('No');
            } else {
                // Check if patient profile has pregnancy status
                if (selectedPatient.gender === 'Female' && selectedPatient.isPregnant !== undefined) {
                    setPregnancyStatus(selectedPatient.isPregnant ? 'Yes' : 'No');
                } else {
                    setPregnancyStatus(null);
                }
            }
        } else {
            setSymptoms([]);
            setPregnancyStatus(null);
        }
    }, [selectedPatient]);

    const validateVital = (name: keyof typeof VITAL_RANGES, value: string) => {
        const numValue = parseFloat(value);
        if (isNaN(numValue) || value.trim() === '') {
            setWarnings(prev => {
                const newWarnings = { ...prev };
                delete newWarnings[name];
                return newWarnings;
            });
            return;
        }

        const range = VITAL_RANGES[name];
        
        if (numValue < 0) {
            setWarnings(prev => ({ ...prev, [name]: `Value cannot be negative. Please check.` }));
        } else if (range.plausibleMax && numValue > range.plausibleMax) {
            setWarnings(prev => ({ ...prev, [name]: `Value exceeds maximum plausible limit (${range.plausibleMax}). Please cross-verify.` }));
        } else if (numValue < range.min || numValue > range.max) {
            setWarnings(prev => ({ ...prev, [name]: `Value is outside the normal range (${range.min}-${range.max})` }));
        } else {
            setWarnings(prev => {
                const newWarnings = { ...prev };
                delete newWarnings[name];
                return newWarnings;
            });
        }
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setSubmissionMessage(null);
        const { name, value } = e.target;
        
        const maxLengths: Record<string, number> = {
            temperature: 4,
            heartRate: 3,
            respirationRate: 2,
            bpSystolic: 3,
            bpDiastolic: 3,
            height: 3,
            weight: 5,
        };

        if (maxLengths[name] && value.length > maxLengths[name]) {
            return;
        }
        
        if (Object.keys(VITAL_RANGES).includes(name)) {
            validateVital(name as keyof typeof VITAL_RANGES, value);
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const confirmationMessage = `Please cross-verify the entered vitals before submission:
        - Temperature: ${formData.temperature || 'N/A'} °C
        - Heart Rate: ${formData.heartRate || 'N/A'} bpm
        - Respiration Rate: ${formData.respirationRate || 'N/A'} breaths/min
        - Blood Pressure: ${formData.bpSystolic || 'N/A'} / ${formData.bpDiastolic || 'N/A'} mmHg
        
Are you sure you want to submit? This action cannot be undone.`;

        if (window.confirm(confirmationMessage)) {
            const symptomsSummary = `Symptoms: ${symptoms.join(', ')}. Comorbidities: ${comorbidities.join(', ')}. Consciousness: ${formData.consciousness}.`;

            const height = parseInt(formData.height, 10);
            const weight = parseInt(formData.weight, 10);

            const vitalsData = {
                bloodPressure: { 
                    systolic: parseInt(formData.bpSystolic, 10), 
                    diastolic: parseInt(formData.bpDiastolic, 10), 
                },
                heartRate: parseInt(formData.heartRate, 10),
                temperature: parseFloat(formData.temperature),
                respirationRate: parseInt(formData.respirationRate, 10),
                height: !isNaN(height) ? height : undefined,
                weight: !isNaN(weight) ? weight : undefined,
                symptomsSummary: symptomsSummary,
            };
            
            onAddVitals(formData.patientId, vitalsData);
            
            setSubmissionMessage('Assessment Data Submitted Successfully!');
            setFormData(initialState);
            setSymptoms([]);
            setComorbidities([]);
            setWarnings({});
        }
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-srm-darkgray text-center mb-6">Patient Vitals & Assessment</h2>
            {submissionMessage && (
                <div className="mb-6 p-4 rounded-md bg-green-100 border border-green-300 text-green-800 shadow-sm flex items-center justify-center font-semibold">
                    ✅ {submissionMessage}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                    <label className="font-medium text-gray-700">Select Patient for Assessment</label>
                    <select name="patientId" value={formData.patientId} onChange={handleChange} required className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white">
                        <option value="">-- Select a Patient --</option>
                        {patients.map(p => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}
                    </select>
                </div>
                
                {/* Patient Information Display */}
                {selectedPatient && (
                    <div className="bg-srm-lightblue/30 border border-srm-lightblue/50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-srm-darkgray mb-2">Patient Information</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div>
                                <span className="font-medium text-gray-600">Name:</span>
                                <span className="ml-1">{selectedPatient.name}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-600">Age:</span>
                                <span className="ml-1">{selectedPatient.age}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-600">Gender:</span>
                                <span className="ml-1">{selectedPatient.gender}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-600">Patient ID:</span>
                                <span className="ml-1">{selectedPatient.id}</span>
                            </div>
                            {selectedPatient.gender === 'Female' && pregnancyStatus !== null && (
                                <div>
                                    <span className="font-medium text-gray-600">Pregnancy Status:</span>
                                    <span className={`ml-1 font-semibold ${pregnancyStatus === 'Yes' ? 'text-red-600' : 'text-green-600'}`}>
                                        {pregnancyStatus}
                                    </span>
                                </div>
                            )}
                        </div>
                        {selectedPatient.gender === 'Female' && pregnancyStatus === 'Yes' && (
                            <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded-md text-yellow-800 text-sm">
                                ⚠️ <strong>Caution:</strong> Patient is pregnant. Please consider pregnancy-related factors during assessment.
                            </div>
                        )}
                    </div>
                )}
                
                <fieldset>
                    <legend className="text-lg font-semibold text-srm-blue mb-4 border-b border-gray-200 pb-2">Record Vitals</legend>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
                        {(Object.keys(VITAL_RANGES) as Array<keyof typeof VITAL_RANGES>).map(key => (
                           <div key={key}>
                               <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    {VITAL_RANGES[key].label}
                                    <InfoIcon tooltip={VITAL_RANGES[key].description} />
                               </label>
                               <input type="number" step={key === 'temperature' ? '0.1' : '1'} name={key} value={formData[key as keyof typeof formData]} onChange={handleChange} placeholder={VITAL_RANGES[key].unit} min="0" className={`w-full bg-gray-50 border rounded-md p-2 ${warnings[key] ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'}`} />
                               {warnings[key] && <p className="text-xs text-red-600 mt-1">{warnings[key]}</p>}
                           </div>
                        ))}
                         <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">Height</label>
                            <input type="number" name="height" value={formData.height} onChange={handleChange} placeholder="cm" min="0" className="w-full bg-gray-50 border border-gray-300 rounded-md p-2" />
                         </div>
                          <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">Weight</label>
                            <input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="kg" min="0" className="w-full bg-gray-50 border border-gray-300 rounded-md p-2" />
                         </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend className="text-lg font-semibold text-srm-blue mb-4 border-b border-gray-200 pb-2">Record Chief Complaint & Conditions</legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 space-y-3">
                            <ListInput label="Chief Complaint / Symptoms" placeholder="e.g., Fever, Cough" items={symptoms} setItems={setSymptoms} />
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 mb-2">Common Symptoms (click to add):</h4>
                                <div className="flex flex-wrap gap-2">
                                    {COMMON_SYMPTOMS.map(symptom => (
                                        <button
                                            key={symptom}
                                            type="button"
                                            onClick={() => {
                                                if (!symptoms.includes(symptom)) {
                                                    setSymptoms(prev => [...prev, symptom]);
                                                }
                                            }}
                                            className="px-2.5 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full hover:bg-srm-lightblue hover:text-srm-blue transition-colors"
                                        >
                                            {symptom}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                         <div className="md:col-span-2 space-y-3">
                             <ListInput label="Comorbidities" placeholder="e.g., Diabetes" items={comorbidities} setItems={setComorbidities} />
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 mb-2">Common Comorbidities (click to add):</h4>
                                <div className="flex flex-wrap gap-2">
                                    {COMMON_COMORBIDITIES.map(comorbidity => (
                                        <button
                                            key={comorbidity}
                                            type="button"
                                            onClick={() => {
                                                if (!comorbidities.includes(comorbidity)) {
                                                    setComorbidities(prev => [...prev, comorbidity]);
                                                }
                                            }}
                                            className="px-2.5 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full hover:bg-srm-lightblue hover:text-srm-blue transition-colors"
                                        >
                                            {comorbidity}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                         <div className="md:col-span-2">
                             <label htmlFor="consciousness" className="block text-sm font-medium text-gray-700 mb-1">Consciousness</label>
                            <select id="consciousness" name="consciousness" value={formData.consciousness} onChange={handleChange} required className="w-full bg-white border border-gray-300 rounded-md p-2">
                                <option>Alert</option>
                                <option>Verbal Response</option>
                                <option>Pain Response</option>
                                <option>Unresponsive</option>
                            </select>
                        </div>
                    </div>
                </fieldset>

                <div className="pt-6">
                     <button type="submit" disabled={!formData.patientId} className="w-full bg-srm-blue text-white font-bold text-base py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                        Submit Assessment Data
                    </button>
                </div>
            </form>
        </div>
    );
};
