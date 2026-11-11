
import React from 'react';

const ambulances = [
    { id: 'Unit 101', status: 'En Route to Scene', location: 'Main St & 4th Ave' },
    { id: 'Unit 102', status: 'At Hospital', location: 'Apex Health' },
    { id: 'Unit 103', status: 'Available', location: 'Station 2' },
];

export const AmbulanceDispatchView: React.FC = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[75vh]">
            <div className="lg:col-span-2 bg-gray-300 rounded-xl shadow-sm flex items-center justify-center text-gray-500">
                <p>Live Map Placeholder</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col">
                <h3 className="text-lg font-semibold text-apex-darkgray mb-4">Ambulance Status</h3>
                <div className="space-y-3 overflow-y-auto">
                    {ambulances.map(amb => (
                         <div key={amb.id} className="p-3 rounded-md border">
                            <p className="font-bold text-sm">{amb.id}</p>
                            <p className={`text-xs font-semibold ${amb.status === 'Available' ? 'text-green-600' : 'text-yellow-700'}`}>{amb.status}</p>
                            <p className="text-xs text-gray-500 mt-1">Location: {amb.location}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
