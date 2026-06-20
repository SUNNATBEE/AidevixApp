import Constants from 'expo-constants';

// Backend URL ikki qismdan iborat: host (EXPO_PUBLIC_API_URL) + prefix (EXPO_PUBLIC_API_PREFIX).
// Bu emulator/fizik qurilma/production o'rtasida URL'ni almashtirishni yengillashtiradi.
//
// AVTOMATIK IP: EXPO_PUBLIC_API_URL=auto bo'lsa (yoki bo'sh), dev rejimida Metro bundler
// host IP'sini olamiz va local backend portiga ulanamiz. Shunday qilib Wi-Fi/IP o'zgarsa
// ham `.env` ni qo'lda yangilash kerak bo'lmaydi — Metro IP'si = kompyuter LAN IP'si.

const PRODUCTION_URL = 'https://aidevix-backend-production.up.railway.app';
const LOCAL_PORT = process.env.EXPO_PUBLIC_API_PORT || '5000';

// Metro bundler host IP'sini Expo konfiguratsiyasidan ajratib oламиз.
// Format: "192.168.80.47:8081" → "192.168.80.47". SDK versiyalari bo'yicha bir
// nechta joyni tekshiramiz (eski Expo Go fallbacklari bilan).
const getDevHostIp = (): string | null => {
  const candidates = [
    Constants.expoConfig?.hostUri,
    (Constants as any).expoGoConfig?.debuggerHost,
    (Constants as any).manifest2?.extra?.expoGo?.debuggerHost,
    (Constants as any).manifest?.debuggerHost,
  ];
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.length > 0) {
      const host = candidate.split(':')[0];
      // localhost/127.0.0.1 ni rad etamiz — fizik telefon bunга ulana olmaydi.
      if (host && host !== 'localhost' && host !== '127.0.0.1') return host;
    }
  }
  return null;
};

const resolveBase = (): string => {
  const raw = process.env.EXPO_PUBLIC_API_URL?.trim();

  // To'liq URL berilgan (production yoki qo'lda override) — uni ishlatamiz.
  if (raw && raw !== 'auto') return raw;

  // auto/bo'sh: dev'da host IP'ni aniqlaymiz, topilmasa production'ga tushamiz.
  const ip = getDevHostIp();
  if (ip) return `http://${ip}:${LOCAL_PORT}`;
  return PRODUCTION_URL;
};

const RAW_PREFIX = process.env.EXPO_PUBLIC_API_PREFIX ?? '/api';

const BASE = resolveBase().replace(/\/+$/, '');
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
