import React from 'react';
import { VitalsChart } from '../VitalsChart';
import { mockPatients } from '../../services/mockData';

export const LiveVitals: React.FC = () => {
    const patientWithVitals = (mockPatients.find(p => p.vitals && p.vitals.length > 0) || mockPatients[0]);
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-srm-darkgray mb-4">Live Vitals Monitoring</h3>
            <VitalsChart patient={patientWithVitals} />
        </div>
    );
};
