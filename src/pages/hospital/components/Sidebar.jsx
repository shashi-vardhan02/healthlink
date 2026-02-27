import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    CalendarClock,
    MonitorPlay,
    Droplets,
    FileBarChart,
    FileText,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Search,
    LayoutGrid,
    Bed
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
    const { logout, role } = useAuth();

    const navItems = [
        { title: 'Dashboard', icon: <LayoutDashboard size={22} />, path: '/hospital' },
        { title: 'Availability', icon: <Users size={22} />, path: '/hospital/availability' },
        { title: 'Appointments', icon: <CalendarClock size={22} />, path: '/hospital/appointments' },
        { title: 'Consultations', icon: <MonitorPlay size={22} />, path: '/hospital/live' },
        { title: 'Blood Bank', icon: <Droplets size={22} />, path: '/hospital/blood-bank' },
        { title: 'Analytics', icon: <FileBarChart size={22} />, path: '/hospital/reports' },
        { title: 'Patient Records', icon: <FileText size={22} />, path: '/hospital/records' },
        { title: 'Bed Management', icon: <Bed size={22} />, path: '/hospital/beds' },
    ];

    return (
        <motion.aside
            animate={{ width: isCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="glass"
            style={{
                height: '100vh',
                position: 'fixed',
                display: 'flex',
                flexDirection: 'column',
                padding: '1.5rem 1.25rem',
                zIndex: 1000,
                background: 'var(--bg-sidebar)',
                borderRight: '1px solid var(--border-glass)',
                boxShadow: 'var(--shadow-lg)'
            }}
        >
            {/* Logo Section */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '0.5rem',
                marginBottom: '2.5rem',
                overflow: 'hidden'
            }}>
                <div style={{
                    minWidth: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-teal))',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 15px var(--primary-glow)'
                }}>
                    <Droplets color="white" size={24} />
                </div>
                {!isCollapsed && (
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.5px', color: 'white' }}
                    >
                        vArogra
                    </motion.span>
                )}
            </div>

            {/* Navigation Section */}
            <nav style={{ flex: 1 }}>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                style={({ isActive }) => ({
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    padding: '12px 16px',
                                    borderRadius: 'var(--radius-lg)',
                                    color: isActive ? 'white' : 'var(--text-muted)',
                                    background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                    border: isActive ? '1px solid var(--brand-primary)' : '1px solid transparent',
                                    textDecoration: 'none',
                                    transition: 'var(--transition)',
                                    position: 'relative'
                                })}
                            >
                                {({ isActive }) => (
                                    <>
                                        <div style={{ color: isActive ? 'var(--brand-primary)' : 'inherit' }}>
                                            {item.icon}
                                        </div>
                                        {!isCollapsed && (
                                            <motion.span
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                style={{ fontWeight: isActive ? '600' : '400', fontSize: '0.95rem' }}
                                            >
                                                {item.title}
                                            </motion.span>
                                        )}
                                        {isActive && !isCollapsed && (
                                            <motion.div
                                                layoutId="activeGlow"
                                                style={{
                                                    position: 'absolute',
                                                    right: '12px',
                                                    width: '6px',
                                                    height: '6px',
                                                    background: 'var(--brand-primary)',
                                                    borderRadius: '50%',
                                                    boxShadow: '0 0 10px var(--brand-primary)'
                                                }}
                                            />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Footer Section */}
            <div style={{
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-glass)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '12px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        minWidth: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-lg)',
                        background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-dark))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                    }}>
                        {role?.[0] || 'A'}
                    </div>
                    {!isCollapsed && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <p style={{ fontSize: '0.85rem', fontWeight: '700', color: 'white' }}>Hospital Admin</p>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{role || 'Superuser'}</p>
                        </motion.div>
                    )}
                </div>

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    style={{
                        padding: '10px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--border-glass)',
                        borderRadius: '10px',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>

                <button
                    onClick={logout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--critical)',
                        cursor: 'pointer',
                        width: '100%',
                        textAlign: 'left',
                        fontWeight: '600'
                    }}
                >
                    <LogOut size={20} />
                    {!isCollapsed && <span>Sign Out</span>}
                </button>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
