import jwt from "jsonwebtoken";

export default function generateToken(user) {
  return jwt.sign(
    {
      user_id: user.user_id,
      role_id: user.role_id,
      role: user.role?.role_name || user.role_name,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}


