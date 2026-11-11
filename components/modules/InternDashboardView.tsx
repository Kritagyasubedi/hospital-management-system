
import React from 'react';
import { mockPatients, mockDoctorSchedule } from '../../services/mockData';
import { TriageRiskBadge } from '../TriageRiskBadge';
import type { Patient } from '../../types';

interface InternDashboardViewProps {
    patients?: Patient[];
    onPatientSelect?: (patient: Patient) => void;
}

export const InternDashboardView: React.FC<InternDashboardViewProps> = ({ patients, onPatientSelect }) => {
    const allPatients = patients && patients.length > 0 ? patients : mockPatients;

    // Interns see patients of their supervising doctors or newly admitted/waiting patients
    const supervisedPatients = allPatients.filter(p => 
        p.assignedDoctorId === 'DOC001' || 
        p.assignedDoctorId === 'DOC002' ||
        p.status === 'WAITING_FOR_INTERN' ||
        p.status === 'REGISTERED' ||
        !p.assignedDoctorId
    );

    const mockAssignedTasks = [
        { id: 'T01', task: 'Collect blood sample from Jinnash (PID723709).', priority: 'High' },
        { id: 'T02', task: 'Update clinical notes for Jane Smith (PID192837) post-physio.', priority: 'Medium' },
        { id: 'T03', task: 'Shadow Dr. Reed during morning rounds.', priority: 'Low' },
    ];

    const getPriorityColor = (priority: 'High' | 'Medium' | 'Low') => {
        switch (priority) {
            case 'High': return 'border-l-4 border-red-500';
            case 'Medium': return 'border-l-4 border-yellow-500';
            case 'Low': return 'border-l-4 border-blue-500';
        }
    };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-srm-blue">Intern Dashboard</h2>
            <p className="text-gray-600 -mt-6">Supervising Physician: <span className="font-semibold">Dr. Evelyn Reed</span></p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Column 1: Patient Watchlist */}
                <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                    <h3 className="text-lg font-semibold text-srm-darkgray border-b pb-2">Patient Watchlist</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {supervisedPatients.map(patient => (
                            <div key={patient.id} className="p-3 border rounded-lg hover:bg-gray-50">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-sm text-srm-darkgray">{patient.name}</p>
                                        <p className="text-xs text-gray-500 font-mono">{patient.id}</p>
                                    </div>
                                    <TriageRiskBadge risk={patient.triageInfo.risk} />
                                </div>
                                <p className="text-xs text-gray-600 mt-2">
                                    <span className="font-semibold">Complaint:</span> {patient.triageInfo.chiefComplaint}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Column 2: Tasks and Schedule */}
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                        <h3 className="text-lg font-semibold text-srm-darkgray border-b pb-2">Assigned Tasks</h3>
                        <div className="space-y-3">
                            {mockAssignedTasks.map(task => (
                                <div key={task.id} className={`p-3 bg-gray-50 rounded-md ${getPriorityColor(task.priority as 'High' | 'Medium' | 'Low')}`}>
                                    <p className="text-sm font-medium text-gray-800">{task.task}</p>
                                    <p className="text-xs text-gray-500 mt-1 font-semibold">{task.priority} Priority</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                        <h3 className="text-lg font-semibold text-srm-darkgray border-b pb-2">Dr. Reed's Schedule Today</h3>
                        <ul className="space-y-2">
                            {mockDoctorSchedule.map(item => (
                                <li key={item.time} className="flex items-center text-sm">
                                    <span className="font-semibold text-srm-blue w-20">{item.time}</span>
                                    <span className="text-gray-700">{item.activity}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Column 3: Data Entry & Learning */}
                <div className="space-y-8">
                     <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="text-lg font-semibold text-srm-darkgray border-b pb-2 mb-4">Enter Patient Vitals</h3>
                        <form className="space-y-3 text-sm">
                            <div>
                                <label className="font-medium text-gray-700">Select Patient</label>
                                <select className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white">
                                    <option>Select a patient...</option>
                                    {supervisedPatients.map(p => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}
                                </select>
                            </div>
                             <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="font-medium text-gray-700">HR</label>
                                    <input type="number" className="w-full mt-1 p-2 border border-gray-300 rounded-md" placeholder="bpm" />
                                </div>
                                <div>
                                    <label className="font-medium text-gray-700">BP</label>
                                    <input type="text" className="w-full mt-1 p-2 border border-gray-300 rounded-md" placeholder="sys/dia" />
                                </div>
                             </div>
                            <button type="submit" className="w-full bg-srm-green text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors">
                                Submit Vitals
                            </button>
                        </form>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                        <h3 className="text-lg font-semibold text-srm-darkgray border-b pb-2">Learning Hub: Case Studies</h3>
                        <div className="p-3 border rounded-lg hover:bg-srm-lightblue cursor-pointer">
                            <p className="font-semibold text-sm text-srm-blue">Case Study: Acute STEMI Presentation</p>
                            <p className="text-xs text-gray-600 mt-1">Based on patient Jinnash (PID723709). Focus on ECG interpretation and PCI.</p>
                        </div>
                         <div className="p-3 border rounded-lg hover:bg-srm-lightblue cursor-pointer">
                            <p className="font-semibold text-sm text-srm-blue">Case Study: Community-Acquired Pneumonia</p>
                            <p className="text-xs text-gray-600 mt-1">Based on patient Jane Smith (PID192837). Focus on antibiotic selection.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
