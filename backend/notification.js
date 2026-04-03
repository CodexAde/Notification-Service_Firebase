import PushNotifications from 'node-pushnotifications';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const settings = {
    gcm: {
        id: process.env.FIREBASE_SERVER_KEY || 'YOUR_FIREBASE_SERVER_KEY',
    },
    // Add other providers if needed
};

const push = new PushNotifications(settings);

const registrationIds = []; // Bhai, yaha par device tokens ayenge frontend se

const data = {
    title: 'New Notification Bhai!',
    body: 'Bhai, ye notification backend se aa rha hai!',
    topic: 'all',
    custom: {
        sender: 'Antigravity'
    }
};

// Bhai is file ko `node notification.js` karke run karna
console.log('Bhai, sending notification...');

if (registrationIds.length === 0) {
    console.log('Bhai, registrationIds empty hai! Frontend se token le kar add karo.');
} else {
    push.send(registrationIds, data)
        .then((results) => {
            console.log('Bhai, Notification results:', results);
        })
        .catch((err) => {
            console.error('Bhai, Error sending notification:', err);
        });
}
