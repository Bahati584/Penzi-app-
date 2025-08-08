// routes/messagingRoutes.js
import express from 'express';
import { sendMessage, getMessagesForUser } from '../Controllers/messagingController.js';

const router = express.Router();

router.post('/send', sendMessage);

// GET /messages/user/:userId
router.get('/user/:userId', getMessagesForUser);

export default router;
