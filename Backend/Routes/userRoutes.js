import express from 'express';
import { 
  deleteUser, 
  createUser, 
  updateUserDetails, 
  addSelfDescription,
  getAllUsers,       
  getUserById       
} from '../Controllers/userController.js';

const router = express.Router();

router.get('/', getAllUsers);           
router.get('/:id', getUserById);        
router.delete('/:id', deleteUser);
router.post('/register', createUser);
router.put('/details', updateUserDetails);
router.put('/description', addSelfDescription);

export default router;