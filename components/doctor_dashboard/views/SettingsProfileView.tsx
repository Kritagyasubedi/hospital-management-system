import React from 'react';

export const SettingsProfileView: React.FC = () => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-srm-darkgray">Settings & Profile</h3>
                <p className="text-gray-500 mt-1">Manage your profile information and application settings.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-white rounded-xl shadow-sm p-6">
                    <div className="flex flex-col items-center mb-6">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 mb-4" />
                        <h4 className="font-semibold text-lg text-srm-darkgray">Dr. Evelyn Reed</h4>
                        <p className="text-gray-600">Cardiologist</p>
                        <p className="text-sm text-gray-500">Department Head</p>
                    </div>
                    
                    <div className="space-y-3">
                        <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100">
                            <p className="font-medium">Profile Information</p>
                            <p className="text-sm text-gray-500">Update your personal details</p>
                        </button>
                        <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 bg-gray-100">
                            <p className="font-medium">Account Settings</p>
                            <p className="text-sm text-gray-500">Manage password and security</p>
                        </button>
                        <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100">
                            <p className="font-medium">Notification Preferences</p>
                            <p className="text-sm text-gray-500">Configure alerts and emails</p>
                        </button>
                        <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100">
                            <p className="font-medium">Privacy Settings</p>
                            <p className="text-sm text-gray-500">Control data visibility</p>
                        </button>
                    </div>
                </div>
                
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                    <h4 className="font-semibold text-lg text-srm-darkgray mb-6">Account Settings</h4>
                    
                    <div className="space-y-6">
                        <div>
                            <h5 className="font-medium text-gray-900 mb-3">Change Password</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                    <input 
                                        type="password" 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-srm-blue"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                    <input 
                                        type="password" 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-srm-blue"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                    <input 
                                        type="password" 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-srm-blue"
                                    />
                                </div>
                            </div>
                            <button className="mt-3 bg-srm-blue text-white font-medium py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors">
                                Update Password
                            </button>
                        </div>
                        
                        <div>
                            <h5 className="font-medium text-gray-900 mb-3">Security Settings</h5>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Two-Factor Authentication</p>
                                        <p className="text-sm text-gray-500">Add an extra layer of security</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-srm-blue"></div>
                                    </label>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Login Notifications</p>
                                        <p className="text-sm text-gray-500">Get notified of login attempts</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-srm-blue"></div>
                                    </label>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Session Timeout</p>
                                        <p className="text-sm text-gray-500">Automatically log out after inactivity</p>
                                    </div>
                                    <select className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-srm-blue">
                                        <option>15 minutes</option>
                                        <option>30 minutes</option>
                                        <option selected>1 hour</option>
                                        <option>2 hours</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <h5 className="font-medium text-gray-900 mb-3">Connected Accounts</h5>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center">
                                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium">Email</p>
                                            <p className="text-sm text-gray-500">evelyn.reed@hospital.com</p>
                                        </div>
                                    </div>
                                    <button className="text-srm-blue hover:underline text-sm">Manage</button>
                                </div>
                                
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center">
                                        <div className="bg-blue-600 p-2 rounded-lg mr-3">
                                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium">GitHub</p>
                                            <p className="text-sm text-gray-500">Connected</p>
                                        </div>
                                    </div>
                                    <button className="text-red-600 hover:underline text-sm">Disconnect</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};