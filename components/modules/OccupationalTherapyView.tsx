
import React from 'react';

export const OccupationalTherapyView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-srm-darkgray">Occupational Therapy Dashboard</h3>
            <div className="bg-white p-6 rounded-xl shadow-sm">
                 <h4 className="text-lg font-semibold text-srm-darkgray mb-4">Functional Improvement Tracking</h4>
                 <p className="text-sm text-gray-500">Charts and data on patient progress in Activities of Daily Living (ADLs) will be displayed here.</p>
            </div>
        </div>
    );
};