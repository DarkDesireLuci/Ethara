import prisma from '../utils/prisma.js';
export const createTask = async (req, res) => {
    try {
        const { title, description, dueDate, priority, projectId, assignedTo } = req.body;
        const userId = req.userId;
        if (!title || !projectId) {
            res.status(400).json({ error: 'Title and projectId are required' });
            return;
        }
        // Verify user is a member of the project
        const member = await prisma.projectMember.findUnique({
            where: { projectId_userId: { projectId, userId } },
        });
        if (!member) {
            res.status(403).json({ error: 'You are not a member of this project' });
            return;
        }
        const task = await prisma.task.create({
            data: {
                title,
                description: description || null,
                dueDate: dueDate ? new Date(dueDate) : null,
                priority: priority || 'Medium',
                projectId,
                assignedTo: assignedTo || null,
                createdBy: userId,
            },
            include: {
                assignee: { select: { id: true, name: true, email: true } },
                creator: { select: { id: true, name: true, email: true } },
            },
        });
        res.status(201).json({ task });
    }
    catch {
        res.status(500).json({ error: 'Failed to create task' });
    }
};
export const getProjectTasks = async (req, res) => {
    try {
        const projectId = req.params['projectId'];
        const { status, priority, assignedTo } = req.query;
        const where = { projectId };
        if (status)
            where['status'] = status;
        if (priority)
            where['priority'] = priority;
        if (assignedTo)
            where['assignedTo'] = assignedTo;
        const tasks = await prisma.task.findMany({
            where,
            include: {
                assignee: { select: { id: true, name: true, email: true } },
                creator: { select: { id: true, name: true, email: true } },
            },
            orderBy: [{ status: 'asc' }, { priority: 'desc' }, { createdAt: 'desc' }],
        });
        res.json({ tasks });
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};
export const getTask = async (req, res) => {
    try {
        const id = req.params['id'];
        const task = await prisma.task.findUnique({
            where: { id },
            include: {
                assignee: { select: { id: true, name: true, email: true } },
                creator: { select: { id: true, name: true, email: true } },
                project: { select: { id: true, name: true } },
            },
        });
        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        res.json({ task });
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch task' });
    }
};
export const updateTask = async (req, res) => {
    try {
        const id = req.params['id'];
        const { title, description, dueDate, priority, status, assignedTo } = req.body;
        const task = await prisma.task.update({
            where: { id },
            data: {
                ...(title !== undefined && { title }),
                ...(description !== undefined && { description }),
                ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
                ...(priority !== undefined && { priority }),
                ...(status !== undefined && { status }),
                ...(assignedTo !== undefined && { assignedTo: assignedTo || null }),
            },
            include: {
                assignee: { select: { id: true, name: true, email: true } },
                creator: { select: { id: true, name: true, email: true } },
            },
        });
        res.json({ task });
    }
    catch {
        res.status(500).json({ error: 'Failed to update task' });
    }
};
export const deleteTask = async (req, res) => {
    try {
        const id = req.params['id'];
        await prisma.task.delete({ where: { id } });
        res.json({ message: 'Task deleted successfully' });
    }
    catch {
        res.status(500).json({ error: 'Failed to delete task' });
    }
};
export const updateTaskStatus = async (req, res) => {
    try {
        const id = req.params['id'];
        const { status } = req.body;
        const validStatuses = ['To Do', 'In Progress', 'Done'];
        if (!status || !validStatuses.includes(status)) {
            res.status(400).json({ error: 'Valid status required: To Do, In Progress, or Done' });
            return;
        }
        const task = await prisma.task.update({
            where: { id },
            data: { status },
            include: {
                assignee: { select: { id: true, name: true, email: true } },
                creator: { select: { id: true, name: true, email: true } },
            },
        });
        res.json({ task });
    }
    catch {
        res.status(500).json({ error: 'Failed to update task status' });
    }
};
//# sourceMappingURL=task.controller.js.map