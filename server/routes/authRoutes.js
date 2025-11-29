import express from 'express';
import { register, login, getCurrentUser } from '../controllers/authController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Solo admin puede registrar usuarios
router.post('/register', authenticate, requireRole('ADMIN'), register);
router.post('/login', login);
router.get('/me', authenticate, getCurrentUser);

export default router;

