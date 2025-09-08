import prisma from "../../prisma/client.js";

// Unified notification fetch API (all notifications for user)
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const notifications = await prisma.notification.findMany({
      where: { user_id: userId },
      orderBy: { time: "desc" },
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch only unread notifications (optional, if you want a separate endpoint)
export const getUnreadNotifications = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const notifications = await prisma.notification.findMany({
      where: { user_id: userId, read: false },
      orderBy: { time: "desc" },
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark notification as read
export const markNotificationRead = async (req, res) => {
  const notificationId = parseInt(req.params.id);
  try {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
