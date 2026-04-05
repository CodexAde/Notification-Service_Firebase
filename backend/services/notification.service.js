import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const sendPushNotification = async (registrationIds, data) => {
    const tokens = Array.isArray(registrationIds) ? registrationIds : [registrationIds];

    if (tokens.length === 0) {
        throw new Error("Registration IDs are missing.");
    }

    try {
        const message = {
            notification: {
                title: data.title || 'Notification',
                body: data.body || 'New push notification received',
            },
            data: data.custom || {},
            tokens: tokens,
        };

        const response = await admin.messaging().sendEachForMulticast(message);
        
        return {
            success: response.successCount,
            failure: response.failureCount,
            responses: response.responses
        };
    } catch (error) {
        console.error("Error in firebase-admin notification:", error);
        throw error;
    }
};

export { sendPushNotification };
