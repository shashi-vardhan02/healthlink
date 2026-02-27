import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
    OAuthProvider
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./config";
import { logLoginEvent } from "./logging";

// Social Providers
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');
const xProvider = new OAuthProvider('twitter.com');

// Register user and create profile in Firestore
export const registerUser = async (email, password, name, role = 'patient', extraData = {}) => {
    if (!auth) {
        console.warn("Auth not initialized. Simulating registration.");
        return {
            uid: 'demo-uid-' + Date.now(),
            email,
            displayName: name,
            role,
            ...extraData,
            photoURL: null
        };
    }
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update display name
        await updateProfile(user, { displayName: name });

        // Save extra info in Firestore
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name,
            email,
            role,
            ...extraData,
            createdAt: new Date().toISOString()
        });

        // If hospital/doctor/store, create entry in specific collection too
        if (role === 'doctor') {
            await setDoc(doc(db, "doctors", user.uid), {
                id: user.uid,
                name,
                email,
                ...extraData,
                createdAt: new Date().toISOString()
            });
        } else if (role === 'medical_store') {
            await setDoc(doc(db, "medical_stores", user.uid), {
                id: user.uid,
                name,
                email,
                isOpen: true,
                ...extraData,
                createdAt: new Date().toISOString()
            });
        }

        return user;
    } catch (error) {
        throw error;
    }
};

// Specialized registration helpers

export const registerDoctor = (email, password, name, extraData) =>
    registerUser(email, password, name, 'doctor', extraData);

export const registerMedicalStore = (email, password, name, extraData) =>
    registerUser(email, password, name, 'medical_store', extraData);

// Login user
export const loginUser = async (email, password) => {
    if (!auth) {
        console.warn("Auth not initialized. Simulating login.");
        return {
            uid: 'demo-user-123',
            email,
            displayName: 'Demo User',
            role: 'patient',
            photoURL: null
        };
    }
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Try to get Firestore profile, but don't block login if it fails
        let userProfile = null;
        try {
            userProfile = await getUserProfile(user.uid);
        } catch (firestoreError) {
            console.warn("Could not fetch user profile from Firestore (possibly offline). Continuing with Auth data.", firestoreError.message);
        }

        // If no profile found but auth succeeded, allow login with basic data
        // (Don't block login just because Firestore is temporarily unreachable)
        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: 'patient',
            ...(userProfile || {})
        };

        // Log login event (fire-and-forget, don't block login)
        logLoginEvent(userData).catch(err => console.warn("Login logging failed:", err.message));

        return userData;
    } catch (error) {
        throw error;
    }
};

// Social Logins
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Try to get Firestore profile, but don't block login if offline
        let userProfile = null;
        try {
            userProfile = await getUserProfile(user.uid);
        } catch (firestoreError) {
            console.warn("Could not fetch Google user profile from Firestore.", firestoreError.message);
        }

        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: 'patient',
            ...(userProfile || {})
        };
        logLoginEvent(userData).catch(err => console.warn("Login logging failed:", err.message));
        return userData;
    } catch (error) {
        throw error;
    }
};

export const signInWithApple = async () => {
    try {
        const result = await signInWithPopup(auth, appleProvider);
        const user = result.user;
        let userProfile = null;
        try {
            userProfile = await getUserProfile(user.uid);
        } catch (firestoreError) {
            console.warn("Could not fetch Apple user profile from Firestore.", firestoreError.message);
        }
        return {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: 'patient',
            ...(userProfile || {})
        };
    } catch (error) {
        throw error;
    }
};

export const signInWithX = async () => {
    try {
        const result = await signInWithPopup(auth, xProvider);
        const user = result.user;
        let userProfile = null;
        try {
            userProfile = await getUserProfile(user.uid);
        } catch (firestoreError) {
            console.warn("Could not fetch X user profile from Firestore.", firestoreError.message);
        }
        return {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: 'patient',
            ...(userProfile || {})
        };
    } catch (error) {
        throw error;
    }
};

// Logout user
export const logoutUser = async () => {
    if (!auth) return;
    try {
        await signOut(auth);
    } catch (error) {
        throw error;
    }
};

// Get user profile from Firestore
export const getUserProfile = async (uid) => {
    if (!db) return null;
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            return null;
        }
    } catch (error) {
        // Handle offline/connectivity errors gracefully
        console.warn("getUserProfile failed (possibly offline):", error.message);
        return null;
    }
};

export const subscribeToAuthChanges = (callback) => {
    if (!auth) {
        callback(null);
        return () => { };
    }
    return onAuthStateChanged(auth, callback);
};

// Update user profile photo
export const updateUserProfilePhoto = async (uid, photoURL) => {
    if (!db) {
        console.warn("Firestore not initialized. Simulating profile update.");
        return true;
    }

    try {
        // Update Firebase Auth display profile
        if (auth.currentUser) {
            await updateProfile(auth.currentUser, { photoURL });
        }

        // Update Firestore user document
        const userDocRef = doc(db, "users", uid);
        await setDoc(userDocRef, { photoURL }, { merge: true });

        return true;
    } catch (error) {
        console.error("Error updating profile photo:", error);
        throw error;
    }
};
