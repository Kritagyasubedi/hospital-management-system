import React from 'react';

export const BillingView: React.FC = () => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-srm-darkgray">Billing Overview</h3>
                <p className="text-gray-500 mt-1">Manage patient billing, insurance claims, and financial records.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-bold text-srm-darkgray mt-1">$42,560</p>
                    <p className="text-xs text-green-600 mt-2">+12.5% from last month</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <p className="text-sm text-gray-500">Outstanding Bills</p>
                    <p className="text-2xl font-bold text-srm-darkgray mt-1">$18,240</p>
                    <p className="text-xs text-red-600 mt-2">+3.2% from last month</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <p className="text-sm text-gray-500">Insurance Claims</p>
                    <p className="text-2xl font-bold text-srm-darkgray mt-1">142</p>
                    <p className="text-xs text-green-600 mt-2">8 pending</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <p className="text-sm text-gray-500">Collections</p>
                    <p className="text-2xl font-bold text-srm-darkgray mt-1">$32,180</p>
                    <p className="text-xs text-green-600 mt-2">78% collection rate</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                    <h4 className="font-semibold text-lg text-srm-darkgray mb-4">Recent Transactions</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3">Patient</th>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Service</th>
                                    <th className="px-4 py-3">Amount</th>
                                    <th className="px-4 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">John Doe</td>
                                    <td className="px-4 py-3">2024-07-21</td>
                                    <td className="px-4 py-3">Cardiac Consultation</td>
                                    <td className="px-4 py-3">$250.00</td>
                                    <td className="px-4 py-3">
                                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Paid</span>
                                    </td>
                                </tr>
                                <tr className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">Jane Smith</td>
                                    <td className="px-4 py-3">2024-07-20</td>
                                    <td className="px-4 py-3">Lab Tests</td>
                                    <td className="px-4 py-3">$180.50</td>
                                    <td className="px-4 py-3">
                                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">Pending</span>
                                    </td>
                                </tr>
                                <tr className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">Robert Johnson</td>
                                    <td className="px-4 py-3">2024-07-19</td>
                                    <td className="px-4 py-3">Surgery</td>
                                    <td className="px-4 py-3">$5,250.00</td>
                                    <td className="px-4 py-3">
                                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Paid</span>
                                    </td>
                                </tr>
                                <tr className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">Emily Davis</td>
                                    <td className="px-4 py-3">2024-07-18</td>
                                    <td className="px-4 py-3">Follow-up Visit</td>
                                    <td className="px-4 py-3">$120.00</td>
                                    <td className="px-4 py-3">
                                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">Overdue</span>
                                    </td>
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
                                <span>Generate Invoice</span>
                            </button>
                            <button className="w-full flex items-center p-3 border rounded-lg hover:bg-gray-50">
                                <div className="bg-green-100 p-2 rounded-lg mr-3">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <span>Process Payment</span>
                            </button>
                            <button className="w-full flex items-center p-3 border rounded-lg hover:bg-gray-50">
                                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span>File Insurance Claim</span>
                            </button>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h4 className="font-semibold text-lg text-srm-darkgray mb-4">Insurance Summary</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Blue Cross</span>
                                <span className="font-medium">$12,450</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Aetna</span>
                                <span className="font-medium">$8,720</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Cigna</span>
                                <span className="font-medium">$6,890</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Self-Pay</span>
                                <span className="font-medium">$3,240</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};