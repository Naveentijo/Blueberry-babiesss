'use strict';

/**
 * Request body validators.
 * Each validator returns an array of error strings.
 * Call next() if valid, return 400 if not.
 */

function validateTask(req, res, next) {
  const errors = [];
  const { title, subject, deadline } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length < 2) {
    errors.push('title is required and must be at least 2 characters');
  }
  if (!subject || typeof subject !== 'string' || subject.trim().length < 1) {
    errors.push('subject is required');
  }
  if (!deadline) {
    errors.push('deadline is required');
  } else {
    const d = new Date(deadline);
    if (isNaN(d.getTime())) errors.push('deadline must be a valid date');
  }

  const priority = req.body.priority;
  if (priority && !['low', 'medium', 'high', 'critical'].includes(priority)) {
    errors.push('priority must be one of: low, medium, high, critical');
  }

  const difficulty = req.body.difficulty;
  if (difficulty && !['easy', 'medium', 'hard'].includes(difficulty)) {
    errors.push('difficulty must be one of: easy, medium, hard');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
}

function validateAI(req, res, next) {
  const errors = [];
  const { type, text } = req.body;

  const VALID_TYPES = ['summary', 'flashcards', 'quiz', 'studyplan', 'notice', 'studybuddy'];
  if (!type || !VALID_TYPES.includes(type)) {
    errors.push(`type is required and must be one of: ${VALID_TYPES.join(', ')}`);
  }
  if (!text || typeof text !== 'string' || text.trim().length < 10) {
    errors.push('text is required and must be at least 10 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
}

function validateStudent(req, res, next) {
  const errors = [];
  const { name, email } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('name is required and must be at least 2 characters');
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('a valid email is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
}

module.exports = { validateTask, validateAI, validateStudent };
