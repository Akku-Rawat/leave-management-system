const db = require('../config/db');


const bcrypt = require('bcryptjs');

// Get list of all users
exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, email, role_id, created_at, updated_at FROM users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single user by ID
exports.getUserById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, email, role_id, created_at, updated_at FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role_id } = req.body;
    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'INSERT INTO users (name, email, password_hash, role_id) VALUES (?, ?, ?, ?)',
      [name, email, password_hash, role_id]
    );
    res.status(201).json({ id: result.insertId, name, email, role_id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update existing user
exports.updateUser = async (req, res) => {
  try {
    const { name, email, password, role_id } = req.body;
    const password_hash = password ? await bcrypt.hash(password, 10) : null;

    let query = 'UPDATE users SET name = ?, email = ?, role_id = ?';
    let params = [name, email, role_id];

    if (password_hash) {
      query += ', password_hash = ?';
      params.push(password_hash);
    }

    query += ' WHERE id = ?';
    params.push(req.params.id);

    const [result] = await db.query(query, params);
    if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user by ID
exports.deleteUser = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
