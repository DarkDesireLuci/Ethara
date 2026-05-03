import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './auth.js';
import prisma from '../utils/prisma.js';

export const requireProjectRole = (requiredRole: 'Admin' | 'Member') => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.userId;
    const projectId = req.params['id'] || req.params['projectId'] || req.body?.projectId;

    if (!userId || !projectId) {
      res.status(400).json({ error: 'Missing user or project information' });
      return;
    }

    try {
      const member = await prisma.projectMember.findUnique({
        where: {
          projectId_userId: { projectId, userId },
        },
      });

      if (!member) {
        res.status(403).json({ error: 'You are not a member of this project' });
        return;
      }

      if (requiredRole === 'Admin' && member.role !== 'Admin') {
        res.status(403).json({ error: 'Admin access required' });
        return;
      }

      next();
    } catch {
      res.status(500).json({ error: 'Failed to verify project access' });
    }
  };
};
