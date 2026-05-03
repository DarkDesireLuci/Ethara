import { Router } from 'express';
import {
  createTask,
  getProjectTasks,
  getTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from '../controllers/task.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All task routes require authentication
router.use(authenticate);

router.post('/', createTask);
router.get('/project/:projectId', getProjectTasks);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/status', updateTaskStatus);

export default router;
