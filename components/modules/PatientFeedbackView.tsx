
import React from 'react';

export const PatientFeedbackView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-srm-darkgray">Patient Feedback & Sentiment Analysis</h3>
             <div className="bg-white p-6 rounded-xl shadow-sm">
                 <h4 className="text-lg font-semibold mb-4">Recent Feedback</h4>
                 <div className="border p-4 rounded-md">
                     <p className="text-sm text-gray-700">"The nursing staff on the 4th floor were excellent and very attentive."</p>
                     <p className="text-right text-xs font-bold text-green-600 mt-2">SENTIMENT: POSITIVE (95%)</p>
                 </div>
            </div>
        </div>
    );
};