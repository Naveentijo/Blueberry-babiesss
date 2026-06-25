'use strict';

const express = require('express');
const router = express.Router();
const { validateStudent } = require('../middleware/validate');
const { createStudentHandler, getStudentHandler } = require('../controllers/studentController');

// POST /api/students          → create or upsert student profile
router.post('/', validateStudent, createStudentHandler);

// GET  /api/students/:email   → get student by email
router.get('/:email', getStudentHandler);

module.exports = router;
