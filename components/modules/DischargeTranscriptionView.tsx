
import React from 'react';

export const DischargeTranscriptionView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-apex-darkgray">Discharge Clearance & Transcription</h3>
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h4 className="text-lg font-semibold mb-4">Discharge Checklist: John Doe (P001)</h4>
                <ul className="space-y-2 text-sm">
                    <li className="flex items-center"><span className="h-5 w-5 rounded-full bg-green-500 mr-3"></span>Pharmacy Clearance: Complete</li>
                    <li className="flex items-center"><span className="h-5 w-5 rounded-full bg-green-500 mr-3"></span>Billing Clearance: Complete</li>
                    <li className="flex items-center"><span className="h-5 w-5 rounded-full bg-yellow-500 mr-3"></span>Nursing Unit Clearance: Pending</li>
                </ul>
            </div>
        </div>
    );
};
