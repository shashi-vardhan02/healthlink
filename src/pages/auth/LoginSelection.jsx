import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Hospital, Stethoscope, Store, Settings, Activity, ShieldCheck, HeartPulse } from 'lucide-react';
import { motion } from 'framer-motion';

const PortalCard = ({ icon: Icon, title, description, role, onSelect, index, isLarge }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -5, shadow: "0 15px 30px -10px rgba(0,0,0,0.08)" }}
            onClick={() => onSelect(role)}
            className={`group relative bg-white rounded-[28px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] transition-all duration-500 cursor-pointer overflow-hidden ${isLarge ? 'p-8 sm:p-10 flex-row items-center gap-8' : 'p-6 sm:p-8 flex-col items-center text-center'
                } flex`}
        >
            {/* Soft Icon Backdrop */}
            <div className={`shrink-0 flex items-center justify-center rounded-full bg-[#E6F8F3] text-[#10B981] ${isLarge ? 'w-20 h-20 sm:w-24 sm:h-24' : 'w-16 h-16 sm:w-20 sm:h-20 mb-6'
                }`}>
                <Icon size={isLarge ? 40 : 32} strokeWidth={1.5} />
            </div>

            <div className={isLarge ? 'flex-1' : ''}>
                <h3 className={`font-bold text-slate-800 tracking-tight ${isLarge ? 'text-2xl sm:text-3xl mb-1' : 'text-xl mb-2'}`}>
                    {title}
                </h3>
                <p className={`text-slate-500 font-medium ${isLarge ? 'text-base sm:text-lg' : 'text-sm'}`}>
                    {description}
                </p>
            </div>

            {/* Subtle Gradient Corner */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#E6F8F3]/40 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
        </motion.div>
    );
};

const LoginSelection = () => {
    const navigate = useNavigate();

    const handleSelect = (role) => {
        const routes = {
            'patient': '/login/patient',
            'doctor': '/login/doctor',
            'hospital': '/login/hospital',
            'pharmacy': '/login/medical-store'
        };
        navigate(routes[role]);
    };

    return (
        <div className="min-h-screen w-full bg-white flex flex-col font-sans selection:bg-emerald-100 relative overflow-hidden">
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{ backgroundImage: `radial-gradient(#10B981 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

            {/* Top Navigation */}
            <nav className="w-full h-20 px-6 sm:px-12 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#10B981] rounded-full flex items-center justify-center shadow-lg shadow-emerald-100">
                        <span className="text-white font-black text-xl">V</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-800 tracking-tighter">vArogra</span>
                </div>
                <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <Settings size={22} />
                </button>
            </nav>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-12 pt-6 pb-12 flex flex-col items-center">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-3xl sm:text-6xl font-black text-slate-900 mb-4 tracking-tight">
                        Choose Your <span className="text-[#10B981]">Portal</span>
                    </h1>
                    <p className="text-base sm:text-xl text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
                        Select the interface that best describes your role.
                    </p>
                </motion.div>

                {/* Portal Cards */}
                <div className="w-full max-w-4xl space-y-4">
                    {/* Patient (Large) */}
                    <PortalCard
                        index={0}
                        id="patient"
                        title="Patient"
                        description="Personal health records"
                        icon={HeartPulse}
                        role="patient"
                        onSelect={handleSelect}
                        isLarge={true}
                    />

                    {/* Others Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <PortalCard
                            index={1}
                            id="doctor"
                            title="Doctor"
                            description="Clinical tools"
                            icon={Stethoscope}
                            role="doctor"
                            onSelect={handleSelect}
                        />
                        <PortalCard
                            index={2}
                            id="hospital"
                            title="Hospital"
                            description="Administration"
                            icon={Hospital}
                            role="hospital"
                            onSelect={handleSelect}
                        />
                        <PortalCard
                            index={3}
                            id="pharmacy"
                            title="Pharmacy"
                            description="Inventory"
                            icon={Store}
                            role="pharmacy"
                            onSelect={handleSelect}
                        />
                    </div>
                </div>

                {/* Footer Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-12 text-center space-y-3"
                >
                    <div className="text-[11px] font-bold text-slate-400 tracking-[0.1em] uppercase">
                        Secured by vArogra
                    </div>
                    <div className="flex items-center justify-center gap-2 text-[#10B981] font-semibold text-xs">
                        <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-pulse" />
                        System Operational
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default LoginSelection;
