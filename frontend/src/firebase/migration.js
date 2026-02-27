import { db } from "./config";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { hospitals, medicalStores } from "../utils/mockData";

// Utility to clear collection (be careful!)
const clearCollection = async (collectionName) => {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const deletePromises = querySnapshot.docs.map(d => deleteDoc(doc(db, collectionName, d.id)));
    await Promise.all(deletePromises);
};

export const migrateDataToFirestore = async () => {
    try {
        console.log("Starting migration...");

        // Migrate Hospitals and nested Doctors
        console.log("Migrating Hospitals...");
        for (const hospital of hospitals) {
            const { doctors, ...hospitalInfo } = hospital;
            const hospitalDoc = await addDoc(collection(db, "hospitals"), hospitalInfo);

            // Migrate Doctors associated with this hospital
            for (const doctor of doctors) {
                await addDoc(collection(db, "doctors"), {
                    ...doctor,
                    hospitalId: hospitalDoc.id,
                    hospitalName: hospital.name
                });
            }
        }

        // Migrate Medical Stores
        console.log("Migrating Medical Stores...");
        for (const store of medicalStores) {
            await addDoc(collection(db, "medicalStores"), store);
        }

        console.log("Migration complete!");
    } catch (error) {
        console.error("Migration failed:", error);
    }
};
