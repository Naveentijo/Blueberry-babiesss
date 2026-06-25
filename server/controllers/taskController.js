'use strict';

const {
  createTask, getTasks, getTaskById, updateTask, deleteTask,
  getStudentByEmail, getAutomationLogs,
} = require('../services/supabaseService');
const { triggerTaskWebhook } = require('../services/webhookService');
const logger = require('../utils/logger');

/**
 * POST /api/tasks
 * Creates a task in Supabase, then triggers n8n webhook.
 */
async function createTaskHandler(req, res, next) {
  try {
    const {
      title, subject, description, deadline, priority, difficulty,
      estimatedHours, completionPercent, studyPlan, aiStats,
      studentId, studentEmail,
    } = req.body;

    // 1. Save task to Supabase
    const task = await createTask({
      studentId: studentId || null,
      title, subject, description, deadline, priority, difficulty,
      estimatedHours: estimatedHours || 4,
      completionPercent: completionPercent || 0,
      studyPlan: studyPlan || null,
      aiStats: aiStats || null,
    });

    // 2. Fetch student profile for webhook payload (if email provided)
    let student = null;
    if (studentEmail) {
      student = await getStudentByEmail(studentEmail).catch(() => null);
    }

    // 3. Trigger n8n webhook (non-blocking, errors are logged not thrown)
    const webhookResult = await triggerTaskWebhook(task, student);

    return res.status(201).json({
      success: true,
      task: normalizeTask(task),
      automation: webhookResult.success,
      automationError: webhookResult.success ? undefined : webhookResult.error,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/tasks
 * Returns all tasks, optionally filtered by studentId query param.
 */
async function getTasksHandler(req, res, next) {
  try {
    const { studentId } = req.query;
    const tasks = await getTasks(studentId || null);

    return res.json({
      success: true,
      count: tasks.length,
      tasks: tasks.map(normalizeTask),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/tasks/:id
 * Returns a single task with its automation logs.
 */
async function getTaskByIdHandler(req, res, next) {
  try {
    const task = await getTaskById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    const logs = await getAutomationLogs(task.id).catch(() => []);

    return res.json({
      success: true,
      task: normalizeTask(task),
      automationLogs: logs,
    });
  } catch (err) {
    if (err.message?.includes('PGRST116') || err.message?.includes('not found')) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    next(err);
  }
}

/**
 * PUT /api/tasks/:id
 * Partially updates a task.
 */
async function updateTaskHandler(req, res, next) {
  try {
    const task = await updateTask(req.params.id, req.body);
    return res.json({ success: true, task: normalizeTask(task) });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/tasks/:id
 * Deletes a task by ID.
 */
async function deleteTaskHandler(req, res, next) {
  try {
    await deleteTask(req.params.id);
    return res.json({ success: true, message: 'Task deleted successfully' });
  } catch (err) {
    next(err);
  }
}

/**
 * Normalize snake_case DB columns to camelCase for the frontend.
 */
function normalizeTask(task) {
  return {
    id: task.id,
    studentId: task.student_id,
    title: task.title,
    subject: task.subject,
    description: task.description,
    deadline: task.deadline,
    priority: task.priority,
    difficulty: task.difficulty,
    estimatedHours: task.estimated_hours,
    completionPercent: task.completion_percent,
    studyPlan: task.study_plan,
    aiStats: task.ai_stats,
    createdAt: task.created_at,
    updatedAt: task.updated_at,
    // Derived field for frontend compatibility
    daysLeft: task.deadline
      ? Math.max(0, Math.ceil((new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24)))
      : null,
  };
}

module.exports = {
  createTaskHandler,
  getTasksHandler,
  getTaskByIdHandler,
  updateTaskHandler,
  deleteTaskHandler,
};
