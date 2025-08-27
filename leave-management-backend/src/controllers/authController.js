const db = require('../config/db');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(404).json({ message: 'User not found' });

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(401).json({ message: 'Invalid password' });

    const token = generateToken(user);

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role_id: user.role_id } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
