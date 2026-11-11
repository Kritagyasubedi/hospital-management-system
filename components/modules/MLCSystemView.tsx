
import React from 'react';
import { mockMLCases } from '../../services/mockData';

export const MLCSystemView: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                 <h3 className="text-xl font-semibold text-srm-darkgray">Medico-Legal Case (MLC) Registry</h3>
                 <button className="bg-srm-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 text-sm">Register New MLC</button>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                        <tr>
                            <th className="px-6 py-3">MLC No.</th>
                            <th className="px-6 py-3">Patient Name</th>
                            <th className="px-6 py-3">Incident Date</th>
                            <th className="px-6 py-3">Case Type</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockMLCases.map(c => (
                             <tr key={c.id} className="border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-mono text-sm">{c.id}</td>
                                <td className="px-6 py-4 font-medium">{c.patientName}</td>
                                <td className="px-6 py-4">{c.incidentDate}</td>
                                <td className="px-6 py-4">{c.type}</td>
                                <td className="px-6 py-4">
                                    <span className={`font-semibold ${c.status === 'Active' ? 'text-red-600' : 'text-gray-600'}`}>{c.status}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <button className="font-medium text-srm-blue">View Details</button>
                                </td>
                             </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <div className="bg-gray-800 text-white p-4 rounded-xl shadow-sm">
                <h4 className="font-semibold text-lg">Immutable Audit Log (Blockchain Simulated)</h4>
                <div className="font-mono text-xs mt-3 bg-black/50 p-3 rounded-md h-48 overflow-y-auto">
                    <p>&gt; [2024-07-21 14:05:10] USER 'admin' CREATED MLC001. HASH: 0x5a...f3</p>
                    <p>&gt; [2024-07-21 14:08:22] USER 'dr_smith' ACCESSED MLC001. HASH: 0x1c...a9</p>
                    <p>&gt; [2024-07-21 14:15:03] USER 'police_badge_123' VIEWED MLC001. HASH: 0x8d...b1</p>
                </div>
            </div>
        </div>
    );
};