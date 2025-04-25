import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No authentication token provided!" });
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } 
        catch (error) {
            return res.status(400).json({ message: "Invalid authentication token" });
        }
    } 
    else {
        return res.status(401).json({ message: "Authentication header missing or malformed" });
    }
};
export default verifyToken;