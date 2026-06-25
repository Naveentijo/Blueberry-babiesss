'use strict';

const groq = require('../config/groq');
const prompts = require('../utils/prompts');
const logger = require('../utils/logger');

const MODEL = 'llama3-70b-8192';
const MAX_TOKENS = 4096;

/**
 * Calls Groq API with the appropriate prompt for the given AI type.
 * Returns parsed JSON object.
 *
 * @param {string} type - One of: summary, flashcards, quiz, studyplan, notice, studybuddy
 * @param {string} text - The input text (lecture notes, notice, etc.)
 * @returns {Promise<object>} Parsed JSON response from Groq
 */
async function runAI(type, text) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    const err = new Error('GROQ_API_KEY is not configured. Add it to server/.env to enable AI features.');
    err.status = 503;
    throw err;
  }

  const promptFn = prompts[type];
  if (!promptFn) {
    const err = new Error(`Unknown AI type: "${type}"`);
    err.status = 400;
    throw err;
  }

  const { system, user } = promptFn(text.trim());

  logger.info(`Groq AI request — type: ${type}, text length: ${text.length}`);

  let rawContent;
  try {
    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      max_tokens: MAX_TOKENS,
      temperature: 0.4,
      response_format: { type: 'json_object' },
    });

    rawContent = completion.choices[0]?.message?.content;

    if (!rawContent) {
      throw new Error('Groq returned an empty response');
    }
  } catch (err) {
    // Groq API errors (network, auth, quota)
    if (err.status === 401) {
      const authErr = new Error('Invalid Groq API key. Check GROQ_API_KEY in server/.env');
      authErr.status = 503;
      throw authErr;
    }
    if (err.status === 429) {
      const rateErr = new Error('Groq rate limit reached. Please wait a moment and try again.');
      rateErr.status = 429;
      throw rateErr;
    }
    logger.error(`Groq API error: ${err.message}`);
    throw err;
  }

  // Parse JSON response
  try {
    const parsed = JSON.parse(rawContent);
    logger.info(`Groq AI success — type: ${type}`);
    return parsed;
  } catch {
    logger.error(`Groq returned invalid JSON: ${rawContent.substring(0, 200)}`);
    const parseErr = new Error('AI returned invalid JSON. Please try again.');
    parseErr.status = 502;
    throw parseErr;
  }
}

module.exports = { runAI };
