import React from 'react';

export const CurrentStatusView: React.FC = () => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-srm-darkgray">Current Status</h3>
                <p className="text-gray-500 mt-1">Real-time overview of patient statuses and department activities.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h4 className="font-semibold text-lg text-srm-darkgray mb-4">Patient Status Overview</h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3">Patient</th>
                                        <th className="px-4 py-3">Location</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Last Update</th>
                                        <th className="px-4 py-3">Assigned Doctor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-900">John Doe</td>
                                        <td className="px-4 py-3">Room 301</td>
                                        <td className="px-4 py-3">
                                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Stable</span>
                                        </td>
                                        <td className="px-4 py-3">10:30 AM</td>
                                        <td className="px-4 py-3">Dr. Reed</td>
                                    </tr>
                                    <tr className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-900">Jane Smith</td>
                                        <td className="px-4 py-3">ICU</td>
                                        <td className="px-4 py-3">
                                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">Critical</span>
                                        </td>
                                        <td className="px-4 py-3">9:45 AM</td>
                                        <td className="px-4 py-3">Dr. Johnson</td>
                                    </tr>
                                    <tr className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-900">Robert Johnson</td>
                                        <td className="px-4 py-3">Recovery</td>
                                        <td className="px-4 py-3">
                                            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">Improving</span>
                                        </td>
                                        <td className="px-4 py-3">11:15 AM</td>
                                        <td className="px-4 py-3">Dr. Wilson</td>
                                    </tr>
                                    <tr className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-900">Emily Davis</td>
                                        <td className="px-4 py-3">Room 205</td>
                                        <td className="px-4 py-3">
                                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Stable</span>
                                        </td>
                                        <td className="px-4 py-3">8:30 AM</td>
                                        <td className="px-4 py-3">Dr. Reed</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h4 className="font-semibold text-lg text-srm-darkgray mb-4">Department Activity</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 border rounded-lg">
                                <div>
                                    <p className="font-medium">Cardiology</p>
                                    <p className="text-sm text-gray-500">3 patients in critical care</p>
                                </div>
                                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">High Load</span>
                            </div>
                            <div className="flex justify-between items-center p-3 border rounded-lg">
                                <div>
                                    <p className="font-medium">Neurology</p>
                                    <p className="text-sm text-gray-500">1 patient in critical care</p>
                                </div>
                                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">Normal</span>
                            </div>
                            <div className="flex justify-between items-center p-3 border rounded-lg">
                                <div>
                                    <p className="font-medium">General Medicine</p>
                                    <p className="text-sm text-gray-500">0 patients in critical care</p>
                                </div>
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Low Load</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h4 className="font-semibold text-lg text-srm-darkgray mb-4">Quick Stats</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Total Patients</span>
                                <span className="font-bold text-lg">42</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Critical Cases</span>
                                <span className="font-bold text-lg text-red-600">4</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Stable Patients</span>
                                <span className="font-bold text-lg text-green-600">32</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Discharged Today</span>
                                <span className="font-bold text-lg">6</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h4 className="font-semibold text-lg text-srm-darkgray mb-4">Recent Updates</h4>
                        <div className="space-y-3">
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm font-medium">John Doe's vitals stabilized</p>
                                <p className="text-xs text-gray-500">2 minutes ago</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg">
                                <p className="text-sm font-medium">Jane Smith transferred to ICU</p>
                                <p className="text-xs text-gray-500">15 minutes ago</p>
                            </div>
                            <div className="p-3 bg-yellow-50 rounded-lg">
                                <p className="text-sm font-medium">New patient admitted</p>
                                <p className="text-xs text-gray-500">30 minutes ago</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};