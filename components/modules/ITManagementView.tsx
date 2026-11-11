
import React from 'react';
import { mockITTickets } from '../../services/mockData';

export const ITManagementView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-srm-darkgray">IT Support Ticketing System</h3>
             <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-3 text-left">User</th>
                            <th className="px-6 py-3 text-left">Issue</th>
                            <th className="px-6 py-3 text-left">Priority</th>
                            <th className="px-6 py-3 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockITTickets.map(t => (
                            <tr key={t.id} className="border-b">
                                <td className="px-6 py-4">{t.user}</td>
                                <td className="px-6 py-4">{t.issue}</td>
                                <td className="px-6 py-4 font-semibold">{t.priority}</td>
                                <td className="px-6 py-4 font-semibold">{t.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};