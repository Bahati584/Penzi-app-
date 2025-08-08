import MatchRequest from '../Models/MatchRequests.js';
import User from '../Models/Users.js';
import Notification from '../Models/notifications.js';

// 1. Create a match request
export const createMatchRequest = async (req, res) => {
  try {
    const { userId, ageRange, town } = req.body;

    // Save the request in DB
    const matchRequest = new MatchRequest({
      user: userId,
      ageRange,
      town
    });
    await matchRequest.save();

    // Find potential matches
    const matches = await findMatches(userId, ageRange, town);

    // Send notifications to matched users
    await sendMatchNotifications(userId, matches);

    res.status(201).json({
      message: 'Match request created successfully',
      matchesFound: matches.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Match finding logic
const findMatches = async (userId, ageRange, town) => {
  const user = await User.findById(userId);

  if (!user) throw new Error('User not found');

  return User.find({
    _id: { $ne: userId }, // exclude current user
    town: town || user.town,
    age: { $gte: ageRange.min, $lte: ageRange.max }
  });
};

// 3. Notification logging logic
const sendMatchNotifications = async (requesterId, matches) => {
  const requester = await User.findById(requesterId);

  const notifications = matches.map(matchUser => ({
    toPhone: matchUser.phone,
    message: `You have a new match request from ${requester.name}`,
    type: 'match_info'
  }));

  await Notification.insertMany(notifications);
};
