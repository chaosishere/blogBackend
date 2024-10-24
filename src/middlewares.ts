import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    // Send a 401 response if the Authorization header is missing or incorrect
    res.status(401).json({ message: "Authorization header required" });
    return; // Ensure the function exits after sending the response
  }

  const token = header.split(" ")[1]; // Extract the token

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    // Add the user ID from the token to the request object
    req.user = decoded.userId;

    // Continue to the next middleware/route handler
    next();
  } catch (error) {
    // Send a 403 response if the token is invalid or expired
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

export default authMiddleware;
