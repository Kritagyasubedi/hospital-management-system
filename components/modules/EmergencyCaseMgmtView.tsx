
import React from 'react';
import { mockEmergencyCases } from '../../services/mockData';

const ERBedStatus = [
    { id: 'ER-1', status: 'Occupied' }, { id: 'ER-2', status: 'Occupied' },
    { id: 'ER-3', status: 'Available' }, { id: 'ER-4', status: 'Cleaning' },
    { id: 'TRAUMA-1', status: 'Available' }, { id: 'TRAUMA-2', status: 'Occupied' },
];

export const EmergencyCaseMgmtView: React.FC = () => {
    const getStatusColor = (status: string) => {
        if(status === 'Occupied') return 'bg-red-500';
        if(status === 'Available') return 'bg-green-500';
        if(status === 'Cleaning') return 'bg-yellow-500';
        return 'bg-gray-500';
    }
    
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-srm-darkgray">Emergency Department Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-xl shadow-sm">
                    <p className="text-sm font-medium text-gray-500">Incoming Ambulances</p>
                    <p className="text-3xl font-bold text-srm-red mt-1">{mockEmergencyCases.filter(c=>c.status==='Incoming').length}</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm">
                    <p className="text-sm font-medium text-gray-500">Active ER Cases</p>
                    <p className="text-3xl font-bold text-srm-blue mt-1">{mockEmergencyCases.filter(c=>c.status==='In ER').length}</p>
                </div>
                 <div className="bg-white p-5 rounded-xl shadow-sm">
                    <p className="text-sm font-medium text-gray-500">Avg. Wait Time</p>
                    <p className="text-3xl font-bold text-srm-darkgray mt-1">22 min</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <h4 className="text-lg font-semibold text-srm-darkgray mb-4">Live Case List</h4>
                     <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                            <tr>
                                <th className="px-4 py-2">Case/Patient</th>
                                <th className="px-4 py-2">Complaint</th>
                                <th className="px-4 py-2">ETA / Status</th>
                            </tr>
                        </thead>
                        <tbody>
                           {mockEmergencyCases.map(c => (
                            <tr key={c.id} className={`border-b ${c.status === 'Incoming' ? 'bg-red-50' : ''}`}>
                                <td className="px-4 py-3 font-semibold">{c.patientName}</td>
                                <td className="px-4 py-3">{c.complaint}</td>
                                <td className={`px-4 py-3 font-bold ${c.status === 'Incoming' ? 'text-red-600' : 'text-gray-700'}`}>{c.eta}</td>
                            </tr>
                           ))}
                        </tbody>
                    </table>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <h4 className="text-lg font-semibold text-srm-darkgray mb-4">ER Bed Status</h4>
                    <div className="grid grid-cols-3 gap-3">
                        {ERBedStatus.map(bed => (
                            <div key={bed.id} className="p-3 rounded-md text-center border">
                                <p className="font-bold text-sm">{bed.id}</p>
                                <div className="flex items-center justify-center mt-1">
                                    <span className={`h-3 w-3 rounded-full mr-2 ${getStatusColor(bed.status)}`}></span>
                                    <span className="text-xs font-semibold">{bed.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};