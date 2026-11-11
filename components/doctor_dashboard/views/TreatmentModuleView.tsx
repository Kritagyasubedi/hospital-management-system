import React from 'react';

export const TreatmentModuleView: React.FC = () => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-srm-darkgray">Treatment Module</h3>
                <p className="text-gray-500 mt-1">Manage and track patient treatment plans and protocols.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                    <h4 className="font-semibold text-lg text-srm-darkgray mb-4">Active Treatment Plans</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3">Patient</th>
                                    <th className="px-4 py-3">Condition</th>
                                    <th className="px-4 py-3">Start Date</th>
                                    <th className="px-4 py-3">Progress</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">John Doe</td>
                                    <td className="px-4 py-3">Hypertension</td>
                                    <td className="px-4 py-3">2024-07-15</td>
                                    <td className="px-4 py-3">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-green-600 h-2 rounded-full" style={{width: '75%'}}></div>
                                        </div>
                                        <span className="text-xs text-gray-500">75%</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button className="text-srm-blue hover:underline">View</button>
                                    </td>
                                </tr>
                                <tr className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">Jane Smith</td>
                                    <td className="px-4 py-3">Diabetes</td>
                                    <td className="px-4 py-3">2024-07-10</td>
                                    <td className="px-4 py-3">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-blue-600 h-2 rounded-full" style={{width: '45%'}}></div>
                                        </div>
                                        <span className="text-xs text-gray-500">45%</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button className="text-srm-blue hover:underline">View</button>
                                    </td>
                                </tr>
                                <tr className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">Robert Johnson</td>
                                    <td className="px-4 py-3">Heart Failure</td>
                                    <td className="px-4 py-3">2024-07-05</td>
                                    <td className="px-4 py-3">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-yellow-600 h-2 rounded-full" style={{width: '30%'}}></div>
                                        </div>
                                        <span className="text-xs text-gray-500">30%</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button className="text-srm-blue hover:underline">View</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h4 className="font-semibold text-lg text-srm-darkgray mb-4">Create New Treatment Plan</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-srm-blue">
                                    <option>Select patient</option>
                                    <option>John Doe</option>
                                    <option>Jane Smith</option>
                                    <option>Robert Johnson</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                                <input 
                                    type="text" 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-srm-blue"
                                    placeholder="Enter condition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Protocol</label>
                                <textarea 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-srm-blue"
                                    placeholder="Describe treatment plan"
                                    rows={3}
                                ></textarea>
                            </div>
                            <button className="w-full bg-srm-blue text-white font-medium py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors">
                                Create Plan
                            </button>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h4 className="font-semibold text-lg text-srm-darkgray mb-4">Treatment Protocols</h4>
                        <div className="space-y-3">
                            <div className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                <p className="font-medium">Hypertension Management</p>
                                <p className="text-sm text-gray-500">Standard protocol</p>
                            </div>
                            <div className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                <p className="font-medium">Diabetes Care</p>
                                <p className="text-sm text-gray-500">Standard protocol</p>
                            </div>
                            <div className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                <p className="font-medium">Heart Failure Protocol</p>
                                <p className="text-sm text-gray-500">Advanced protocol</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};