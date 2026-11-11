
import React from 'react';

export const DietNutritionView: React.FC = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-srm-darkgray mb-4">Patient Meal Plan</h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border rounded-md">
                        <p>John Doe (P001)</p>
                        <p className="text-sm font-semibold">Diabetic, Low Sodium</p>
                        <button className="text-srm-blue text-sm font-semibold">View Plan</button>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-md">
                        <p>Jane Smith (P002)</p>
                        <p className="text-sm font-semibold">Regular Diet</p>
                        <button className="text-srm-blue text-sm font-semibold">View Plan</button>
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
                 <h3 className="text-lg font-semibold text-srm-darkgray mb-4">Assign Diet Plan</h3>
                 <form className="space-y-4 text-sm">
                    <input type="text" className="w-full p-2 border rounded-md" placeholder="Patient ID"/>
                    <select className="w-full p-2 border rounded-md bg-white">
                        <option>Select Diet Type</option>
                        <option>Diabetic</option>
                        <option>Renal</option>
                        <option>Low Sodium</option>
                        <option>Clear Liquid</option>
                    </select>
                    <textarea className="w-full p-2 border rounded-md" placeholder="Additional Notes..." rows={3}></textarea>
                    <button className="w-full bg-srm-blue text-white p-2 rounded-md font-semibold">Assign Plan</button>
                 </form>
            </div>
        </div>
    );
};