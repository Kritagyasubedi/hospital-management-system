
import React from 'react';
import { mockStats } from '../../services/mockData';
import { QualityComplianceView } from './QualityComplianceView';

export const OperationsDashboardView: React.FC = () => {
    return (
        <div className="space-y-8">
            <h3 className="text-xl font-semibold text-srm-darkgray">Unified Operations Dashboard</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {mockStats.map(stat => (
                    <div key={stat.label} className="bg-white p-5 rounded-xl shadow-sm">
                        <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>
            <div>
                <QualityComplianceView />
            </div>
        </div>
    );
};