import bcrypt from "bcrypt";
import { db } from "../config/db.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default-secret";

const register = async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPasswd = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO user (username, password) VALUES (?, ?)`;
        db.run(sql, [username, hashedPasswd], function (err) {
            if (err) {
                return res.status(400).json({ error: "Username already exists" });
            }            
            res.json({ message: "User is registered.",
                    username,})
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Missing username or password" });
    }
    const sql = "SELECT * FROM user WHERE username = ?";
    db.get(sql, [username], async (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }
        if (!row) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const match = await bcrypt.compare(password, row.password);
        if (!match) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign(
            { username: row.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        return res.json({
            message: "Login successful",
            token,
        });
    });
};

const authorize = async (req, res) => {
    const { client_id, redirect_uri, response_type, state } = req.query;
    if (client_id === "my-client2" && response_type === "code") {
        const authCode = "example-auth-code";
        const redirectUrl = `${redirect_uri}?code=${authCode}${state ? `&state=${state}` : ''}`;
        res.redirect(redirectUrl);
    } 
    else {
        res.status(400).json({ error: "Invalid client_id or response_type" });
    }
};

/*const token = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const base64 = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64, "base64").toString("utf-8").split(":");
    const [client_id, client_secret] = credentials;

    if (client_id === "my-client2" && client_secret === "secret2") {
        const { code } = req.body;

        if (code === "example-auth-code") {
            res.json({
                access_token: "example-access-token",
                refresh_token: "example-refresh-token"
            });
        } 
        else {
            res.status(400).json({ error: "Invalid authorization code" });
        }
    } 
    else {
        res.status(401).json({ error: "Invalid client credentials" });
    }
};*/
const token = (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const base64 = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64, "base64").toString("utf-8").split(":");
    const [client_id, client_secret] = credentials;

    if (client_id === "my-client2" && client_secret === "secret2") {
        const { code } = req.body;

        if (code === "example-auth-code") {
            // Gerar JWT
            const payload = {
                sub: "123456", // ou qualquer identificador de utilizador
                username: "oauth-user", // opcional, para identificação
                iss: 'https://auth-server-dr8r.onrender.com',
            };

            const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

            res.json({
                access_token: accessToken,
                token_type: "Bearer",
                expires_in: 3600,
            });
        } 
        else {
            res.status(400).json({ error: "Invalid authorization code" });
        }
    } 
    else {
        res.status(401).json({ error: "Invalid client credentials" });
    }
};

export { token, authorize, register, login };