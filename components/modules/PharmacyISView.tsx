
import React from 'react';
import { mockPrescriptions } from '../../services/mockData';

const lowStockItems = [
    { name: 'Atorvastatin 20mg', qty: 35, par: 100 },
    { name: 'Metformin 500mg', qty: 50, par: 200 },
    { name: 'Amlodipine 5mg', qty: 25, par: 100 },
];

export const PharmacyISView: React.FC = () => {
    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-semibold text-srm-darkgray">Pharmacy Dashboard</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    <div className="bg-white p-5 rounded-xl shadow-sm">
                        <p className="text-sm font-medium text-gray-500">Pending Prescriptions</p>
                        <p className="text-3xl font-bold text-srm-blue mt-1">{mockPrescriptions.filter(p => p.status === 'Pending').length}</p>
                    </div>
                    <div className="bg-white p-5 rounded-xl shadow-sm">
                        <p className="text-sm font-medium text-gray-500">Filled Today</p>
                        <p className="text-3xl font-bold text-srm-darkgray mt-1">124</p>
                    </div>
                     <div className="bg-white p-5 rounded-xl shadow-sm">
                        <p className="text-sm font-medium text-gray-500">Low Stock Alerts</p>
                        <p className="text-3xl font-bold text-srm-red mt-1">{lowStockItems.length}</p>
                    </div>
                </div>
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <h4 className="text-lg font-semibold text-srm-darkgray p-4 border-b">Incoming E-Prescriptions</h4>
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                            <tr>
                                <th className="px-6 py-3">Patient</th>
                                <th className="px-6 py-3">Medication</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockPrescriptions.filter(p=> p.status === 'Pending').map(rx => (
                                <tr key={rx.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{rx.patientName}</td>
                                    <td className="px-6 py-4">{rx.medication}</td>
                                    <td className="px-6 py-4 text-yellow-600 font-semibold">{rx.status}</td>
                                    <td className="px-6 py-4"><button className="text-srm-blue font-semibold">View</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 <div className="bg-white rounded-xl shadow-sm p-4">
                    <h4 className="text-lg font-semibold text-srm-darkgray mb-2">Low Stock Items</h4>
                    <ul className="space-y-2">
                        {lowStockItems.map(item => (
                            <li key={item.name} className="flex justify-between items-center text-sm p-2 bg-red-50 rounded-md">
                                <span className="font-medium text-red-800">{item.name}</span>
                                <span className="text-red-600 font-bold">Qty: {item.qty} (Par: {item.par})</span>
                            </li>
                        ))}
                    </ul>
                 </div>
             </div>
        </div>
    );
};