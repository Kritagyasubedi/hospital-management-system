
import React from 'react';

export const DoctorsDeploymentView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-srm-darkgray">Doctor Roster Management</h3>
             <div className="bg-white p-6 rounded-xl shadow-sm">
                <h4 className="text-lg font-semibold text-srm-darkgray mb-4">On-Call Schedule: Today</h4>
                 <p className="p-3 border rounded-md">Cardiology: Dr. Reed</p>
                 <p className="p-3 border rounded-md">Neurology: Dr. Johnson</p>
            </div>
        </div>
    );
};