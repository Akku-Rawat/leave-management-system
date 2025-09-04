import prisma from "../../prisma/client.js";

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