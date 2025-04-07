import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";


//await db.collection('users').doc(uid).get(); // ✅ Will work without TS error


const initFirebaseAdmin = () => {
    try {
        const apps = getApps();

        if (!apps.length) {
            const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
            
            if (!privateKey) {
                throw new Error('FIREBASE_PRIVATE_KEY is not set');
            }

            initializeApp({
                credential: cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: privateKey
                })
            });
        }

        return {
            auth: getAuth(),
            db: getFirestore(),
        };
    } catch (error) {
        console.error('Error initializing Firebase Admin:', error);
        throw error;
    }
};

export const { auth, db } = initFirebaseAdmin();