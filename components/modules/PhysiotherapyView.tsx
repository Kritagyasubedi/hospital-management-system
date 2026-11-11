
import React from 'react';

export const PhysiotherapyView: React.FC = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-srm-darkgray mb-4">Today's PT Appointments</h3>
                 <p className="text-sm text-gray-500">No appointments scheduled for today.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-srm-darkgray mb-4">Enter Progress Note</h3>
                <form className="space-y-4 text-sm">
                    <input className="w-full p-2 border rounded-md" placeholder="Patient ID" />
                    <textarea className="w-full p-2 border rounded-md" placeholder="Enter session notes..." rows={5}></textarea>
                    <button className="w-full bg-srm-blue text-white font-semibold py-2 px-4 rounded-lg">Save Note</button>
                </form>
            </div>
        </div>
    );
};