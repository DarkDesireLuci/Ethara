import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './auth.js';
export declare const requireProjectRole: (requiredRole: "Admin" | "Member") => (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=role.d.ts.map