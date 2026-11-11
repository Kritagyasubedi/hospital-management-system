import React, { useState } from 'react';
import type { Patient } from '../../../types';
import { mockPatients } from '../../../services/mockData';
import { generateSummary } from '../../../services/geminiService';

interface PatientReportsViewProps {
    patients?: Patient[];
}

interface GeneratedReport {
    id: string;
    patientId: string;
    patientName: string;
    reportType: string;
    timestamp: string;
    content: string;
}

export const PatientReportsView: React.FC<PatientReportsViewProps> = ({ patients = [] }) => {
    const allPatients = patients.length > 0 ? patients : mockPatients;
    const [selectedPatientId, setSelectedPatientId] = useState<string>(allPatients[0]?.id || '');
    const [reportType, setReportType] = useState<string>('comprehensive');
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [currentReport, setCurrentReport] = useState<string>('');
    const [copySuccess, setCopySuccess] = useState<boolean>(false);
    const [recentReports, setRecentReports] = useState<GeneratedReport[]>([]);

    const selectedPatient = allPatients.find(p => p.id === selectedPatientId) || allPatients[0];

    const handleGenerateReport = async () => {
        if (!selectedPatient) return;

        setIsGenerating(true);
        setCurrentReport('');
        setCopySuccess(false);

        try {
            const vitalsHistory = selectedPatient.vitals && selectedPatient.vitals.length > 0
                ? selectedPatient.vitals.map(v => 
                    `[${new Date(v.timestamp).toLocaleString()}]: BP ${v.bloodPressure.systolic}/${v.bloodPressure.diastolic}, HR ${v.heartRate} bpm, Temp ${v.temperature}°C, RR ${v.respirationRate}. Summary: ${v.symptomsSummary || 'N/A'}`
                  ).join('\n')
                : 'No longitudinal telemetry logged.';

            const profilePrompt = `
=== PATIENT CLINICAL DATA FOR AI REPORT ANALYSIS ===
Full Name: ${selectedPatient.name}
Patient ID: ${selectedPatient.id}
Age: ${selectedPatient.age} | Gender: ${selectedPatient.gender} | Blood Type: ${selectedPatient.bloodType || 'Unknown'}
Department: ${selectedPatient.department || 'General Medicine'}
Status: ${selectedPatient.status || 'Active'}
Pregnancy Status: ${selectedPatient.gender === 'Female' ? (selectedPatient.isPregnant ? 'Pregnant' : 'Not Pregnant') : 'N/A'}

Chief Complaint / Symptoms:
${selectedPatient.triageInfo?.chiefComplaint || (selectedPatient.symptoms ? selectedPatient.symptoms.join(', ') : 'None reported')}

Reported Symptoms:
${selectedPatient.symptoms && selectedPatient.symptoms.length > 0 ? selectedPatient.symptoms.join(', ') : 'None recorded'}

Vital Signs History & Telemetry:
${vitalsHistory}

Current Active Prescriptions:
${selectedPatient.prescriptions && selectedPatient.prescriptions.length > 0 
  ? selectedPatient.prescriptions.map(p => `- ${p.medication} (${p.dosage}) - ${p.instructions}`).join('\n')
  : 'None active'}

Medical & Surgical History:
Past Conditions: ${selectedPatient.medicalHistory?.pastConditions?.map(c => c.condition).join(', ') || 'None recorded'}
Surgeries: ${selectedPatient.surgeries?.join(', ') || 'None'}

Clinical Notes & Nursing Observations:
${selectedPatient.clinicalNotes || 'Routine observation.'}

Requested Report Type: ${reportType.toUpperCase()}
`;

            const reportResult = await generateSummary(profilePrompt);
            setCurrentReport(reportResult);

            const newReportEntry: GeneratedReport = {
                id: `REP-${Date.now()}`,
                patientId: selectedPatient.id,
                patientName: selectedPatient.name,
                reportType: reportType.replace(/_/g, ' ').toUpperCase(),
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                content: reportResult,
            };

            setRecentReports(prev => [newReportEntry, ...prev.slice(0, 9)]);
        } catch (err: any) {
            console.error('Error generating report:', err);
            setCurrentReport('Error: Could not generate report. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = () => {
        if (!currentReport) return;
        navigator.clipboard.writeText(currentReport);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2500);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
                <div>
                    <h3 className="text-xl font-bold text-srm-darkgray">AI Clinical Report Analysis</h3>
                    <p className="text-gray-500 text-sm mt-0.5">
                        Generate comprehensive medical evaluations and diagnostic summaries powered by Gemini AI.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                        <span className="w-2 h-2 mr-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        AI Engine Online
                    </span>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                            Select Patient
                        </label>
                        <select
                            value={selectedPatient?.id}
                            onChange={(e) => setSelectedPatientId(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-srm-blue focus:outline-none"
                        >
                            {allPatients.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.name} ({p.id}) - {p.department || 'General'}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                            Report Type
                        </label>
                        <select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-srm-blue focus:outline-none"
                        >
                            <option value="comprehensive">Comprehensive Clinical Examination</option>
                            <option value="icu_deterioration">ICU Deterioration Risk & Early Warning</option>
                            <option value="discharge_summary">Discharge Summary & Home Care</option>
                            <option value="pharmacology">Medication Review & Drug Safety</option>
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={handleGenerateReport}
                            disabled={isGenerating}
                            className="w-full bg-srm-blue text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center space-x-2 shadow-sm disabled:bg-gray-400 cursor-pointer"
                        >
                            {isGenerating ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Analyzing Chart...</span>
                                </>
                            ) : (
                                <span>Generate AI Clinical Report</span>
                            )}
                        </button>
                    </div>
                </div>

                {selectedPatient && (
                    <div className="bg-blue-50/60 rounded-lg p-3 text-xs text-blue-900 flex flex-wrap items-center gap-x-6 gap-y-1">
                        <span><strong>Age/Gender:</strong> {selectedPatient.age} yrs / {selectedPatient.gender}</span>
                        <span><strong>Blood Group:</strong> {selectedPatient.bloodType || 'N/A'}</span>
                        <span><strong>Department:</strong> {selectedPatient.department || 'General Medicine'}</span>
                        <span><strong>Chief Complaint:</strong> {selectedPatient.triageInfo?.chiefComplaint || 'None'}</span>
                    </div>
                )}
            </div>

            {/* Generated Report Display */}
            {currentReport && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 border-b px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <h4 className="font-bold text-base text-gray-900">
                                Clinical Examination Report: {selectedPatient?.name} ({selectedPatient?.id})
                            </h4>
                            <p className="text-xs text-gray-500">
                                Generated on {new Date().toLocaleString()} | Verified by Gemini AI Intelligence
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleCopy}
                                className="px-3 py-1.5 text-xs font-semibold rounded-md border border-gray-300 hover:bg-gray-100 transition-colors text-gray-700"
                            >
                                {copySuccess ? 'Copied!' : 'Copy Report'}
                            </button>
                            <button
                                onClick={handlePrint}
                                className="px-3 py-1.5 text-xs font-semibold rounded-md bg-srm-blue text-white hover:bg-opacity-90 transition-colors"
                            >
                                Print / PDF
                            </button>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="prose prose-sm max-w-none text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
                            {currentReport}
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Reports / History */}
            {recentReports.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h4 className="font-semibold text-base text-srm-darkgray mb-4">
                        Reports Generated in this Session ({recentReports.length})
                    </h4>
                    <div className="space-y-3">
                        {recentReports.map(rep => (
                            <div key={rep.id} className="flex flex-col sm:flex-row justify-between sm:items-center p-3.5 border rounded-lg hover:bg-gray-50 transition-colors gap-2">
                                <div>
                                    <p className="font-semibold text-sm text-gray-900">
                                        {rep.patientName} ({rep.patientId}) — {rep.reportType}
                                    </p>
                                    <p className="text-xs text-gray-500">Timestamp: {rep.timestamp}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedPatientId(rep.patientId);
                                        setCurrentReport(rep.content);
                                    }}
                                    className="text-xs font-semibold text-srm-blue hover:underline self-start sm:self-auto"
                                >
                                    View Full Report &rarr;
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
