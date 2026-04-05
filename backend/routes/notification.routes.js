import { Router } from "express";
import { asyncHandler } from "../utils/Constructors/asyncHandler.js";
import { ApiResponse } from "../utils/Constructors/ApiResponse.js";
import { sendPushNotification } from "../services/notification.service.js";

const router = Router();

router.route("/test").get(asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, {}, "Notification API is functional.")
    );
}));

router.route("/send").post(asyncHandler(async (req, res) => {
    console.log("/send route accessed. Body:", req.body);
    const { registrationIds, title, body } = req.body;

    try {
        const data = {
            title: title || "New Notification",
            body: body || "You have a new message.",
            topic: 'all'
        };

        const results = await sendPushNotification(registrationIds, data);

        return res.status(200).json(
            new ApiResponse(200, results, "Notification sent successfully.")
        );
    } catch (error) {
        console.error("Error in /send:", error);
        return res.status(500).json(
            new ApiResponse(500, { detail: error.message }, "Failed to send notification.")
        );
    }
}));

export default router;
