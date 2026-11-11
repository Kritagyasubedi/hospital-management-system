import React from 'react';
import type { Patient, Doctor, Appointment } from '../../types';
import { TriageRiskBadge } from '../TriageRiskBadge';

interface DepartmentViewProps {
    department: string;
    allPatients: Patient[];
    doctors: Doctor[];
    appointments?: Appointment[];
    onPatientSelect: (patient: Patient) => void;
}

export const DepartmentView: React.FC<DepartmentViewProps> = ({ department, allPatients, doctors, appointments, onPatientSelect }) => {
    
    // Filter patients by department (case-insensitive and matching appointments)
    const departmentPatients = allPatients.filter(p => {
        const directDeptMatch = p.department && p.department.trim().toLowerCase() === department.trim().toLowerCase();
        const appointmentMatch = appointments && appointments.some(a => 
            a.patientId === p.id && a.department && a.department.trim().toLowerCase() === department.trim().toLowerCase()
        );
        return directDeptMatch || appointmentMatch;
    });
    
    console.log(`DepartmentView for ${department}:`, {
        totalPatients: allPatients.length,
        departmentPatients: departmentPatients.length,
        samplePatient: departmentPatients[0]
    });

    // Function to get doctor name by ID
    const getDoctorName = (doctorId: string | undefined) => {
        if (!doctorId) return 'Unassigned';
        const doctor = doctors.find(d => d.id === doctorId);
        return doctor ? doctor.name : 'Unassigned';
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-srm-darkgray">{department} Department Patient List</h3>
                <p className="text-gray-500 mt-1">Overview of all patients currently in this department.</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs text-gray-700 uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-3">Patient Name</th>
                            <th className="px-6 py-3">Patient ID</th>
                            <th className="px-6 py-3">Age</th>
                            <th className="px-6 py-3">Symptoms</th>
                            <th className="px-6 py-3">Assigned Doctor</th>
                            <th className="px-6 py-3">Risk Level</th>
                            <th className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departmentPatients.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center py-8 text-gray-500">No patients found in this department.</td>
                            </tr>
                        )}
                        {departmentPatients.map(patient => (
                            <tr key={patient.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{patient.name}</td>
                                <td className="px-6 py-4 font-mono text-xs">{patient.id}</td>
                                <td className="px-6 py-4">{patient.age}</td>
                                <td className="px-6 py-4">
                                    {patient.symptoms && patient.symptoms.length > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                            {patient.symptoms.slice(0, 3).map((symptom, index) => (
                                                <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {symptom}
                                                </span>
                                            ))}
                                            {patient.symptoms.length > 3 && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    +{patient.symptoms.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-gray-500">No symptoms</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">{getDoctorName(patient.assignedDoctorId)}</td>
                                <td className="px-6 py-4">
                                    <TriageRiskBadge risk={patient.triageInfo.risk} />
                                </td>
                                <td className="px-6 py-4">
                                    <button 
                                        onClick={() => onPatientSelect(patient)} 
                                        className="font-medium text-srm-blue hover:underline"
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};