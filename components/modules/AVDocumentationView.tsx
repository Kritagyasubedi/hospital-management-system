
import React from 'react';

export const AVDocumentationView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-apex-darkgray">A/V Documentation Library</h3>
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <input type="text" placeholder="Search library..." className="w-full p-2 border rounded-md" />
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="border p-3 rounded-md text-center">
                        <p className="font-semibold">Surgical Safety Training</p>
                        <p className="text-xs text-gray-500">Video | 15 min</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
