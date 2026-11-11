
import React from 'react';

export const MedicalGasTrackingView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-apex-darkgray">Medical Gas Supply Monitoring</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-white p-6 rounded-xl shadow-sm">
                     <h4 className="font-semibold">Oxygen (O2) Supply</h4>
                     <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                        <div className="bg-blue-500 h-4 rounded-full" style={{width: '75%'}}></div>
                     </div>
                     <p className="text-sm text-right mt-1 font-semibold">75% Full</p>
                 </div>
                 <div className="bg-white p-6 rounded-xl shadow-sm">
                     <h4 className="font-semibold">Nitrous Oxide (N2O) Supply</h4>
                     <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                        <div className="bg-green-500 h-4 rounded-full" style={{width: '90%'}}></div>
                     </div>
                     <p className="text-sm text-right mt-1 font-semibold">90% Full</p>
                 </div>
            </div>
        </div>
    );
};
