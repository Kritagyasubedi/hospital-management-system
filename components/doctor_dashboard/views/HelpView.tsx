import React from 'react';

export const HelpView: React.FC = () => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-srm-darkgray">Help & Documentation</h3>
                <p className="text-gray-500 mt-1">Access user guides, FAQs, and support resources.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h4 className="font-semibold text-lg text-srm-darkgray mb-4">Frequently Asked Questions</h4>
                        <div className="space-y-4">
                            <div className="border-b pb-4">
                                <p className="font-medium">How do I access patient records?</p>
                                <p className="text-gray-600 mt-2">Navigate to the 'Patient List' section in the sidebar, then select a patient to view their complete medical record.</p>
                            </div>
                            <div className="border-b pb-4">
                                <p className="font-medium">How do I prescribe medication?</p>
                                <p className="text-gray-600 mt-2">Go to the 'Prescriptions' section, select a patient, and fill out the prescription form with medication details.</p>
                            </div>
                            <div className="border-b pb-4">
                                <p className="font-medium">How do I schedule appointments?</p>
                                <p className="text-gray-600 mt-2">Use the 'Appointments' section to view your schedule and create new appointments for patients.</p>
                            </div>
                            <div className="border-b pb-4">
                                <p className="font-medium">How do I view department patients?</p>
                                <p className="text-gray-600 mt-2">Expand the 'Departments' section in the sidebar and select your department to view all assigned patients.</p>
                            </div>
                            <div>
                                <p className="font-medium">How do I export reports?</p>
                                <p className="text-gray-600 mt-2">Visit the 'Analytics & Reports' section and use the export functionality to generate PDF or Excel reports.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h4 className="font-semibold text-lg text-srm-darkgray mb-4">Video Tutorials</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-32 mb-3" />
                                <p className="font-medium">Getting Started Guide</p>
                                <p className="text-sm text-gray-500">5 min</p>
                            </div>
                            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-32 mb-3" />
                                <p className="font-medium">Patient Management</p>
                                <p className="text-sm text-gray-500">8 min</p>
                            </div>
                            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-32 mb-3" />
                                <p className="font-medium">Prescription Workflow</p>
                                <p className="text-sm text-gray-500">6 min</p>
                            </div>
                            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-32 mb-3" />
                                <p className="font-medium">Reporting Features</p>
                                <p className="text-sm text-gray-500">10 min</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h4 className="font-semibold text-lg text-srm-darkgray mb-4">Contact Support</h4>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium">Email Support</p>
                                    <p className="text-sm text-gray-600">support@hospital.com</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <div className="bg-green-100 p-2 rounded-lg mr-3">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium">Phone Support</p>
                                    <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium">Live Chat</p>
                                    <p className="text-sm text-gray-600">Available 24/7</p>
                                </div>
                            </div>
                        </div>
                        
                        <button className="w-full mt-6 bg-srm-blue text-white font-medium py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors">
                            Submit Support Ticket
                        </button>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h4 className="font-semibold text-lg text-srm-darkgray mb-4">System Information</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Version</span>
                                <span className="font-medium">v2.1.4</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Last Updated</span>
                                <span className="font-medium">July 15, 2024</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Status</span>
                                <span className="font-medium text-green-600">Operational</span>
                            </div>
                        </div>
                        
                        <button className="w-full mt-4 text-srm-blue hover:underline font-medium">
                            Check for Updates
                        </button>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h4 className="font-semibold text-lg text-srm-darkgray mb-4">Quick Links</h4>
                        <div className="space-y-2">
                            <button className="block w-full text-left p-2 rounded-lg hover:bg-gray-100">
                                User Manual
                            </button>
                            <button className="block w-full text-left p-2 rounded-lg hover:bg-gray-100">
                                Release Notes
                            </button>
                            <button className="block w-full text-left p-2 rounded-lg hover:bg-gray-100">
                                Best Practices
                            </button>
                            <button className="block w-full text-left p-2 rounded-lg hover:bg-gray-100">
                                Training Materials
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};