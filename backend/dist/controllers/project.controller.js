"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeMember = exports.addMember = exports.deleteProject = exports.updateProject = exports.getProject = exports.getProjects = exports.createProject = void 0;
const prisma_js_1 = __importDefault(require("../utils/prisma.js"));
const createProject = async (req, res) => {
    try {
        const { name, description } = req.body;
        const userId = req.userId;
        if (!name) {
            res.status(400).json({ error: 'Project name is required' });
            return;
        }
        const project = await prisma_js_1.default.project.create({
            data: {
                name,
                description: description || null,
                createdBy: userId,
                members: {
                    create: { userId, role: 'Admin' },
                },
            },
            include: {
                members: { include: { user: { select: { id: true, name: true, email: true } } } },
                _count: { select: { tasks: true } },
            },
        });
        res.status(201).json({ project });
    }
    catch {
        res.status(500).json({ error: 'Failed to create project' });
    }
};
exports.createProject = createProject;
const getProjects = async (req, res) => {
    try {
        const userId = req.userId;
        const projects = await prisma_js_1.default.project.findMany({
            where: {
                members: { some: { userId } },
            },
            include: {
                members: { include: { user: { select: { id: true, name: true, email: true } } } },
                _count: { select: { tasks: true } },
            },
            orderBy: { updatedAt: 'desc' },
        });
        res.json({ projects });
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
};
exports.getProjects = getProjects;
const getProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await prisma_js_1.default.project.findUnique({
            where: { id },
            include: {
                creator: { select: { id: true, name: true, email: true } },
                members: {
                    include: { user: { select: { id: true, name: true, email: true } } },
                    orderBy: { joinedAt: 'asc' },
                },
                _count: { select: { tasks: true } },
            },
        });
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        res.json({ project });
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch project' });
    }
};
exports.getProject = getProject;
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const project = await prisma_js_1.default.project.update({
            where: { id },
            data: {
                ...(name !== undefined && { name }),
                ...(description !== undefined && { description }),
            },
            include: {
                members: { include: { user: { select: { id: true, name: true, email: true } } } },
                _count: { select: { tasks: true } },
            },
        });
        res.json({ project });
    }
    catch {
        res.status(500).json({ error: 'Failed to update project' });
    }
};
exports.updateProject = updateProject;
const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_js_1.default.project.delete({ where: { id } });
        res.json({ message: 'Project deleted successfully' });
    }
    catch {
        res.status(500).json({ error: 'Failed to delete project' });
    }
};
exports.deleteProject = deleteProject;
const addMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, role } = req.body;
        if (!email) {
            res.status(400).json({ error: 'Member email is required' });
            return;
        }
        const user = await prisma_js_1.default.user.findUnique({ where: { email } });
        if (!user) {
            res.status(404).json({ error: 'User not found with that email' });
            return;
        }
        const existing = await prisma_js_1.default.projectMember.findUnique({
            where: { projectId_userId: { projectId: id, userId: user.id } },
        });
        if (existing) {
            res.status(409).json({ error: 'User is already a member of this project' });
            return;
        }
        const member = await prisma_js_1.default.projectMember.create({
            data: {
                projectId: id,
                userId: user.id,
                role: role || 'Member',
            },
            include: { user: { select: { id: true, name: true, email: true } } },
        });
        res.status(201).json({ member });
    }
    catch {
        res.status(500).json({ error: 'Failed to add member' });
    }
};
exports.addMember = addMember;
const removeMember = async (req, res) => {
    try {
        const { id, userId } = req.params;
        await prisma_js_1.default.projectMember.delete({
            where: { projectId_userId: { projectId: id, userId: userId } },
        });
        res.json({ message: 'Member removed successfully' });
    }
    catch {
        res.status(500).json({ error: 'Failed to remove member' });
    }
};
exports.removeMember = removeMember;
//# sourceMappingURL=project.controller.js.map