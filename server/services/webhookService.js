'use strict';

const axios = require('axios');
const { logAutomation } = require('./supabaseService');
const logger = require('../utils/logger');

const TIMEOUT_MS = 10000; // 10 seconds

/**
 * Fires the n8n task automation webhook.
 * Includes full student + task payload.
 * Logs result to automation_logs regardless of outcome.
 *
 * @returns {{ success: boolean, data?: any, error?: string }}
 */
async function triggerTaskWebhook(task, student) {
  const webhookUrl = process.env.N8N_TASK_WEBHOOK;

  if (!webhookUrl || webhookUrl.includes('your-n8n-instance')) {
    logger.warn('N8N_TASK_WEBHOOK not configured. Skipping automation trigger.');
    await logAutomation({
      taskId: task.id,
      webhookType: 'task_created',
      status: 'failed',
      payload: null,
      response: { error: 'Webhook URL not configured' },
    });
    return { success: false, error: 'Webhook URL not configured' };
  }

  const payload = {
    // Student details
    studentName: student?.name || 'CampusFlow Student',
    studentEmail: student?.email || '',
    studentPhone: student?.phone || '',
    // Task details
    taskId: task.id,
    taskTitle: task.title,
    subject: task.subject,
    description: task.description || '',
    deadline: task.deadline,
    priority: task.priority,
    difficulty: task.difficulty,
    estimatedHours: task.estimated_hours,
    // Meta
    triggeredAt: new Date().toISOString(),
    source: 'campusflow-backend',
  };

  try {
    logger.info(`Triggering n8n task webhook for task: ${task.id}`);
    const response = await axios.post(webhookUrl, payload, {
      timeout: TIMEOUT_MS,
      headers: { 'Content-Type': 'application/json', 'X-Source': 'CampusFlow' },
    });

    await logAutomation({
      taskId: task.id,
      webhookType: 'task_created',
      status: 'success',
      payload,
      response: { status: response.status, data: response.data },
    });

    logger.info(`n8n webhook succeeded for task: ${task.id}`);
    return { success: true, data: response.data };
  } catch (err) {
    const errMsg = err.response?.data || err.message || 'Webhook request failed';
    logger.error(`n8n webhook failed for task ${task.id}: ${JSON.stringify(errMsg)}`);

    await logAutomation({
      taskId: task.id,
      webhookType: 'task_created',
      status: 'failed',
      payload,
      response: { error: errMsg, status: err.response?.status },
    });

    return { success: false, error: String(errMsg) };
  }
}

/**
 * Fires the n8n notice summarizer webhook.
 *
 * @returns {{ success: boolean, data?: any, error?: string }}
 */
async function triggerNoticeWebhook(noticeText, summary) {
  const webhookUrl = process.env.N8N_NOTICE_WEBHOOK;

  if (!webhookUrl || webhookUrl.includes('your-n8n-instance')) {
    logger.warn('N8N_NOTICE_WEBHOOK not configured. Skipping notice webhook.');
    return { success: false, error: 'Notice webhook URL not configured' };
  }

  const payload = {
    noticeText,
    summary,
    triggeredAt: new Date().toISOString(),
    source: 'campusflow-backend',
  };

  try {
    const response = await axios.post(webhookUrl, payload, {
      timeout: TIMEOUT_MS,
      headers: { 'Content-Type': 'application/json' },
    });
    logger.info('n8n notice webhook triggered successfully');
    return { success: true, data: response.data };
  } catch (err) {
    logger.error(`n8n notice webhook failed: ${err.message}`);
    return { success: false, error: err.message };
  }
}

module.exports = { triggerTaskWebhook, triggerNoticeWebhook };
