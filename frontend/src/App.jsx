import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/Route';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken } from "firebase/messaging";

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
            // Bhai agar VAPID key nahi hai toh getToken bina options ke try karte hain
            const currentToken = await getToken(messaging).catch(err => {
                console.log('Bhai, Token lene mein error aya:', err);
            });

            if (currentToken) {
                console.log('====================================');
                console.log('BHAI, APKA DEVICE TOKEN YE HAI:');
                console.log(currentToken);
                console.log('====================================');
                localStorage.setItem('fcmToken', currentToken);
            } else {
                console.log('Bhai, Token nahi mila. Service worker check karo.');
            }
          }
        } else {
          console.log('Bhai, Notification permission denied/default:', permission);
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
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
