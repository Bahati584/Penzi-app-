import express from 'express';
import { createMatchRequest } from '../Controllers/matchController.js';

const router = express.Router();

router.post('/request', createMatchRequest);

export default router;
