'use strict';

const express = require('express');
const router = express.Router();
const { validateTask } = require('../middleware/validate');
const {
  createTaskHandler,
  getTasksHandler,
  getTaskByIdHandler,
  updateTaskHandler,
  deleteTaskHandler,
} = require('../controllers/taskController');

// GET  /api/tasks          → list all tasks (optionally filter by ?studentId=)
router.get('/', getTasksHandler);

// GET  /api/tasks/:id      → get single task with automation logs
router.get('/:id', getTaskByIdHandler);

// POST /api/tasks          → create task → save to Supabase → trigger n8n
router.post('/', validateTask, createTaskHandler);

// PUT  /api/tasks/:id      → update task fields
router.put('/:id', updateTaskHandler);

// DELETE /api/tasks/:id    → delete task
router.delete('/:id', deleteTaskHandler);

module.exports = router;
