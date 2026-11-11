import React from 'react';
import type { View } from '../../types';
import {
    BedIcon,
    ClipboardListIcon,
    UserAddIcon,
    SearchIcon,
    ChartBarIcon,
    SettingsIcon
} from '../icons';

type NurseView = 'inpatients' | 'admissions' | 'discharges' | 'reports' | 'settings';

interface NurseSidebarProps {
    activeView: NurseView;
    setActiveView: (view: NurseView) => void;
}

const navItems = [
    { id: 'inpatients', label: 'Inpatient Management', icon: BedIcon },
    { id: 'admissions', label: 'Admission Queue', icon: UserAddIcon },
    { id: 'discharges', label: 'Discharge Planning', icon: ClipboardListIcon },
    { id: 'reports', label: 'Reports & Analytics', icon: ChartBarIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
] as const;

const NavItem: React.FC<{
    item: typeof navItems[number];
    isActive: boolean;
    onClick: () => void;
}> = ({ item, isActive, onClick }) => {
    const { icon: Icon, label } = item;
    const baseClasses = "flex items-center w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200";
    const activeClasses = "bg-srm-lightblue text-srm-blue";
    const inactiveClasses = "text-white hover:bg-white/20";
    
    return (
        <li>
            <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
                <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                <span className="flex-grow">{label}</span>
            </button>
        </li>
    );
};

export const NurseSidebar: React.FC<NurseSidebarProps> = ({ activeView, setActiveView }) => {
    return (
        <aside className="w-72 bg-srm-blue text-white flex flex-col flex-shrink-0">
            <div className="h-20 flex items-center justify-center px-4 border-b border-white/20">
                <h1 className="text-xl font-bold tracking-wider">Nurse Head Portal</h1>
            </div>
            <nav className="flex-1 px-3 py-4">
                <ul className="space-y-2">
                    {navItems.map(item => (
                        <NavItem
                            key={item.id}
                            item={item}
                            isActive={activeView === item.id}
                            onClick={() => setActiveView(item.id)}
                        />
                    ))}
                </ul>
            </nav>
        </aside>
    );
};