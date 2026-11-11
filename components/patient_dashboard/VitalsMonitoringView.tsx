import React from 'react';
import { VitalsChart } from '../VitalsChart';
import type { Patient } from '../../types';

interface VitalsMonitoringViewProps {
  patient: Patient;
}

const VitalsCard: React.FC<{label: string, value: string | number | undefined, unit: string}> = ({label, value, unit}) => (
    <div className="bg-srm-lightblue p-4 rounded-lg text-center border border-srm-blue/20">
        <p className="text-sm text-srm-blue font-semibold">{label}</p>
        <p className="text-3xl font-bold text-srm-darkgray mt-1">{value ?? 'N/A'}</p>
        <p className="text-xs text-gray-500">{unit}</p>
    </div>
);

export const VitalsMonitoringView: React.FC<VitalsMonitoringViewProps> = ({ patient }) => {
    // Get the latest vitals from the historical data
    const latestVitals = patient.vitals && patient.vitals.length > 0 ? patient.vitals[patient.vitals.length - 1] : null;
    
    // Convert Celsius to Fahrenheit for temperature display
    const temperatureF = latestVitals?.temperature ? (latestVitals.temperature * 9/5) + 32 : undefined;
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                <h3 className="text-lg font-semibold text-srm-darkgray">Vitals Monitoring</h3>
                {latestVitals && (
                    <p className="text-sm text-gray-500 mt-2 sm:mt-0">
                        Last historical entry: {new Date(latestVitals.timestamp).toLocaleString()}
                    </p>
                )}
            </div>

            {latestVitals ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <VitalsCard label="Temperature" value={temperatureF ? temperatureF.toFixed(1) : 'N/A'} unit="°F" />
                    <VitalsCard label="Heart Rate" value={latestVitals.heartRate} unit="bpm" />
                    <VitalsCard label="Resp. Rate" value={latestVitals.respirationRate} unit="/min" />
                    <VitalsCard label="BP Systolic" value={latestVitals.bloodPressure.systolic} unit="mmHg" />
                    <VitalsCard label="BP Diastolic" value={latestVitals.bloodPressure.diastolic} unit="mmHg" />
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                    <p>No vitals have been recorded yet.</p>
                </div>
            )}
            
            <div>
                 <h4 className="text-md font-semibold text-srm-darkgray mb-4">Vitals History</h4>
                 {patient && patient.vitals && patient.vitals.length > 0 ? (
                    <VitalsChart patient={patient} />
                 ) : (
                    <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
                       <p className="text-gray-400">The chart will appear here once vitals are recorded.</p>
                    </div>
                 )}
            </div>
        </div>
    );
};