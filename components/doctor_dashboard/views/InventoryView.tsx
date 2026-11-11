import React from 'react';

export const InventoryView: React.FC = () => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-srm-darkgray">Inventory & Equipment</h3>
                <p className="text-gray-500 mt-1">Manage medical supplies, equipment, and inventory tracking.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                    <h4 className="font-semibold text-lg text-srm-darkgray mb-4">Current Inventory</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3">Item</th>
                                    <th className="px-4 py-3">Category</th>
                                    <th className="px-4 py-3">Quantity</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Last Updated</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">Surgical Masks</td>
                                    <td className="px-4 py-3">PPE</td>
                                    <td className="px-4 py-3">1,250</td>
                                    <td className="px-4 py-3">
                                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Adequate</span>
                                    </td>
                                    <td className="px-4 py-3">2024-07-21</td>
                                </tr>
                                <tr className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">Nitrile Gloves</td>
                                    <td className="px-4 py-3">PPE</td>
                                    <td className="px-4 py-3">800</td>
                                    <td className="px-4 py-3">
                                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">Low Stock</span>
                                    </td>
                                    <td className="px-4 py-3">2024-07-21</td>
                                </tr>
                                <tr className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">IV Fluids</td>
                                    <td className="px-4 py-3">Medical Supplies</td>
                                    <td className="px-4 py-3">450</td>
                                    <td className="px-4 py-3">
                                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Adequate</span>
                                    </td>
                                    <td className="px-4 py-3">2024-07-20</td>
                                </tr>
                                <tr className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">Surgical Instruments</td>
                                    <td className="px-4 py-3">Equipment</td>
                                    <td className="px-4 py-3">24</td>
                                    <td className="px-4 py-3">
                                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Adequate</span>
                                    </td>
                                    <td className="px-4 py-3">2024-07-19</td>
                                </tr>
                                <tr className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">Bandages</td>
                                    <td className="px-4 py-3">Medical Supplies</td>
                                    <td className="px-4 py-3">120</td>
                                    <td className="px-4 py-3">
                                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">Critical</span>
                                    </td>
                                    <td className="px-4 py-3">2024-07-21</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h4 className="font-semibold text-lg text-srm-darkgray mb-4">Quick Actions</h4>
                        <div className="space-y-3">
                            <button className="w-full flex items-center p-3 border rounded-lg hover:bg-gray-50">
                                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span>Request Supplies</span>
                            </button>
                            <button className="w-full flex items-center p-3 border rounded-lg hover:bg-gray-50">
                                <div className="bg-green-100 p-2 rounded-lg mr-3">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <span>Generate Report</span>
                            </button>
                            <button className="w-full flex items-center p-3 border rounded-lg hover:bg-gray-50">
                                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span>Schedule Maintenance</span>
                            </button>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h4 className="font-semibold text-lg text-srm-darkgray mb-4">Inventory Alerts</h4>
                        <div className="space-y-3">
                            <div className="p-3 bg-yellow-50 rounded-lg">
                                <p className="font-medium text-sm">Low Stock Alert</p>
                                <p className="text-xs text-gray-600">Nitrile Gloves running low (800 remaining)</p>
                            </div>
                            <div className="p-3 bg-red-50 rounded-lg">
                                <p className="font-medium text-sm">Critical Stock Alert</p>
                                <p className="text-xs text-gray-600">Bandages critically low (120 remaining)</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <p className="font-medium text-sm">New Shipment</p>
                                <p className="text-xs text-gray-600">Surgical masks shipment arriving tomorrow</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h4 className="font-semibold text-lg text-srm-darkgray mb-4">Equipment Tracking</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                        <p className="text-2xl font-bold text-srm-blue">42</p>
                        <p className="text-sm text-gray-600">Total Equipment</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                        <p className="text-2xl font-bold text-green-600">38</p>
                        <p className="text-sm text-gray-600">Operational</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                        <p className="text-2xl font-bold text-yellow-600">3</p>
                        <p className="text-sm text-gray-600">Maintenance</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                        <p className="text-2xl font-bold text-red-600">1</p>
                        <p className="text-sm text-gray-600">Out of Service</p>
                    </div>
                </div>
            </div>
        </div>
    );
};