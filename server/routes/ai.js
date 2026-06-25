'use strict';

const express = require('express');
const router = express.Router();
const { validateAI } = require('../middleware/validate');
const { aiHandler } = require('../controllers/aiController');

// POST /api/ai
// Body: { type: "summary"|"flashcards"|"quiz"|"studyplan"|"notice"|"studybuddy", text: string }
router.post('/', validateAI, aiHandler);

module.exports = router;
