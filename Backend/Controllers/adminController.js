import User from '../Models/Users.js';
import Message from '../Models/Messages.js';
import MatchRequest from '../Models/MatchRequests.js';
import Notification from '../Models/Notifications.js';
import mongoose from 'mongoose';

// Admin login
export const adminLogin = async (req, res) => {
  const { username, password } = req.body;
  
  // Hardcoded admin credentials for now (use environment variables in production)
  if (username === 'admin' && password === 'penziadmin2024') {
    res.json({ 
      success: true, 
      message: 'Login successful',
      token: 'admin-token-placeholder' // Use JWT in production
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid admin credentials' 
    });
  }
};

// System health monitoring
export const getSystemHealth = async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    
    res.json({
      success: true,
      data: {
        database: dbStatus,
        uptime: Math.floor(uptime / 60) + ' minutes',
        memory: {
          heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
          heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB'
        },
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching system health',
      error: error.message 
    });
  }
};

// Platform statistics
export const getPlatformStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalMessages,
      totalMatches,
      todayRegistrations,
      activeToday
    ] = await Promise.all([
      User.countDocuments(),
      Message.countDocuments(),
      MatchRequest.countDocuments(),
      User.countDocuments({ 
        createdAt: { $gte: new Date().setHours(0,0,0,0) } 
      }),
      User.countDocuments({ 
        lastActive: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } 
      })
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalMessages, 
        totalMatches,
        todayRegistrations,
        activeToday,
        completionRate: Math.round((totalUsers / (totalUsers + todayRegistrations)) * 100)
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching statistics',
      error: error.message 
    });
  }
};

// User management
export const manageUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// View all SMS/messages
export const viewAllSMS = async (req, res) => {
  try {
    const messages = await Message.find()
      .populate('sender', 'name phone')
      .populate('receiver', 'name phone')
      .sort({ timestamp: -1 });
    
    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching messages',
      error: error.message
    });
  }
};

// View match analytics
export const viewMatchAnalytics = async (req, res) => {
  try {
    const matchRequests = await MatchRequest.find()
      .populate('sender', 'name phone')
      .populate('receiver', 'name phone')
      .sort({ createdAt: -1 });
    
    const successfulMatches = matchRequests.filter(match => match.status === 'accepted');
    
    res.json({
      success: true,
      data: {
        totalMatchRequests: matchRequests.length,
        successfulMatches: successfulMatches.length,
        successRate: matchRequests.length > 0 
          ? Math.round((successfulMatches.length / matchRequests.length) * 100) 
          : 0,
        matchRequests: matchRequests
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching match analytics',
      error: error.message
    });
  }
};

// System configuration
export const systemConfiguration = async (req, res) => {
  try {
    // This would typically update system settings in a database
    // For now, we'll just return a success message
    const { settings } = req.body;
    
    res.json({
      success: true,
      message: 'System configuration updated successfully',
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating system configuration',
      error: error.message
    });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

// Update user status
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User status updated successfully',
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user status',
      error: error.message
    });
  }
};




