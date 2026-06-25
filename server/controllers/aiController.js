'use strict';

const { runAI } = require('../services/groqService');
const { triggerNoticeWebhook } = require('../services/webhookService');
const logger = require('../utils/logger');

/**
 * POST /api/ai
 * Unified AI endpoint.
 *
 * Body: { type: string, text: string }
 *
 * Supported types:
 *   summary     → summarize lecture notes / any text
 *   flashcards  → generate study flashcards
 *   quiz        → generate MCQ quiz
 *   studyplan   → generate day-by-day study plan
 *   notice      → extract info from college notice
 *   studybuddy  → full study buddy analysis (summary + flashcards + quiz + revision)
 */
async function aiHandler(req, res, next) {
  try {
    const { type, text } = req.body;

    logger.info(`AI request received — type: ${type}`);

    const result = await runAI(type, text);

    // For notice type: also trigger n8n webhook (fire-and-forget)
    if (type === 'notice') {
      triggerNoticeWebhook(text, result).catch((err) => {
        logger.warn(`Notice webhook fire-and-forget error: ${err.message}`);
      });
    }

    return res.json({
      success: true,
      type,
      result,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { aiHandler };
