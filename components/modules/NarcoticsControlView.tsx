
import React from 'react';

export const NarcoticsControlView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-srm-darkgray">Narcotics Control & Record Management</h3>
            <div className="bg-white p-6 rounded-xl shadow-sm">
                 <h4 className="text-lg font-semibold mb-4">Vault Inventory</h4>
                 <div className="font-mono text-sm">
                    <p>Morphine Sulphate 10mg: 50 vials</p>
                    <p>Fentanyl 50mcg/mL: 25 vials</p>
                 </div>
            </div>
        </div>
    );
};