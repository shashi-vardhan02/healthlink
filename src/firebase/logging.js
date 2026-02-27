import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./config";

/**
 * Logs a user login event to Firestore.
 * @param {Object} user - The user object containing uid, email, and role.
 */
export const logLoginEvent = async (user) => {
    if (!db || !user) return;

    try {
        const loginHistoryCol = collection(db, "login_history");
        await addDoc(loginHistoryCol, {
            uid: user.uid,
            email: user.email,
            role: user.role || 'patient',
            timestamp: serverTimestamp(),
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            lastLogin: new Date().toISOString()
        });
    } catch (error) {
        console.error("Error logging login event:", error);
    }
};
