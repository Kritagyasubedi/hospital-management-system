
import React, { useState, useCallback } from 'react';
import type { Patient, TriageRisk, TriageAnalysis } from '../types';
import { mockPatients } from '../services/mockData';
import { TriageRiskBadge } from './TriageRiskBadge';
import { calculateTriageRisk } from '../services/geminiService';

const DetailPanel: React.FC<{ analysis: TriageAnalysis | null, isLoading: boolean, error: string | null }> = ({ analysis, isLoading, error }) => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-srm-blue"></div>
                <p className="ml-4 font-semibold">Performing AI Triage Analysis...</p>
            </div>
        );
    }
    if (error) {
        return <div className="p-8 text-center text-red-600 font-semibold">{error}</div>
    }
    if (!analysis) {
        return <div className="p-8 text-center text-gray-500">No analysis available.</div>
    }

    const scoreColor = analysis.score > 80 ? 'text-red-600' : analysis.score > 50 ? 'text-yellow-600' : 'text-green-600';

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
            <div className="md:col-span-1 flex flex-col items-center justify-center bg-white rounded-lg p-4 border">
                <p className="text-sm font-semibold text-gray-600 mb-2">AI Risk Score</p>
                <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${scoreColor.replace('text', 'border')}`}>
                    <span className={`text-4xl font-bold ${scoreColor}`}>{analysis.score}</span>
                </div>
            </div>
            <div className="md:col-span-2">
                <h4 className="font-semibold text-srm-darkgray">Clinical Justification</h4>
                <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{analysis.justification}</p>
            </div>
        </div>
    )
}


interface TriageViewProps {
  patients?: Patient[];
  onPatientSelect?: (patient: Patient) => void;
}

export const TriageView: React.FC<TriageViewProps> = ({ patients, onPatientSelect }) => {
  const [filter, setFilter] = useState<TriageRisk | 'All'>('All');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<TriageAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allPatients = patients && patients.length > 0 ? patients : mockPatients;

  const handleToggleDetails = useCallback(async (patient: Patient) => {
    const patientId = patient.id;
    if (selectedPatientId === patientId) {
        setSelectedPatientId(null);
        return;
    }

    setSelectedPatientId(patientId);
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
        const result = await calculateTriageRisk(patient.triageInfo?.chiefComplaint || 'General checkup', patient.age, patient.gender);
        setAnalysis(result);
    } catch (e) {
        setError("Failed to run AI analysis. Please try again.");
        console.error(e);
    } finally {
        setIsLoading(false);
    }
  }, [selectedPatientId]);

  const filteredPatients = allPatients.filter(p => {
    const risk = p.triageInfo?.risk || 'Low';
    return filter === 'All' || risk === filter;
  });
  
  const riskLevels: (TriageRisk | 'All')[] = ['All', 'High', 'Medium', 'Low'];

  return (
    <div className="space-y-6">
      <div>
          <h3 className="text-xl font-semibold text-srm-darkgray">Triage Queue</h3>
          <p className="text-gray-500 mt-1">Patients awaiting assessment and assignment.</p>
      </div>

      <div className="flex space-x-2">
        {riskLevels.map(level => (
           <button 
                key={level} 
                onClick={() => setFilter(level)}
                className={`px-4 py-2 text-sm font-medium rounded-full ${filter === level ? 'bg-srm-blue text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
           >
               {level} Risk
           </button>
        ))}
      </div>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-xs text-gray-700 uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-6 py-3">Patient Name</th>
              <th scope="col" className="px-6 py-3">Age</th>
              <th scope="col" className="px-6 py-3">Gender</th>
              <th scope="col" className="px-6 py-3">Chief Complaint</th>
              <th scope="col" className="px-6 py-3">Triage Risk</th>
              <th scope="col" className="px-6 py-3">Arrival</th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <React.Fragment key={patient.id}>
                <tr className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{patient.name}</td>
                    <td className="px-6 py-4">{patient.age}</td>
                    <td className="px-6 py-4">{patient.gender}</td>
                    <td className="px-6 py-4 max-w-sm truncate">{patient.triageInfo.chiefComplaint}</td>
                    <td className="px-6 py-4"><TriageRiskBadge risk={patient.triageInfo.risk} /></td>
                    <td className="px-6 py-4">{new Date(patient.triageInfo.triageDate).toLocaleTimeString()}</td>
                    <td className="px-6 py-4 text-right">
                    <button onClick={() => handleToggleDetails(patient)} className="font-medium text-srm-blue hover:underline">
                        {selectedPatientId === patient.id ? 'Hide Details' : 'View Details'}
                    </button>
                    </td>
                </tr>
                {selectedPatientId === patient.id && (
                    <tr className="bg-srm-lightblue border-b">
                        <td colSpan={7}>
                            <DetailPanel analysis={analysis} isLoading={isLoading} error={error} />
                        </td>
                    </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
