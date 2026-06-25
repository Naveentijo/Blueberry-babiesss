'use strict';

const Groq = require('groq-sdk');
const logger = require('../utils/logger');

const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY || GROQ_API_KEY === 'your_groq_api_key_here') {
  logger.warn('GROQ_API_KEY not configured. AI endpoints will return an error until you add it to .env');
}

const groq = new Groq({ apiKey: GROQ_API_KEY || 'placeholder' });

module.exports = groq;
