
import React from 'react';

export const PatientPorterView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-srm-darkgray">Patient Porter Request System</h3>
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h4 className="text-lg font-semibold mb-4">New Transport Request</h4>
                <form className="grid grid-cols-2 gap-4 text-sm">
                    <input className="p-2 border rounded-md" placeholder="Patient ID" />
                    <input className="p-2 border rounded-md" placeholder="From Location (e.g., Ward 2)" />
                    <input className="p-2 border rounded-md" placeholder="To Location (e.g., Radiology)" />
                    <select className="p-2 border rounded-md bg-white">
                        <option>Priority: Routine</option>
                        <option>Priority: Urgent</option>
                    </select>
                    <button className="col-span-2 bg-srm-blue text-white font-semibold p-2 rounded-md">Submit Request</button>
                </form>
            </div>
        </div>
    );
};