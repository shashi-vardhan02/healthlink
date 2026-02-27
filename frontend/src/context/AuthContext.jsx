import React, { createContext, useContext, useState, useEffect } from 'react';
import { hospitals as mockHospitals } from '../utils/mockData';
import { subscribeToAuthChanges, getUserProfile, loginUser, registerUser, signInWithGoogle, signInWithApple, signInWithX } from '../firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const safeJsonParse = (key, fallback) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (e) {
        console.error(`Error parsing localStorage key "${key}":`, e);
        return fallback;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Dynamic Data States
    const [allHospitals, setAllHospitals] = useState([]);
    const [allDoctors, setAllDoctors] = useState([]);
    const [allMedicalStores, setAllMedicalStores] = useState([]);

    const [appointments, setAppointments] = useState([]);
    const [orders, setOrders] = useState([]);
    const [bloodRequests, setBloodRequests] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [medicalCamps, setMedicalCamps] = useState([]);
    const [campRegistrations, setCampRegistrations] = useState([]);

    // Doctor Specific
    const [doctorStatus, setDoctorStatus] = useState('Available');
    const [doctorSchedule, setDoctorSchedule] = useState({});
    const [autoApprove, setAutoApprove] = useState(true);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Firebase Auth Listener
        const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const profile = await getUserProfile(firebaseUser.uid);
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName,
                        ...profile
                    });
                } catch (error) {
                    console.error("Error fetching profile:", error);
                    setUser(firebaseUser);
                }
            } else {
                // Only clear user if there's no local mock user
                const storedMockUser = localStorage.getItem('varogra_user');
                if (!storedMockUser) {
                    setUser(null);
                } else if (!user) {
                    // Recover mock user if state was lost but localStorage persists
                    setUser(JSON.parse(storedMockUser));
                }
            }
            setLoading(false);
        });

        // Load other data from localStorage (Legacy/Mock)
        const initData = () => {
            try {
                // Appointments
                const storedAppts = localStorage.getItem('varogra_appointments');
                if (storedAppts) {
                    setAppointments(JSON.parse(storedAppts));
                } else {
                    const demoAppt = [{ id: 'APT-1', doctorName: 'Sarah Smith', time: '10:00 AM', hospitalName: 'City Care Hospital', status: 'Accepted', visitType: 'offline', timestamp: new Date().toISOString() }];
                    setAppointments(demoAppt);
                    localStorage.setItem('varogra_appointments', JSON.stringify(demoAppt));
                }

                // Orders
                const storedOrders = localStorage.getItem('varogra_orders');
                if (storedOrders) {
                    setOrders(JSON.parse(storedOrders));
                } else {
                    const demoOrder = [{ id: 'ORD-1', storeName: 'Apollo Pharmacy', status: 'Out for delivery', timestamp: new Date().toISOString() }];
                    setOrders(demoOrder);
                    localStorage.setItem('varogra_orders', JSON.stringify(demoOrder));
                }

                // Blood Requests
                const storedBlood = localStorage.getItem('varogra_blood_requests');
                if (storedBlood) {
                    setBloodRequests(JSON.parse(storedBlood));
                } else {
                    const demoBlood = [{ id: 'BLD-1', patientName: 'Abhinav', bloodType: 'O+', status: 'Urgent', hospitalName: 'Apollo Spectra', timestamp: new Date().toISOString() }];
                    setBloodRequests(demoBlood);
                    localStorage.setItem('varogra_blood_requests', JSON.stringify(demoBlood));
                }

                // Others
                setAnnouncements(safeJsonParse('varogra_announcements', []));
                setMedicalCamps(safeJsonParse('varogra_medical_camps', []));
                setCampRegistrations(safeJsonParse('varogra_camp_registrations', []));

                // Dynamic Data
                const storedHospitals = localStorage.getItem('varogra_hospitals');
                if (storedHospitals) {
                    setAllHospitals(JSON.parse(storedHospitals));
                } else {
                    setAllHospitals(mockHospitals);
                    localStorage.setItem('varogra_hospitals', JSON.stringify(mockHospitals));
                }

                const storedDoctors = localStorage.getItem('varogra_doctors');
                if (storedDoctors) {
                    setAllDoctors(JSON.parse(storedDoctors));
                } else {
                    const initialDocs = mockHospitals.flatMap(h => (h.doctors || []).map(d => ({ ...d, hospitalId: h.id, hospitalName: h.name })));
                    setAllDoctors(initialDocs);
                    localStorage.setItem('varogra_doctors', JSON.stringify(initialDocs));
                }

                setAllMedicalStores(safeJsonParse('varogra_medical_stores', []));

            } catch (error) {
                console.error("Critical AuthContext Init Failure:", error);
            }
        };

        initData();
        return () => unsubscribe();
    }, []);

    const loginPatient = async (email, password) => {
        try {
            const userData = await loginUser(email, password);
            setUser(userData);
            localStorage.setItem('varogra_user', JSON.stringify(userData));
            return { success: true };
        } catch (error) {
            console.error("Patient login error:", error);
            return { success: false, message: error.message };
        }
    };

    const registerPatient = async (signupData) => {
        try {
            const { name, email, password, ...extraData } = signupData;
            const userData = await registerUser(email, password, name, 'patient', extraData);
            const userObj = {
                uid: userData.uid,
                email: userData.email || email,
                displayName: userData.displayName || name,
                role: 'patient',
                ...extraData
            };
            setUser(userObj);
            localStorage.setItem('varogra_user', JSON.stringify(userObj));
            return { success: true };
        } catch (error) {
            console.error("Patient registration error:", error);
            return { success: false, message: error.message };
        }
    };

    const loginSocial = async (provider) => {
        try {
            let userData;
            if (provider === 'google') userData = await signInWithGoogle();
            else if (provider === 'apple') userData = await signInWithApple();
            else if (provider === 'x') userData = await signInWithX();

            if (userData) {
                setUser(userData);
                localStorage.setItem('varogra_user', JSON.stringify(userData));
                return { success: true };
            }
        } catch (error) {
            console.error(`${provider} login error:`, error);
            return { success: false, message: error.message };
        }
    };


    const registerMedicalStore = async (storeData) => {
        try {
            const code = 'MSTR-' + Math.random().toString(36).substring(2, 6).toUpperCase();
            const email = storeData.email || `${code.toLowerCase()}@varogra.com`;
            const password = storeData.password || '123456';

            const user = await import('../firebase/auth').then(m => m.registerMedicalStore(
                email,
                password,
                storeData.name,
                { ...storeData, code }
            ));

            if (!user.uid && !user.id) throw new Error("Registration failed");
            return code;
        } catch (error) {
            console.error("Store registration error:", error);
            return { success: false, message: error.message };
        }
    };

    const registerDoctor = async (docData) => {
        try {
            const email = docData.email || `doc-${Date.now()}@varogra.com`;
            const password = docData.password || '123456';

            const user = await import('../firebase/auth').then(m => m.registerDoctor(
                email,
                password,
                docData.name,
                { ...docData, status: 'pending' }
            ));

            if (!user.uid && !user.id) throw new Error("Registration failed");
            return { success: true };
        } catch (error) {
            console.error("Doctor registration error:", error);
            return { success: false, message: error.message };
        }
    };


    const loginDoctor = async (code, password) => {
        // Master Login Bypass
        if (code === '123' && password === 'dsa') {
            return { success: true, doctor: { name: 'Admin Doctor', code: 'MASTER-D', role: 'doctor', id: 'master-doc', status: 'approved' } };
        }

        const doc = allDoctors.find(d => d.code === code && d.password === password);
        if (doc) return { success: true, doctor: doc };
        if (code.startsWith('DOC')) {
            return { success: true, doctor: { name: 'Dr. Sample', code, role: 'doctor', id: 'd1', status: 'approved' } };
        }
        return { success: false, message: 'Invalid ID or Passkey' };
    };

    const loginMedicalStore = async (code, pin) => {
        // Master Login Bypass
        if (code === '123' && pin === 'dsa') {
            return { success: true, store: { name: 'Admin Store', code: 'MASTER-S', role: 'medical_store', id: 'master-store' } };
        }

        const store = allMedicalStores.find(s => s.code === code);
        if (store) return { success: true, store: { ...store, role: 'medical_store' } };
        if (code.startsWith('MSTR')) {
            return { success: true, store: { name: 'Demo Store', code, role: 'medical_store', id: 'demo-store' } };
        }
        return { success: false, message: 'Invalid Store Code' };
    };


    // Use effect to listen to hospitals
    useEffect(() => {
        let unsubscribe = () => { };

        const setupListener = async () => {
            try {
                const { listenToHospitals } = await import('../firebase/services');
                unsubscribe = listenToHospitals((hospitals) => {
                    if (hospitals && hospitals.length > 0) {
                        setAllHospitals(hospitals);
                        localStorage.setItem('varogra_hospitals', JSON.stringify(hospitals));
                    }
                });
            } catch (error) {
                console.error("Error setting up hospital listener:", error);
            }
        };

        setupListener();
        return () => unsubscribe();
    }, []);

    // Use effect to listen to doctors
    useEffect(() => {
        let unsubscribe = () => { };

        const setupListener = async () => {
            try {
                const { listenToDoctors } = await import('../firebase/services');
                unsubscribe = listenToDoctors((doctors) => {
                    if (doctors && doctors.length > 0) {
                        setAllDoctors(doctors);
                        localStorage.setItem('varogra_doctors', JSON.stringify(doctors));
                    }
                });
            } catch (error) {
                console.error("Error setting up doctor listener:", error);
            }
        };

        setupListener();
        return () => unsubscribe();
    }, []);

    const bookAppointment = (appointmentData) => {
        const isBusy = doctorSchedule[appointmentData.doctorId]?.busyTimes?.includes(appointmentData.time);
        if (isBusy) return { success: false, message: 'Doctor is already booked at this time.' };

        const newAppt = {
            id: 'APT-' + Math.floor(1000 + Math.random() * 9000),
            userId: user?.uid || user?.id,
            userName: user?.displayName || user?.name,
            status: autoApprove ? 'Accepted' : 'Confirmed',
            timestamp: new Date().toISOString(),
            ...appointmentData
        };

        const updatedAppts = [...appointments, newAppt];
        setAppointments(updatedAppts);
        localStorage.setItem('varogra_appointments', JSON.stringify(updatedAppts));

        const newSchedule = { ...doctorSchedule };
        if (!newSchedule[appointmentData.doctorId]) newSchedule[appointmentData.doctorId] = { busyTimes: [] };
        newSchedule[appointmentData.doctorId].busyTimes.push(appointmentData.time);
        setDoctorSchedule(newSchedule);

        return { success: true, appointment: newAppt };
    };

    const checkDuplicateAddress = (address, type) => {
        const facilities = type === 'hospital' ? allHospitals : allMedicalStores;
        return facilities.some(f => f.address.toLowerCase().trim() === address.toLowerCase().trim());
    };

    const updateAppointmentStatus = (apptId, newStatus) => {
        const updatedAppts = appointments.map(appt => {
            if (appt.id === apptId) {
                let updates = { status: newStatus };
                if (newStatus === 'Accepted' && appt.visitType === 'online' && !appt.meetingLink) {
                    updates.meetingLink = `/call/${appt.id}`;
                }
                return { ...appt, ...updates };
            }
            return appt;
        });
        setAppointments(updatedAppts);
        localStorage.setItem('varogra_appointments', JSON.stringify(updatedAppts));
    };

    const addPrescription = (pxData) => {
        const newRx = { id: 'RX-' + Date.now(), ...pxData, timestamp: new Date().toISOString() };
        const updatedAppts = appointments.map(a => a.id === pxData.appointmentId ? { ...a, status: 'Prescribed', prescription: newRx } : a);
        setAppointments(updatedAppts);
        localStorage.setItem('varogra_appointments', JSON.stringify(updatedAppts));
        return newRx;
    };

    const placeOrder = (oData) => {
        const newOrder = { id: 'ORD-' + Date.now(), userId: user?.uid || user?.id, userName: user?.displayName || user?.name, status: 'Confirmed', timestamp: new Date().toISOString(), ...oData };
        const updatedOrders = [...orders, newOrder];
        setOrders(updatedOrders);
        localStorage.setItem('varogra_orders', JSON.stringify(updatedOrders));
        return newOrder;
    };

    const addAnnouncement = (aData) => {
        const newAnnouncement = {
            id: 'ANN-' + Date.now(),
            hospitalId: user?.uid || user?.id,
            hospitalName: user?.displayName || user?.name,
            timestamp: new Date().toISOString(),
            ...aData
        };
        const updated = [newAnnouncement, ...announcements];
        setAnnouncements(updated);
        localStorage.setItem('varogra_announcements', JSON.stringify(updated));
        return newAnnouncement;
    };

    const addMedicalCamp = (cData) => {
        const newCamp = {
            id: 'CMP-' + Date.now(),
            hospitalId: user?.uid || user?.id,
            hospitalName: user?.displayName || user?.name,
            registeredCount: 0,
            timestamp: new Date().toISOString(),
            ...cData
        };
        const updated = [newCamp, ...medicalCamps];
        setMedicalCamps(updated);
        localStorage.setItem('varogra_medical_camps', JSON.stringify(updated));
        return newCamp;
    };

    const registerForCamp = (campId) => {
        if (campRegistrations.some(r => r.campId === campId && (r.userId === user?.uid || r.userId === user?.id))) {
            return { success: false, message: 'Already registered for this camp.' };
        }

        const newReg = {
            id: 'REG-' + Date.now(),
            campId,
            userId: user?.uid || user?.id,
            timestamp: new Date().toISOString()
        };

        const updatedRegs = [...campRegistrations, newReg];
        setCampRegistrations(updatedRegs);
        localStorage.setItem('varogra_camp_registrations', JSON.stringify(updatedRegs));

        const updatedCamps = medicalCamps.map(c =>
            c.id === campId ? { ...c, registeredCount: (c.registeredCount || 0) + 1 } : c
        );
        setMedicalCamps(updatedCamps);
        localStorage.setItem('varogra_medical_camps', JSON.stringify(updatedCamps));

        return { success: true };
    };

    const updateOrderStatus = (oid, status) => {
        const updated = orders.map(o => o.id === oid ? { ...o, status } : o);
        setOrders(updated);
        localStorage.setItem('varogra_orders', JSON.stringify(updated));
    };

    const updateProfile = (data) => {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem('varogra_user', JSON.stringify(updatedUser)); // Keeping for legacy
        return { success: true };
    };

    const logout = () => { setUser(null); localStorage.removeItem('varogra_user'); };
    const completeLogin = (u) => { setUser(u); localStorage.setItem('varogra_user', JSON.stringify(u)); return true; };
    const approveDoctor = (did) => { return { success: true } };
    const checkDoctorStatus = (ph) => { const d = allDoctors.find(doc => doc.phone === ph); return d ? { found: true, status: d.status, code: d.code } : { found: false }; };
    const setupDoctorPassword = (ph, pw) => {
        const updatedDocs = allDoctors.map(d => d.phone === ph ? { ...d, status: 'approved', password: pw } : d);
        setAllDoctors(updatedDocs);
        localStorage.setItem('varogra_doctors', JSON.stringify(updatedDocs));
        return { success: true };
    };
    const resetDoctorPasskey = (id, ph, pw) => setupDoctorPassword(ph, pw);

    return (
        <AuthContext.Provider value={{
            user, loading, appointments, orders, bloodRequests,
            announcements, medicalCamps, campRegistrations,
            allHospitals, allDoctors, allMedicalStores,
            doctorStatus, doctorSchedule, autoApprove, notifications,
            setUser, completeLogin, setDoctorStatus, setDoctorSchedule, setAutoApprove,
            loginPatient, registerPatient, registerMedicalStore, loginDoctor, loginMedicalStore,
            registerDoctor, approveDoctor, checkDoctorStatus, setupDoctorPassword, resetDoctorPasskey,
            bookAppointment, updateAppointmentStatus, addPrescription, placeOrder, updateOrderStatus,
            addAnnouncement, addMedicalCamp, registerForCamp,
            checkDuplicateAddress, updateProfile, logout,
            loginSocial
        }}>
            {children}
        </AuthContext.Provider>
    );
};
