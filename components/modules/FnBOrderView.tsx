
import React from 'react';

export const FnBOrderView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-srm-darkgray">F&B Order Management</h3>
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h4 className="text-lg font-semibold text-srm-darkgray mb-4">Tray Tracking</h4>
                <div className="flex items-center space-x-4">
                    <input type="text" placeholder="Scan Tray QR Code..." className="flex-grow p-2 border rounded-md"/>
                    <button className="bg-srm-blue text-white font-semibold p-2 rounded-md">Verify</button>
                </div>
                <p className="text-sm text-green-600 mt-2 font-semibold">Last Scan: Tray #101 for John Doe (Diabetic Diet) - Verified OK.</p>
            </div>
        </div>
    );
};