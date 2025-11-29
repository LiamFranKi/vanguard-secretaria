import express from 'express';
import { subscribe, unsubscribe, getPublicKey } from '../controllers/pushController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);
router.get('/public-key', getPublicKey);

export default router;

