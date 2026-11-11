
import React from 'react';

export const MortuaryRecordView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-srm-darkgray">Mortuary Record Management</h3>
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h4 className="text-lg font-semibold mb-4">Register New Case</h4>
                <form className="space-y-4 text-sm">
                    <input className="w-full p-2 border rounded-md" placeholder="Deceased Name" />
                    <input className="w-full p-2 border rounded-md" placeholder="MLC No. (if applicable)" />
                    <button className="w-full bg-srm-blue text-white font-semibold p-2 rounded-md">Register</button>
                </form>
            </div>
        </div>
    );
};