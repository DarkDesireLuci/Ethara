"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_controller_js_1 = require("../controllers/task.controller.js");
const auth_js_1 = require("../middleware/auth.js");
const router = (0, express_1.Router)();
// All task routes require authentication
router.use(auth_js_1.authenticate);
router.post('/', task_controller_js_1.createTask);
router.get('/project/:projectId', task_controller_js_1.getProjectTasks);
router.get('/:id', task_controller_js_1.getTask);
router.put('/:id', task_controller_js_1.updateTask);
router.delete('/:id', task_controller_js_1.deleteTask);
router.patch('/:id/status', task_controller_js_1.updateTaskStatus);
exports.default = router;
//# sourceMappingURL=task.routes.js.map