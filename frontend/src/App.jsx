import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/Route';
import { onMessageListener, requestForToken } from './services/fcmService';

function App() {
    useEffect(() => {
        // 1. Attach listener immediately via service
        console.log('Attaching onMessage listener bhai (via service)...');
        const unsubscribe = onMessageListener((payload) => {
            console.log('AA GAYA! Full payload bhai:', payload);
            
            const title = payload.data?.title || payload.notification?.title || 'No Title';
            const body = payload.data?.body || payload.notification?.body || 'No Body';
            const icon = '/vite.svg'; 
            
            if (Notification.permission === 'granted') {
                try {
                    new Notification(title, { body, icon });
                } catch (e) {
                    console.error('Browser Notification Error:', e);
                }
                alert(`Bhai, Notification Mil Gaya! \n${title}: ${body}`);
            } else {
                alert(`Bhai, Notification permission denied!`);
            }
        });

        // 2. Request token via service
        requestForToken();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
