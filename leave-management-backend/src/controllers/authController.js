import { loginUser } from '../services/authService.js'
import jwt from 'jsonwebtoken'

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await loginUser(email, password);
    console.log("User with role included:", user);

    // JWT token generate karo correct role_id ke saath
    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        role_id: user.role?.role_id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h', // token valid for 1 hour
      }
    );

    res.json({
      token,
      user,
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}
