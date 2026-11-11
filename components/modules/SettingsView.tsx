
import React from 'react';

export const SettingsView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-srm-darkgray">System Settings</h3>
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h4 className="text-lg font-semibold mb-4">User Preferences</h4>
                <p className="text-sm text-gray-500">Configuration options for notifications, themes, and more will be available here.</p>
            </div>
        </div>
    );
};