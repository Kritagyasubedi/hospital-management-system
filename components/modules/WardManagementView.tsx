
import React from 'react';
import { mockWardBeds } from '../../services/mockData';

export const WardManagementView: React.FC = () => {
    const getStatusColor = (status: string) => {
        if(status === 'Occupied') return 'bg-red-100 border-red-400';
        if(status === 'Available') return 'bg-green-100 border-green-400';
        if(status === 'Cleaning') return 'bg-yellow-100 border-yellow-400';
        return 'bg-gray-100 border-gray-400';
    }
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-srm-darkgray">Ward & Bed Management</h3>
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h4 className="text-lg font-semibold text-srm-darkgray mb-4">Cardiology Ward</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {mockWardBeds.map(bed => (
                        <div key={bed.id} className={`p-3 rounded-lg border-2 text-center ${getStatusColor(bed.status)}`}>
                            <p className="font-bold">{bed.bedNumber}</p>
                            <p className="text-xs mt-1 truncate">{bed.patientName || bed.status}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};