import express from 'express';
import {
  getDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
  viewDocument,
  downloadDocument
} from '../controllers/documentController.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();
router.use(authenticate);

router.get('/', getDocuments);
// IMPORTANTE: Las rutas específicas deben ir ANTES de las rutas genéricas
router.get('/:id/view', viewDocument);
router.get('/:id/download', downloadDocument);
router.get('/:id', getDocument);
router.post('/', upload.single('file'), createDocument);
router.put('/:id', updateDocument);
router.delete('/:id', deleteDocument);

export default router;

