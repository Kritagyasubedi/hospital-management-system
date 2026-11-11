
import React from 'react';

export const PerformanceReviewView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-srm-darkgray">Performance Review Dashboard</h3>
             <div className="bg-white p-6 rounded-xl shadow-sm">
                 <h4 className="text-lg font-semibold mb-4">Current Review Cycle: Q3 2024</h4>
                 <p className="text-sm">Self-Appraisals Due: 2024-09-15</p>
            </div>
        </div>
    );
};