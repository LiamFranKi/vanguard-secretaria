import express from 'express';
import {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
  uploadContactAvatar,
  uploadContactAvatarHandler
} from '../controllers/contactController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/', getContacts);
router.get('/:id', getContact);
router.post('/', createContact);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);
router.post('/:id/upload-avatar', uploadContactAvatar, uploadContactAvatarHandler);

export default router;

