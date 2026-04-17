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
            // No notification block - this makes it a "data-only" message
            data: {
                title: data.title || 'Notification',
                body: data.body || 'New push notification received',
                ...data.custom,
            },
            tokens: tokens,
        };

        console.log(`Sending multicast message to ${tokens.length} devices...`);
        const response = await admin.messaging().sendEachForMulticast(message);
        
        console.log(`Multicast results: ${response.successCount} success, ${response.failureCount} failure`);
        
        if (response.failureCount > 0) {
            response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                    console.error(`Failure sending to token ${tokens[idx]}:`, resp.error);
                }
            });
        }

        return {
            success: response.successCount > 0,
            successCount: response.successCount,
            failureCount: response.failureCount,
            responses: response.responses
        };
    } catch (error) {
        console.error("Error in firebase-admin notification:", error.message);
        throw error;
    }
};

export { sendPushNotification };
