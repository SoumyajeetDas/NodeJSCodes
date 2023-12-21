import express from 'express';
import { requireUser } from '../middleware/requireUser';
import { createSessionHandler, inValidSessionHandler } from '../controllers/sessionController';
import { signup } from '../controllers/userController';
import { deserailzeUser } from '../middleware/deserailizeUser';


const router = express.Router();

router.use(express.json());


router.post('/signUp', signup);


// Login
router.post('/session', createSessionHandler);


// Logout 
router.post('/logout', deserailzeUser, inValidSessionHandler);

export default router;