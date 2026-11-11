import React from 'react';
import { HomeIcon, CalendarPlusIcon, HeartbeatIcon, ClipboardListIcon, ShareIcon, ChatBubbleIcon } from '../icons';

type PatientView = 'dashboard' | 'book-appointment' | 'vitals' | 'prescriptions' | 'referrals' | 'ai-advisor';

interface PatientSidebarProps {
  activeView: PatientView;
  setActiveView: (view: PatientView) => void;
}

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { id: 'book-appointment', label: 'Book Appointment', icon: CalendarPlusIcon },
    { id: 'vitals', label: 'Vitals Monitoring', icon: HeartbeatIcon },
    { id: 'prescriptions', label: 'Prescriptions', icon: ClipboardListIcon },
    { id: 'referrals', label: 'Referrals', icon: ShareIcon },
    { id: 'ai-advisor', label: 'AI Health Advisor', icon: ChatBubbleIcon },
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


export const PatientSidebar: React.FC<PatientSidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <aside className="w-64 bg-srm-blue text-white flex flex-col flex-shrink-0">
      <div className="h-[92px] flex items-center justify-center px-4 border-b border-white/20 bg-srm-blue">
        <h1 className="text-lg font-bold tracking-wider text-center">Patient Portal</h1>
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