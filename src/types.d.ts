import { Request } from "express";

// Extend the Request interface to include the user property
declare module "express-serve-static-core" {
  interface Request {
    user?: string; // Make it optional if not set for every request
  }
}
