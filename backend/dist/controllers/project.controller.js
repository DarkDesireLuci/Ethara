import prisma from '../utils/prisma.js';
export const createProject = async (req, res) => {
    try {
        const { name, description } = req.body;
        const userId = req.userId;
        if (!name) {
            res.status(400).json({ error: 'Project name is required' });
            return;
        }
        const project = await prisma.project.create({
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
export const getProjects = async (req, res) => {
    try {
        const userId = req.userId;
        const projects = await prisma.project.findMany({
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
export const getProject = async (req, res) => {
    try {
        const id = req.params['id'];
        const project = await prisma.project.findUnique({
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
export const updateProject = async (req, res) => {
    try {
        const id = req.params['id'];
        const { name, description } = req.body;
        const project = await prisma.project.update({
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
export const deleteProject = async (req, res) => {
    try {
        const id = req.params['id'];
        await prisma.project.delete({ where: { id } });
        res.json({ message: 'Project deleted successfully' });
    }
    catch {
        res.status(500).json({ error: 'Failed to delete project' });
    }
};
export const addMember = async (req, res) => {
    try {
        const id = req.params['id'];
        const { email, role } = req.body;
        if (!email) {
            res.status(400).json({ error: 'Member email is required' });
            return;
        }
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(404).json({ error: 'User not found with that email' });
            return;
        }
        const existing = await prisma.projectMember.findUnique({
            where: { projectId_userId: { projectId: id, userId: user.id } },
        });
        if (existing) {
            res.status(409).json({ error: 'User is already a member of this project' });
            return;
        }
        const member = await prisma.projectMember.create({
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
export const removeMember = async (req, res) => {
    try {
        const id = req.params['id'];
        const userId = req.params['userId'];
        await prisma.projectMember.delete({
            where: { projectId_userId: { projectId: id, userId: userId } },
        });
        res.json({ message: 'Member removed successfully' });
    }
    catch {
        res.status(500).json({ error: 'Failed to remove member' });
    }
};
//# sourceMappingURL=project.controller.js.map