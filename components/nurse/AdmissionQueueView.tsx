import React, { useState } from 'react';
import type { Patient, WardBed } from '../../types';
import { TriageRiskBadge } from '../TriageRiskBadge';

interface AdmissionQueueViewProps {
    patients: Patient[];
    beds: WardBed[];
    onAssignBed: (patientId: string, bedId: string) => void;
}

export const AdmissionQueueView: React.FC<AdmissionQueueViewProps> = ({
    patients,
    beds,
    onAssignBed
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'risk' | 'time'>('risk');
    
    // Filter patients based on search term
    const filteredPatients = patients.filter(patient => {
        return patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
               patient.id.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Sort patients
    const sortedPatients = [...filteredPatients].sort((a, b) => {
        if (sortBy === 'risk') {
            // Sort by risk score (high to low)
            return b.triageInfo.riskScore - a.triageInfo.riskScore;
        } else {
            // Sort by triage date (newest first)
            return new Date(b.triageInfo.triageDate).getTime() - new Date(a.triageInfo.triageDate).getTime();
        }
    });

    // Get available beds
    const availableBeds = beds.filter(bed => bed.status === 'Available');

    const handleAssignBed = (patientId: string, bedId: string) => {
        onAssignBed(patientId, bedId);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h3 className="text-xl font-semibold text-srm-darkgray">Admission Queue</h3>
                    <p className="text-gray-500 mt-1">Manage patient admissions and bed assignments.</p>
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
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'risk' | 'time')}
                    >
                        <option value="risk">Sort by Risk</option>
                        <option value="time">Sort by Time</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b">
                            <h4 className="text-lg font-semibold text-srm-darkgray">Waiting Patients ({sortedPatients.length})</h4>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-xs text-gray-700 uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-3">Patient Name</th>
                                        <th className="px-6 py-3">Patient ID</th>
                                        <th className="px-6 py-3">Chief Complaint</th>
                                        <th className="px-6 py-3">Risk Level</th>
                                        <th className="px-6 py-3">Triage Time</th>
                                        <th className="px-6 py-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedPatients.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-8 text-gray-500">
                                                No patients waiting for admission.
                                            </td>
                                        </tr>
                                    ) : (
                                        sortedPatients.map(patient => (
                                            <tr key={patient.id} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium text-gray-900">{patient.name}</td>
                                                <td className="px-6 py-4 font-mono text-xs">{patient.id}</td>
                                                <td className="px-6 py-4 max-w-xs truncate" title={patient.triageInfo.chiefComplaint}>
                                                    {patient.triageInfo.chiefComplaint}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <TriageRiskBadge risk={patient.triageInfo.risk} />
                                                </td>
                                                <td className="px-6 py-4">
                                                    {new Date(patient.triageInfo.triageDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button 
                                                        onClick={() => {
                                                            // This would open a modal to assign a bed
                                                            const event = new CustomEvent('openBedAssignment', {
                                                                detail: { 
                                                                    patientId: patient.id,
                                                                    availableBeds: availableBeds
                                                                }
                                                            });
                                                            window.dispatchEvent(event);
                                                        }}
                                                        className="font-medium text-srm-blue hover:underline"
                                                    >
                                                        Assign Bed
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
                <div>
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b">
                            <h4 className="text-lg font-semibold text-srm-darkgray">Available Beds</h4>
                        </div>
                        <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                            {availableBeds.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No beds available</p>
                            ) : (
                                availableBeds.map(bed => (
                                    <div 
                                        key={bed.id} 
                                        className="p-3 border border-green-400 rounded-lg bg-green-50 hover:bg-green-100 cursor-pointer transition-colors"
                                        onClick={() => {
                                            // This would open a modal to select a patient for this bed
                                            const event = new CustomEvent('openPatientSelection', {
                                                detail: { bedId: bed.id }
                                            });
                                            window.dispatchEvent(event);
                                        }}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">{bed.ward} - {bed.bedNumber}</span>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Available
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Click to assign patient</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden mt-6">
                        <div className="px-6 py-4 border-b">
                            <h4 className="text-lg font-semibold text-srm-darkgray">Bed Status Summary</h4>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="flex justify-between">
                                <span>Total Beds</span>
                                <span className="font-medium">{beds.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Occupied</span>
                                <span className="font-medium text-red-600">
                                    {beds.filter(b => b.status === 'Occupied').length}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Available</span>
                                <span className="font-medium text-green-600">
                                    {beds.filter(b => b.status === 'Available').length}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Cleaning</span>
                                <span className="font-medium text-yellow-600">
                                    {beds.filter(b => b.status === 'Cleaning').length}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};