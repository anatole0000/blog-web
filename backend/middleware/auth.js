// backend/middleware/auth.js
module.exports = (req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  };
  