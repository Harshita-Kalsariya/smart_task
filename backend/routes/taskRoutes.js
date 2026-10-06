// routes/taskRoutes.js - Task CRUD endpoints (all protected)

const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// All task routes require a valid JWT
router.use(protect);

// GET  /api/tasks       - Get all tasks for logged-in user
router.get('/', getTasks);

// POST /api/tasks       - Create a new task
router.post('/', createTask);

// PUT  /api/tasks/:id   - Update a task by ID
router.put('/:id', updateTask);

// DELETE /api/tasks/:id - Delete a task by ID
router.delete('/:id', deleteTask);

module.exports = router;
