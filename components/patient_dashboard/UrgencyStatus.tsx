
import React from 'react';
import type { TriageRisk } from '../../types';

interface UrgencyStatusProps {
  risk: TriageRisk;
}

export const UrgencyStatus: React.FC<UrgencyStatusProps> = ({ risk }) => {
  const riskInfoMap: Record<TriageRisk, { color: string; message: string }> = {
    High: { color: 'bg-srm-red', message: 'Your case is considered high urgency. Please follow medical advice closely.' },
    Medium: { color: 'bg-srm-yellow', message: 'Your case is of medium urgency. Monitor your symptoms.' },
    Low: { color: 'bg-srm-green', message: 'Your case is low urgency. Rest and follow up as advised.' },
  };

  const { color, message } = riskInfoMap[risk];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-srm-darkgray mb-4">Urgency Level</h3>
        <div className={`p-4 rounded-lg text-white ${color}`}>
            <p className="font-bold text-xl text-center">{risk} Risk</p>
        </div>
        <p className="text-sm text-gray-600 mt-3 text-center">{message}</p>
    </div>
  );
};
