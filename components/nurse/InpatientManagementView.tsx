import React, { useState } from 'react';
import type { Patient, WardBed } from '../../types';

interface InpatientManagementViewProps {
    patients: Patient[];
    beds: WardBed[];
    onAssignBed: (patientId: string, bedId: string) => void;
}

export const InpatientManagementView: React.FC<InpatientManagementViewProps> = ({
    patients,
    beds,
    onAssignBed
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('All');
    
    // Get unique departments from patients
    const departments = ['All', ...new Set(patients.map(p => p.department).filter(Boolean))] as string[];
    
    // Filter patients based on search and department
    const filteredPatients = patients.filter(patient => {
        const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             patient.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDepartment = selectedDepartment === 'All' || patient.department === selectedDepartment;
        return matchesSearch && matchesDepartment;
    });

    // Group beds by ward
    const bedsByWard: Record<string, WardBed[]> = {};
    beds.forEach(bed => {
        if (!bedsByWard[bed.ward]) {
            bedsByWard[bed.ward] = [];
        }
        bedsByWard[bed.ward].push(bed);
    });

    const handleBedAssignment = (patientId: string, bedId: string) => {
        onAssignBed(patientId, bedId);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h3 className="text-xl font-semibold text-srm-darkgray">Inpatient Management</h3>
                    <p className="text-gray-500 mt-1">Manage bed assignments and patient care for inpatients.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search patients..."
                            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-srm-blue pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                    <select
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-srm-blue bg-white"
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                    >
                        {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b">
                            <h4 className="text-lg font-semibold text-srm-darkgray">Inpatients ({filteredPatients.length})</h4>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-xs text-gray-700 uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-3">Patient Name</th>
                                        <th className="px-6 py-3">Patient ID</th>
                                        <th className="px-6 py-3">Department</th>
                                        <th className="px-6 py-3">Assigned Doctor</th>
                                        <th className="px-6 py-3">Bed Assignment</th>
                                        <th className="px-6 py-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPatients.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-8 text-gray-500">
                                                No inpatients found.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredPatients.map(patient => {
                                            const assignedBed = beds.find(bed => bed.patientName === patient.name);
                                            return (
                                                <tr key={patient.id} className="bg-white border-b hover:bg-gray-50">
                                                    <td className="px-6 py-4 font-medium text-gray-900">{patient.name}</td>
                                                    <td className="px-6 py-4 font-mono text-xs">{patient.id}</td>
                                                    <td className="px-6 py-4">{patient.department || 'Not assigned'}</td>
                                                    <td className="px-6 py-4">{patient.assignedDoctorId || 'Not assigned'}</td>
                                                    <td className="px-6 py-4">
                                                        {assignedBed ? (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                {assignedBed.ward} - {assignedBed.bedNumber}
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                Not assigned
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button 
                                                            onClick={() => {
                                                                // This would open a modal to assign a bed
                                                                const event = new CustomEvent('openBedAssignment', {
                                                                    detail: { patientId: patient.id }
                                                                });
                                                                window.dispatchEvent(event);
                                                            }}
                                                            className="font-medium text-srm-blue hover:underline"
                                                        >
                                                            {assignedBed ? 'Change Bed' : 'Assign Bed'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
                <div>
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b">
                            <h4 className="text-lg font-semibold text-srm-darkgray">Ward Bed Status</h4>
                        </div>
                        <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                            {Object.entries(bedsByWard).map(([ward, wardBeds]) => (
                                <div key={ward} className="border rounded-lg">
                                    <div className="px-4 py-2 bg-gray-50 border-b font-medium">
                                        {ward} Ward
                                    </div>
                                    <div className="p-3 grid grid-cols-2 gap-2">
                                        {wardBeds.map(bed => (
                                            <div 
                                                key={bed.id} 
                                                className={`p-2 rounded text-center text-xs ${
                                                    bed.status === 'Occupied' 
                                                        ? 'bg-red-100 border border-red-400' 
                                                        : bed.status === 'Available' 
                                                            ? 'bg-green-100 border border-green-400' 
                                                            : 'bg-yellow-100 border border-yellow-400'
                                                }`}
                                            >
                                                <div className="font-medium">{bed.bedNumber}</div>
                                                <div className="truncate">
                                                    {bed.patientName || bed.status}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};