import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Patient } from '../types';

interface VitalsChartProps {
  patient: Patient;
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-md">
        <p className="font-semibold">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.dataKey}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const VitalsChart: React.FC<VitalsChartProps> = ({ patient }) => {
  // If no vitals data, show a message
  if (!patient.vitals || patient.vitals.length === 0) {
    return (
      <div className="bg-srm-blue rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6 text-center">Vitals Monitoring Chart</h3>
        <div className="bg-white bg-opacity-20 rounded-lg p-8 text-center">
          <p className="text-white text-lg">No vitals data available for {patient.name}</p>
          <p className="text-white text-opacity-80 mt-2">Vitals monitoring will appear here once data is recorded.</p>
        </div>
      </div>
    );
  }

  // Prepare data for the chart
  const chartData = patient.vitals.map(v => ({
    time: new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temperature: v.temperature,
    heartRate: v.heartRate,
    bp_systolic: v.bloodPressure.systolic,
    bp_diastolic: v.bloodPressure.diastolic,
    respirationRate: v.respirationRate,
  }));

  return (
    <div className="bg-srm-blue rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6 text-center">Vitals Monitoring Chart</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#fff" strokeOpacity={0.3} />
            <XAxis 
              dataKey="time" 
              stroke="#fff" 
              tick={{ fill: '#fff', fontSize: 12 }}
            />
            <YAxis 
              stroke="#fff" 
              tick={{ fill: '#fff', fontSize: 12 }}
              yAxisId="left"
            />
            <YAxis 
              stroke="#fff" 
              tick={{ fill: '#fff', fontSize: 12 }}
              orientation="right"
              yAxisId="right"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ color: '#fff' }}
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="temperature" 
              name="Temperature (°C)" 
              stroke="#FFEB3B" 
              activeDot={{ r: 8 }} 
              strokeWidth={2}
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="heartRate" 
              name="Heart Rate (bpm)" 
              stroke="#4CAF50" 
              strokeWidth={2}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="bp_systolic" 
              name="BP Systolic (mmHg)" 
              stroke="#F44336" 
              strokeWidth={2}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="bp_diastolic" 
              name="BP Diastolic (mmHg)" 
              stroke="#2196F3" 
              strokeWidth={2}
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="respirationRate" 
              name="Respiration Rate" 
              stroke="#9C27B0" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-center text-white text-opacity-80 text-sm">
        <p>Latest Reading: {new Date(patient.vitals[patient.vitals.length - 1].timestamp).toLocaleString()}</p>
      </div>
    </div>
  );
};