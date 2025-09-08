import prisma from "../../prisma/client.js";
import bcrypt from 'bcryptjs';

export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
      select: {
        user_id: true,
        name: true,
        email: true,
        role: {
          select: {
            role_name: true,
          },
        },
      },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.user_id; // authenticated user from token middleware
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password required' });
    }

    // Fetch user with password_hash
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
      select: { password_hash: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password in DB
    await prisma.user.update({
      where: { user_id: userId },
      data: { password_hash: newHashedPassword }
    });

    return res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role_id } = req.body;

    if (!name || !email || !password || !role_id) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create new user without department
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password_hash,
        role_id,
      },
    });

    // Exclude password_hash from response
    const { password_hash: _, ...userData } = user;
    res.status(201).json(userData);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
export const getUserList = async (req, res) => {
  try {
    // Only allow HR or Boss to fetch user list
    if (req.user.role !== "hr" && req.user.role !== "boss") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const users = await prisma.user.findMany({
      select: {
        user_id: true,
        name: true,
        email: true,
        role: {
          select: { role_name: true },
        },
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};


export const deleteUserById = async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    await prisma.user.delete({ where: { user_id: userId } });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};


export const updateUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, email, department, role } = req.body;

  try {
    // Update user details, excluding password
    const updatedUser = await prisma.user.update({
      where: { user_id: userId },
      data: { name, email, department, role },
    });

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
};
