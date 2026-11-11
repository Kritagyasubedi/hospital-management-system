
import React from 'react';

export const AccountsFinanceView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-srm-darkgray">Accounts & Finance Automation</h3>
             <div className="bg-white p-6 rounded-xl shadow-sm">
                 <h4 className="text-lg font-semibold mb-4">Financial Overview</h4>
                 <p className="text-sm">Revenue Today: $150,230</p>
                 <p className="text-sm">Outstanding Payables: $45,800</p>
            </div>
        </div>
    );
};