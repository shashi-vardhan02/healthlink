import { db } from '../firebase/config';
import {
    collection,
    query,
    where,
    onSnapshot,
    doc,
    updateDoc,
    addDoc,
    serverTimestamp,
    orderBy,
    limit
} from 'firebase/firestore';

export const doctorService = {
    // Listen to today's appointments for a specific doctor
    subscribeToAppointments: (doctorId, callback) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const q = query(
            collection(db, 'appointments'),
            where('doctorId', '==', doctorId),
            where('date', '>=', today),
            orderBy('date', 'asc')
        );

        return onSnapshot(q, (snapshot) => {
            const appointments = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(appointments);
        });
    },

    // Listen to live consultations queue
    subscribeToLiveQueue: (doctorId, callback) => {
        const q = query(
            collection(db, 'consultations'),
            where('doctorId', '==', doctorId),
            where('status', 'in', ['pending', 'active']),
            orderBy('queueNumber', 'asc')
        );

        return onSnapshot(q, (snapshot) => {
            const queue = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(queue);
        });
    },

    // Update consultation status
    updateConsultationStatus: async (consultationId, status) => {
        const docRef = doc(db, 'consultations', consultationId);
        await updateDoc(docRef, {
            status,
            updatedAt: serverTimestamp()
        });
    },

    // Save medical notes and complete consultation
    completeConsultation: async (consultationId, notes, diagnosis) => {
        const docRef = doc(db, 'consultations', consultationId);
        await updateDoc(docRef, {
            status: 'completed',
            notes,
            diagnosis,
            completedAt: serverTimestamp()
        });
    },

    // Save or update a note
    saveNote: async (noteData) => {
        const { id, ...data } = noteData;
        if (id) {
            const docRef = doc(db, 'doctorNotes', id);
            await updateDoc(docRef, {
                ...data,
                updatedAt: serverTimestamp()
            });
            return id;
        } else {
            const docRef = await addDoc(collection(db, 'doctorNotes'), {
                ...data,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            return docRef.id;
        }
    },

    // Subscribe to notes for a doctor and patient
    subscribeToNotes: (doctorId, patientId, callback) => {
        const q = query(
            collection(db, 'doctorNotes'),
            where('doctorId', '==', doctorId),
            where('patientId', '==', patientId),
            orderBy('createdAt', 'desc')
        );

        return onSnapshot(q, (snapshot) => {
            const notes = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(notes);
        });
    },

    // Save digital prescription from SmartScript™
    savePrescription: async (prescriptionData) => {
        const docRef = await addDoc(collection(db, 'prescriptions'), {
            ...prescriptionData,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    }
};
