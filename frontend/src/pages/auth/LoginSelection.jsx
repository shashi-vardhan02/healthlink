import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Hospital, Stethoscope, Store, Lock, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginSelection = () => {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState('patient');

    const handleLogin = () => {
        if (selectedRole === 'patient') navigate('/login/patient');
    };

    return (
        <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-main relative overflow-hidden font-sans">

            {/* A. Header Section */}
            <div className="w-full h-[180px] bg-gradient-to-r from-[#0052D4] to-[#20BD9D] flex flex-col items-center justify-center relative z-0">
                <div className="flex items-center justify-center gap-3 mb-2">
                    <img src="/logo.jpg" alt="vArogra Logo" className="h-12 w-auto" />
                    <h1 className="text-[30px] font-bold text-white tracking-tight leading-none">
                        vArogra
                    </h1>
                </div>
                <p className="text-white/90 text-[14px] font-medium tracking-wide">
                    Your unified digital healthcare platform
                </p>
            </div>

            {/* B. Main Container */}
            <div className="w-full px-5 flex flex-col items-center -mt-2">

                {/* C. Section Label */}
                <h2 className="text-[12px] font-bold text-[#888888] uppercase tracking-[1px] mt-6 mb-4 text-center">
                    SELECT YOUR ROLE
                </h2>

                {/* D. Role Selection Cards (Row) */}
                <div className="flex justify-center w-full">

                    {/* Card 1: Patient */}
                    <button
                        onClick={() => setSelectedRole('patient')}
                        className={`w-full max-w-[320px] rounded-[16px] py-8 px-4 flex flex-col items-center text-center relative transition-all duration-300 ${selectedRole === 'patient'
                            ? 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-[#2D8EFF] transform scale-[1.02]'
                            : 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-transparent hover:transform hover:scale-[1.02]'
                            }`}
                    >
                        {/* Icon */}
                        <div className="w-[60px] h-[60px] rounded-full bg-[#2D8EFF] flex items-center justify-center mb-4 shadow-md">
                            <User size={30} className="text-white" fill="currentColor" />
                        </div>

                        {/* Title */}
                        <h3 className="text-[20px] font-bold text-[#1A2B3C] mb-2">Patient</h3>

                        {/* Description */}
                        <p className="text-[14px] text-[#6B7280] font-normal leading-tight mb-6 px-1">
                            Access your medical records, book appointments, and chat with vArogra AI.
                        </p>

                        {/* Badge */}
                        <span className="px-4 py-1.5 bg-[#E3F2FD] text-[#1565C0] text-[12px] font-bold rounded-full">
                            Patient Login
                        </span>
                    </button>

                </div>

                {/* E. Login Button */}
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogin}
                    className="w-full max-w-[320px] h-[54px] rounded-[27px] bg-gradient-to-r from-[#0061FF] to-[#00C896] text-white text-[18px] font-bold shadow-[0_4px_10px_rgba(32,189,157,0.3)] mt-[30px] mb-[30px] flex items-center justify-center border-none cursor-pointer"
                >
                    Continue
                </motion.button>

                {/* F. Staff Section */}
                <div className="w-full flex items-center gap-3 mb-4">
                    <div className="h-[1px] bg-[#E5E7EB] flex-1" />
                    <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-wide">FOR HEALTHCARE STAFF</span>
                    <div className="h-[1px] bg-[#E5E7EB] flex-1" />
                </div>

                <div className="flex gap-[15px] w-full mb-8">
                    {/* Doctor Login Button */}
                    <button
                        onClick={() => navigate('/login/doctor')}
                        className="flex-1 p-[12px] rounded-[12px] bg-transparent border border-[#2D8EFF] text-[#0d4e5c] font-semibold text-[13px] flex items-center justify-center gap-2 active:bg-blue-50 transition-colors"
                    >
                        <Stethoscope size={18} className="text-[#2D8EFF]" />
                        Doctor Login
                    </button>

                    {/* Medical Store Button */}
                    <button
                        onClick={() => navigate('/login/medical-store')}
                        className="flex-1 p-[12px] rounded-[12px] bg-transparent border border-[#00C896] text-[#0d4e5c] font-semibold text-[13px] flex items-center justify-center gap-2 active:bg-teal-50 transition-colors"
                    >
                        <Store size={18} className="text-[#00C896]" />
                        Medical Store
                    </button>
                </div>

                {/* G. Footer */}
                <div className="mt-auto pb-8 flex items-center gap-2 text-[#6B7280] opacity-80">
                    <Lock size={12} />
                    <span className="text-[11px] font-normal">Secured with end-to-end encryption</span>
                </div>

            </div>
        </div>
    );
};

export default LoginSelection;
