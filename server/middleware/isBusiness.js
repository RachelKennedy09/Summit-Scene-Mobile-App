// server/middleware/isBusiness.js
// Ensure only "business" users can access certain routes
// Used for event creation, editing, and deleting (business-only features)

export default function isBusiness(req, res, next) {
  // authMiddleware already ran, so req.user should exist
  const user = req.user;

  // If somehow auth middleware didn't attach user
  if (!user) {
    return res
      .status(401)
      .json({ message: "Not authenticated. Please log in." });
  }

  // The role comes from the JWT payload: { userId, role }
  if (user.role !== "business") {
    return res.status(403).json({
      message: "Business account required to perform this action.",
    });
  }

  // Passed checks -> continue to the controller
  next();
}
