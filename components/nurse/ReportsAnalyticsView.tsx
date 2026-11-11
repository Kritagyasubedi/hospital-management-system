import React from 'react';
import type { Patient, WardBed } from '../../types';

interface ReportsAnalyticsViewProps {
    patients: Patient[];
    beds: WardBed[];
}

export const ReportsAnalyticsView: React.FC<ReportsAnalyticsViewProps> = ({
    patients,
    beds
}) => {
    // Calculate statistics
    const totalPatients = patients.length;
    const inpatients = patients.filter(p => 
        p.status === 'IN_CONSULTATION' || 
        beds.some(bed => bed.patientName === p.name)
    ).length;
    
    const waitingPatients = patients.filter(p => 
        p.status === 'WAITING_FOR_INTERN' || 
        p.status === 'WAITING_FOR_DOCTOR'
    ).length;
    
    const dischargedPatients = patients.filter(p => p.status === 'DISCHARGED').length;
    
    const occupiedBeds = beds.filter(bed => bed.status === 'Occupied').length;
    const availableBeds = beds.filter(bed => bed.status === 'Available').length;
    const cleaningBeds = beds.filter(bed => bed.status === 'Cleaning').length;
    
    const bedOccupancyRate = beds.length > 0 ? Math.round((occupiedBeds / beds.length) * 100) : 0;

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-srm-darkgray">Reports & Analytics</h3>
                <p className="text-gray-500 mt-1">View hospital statistics and performance metrics.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h4 className="text-sm font-medium text-gray-500">Total Patients</h4>
                            <p className="text-2xl font-bold">{totalPatients}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h6m-6 4h6m-6 4h6" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h4 className="text-sm font-medium text-gray-500">Inpatients</h4>
                            <p className="text-2xl font-bold">{inpatients}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-yellow-100 rounded-lg">
                            <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h4 className="text-sm font-medium text-gray-500">Waiting</h4>
                            <p className="text-2xl font-bold">{waitingPatients}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h4 className="text-sm font-medium text-gray-500">Discharged</h4>
                            <p className="text-2xl font-bold">{dischargedPatients}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h4 className="text-lg font-semibold text-srm-darkgray mb-4">Bed Occupancy</h4>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Occupied Beds</span>
                                <span>{occupiedBeds} ({bedOccupancyRate}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                    className="bg-red-600 h-2.5 rounded-full" 
                                    style={{ width: `${bedOccupancyRate}%` }}
                                ></div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mt-6">
                            <div className="text-center p-3 bg-red-50 rounded-lg">
                                <p className="text-2xl font-bold text-red-600">{occupiedBeds}</p>
                                <p className="text-sm text-gray-600">Occupied</p>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                <p className="text-2xl font-bold text-green-600">{availableBeds}</p>
                                <p className="text-sm text-gray-600">Available</p>
                            </div>
                            <div className="text-center p-3 bg-yellow-50 rounded-lg">
                                <p className="text-2xl font-bold text-yellow-600">{cleaningBeds}</p>
                                <p className="text-sm text-gray-600">Cleaning</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h4 className="text-lg font-semibold text-srm-darkgray mb-4">Patient Flow</h4>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <span>Admissions Today</span>
                            <span className="font-bold">12</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <span>Discharges Today</span>
                            <span className="font-bold">8</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                            <span>Transfers</span>
                            <span className="font-bold">3</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                            <span>Readmissions</span>
                            <span className="font-bold">1</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h4 className="text-lg font-semibold text-srm-darkgray mb-4">Recent Activity</h4>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-xs text-gray-700 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-3">Time</th>
                                <th className="px-6 py-3">Activity</th>
                                <th className="px-6 py-3">Patient</th>
                                <th className="px-6 py-3">Location</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-white border-b">
                                <td className="px-6 py-4">10:30 AM</td>
                                <td className="px-6 py-4">Patient Admitted</td>
                                <td className="px-6 py-4">John Doe</td>
                                <td className="px-6 py-4">Cardiology Ward</td>
                            </tr>
                            <tr className="bg-white border-b">
                                <td className="px-6 py-4">09:45 AM</td>
                                <td className="px-6 py-4">Bed Assigned</td>
                                <td className="px-6 py-4">Jane Smith</td>
                                <td className="px-6 py-4">General Medicine Ward</td>
                            </tr>
                            <tr className="bg-white border-b">
                                <td className="px-6 py-4">09:15 AM</td>
                                <td className="px-6 py-4">Patient Discharged</td>
                                <td className="px-6 py-4">Robert Johnson</td>
                                <td className="px-6 py-4">-</td>
                            </tr>
                            <tr className="bg-white border-b">
                                <td className="px-6 py-4">08:30 AM</td>
                                <td className="px-6 py-4">Bed Cleaned</td>
                                <td className="px-6 py-4">-</td>
                                <td className="px-6 py-4">Bed 202, General Medicine</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};