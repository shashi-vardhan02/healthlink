import {
    collection,
    getDocs,
    getDoc,
    doc,
    addDoc,
    query,
    where,
    serverTimestamp,
    onSnapshot,
    setDoc,
    updateDoc
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "./config";

// Hospitals
export const getHospitals = async () => {
    const hospitalsCol = collection(db, "hospitals");
    const hospitalSnapshot = await getDocs(hospitalsCol);
    return hospitalSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Doctors
export const getDoctors = async () => {
    const doctorsCol = collection(db, "doctors");
    const doctorSnapshot = await getDocs(doctorsCol);
    return doctorSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};


// Appointments
export const bookAppointment = async (appointmentData) => {
    try {
        const appointmentsCol = collection(db, "appointments");
        const docRef = await addDoc(appointmentsCol, {
            ...appointmentData,
            createdAt: serverTimestamp(),
            status: 'Pending'
        });
        return docRef.id;
    } catch (error) {
        throw error;
    }
};

export const getUserAppointments = async (userId) => {
    const q = query(collection(db, "appointments"), where("patientId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Storage Services
export const uploadProfilePhoto = (uid, file, onProgress) => {
    if (!storage) {
        console.warn("Storage not initialized. Using Mock Storage.");
        return new Promise((resolve) => {
            // Simulate upload progress
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                if (onProgress) onProgress(progress);
                if (progress >= 100) {
                    clearInterval(interval);
                    // Return a fake URL or data URL
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve(reader.result); // Resolve with Data URL
                    };
                    reader.readAsDataURL(file);
                }
            }, 100);
        });
    }

    return new Promise((resolve, reject) => {
        const fileName = file.name || `photo_${Date.now()}.jpg`;
        const fileExt = fileName.split('.').pop() || 'jpg';
        const storageRef = ref(storage, `profiles/${uid}.${fileExt}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                if (onProgress) onProgress(progress);
            },
            (error) => {
                console.error("Upload error:", error);
                reject(error);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(downloadURL);
            }
        );
    });
};

// Hospital Management

export const listenToHospitals = (callback) => {
    if (!db) {
        console.warn("Firestore not initialized. Using mock hospitals.");
        callback([]);
        return () => { };
    }
    const q = query(collection(db, "hospitals"));
    return onSnapshot(q, (snapshot) => {
        const hospitals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(hospitals);
    });
};

// Doctor Management
export const updateDoctorStatus = async (doctorId, status) => {
    if (!db) {
        console.warn("Firestore not initialized. Mocking status update.");
        return true;
    }
    try {
        const doctorRef = doc(db, "doctors", doctorId);
        await updateDoc(doctorRef, { status });
        return true;
    } catch (error) {
        console.error("Error updating doctor status:", error);
        throw error;
    }
};

export const updateDoctorInfo = async (doctorId, info) => {
    if (!db) return true;
    try {
        const doctorRef = doc(db, "doctors", doctorId);
        await updateDoc(doctorRef, info);
        return true;
    } catch (error) {
        console.error("Error updating doctor info:", error);
        throw error;
    }
};

export const listenToDoctors = (callback) => {
    if (!db) {
        console.warn("Firestore not initialized. Using mock doctors.");
        callback([]);
        return () => { };
    }
    const q = query(collection(db, "doctors"));
    return onSnapshot(q, (snapshot) => {
        const doctors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(doctors);
    });
};

export const getDoctorsByHospital = async (hospitalId) => {
    if (!db) return [];
    try {
        const q = query(collection(db, "doctors"), where("hospitalId", "==", hospitalId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching doctors:", error);
        return [];
    }
};

// Queue & Token Services
export const generateToken = async (hospitalId, doctorId, patientId) => {
    if (!db) return Math.floor(100 + Math.random() * 900);
    try {
        const tokensCol = collection(db, "tokens");
        // In a real app, we'd query the last token for the day/doctor to increment
        // For now, we generate a unique sequential-looking token
        const tokenNumber = Math.floor(Math.random() * 50) + 1;
        const docRef = await addDoc(tokensCol, {
            hospitalId,
            doctorId,
            patientId,
            tokenNumber,
            status: 'waiting',
            timestamp: serverTimestamp()
        });
        return { id: docRef.id, tokenNumber };
    } catch (error) {
        console.error("Error generating token:", error);
        throw error;
    }
};

export const listenToQueue = (hospitalId, callback) => {
    if (!db) return () => { };
    const q = query(
        collection(db, "tokens"),
        where("hospitalId", "==", hospitalId),
        where("status", "in", ["waiting", "consulting"])
    );
    return onSnapshot(q, (snapshot) => {
        const queue = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(queue);
    });
};

export const updateTokenStatus = async (tokenId, status) => {
    if (!db) return;
    try {
        const tokenRef = doc(db, "tokens", tokenId);
        await updateDoc(tokenRef, { status });
    } catch (error) {
        console.error("Error updating token status:", error);
    }
};

// Blood Bank Services
export const updateBloodStock = async (hospitalId, bloodType, units, urgency = 'Low') => {
    if (!db) return;
    try {
        const stockRef = doc(db, "bloodInventory", `${hospitalId}_${bloodType}`);
        await setDoc(stockRef, {
            hospitalId,
            bloodType,
            units,
            urgency,
            updatedAt: serverTimestamp()
        }, { merge: true });
    } catch (error) {
        console.error("Error updating blood stock:", error);
    }
};

export const listenToBloodStock = (hospitalId, callback) => {
    if (!db) return () => { };
    const q = query(collection(db, "bloodInventory"), where("hospitalId", "==", hospitalId));
    return onSnapshot(q, (snapshot) => {
        const stock = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(stock);
    });
};

// Appointment Validation & Assistance
export const checkSlotAvailability = async (doctorId, date, time) => {
    if (!db) return true; // Mock success
    try {
        const q = query(
            collection(db, "appointments"),
            where("doctorId", "==", doctorId),
            where("date", "==", date),
            where("time", "==", time),
            where("status", "in", ["Accepted", "Pending"])
        );
        const snapshot = await getDocs(q);
        return snapshot.empty;
    } catch (error) {
        console.error("Error checking availability:", error);
        return false;
    }
};

export const searchDoctorByName = async (name) => {
    if (!db) return null;
    try {
        const q = query(collection(db, "doctors"));
        const snapshot = await getDocs(q);
        const doctors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Simple fuzzy search or exact match
        return doctors.find(d => d.name.toLowerCase().includes(name.toLowerCase()));
    } catch (error) {
        console.error("Error searching doctor:", error);
        return null;
    }
};

export const findAlternativeDoctors = async (specialty, hospitalId, date, time) => {
    if (!db) return [];
    try {
        let q = query(collection(db, "doctors"));
        if (specialty) {
            q = query(collection(db, "doctors"), where("specialty", "==", specialty));
        }
        const snapshot = await getDocs(q);
        const doctors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Filter by availability (this is simplified, ideally we'd check schedules)
        const availableDoctors = [];
        for (const dr of doctors) {
            const isAvailable = await checkSlotAvailability(dr.id, date, time);
            if (isAvailable) availableDoctors.push(dr);
        }
        return availableDoctors;
    } catch (error) {
        console.error("Error finding alternatives:", error);
        return [];
    }
};
export const getNextAvailableSlot = async (doctorId, date, startTime) => {
    if (!db) return "Tomorrow at 10:00 AM";
    try {
        // Simple logic: check next 3 hours
        const baseTime = parseInt(startTime.split(':')[0]);
        const ampm = startTime.split(' ')[1];

        for (let i = 1; i <= 3; i++) {
            const nextHour = baseTime + i;
            const nextTime = `${nextHour > 12 ? nextHour - 12 : nextHour}:00 ${ampm}`;
            const isAvailable = await checkSlotAvailability(doctorId, date, nextTime);
            if (isAvailable) return nextTime;
        }

        // If not found in same day, suggest tomorrow
        return "tomorrow at 10:00 AM";
    } catch (error) {
        console.error("Error finding next slot:", error);
        return "tomorrow at 10:00 AM";
    }
};
