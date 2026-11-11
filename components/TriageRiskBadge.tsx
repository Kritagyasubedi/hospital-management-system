
import React from 'react';
import type { TriageRisk } from '../types';

interface TriageRiskBadgeProps {
  risk: TriageRisk;
}

export const TriageRiskBadge: React.FC<TriageRiskBadgeProps> = ({ risk }) => {
  const riskColorMap: Record<TriageRisk, string> = {
    High: 'bg-red-100 text-red-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Low: 'bg-green-100 text-green-800',
  };

  return (
    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${riskColorMap[risk]}`}>
      {risk}
    </span>
  );
};
