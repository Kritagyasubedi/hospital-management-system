import React from 'react';

export const VitalsAssessmentView: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-full bg-white rounded-xl shadow-sm border-2 border-dashed">
            <div className="text-center p-8">
                <h2 className="text-xl font-semibold text-srm-darkgray">Vitals & Assessment</h2>
                <p className="mt-2 text-gray-500">
                    This functionality has been moved to the <span className="font-semibold">Reception Portal</span> under "Patient Assessment".
                </p>
                <p className="mt-1 text-gray-500">
                    Interns should now use the "Patient Queue" to view patient details and proceed directly to "Assign to Doctor".
                </p>
            </div>
        </div>
    );
};
