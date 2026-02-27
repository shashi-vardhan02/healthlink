import React from 'react';
import { 
    LayoutDashboard, Users, Calendar, FileText, 
    History, Activity, Settings, ChevronRight
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const DoctorSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard/doctor' },
        { id: 'patients', label: 'Patients', icon: <Users size={20} />, path: '#' },
        { id: 'appointments', label: 'Appointments', icon: <Calendar size={20} />, path: '#' },
        { id: 'prescriptions', label: 'Notepad / Prescriptions', icon: <FileText size={20} />, path: '#' },
        { id: 'history', label: 'Prescription History', icon: <History size={20} />, path: '#' },
        { id: 'adherence', label: 'Medication Adherence', icon: <Activity size={20} />, path: '#' },
        { id: 'settings', label: 'Settings', icon: <Settings size={20} />, path: '#' },
    ];

    return (
        <aside className="w-64 h-screen bg-[#F8FAFC] border-r border-[#E2E8F0] fixed left-0 top-0 pt-20 px-4 z-30">
            <nav className="space-y-1">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path || (item.id === 'dashboard' && location.pathname === '/dashboard/doctor');
                    return (
                        <button
                            key={item.id}
                            onClick={() => item.path !== '#' && navigate(item.path)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                                isActive 
                                ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-500/20' 
                                : 'text-[#64748B] hover:bg-white hover:text-[#2563EB] hover:shadow-sm'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className={`${isActive ? 'text-white' : 'text-[#94A3B8] group-hover:text-[#2563EB]'}`}>
                                    {item.icon}
                                </span>
                                <span className="text-sm font-semibold tracking-tight">{item.label}</span>
                            </div>
                            {isActive && <ChevronRight size={14} className="opacity-70" />}
                        </button>
                    );
                })}
            </nav>

            <div className="absolute bottom-8 left-4 right-4 p-4 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#1E40AF] text-white shadow-xl">
                <p className="text-[11px] font-bold uppercase tracking-wider opacity-80 mb-1">Help Center</p>
                <p className="text-xs font-medium mb-3">Need clinical support?</p>
                <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-colors">
                    Contact Admin
                </button>
            </div>
        </aside>
    );
};

export default DoctorSidebar;
