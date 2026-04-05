import PushNotifications from 'node-pushnotifications';
import dotenv from 'dotenv';

dotenv.config();

const settings = {
    gcm: {
        id: process.env.FIREBASE_SERVER_KEY || 'YOUR_FIREBASE_SERVER_KEY',
    },
};

const push = new PushNotifications(settings);

const registrationIds = []; 

const data = {
    title: 'Notification',
    body: 'New notification received from backend',
    topic: 'all',
    custom: {
        sender: 'Antigravity'
    }
};

console.log('Sending notification...');

if (registrationIds.length === 0) {
    console.log('Registration IDs are empty. Please add tokens from the frontend.');
} else {
    push.send(registrationIds, data)
        .then((results) => {
            console.log('Notification results:', results);
        })
        .catch((err) => {
            console.error('Error sending notification:', err);
        });
}
