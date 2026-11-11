
import React from 'react';

const mockImages = [
    { id: 1, patient: 'John Doe', type: 'Chest X-Ray', date: '2024-07-21', status: 'Reported' },
    { id: 2, patient: 'Jane Smith', type: 'Abdominal CT', date: '2024-07-21', status: 'Unreported' },
    { id: 3, patient: 'Carlos Ray', type: 'Ankle MRI', date: '2024-07-20', status: 'Reported' },
];

export const DTISView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-srm-darkgray">Diagnostic Imaging Dashboard (PACS/RIS)</h3>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <h4 className="text-lg font-semibold text-srm-darkgray mb-4">Radiologist Worklist</h4>
                    <ul className="space-y-2">
                        {mockImages.filter(img => img.status === 'Unreported').map(img => (
                            <li key={img.id} className="flex justify-between items-center p-3 bg-blue-50 rounded-md">
                                <div>
                                    <p className="font-semibold text-sm">{img.type}</p>
                                    <p className="text-xs text-gray-600">Patient: {img.patient} | Date: {img.date}</p>
                                </div>
                                <button className="text-sm bg-srm-blue text-white font-semibold py-1 px-3 rounded-md hover:bg-opacity-90">
                                    Open Study
                                </button>
                            </li>
                        ))}
                         {mockImages.filter(img => img.status === 'Unreported').length === 0 && <p className="text-sm text-gray-500">Worklist is clear.</p>}
                    </ul>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4">
                     <h4 className="text-lg font-semibold text-srm-darkgray mb-4">Recent Studies</h4>
                     <div className="space-y-2">
                         {mockImages.map(img => (
                            <div key={img.id} className="flex items-center space-x-4 p-2 border-b">
                                <div className="w-16 h-16 bg-gray-800 text-white flex items-center justify-center rounded-md text-xs text-center">
                                    {img.type}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">{img.patient}</p>
                                    <p className="text-xs text-gray-500">{img.date}</p>
                                    <span className={`text-xs font-bold ${img.status === 'Reported' ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {img.status}
                                    </span>
                                </div>
                            </div>
                         ))}
                     </div>
                </div>
            </div>
        </div>
    );
};