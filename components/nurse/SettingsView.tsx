import React, { useState } from 'react';

export const SettingsView: React.FC = () => {
    const [notifications, setNotifications] = useState(true);
    const [emailReports, setEmailReports] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-srm-darkgray">Settings</h3>
                <p className="text-gray-500 mt-1">Manage your preferences and system settings.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h4 className="text-lg font-semibold text-srm-darkgray mb-4">User Preferences</h4>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Notifications</p>
                            <p className="text-sm text-gray-500">Receive alerts for important events</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={notifications}
                                onChange={() => setNotifications(!notifications)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-srm-blue"></div>
                        </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Email Reports</p>
                            <p className="text-sm text-gray-500">Receive daily reports via email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={emailReports}
                                onChange={() => setEmailReports(!emailReports)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-srm-blue"></div>
                        </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Dark Mode</p>
                            <p className="text-sm text-gray-500">Use dark theme for the interface</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={darkMode}
                                onChange={() => setDarkMode(!darkMode)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-srm-blue"></div>
                        </label>
                    </div>
                </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h4 className="text-lg font-semibold text-srm-darkgray mb-4">Ward Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Default Department</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-srm-blue bg-white">
                            <option>Cardiology</option>
                            <option>General Medicine</option>
                            <option>Orthopedics</option>
                            <option>Neurology</option>
                            <option>Pediatrics</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notification Sound</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-srm-blue bg-white">
                            <option>Default</option>
                            <option>Soft Chime</option>
                            <option>Urgent Alert</option>
                            <option>Silent</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h4 className="text-lg font-semibold text-srm-darkgray mb-4">Bed Management</h4>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Room Number Prefix</label>
                        <input 
                            type="text" 
                            defaultValue="RM" 
                            className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-srm-blue"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bed Number Format</label>
                        <select className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-srm-blue bg-white">
                            <option>01, 02, 03...</option>
                            <option>1, 2, 3...</option>
                            <option>A, B, C...</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Auto-assign Beds</label>
                        <p className="text-sm text-gray-500 mb-2">Automatically assign beds to patients based on department proximity</p>
                        <button className="px-4 py-2 bg-srm-blue text-white font-medium rounded-lg hover:bg-opacity-90">
                            Configure Auto-assignment Rules
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h4 className="text-lg font-semibold text-srm-darkgray mb-4">System Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-500">Version</p>
                        <p className="font-medium">v2.1.4</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Last Updated</p>
                        <p className="font-medium">October 25, 2025</p>
                    </div>
                    <div>
                        <p className="text-gray-500">User Role</p>
                        <p className="font-medium">Nurse Head</p>
                    </div>
                    <div>
                        <p className="text-gray-500">System Status</p>
                        <p className="font-medium text-green-600">Operational</p>
                    </div>
                </div>
            </div>
        </div>
    );
};