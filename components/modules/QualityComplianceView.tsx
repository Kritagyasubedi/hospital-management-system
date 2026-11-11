
import React from 'react';
import { mockQualityMetrics } from '../../services/mockData';

export const QualityComplianceView: React.FC = () => {
    const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
        if(trend === 'up') return <span className="text-green-500">▲</span>;
        if(trend === 'down') return <span className="text-red-500">▼</span>;
        return <span className="text-gray-500">▬</span>;
    }
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-srm-darkgray">Quality & Compliance Dashboard</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mockQualityMetrics.map(m => (
                    <div key={m.id} className="bg-white p-4 rounded-xl shadow-sm">
                        <p className="text-sm font-medium text-gray-500">{m.name}</p>
                        <div className="flex items-end justify-between mt-2">
                            <p className="text-3xl font-bold">{m.value}</p>
                            <div className="text-right">
                                <p className="text-xs text-gray-500">Target: {m.target}</p>
                                <p className="text-lg font-bold">{getTrendIcon(m.trend)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};