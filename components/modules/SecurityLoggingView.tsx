
import React from 'react';

export const SecurityLoggingView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-srm-darkgray">Digital Security Logging</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h4 className="font-semibold text-srm-darkgray">Visitor Log</h4>
                    <form className="space-y-2 text-sm mt-4">
                        <input className="w-full p-2 border rounded-md" type="text" placeholder="Visitor Name" />
                        <input className="w-full p-2 border rounded-md" type="text" placeholder="Patient Visiting" />
                        <button className="w-full bg-srm-blue text-white p-2 rounded-md font-semibold">Log Entry</button>
                    </form>
                </div>
                 <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h4 className="font-semibold text-srm-darkgray">Incident Report</h4>
                    <form className="space-y-2 text-sm mt-4">
                        <select className="w-full p-2 border rounded-md bg-white">
                            <option>Unauthorized Access</option>
                            <option>Disturbance</option>
                            <option>Theft/Loss</option>
                        </select>
                        <textarea className="w-full p-2 border rounded-md" placeholder="Details..." rows={2}></textarea>
                        <button className="w-full bg-srm-red text-white p-2 rounded-md font-semibold">File Report</button>
                    </form>
                </div>
                 <div className="bg-white p-6 rounded-xl shadow-sm">
                     <h4 className="font-semibold text-srm-darkgray">Access Logs</h4>
                    <div className="text-xs font-mono bg-gray-100 p-2 rounded mt-4 h-32 overflow-y-auto">
                        <p>[14:05] Door 3A (ER) opened by Badge #101</p>
                        <p>[14:02] Door 7C (Pharmacy) opened by Badge #205</p>
                        <p>[13:55] Door 3A (ER) opened by Badge #102</p>
                    </div>
                </div>
            </div>
        </div>
    );
};