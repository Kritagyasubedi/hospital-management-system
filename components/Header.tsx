import React from 'react';

interface HeaderProps {
    title: string;
    userRole: string;
    onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, userRole, onLogout }) => {
    return (
        <header className="h-20 bg-white border-b border-slate-200/80 shadow-2xs flex-shrink-0 flex items-center justify-between px-8">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight truncate pr-4">{title}</h2>
            <div className="flex items-center space-x-4 flex-shrink-0">
                <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Search..." 
                      className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-full text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition" 
                    />
                    <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="text-right">
                        <p className="font-semibold text-sm text-slate-800">{userRole}</p>
                        <p className="text-xs text-emerald-600 font-medium flex items-center justify-end gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Online
                        </p>
                    </div>
                    <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden border border-slate-200 shadow-2xs">
                        <img src="https://i.pravatar.cc/100" alt="User Avatar" className="w-full h-full object-cover rounded-full" />
                    </div>
                     <button onClick={onLogout} className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer" title="Logout">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    </button>
                </div>
            </div>
        </header>
    );
}
