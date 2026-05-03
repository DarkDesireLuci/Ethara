import { Router } from 'express';
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} from '../controllers/project.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requireProjectRole } from '../middleware/role.js';

const router = Router();

// All project routes require authentication
router.use(authenticate);

router.post('/', createProject);
router.get('/', getProjects);
router.get('/:id', requireProjectRole('Member'), getProject);
router.put('/:id', requireProjectRole('Admin'), updateProject);
router.delete('/:id', requireProjectRole('Admin'), deleteProject);

// Member management
router.post('/:id/members', requireProjectRole('Admin'), addMember);
router.delete('/:id/members/:userId', requireProjectRole('Admin'), removeMember);

export default router;
