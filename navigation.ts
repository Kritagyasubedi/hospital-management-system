import type { NavCategoryType } from './types';
import { 
    DashboardIcon, 
    PatientsIcon, 
    TriageIcon, 
    SettingsIcon, 
    FolderIcon,
    ClinicalIcon,
    LegalIcon,
    FacilityIcon,
    IntegrationIcon,
    AdminIcon,
    SupplyChainIcon,
    DocumentTextIcon,
    FlaskIcon,
    AmbulanceIcon,
    CogIcon,
    InternIcon,
    BrainIcon,
    PulseIcon,
    ShieldAlertIcon,
    PlayIcon
} from './components/icons';

export const navStructure: NavCategoryType[] = [
    {
        category: 'Clinical Intelligence (ICU)',
        icon: BrainIcon,
        items: [
            { id: 'ci_icu_warning', label: 'ICU Early Warning', icon: BrainIcon },
            { id: 'ci_replay', label: 'Chronological Replay', icon: PlayIcon },
            { id: 'ci_alerts', label: 'Alert Center & Audit Log', icon: ShieldAlertIcon },
            { id: 'ci_model_performance', label: 'Model Performance & Benchmark', icon: BrainIcon },
            { id: 'ci_alert_analytics', label: 'Alert Analytics & Fatigue', icon: ShieldAlertIcon },
            { id: 'ci_data_quality', label: 'Telemetry Data Quality', icon: PulseIcon },
        ]
    },
    {
        category: 'Main',
        icon: FolderIcon,
        items: [
            { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
            { id: 'intern_dashboard', label: 'Intern Dashboard', icon: InternIcon },
            { id: 'triage', label: 'Triage Queue', icon: TriageIcon },
            { id: 'patient', label: 'Current Patient', icon: PatientsIcon },
        ]
    },
    {
        category: 'Clinical Modules',
        icon: ClinicalIcon,
        items: [
            { id: 'module_1', label: 'Registration & Appointments', icon: DocumentTextIcon },
            { id: 'module_2', label: 'Complaint & Query Portal', icon: DocumentTextIcon },
            { id: 'module_3', label: 'Digital Vitals Logging', icon: DocumentTextIcon },
            { id: 'module_5', label: 'Consultation & E-Prescription', icon: DocumentTextIcon },
            { id: 'module_6', label: 'Pharmacy Information System', icon: DocumentTextIcon },
            { id: 'module_7', label: 'Drug Info & ADR Reporting', icon: DocumentTextIcon },
            { id: 'module_8', label: 'Lab Information System (LIS)', icon: FlaskIcon },
            { id: 'module_9', label: 'Diagnostic Info System (DTIS)', icon: DocumentTextIcon },
            { id: 'module_10', label: 'Hospital Billing Management', icon: DocumentTextIcon },
        ]
    },
    {
        category: 'Emergency & Legal',
        icon: LegalIcon,
        items: [
            { id: 'module_11', label: 'Emergency Case Management', icon: AmbulanceIcon },
            { id: 'module_12', label: 'Medico-Legal Case (MLC) System', icon: DocumentTextIcon },
            { id: 'module_13', label: 'AMA Workflow Automation', icon: DocumentTextIcon },
            { id: 'module_14', label: 'Brought Dead Record System', icon: DocumentTextIcon },
            { id: 'module_15', label: 'Ambulance Dispatch', icon: AmbulanceIcon },
            { id: 'module_16', label: 'Digital Security Logging', icon: DocumentTextIcon },
        ]
    },
    {
        category: 'Support & Facility',
        icon: FacilityIcon,
        items: [
            { id: 'module_17', label: 'Diet & Nutrition Management', icon: DocumentTextIcon },
            { id: 'module_18', label: 'Kitchen Module', icon: DocumentTextIcon },
            { id: 'module_19', label: 'F&B Order Management', icon: DocumentTextIcon },
            { id: 'module_20', label: 'Physiotherapy Records', icon: DocumentTextIcon },
            { id: 'module_21', label: 'Occupational Therapy Module', icon: DocumentTextIcon },
            { id: 'module_22', label: 'OT Scheduling & Workflow', icon: DocumentTextIcon },
            { id: 'module_23', label: 'ICU Digital Monitoring', icon: DocumentTextIcon },
            { id: 'module_24', label: 'Ward Management', icon: DocumentTextIcon },
            { id: 'module_25', label: 'Medical Health Check (MHC)', icon: DocumentTextIcon },
            { id: 'module_26', label: 'Nursing Deployment', icon: DocumentTextIcon },
            { id: 'module_27', label: 'Doctors Deployment System', icon: DocumentTextIcon },
            { id: 'module_27b', label: 'Biomedical Equipments Mgmt', icon: CogIcon},
            { id: 'module_28', label: 'Medical Gas Usage Tracking', icon: DocumentTextIcon },
            { id: 'module_29', label: 'Patient Porter System', icon: DocumentTextIcon },
            { id: 'module_30', label: 'Patient Feedback Management', icon: DocumentTextIcon },
        ]
    },
    {
        category: 'Integration & Automation',
        icon: IntegrationIcon,
        items: [
            { id: 'module_31', label: 'Outsourced Test Integration', icon: DocumentTextIcon },
            { id: 'module_32', label: 'Discharge & Transcription', icon: DocumentTextIcon },
            { id: 'module_33', label: 'Discharge Summary Mgmt', icon: DocumentTextIcon },
            { id: 'module_34', label: 'Compliance & License Tracker', icon: DocumentTextIcon },
            { id: 'module_35', label: 'AV Documentation & Retrieval', icon: DocumentTextIcon },
            { id: 'module_36', label: 'Housekeeping & Waste Mgmt', icon: DocumentTextIcon },
            { id: 'module_37', label: 'Complaints & Issue Tracker', icon: DocumentTextIcon },
            { id: 'module_38', label: 'IT Management Module', icon: DocumentTextIcon },
            { id: 'module_39', label: 'Mortuary Record Management', icon: DocumentTextIcon },
            { id: 'module_40', label: 'Transplant Case Management', icon: DocumentTextIcon },
            { id: 'module_41', label: 'CSSD Workflow Management', icon: DocumentTextIcon },
            { id: 'module_42', label: 'Laundry & Linen Management', icon: DocumentTextIcon },
        ]
    },
     {
        category: 'Administrative & Financial',
        icon: AdminIcon,
        items: [
            { id: 'module_43', label: 'HR & Training Platform', icon: DocumentTextIcon },
            { id: 'module_44', label: 'Performance Review Module', icon: DocumentTextIcon },
            { id: 'module_45', label: 'Narcotics Control Software', icon: DocumentTextIcon },
            { id: 'module_46', label: 'Accounts & Finance Automation', icon: DocumentTextIcon },
            { id: 'module_47', label: 'Digital Accreditation Mgmt', icon: DocumentTextIcon },
            { id: 'module_48', label: 'Quality & Compliance Dashboard', icon: DocumentTextIcon },
            { id: 'module_49', label: 'Operations Mgmt Dashboard', icon: DocumentTextIcon },
            { id: 'module_50', label: 'Insurance & Claims Portal', icon: DocumentTextIcon },
            { id: 'module_51', label: 'Corporate Tieups Management', icon: DocumentTextIcon },
        ]
    },
    {
        category: 'Supply Chain & Prevention',
        icon: SupplyChainIcon,
        items: [
            { id: 'module_52', label: 'General Purchase & Store', icon: DocumentTextIcon },
            { id: 'module_53', label: 'Medication Error Monitoring', icon: DocumentTextIcon },
            { id: 'module_54', label: 'NCD Prevention Chatbot', icon: DocumentTextIcon },
        ]
    },
    {
        category: 'System',
        icon: FolderIcon,
        items: [
            { id: 'settings', label: 'Settings', icon: SettingsIcon },
            { id: 'test-ai', label: 'Test AI Features', icon: DocumentTextIcon },
        ]
    }
];