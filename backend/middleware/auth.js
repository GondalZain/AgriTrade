
// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Extract token from Authorization header
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    console.error('No Authorization header provided');
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  // Check for 'Bearer' prefix and extract token
  const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : authHeader;
  if (!token) {
    console.error('Invalid Authorization header format');
    return res.status(401).json({ error: 'Access denied. Invalid token format.' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.email) {
      console.error('Token payload missing email:', decoded);
      return res.status(401).json({ error: 'Invalid token. No email in payload.' });
    }
    req.user = { email: decoded.email }; // Attach user to request
    console.log('Token verified for user:', req.user.email);
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    res.status(401).json({ error: 'Invalid token.' });
  }
};

module.exports = authMiddleware;
