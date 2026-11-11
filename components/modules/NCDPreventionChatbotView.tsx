
import React from 'react';

export const NCDPreventionChatbotView: React.FC = () => {
    return (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm h-[70vh] flex flex-col">
            <h3 className="text-lg font-semibold text-srm-darkgray p-4 border-b">NCD Prevention Chatbot</h3>
            <div className="flex-grow p-4 space-y-3 overflow-y-auto">
                <div className="flex">
                    <p className="bg-srm-lightblue p-3 rounded-lg max-w-xs">Hello! I'm your AI health assistant. I can help you assess your risk for non-communicable diseases like diabetes and hypertension. Would you like to start?</p>
                </div>
                <div className="flex justify-end">
                    <p className="bg-srm-blue text-white p-3 rounded-lg max-w-xs">Yes, let's start.</p>
                </div>
            </div>
            <div className="p-4 border-t">
                <input className="w-full p-2 border rounded-md" placeholder="Type your message..." />
            </div>
        </div>
    );
};