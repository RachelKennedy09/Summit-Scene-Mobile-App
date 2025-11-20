// Ensure only "Business" users can access certain routes
// Only businesses/event organizers should be able to post/manage events

export default function isBusiness(req, res, next) {
  // authMiddleware already ran, so req.user should exist
  const user = req.user;

  if (!user) {
    return res
      .status(401)
      .json({ message: "Not authenticated. Please log in." });
  }
  // role comes from the JWT payload: { userId, role }
  if (user.role !== "business") {
    return res.status(403).json({
      message: "Business account required to perform this action.",
    });
  }

  // Passed checks -> continue to controller
  next();
}
