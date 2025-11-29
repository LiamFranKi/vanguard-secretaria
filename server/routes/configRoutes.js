import express from 'express';
import { 
  getConfig, 
  updateConfig, 
  uploadLogo, 
  uploadFavicon,
  uploadIcon192,
  uploadIcon512,
  uploadAppleTouchIcon,
  uploadLogoHandler,
  uploadFaviconHandler,
  uploadIcon192Handler,
  uploadIcon512Handler,
  uploadAppleTouchIconHandler
} from '../controllers/configController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Obtener configuración (público, para el frontend)
router.get('/', getConfig);

// Actualizar configuración (solo admin)
router.put('/', authenticate, requireRole('ADMIN'), updateConfig);

// Subir logo (solo admin)
router.post('/upload/logo', authenticate, requireRole('ADMIN'), uploadLogo, uploadLogoHandler);

// Subir favicon (solo admin)
router.post('/upload/favicon', authenticate, requireRole('ADMIN'), uploadFavicon, uploadFaviconHandler);

// Subir iconos PWA (solo admin)
router.post('/upload/icon-192', authenticate, requireRole('ADMIN'), uploadIcon192, uploadIcon192Handler);
router.post('/upload/icon-512', authenticate, requireRole('ADMIN'), uploadIcon512, uploadIcon512Handler);
router.post('/upload/apple-touch-icon', authenticate, requireRole('ADMIN'), uploadAppleTouchIcon, uploadAppleTouchIconHandler);

export default router;

