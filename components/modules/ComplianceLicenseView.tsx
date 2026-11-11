
import React from 'react';

export const ComplianceLicenseView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-apex-darkgray">Compliance & License Tracker</h3>
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h4 className="text-lg font-semibold mb-4">License Status</h4>
                <div className="flex justify-between items-center p-3 border rounded-md">
                    <p className="font-semibold">Hospital Operating License</p>
                    <p className="text-sm text-green-600 font-bold">Expires in: 250 days</p>
                </div>
                 <div className="flex justify-between items-center p-3 border rounded-md mt-2 bg-red-50">
                    <p className="font-semibold text-red-800">Bio-Medical Waste Permit</p>
                    <p className="text-sm text-red-600 font-bold">Expires in: 15 days</p>
                </div>
            </div>
        </div>
    );
};
