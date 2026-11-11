import React, { useState } from 'react';
import type { View, NavItemType } from '../types';
import { navStructure } from '../navigation';
import { ChevronDownIcon } from './icons';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const NavItem: React.FC<{
  item: NavItemType;
  isActive: boolean;
  onClick: () => void;
}> = ({ item, isActive, onClick }) => {
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
      </button>
    </li>
  );
};

const NavCategory: React.FC<{
    category: string;
    icon: React.ElementType;
    children: React.ReactNode;
}> = ({ category, icon: Icon, children }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
                <div className="flex items-center">
                    <div className="w-4 h-4 mr-2.5 flex-shrink-0 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-slate-400"/>
                    </div>
                    <span>{category}</span>
                </div>
                <ChevronDownIcon className={`h-4 w-4 transform transition-transform ${isOpen ? '' : '-rotate-90'}`} />
            </button>
            {isOpen && <div className="mt-1 pl-3 border-l border-white/10 ml-5">{children}</div>}
        </div>
    );
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <aside className="w-72 bg-[#0B1E33] text-white flex flex-col flex-shrink-0 border-r border-slate-800">
      <div className="h-20 flex flex-col items-center justify-center px-4 border-b border-white/10">
        <h1 className="text-xl font-black tracking-wider text-white">NEURONEXUS</h1>
        <span className="text-[10px] tracking-widest uppercase font-semibold text-blue-300">Clinical Intelligence</span>
      </div>
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-4">
        <ul className="space-y-4">
            {navStructure.map(({category, icon, items}) => (
                <li key={category}>
                    <NavCategory category={category} icon={icon}>
                        <ul className="space-y-1 py-1">
                           {items.map(item => (
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
            ))}
        </ul>
      </nav>
    </aside>
  );
};
