import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import {
    Package, Truck, CheckCircle, Clock,
    ArrowLeft, LogOut, DollarSign, ShoppingBag,
    TrendingUp, User, MapPin, Star, Settings, Image as ImageIcon,
    Plus, Search, Receipt, Users, Trash2, Edit, Save, ScanLine, Printer, Eye, Boxes, HeartPulse, Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';

const billInputStyle = { width: '100%', padding: '16px 20px', borderRadius: '14px', border: '1px solid #334155', backgroundColor: '#1e293b', color: 'white', outline: 'none', fontSize: '15px', transition: 'all 0.3s' };

// --- Premium Design System Tokens ---
const premiumCard = {
    backgroundColor: 'white',
    borderRadius: '24px',
    padding: '24px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
};

const inputStyle = { padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#f8fafc', fontSize: '14px', color: '#0f172a', transition: 'all 0.2s' };
const thStyle = { padding: '16px 24px', fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9' };
const tdStyle = { padding: '20px 24px', fontSize: '14px', color: '#334155', borderBottom: '1px solid #f8fafc' };
const iconBtnStyle = { padding: '8px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', color: '#64748b', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' };

// --- Helper Components ---
const StatCard = ({ icon, title, value, variant = 'info' }) => {
    const colors = {
        info: { bg: '#eff6ff', color: '#3b82f6' },
        success: { bg: '#f0fdf4', color: '#10b981' },
        warning: { bg: '#fffbeb', color: '#f59e0b' },
        danger: { bg: '#fef2f2', color: '#ef4444' }
    };
    const c = colors[variant] || colors.info;
    return (
        <div style={{ ...premiumCard, padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ padding: '12px', backgroundColor: c.bg, color: c.color, borderRadius: '16px' }}>
                {icon}
            </div>
            <div>
                <p style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</p>
                <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>{value}</h3>
            </div>
        </div>
    );
};

const SidebarLink = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = '#f8fafc'; }}
        onMouseLeave={(e) => { if (!active) e.currentTarget.style.backgroundColor = 'transparent'; }}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '14px',
            border: 'none',
            backgroundColor: active ? '#10b981' : 'transparent',
            color: active ? 'white' : '#64748b',
            fontWeight: active ? '700' : '600',
            fontSize: '14px',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease',
            width: '100%'
        }}
    >
        <span style={{ display: 'flex', opacity: active ? 1 : 0.7 }}>{icon}</span>
        {label}
    </button>
);

const AnimatedNumber = ({ value, prefix = '', suffix = '' }) => {
    const [displayValue, setDisplayValue] = useState(0);
    useEffect(() => {
        let start = 0;
        const duration = 1000;
        const stepTime = Math.abs(Math.floor(duration / (value || 1)));
        const timer = setInterval(() => {
            start += Math.ceil(value / 60);
            if (start >= value) {
                setDisplayValue(value);
                clearInterval(timer);
            } else {
                setDisplayValue(start);
            }
        }, 16);
        return () => clearInterval(timer);
    }, [value]);
    return <span>{prefix}{displayValue.toLocaleString()}{suffix}</span>;
};

const KPIBlock = ({ icon, title, value, prefix, suffix, growth, color = '#10b981' }) => (
    <motion.div
        whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
        style={{ ...premiumCard, flex: 1, padding: '24px', position: 'relative', overflow: 'hidden' }}
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>{title}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
            <h3 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a' }}>
                <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
            </h3>
            {growth && (
                <motion.span
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                    style={{ fontSize: '12px', fontWeight: '800', color: growth === 'Danger' ? '#ef4444' : '#10b981', backgroundColor: growth === 'Danger' ? '#fef2f2' : '#f0fdf4', padding: '4px 8px', borderRadius: '6px', marginBottom: '6px' }}
                >
                    {growth}
                </motion.span>
            )}
        </div>
    </motion.div>
);

const AlertItem = ({ title, meta, level }) => (
    <motion.div
        animate={level === 'critical' ? { opacity: [1, 0.7, 1] } : {}}
        transition={level === 'critical' ? { duration: 2, repeat: Infinity } : {}}
        style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)' }}
    >
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: level === 'critical' ? '#ef4444' : '#f59e0b' }} />
        <div style={{ flex: 1 }}>
            <p style={{ fontSize: '14px', fontWeight: '700' }}>{title}</p>
            <p style={{ fontSize: '12px', opacity: 0.6 }}>{meta}</p>
        </div>
    </motion.div>
);

const TimelineItem = ({ title, time, desc }) => (
    <div style={{ display: 'flex', gap: '16px', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#10b981', border: '4px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
        <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                <h5 style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>{title}</h5>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>{time}</span>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b' }}>{desc}</p>
        </div>
    </div>
);

const StatusBadge = ({ status }) => {
    const styles = {
        'Confirmed': { bg: '#eff6ff', color: '#2563eb' },
        'Preparing': { bg: '#fffbeb', color: '#d97706' },
        'Out for delivery': { bg: '#f3f4f6', color: '#4b5563' },
        'Delivered': { bg: '#f0fdf4', color: '#16a34a' }
    };
    const s = styles[status] || styles['Confirmed'];
    return (
        <span style={{
            padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '800',
            backgroundColor: s.bg, color: s.color, textTransform: 'uppercase'
        }}>
            {status}
        </span>
    );
};

const TableRow = ({ children }) => (
    <motion.tr
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{ borderBottom: '1px solid #f9fafb', cursor: 'pointer' }}
        onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f1f5f9';
            e.currentTarget.firstChild.style.borderLeft = '2px solid #10b981';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.firstChild.style.borderLeft = '2px solid transparent';
        }}
    >
        {children}
    </motion.tr>
);

const RevenueChart = ({ data = [40, 60, 45, 90, 65, 80, 50], labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], color = '#10b981' }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const max = Math.max(...data, 100);
    const height = 180; // Compact height
    const width = 500;
    const padding = 30;

    // Generate path points
    const points = data.map((val, i) => {
        const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
        const y = height - 40 - (val / max) * (height - 70); // Tighter vertical spread
        return { x, y, value: val, label: labels[i] };
    });

    // Create a smooth SVG path
    const pathData = points.reduce((acc, p, i, a) => {
        if (i === 0) return `M ${p.x} ${p.y}`;
        const prev = a[i - 1];
        const cx = (prev.x + p.x) / 2;
        return `${acc} C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
    }, '');

    const areaData = `${pathData} V ${height - 35} H ${padding} Z`;

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
            <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
                <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Horizontal Grid Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
                    <line
                        key={i}
                        x1={padding}
                        y1={padding + p * (height - 70)}
                        x2={width - padding}
                        y2={padding + p * (height - 70)}
                        stroke="#f1f5f9"
                        strokeWidth="1"
                    />
                ))}

                {/* Vertical Data Indicators */}
                {points.map((p, i) => (
                    <line
                        key={i}
                        x1={p.x}
                        y1={padding}
                        x2={p.x}
                        y2={height - 40}
                        stroke={hoveredIndex === i ? color : "#f8fafc"}
                        strokeWidth={hoveredIndex === i ? 2 : 1}
                        strokeDasharray={hoveredIndex === i ? "0" : "4 4"}
                        style={{ transition: 'all 0.3s ease' }}
                    />
                ))}

                <motion.path
                    d={areaData}
                    fill="url(#chartGrad)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                />

                <motion.path
                    d={pathData}
                    fill="none"
                    stroke={color}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />

                {points.map((p, i) => (
                    <motion.g
                        key={i}
                        style={{ cursor: 'pointer' }}
                        onPointerEnter={() => setHoveredIndex(i)}
                        onPointerLeave={() => setHoveredIndex(null)}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                    >
                        <motion.circle
                            cx={p.x}
                            cy={p.y}
                            r={hoveredIndex === i ? 8 : 6}
                            fill="white"
                            stroke={color}
                            strokeWidth="3"
                            animate={{ r: hoveredIndex === i ? 8 : 6, strokeWidth: hoveredIndex === i ? 4 : 3 }}
                        />
                        <text x={p.x} y={height - 12} textAnchor="middle" fontSize="11" fontWeight="700" fill={hoveredIndex === i ? color : "#94a3b8"} style={{ transition: 'fill 0.3s ease' }}>{p.label}</text>
                    </motion.g>
                ))}
            </svg>

            {/* Tooltip */}
            <AnimatePresence>
                {hoveredIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        style={{
                            position: 'absolute',
                            left: `${(points[hoveredIndex].x / width) * 100}%`,
                            top: `${(points[hoveredIndex].y / height) * 100}%`,
                            transform: 'translate(-50%, -120%)',
                            backgroundColor: '#0f172a',
                            color: 'white',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
                            zIndex: 100,
                            pointerEvents: 'none',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        <div style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>{points[hoveredIndex].label}</div>
                        <div style={{ fontSize: '18px', fontWeight: '800' }}>₹{points[hoveredIndex].value.toLocaleString()}</div>
                        <div style={{ position: 'absolute', bottom: '-6px', left: '50%', transform: 'translateX(-50%) rotate(45deg)', width: '12px', height: '12px', backgroundColor: '#0f172a' }} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const MedicalStoreDashboard = () => {
    const { user, loading, orders, updateOrderStatus, updateProfile, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [chartFilter, setChartFilter] = useState('W');
    const [filter, setFilter] = useState('all');
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
    const [checkoutSuccess, setCheckoutSuccess] = useState(false);
    const [availableItems, setAvailableItems] = useState({});
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const getChartData = () => {
        switch (chartFilter) {
            case 'D':
                return {
                    data: [12000, 18000, 15000, 24000, 21000, 32000, 28000, 42000],
                    labels: ['8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM']
                };
            case 'M':
                return {
                    data: [420000, 380000, 510000, 480000, 590000, 620000],
                    labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb']
                };
            case 'W':
            default:
                return {
                    data: [42000, 58000, 45000, 72000, 61000, 89000, 74000],
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                };
        }
    };

    const currentData = getChartData();

    // --- Mock Data from MediFlow ---
    const [inventory, setInventory] = useState([
        { id: 1, brandName: 'Dolo 650', genericName: 'Paracetamol', saltComposition: 'Paracetamol 650mg IP', category: 'Analgesic', price: 30.00, stock: 120, packSize: 15, form: 'Tablet', rx: false },
        { id: 2, brandName: 'Citrogin', genericName: 'Levocetirizine', saltComposition: 'Levocetirizine 5mg', category: 'Antihistamine', price: 18.00, stock: 8, packSize: 10, form: 'Tablet', rx: true },
        { id: 3, brandName: 'Augmentin 625', genericName: 'Amoxicillin + Clavulanic Acid', saltComposition: 'Amoxicillin 500mg, Clavulanic Acid 125mg', category: 'Antibiotic', price: 210.00, stock: 45, packSize: 10, form: 'Tablet', rx: true },
        { id: 4, brandName: 'Benadryl', genericName: 'Diphenhydramine', saltComposition: 'Diphenhydramine 12.5mg/5ml', category: 'Cough Syrup', price: 110.00, stock: 15, packSize: 1, form: 'Syrup', rx: false },
        { id: 5, brandName: 'Metffull 500', genericName: 'Metformin', saltComposition: 'Metformin 500mg', category: 'Antidiabetic', price: 40.00, stock: 85, packSize: 15, form: 'Tablet', rx: true },
    ]);

    const [patients, setPatients] = useState([
        { id: 'CUST-1001', name: 'Abhinav G', mobile: '9876543210', history: [{ id: 'INV-5001', date: '2024-10-20', total: 450, items: 'Paracetamol, Cetirizine' }] },
        { id: 'CUST-1002', name: 'John Doe', mobile: '9123456789', history: [] }
    ]);

    // --- Billing State ---
    const [billing, setBilling] = useState({
        currentItems: [],
        subtotal: 0,
        tax: 0,
        total: 0,
        customerName: '',
        customerMobile: '',
        linkedRx: null
    });
    const [billSearch, setBillSearch] = useState('');
    const [selectedMed, setSelectedMed] = useState(null);
    const [saleType, setSaleType] = useState('strip'); // 'strip' | 'single'
    const [posQty, setPosQty] = useState(1);
    const [rxAnalysisMode, setRxAnalysisMode] = useState(null); // 'digital' | 'offline'
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Profile State
    const [profileForm, setProfileForm] = useState({
        name: user?.name || '',
        address: user?.address || '',
        phone: user?.phone || user?.primaryPhone || '',
        secondaryPhone: user?.secondaryPhone || '',
        inChargeName: user?.inChargeName || ''
    });
    const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    if (loading || !user) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#0f172a',
                color: 'white'
            }}>
                <div style={{ padding: '20px', backgroundColor: '#10b981', borderRadius: '14px', marginBottom: '20px' }}>
                    <HeartPulse size={32} className="animate-pulse" />
                </div>
                <h2 style={{ fontWeight: '800', fontSize: '18px' }}>Initializing Pharmacy Portal...</h2>
                <p style={{ opacity: 0.6, fontSize: '14px', marginTop: '8px' }}>Securing your session</p>
            </div>
        );
    }

    const myOrders = (orders || []).filter(o => o.storeName === user?.name || o.storeId === user?.id);

    // --- Billing Logic ---
    const calculateTotals = () => {
        const subtotal = billing.currentItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
        const tax = subtotal * 0.12;
        setBilling(prev => ({ ...prev, subtotal, tax, total: subtotal + tax }));
    };

    const addToBill = (medicine, qty = 1) => {
        const existing = billing.currentItems.find(i => i.id === medicine.id);
        const incomingQty = parseInt(qty) || 1;

        if (existing) {
            const updated = billing.currentItems.map(i =>
                i.id === medicine.id ? { ...i, qty: i.qty + incomingQty } : i
            );
            syncBillingTotals(updated);
        } else {
            const updated = [...billing.currentItems, { ...medicine, qty: incomingQty }];
            syncBillingTotals(updated);
        }
    };

    // Use a direct update instead of useEffect for simplicity in this demo structure
    const syncBillingTotals = (items) => {
        const subtotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0);
        const tax = subtotal * 0.12;
        setBilling(prev => ({ ...prev, currentItems: items, subtotal, tax, total: subtotal + tax }));
    };

    const updateBillQty = (id, qty) => {
        const updated = billing.currentItems.map(i => i.id === id ? { ...i, qty: parseInt(qty) || 1 } : i);
        syncBillingTotals(updated);
    };

    const removeFromBill = (id) => {
        const updated = billing.currentItems.filter(i => i.id !== id);
        syncBillingTotals(updated);
    };

    const analyzeDigitalRX = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            const detectedIds = [1, 2];
            let currentItems = [...billing.currentItems];
            detectedIds.forEach(id => {
                const med = inventory.find(m => m.id === id);
                if (med && !currentItems.find(ci => ci.id === id)) {
                    currentItems.push({ ...med, qty: 1 });
                }
            });
            const subtotal = currentItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
            const tax = subtotal * 0.12;
            setBilling(prev => ({
                ...prev,
                currentItems,
                subtotal, tax, total: subtotal + tax,
                linkedRx: { type: 'Digital', status: 'Verified', id: 'RX-2001' }
            }));
            setIsAnalyzing(false);
            alert("Digital RX analyzed: 2 medicines detected and added.");
        }, 1500);
    };


    const toggleAvailability = (orderId, index) => {
        setAvailableItems(prev => ({
            ...prev,
            [orderId]: {
                ...(prev[orderId] || {}),
                [index]: !prev[orderId]?.[index]
            }
        }));
    };

    const isAllAvailable = (order) => {
        const items = order.items || ['Amoxicillin 500mg', 'Paracetamol 650mg'];
        return items.every((_, i) => availableItems[order.id]?.[i]);
    };

    const handleCheckout = async () => {
        if (billing.currentItems.length === 0) return alert("Cart is empty!");
        setIsCheckoutLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Update Inventory with unit-level precision
        setInventory(prev => prev.map(item => {
            const billedItems = billing.currentItems.filter(i => i.originalId === item.id);
            if (billedItems.length === 0) return item;

            let totalUnitsToReduce = 0;
            billedItems.forEach(b => {
                if (b.saleType === 'strip') {
                    totalUnitsToReduce += b.qty;
                } else {
                    // Reduce fractional strip for single units
                    totalUnitsToReduce += b.qty / item.packSize;
                }
            });

            return { ...item, stock: Math.max(0, parseFloat((item.stock - totalUnitsToReduce).toFixed(2))) };
        }));

        setIsCheckoutLoading(false);
        setCheckoutSuccess(true);

        setTimeout(() => {
            setCheckoutSuccess(false);
            setBilling({
                currentItems: [], subtotal: 0, tax: 0, total: 0,
                customerName: '', customerMobile: '', linkedRx: null
            });
        }, 3000);
    };

    const handleProfileUpdate = (e) => {
        if (e) e.preventDefault();
        setProfileMsg({ type: '', text: '' });

        const res = updateProfile(profileForm);
        if (res.success) {
            setProfileMsg({ type: 'success', text: 'Pharmacy profile updated successfully!' });
        } else {
            setProfileMsg({ type: 'error', text: res.message || 'Failed to update profile' });
        }
    };

    const simulateMapPicker = () => {
        const locs = ['17.4483° N, 78.3915° E', '17.3850° N, 78.4867° E'];
        const pick = locs[Math.floor(Math.random() * locs.length)];
        alert(`Google Maps Link Established!\nCoordinates: ${pick}`);
        updateProfile({ location: pick });
    };

    const simulateImgUpload = () => {
        const imgs = ['https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&q=80&w=400'];
        updateProfile({ image: imgs[0] });
        alert('Store storefront image updated!');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', backgroundColor: '#f3f4f6', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>
            {/* Sidebar Navigation */}
            <div style={{
                width: '260px',
                backgroundColor: 'white',
                color: '#64748b',
                display: 'flex',
                flexDirection: 'column',
                padding: '32px 20px',
                position: 'fixed',
                height: '100vh',
                zIndex: 100,
                borderRight: '1px solid #f1f5f9'
            }}>
                {/* Branding */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px', padding: '0 12px' }}>
                    <div style={{ padding: '8px', backgroundColor: '#10b981', borderRadius: '12px', color: 'white' }}>
                        <HeartPulse size={24} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}>vArogra</h1>
                        <p style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8' }}>Pharmacy Management</p>
                    </div>
                </div>

                {/* Nav Links */}
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                    <SidebarLink active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<TrendingUp size={18} />} label="Overview" />
                    <SidebarLink active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<ShoppingBag size={18} />} label="Orders" />
                    <SidebarLink active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} icon={<Package size={18} />} label="Inventory" />
                    <SidebarLink active={activeTab === 'billing'} onClick={() => setActiveTab('billing')} icon={<Receipt size={18} />} label="Smart POS" />
                    <SidebarLink active={activeTab === 'patients'} onClick={() => setActiveTab('patients')} icon={<Users size={18} />} label="Patients" />

                    <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #f1f5f9' }}>
                        <p style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', padding: '0 16px' }}>Account</p>
                        <SidebarLink active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<User size={18} />} label="Profile" />
                        <SidebarLink active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={18} />} label="Settings" />
                    </div>
                </nav>

                {/* New Prescription Button */}
                <div style={{ marginTop: 'auto' }}>
                    <button style={{
                        width: '100%',
                        backgroundColor: '#10b981',
                        color: 'white',
                        padding: '14px',
                        borderRadius: '14px',
                        border: 'none',
                        fontWeight: '700',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.2)',
                        cursor: 'pointer'
                    }}>
                        <Plus size={18} /> New Prescription
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, marginLeft: '260px', backgroundColor: '#fcfdfe' }}>
                <header style={{
                    height: '80px',
                    backgroundColor: 'white',
                    borderBottom: '1px solid #f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 40px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 90
                }}>
                    <div style={{ position: 'relative', width: '400px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            placeholder="Search orders, patients, or medicine..."
                            style={{ ...inputStyle, width: '100%', paddingLeft: '48px', border: 'none', backgroundColor: '#f8fafc' }}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <div style={{ display: 'flex', gap: '16px', color: '#64748b' }}>
                            <motion.button whileHover={{ scale: 1.1 }} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
                                <ShoppingBag size={20} />
                                <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', border: '2px solid white' }} />
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.1 }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
                                <Receipt size={20} />
                            </motion.button>
                        </div>

                        <div style={{ height: '32px', width: '1px', backgroundColor: '#f1f5f9' }} />

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{user?.name || 'Dr. Sarah Chen'}</p>
                                <p style={{ fontSize: '12px', color: '#94a3b8' }}>Chief Pharmacist</p>
                            </div>
                            <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Sarah'}`}
                                alt="Profile"
                                style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#f1f5f9' }}
                            />
                        </div>
                    </div>
                </header>

                <main style={{ padding: '40px', maxWidth: '1600px', margin: '0 auto' }}>
                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                                style={{ display: 'grid', gap: '32px' }}
                            >
                                {/* KPI Strip */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                                    <div style={premiumCard}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                            <div style={{ padding: '10px', backgroundColor: '#ecfdf5', color: '#10b981', borderRadius: '12px' }}><DollarSign size={20} /></div>
                                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#10b981', backgroundColor: '#f0fdf4', padding: '4px 8px', borderRadius: '8px', height: 'fit-content' }}>+12.5%</span>
                                        </div>
                                        <p style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Today's Revenue</p>
                                        <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>₹42,500.00</h3>
                                    </div>
                                    <div style={premiumCard}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                            <div style={{ padding: '10px', backgroundColor: '#eff6ff', color: '#3b82f6', borderRadius: '12px' }}><ShoppingBag size={20} /></div>
                                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#3b82f6', backgroundColor: '#f0f9ff', padding: '4px 8px', borderRadius: '8px', height: 'fit-content' }}>+8%</span>
                                        </div>
                                        <p style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Total Orders</p>
                                        <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>128</h3>
                                    </div>
                                    <div style={premiumCard}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                            <div style={{ padding: '10px', backgroundColor: '#fef2f2', color: '#ef4444', borderRadius: '12px' }}><Package size={20} /></div>
                                            <span style={{ fontSize: '11px', fontWeight: '700', color: '#ef4444', backgroundColor: '#fff1f2', padding: '4px 8px', borderRadius: '8px', height: 'fit-content' }}>CRITICAL</span>
                                        </div>
                                        <p style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Stock Alerts</p>
                                        <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>12</h3>
                                    </div>
                                    <div style={premiumCard}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                            <div style={{ padding: '10px', backgroundColor: '#f5f3ff', color: '#8b5cf6', borderRadius: '12px' }}><Users size={20} /></div>
                                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#8b5cf6', backgroundColor: '#f5f3ff', padding: '4px 8px', borderRadius: '8px', height: 'fit-content' }}>+42</span>
                                        </div>
                                        <p style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Active Customers</p>
                                        <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>842</h3>
                                    </div>
                                </div>

                                {/* Visual Split */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) 340px', gap: '32px' }}>
                                    <div style={{ display: 'grid', gap: '32px' }}>
                                        {/* Chart Section */}
                                        <div style={{ ...premiumCard, minHeight: '340px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                                <div>
                                                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b' }}>Revenue Intelligence</h3>
                                                    <p style={{ fontSize: '13px', color: '#94a3b8' }}>Real-time earnings trajectory</p>
                                                </div>
                                                <div style={{ display: 'flex', gap: '8px', backgroundColor: '#f8fafc', padding: '4px', borderRadius: '12px' }}>
                                                    {['D', 'W', 'M'].map(t => (
                                                        <button
                                                            key={t}
                                                            onClick={() => setChartFilter(t)}
                                                            style={{
                                                                border: 'none',
                                                                background: chartFilter === t ? 'white' : 'transparent',
                                                                color: chartFilter === t ? '#10b981' : '#64748b',
                                                                padding: '6px 14px',
                                                                borderRadius: '9px',
                                                                fontSize: '12px',
                                                                fontWeight: '700',
                                                                cursor: 'pointer',
                                                                boxShadow: chartFilter === t ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                                                                transition: 'all 0.2s ease'
                                                            }}
                                                        >
                                                            {t === 'D' ? 'Day' : t === 'W' ? 'Week' : 'Month'}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div style={{ flex: 1, marginBottom: '20px', paddingBottom: '10px' }}>
                                                <AnimatePresence mode="wait">
                                                    <motion.div
                                                        key={chartFilter}
                                                        initial={{ opacity: 0, scale: 0.98 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.98 }}
                                                        transition={{ duration: 0.3 }}
                                                        style={{ height: '100%', width: '100%', minHeight: '220px' }}
                                                    >
                                                        <RevenueChart data={currentData.data} labels={currentData.labels} />
                                                    </motion.div>
                                                </AnimatePresence>
                                            </div>
                                        </div>

                                        {/* Table Section */}
                                        <div style={premiumCard}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b' }}>Recent Prescription Orders</h3>
                                                <button style={{ color: '#10b981', fontSize: '13px', fontWeight: '700', background: 'none', border: 'none', cursor: 'pointer' }}>View Archives</button>
                                            </div>
                                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                <thead>
                                                    <tr>
                                                        <th style={{ ...thStyle, paddingLeft: 0 }}>PATIENT</th>
                                                        <th style={thStyle}>MEDICATION</th>
                                                        <th style={thStyle}>STATUS</th>
                                                        <th style={{ ...thStyle, paddingRight: 0, textAlign: 'right' }}>AMOUNT</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {[
                                                        { name: 'John Doe', med: 'Amoxicillin 500mg', status: 'READY', val: '₹450.00' },
                                                        { name: 'Emma Smith', med: 'Lisinopril 10mg', status: 'PREPARING', val: '₹125.00' },
                                                        { name: 'Dr. Michael', med: 'Metformin 1g', status: 'READY', val: '₹300.00' }
                                                    ].map((order, i) => (
                                                        <tr key={i}>
                                                            <td style={{ ...tdStyle, paddingLeft: 0 }}>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800', color: '#64748b' }}>{order.name[0]}</div>
                                                                    <span style={{ fontWeight: '700' }}>{order.name}</span>
                                                                </div>
                                                            </td>
                                                            <td style={tdStyle}>{order.med}</td>
                                                            <td style={tdStyle}><StatusBadge status={order.status === 'READY' ? 'Delivered' : 'Preparing'} /></td>
                                                            <td style={{ ...tdStyle, paddingRight: 0, textAlign: 'right', fontWeight: '800' }}>{order.val}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Sidebar Right */}
                                    <div style={{ display: 'grid', gap: '32px', alignContent: 'start' }}>
                                        <div style={{ ...premiumCard, border: '1px solid #fee2e2', backgroundColor: '#fffafb' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                                                <Package size={18} style={{ color: '#ef4444' }} />
                                                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#ef4444' }}>Critical Stock</h3>
                                            </div>
                                            <div style={{ display: 'grid', gap: '12px' }}>
                                                {[
                                                    { name: 'Amoxicillin', stock: '8 left', level: 'danger' },
                                                    { name: 'Cetirizine', stock: '2 left', level: 'critical' }
                                                ].map((item, i) => (
                                                    <div key={i} style={{ padding: '14px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #fee2e2' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                            <span style={{ fontSize: '13px', fontWeight: '700' }}>{item.name}</span>
                                                            <span style={{ fontSize: '11px', fontWeight: '800', color: '#ef4444' }}>{item.stock}</span>
                                                        </div>
                                                        <div style={{ height: '4px', width: '100%', backgroundColor: '#fef2f2', borderRadius: '2px' }}>
                                                            <div style={{ height: '100%', width: item.level === 'danger' ? '30%' : '15%', backgroundColor: '#ef4444', borderRadius: '2px' }} />
                                                        </div>
                                                    </div>
                                                ))}
                                                <button style={{ marginTop: '8px', padding: '12px', width: '100%', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>Restock Inventory</button>
                                            </div>
                                        </div>

                                        <div style={premiumCard}>
                                            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1e293b', marginBottom: '20px' }}>Operational Checklist</h3>
                                            <div style={{ display: 'grid', gap: '16px' }}>
                                                {[
                                                    { l: 'Verify pending Rx', d: true },
                                                    { l: 'Cold storage check', d: false },
                                                    { l: 'EOD Revenue Reconciliation', d: false }
                                                ].map((task, i) => (
                                                    <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                        <div style={{ width: '20px', height: '20px', borderRadius: '6px', border: '2px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: task.d ? '#10b981' : 'transparent', borderColor: task.d ? '#10b981' : '#e2e8f0' }}>
                                                            {task.d && <CheckCircle size={14} color="white" />}
                                                        </div>
                                                        <span style={{ fontSize: '13px', fontWeight: '600', color: task.d ? '#94a3b8' : '#334155', textDecoration: task.d ? 'line-through' : 'none' }}>{task.l}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'orders' && (
                            <motion.div
                                key="orders"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                style={{ display: 'grid', gap: '32px' }}
                            >
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                                    <StatCard icon={<ShoppingBag />} title="Total Orders" value={myOrders.length} variant="info" />
                                    <StatCard icon={<TrendingUp />} title="Revenue" value={`₹${myOrders.reduce((a, c) => a + (c.total || 0), 0).toFixed(2)}`} variant="success" />
                                    <StatCard icon={<Clock />} title="Pending Action" value={myOrders.filter(o => o.status === 'Confirmed').length} variant="warning" />
                                </div>

                                <div style={premiumCard}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                        <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Order Stream</h3>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {['All', 'Confirmed', 'Preparing', 'Delivered'].map(s => (
                                                <button key={s} onClick={() => setFilter(s.toLowerCase())} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #f1f5f9', background: filter === s.toLowerCase() ? '#10b981' : 'white', color: filter === s.toLowerCase() ? 'white' : '#64748b', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>{s}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gap: '20px' }}>
                                        {myOrders.filter(o => filter === 'all' || o.status.toLowerCase() === filter).map(order => (
                                            <div key={order.id} style={{ padding: '24px', backgroundColor: '#f8fafc', borderRadius: '20px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                                    <div style={{ width: '48px', height: '48px', backgroundColor: 'white', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}><Truck size={24} /></div>
                                                    <div>
                                                        <p style={{ fontWeight: '800', fontSize: '16px' }}>{order.id}</p>
                                                        <p style={{ fontSize: '13px', color: '#64748b' }}>{order.userName} • {order.address || 'Standard Delivery'}</p>
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <p style={{ fontWeight: '800', fontSize: '18px', color: '#0f172a', marginBottom: '4px' }}>₹{order.total?.toFixed(2)}</p>
                                                    <StatusBadge status={order.status} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'inventory' && (
                            <motion.div
                                key="inventory"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                style={{ display: 'grid', gap: '32px' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ position: 'relative', width: '400px' }}>
                                        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                        <input placeholder="Search stock by name, category..." style={{ ...inputStyle, width: '100%', paddingLeft: '48px' }} />
                                    </div>
                                    <button style={{ padding: '12px 24px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><Plus size={18} /> Add New Entry</button>
                                </div>

                                <div style={premiumCard}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr>
                                                <th style={{ ...thStyle, paddingLeft: 0 }}>ITEM NAME</th>
                                                <th style={thStyle}>CATEGORY</th>
                                                <th style={thStyle}>STOCK LEVEL</th>
                                                <th style={thStyle}>UNIT PRICE</th>
                                                <th style={{ ...thStyle, paddingRight: 0, textAlign: 'right' }}>ACTIONS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {inventory.map(item => (
                                                <tr key={item.id}>
                                                    <td style={{ ...tdStyle, paddingLeft: 0 }}>
                                                        <div style={{ fontWeight: '700' }}>{item.name}</div>
                                                        {item.rx && <div style={{ fontSize: '10px', color: '#ef4444', fontWeight: '800', marginTop: '2px' }}>RX REQUIRED</div>}
                                                    </td>
                                                    <td style={tdStyle}>{item.category}</td>
                                                    <td style={tdStyle}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <div style={{ height: '6px', width: '60px', backgroundColor: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                                                                <div style={{ height: '100%', width: `${Math.min(item.stock, 100)}%`, backgroundColor: item.stock < 10 ? '#ef4444' : '#10b981' }} />
                                                            </div>
                                                            <span style={{ fontWeight: '700', color: item.stock < 10 ? '#ef4444' : '#0f172a' }}>{item.stock}</span>
                                                        </div>
                                                    </td>
                                                    <td style={tdStyle}>₹{item.price.toFixed(2)}</td>
                                                    <td style={{ ...tdStyle, paddingRight: 0, textAlign: 'right' }}>
                                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                            <button style={iconBtnStyle}><Edit size={16} /></button>
                                                            <button style={{ ...iconBtnStyle, color: '#ef4444' }}><Trash2 size={16} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}
                        {activeTab === 'billing' && (
                            <motion.div
                                key="billing"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px' }}
                            >
                                <div style={{ display: 'grid', gap: '32px' }}>
                                    <div style={premiumCard}>
                                        <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px' }}>Smart Checkout</h3>
                                        <div style={{ position: 'relative', marginBottom: '32px' }}>
                                            <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                            <input
                                                placeholder="Search by Brand, Generic Name, or Salt..."
                                                value={billSearch}
                                                onChange={e => setBillSearch(e.target.value)}
                                                style={{ ...inputStyle, width: '100%', paddingLeft: '52px', height: '56px', fontSize: '16px', border: '2px solid #f1f5f9' }}
                                            />
                                            <AnimatePresence>
                                                {billSearch && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 10 }}
                                                        style={{ position: 'absolute', top: '70px', left: 0, right: 0, backgroundColor: 'white', border: '1px solid #f1f5f9', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', zIndex: 10, overflow: 'hidden' }}
                                                    >
                                                        {inventory.filter(m =>
                                                            m.brandName.toLowerCase().includes(billSearch.toLowerCase()) ||
                                                            m.genericName.toLowerCase().includes(billSearch.toLowerCase()) ||
                                                            m.saltComposition.toLowerCase().includes(billSearch.toLowerCase())
                                                        ).map(m => (
                                                            <button
                                                                key={m.id}
                                                                onClick={() => {
                                                                    setSelectedMed(m);
                                                                    setSaleType('strip');
                                                                    setPosQty(1);
                                                                    setBillSearch('');
                                                                }}
                                                                style={{ width: '100%', padding: '16px', border: 'none', background: 'none', borderBottom: '1px solid #f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left' }}
                                                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                                            >
                                                                <div>
                                                                    <p style={{ fontWeight: '700', fontSize: '14px' }}>{m.brandName}</p>
                                                                    <p style={{ fontSize: '12px', color: '#64748b' }}>{m.genericName} • {m.form}</p>
                                                                    <p style={{ fontSize: '10px', color: '#94a3b8', fontStyle: 'italic' }}>{m.saltComposition}</p>
                                                                </div>
                                                                <div style={{ textAlign: 'right' }}>
                                                                    <p style={{ fontWeight: '800', color: '#10b981' }}>₹{m.price.toFixed(2)}</p>
                                                                    <span style={{ fontSize: '11px', fontWeight: '700', color: m.stock < 10 ? '#ef4444' : '#64748b' }}>Stock: {m.stock}</span>
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        <div style={{ display: 'grid', gap: '16px' }}>
                                            {selectedMed ? (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    style={{ ...premiumCard, border: '2px solid #10b981', backgroundColor: '#f0fdf4' }}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                                        <div>
                                                            <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#065f46' }}>{selectedMed.brandName}</h4>
                                                            <p style={{ fontSize: '13px', color: '#047857' }}>{selectedMed.genericName} • {selectedMed.saltComposition}</p>
                                                        </div>
                                                        <button onClick={() => setSelectedMed(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#059669' }}><Trash2 size={20} /></button>
                                                    </div>

                                                    <div style={{ display: 'grid', gap: '20px' }}>
                                                        {selectedMed.form === 'Tablet' || selectedMed.form === 'Capsule' ? (
                                                            <div>
                                                                <label style={{ fontSize: '11px', fontWeight: '800', color: '#059669', display: 'block', marginBottom: '8px' }}>SALE TYPE</label>
                                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                                    {['strip', 'single'].map(type => (
                                                                        <button
                                                                            key={type}
                                                                            onClick={() => setSaleType(type)}
                                                                            style={{
                                                                                flex: 1,
                                                                                padding: '10px',
                                                                                borderRadius: '10px',
                                                                                border: '1px solid',
                                                                                borderColor: saleType === type ? '#10b981' : '#d1fae5',
                                                                                backgroundColor: saleType === type ? '#10b981' : 'white',
                                                                                color: saleType === type ? 'white' : '#065f46',
                                                                                fontSize: '13px',
                                                                                fontWeight: '700',
                                                                                cursor: 'pointer'
                                                                            }}
                                                                        >
                                                                            {type === 'strip' ? 'Full Strip' : 'Single Tablet'}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <label style={{ fontSize: '11px', fontWeight: '800', color: '#059669', display: 'block', marginBottom: '8px' }}>SALE TYPE</label>
                                                                <div style={{ padding: '10px', borderRadius: '10px', border: '1px solid #d1fae5', backgroundColor: 'white', color: '#065f46', fontSize: '13px', fontWeight: '700' }}>
                                                                    Full Bottle / Unit
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <div>
                                                                <label style={{ fontSize: '11px', fontWeight: '800', color: '#059669', display: 'block', marginBottom: '4px' }}>PRICE</label>
                                                                <p style={{ fontSize: '20px', fontWeight: '900', color: '#065f46' }}>
                                                                    ₹{(saleType === 'single' ? (selectedMed.price / selectedMed.packSize) : selectedMed.price).toFixed(2)}
                                                                    <span style={{ fontSize: '12px', opacity: 0.6, fontWeight: '700' }}> / {saleType === 'single' ? 'tab' : 'strip'}</span>
                                                                </p>
                                                            </div>
                                                            <div style={{ textAlign: 'right' }}>
                                                                <label style={{ fontSize: '11px', fontWeight: '800', color: '#059669', display: 'block', marginBottom: '8px' }}>QUANTITY</label>
                                                                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', border: '1px solid #d1fae5', borderRadius: '10px', padding: '4px' }}>
                                                                    <button onClick={() => setPosQty(Math.max(1, posQty - 1))} style={{ width: '32px', height: '32px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: '800' }}>-</button>
                                                                    <span style={{ width: '40px', textAlign: 'center', fontWeight: '900', color: '#065f46' }}>{posQty}</span>
                                                                    <button onClick={() => setPosQty(posQty + 1)} style={{ width: '32px', height: '32px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: '800' }}>+</button>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {posQty > (saleType === 'strip' ? selectedMed.stock : selectedMed.stock * selectedMed.packSize) && (
                                                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: '12px', color: '#ef4444', fontWeight: '800' }}>⚠️ Insufficient Stock!</motion.p>
                                                        )}

                                                        <button
                                                            disabled={posQty > (saleType === 'strip' ? selectedMed.stock : selectedMed.stock * selectedMed.packSize)}
                                                            onClick={() => {
                                                                const itemPrice = saleType === 'single' ? (selectedMed.price / selectedMed.packSize) : selectedMed.price;
                                                                addToBill({
                                                                    ...selectedMed,
                                                                    id: `${selectedMed.id}-${saleType}`,
                                                                    name: selectedMed.brandName,
                                                                    saleType,
                                                                    price: itemPrice,
                                                                    originalPrice: selectedMed.price,
                                                                    originalId: selectedMed.id
                                                                }, posQty);
                                                                setSelectedMed(null);
                                                            }}
                                                            style={{
                                                                width: '100%',
                                                                padding: '16px',
                                                                backgroundColor: '#10b981',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '14px',
                                                                fontWeight: '800',
                                                                cursor: 'pointer',
                                                                opacity: posQty > (saleType === 'strip' ? selectedMed.stock : selectedMed.stock * selectedMed.packSize) ? 0.5 : 1
                                                            }}
                                                        >
                                                            Add to Checkout Order
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <div style={{ padding: '60px', textAlign: 'center', opacity: 0.5, backgroundColor: '#f8fafc', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
                                                    <Search size={48} style={{ margin: '0 auto 16px', color: '#94a3b8' }} />
                                                    <p style={{ fontWeight: '600' }}>Search and select a medicine</p>
                                                    <p style={{ fontSize: '13px' }}>Configure sale type and quantity here</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gap: '32px', alignContent: 'start' }}>
                                    <div style={{ ...premiumCard, backgroundColor: '#0f172a', color: 'white' }}>
                                        <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px', color: 'white' }}>Current Checkout Order</h3>
                                        <div style={{ display: 'grid', gap: '12px', maxHeight: '400px', overflowY: 'auto', marginBottom: '32px', paddingRight: '8px' }}>
                                            {billing.currentItems.length > 0 ? (
                                                billing.currentItems.map(item => (
                                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#1e293b', borderRadius: '16px', border: '1px solid #334155' }}>
                                                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                                            <div style={{ width: '40px', height: '40px', backgroundColor: '#334155', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}><ShoppingBag size={20} /></div>
                                                            <div>
                                                                <p style={{ fontWeight: '700', fontSize: '14px', color: 'white' }}>{item.name}</p>
                                                                <p style={{ fontSize: '11px', color: '#94a3b8' }}>{item.saleType === 'strip' ? 'Full Strip' : 'Single Tablet'} • ₹{item.price.toFixed(2)}</p>
                                                            </div>
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#0f172a', borderRadius: '10px', padding: '4px', border: '1px solid #334155' }}>
                                                                <button onClick={() => updateBillQty(item.id, item.qty - 1)} style={{ width: '28px', height: '28px', border: 'none', background: 'none', cursor: 'pointer', borderRadius: '6px', color: 'white' }}>-</button>
                                                                <span style={{ width: '30px', textAlign: 'center', fontWeight: '800', fontSize: '14px', color: 'white' }}>{item.qty}</span>
                                                                <button onClick={() => updateBillQty(item.id, item.qty + 1)} style={{ width: '28px', height: '28px', border: 'none', background: 'none', cursor: 'pointer', borderRadius: '6px', color: 'white' }}>+</button>
                                                            </div>
                                                            <p style={{ width: '80px', textAlign: 'right', fontWeight: '800', fontSize: '16px', color: '#10b981' }}>₹{(item.price * item.qty).toFixed(2)}</p>
                                                            <button onClick={() => removeFromBill(item.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={18} /></button>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div style={{ padding: '40px', textAlign: 'center', opacity: 0.5 }}>
                                                    <p style={{ fontWeight: '600', fontSize: '14px', color: '#94a3b8' }}>Add items to see checkout summary</p>
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
                                            <label style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}>Patient Identification</label>
                                            <div style={{ display: 'grid', gap: '12px' }}>
                                                <input placeholder="Patient Name" value={billing.customerName} onChange={e => setBilling({ ...billing, customerName: e.target.value })} style={{ ...billInputStyle, backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                                                <input placeholder="Phone Number" value={billing.customerMobile} onChange={e => setBilling({ ...billing, customerMobile: e.target.value })} style={{ ...billInputStyle, backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                                            </div>
                                            <div style={{ display: 'grid', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', marginTop: '20px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#94a3b8' }}>
                                                    <span>Subtotal</span>
                                                    <span>₹{billing.subtotal.toFixed(2)}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#94a3b8' }}>
                                                    <span>GST (12%)</span>
                                                    <span>₹{billing.tax.toFixed(2)}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '24px', fontWeight: '900', color: 'white', marginTop: '12px' }}>
                                                    <span>Total</span>
                                                    <span>₹{billing.total.toFixed(2)}</span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={handleCheckout}
                                                disabled={isCheckoutLoading || checkoutSuccess || billing.currentItems.length === 0}
                                                style={{
                                                    width: '100%',
                                                    padding: '20px',
                                                    backgroundColor: checkoutSuccess ? '#10b981' : '#10b981',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '16px',
                                                    fontWeight: '800',
                                                    fontSize: '16px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '12px',
                                                    marginTop: '8px',
                                                    opacity: (isCheckoutLoading || billing.currentItems.length === 0) ? 0.7 : 1
                                                }}
                                            >
                                                {isCheckoutLoading ? (
                                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }} />
                                                ) : checkoutSuccess ? (
                                                    <><CheckCircle size={24} /> Order Completed</>
                                                ) : (
                                                    <><Printer size={20} /> Complete & Print Invoice</>
                                                )}
                                            </button>
                                        </div>

                                        <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '32px', border: '1px solid #e5e7eb', marginTop: '32px' }}>
                                            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>AI Rx Analysis</h3>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                                <button onClick={() => setRxAnalysisMode('offline', analyzeDigitalRX())} style={{ padding: '16px', borderRadius: '14px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                                    <ScanLine size={24} color="#6366f1" />
                                                    <span style={{ fontSize: '10px', fontWeight: '800' }}>OFFLINE</span>
                                                </button>
                                                <button onClick={() => setRxAnalysisMode('digital', analyzeDigitalRX())} style={{ padding: '16px', borderRadius: '14px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                                    <Eye size={24} color="#10b981" />
                                                    <span style={{ fontSize: '10px', fontWeight: '800' }}>DIGITAL AI</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        {activeTab === 'patients' && (
                            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} key="patients">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                    <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                                        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                        <input placeholder="Search patients by name or phone..." style={{ ...inputStyle, paddingLeft: '48px', width: '100%' }} />
                                    </div>
                                    <Button><Plus size={18} style={{ marginRight: '8px' }} /> New Patient Registration</Button>
                                </div>

                                <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '32px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ textAlign: 'left', borderBottom: '2px solid #f3f4f6' }}>
                                                <th style={thStyle}>PATIENT</th>
                                                <th style={thStyle}>CONTACT</th>
                                                <th style={thStyle}>LAST VISIT</th>
                                                <th style={thStyle}>TOTAL SPENT</th>
                                                <th style={thStyle}>ACTIONS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {patients.map(p => (
                                                <tr key={p.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                                                    <td style={tdStyle}>
                                                        <div style={{ fontWeight: '700', color: '#111827' }}>{p.name}</div>
                                                        <div style={{ fontSize: '12px', color: '#6b7280' }}>ID: {p.id}</div>
                                                    </td>
                                                    <td style={tdStyle}>{p.mobile}</td>
                                                    <td style={tdStyle}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            <Clock size={14} color="#9ca3af" />
                                                            {p.history[0]?.date || 'New Patient'}
                                                        </div>
                                                    </td>
                                                    <td style={tdStyle}>
                                                        <span style={{ fontWeight: '700', color: '#10b981' }}>₹{p.history.reduce((acc, curr) => acc + curr.total, 0)}</span>
                                                    </td>
                                                    <td style={tdStyle}>
                                                        <button style={iconBtnStyle}><Eye size={16} /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'profile' && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 400px', gap: '40px' }}
                            >
                                <div style={premiumCard}>
                                    <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '32px' }}>Pharmacy Profile</h3>
                                    <div style={{ display: 'grid', gap: '24px' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                            <div>
                                                <label style={labelStyle}>STORE NAME</label>
                                                <input value={profileForm.storeName} onChange={e => setProfileForm({ ...profileForm, storeName: e.target.value })} style={inputStyle} />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>PRIMARY PHARMACIST</label>
                                                <input value={profileForm.inChargeName} onChange={e => setProfileForm({ ...profileForm, inChargeName: e.target.value })} style={inputStyle} />
                                            </div>
                                        </div>
                                        <div>
                                            <label style={labelStyle}>OPERATIONAL ADDRESS</label>
                                            <input value={profileForm.address} onChange={e => setProfileForm({ ...profileForm, address: e.target.value })} style={inputStyle} />
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                            <div>
                                                <label style={labelStyle}>CONTACT LINE</label>
                                                <input value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} style={inputStyle} />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>EMAIL ENDPOINT</label>
                                                <input value={user?.email} disabled style={{ ...inputStyle, opacity: 0.6 }} />
                                            </div>
                                        </div>
                                        <button onClick={handleProfileUpdate} style={{ width: 'fit-content', padding: '14px 32px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', marginTop: '16px', cursor: 'pointer' }}>Update Store Profile</button>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gap: '32px', alignContent: 'start' }}>
                                    <div style={{ ...premiumCard, textAlign: 'center' }}>
                                        <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 24px' }}>
                                            <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${profileForm.storeName}`} style={{ width: '100%', height: '100%', borderRadius: '24px', backgroundColor: '#f1f5f9' }} alt="Store" />
                                            <button style={{ position: 'absolute', bottom: '-8px', right: '-8px', width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#10b981', color: 'white', border: '4px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Camera size={16} /></button>
                                        </div>
                                        <h4 style={{ fontWeight: '800', fontSize: '18px' }}>{profileForm.storeName}</h4>
                                        <p style={{ fontSize: '13px', color: '#64748b' }}>Verified Medical Establishment</p>
                                    </div>
                                    <div style={{ ...premiumCard, backgroundColor: '#fef2f2', border: '1px solid #fee2e2' }}>
                                        <h4 style={{ fontWeight: '800', color: '#ef4444', marginBottom: '8px' }}>Danger Zone</h4>
                                        <p style={{ fontSize: '12px', color: '#ef4444', marginBottom: '20px', opacity: 0.8 }}>Closing your pharmacy account is permanent and cannot be undone.</p>
                                        <button style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #fee2e2', background: 'white', color: '#ef4444', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>Deactivate Store</button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>

            <ConfirmModal
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={logout}
            />
        </div >
    );
};

export default MedicalStoreDashboard;
