
import React from 'react';

export const BroughtDeadRecordView: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h3 className="text-xl font-semibold text-srm-darkgray text-center">Brought Dead Record System</h3>
             <div className="bg-white p-6 rounded-xl shadow-sm">
                <h4 className="text-lg font-semibold text-srm-darkgray mb-4">Log New Case</h4>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <input type="text" placeholder="Deceased Name (if known)" className="p-2 border rounded-md" />
                    <input type="text" placeholder="Brought in by" className="p-2 border rounded-md" />
                    <input type="datetime-local" className="p-2 border rounded-md" />
                    <input type="text" placeholder="Identifying Marks" className="p-2 border rounded-md" />
                    <textarea placeholder="Circumstances" className="p-2 border rounded-md md:col-span-2" rows={3}></textarea>
                     <button className="md:col-span-2 bg-srm-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90">Log Case</button>
                </form>
            </div>
             <div className="bg-white p-6 rounded-xl shadow-sm">
                <h4 className="text-lg font-semibold text-srm-darkgray mb-4">Recent Logs</h4>
                <p className="text-sm text-gray-500">No recent logs found.</p>
            </div>
        </div>
    );
};