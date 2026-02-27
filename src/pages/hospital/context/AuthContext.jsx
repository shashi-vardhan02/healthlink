import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({ uid: 'demo-user', email: 'admin@varogra.com' });
    const [role, setRole] = useState('Admin'); // Default to Admin for demo/dev
    const [loading, setLoading] = useState(false); // Start with loading false for instant render

    useEffect(() => {
        console.log("vArogra: Initializing Auth Listener...");
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            try {
                if (authUser) {
                    console.log("vArogra: User detected:", authUser.email);
                    const userDoc = await getDoc(doc(db, 'users', authUser.uid));
                    const userData = userDoc.data();
                    setUser(authUser);
                    setRole(userData?.role || 'user');
                } else {
                    console.log("vArogra: No user detected, staying in demo mode.");
                }
            } catch (error) {
                console.error("vArogra: Firebase Sync Error:", error);
            }
        });

        return () => unsubscribe();
    }, []);

    const value = {
        user,
        role,
        login: () => Promise.resolve(), // Mock for demo
        logout: () => Promise.resolve(), // Mock for demo
        isAdmin: role === 'Admin',
        isDoctor: role === 'Doctor',
        isReceptionist: role === 'Receptionist'
    };

    return (
        <AuthContext.Provider value={value}>
            {/* Always render children to avoid blank screen during dev/config issues */}
            {children}
        </AuthContext.Provider>
    );
};
