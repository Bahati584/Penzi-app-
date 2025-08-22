import express from 'express';
import { 
  createOrUpdateUserFromSMS,
  updateUserDetailsFromSMS,
  addDescriptionFromSMS,
  getMessages,
  getMessageById,
  deleteMessage,
  processSMSCommand
} from '../Controllers/smsController.js';

const router = express.Router();

// --- USER REGISTRATION FLOW VIA SMS ---
router.post('/register', createOrUpdateUserFromSMS);   
router.post('/details', updateUserDetailsFromSMS);     
router.post('/description', addDescriptionFromSMS); 
router.post('/command', processSMSCommand);          

// --- MESSAGE LOGGING / ADMIN ---
router.get('/messages', getMessages);                  
router.get('/messages/:id', getMessageById);           
router.delete('/messages/:id', deleteMessage);         

export default router;
