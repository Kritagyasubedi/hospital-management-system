import React, { useState } from 'react';
import type { Patient } from '../../../types';

interface TestResultsViewProps {
    patients?: Patient[];
}

export const TestResultsView: React.FC<TestResultsViewProps> = ({ patients = [] }) => {
    const [selectedPatientId, setSelectedPatientId] = useState('');
    const [testType, setTestType] = useState('');
    const [priority, setPriority] = useState('Normal');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedPatientId && testType) {
            // In a real application, this would call an API to request the test
            console.log('Test requested for patient:', selectedPatientId, 'Type:', testType, 'Priority:', priority);
            setIsSubmitted(true);
            // Reset form after submission
            setSelectedPatientId('');
            setTestType('');
            setPriority('Normal');
            // Hide success message after 3 seconds
            setTimeout(() => setIsSubmitted(false), 3000);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-srm-darkgray">Test & Results</h3>
                <p className="text-gray-500 mt-1">View and manage patient diagnostic test results.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                    <h4 className="font-semibold text-lg text-srm-darkgray mb-4">Recent Test Results</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3">Patient</th>
                                    <th className="px-4 py-3">Test Type</th>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">John Doe</td>
                                    <td className="px-4 py-3">Blood Test</td>
                                    <td className="px-4 py-3">2024-07-21</td>
                                    <td className="px-4 py-3">
                                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Completed</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button className="text-srm-blue hover:underline">View</button>
                                    </td>
                                </tr>
                                <tr className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">Jane Smith</td>
                                    <td className="px-4 py-3">MRI Scan</td>
                                    <td className="px-4 py-3">2024-07-20</td>
                                    <td className="px-4 py-3">
                                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">Pending</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button className="text-srm-blue hover:underline">View</button>
                                    </td>
                                </tr>
                                <tr className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">Robert Johnson</td>
                                    <td className="px-4 py-3">X-Ray</td>
                                    <td className="px-4 py-3">2024-07-19</td>
                                    <td className="px-4 py-3">
                                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Completed</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button className="text-srm-blue hover:underline">View</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h4 className="font-semibold text-lg text-srm-darkgray mb-4">Request New Test</h4>
                        {isSubmitted && (
                            <div className="mb-4 p-3 bg-green-100 text-green-800 text-sm font-semibold rounded-md">
                                Test request submitted successfully!
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                                <select 
                                    value={selectedPatientId} 
                                    onChange={(e) => setSelectedPatientId(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-srm-blue"
                                    required
                                >
                                    <option value="">Select a patient</option>
                                    {patients.map(patient => (
                                        <option key={patient.id} value={patient.id}>
                                            {patient.name} (ID: {patient.id})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Test Type</label>
                                <select 
                                    value={testType} 
                                    onChange={(e) => setTestType(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-srm-blue"
                                    required
                                >
                                    <option value="">Select test type</option>
                                    <option value="Blood Test">Blood Test</option>
                                    <option value="Urine Test">Urine Test</option>
                                    <option value="X-Ray">X-Ray</option>
                                    <option value="CT Scan">CT Scan</option>
                                    <option value="MRI">MRI</option>
                                    <option value="ECG">ECG</option>
                                    <option value="Ultrasound">Ultrasound</option>
                                    <option value="Biopsy">Biopsy</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                <select 
                                    value={priority} 
                                    onChange={(e) => setPriority(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-srm-blue"
                                >
                                    <option value="Normal">Normal</option>
                                    <option value="Urgent">Urgent</option>
                                    <option value="STAT">STAT</option>
                                </select>
                            </div>
                            <button 
                                type="submit"
                                className="w-full bg-srm-blue text-white font-medium py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
                            >
                                Request Test
                            </button>
                        </form>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h4 className="font-semibold text-lg text-srm-darkgray mb-4">Test Statistics</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Completed Today</span>
                                <span className="font-medium">24</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Pending</span>
                                <span className="font-medium">8</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Overdue</span>
                                <span className="font-medium text-red-600">2</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};