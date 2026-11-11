
import React from 'react';

export const OutsourcedTestView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-apex-darkgray">Outsourced Test Integration (API)</h3>
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h4 className="text-lg font-semibold mb-4">Incoming FHIR Observation Bundles</h4>
                <div className="font-mono text-xs bg-gray-800 text-green-400 p-4 rounded-md h-64 overflow-y-auto">
                    <p>// Waiting for results from external labs...</p>
                </div>
            </div>
        </div>
    );
};
