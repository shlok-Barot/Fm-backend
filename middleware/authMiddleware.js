const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET || 'your-default-secret-key';

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ 
      message: 'Authorization header missing',
      solution: 'Include Authorization header with format: Bearer <token>'
    });
  }
  
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ 
      message: 'Token missing from Authorization header',
      solution: 'Ensure token follows Bearer scheme: Bearer <token>'
    });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.role !== 'Administrator') {
      return res.status(403).json({ message: 'Admin privileges required' });
    }

    req.user = { personId: decoded.personId, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ 
      message: 'Invalid or expired token',
      error: err.message 
    });
  }
};