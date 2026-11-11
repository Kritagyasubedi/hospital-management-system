
import React from 'react';

export const MHCView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-srm-darkgray">Medical Health Check (MHC) Packages</h3>
             <div className="bg-white p-6 rounded-xl shadow-sm">
                 <h4 className="text-lg font-semibold text-srm-darkgray mb-4">Active Packages</h4>
                <div className="space-y-2">
                    <p className="p-3 border rounded-md">Executive Health Check - Male</p>
                    <p className="p-3 border rounded-md">Executive Health Check - Female</p>
                    <p className="p-3 border rounded-md">Cardiac Wellness Package</p>
                </div>
            </div>
        </div>
    );
};