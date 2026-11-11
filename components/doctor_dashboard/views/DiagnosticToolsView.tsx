import React from 'react';

export const DiagnosticToolsView: React.FC = () => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-srm-darkgray">Diagnostic Tools</h3>
                <p className="text-gray-500 mt-1">Access various diagnostic tools and calculators for patient assessment.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center mb-4">
                        <div className="bg-blue-100 p-3 rounded-lg mr-4">
                            <svg className="w-6 h-6 text-srm-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h4 className="font-semibold text-lg text-srm-darkgray">Risk Calculator</h4>
                    </div>
                    <p className="text-gray-600 mb-4">Calculate patient risk scores for various conditions.</p>
                    <button className="text-srm-blue hover:underline font-medium">Launch Tool</button>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center mb-4">
                        <div className="bg-green-100 p-3 rounded-lg mr-4">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h4 className="font-semibold text-lg text-srm-darkgray">Dosing Calculator</h4>
                    </div>
                    <p className="text-gray-600 mb-4">Calculate medication dosages based on patient parameters.</p>
                    <button className="text-srm-blue hover:underline font-medium">Launch Tool</button>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center mb-4">
                        <div className="bg-purple-100 p-3 rounded-lg mr-4">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h4 className="font-semibold text-lg text-srm-darkgray">Lab Analyzer</h4>
                    </div>
                    <p className="text-gray-600 mb-4">Analyze and interpret laboratory results.</p>
                    <button className="text-srm-blue hover:underline font-medium">Launch Tool</button>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center mb-4">
                        <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h4 className="font-semibold text-lg text-srm-darkgray">Timeline Viewer</h4>
                    </div>
                    <p className="text-gray-600 mb-4">View patient history and treatment timeline.</p>
                    <button className="text-srm-blue hover:underline font-medium">Launch Tool</button>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center mb-4">
                        <div className="bg-red-100 p-3 rounded-lg mr-4">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h4 className="font-semibold text-lg text-srm-darkgray">Symptom Checker</h4>
                    </div>
                    <p className="text-gray-600 mb-4">Assess patient symptoms and possible diagnoses.</p>
                    <button className="text-srm-blue hover:underline font-medium">Launch Tool</button>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center mb-4">
                        <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                        </div>
                        <h4 className="font-semibold text-lg text-srm-darkgray">Decision Support</h4>
                    </div>
                    <p className="text-gray-600 mb-4">Clinical decision support based on guidelines.</p>
                    <button className="text-srm-blue hover:underline font-medium">Launch Tool</button>
                </div>
            </div>
        </div>
    );
};