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

      // Check if credentials are valid
      if (!serviceAccount.projectId || !serviceAccount.privateKey || !serviceAccount.clientEmail) {
        console.warn("BHAI WARNING: Firebase Admin credentials missing in .env! Notifications might fail.");
        return null;
      }

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("Bhai, Firebase Admin initialized successfully!");
    }
    return admin;
  } catch (error) {
    console.error("Bhai, Firebase Admin init error:", error);
    return null;
  }
};

export default initializeFirebase;
