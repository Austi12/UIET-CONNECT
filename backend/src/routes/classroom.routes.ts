import { Router } from 'express';
import * as classroomController from '../controllers/classroom.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Public/authenticated routes
router.get('/', authenticate, classroomController.getAllClassrooms);
router.get('/stats', authenticate, classroomController.getClassroomStats);
router.get('/:id', authenticate, classroomController.getClassroomById);

// Admin only routes
router.post('/', 
  authenticate, 
  authorize('ADMIN'), 
  classroomController.createClassroom
);

router.put('/:id', 
  authenticate, 
  authorize('ADMIN'), 
  classroomController.updateClassroom
);

router.delete('/:id', 
  authenticate, 
  authorize('ADMIN'), 
  classroomController.deleteClassroom
);

// Admin and Teacher routes
router.patch('/:id/status', 
  authenticate, 
  authorize('ADMIN', 'TEACHER'), 
  classroomController.updateClassroomStatus
);

export default router;
