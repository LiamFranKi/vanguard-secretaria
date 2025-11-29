import express from 'express';
import { askAssistant, draftEmail } from '../controllers/aiController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.post('/ask', askAssistant);
router.post('/draft-email', draftEmail);

export default router;

