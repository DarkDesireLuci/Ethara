"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_js_1 = __importDefault(require("../utils/prisma.js"));
const JWT_SECRET = process.env['JWT_SECRET'] || 'fallback-secret';
function generateToken(userId) {
    return jsonwebtoken_1.default.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ error: 'Name, email, and password are required' });
            return;
        }
        const existingUser = await prisma_js_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(409).json({ error: 'Email already registered' });
            return;
        }
        const passwordHash = await bcrypt_1.default.hash(password, 12);
        const user = await prisma_js_1.default.user.create({
            data: { name, email, passwordHash },
            select: { id: true, name: true, email: true, roleDefault: true, createdAt: true },
        });
        const token = generateToken(user.id);
        res.status(201).json({ user, token });
    }
    catch {
        res.status(500).json({ error: 'Registration failed' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }
        const user = await prisma_js_1.default.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const valid = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!valid) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const token = generateToken(user.id);
        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                roleDefault: user.roleDefault,
                createdAt: user.createdAt,
            },
            token,
        });
    }
    catch {
        res.status(500).json({ error: 'Login failed' });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        const user = await prisma_js_1.default.user.findUnique({
            where: { id: req.userId },
            select: { id: true, name: true, email: true, roleDefault: true, createdAt: true },
        });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json({ user });
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};
exports.getMe = getMe;
//# sourceMappingURL=auth.controller.js.map