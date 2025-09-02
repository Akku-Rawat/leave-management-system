import express from 'express';

const router = express.Router();

// Mock notifications data
const mockNotifications = [
  { id: 1, message: 'Your leave request has been approved', time: '2023-06-15T10:30:00Z' },
  { id: 2, message: 'New company policy update', time: '2023-06-14T14:45:00Z' },
  { id: 3, message: 'Reminder: Team meeting tomorrow', time: '2023-06-13T09:15:00Z' }
];

// Get all notifications
router.get('/', (req, res) => {
  res.json(mockNotifications);
});

// Get notification by ID
router.get('/:id', (req, res) => {
  const notification = mockNotifications.find(n => n.id === parseInt(req.params.id));
  if (!notification) {
    return res.status(404).json({ message: 'Notification not found' });
  }
  res.json(notification);
});

// Mark notification as read
router.patch('/:id/read', (req, res) => {
  const notification = mockNotifications.find(n => n.id === parseInt(req.params.id));
  if (!notification) {
    return res.status(404).json({ message: 'Notification not found' });
  }
  // In a real app, you would update the read status in the database
  res.json({ message: 'Notification marked as read', notification });
});

export default router;