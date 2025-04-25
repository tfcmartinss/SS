import express from "express";
import dotenv from "dotenv";

dotenv.config();

import authRoutes from "./routes/authRoutes.js";
import { fileURLToPath } from "url";
import path from "path";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/ui/register.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/ui/login.html');
});

app.use("/", authRoutes);

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server running on port 8000`);
})