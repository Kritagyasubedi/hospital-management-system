import React, { useState, useEffect } from 'react';
import type { Patient } from '../types';
import { recommendDepartment } from '../services/geminiService';

interface VitalsExplainerProps {
  patient: Patient;
}

export const VitalsExplainer: React.FC<VitalsExplainerProps> = ({ patient }) => {
  const [recommendation, setRecommendation] = useState<{ department: string; explanation: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get the latest vitals entry
        const latestVitals = patient.vitals && patient.vitals.length > 0 
          ? patient.vitals[patient.vitals.length - 1] 
          : null;
        
        // Prepare patient data for the AI
        const patientData = {
          age: patient.age,
          gender: patient.gender,
          chiefComplaint: patient.triageInfo.chiefComplaint,
          symptomsSummary: latestVitals?.symptomsSummary,
          vitals: latestVitals ? {
            temperature: latestVitals.temperature,
            heartRate: latestVitals.heartRate,
            respirationRate: latestVitals.respirationRate,
            bloodPressure: latestVitals.bloodPressure
          } : undefined
        };
        
        // Get department recommendation from AI
        const result = await recommendDepartment(patientData);
        setRecommendation(result);
      } catch (err) {
        console.error("Error fetching department recommendation:", err);
        setError("Failed to get department recommendation. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendation();
  }, [patient]);

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold text-srm-darkgray mb-4">Vitals Explainer AI</h3>
        <div className="flex items-center justify-center h-24">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-srm-blue"></div>
          <span className="ml-3 text-gray-600">Analyzing patient data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold text-srm-darkgray mb-4">Vitals Explainer AI</h3>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h3 className="text-lg font-semibold text-srm-darkgray mb-4">Vitals Explainer AI</h3>
      {recommendation && (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
            <h4 className="font-semibold text-blue-800">Recommended Department:</h4>
            <p className="text-xl font-bold text-srm-blue mt-1">{recommendation.department}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-700">AI Analysis:</h4>
            <p className="mt-2 text-gray-700 bg-gray-50 p-3 rounded-md">{recommendation.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
};