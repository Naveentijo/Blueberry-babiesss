'use strict';

const {
  createStudent, getStudentByEmail, upsertStudent,
} = require('../services/supabaseService');
const logger = require('../utils/logger');

/**
 * POST /api/students
 * Creates or updates a student profile (upsert by email).
 */
async function createStudentHandler(req, res, next) {
  try {
    const { name, email, phone, branch, semester, rollNo } = req.body;

    const student = await upsertStudent({ name, email, phone, branch, semester, rollNo });

    return res.status(201).json({ success: true, student });
  } catch (err) {
    // Duplicate email is handled by upsert, but catch other DB errors
    if (err.message?.includes('duplicate') || err.message?.includes('unique')) {
      return res.status(409).json({ success: false, error: 'A student with this email already exists' });
    }
    next(err);
  }
}

/**
 * GET /api/students/:email
 * Fetches a student profile by email address.
 */
async function getStudentHandler(req, res, next) {
  try {
    const email = decodeURIComponent(req.params.email);
    const student = await getStudentByEmail(email);

    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    return res.json({ success: true, student });
  } catch (err) {
    next(err);
  }
}

module.exports = { createStudentHandler, getStudentHandler };
