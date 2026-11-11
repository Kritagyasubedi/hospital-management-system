
import React from 'react';

export const LaundryLinenView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-srm-darkgray">Laundry & Linen Management</h3>
             <div className="bg-white p-6 rounded-xl shadow-sm">
                 <h4 className="text-lg font-semibold mb-4">Inventory Status</h4>
                 <p className="text-sm">Clean Linen Stock: 2,500 units</p>
                 <p className="text-sm">Soiled Linen Pending Pickup: 450 units</p>
            </div>
        </div>
    );
};