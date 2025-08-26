import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    { id: user.user_id, role: user.role.role_name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};
