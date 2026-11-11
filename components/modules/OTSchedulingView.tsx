
import React from 'react';

export const OTSchedulingView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-srm-darkgray">Operation Theatre Schedule</h3>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-3 text-left">Time</th>
                            <th className="px-6 py-3 text-left">Procedure</th>
                            <th className="px-6 py-3 text-left">Patient</th>
                            <th className="px-6 py-3 text-left">Surgeon</th>
                            <th className="px-6 py-3 text-left">OT</th>
                            <th className="px-6 py-3 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b">
                            <td className="px-6 py-4 font-semibold">08:00</td>
                            <td className="px-6 py-4">Appendectomy</td>
                            <td className="px-6 py-4">Sarah Lee</td>
                            <td className="px-6 py-4">Dr. Carter</td>
                            <td className="px-6 py-4">OT-1</td>
                            <td className="px-6 py-4 text-green-600 font-bold">Completed</td>
                        </tr>
                         <tr className="border-b bg-blue-50">
                            <td className="px-6 py-4 font-semibold">10:30</td>
                            <td className="px-6 py-4">Knee Arthroscopy</td>
                            <td className="px-6 py-4">Mike Ross</td>
                            <td className="px-6 py-4">Dr. Evans</td>
                            <td className="px-6 py-4">OT-2</td>
                            <td className="px-6 py-4 text-blue-600 font-bold">In Progress</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};