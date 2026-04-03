import { Router } from "express";
import { asyncHandler } from "../utils/Constructors/asyncHandler.js";
import { ApiResponse } from "../utils/Constructors/ApiResponse.js";
import { sendPushNotification } from "../services/notification.service.js";

const router = Router();

router.route("/test").get(asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, {}, "Bhai, Notification API is working!")
    );
}));

router.route("/send").post(asyncHandler(async (req, res) => {
    console.log("Bhai, /send route hit hua hai! Body:", req.body);
    const { registrationIds, title, body } = req.body;
    
    if (!process.env.FIREBASE_SERVER_KEY) {
        return res.status(401).json(
            new ApiResponse(401, {}, "Bhai, FIREBASE_SERVER_KEY missing hai! .env mein daal do.")
        );
    }

    try {
        const data = {
            title: title || "Bhai ka message!",
            body: body || "Bhai ne push kar diya!",
            topic: 'all'
        };

        const results = await sendPushNotification(registrationIds, data);

        return res.status(200).json(
            new ApiResponse(200, results, "Notification sent successfully bhai!")
        );
    } catch (error) {
        console.error("Bhai Error in /send:", error);
        return res.status(500).json(
            new ApiResponse(500, { detail: error.message }, "Bhai notification send nahi ho payi. Valid Server Key use karo.")
        );
    }
}));

export default router;
