import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/Route';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyB_ZtUgtC0cR-FDTvDR-UPy0N42dEA8v9I",
  authDomain: "cemail-bf0aa.firebaseapp.com",
  projectId: "cemail-bf0aa",
  storageBucket: "cemail-bf0aa.firebasestorage.app",
  messagingSenderId: "945058766923",
  appId: "1:945058766923:web:0a2200c1bf52ca25fe6dce",
  measurementId: "G-JL9D3GP38X"
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
          console.log('Bhai, Notification permission granted!');
          
          if (messaging) {
            // Bhai check kar lo ki VAPID key placeholder toh nahi hai
            const vapidKey = import.meta.env.VITE_VAPID_KEY;
            if (!vapidKey || vapidKey === 'YOUR_FIREBASE_VAPID_KEY_BHAI') {
                console.error('BHAI, VAPID KEY missing ya placeholder hai!');
                return;
            }

            // Bhai manual service worker check/register for better results
            await navigator.serviceWorker.register('/firebase-messaging-sw.js')
                .catch(err => console.error('Bhai SW registration fail:', err));

            // Wait for service worker to be ready (active)
            const swReady = await navigator.serviceWorker.ready;

            // Bhai VAPID key ke sath token mangate hain
            const currentToken = await getToken(messaging, {
                vapidKey: vapidKey,
                serviceWorkerRegistration: swReady
            }).catch(err => {
                console.error('Bhai, Token lene mein error aya:', err);
                console.log('Bhai ek baar site storage clear karke reload karo.');
            });

            if (currentToken) {
                console.log('====================================');
                console.log('BHAI, APKA DEVICE TOKEN YE HAI:');
                console.log(currentToken);
                console.log('====================================');
                localStorage.setItem('fcmToken', currentToken);
                
                // Foreground mein message aaye toh ye logic chalega bhai
                onMessage(messaging, (payload) => {
                    console.log('Bhai, foreground mein message aaya:', payload);
                    new Notification(payload.notification.title, {
                        body: payload.notification.body,
                        icon: '/firebase-logo.png' // Agar icon na ho toh standard vite.svg use kar sakte hain
                    });
                });
            } else {
                console.log('Bhai, Token nahi mila. Service worker issue ho sakta hai.');
            }
          }
        } else {
          console.log('Bhai, Notification permission denied:', permission);
        }
      } catch (error) {
        console.error('Bhai Error in requestNotificationPermission:', error);
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
