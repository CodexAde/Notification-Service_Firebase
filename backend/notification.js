import { sendPushNotification } from './services/notification.service.js';
import initializeFirebase from './config/firebase.config.js';
import dotenv from 'dotenv';

dotenv.config();
initializeFirebase();

const registrationIds = process.argv[2] ? [process.argv[2]] : []; 

const data = {
    title: 'Notification Test',
    body: 'Notification from backend script bhai!',
    custom: {
        sender: 'Antigravity'
    }
};

console.log('Sending notification via modern service...');

if (registrationIds.length === 0) {
    console.log('No registration token provided. Usage: node notification.js <YOUR_TOKEN>');
} else {
    sendPushNotification(registrationIds, data)
        .then((results) => {
            console.log('Final results:', results);
        })
        .catch((err) => {
            console.error('Fatal error during send:', err.message);
        });
}
