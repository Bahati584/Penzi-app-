import MatchRequest from '../Models/MatchRequests.js';
import User from '../Models/Users.js';  // 
import Notification from '../Models/Notifications.js';

// 1. Create a match request
export const createMatchRequest = async (req, res) => {
  try {
    const { ageRange, town } = req.body;

    if (!ageRange) {
      return res.status(400).json({ 
        success: false,
        message: 'ageRange is required' 
      });
    }

    // Save the request in DB
    const matchRequest = new MatchRequest({
      user: ageRange,
      town
    });
    await matchRequest.save();

    // Find potential matches
    const matches = await findMatches( ageRange, town);

    // Send notifications to matched users
    await sendMatchNotifications(matches);

    res.status(201).json({
      success: true,
      message: 'Match request created successfully',
      matchesFound: matches.length,
      matches: matches
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error creating match request',
      error: error.message 
    });
  }
};

// 2. Match finding logic
const findMatches = async (ageRange, town) => {
  const user = await User.findByAgeRange(ageRange);

  if (!user) throw new Error('User not found');

  return User.find({
     _age: { $gte: ageRange?.min || 18, $lte: ageRange?.max || 99 },
    town: town || user.town
   
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

// Get all match requests
export const getAllMatchRequests = async (req, res) => {
  try {
    const matchRequests = await MatchRequest.find()
      .populate('user', 'name age town') // Populate user details
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: matchRequests.length,
      matchRequests: matchRequests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching match requests',
      error: error.message
    });
  }
};

// Get match request by ID
export const getMatchRequestById = async (req, res) => {
  try {
    const matchRequest = await MatchRequest.findById(req.params.id)
      .populate('user', 'name age town');
    
    if (!matchRequest) {
      return res.status(404).json({
        success: false,
        message: 'Match request not found'
      });
    }
    
    res.status(200).json({
      success: true,
      matchRequest: matchRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching match request',
      error: error.message
    });
  }
};
