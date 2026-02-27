import React from 'react';
import { motion } from 'framer-motion';
import { Droplets } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HospitalLogin = ({ isEmbedded = false }) => {
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Mock login for now, setting a flag in localStorage if needed for hospital role
        localStorage.setItem('userRole', 'hospital');
        navigate('/hospital');
    };

    return (
        <div style={{
            height: isEmbedded ? 'auto' : '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isEmbedded ? 'transparent' : '#0F172A', // Using colors directly to maintain "same same same"
            color: 'white',
            position: 'relative',
            padding: isEmbedded ? '20px 0' : '0',
            overflow: 'hidden',
            fontFamily: 'Inter, sans-serif'
        }}>
            {/* Decorative Background Glows */}
            {!isEmbedded && (
                <>
                    <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, #3B82F6 0%, transparent 70%)', opacity: 0.1, zIndex: 0 }} />
                    <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, #14B8A6 0%, transparent 70%)', opacity: 0.1, zIndex: 0 }} />
                </>
            )}

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    maxWidth: '480px',
                    width: '100%',
                    padding: isEmbedded ? '2rem 1.5rem' : '4rem 3rem',
                    position: 'relative',
                    zIndex: 1,
                    textAlign: 'center',
                    borderRadius: '16px',
                    background: '#1E293B',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
            >
                <div style={{
                    width: '64px',
                    height: '64px',
                    background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
                    borderRadius: '12px',
                    margin: '0 auto 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                }}>
                    <Droplets color="white" size={32} />
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-1px' }}>vArogra</h1>
                <p style={{ color: '#94A3B8', marginBottom: '3rem', fontSize: '1rem' }}>Enter your credentials to access the command center.</p>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <input
                        type="email"
                        placeholder="Authorized Email"
                        style={{
                            width: '100%',
                            padding: '16px 20px',
                            borderRadius: '12px',
                            color: '#F8FAFC',
                            outline: 'none',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            fontSize: '1rem',
                            background: '#0F172A'
                        }}
                        defaultValue="admin@varogra.com"
                    />
                    <input
                        type="password"
                        placeholder="Secure Protocol Key"
                        style={{
                            width: '100%',
                            padding: '16px 20px',
                            borderRadius: '12px',
                            color: '#F8FAFC',
                            outline: 'none',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            fontSize: '1rem',
                            background: '#0F172A'
                        }}
                        defaultValue="password"
                    />
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        style={{
                            padding: '16px',
                            fontSize: '1rem',
                            marginTop: '1rem',
                            background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        Establish Secure Link
                    </motion.button>
                </form>

                <p style={{ marginTop: '3rem', fontSize: '0.75rem', color: '#64748B', letterSpacing: '0.5px' }}>
                    © 2026 VAROGRA QUANTUM HEALTHCARE • ENCRYPTED SESSION
                </p>
            </motion.div>
        </div>
    );
};

export default HospitalLogin;
