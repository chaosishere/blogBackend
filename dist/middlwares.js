"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config"); // Ensure JWT_SECRET is imported from config
const authMiddleware = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization header required" });
    }
    const token = header.split(" ")[1]; // Extract the token
    try {
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        // Add the user ID from the token to the request object
        req.user = decoded.userId;
        // Continue to the next middleware/route
        next();
    }
    catch (error) {
        res.status(403).json({ error: "Invalid or expired token" });
    }
};
exports.default = authMiddleware;
