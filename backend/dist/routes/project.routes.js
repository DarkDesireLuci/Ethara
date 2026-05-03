"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_controller_js_1 = require("../controllers/project.controller.js");
const auth_js_1 = require("../middleware/auth.js");
const role_js_1 = require("../middleware/role.js");
const router = (0, express_1.Router)();
// All project routes require authentication
router.use(auth_js_1.authenticate);
router.post('/', project_controller_js_1.createProject);
router.get('/', project_controller_js_1.getProjects);
router.get('/:id', (0, role_js_1.requireProjectRole)('Member'), project_controller_js_1.getProject);
router.put('/:id', (0, role_js_1.requireProjectRole)('Admin'), project_controller_js_1.updateProject);
router.delete('/:id', (0, role_js_1.requireProjectRole)('Admin'), project_controller_js_1.deleteProject);
// Member management
router.post('/:id/members', (0, role_js_1.requireProjectRole)('Admin'), project_controller_js_1.addMember);
router.delete('/:id/members/:userId', (0, role_js_1.requireProjectRole)('Admin'), project_controller_js_1.removeMember);
exports.default = router;
//# sourceMappingURL=project.routes.js.map