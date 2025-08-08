// controllers/messagingController.js
import Notification from '../Models/notifications.js';
import User from '../Models/Users.js';

// Send message (already added above)
export const sendMessage = async (req, res) => {
  try {
    const { fromUserId, toUserId, message, type } = req.body;

    const recipient = await User.findById(toUserId);
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    const notification = new Notification({
      toPhone: recipient.phone,
      message,
      type: type || 'reply'
    });

    await notification.save();

    res.status(201).json({
      success: true,
      message: 'Message sent and logged',
      data: notification
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all messages for a user
export const getMessagesForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user to get their phone number
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find all messages sent TO this user's phone
    const messages = await Notification.find({ toPhone: user.phone }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
