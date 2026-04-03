import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const sendPushNotification = async (registrationIds, data) => {
    // Bhai agar registrationIds single string hai toh array mein convert kar dete hain
    const tokens = Array.isArray(registrationIds) ? registrationIds : [registrationIds];

    if (tokens.length === 0) {
        throw new Error("Registration IDs are missing bhai!");
    }

    try {
        // Bhai, FCM v1 use kar rhe hain direct admin SDK se
        const message = {
            notification: {
                title: data.title || 'Notification Bhai!',
                body: data.body || 'Bhai ka push notification aa gya!',
            },
            data: data.custom || {},
            tokens: tokens,
        };

        const response = await admin.messaging().sendEachForMulticast(message);
        
        // Bhai formatting result to match previous structure if needed
        return {
            success: response.successCount,
            failure: response.failureCount,
            responses: response.responses
        };
    } catch (error) {
        console.error("Bhai Error in firebase-admin notification:", error);
        throw error;
    }
};

export { sendPushNotification };
