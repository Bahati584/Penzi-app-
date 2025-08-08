import express from 'express';
import { handleIncomingSMS } from '../controllers/smsController.js';

const router = express.Router();

router.post('/incoming-sms', handleIncomingSMS);

export default router;
