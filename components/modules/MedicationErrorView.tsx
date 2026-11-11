
import React from 'react';

export const MedicationErrorView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-srm-darkgray">Medication Error & ADR Monitoring</h3>
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h4 className="text-lg font-semibold mb-4">Report New Incident</h4>
                <form className="space-y-4 text-sm">
                    <select className="w-full p-2 border rounded-md bg-white">
                        <option>Select Incident Type</option>
                        <option>Medication Error</option>
                        <option>Adverse Drug Reaction (ADR)</option>
                        <option>Materiovigilance (Device)</option>
                    </select>
                    <textarea className="w-full p-2 border rounded-md" placeholder="Describe the incident..."></textarea>
                    <button className="w-full bg-srm-red text-white font-semibold p-2 rounded-md">Submit Report</button>
                </form>
            </div>
        </div>
    );
};