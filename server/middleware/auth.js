// server/middleware/auth.js
// Reusable middleware to protect routes with JWT auth.
// Any route that should be "logged-in only" can use this middleware.

import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // Expect header: "Authorization: Bearer <token>"
  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "No authorization header provided." });
  }

  // Expect format: "Bearer <token>"
  const [type, token] = authHeader.split(/\s+/);

  if (!type || type.toLowerCase() !== "bearer" || !token) {
    return res.status(401).json({ message: "Invalid authorization format." });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not set in environment variables.");
    }

    // decoded contains whatever you put into JWT (userId, role)
    const decoded = jwt.verify(token, secret);

    // Attach payload to request so controllers can use req.user.userId
    req.user = decoded;

    next();
  } catch (error) {
    console.error("authMiddleware error:", error.message);
    return res
      .status(401)
      .json({ message: "Invalid or expired token. Please log in again." });
  }
}
