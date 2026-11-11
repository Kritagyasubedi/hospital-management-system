
import React from 'react';
import type { PatientPrescription } from '../../types';

interface PrescriptionHistoryProps {
  prescriptions: PatientPrescription[];
}

export const PrescriptionHistory: React.FC<PrescriptionHistoryProps> = ({ prescriptions }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-srm-darkgray mb-4">Prescription History</h3>
      {prescriptions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-xs text-gray-700 uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-3">Medication</th>
                <th scope="col" className="px-6 py-3">Dosage</th>
                <th scope="col" className="px-6 py-3">Instructions</th>
                <th scope="col" className="px-6 py-3">Prescribed By</th>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">Type</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((rx) => (
                <tr key={rx.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{rx.medication}</td>
                  <td className="px-6 py-4">{rx.dosage}</td>
                  <td className="px-6 py-4">{rx.instructions}</td>
                  <td className="px-6 py-4">{rx.doctor}</td>
                  <td className="px-6 py-4">{rx.date}</td>
                  <td className="px-6 py-4">
                    {rx.patientType ? (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        rx.patientType === 'inpatient' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {rx.patientType.charAt(0).toUpperCase() + rx.patientType.slice(1)}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500 py-8">No prescriptions on record.</p>
      )}
    </div>
  );
};
