import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.js';
export declare const createTask: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getProjectTasks: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getTask: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateTask: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteTask: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateTaskStatus: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=task.controller.d.ts.map