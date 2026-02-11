import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Admin routes for user management
router.get('/', authenticate, authorize('ADMIN'), async (req, res) => {
  res.json({ success: true, message: 'User management routes' });
});

export default router;
