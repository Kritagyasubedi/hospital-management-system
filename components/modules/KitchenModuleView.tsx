
import React from 'react';

export const KitchenModuleView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-srm-darkgray">Kitchen Production Dashboard</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                    <p className="text-sm font-medium text-gray-500">Meals for Lunch</p>
                    <p className="text-4xl font-bold text-srm-blue mt-1">175</p>
                </div>
                 <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                    <p className="text-sm font-medium text-gray-500">Diabetic Meals</p>
                    <p className="text-4xl font-bold text-srm-darkgray mt-1">32</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                    <p className="text-sm font-medium text-gray-500">Food Waste (%)</p>
                    <p className="text-4xl font-bold text-srm-red mt-1">4.2%</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h4 className="text-lg font-semibold text-srm-darkgray mb-4">Production Schedule</h4>
                <p className="text-sm text-gray-500">Details for meal prep, cooking times, and tray assembly.</p>
            </div>
        </div>
    );
};