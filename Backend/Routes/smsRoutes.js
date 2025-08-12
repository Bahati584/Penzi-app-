import express from 'express';
import { handleIncomingSMS } from '../Controllers/smsController.js';

const router = express.Router();

router.post('/', handleIncomingSMS);

export default router;
