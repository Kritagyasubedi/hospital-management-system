
import React, { useState } from 'react';
import { mockPatients, mockBillItems } from '../../services/mockData';
import type { Patient } from '../../types';

interface HospitalBillingViewProps {
    patients?: Patient[];
}

export const HospitalBillingView: React.FC<HospitalBillingViewProps> = ({ patients }) => {
    const allPatients = patients && patients.length > 0 ? patients : mockPatients;
    const [selectedPid, setSelectedPid] = useState(allPatients[0]?.id || '');
    const patient = allPatients.find(p => p.id === selectedPid) || allPatients[0];
    const totalAmount = mockBillItems.reduce((acc, item) => acc + item.amount, 0);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-srm-darkgray">Hospital Billing & Invoice</h3>
                    <p className="text-xs text-gray-500">Live patient invoicing and ledger</p>
                </div>
                <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">Patient:</label>
                    <select 
                        value={patient?.id} 
                        onChange={(e) => setSelectedPid(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md text-sm bg-white"
                    >
                        {allPatients.map(p => (
                            <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b">
                    <h3 className="text-xl font-semibold text-srm-darkgray">Patient Billing Summary</h3>
                    <div className="flex justify-between text-sm mt-2">
                        <div>
                            <p className="font-bold text-srm-blue text-base">{patient?.name}</p>
                            <p className="text-gray-500">Patient ID: <span className="font-mono">{patient?.id}</span></p>
                            <p className="text-gray-500">Department: {patient?.department || 'General Medicine'}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Billing Date: {new Date().toLocaleDateString()}</p>
                            <p className="text-gray-500">Status: <span className="text-green-600 font-semibold">{patient?.status || 'Active'}</span></p>
                        </div>
                    </div>
                </div>
            <div className="p-6">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase">
                        <tr>
                            <th className="py-2">Description</th>
                            <th className="py-2">Department</th>
                            <th className="py-2 text-right">Amount (USD)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockBillItems.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="py-3 font-medium">{item.description}</td>
                                <td className="py-3 text-gray-600">{item.department}</td>
                                <td className="py-3 text-right font-mono">${item.amount.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="font-bold">
                            <td colSpan={2} className="py-4 text-right text-lg">Total Due</td>
                            <td className="py-4 text-right text-lg font-mono">${totalAmount.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div className="p-6 bg-gray-50 rounded-b-xl flex justify-end space-x-3">
                 <button className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 text-sm">
                    Process Insurance Claim
                </button>
                <button className="bg-srm-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 text-sm">
                    Generate Final Invoice
                </button>
            </div>
            </div>
        </div>
    );
};