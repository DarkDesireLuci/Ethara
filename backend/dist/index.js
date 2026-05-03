"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_js_1 = __importDefault(require("./routes/auth.routes.js"));
const project_routes_js_1 = __importDefault(require("./routes/project.routes.js"));
const task_routes_js_1 = __importDefault(require("./routes/task.routes.js"));
const app = (0, express_1.default)();
const PORT = parseInt(process.env['PORT'] || '3000', 10);
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/auth', auth_routes_js_1.default);
app.use('/api/projects', project_routes_js_1.default);
app.use('/api/tasks', task_routes_js_1.default);
// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Global error handler
app.use((err, _req, res, _next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});
app.listen(PORT, () => {
    console.log(`🚀 Ethara backend running on http://localhost:${PORT}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map