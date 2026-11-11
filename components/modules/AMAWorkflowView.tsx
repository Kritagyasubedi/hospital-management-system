
import React from 'react';

export const AMAWorkflowView: React.FC = () => {
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h3 className="text-xl font-semibold text-srm-darkgray text-center">Against Medical Advice (AMA) Discharge</h3>
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h4 className="text-lg font-semibold text-srm-darkgray mb-4">Initiate AMA Process</h4>
                <form className="space-y-4 text-sm">
                    <div>
                        <label className="font-medium text-gray-700">Patient ID</label>
                        <input type="text" className="w-full mt-1 p-2 border border-gray-300 rounded-md" placeholder="e.g., P002" />
                    </div>
                    <div>
                        <label className="font-medium text-gray-700">Reason for AMA</label>
                        <textarea className="w-full mt-1 p-2 border border-gray-300 rounded-md" rows={3}></textarea>
                    </div>
                     <button className="w-full bg-srm-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90">Start Workflow</button>
                </form>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h4 className="text-lg font-semibold text-srm-darkgray mb-4">Active AMA Workflows</h4>
                 <p className="text-sm text-center text-gray-500">No active AMA workflows.</p>
            </div>
        </div>
    );
};