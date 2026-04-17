import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const initializeFirebase = () => {
  try {
    if (!admin.apps.length) {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      let privateKey = process.env.FIREBASE_PRIVATE_KEY;

      if (!projectId || !privateKey || !clientEmail) {
        console.warn("Firebase Admin credentials missing in .env. Notifications will fail.");
        return null;
      }

      // Handle potential double quotes and escaped newlines from .env
      if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
        privateKey = privateKey.substring(1, privateKey.length - 1);
      }
      privateKey = privateKey.replace(/\\n/g, '\n');

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      console.log("Firebase Admin initialized successfully.");
    }
    return admin;
  } catch (error) {
    console.error("Firebase Admin initialization error:", error.message);
    return null;
  }
};

export default initializeFirebase;
