import { app } from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 5001;

// Bhai stop exit debug
setInterval(() => {}, 1000);

app.listen(port, () => {
    console.log(`Bhai, Server running at http://localhost:${port}`);
});
