import React, { useState, useCallback } from 'react';
import type { Patient } from '../types';
import { generateSummary } from '../services/geminiService';

interface ExaminerProps {
  patient: Patient;
}

export const Examiner: React.FC<ExaminerProps> = ({ patient }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateAnalysis = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setAnalysis('');
    try {
      // Create a comprehensive patient profile for the AI
      const patientProfile = `
Patient Profile:
Name: ${patient.name}
Age: ${patient.age}
Gender: ${patient.gender}
DOB: ${patient.dob}
Blood Type: ${patient.bloodType}
Marital Status: ${patient.maritalStatus}
Guardian: ${patient.guardianName}
Phone: ${patient.phoneNumber}

Medical History:
${patient.medicalHistory?.pastConditions?.map(c => `- ${c.condition} (Diagnosed: ${c.diagnosedDate})`).join('\n') || 'No past conditions recorded'}

Surgical History:
${patient.surgeries?.map(s => `- ${s}`).join('\n') || 'No surgical history recorded'}

Current Symptoms:
${patient.symptoms?.map(s => `- ${s}`).join('\n') || 'No current symptoms recorded'}

Vital Signs History:
${patient.vitals?.map(v => 
  `- ${new Date(v.timestamp).toLocaleString()}: Temp ${v.temperature}°C, HR ${v.heartRate} bpm, BP ${v.bloodPressure.systolic}/${v.bloodPressure.diastolic}, RR ${v.respirationRate}`).join('\n') || 'No vitals recorded'}

Clinical Notes:
${patient.clinicalNotes || 'None'}

Prescriptions:
${patient.prescriptions?.map(p => `- ${p.medication} (${p.dosage}) - ${p.instructions}`).join('\n') || 'No prescriptions recorded'}

Triage Information:
Chief Complaint: ${patient.triageInfo?.chiefComplaint || (patient.symptoms ? patient.symptoms.join(', ') : 'Not specified')}
Risk Level: ${patient.triageInfo?.risk || 'Low'} (${patient.triageInfo?.riskScore || 20})
Triage Date: ${patient.triageInfo?.triageDate ? new Date(patient.triageInfo.triageDate).toLocaleString() : 'N/A'}
`;

      const result = await generateSummary(patientProfile);
      setAnalysis(result);
    } catch (e) {
      setError('Failed to generate patient examination. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [patient]);

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold text-srm-darkgray">Examiner</h3>
      <p className="text-sm text-gray-500 mt-1">AI-powered comprehensive patient analysis for quick clinical decisions.</p>
      
      <div className="mt-4 flex-grow overflow-y-auto bg-gray-50 rounded-lg p-3 text-sm border">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-srm-blue"></div>
            <span className="ml-2">Analyzing patient data...</span>
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : analysis ? (
          <pre className="whitespace-pre-wrap font-sans">{analysis}</pre>
        ) : (
          <div className="text-gray-500">
            <p className="mb-2">The Examiner provides an AI-powered comprehensive analysis of the patient's medical history, current condition, and treatment recommendations.</p>
            <p>Click "Generate Analysis" to get detailed insights about this patient.</p>
          </div>
        )}
      </div>

      <button
        onClick={handleGenerateAnalysis}
        disabled={isLoading}
        className="mt-4 w-full bg-srm-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Analyzing...' : 'Generate Analysis'}
      </button>
    </div>
  );
};