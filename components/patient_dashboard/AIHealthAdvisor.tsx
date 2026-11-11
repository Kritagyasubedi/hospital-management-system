import React, { useState, useCallback } from 'react';
import type { Patient } from '../../types';
import { generateSummary } from '../../services/geminiService';

interface AIHealthAdvisorProps {
  patient: Patient;
}

export const AIHealthAdvisor: React.FC<AIHealthAdvisorProps> = ({ patient }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'prescriptions' | 'followup'>('overview');

  const handleGenerateAnalysis = useCallback(async (tab: 'overview' | 'prescriptions' | 'followup') => {
    setIsLoading(true);
    setError(null);
    setAnalysis('');
    setActiveTab(tab);
    
    try {
      let prompt = '';
      
      switch (tab) {
        case 'overview':
          prompt = `
          You are a medical AI assistant explaining a patient's health record in simple terms. 
          Please provide a clear, easy-to-understand explanation of the patient's overall health status.
          
          Patient Profile:
          Name: ${patient.name}
          Age: ${patient.age}
          Gender: ${patient.gender}
          DOB: ${patient.dob}
          Blood Type: ${patient.bloodType}
          Marital Status: ${patient.maritalStatus}
          
          Medical History:
          ${patient.medicalHistory.pastConditions.map(c => `- ${c.condition} (Diagnosed: ${c.diagnosedDate})`).join('\n') || 'No past conditions recorded'}
          
          Surgical History:
          ${patient.surgeries?.map(s => `- ${s}`).join('\n') || 'No surgical history recorded'}
          
          Current Symptoms:
          ${patient.symptoms?.map(s => `- ${s}`).join('\n') || 'No current symptoms recorded'}
          
          Triage Information:
          Chief Complaint: ${patient.triageInfo.chiefComplaint}
          Risk Level: ${patient.triageInfo.risk} (${patient.triageInfo.riskScore})
          
          Please explain:
          1. What the patient's current health status means in simple terms
          2. How their medical history might affect their current condition
          3. What symptoms they should be monitoring
          4. General health advice based on their profile
          `;
          break;
          
        case 'prescriptions':
          prompt = `
          You are a medical AI assistant explaining prescriptions to a patient in simple terms.
          Please provide clear explanations of each medication, why it was prescribed, and how to take it properly.
          
          Patient Name: ${patient.name}
          
          Prescriptions:
          ${patient.prescriptions?.map(p => `
          Medication: ${p.medication}
          Dosage: ${p.dosage}
          Instructions: ${p.instructions}
          Reason: ${p.reason}
          Prescribed by: Dr. ${p.doctor}
          Date: ${p.date}`).join('\n\n') || 'No prescriptions recorded'}
          
          Please explain for each prescription:
          1. What the medication is for (in simple terms)
          2. How and when to take it exactly
          3. Important precautions or things to avoid while taking it
          4. Possible side effects to watch for
          5. What to do if they miss a dose
          6. When they should contact their doctor about the medication
          `;
          break;
          
        case 'followup':
          prompt = `
          You are a medical AI assistant providing follow-up care advice to a patient.
          Please explain when and why they should revisit the doctor, and what actions they should take for their ongoing care.
          
          Patient Name: ${patient.name}
          
          Medical History:
          ${patient.medicalHistory.pastConditions.map(c => `- ${c.condition} (Diagnosed: ${c.diagnosedDate})`).join('\n') || 'No past conditions recorded'}
          
          Current Symptoms:
          ${patient.symptoms?.map(s => `- ${s}`).join('\n') || 'No current symptoms recorded'}
          
          Prescriptions:
          ${patient.prescriptions?.map(p => `- ${p.medication} (${p.dosage}) - ${p.instructions}`).join('\n') || 'No prescriptions recorded'}
          
          Triage Information:
          Chief Complaint: ${patient.triageInfo.chiefComplaint}
          Risk Level: ${patient.triageInfo.risk} (${patient.triageInfo.riskScore})
          
          Please provide advice on:
          1. When they should schedule their next appointment
          2. Warning signs or symptoms that require immediate medical attention
          3. Daily health monitoring they should do at home
          4. Lifestyle changes or precautions they should take
          5. When to contact their doctor for non-emergency questions
          6. Any special instructions based on their specific conditions
          `;
          break;
      }

      const result = await generateSummary(prompt);
      setAnalysis(result);
    } catch (e) {
      setError('Failed to generate health advice. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [patient]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-srm-darkgray mb-4">AI Health Advisor</h3>
      <p className="text-sm text-gray-500 mb-6">
        Get AI-powered explanations about your health records, prescriptions, and care instructions.
      </p>
      
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => handleGenerateAnalysis('overview')}
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-srm-blue text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Health Overview
        </button>
        <button
          onClick={() => handleGenerateAnalysis('prescriptions')}
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'prescriptions'
              ? 'bg-srm-blue text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Prescription Guide
        </button>
        <button
          onClick={() => handleGenerateAnalysis('followup')}
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'followup'
              ? 'bg-srm-blue text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Follow-up Care
        </button>
      </div>
      
      <div className="mt-4 flex-grow overflow-y-auto bg-gray-50 rounded-lg p-4 text-sm border min-h-[300px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-srm-blue"></div>
            <span className="ml-2">Generating health advice...</span>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">
            <p>{error}</p>
            <button
              onClick={() => handleGenerateAnalysis(activeTab)}
              className="mt-4 px-4 py-2 bg-srm-blue text-white rounded-lg hover:bg-opacity-90"
            >
              Try Again
            </button>
          </div>
        ) : analysis ? (
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap font-sans">{analysis}</pre>
          </div>
        ) : (
          <div className="text-gray-500 text-center py-8">
            <p>Click on one of the tabs above to get AI-powered explanations about your health.</p>
            <p className="mt-2 text-sm">Select "Health Overview" for a general understanding of your medical condition, "Prescription Guide" for detailed medication instructions, or "Follow-up Care" for advice on ongoing treatment and when to see your doctor.</p>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>Note: This AI assistant provides general information and should not replace professional medical advice. Always consult with your healthcare provider for medical decisions.</p>
      </div>
    </div>
  );
};