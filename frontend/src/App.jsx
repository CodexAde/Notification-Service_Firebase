import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/Route';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

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

if (typeof window !== 'undefined') {
  getAnalytics(app);
}

function App() {
  useEffect(() => {
    const requestNotificationPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        localStorage.setItem('notificationPermission', permission);
        
        if (permission === 'granted') {
          console.log('Notification permission granted');
          
          if (messaging) {
            const vapidKey = import.meta.env.VITE_VAPID_KEY;
            if (!vapidKey) {
                console.error('VAPID key is missing');
                return;
            }

            await navigator.serviceWorker.register('/firebase-messaging-sw.js')
                .catch(err => console.error('Service worker registration failed:', err));

            const swReady = await navigator.serviceWorker.ready;

            const currentToken = await getToken(messaging, {
                vapidKey: vapidKey,
                serviceWorkerRegistration: swReady
            }).catch(err => {
                console.error('Error obtaining token:', err);
            });

            if (currentToken) {
                console.log('Device token:', currentToken);
                localStorage.setItem('fcmToken', currentToken);
                
                onMessage(messaging, (payload) => {
                    console.log('Foreground message received:', payload);
                    new Notification(payload.notification.title, {
                        body: payload.notification.body,
                        icon: '/firebase-logo.png'
                    });
                });
            } else {
                console.log('Token not found');
            }
          }
        } else {
          console.log('Notification permission denied:', permission);
        }
      } catch (error) {
        console.error('Error in requestNotificationPermission:', error);
      }
    };

    requestNotificationPermission();
  }, []);

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
