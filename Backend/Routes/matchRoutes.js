import express from 'express';
import { 
  createMatchRequest,
  getAllMatchRequests,   
  getMatchRequestById    
} from '../Controllers/matchController.js';

const router = express.Router();


router.get('/', getAllMatchRequests);        
router.get('/:id', getMatchRequestById);     
router.post('/request', createMatchRequest);

export default router;