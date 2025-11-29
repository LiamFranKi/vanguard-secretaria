import express from 'express';
import { 
  getProfile, 
  updateProfile, 
  uploadAvatar, 
  uploadAvatarHandler 
} from '../controllers/profileController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación (cualquier usuario autenticado)
router.use(authenticate);

router.get('/', getProfile);
router.put('/', updateProfile);
router.post('/upload-avatar', uploadAvatar, uploadAvatarHandler);

export default router;

