
import React from 'react';
import { mockPurchaseOrders } from '../../services/mockData';

export const GeneralPurchaseStoreView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-srm-darkgray">General Purchase & Store</h3>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <h4 className="p-4 font-semibold text-lg border-b">Active Purchase Orders</h4>
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs uppercase">
                        <tr>
                           <th className="px-6 py-3 text-left">PO #</th>
                           <th className="px-6 py-3 text-left">Supplier</th>
                           <th className="px-6 py-3 text-left">Item</th>
                           <th className="px-6 py-3 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockPurchaseOrders.map(po => (
                             <tr key={po.id} className="border-b">
                                <td className="px-6 py-4 font-mono text-xs">{po.id}</td>
                                <td className="px-6 py-4">{po.supplier}</td>
                                <td className="px-6 py-4">{po.item}</td>
                                <td className="px-6 py-4 font-semibold">{po.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};