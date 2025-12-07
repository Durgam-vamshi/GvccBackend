require('dotenv').config();
const jwt = require('jsonwebtoken');

function adminAuth(req, res, next) {
  const token = req.headers['x-admin-token'];

  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
}

function auth(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; 

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });

    req.user = decoded;
    next();
  });
}

module.exports = { adminAuth, auth };
