
import React from 'react';
import type { ReceptionistView } from '../../types';
import {
    ClipboardListIcon,
    UserAddIcon,
    HeartbeatIcon,
    UserCircleIcon,
    PillIcon,
    SearchIcon,
    DesktopComputerIcon,
} from '../icons';

interface ReceptionistSidebarProps {
    activeView: ReceptionistView;
    setActiveView: (view: ReceptionistView) => void;
}

const navItems = [
    { id: 'appointments', label: 'Appointments Received', icon: ClipboardListIcon },
    { id: 'walkin', label: 'Walk-in Registration', icon: UserAddIcon },
    { id: 'assessment', label: 'Patient Assessment', icon: HeartbeatIcon },
    { id: 'history', label: 'Medical History', icon: SearchIcon },
    { id: 'activity_log', label: 'Patient Activity Log', icon: DesktopComputerIcon },
] as const;


const NavItem: React.FC<{
    item: typeof navItems[number];
    isActive: boolean;
    onClick: () => void;
}> = ({ item, isActive, onClick }) => {
    const { icon: Icon, label } = item;
    const baseClasses = "flex items-center w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200";
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


export const ReceptionistSidebar: React.FC<ReceptionistSidebarProps> = ({ activeView, setActiveView }) => {
    return (
        <aside className="w-72 bg-srm-blue text-white flex flex-col flex-shrink-0">
            <div className="h-20 flex items-center justify-center px-4 border-b border-white/20">
                <h1 className="text-xl font-bold tracking-wider">Reception Portal</h1>
            </div>
            <nav className="flex-1 px-2 py-4 overflow-y-auto">
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
