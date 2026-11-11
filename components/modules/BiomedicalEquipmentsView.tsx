
import React from 'react';
import { mockEquipment } from '../../services/mockData';

export const BiomedicalEquipmentsView: React.FC = () => {
    const getStatusPill = (status: 'Operational' | 'Maintenance' | 'Offline') => {
        const colors = {
            Operational: 'bg-green-100 text-green-800',
            Maintenance: 'bg-yellow-100 text-yellow-800',
            Offline: 'bg-red-100 text-red-800',
        };
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[status]}`}>{status}</span>;
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-apex-darkgray">Biomedical Equipment Management</h3>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-3 text-left">Equipment ID</th>
                            <th className="px-6 py-3 text-left">Name</th>
                            <th className="px-6 py-3 text-left">Location</th>
                            <th className="px-6 py-3 text-left">Status</th>
                            <th className="px-6 py-3 text-left">Next Maintenance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockEquipment.map(eq => (
                             <tr key={eq.id} className="border-b">
                                <td className="px-6 py-4 font-mono text-xs">{eq.id}</td>
                                <td className="px-6 py-4 font-semibold">{eq.name}</td>
                                <td className="px-6 py-4">{eq.location}</td>
                                <td className="px-6 py-4">{getStatusPill(eq.status)}</td>
                                <td className="px-6 py-4">{eq.nextMaint}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
