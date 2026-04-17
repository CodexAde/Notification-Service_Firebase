import { getMessaging, getToken, deleteToken, onMessage } from "firebase/messaging";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

export const requestForToken = async () => {
  if (!messaging) return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const vapidKey = import.meta.env.VITE_VAPID_KEY;
      
      const swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      const swReady = await navigator.serviceWorker.ready;

      const currentToken = await getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: swReady
      });

      if (currentToken) {
        console.log('FCM Token fetched successfully bhai:', currentToken);
        localStorage.setItem('fcmToken', currentToken);
        return currentToken;
      }
    }
    return null;
  } catch (err) {
    console.error('An error occurred while retrieving token bhai:', err);
    throw err;
  }
};

export const clearAndRefreshToken = async () => {
    if (!messaging) return null;
    try {
        console.log('Clearing current token...');
        const token = localStorage.getItem('fcmToken');
        if (token) {
            await deleteToken(messaging);
            localStorage.removeItem('fcmToken');
        }
        return await requestForToken();
    } catch (err) {
        console.error('Error refreshing token bhai:', err);
        throw err;
    }
}

export const onMessageListener = (callback) => {
  if (!messaging) return;
  return onMessage(messaging, (payload) => {
    callback(payload);
  });
};

export { messaging };
