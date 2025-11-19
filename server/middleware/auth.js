// reusable middleware to protect routes with JWT auth
// any route that should be "logged-in only"(valid token) can use this middleware

import jwt from "jsonwebtoken";
export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // Expectheader: "Authorization: Bearer <token>"
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
      throw new Error("JWT_SECRET is not set in environment variables");
    }

    // decoded will have whatever i put inside jwt.sign({ userId }, ...)
    const decoded = jwt.verify(token, secret);
    // attach to request so later handlers can use req.user.userId
    req.user = decoded;

    next();
  } catch (error) {
    console.error("authMiddleware error:", error.message);
    return res
      .status(401)
      .json({ message: "Invalid or expired token. Please log in again" });
  }
}
