import express from 'express';
import { 
  adminLogin,
  getSystemHealth,
  getPlatformStats,
  manageUsers,
  viewAllSMS,
  viewMatchAnalytics,
  systemConfiguration,
  deleteUser,
  updateUserStatus,
} from '../Controllers/adminController.js';

const router = express.Router();

// Admin authentication
router.post('/login', adminLogin);

// Admin dashboard endpoints
router.get('/health', getSystemHealth);
router.get('/stats', getPlatformStats);
router.get('/users', manageUsers);
router.get('/sms', viewAllSMS);
router.get('/analytics', viewMatchAnalytics);
router.put('/config', systemConfiguration);

// Admin user management
router.delete('/users/:id', deleteUser);
router.put('/users/:id/status', updateUserStatus);

export default router;