import React from 'react';
import type { Patient } from '../types';

interface MedicalHistoryViewProps {
  patient: Patient;
}

export const MedicalHistoryView: React.FC<MedicalHistoryViewProps> = ({ patient }) => {
  const { medicalHistory } = patient;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-srm-darkgray mb-4">Medical History</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-srm-darkgray mb-2">Past Conditions</h4>
          {medicalHistory.pastConditions.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {medicalHistory.pastConditions.map(item => (
                <li key={item.id} className="p-3 bg-gray-50 rounded-md border">
                  <p className="font-medium text-gray-800">{item.condition}</p>
                  <p className="text-xs text-gray-500">Diagnosed: {item.diagnosedDate}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No past conditions on record.</p>
          )}
        </div>
        <div>
          <h4 className="font-semibold text-srm-darkgray mb-2">Surgeries</h4>
          {medicalHistory.surgeries.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {medicalHistory.surgeries.map(item => (
                <li key={item.id} className="p-3 bg-gray-50 rounded-md border">
                  <p className="font-medium text-gray-800">{item.procedure}</p>
                  <p className="text-xs text-gray-500">Date: {item.date}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No surgical history on record.</p>
          )}
        </div>
      </div>
    </div>
  );
};
