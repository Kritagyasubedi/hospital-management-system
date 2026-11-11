import React, { useState } from 'react';
import type { DoctorView, Patient, Doctor } from '../../types';
import {
    DashboardIcon,
    ClinicalIcon,
    PatientsIcon,
    ClipboardListIcon,
    HeartbeatIcon,
    PillIcon,
    FolderIcon,
    FlaskIcon,
    CogIcon,
    DocumentTextIcon,
    TriageIcon,
    ChevronDownIcon,
    AdminIcon,
    CalendarIcon,
    ChatBubbleIcon,
    BellIcon,
    DesktopComputerIcon,
    CreditCardIcon,
    ChartBarIcon,
    UserIcon,
    QuestionMarkCircleIcon,
    BrainIcon
} from '../icons';
import { TriageRiskBadge } from '../TriageRiskBadge';

interface DoctorSidebarProps {
    activeView: DoctorView;
    setActiveView: (view: DoctorView) => void;
    doctors: Doctor[];
    patients: Patient[];
    currentDoctorId: string;
}

const navItems = {
    main: [
        { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
        { id: 'icu_early_warning', label: 'ICU Early Warning (AI)', icon: BrainIcon },
        { id: 'patient_list', label: 'Patient List', icon: PatientsIcon },
        { id: 'patient_reports', label: 'Patient Reports', icon: DocumentTextIcon },
        { id: 'ventilator_monitor', label: 'Vitals Monitoring', icon: HeartbeatIcon },
    ],
    departments: [
        { id: 'cardiology', label: 'Cardiology', icon: DocumentTextIcon },
        { id: 'neurology', label: 'Neurology', icon: DocumentTextIcon },
        { id: 'orthopedics', label: 'Orthopedics', icon: DocumentTextIcon },
        { id: 'general_medicine', label: 'General Medicine', icon: DocumentTextIcon },
        { id: 'pediatrics', label: 'Pediatrics', icon: DocumentTextIcon },
        { id: 'emergency', label: 'Emergency', icon: DocumentTextIcon },
        { id: 'gynecology', label: 'Gynecology', icon: DocumentTextIcon },
    ],
    clinical: [
        { id: 'prescriptions', label: 'Prescriptions', icon: PillIcon },
        { id: 'case_history', label: 'Case History', icon: FolderIcon },
        { id: 'tests_results', label: 'Test & Results', icon: FlaskIcon },
        { id: 'diagnostic_tools', label: 'Diagnostic Tools', icon: CogIcon },
        { id: 'current_status', label: 'Current Status', icon: TriageIcon },
        { id: 'treatment_module', label: 'Treatment Module', icon: ClinicalIcon },
    ],
    support: [
        { id: 'appointments_schedule', label: 'Appointments', icon: CalendarIcon },
        { id: 'messaging', label: 'Messaging', icon: ChatBubbleIcon },
        { id: 'notifications', label: 'Notifications', icon: BellIcon },
        { id: 'inventory_equipment', label: 'Inventory & Equipment', icon: DesktopComputerIcon },
        { id: 'billing_insurance', label: 'Billing Overview', icon: CreditCardIcon },
        { id: 'analytics_reports', label: 'Analytics & Reports', icon: ChartBarIcon },
        { id: 'settings_profile', label: 'Settings & Profile', icon: UserIcon },
        { id: 'help_documentation', label: 'Help / Documentation', icon: QuestionMarkCircleIcon },
    ]
} as const;

type NavItemType = (typeof navItems.main)[number] | (typeof navItems.clinical)[number] | (typeof navItems.departments)[number] | (typeof navItems.support)[number];

const NavItem: React.FC<{
    item: NavItemType;
    isActive: boolean;
    onClick: () => void;
    patientCount?: number;
}> = ({ item, isActive, onClick, patientCount }) => {
    const { icon: Icon, label } = item;
    const baseClasses = "flex items-center w-full text-left px-3.5 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 cursor-pointer";
    const activeClasses = "bg-blue-600 text-white shadow-xs font-semibold";
    const inactiveClasses = "text-slate-300 hover:text-white hover:bg-white/10";

    return (
        <li>
            <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
                <div className="w-5 h-5 mr-3 flex-shrink-0 flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                </div>
                <span className="flex-grow truncate">{label}</span>
                {patientCount !== undefined && patientCount > 0 && (
                    <span className="bg-blue-500/30 text-blue-200 text-xs font-bold px-2 py-0.5 rounded-full ml-2">
                        {patientCount}
                    </span>
                )}
            </button>
        </li>
    );
};

const NavCategory: React.FC<{
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
    startOpen?: boolean;
}> = ({ title, icon: Icon, children, startOpen = false }) => {
    const [isOpen, setIsOpen] = useState(startOpen);

    return (
        <div>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
                <div className="flex items-center">
                    <div className="w-4 h-4 mr-2.5 flex-shrink-0 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-slate-400"/>
                    </div>
                    <span>{title}</span>
                </div>
                <ChevronDownIcon className={`w-4 h-4 transform transition-transform ${isOpen ? '' : '-rotate-90'}`} />
            </button>
            {isOpen && <div className="mt-1 pl-3 border-l border-white/10 ml-4">{children}</div>}
        </div>
    );
};

export const DoctorSidebar: React.FC<DoctorSidebarProps> = ({ activeView, setActiveView, doctors, patients, currentDoctorId }) => {
    const departmentPatientCounts: Record<string, number> = {};
    
    patients.forEach(patient => {
        if (patient.department) {
            departmentPatientCounts[patient.department] = (departmentPatientCounts[patient.department] || 0) + 1;
        }
    });
    
    const myPatientCount = patients.filter(p => p.assignedDoctorId === currentDoctorId).length;
    
    const allDepartments = [
        { id: 'cardiology', label: 'Cardiology', icon: DocumentTextIcon },
        { id: 'neurology', label: 'Neurology', icon: DocumentTextIcon },
        { id: 'orthopedics', label: 'Orthopedics', icon: DocumentTextIcon },
        { id: 'general_medicine', label: 'General Medicine', icon: DocumentTextIcon },
        { id: 'pediatrics', label: 'Pediatrics', icon: DocumentTextIcon },
        { id: 'emergency', label: 'Emergency', icon: DocumentTextIcon },
        { id: 'gynecology', label: 'Gynecology', icon: DocumentTextIcon },
    ];
    
    return (
        <aside className="w-72 bg-[#0B1E33] text-white flex flex-col flex-shrink-0 border-r border-slate-800">
            <div className="h-20 flex flex-col items-center justify-center px-4 border-b border-white/10">
                <h1 className="text-xl font-black tracking-wider text-white">Doctor's Portal</h1>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-blue-300">NeuroNexus Medical</span>
            </div>
            <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-4">
                <ul className="space-y-4">
                    {/* Main Section */}
                    <li>
                         <ul className="space-y-1">
                            {navItems.main.map(item => (
                                <NavItem
                                    key={item.id}
                                    item={item}
                                    isActive={activeView === item.id}
                                    onClick={() => setActiveView(item.id)}
                                    patientCount={item.id === 'patient_list' ? myPatientCount : undefined}
                                />
                            ))}
                        </ul>
                    </li>

                    {/* Departments Section */}
                    <li>
                        <div className="flex items-center justify-between w-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                            <div className="flex items-center">
                                <div className="w-4 h-4 mr-2.5 flex-shrink-0 flex items-center justify-center">
                                    <ClinicalIcon className="w-4 h-4 text-slate-400"/>
                                </div>
                                <span>Departments</span>
                            </div>
                        </div>
                        <div className="mt-1 pl-3 border-l border-white/10 ml-4">
                            <ul className="space-y-1 py-1">
                                {allDepartments.map(dept => (
                                    <NavItem
                                        key={dept.id}
                                        item={{ 
                                            id: dept.id, 
                                            label: dept.label, 
                                            icon: dept.icon 
                                        }}
                                        isActive={activeView === dept.id}
                                        onClick={() => setActiveView(dept.id as DoctorView)}
                                        patientCount={departmentPatientCounts[dept.label] || 0}
                                    />
                                ))}
                            </ul>
                        </div>
                    </li>
                    
                     {/* Clinical Section */}
                    <li>
                        <NavCategory title="Clinical Tools" icon={FolderIcon}>
                            <ul className="space-y-1 py-1">
                                {navItems.clinical.map(item => (
                                    <NavItem
                                        key={item.id}
                                        item={item}
                                        isActive={activeView === item.id}
                                        onClick={() => setActiveView(item.id)}
                                    />
                                ))}
                            </ul>
                        </NavCategory>
                    </li>
                    
                    {/* Support Section */}
                    <li>
                        <NavCategory title="Support & Admin" icon={AdminIcon}>
                            <ul className="space-y-1 py-1">
                                {navItems.support.map(item => (
                                    <NavItem
                                        key={item.id}
                                        item={item}
                                        isActive={activeView === item.id}
                                        onClick={() => setActiveView(item.id)}
                                    />
                                ))}
                            </ul>
                        </NavCategory>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};