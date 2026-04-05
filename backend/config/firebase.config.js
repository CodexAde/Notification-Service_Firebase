import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const initializeFirebase = () => {
  try {
    if (!admin.apps.length) {
      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      };

      if (!serviceAccount.projectId || !serviceAccount.privateKey || !serviceAccount.clientEmail) {
        console.warn("Firebase Admin credentials missing in .env. Notifications may fail.");
        return null;
      }

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("Firebase Admin initialized successfully.");
    }
    return admin;
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
    return null;
  }
};

export default initializeFirebase;
