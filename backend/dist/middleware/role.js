"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireProjectRole = void 0;
const prisma_js_1 = __importDefault(require("../utils/prisma.js"));
const requireProjectRole = (requiredRole) => {
    return async (req, res, next) => {
        const userId = req.userId;
        const projectId = req.params['id'] || req.params['projectId'] || req.body?.projectId;
        if (!userId || !projectId) {
            res.status(400).json({ error: 'Missing user or project information' });
            return;
        }
        try {
            const member = await prisma_js_1.default.projectMember.findUnique({
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
        }
        catch {
            res.status(500).json({ error: 'Failed to verify project access' });
        }
    };
};
exports.requireProjectRole = requireProjectRole;
//# sourceMappingURL=role.js.map