
import React from 'react';

export const DrugInfoView: React.FC = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-srm-darkgray mb-4">Drug Interaction Checker</h3>
                <div className="space-y-4 text-sm">
                    <div>
                        <label className="font-medium text-gray-700">Drug 1</label>
                        <input type="text" className="w-full mt-1 p-2 border border-gray-300 rounded-md" placeholder="e.g., Warfarin" />
                    </div>
                    <div>
                        <label className="font-medium text-gray-700">Drug 2</label>
                        <input type="text" className="w-full mt-1 p-2 border border-gray-300 rounded-md" placeholder="e.g., Aspirin" />
                    </div>
                     <button className="w-full bg-srm-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90">Check for Interactions</button>
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-md text-sm">
                        <strong>Potential Interaction:</strong> Increased risk of bleeding when Warfarin and Aspirin are taken together. Clinical monitoring is advised.
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-srm-darkgray mb-4">Adverse Drug Reaction (ADR) Report</h3>
                <form className="space-y-4 text-sm">
                     <div>
                        <label className="font-medium text-gray-700">Patient ID</label>
                        <input type="text" className="w-full mt-1 p-2 border border-gray-300 rounded-md" placeholder="e.g., P001" />
                    </div>
                    <div>
                        <label className="font-medium text-gray-700">Suspected Drug(s)</label>
                        <input type="text" className="w-full mt-1 p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="font-medium text-gray-700">Description of Reaction</label>
                        <textarea className="w-full mt-1 p-2 border border-gray-300 rounded-md" rows={4}></textarea>
                    </div>
                    <button type="submit" className="w-full bg-srm-red text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90">Submit ADR Report</button>
                </form>
            </div>
        </div>
    );
};