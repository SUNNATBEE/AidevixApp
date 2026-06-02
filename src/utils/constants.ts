// Backend URL ikki qismdan iborat: host (EXPO_PUBLIC_API_URL) + prefix (EXPO_PUBLIC_API_PREFIX).
// Bu emulator/fizik qurilma/production o'rtasida URL'ni almashtirishni yengillashtiradi.
const RAW_BASE = process.env.EXPO_PUBLIC_API_URL || 'https://aidevix-backend-production.up.railway.app';
const RAW_PREFIX = process.env.EXPO_PUBLIC_API_PREFIX ?? '/api';

const BASE = RAW_BASE.replace(/\/+$/, '');
const PREFIX = RAW_PREFIX.startsWith('/') ? RAW_PREFIX : `/${RAW_PREFIX}`;

export const API_URL = `${BASE}${PREFIX}`;

export const TELEGRAM_CHANNEL = process.env.EXPO_PUBLIC_TELEGRAM_CHANNEL;
export const TELEGRAM_BOT = process.env.EXPO_PUBLIC_TELEGRAM_BOT;
export const INSTAGRAM_URL = process.env.EXPO_PUBLIC_INSTAGRAM_URL;

export const CATEGORIES = [
  'html', 'css', 'javascript', 'react', 'typescript', 'nodejs', 
  'general', 'ai', 'telegram', 'security', 'career', 'nocode', 'web3'
];

export const PROMPT_CATEGORIES = [
  'coding', 'debugging', 'vibe_coding', 'claude', 'cursor', 'copilot', 
  'architecture', 'refactoring', 'testing', 'documentation', 'other'
];

export const AI_TOOLS = [
  'Claude Code', 'Cursor', 'GitHub Copilot', 'ChatGPT', 'Gemini', 
  'Windsurf', 'Devin', 'Replit AI', 'Codeium', 'Other'
];

export const RANKS = {
  AMATEUR: 0,
  CANDIDATE: 500,
  JUNIOR: 2000,
  MIDDLE: 5000,
  SENIOR: 10000,
  MASTER: 20000,
  LEGEND: 50000
};
