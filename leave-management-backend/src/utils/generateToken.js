import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET || 'your_secret_key';

export function generateToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role_id },
    secretKey,
    { expiresIn: '1h' }
  );
}

export function generateActionToken(leave_id, action) {
  return jwt.sign(
    { leave_id, action },
    secretKey,
    { expiresIn: '1h' }
  );
}
