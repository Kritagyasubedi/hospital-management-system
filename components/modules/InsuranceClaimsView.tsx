
import React from 'react';

export const InsuranceClaimsView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-srm-darkgray">Insurance & Claims Portal</h3>
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h4 className="text-lg font-semibold mb-4">Pending Claims</h4>
                <div className="flex justify-between items-center p-3 border rounded-md">
                    <p>Patient: John Doe | Policy: #INS-12345</p>
                    <p className="text-sm font-semibold text-yellow-600">Status: Under Review</p>
                </div>
            </div>
        </div>
    );
};