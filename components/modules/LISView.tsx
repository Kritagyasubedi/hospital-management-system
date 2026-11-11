
import React from 'react';
import { mockLabOrders } from '../../services/mockData';

export const LISView: React.FC = () => {
    const getStatusPill = (status: 'Pending' | 'In Progress' | 'Complete') => {
        const colors = {
            Pending: 'bg-gray-100 text-gray-800',
            'In Progress': 'bg-blue-100 text-blue-800',
            Complete: 'bg-green-100 text-green-800',
        };
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[status]}`}>{status}</span>;
    };
    
    return (
        <div className="space-y-6">
             <div>
                <h3 className="text-xl font-semibold text-srm-darkgray">Laboratory Information System</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                     <div className="bg-white p-5 rounded-xl shadow-sm">
                        <p className="text-sm font-medium text-gray-500">Samples Pending</p>
                        <p className="text-3xl font-bold text-srm-yellow mt-1">{mockLabOrders.filter(o => o.status === 'Pending').length}</p>
                    </div>
                     <div className="bg-white p-5 rounded-xl shadow-sm">
                        <p className="text-sm font-medium text-gray-500">Tests in Progress</p>
                        <p className="text-3xl font-bold text-srm-blue mt-1">{mockLabOrders.filter(o => o.status === 'In Progress').length}</p>
                    </div>
                    <div className="bg-white p-5 rounded-xl shadow-sm">
                        <p className="text-sm font-medium text-gray-500">Results Ready</p>
                        <p className="text-3xl font-bold text-srm-green mt-1">{mockLabOrders.filter(o => o.status === 'Complete').length}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <h4 className="text-lg font-semibold text-srm-darkgray p-4 border-b">Master Log</h4>
                 <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                        <tr>
                            <th className="px-6 py-3">Order ID</th>
                            <th className="px-6 py-3">Patient</th>
                            <th className="px-6 py-3">Test</th>
                            <th className="px-6 py-3">Ordered At</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockLabOrders.map(order => (
                            <tr key={order.id} className="border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-mono text-xs">{order.id}</td>
                                <td className="px-6 py-4 font-medium">{order.patientName}</td>
                                <td className="px-6 py-4">{order.testName}</td>
                                <td className="px-6 py-4">{order.ordered}</td>
                                <td className="px-6 py-4">{getStatusPill(order.status)}</td>
                                <td className="px-6 py-4">
                                    <button className="text-srm-blue font-semibold">
                                        {order.status === 'Complete' ? 'View Report' : 'Details'}
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