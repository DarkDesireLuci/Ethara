"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskStatus = exports.deleteTask = exports.updateTask = exports.getTask = exports.getProjectTasks = exports.createTask = void 0;
const prisma_js_1 = __importDefault(require("../utils/prisma.js"));
const createTask = async (req, res) => {
    try {
        const { title, description, dueDate, priority, projectId, assignedTo } = req.body;
        const userId = req.userId;
        if (!title || !projectId) {
            res.status(400).json({ error: 'Title and projectId are required' });
            return;
        }
        // Verify user is a member of the project
        const member = await prisma_js_1.default.projectMember.findUnique({
            where: { projectId_userId: { projectId, userId } },
        });
        if (!member) {
            res.status(403).json({ error: 'You are not a member of this project' });
            return;
        }
        const task = await prisma_js_1.default.task.create({
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
exports.createTask = createTask;
const getProjectTasks = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { status, priority, assignedTo } = req.query;
        const where = { projectId };
        if (status)
            where['status'] = status;
        if (priority)
            where['priority'] = priority;
        if (assignedTo)
            where['assignedTo'] = assignedTo;
        const tasks = await prisma_js_1.default.task.findMany({
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
exports.getProjectTasks = getProjectTasks;
const getTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await prisma_js_1.default.task.findUnique({
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
exports.getTask = getTask;
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, dueDate, priority, status, assignedTo } = req.body;
        const task = await prisma_js_1.default.task.update({
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
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_js_1.default.task.delete({ where: { id } });
        res.json({ message: 'Task deleted successfully' });
    }
    catch {
        res.status(500).json({ error: 'Failed to delete task' });
    }
};
exports.deleteTask = deleteTask;
const updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const validStatuses = ['To Do', 'In Progress', 'Done'];
        if (!status || !validStatuses.includes(status)) {
            res.status(400).json({ error: 'Valid status required: To Do, In Progress, or Done' });
            return;
        }
        const task = await prisma_js_1.default.task.update({
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
exports.updateTaskStatus = updateTaskStatus;
//# sourceMappingURL=task.controller.js.map