'use strict';

const LEVELS = { info: '✅', warn: '⚠️ ', error: '❌' };

function formatMsg(level, msg) {
  const ts = new Date().toISOString();
  return `[${ts}] ${LEVELS[level]} ${msg}`;
}

const logger = {
  info:  (msg) => console.log(formatMsg('info', msg)),
  warn:  (msg) => console.warn(formatMsg('warn', msg)),
  error: (msg) => console.error(formatMsg('error', msg)),
};

module.exports = logger;
