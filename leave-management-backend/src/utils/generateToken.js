const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'your_secret_key';

function generateToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role_id },
    secretKey,
    { expiresIn: '1h' }
  );
}

module.exports = generateToken;
