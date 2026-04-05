import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import initializeFirebase from "./config/firebase.config.js";

dotenv.config();
initializeFirebase();

const app = express();

app.use(cors({
    origin: "*",
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

import notificationRouter from "./routes/notification.routes.js";
app.use("/api/v1/notifications", notificationRouter);

app.use((err, req, res, next) => {
    console.error("Error encountered:", err);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        errors: err.errors || []
    });
});

export { app };
