import React from 'react';
import { VitalsChart } from '../VitalsChart';
import { mockPatients } from '../../services/mockData';

export const ICUMonitoringView: React.FC = () => {
    const patient = mockPatients.find(p => p.vitals && p.vitals.length > 0) || mockPatients[0];
    
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-srm-darkgray">ICU Central Monitoring</h3>
            <div>
                <h4 className="text-lg font-semibold text-srm-darkgray mb-2">Bed 4 - {patient.name}</h4>
                <VitalsChart patient={patient} />
            </div>
        </div>
    );
};
