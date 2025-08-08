import User from '../models/User.js';
import Notification from '../models/notification.js';

export const handleIncomingSMS = async (req, res) => {
  try {
    const { text, from, to } = req.body; // to = recipient (in app mode)
    const message = text.trim();
    console.log(`📩 SMS received from ${from}: ${message}`);

    // Step 1: Check for entry keyword
    if (message.toUpperCase() === 'PENZI') {
      let user = await User.findOne({ phoneNumber: from });

      if (!user) {
        user = new User({ phoneNumber: from });
        await user.save();
        return res.status(200).send('Welcome to LoveMatch! Reply with your name to get started.');
      }
      return res.status(200).send('Welcome back! Continue from where you left off.');
    }

    // Step 2: Recursion logic based on profile completion
    const user = await User.findOne({ phoneNumber: from });

    if (!user) {
      return res.status(200).send('Please start by texting PENZI to join LoveMatch.');
    }

    if (!user.name) {
      user.name = message;
      await user.save();
      return res.status(200).send(`Hi ${user.name}! How old are you?`);
    }

    if (!user.age) {
      const ageNum = parseInt(message, 10);
      if (isNaN(ageNum)) {
        return res.status(200).send('Please enter a valid age.');
      }
      user.age = ageNum;
      await user.save();
      return res.status(200).send('Great! What are you looking for in a match?');
    }

    if (!user.preference) {
      user.preference = message;
      await user.save();
      return res.status(200).send('Thanks! We will start finding matches for you.');
    }

    // Step 3: Messaging after profile completion
    const chatMessage = new Notification({
      toPhone: to,               // recipient's phone in app mode
      message: message,
      type: 'reply',              // keep your enum usage consistent
      createdAt: new Date()
    });

    await chatMessage.save();

    return res.status(200).send(`Message sent to ${to}`);

  } catch (error) {
    console.error('Error handling SMS:', error);
    res.status(500).send('Something went wrong.');
  }
};

