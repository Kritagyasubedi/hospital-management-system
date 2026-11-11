
import React from 'react';

export const TransplantCaseMgmtView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-srm-darkgray">Transplant Case Management</h3>
            <div className="bg-white p-6 rounded-xl shadow-sm">
                 <h4 className="text-lg font-semibold mb-4">Active Cases</h4>
                 <p className="text-sm text-gray-500">No active transplant cases.</p>
            </div>
        </div>
    );
};