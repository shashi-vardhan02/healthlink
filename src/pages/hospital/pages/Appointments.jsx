import React, { useState } from 'react';
import {
    UserPlus,
    Search,
    ClipboardList,
    Clock,
    ArrowRight,
    ChevronRight,
    ArrowUpRight,
    CalendarCheck,
    Activity,
    CheckCircle,
    AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppointments } from '../context/AppointmentContext';

const HistoricalItem = ({ item, idx }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: idx * 0.05 }}
        style={{
            display: 'flex',
            alignItems: 'center',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-glass)',
            marginBottom: '0.75rem'
        }}
    >
        <div style={{ color: 'var(--success)', marginRight: '1rem' }}>
            <CheckCircle size={18} />
        </div>
        <div style={{ flex: 1 }}>
            <h5 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>{item.name}</h5>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.doctor} • Completed at {item.completedAt}</p>
        </div>
        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', background: 'var(--bg-main)', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-glass)' }}>
            {item.token}
        </div>
    </motion.div>
);

const QueueItem = ({ item, idx, onReschedule, onBook, isEmergency }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: idx * 0.1 }}
        whileHover={{ x: 5, background: 'rgba(59, 130, 246, 0.05)' }}
        style={{
            display: 'flex',
            alignItems: 'center',
            padding: '1.25rem 2rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-glass)',
            marginBottom: '1rem',
            background: 'var(--bg-surface)',
            transition: 'var(--transition)'
        }}
    >
        <div style={{
            minWidth: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, var(--brand-dark), var(--brand-primary))',
            color: 'white',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontSize: '1.1rem',
            marginRight: '2rem',
            boxShadow: 'var(--shadow-md)'
        }}>
            {item.token}
        </div>
        <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px', color: 'var(--text-primary)' }}>{item.name}</h4>
            <div style={{ display: 'flex', gap: '15px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <CalendarCheck size={14} /> {item.doctor}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={14} /> {item.time}
                </span>
            </div>
        </div>
        <div style={{ textAlign: 'right', marginRight: '2.5rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Est. Arrival</p>
            <p style={{ fontWeight: '800', color: 'var(--warning)', fontSize: '1.1rem' }}>{item.est}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
            <motion.button
                title="Not now, book later"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onReschedule(item.name)}
                className="btn-ghost"
                style={{ padding: '10px', borderRadius: '10px' }}
            >
                <ArrowUpRight size={20} />
            </motion.button>
            <motion.button
                title="Book Appointment"
                whileHover={!isEmergency ? { scale: 1.05 } : {}}
                whileTap={!isEmergency ? { scale: 0.95 } : {}}
                onClick={() => !isEmergency && onBook(item.name)}
                className="btn-premium"
                disabled={isEmergency}
                style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isEmergency ? 'not-allowed' : 'pointer' }}
            >
                <ArrowRight size={20} />
            </motion.button>
        </div>
    </motion.div>
);

const Appointments = () => {
    const { 
        pendingApprovals: activeQueue, 
        approveAppointment, 
        addPendingAppointment,
        completedHistory: historicalPatients 
    } = useAppointments();

    const [isEmergency, setIsEmergency] = useState(false);
    const [showLogs, setShowLogs] = useState(false);

    const handleReschedule = (patient) => {
        alert(`vArogra Booking: Rescheduling requested for ${patient}. Suggesting alternative time slots...`);
    };

    const handleBooking = (id, patient) => {
        approveAppointment(id);
        alert(`vArogra Confirmation: Appointment for ${patient} successfully booked. Ticket Transmission initialized.`);
    };

    const handleAssignToken = () => {
        if (isEmergency) {
            alert("COMMAND DENIED: Orchestration is currently under PROTOCOL ALPHA lockdown.");
            return;
        }
        const nextId = activeQueue.length > 0 ? Math.max(...activeQueue.map(t => t.id)) + 1 : 1;
        const lastTokenStr = activeQueue.length > 0 ? activeQueue[activeQueue.length - 1].token : 'T-041';
        const lastTokenNum = parseInt(lastTokenStr.split('-')[1]) || 41;
        const newToken = {
            id: nextId,
            token: `T-0${lastTokenNum + 1}`,
            name: 'Generic Patient',
            doctor: 'Dr. Michael Chen',
            time: 'ASAP',
            status: 'Waiting',
            est: '10 min'
        };
        addPendingAppointment(newToken);
        alert(`vArogra PROTOCOL: New token ${newToken.token} dispatched for processing.`);
    };

    const triggerEmergency = () => {
        if (isEmergency) {
            handleDeactivation();
            return;
        }
        setIsEmergency(true);
        alert("PROTOCOL ALPHA ACTIVATED: All regular queues suspended. Trauma team notified.");
    };

    const handleDeactivation = () => {
        setIsEmergency(false);
        alert("PROTOCOL ALPHA TERMINATED: Normal orchestration protocols resumed.");
    };

    return (
        <div style={{ paddingBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1.5px', marginBottom: '0.5rem' }}>Appointment Orchestration</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Managing patient flow and token assignment under hospital protocol.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={triggerEmergency}
                        style={{
                            background: isEmergency ? 'var(--critical)' : 'rgba(239, 68, 68, 0.05)',
                            color: isEmergency ? 'white' : 'var(--critical)',
                            padding: '12px 24px',
                            fontWeight: '800',
                            border: '1px solid var(--critical)',
                            borderRadius: 'var(--radius-lg)',
                            cursor: 'pointer',
                            boxShadow: isEmergency ? 'var(--shadow-lg)' : 'none'
                        }}
                    >
                        {isEmergency ? 'PROTOCOL ALPHA ACTIVE' : 'Emergency Override'}
                    </motion.button>
                    <motion.button
                        whileHover={!isEmergency ? { scale: 1.05 } : {}}
                        whileTap={!isEmergency ? { scale: 0.95 } : {}}
                        onClick={handleAssignToken}
                        className="btn-premium"
                        style={{
                            opacity: isEmergency ? 0.5 : 1,
                            cursor: isEmergency ? 'not-allowed' : 'pointer',
                            filter: isEmergency ? 'grayscale(1)' : 'none'
                        }}
                    >
                        Assign New Token
                    </motion.button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3.5rem' }}>
                {[
                    { label: 'Total Assigned', val: activeQueue.length + (isEmergency ? 0 : 152), icon: <ClipboardList />, color: 'var(--brand-primary)' },
                    { label: 'In Consultation', val: isEmergency ? 'TRAUMA ACTIVE' : '18', icon: <UserPlus />, color: 'var(--brand-teal)' },
                    { label: 'Pending Arrival', val: isEmergency ? '0' : activeQueue.length * 14, icon: <Clock />, color: 'var(--warning)' }
                ].map((s, idx) => (
                    <div key={idx} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'var(--bg-surface)' }}>
                        <div style={{ padding: '12px', borderRadius: 'var(--radius-lg)', background: 'rgba(59, 130, 246, 0.05)', color: s.color }}>
                            {s.icon}
                        </div>
                        <div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</p>
                            <h4 style={{ fontSize: s.val.length > 8 ? '1.1rem' : '1.8rem', fontWeight: '900' }}>{s.val}</h4>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '3rem' }}>
                {/* Main Table */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Approval Pipeline</h3>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <span className="pill" style={{ background: isEmergency ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)', color: isEmergency ? 'var(--critical)' : 'var(--success)' }}>
                                {isEmergency ? 'PROTOCOL ALPHA' : 'SYSTEM SYNCED'}
                            </span>
                        </div>
                    </div>
                    <div>
                        <AnimatePresence>
                            {activeQueue.length > 0 ? (
                                activeQueue.map((item, i) => (
                                    <QueueItem key={item.id} item={item} idx={i} onReschedule={handleReschedule} onBook={() => handleBooking(item.id, item.name)} isEmergency={isEmergency} />
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        padding: '5rem 2rem',
                                        borderRadius: 'var(--radius-xl)',
                                        background: 'var(--bg-surface)',
                                        border: isEmergency ? '2px dashed var(--critical)' : '1px dashed var(--border-glass)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        gap: '2rem'
                                    }}
                                >
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '50%',
                                        background: isEmergency ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                                        color: isEmergency ? 'var(--critical)' : 'var(--brand-primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: isEmergency ? 'var(--shadow-lg)' : 'none'
                                    }}>
                                        {isEmergency ? <AlertTriangle size={40} /> : <ClipboardList size={40} />}
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: isEmergency ? 'var(--critical)' : 'var(--text-primary)', marginBottom: '0.75rem' }}>
                                            {isEmergency ? 'ORCHESTRATION SUSPENDED' : 'Pipeline Clear'}
                                        </h3>
                                        <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', marginBottom: isEmergency ? '2rem' : '0' }}>
                                            {isEmergency ? 'Critical trauma protocol is active. All non-emergency consultations are deferred until deactivation.' : 'The appointment queue is currently empty. Incoming tokens will appear here for command approval.'}
                                        </p>
                                        {isEmergency && (
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={handleDeactivation}
                                                className="btn-danger"
                                                style={{ padding: '12px 32px' }}
                                            >
                                                Resume Normal Protocol
                                            </motion.button>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {!isEmergency && (
                            <div style={{ marginTop: '2.5rem' }}>
                                <motion.button
                                    whileHover={{ background: 'rgba(59, 130, 246, 0.05)' }}
                                    onClick={() => setShowLogs(!showLogs)}
                                    style={{
                                        width: '100%',
                                        padding: '1.5rem',
                                        border: '1px dashed var(--border-glass)',
                                        borderRadius: 'var(--radius-lg)',
                                        background: showLogs ? 'var(--bg-main)' : 'transparent',
                                        color: showLogs ? 'var(--text-primary)' : 'var(--text-muted)',
                                        cursor: 'pointer',
                                        fontWeight: '700',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '12px',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    <ChevronRight size={18} style={{ transform: showLogs ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
                                    {showLogs ? 'Dismiss Historical Logs' : 'View Audit Logs • Completed'}
                                </motion.button>

                                <AnimatePresence>
                                    {showLogs && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            style={{ overflow: 'hidden', marginTop: '1.5rem' }}
                                        >
                                            <div style={{ padding: '0 0.5rem' }}>
                                                <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                    Session Audit • {new Date().toLocaleDateString()}
                                                </h4>
                                                {historicalPatients.map((p, i) => (
                                                    <HistoricalItem key={p.id} item={p} idx={i} />
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="card" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.05)', color: 'var(--brand-primary)' }}>
                                <Activity size={20} />
                            </div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Operational Load</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {[
                                { name: 'Surgical OPD', val: 85, color: 'var(--critical)' },
                                { name: 'Emergency Trauma', val: 30, color: 'var(--success)' },
                                { name: 'Pediatric Ward', val: 65, color: 'var(--warning)' }
                            ].map((load, i) => (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '10px' }}>
                                        <span style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>{load.name}</span>
                                        <span style={{ color: load.color, fontWeight: '900' }}>{load.val}%</span>
                                    </div>
                                    <div style={{ height: '8px', background: 'var(--bg-main)', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${load.val}%` }}
                                            transition={{ duration: 1, delay: i * 0.1 }}
                                            style={{ height: '100%', background: load.color, borderRadius: '4px' }} 
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card" style={{ padding: '2.5rem', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), transparent)', border: '1px solid var(--border-glass)' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '900', marginBottom: '1rem', color: 'var(--text-primary)' }}>System Note</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                            Operational protocols are strictly enforced. All token dispatch and approval events are logged to the central medical ledger.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Appointments;
