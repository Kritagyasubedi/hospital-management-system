import React, { useState, useMemo } from 'react';
import type { ActivityLog } from '../../types';
import { SearchIcon } from '../icons';

interface ActivityLogViewProps {
    logs: ActivityLog[];
}

export const ActivityLogView: React.FC<ActivityLogViewProps> = ({ logs }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredLogs = useMemo(() => {
        if (!searchTerm) {
            return logs;
        }
        const lowercasedFilter = searchTerm.toLowerCase();
        return logs.filter(log =>
            log.patientName.toLowerCase().includes(lowercasedFilter) ||
            log.patientId.toLowerCase().includes(lowercasedFilter) ||
            log.action.toLowerCase().includes(lowercasedFilter)
        );
    }, [logs, searchTerm]);

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-srm-darkgray">Patient Activity Database</h3>
                <p className="text-gray-500 mt-1">A real-time log of all actions performed by patients in the portal.</p>
            </div>

            <div className="relative">
                <input
                    type="text"
                    placeholder="Search by Patient Name, ID, or Action..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-srm-blue/50"
                />
                <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs text-gray-700 uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-3">Timestamp</th>
                            <th className="px-6 py-3">Patient Name</th>
                            <th className="px-6 py-3">Patient ID</th>
                            <th className="px-6 py-3">Action Performed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-8 text-gray-500">
                                    {searchTerm ? 'No logs match your search.' : 'No patient activity has been recorded yet.'}
                                </td>
                            </tr>
                        ) : (
                            filteredLogs.map(log => (
                                <tr key={log.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 text-gray-600">{new Date(log.timestamp).toLocaleString()}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{log.patientName}</td>
                                    <td className="px-6 py-4 font-mono text-xs">{log.patientId}</td>
                                    <td className="px-6 py-4">{log.action}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};