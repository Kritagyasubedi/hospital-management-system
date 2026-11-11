import React from 'react';

export const MessagingView: React.FC = () => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-srm-darkgray">Messaging</h3>
                <p className="text-gray-500 mt-1">Communicate with patients, colleagues, and hospital staff.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 bg-white rounded-xl shadow-sm p-4">
                    <h4 className="font-semibold text-lg text-srm-darkgray mb-4">Contacts</h4>
                    <div className="space-y-2">
                        <div className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100">
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                            <div className="ml-3">
                                <p className="font-medium text-sm">Dr. Alice Johnson</p>
                                <p className="text-xs text-gray-500">Neurology</p>
                            </div>
                        </div>
                        <div className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100 bg-gray-100">
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                            <div className="ml-3">
                                <p className="font-medium text-sm">Dr. Ben Carter</p>
                                <p className="text-xs text-gray-500">Orthopedics</p>
                            </div>
                        </div>
                        <div className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100">
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                            <div className="ml-3">
                                <p className="font-medium text-sm">Nurse Sarah Miller</p>
                                <p className="text-xs text-gray-500">ICU</p>
                            </div>
                        </div>
                        <div className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100">
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                            <div className="ml-3">
                                <p className="font-medium text-sm">John Doe</p>
                                <p className="text-xs text-gray-500">Patient</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="lg:col-span-3 flex flex-col">
                    <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                        <div className="flex items-center">
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                            <div className="ml-3">
                                <p className="font-medium">Dr. Ben Carter</p>
                                <p className="text-sm text-gray-500">Orthopedics</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm p-4 flex-1 flex flex-col">
                        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                            <div className="flex justify-start">
                                <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                                    <p className="text-sm">Hi Dr. Reed, I wanted to discuss the patient's MRI results.</p>
                                    <p className="text-xs text-gray-500 mt-1">10:30 AM</p>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <div className="bg-srm-blue text-white rounded-lg p-3 max-w-xs">
                                    <p className="text-sm">Sure, I've reviewed them. What are your thoughts?</p>
                                    <p className="text-xs text-blue-100 mt-1">10:32 AM</p>
                                </div>
                            </div>
                            <div className="flex justify-start">
                                <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                                    <p className="text-sm">I think we should consider surgical intervention.</p>
                                    <p className="text-xs text-gray-500 mt-1">10:35 AM</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex">
                            <input 
                                type="text" 
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-srm-blue"
                                placeholder="Type your message..."
                            />
                            <button className="bg-srm-blue text-white px-4 py-2 rounded-r-lg hover:bg-opacity-90 transition-colors">
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};