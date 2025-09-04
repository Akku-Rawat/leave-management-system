import prisma from "../../prisma/client.js";

export const getType1Notifications = async (req, res) => {
  try {
    const userId = req.user.user_id;
    // Example: fetch leave requests with approved status for this user as notifications
    const notifications = await prisma.leaveRequest.findMany({
      where: {
        user_id: userId,
        status: "approved",
      },
      select: {
        leave_id: true,
        start_date: true,
        end_date: true,
        status: true,
        // add more fields to craft notification message as per your logic
      },
      orderBy: {
        start_date: "desc",
      },
    });
    // Convert leaveRequests to notification objects expected by frontend
    const formattedNotifications = notifications.map((notif) => ({
      id: notif.leave_id,
      message: `Leave request approved from ${notif.start_date.toDateString()} to ${notif.end_date.toDateString()}`,
      time: notif.start_date.toISOString(),
    }));
    res.json(formattedNotifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getType2Notifications = async (req, res) => {
  try {
    const userId = req.user.user_id;
    // Example: fetch leave requests rejected for this user
    const notifications = await prisma.leaveRequest.findMany({
      where: {
        user_id: userId,
        status: "rejected",
      },
      select: {
        leave_id: true,
        start_date: true,
        end_date: true,
        status: true,
      },
      orderBy: {
        start_date: "desc",
      },
    });
    const formattedNotifications = notifications.map((notif) => ({
      id: notif.leave_id,
      message: `Leave request rejected from ${notif.start_date.toDateString()} to ${notif.end_date.toDateString()}`,
      time: notif.start_date.toISOString(),
    }));
    res.json(formattedNotifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getType3Notifications = async (req, res) => {
  try {
    const userId = req.user.user_id;
    // Example: leave requests with 'partial' or 'custom_message' status or other logic for messages
    const notifications = await prisma.leaveRequest.findMany({
      where: {
        user_id: userId,
        status: { in: ["partial", "custom_message"] },
      },
      select: {
        leave_id: true,
        start_date: true,
        end_date: true,
        status: true,
      },
      orderBy: {
        start_date: "desc",
      },
    });
    const formattedNotifications = notifications.map((notif) => ({
      id: notif.leave_id,
      message: `Leave request has message/status: ${notif.status}`,
      time: notif.start_date.toISOString(),
    }));
    res.json(formattedNotifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};