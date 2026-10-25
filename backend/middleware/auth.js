const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'aqua_ceramics_secure_jwt_secret_2026_key!';

function verifyAdminToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Access denied. Authorization token required.' });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.adminUser = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
}

module.exports = {
  JWT_SECRET,
  verifyAdminToken
};
