import React from 'react';

const Placeholder: React.FC<{ title: string }> = ({ title }) => (
    <div className="flex items-center justify-center h-full bg-white rounded-xl shadow-sm border-2 border-dashed">
        <div className="text-center p-8">
            <h2 className="text-xl font-semibold text-srm-darkgray">{title}</h2>
            <p className="mt-2 text-gray-500">This feature is under development and will be available soon.</p>
        </div>
    </div>
);

export const PatientReportsView: React.FC = () => <Placeholder title="Patient Reports" />;
export const CaseHistoryView: React.FC = () => <Placeholder title="Case History" />;
export const TestResultsView: React.FC = () => <Placeholder title="Test & Results" />;
export const DiagnosticToolsView: React.FC = () => <Placeholder title="Diagnostic Tools" />;
export const CurrentStatusView: React.FC = () => <Placeholder title="Current Patient Status" />;
export const TreatmentModuleView: React.FC = () => <Placeholder title="Treatment Module" />;

// New Placeholders
export const AppointmentsView: React.FC = () => <Placeholder title="Appointments / Schedule" />;
export const MessagingView: React.FC = () => <Placeholder title="Messaging / Internal Chat" />;
export const NotificationsView: React.FC = () => <Placeholder title="Notifications / Alerts" />;
export const InventoryView: React.FC = () => <Placeholder title="Inventory & Equipment Status" />;
export const BillingView: React.FC = () => <Placeholder title="Billing & Insurance Overview" />;
export const AnalyticsView: React.FC = () => <Placeholder title="Analytics & Reports" />;
export const SettingsProfileView: React.FC = () => <Placeholder title="Settings / Profile" />;
export const HelpView: React.FC = () => <Placeholder title="Help / Documentation" />;