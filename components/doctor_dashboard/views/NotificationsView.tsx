import React from 'react';

export const NotificationsView: React.FC = () => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-srm-darkgray">Notifications</h3>
                <p className="text-gray-500 mt-1">Stay updated with important alerts and system notifications.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h4 className="font-semibold text-lg text-srm-darkgray">Recent Notifications</h4>
                    <button className="text-srm-blue hover:underline text-sm">Mark all as read</button>
                </div>
                
                <div className="space-y-4">
                    <div className="flex p-4 border rounded-lg bg-blue-50">
                        <div className="flex-shrink-0 mr-3">
                            <div className="bg-blue-100 p-2 rounded-full">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="font-medium">Patient Alert</p>
                            <p className="text-sm text-gray-600">John Doe's blood pressure has spiked. Please review immediately.</p>
                            <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                        </div>
                        <button className="text-srm-blue hover:underline text-sm">View</button>
                    </div>
                    
                    <div className="flex p-4 border rounded-lg">
                        <div className="flex-shrink-0 mr-3">
                            <div className="bg-green-100 p-2 rounded-full">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="font-medium">Appointment Confirmed</p>
                            <p className="text-sm text-gray-600">Jane Smith's appointment for tomorrow has been confirmed.</p>
                            <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                        </div>
                        <button className="text-srm-blue hover:underline text-sm">View</button>
                    </div>
                    
                    <div className="flex p-4 border rounded-lg">
                        <div className="flex-shrink-0 mr-3">
                            <div className="bg-yellow-100 p-2 rounded-full">
                                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="font-medium">Lab Results Ready</p>
                            <p className="text-sm text-gray-600">Robert Johnson's blood test results are now available.</p>
                            <p className="text-xs text-gray-500 mt-1">3 hours ago</p>
                        </div>
                        <button className="text-srm-blue hover:underline text-sm">View</button>
                    </div>
                    
                    <div className="flex p-4 border rounded-lg">
                        <div className="flex-shrink-0 mr-3">
                            <div className="bg-purple-100 p-2 rounded-full">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="font-medium">Team Meeting</p>
                            <p className="text-sm text-gray-600">Cardiology department meeting scheduled for 3:00 PM today.</p>
                            <p className="text-xs text-gray-500 mt-1">Yesterday</p>
                        </div>
                        <button className="text-srm-blue hover:underline text-sm">View</button>
                    </div>
                    
                    <div className="flex p-4 border rounded-lg">
                        <div className="flex-shrink-0 mr-3">
                            <div className="bg-red-100 p-2 rounded-full">
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="font-medium">System Maintenance</p>
                            <p className="text-sm text-gray-600">Scheduled system maintenance this weekend. Plan accordingly.</p>
                            <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                        </div>
                        <button className="text-srm-blue hover:underline text-sm">View</button>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h4 className="font-semibold text-lg text-srm-darkgray mb-4">Notification Settings</h4>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700">Email Notifications</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-srm-blue"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700">SMS Alerts</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-srm-blue"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700">In-App Notifications</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-srm-blue"></div>
                            </label>
                        </div>
                    </div>
                </div>
                
                <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-6">
                    <h4 className="font-semibold text-lg text-srm-darkgray mb-4">Quick Actions</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
                            <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span>Send Message</span>
                        </button>
                        <button className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
                            <div className="bg-green-100 p-2 rounded-lg mr-3">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <span>Create Report</span>
                        </button>
                        <button className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
                            <div className="bg-purple-100 p-2 rounded-lg mr-3">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span>Schedule Appointment</span>
                        </button>
                        <button className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
                            <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <span>View Alerts</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};