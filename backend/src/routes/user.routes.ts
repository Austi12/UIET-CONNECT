import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Admin routes for user management
router.get('/', authenticate, authorize('ADMIN'), userController.getAllUsers);
router.patch('/:id/approve', authenticate, authorize('ADMIN'), userController.approveUser);
router.patch('/:id/status', authenticate, authorize('ADMIN'), userController.toggleUserStatus);

export default router;
