#!/usr/bin/env node
/**
 * UserPromptSubmit hook for Aidevix project.
 * Analyzes prompt complexity and suggests a cheaper/cheaper model to save tokens.
 * Does NOT inject context into Claude (to avoid adding tokens itself).
 * Only shows a systemMessage to the user.
 */

const fs = require('fs');

let raw = '';
try {
  raw = fs.readFileSync(0, 'utf8');
} catch {
  process.exit(0);
}

let data;
try {
  data = JSON.parse(raw);
} catch {
  process.exit(0);
}

const prompt = ((data && data.prompt) || '').trim();
if (!prompt) process.exit(0);

const lower = prompt.toLowerCase();
const words = prompt.split(/\s+/).filter(Boolean).length;
const lines = (prompt.match(/\n/g) || []).length + 1;
const hasCodeBlock = /```[\s\S]+```/.test(prompt);
const hasFilePath = /[A-Za-z0-9_\-./\\]+\.(tsx?|jsx?|json|md|sh|yml|yaml)\b/.test(prompt);

const complexKw = /(architect|refactor|design|analyze|migrate|implement|security review|performance|across (?:the )?(?:code)?base|multiple files|review pr|database schema|ultrathink|roadmap|plan|full project|toliq|arxitektura|qayta yoz|loyihani to|audit|integrate)/i;
const simpleKw = /(\bwhat is\b|rename|typo|fix typo|translate|\bquick\b|\bsmall\b|\bsimple\b|bitta|bir qator|format|lint|explain briefly|nomlash|tarjima|\brang\b|\bimport\b|\bexport\b|package name|version)/i;

let level;
let message;

if (words <= 12 && !complexKw.test(prompt) && !hasCodeBlock && !hasFilePath) {
  level = 'haiku';
  message = '💡 Oddiy/sodda prompt aniqlandi — token tejash uchun `/model haiku` ishlating (keyin yana `/model opus` ga qaytasiz).';
} else if (simpleKw.test(prompt) && !complexKw.test(prompt) && words <= 30) {
  level = 'haiku';
  message = '💡 Kichik vazifa — `/model haiku` yoki `/fast` tavsiya etiladi.';
} else if (words >= 80 || lines >= 8 || complexKw.test(prompt) || (hasCodeBlock && hasFilePath)) {
  level = 'opus';
  message = '🧠 Murakkab vazifa — `/model opus[1m]` (1M context) ishlatgan ma\'qul.';
} else {
  level = 'sonnet';
  message = '⚖️ O\'rtacha murakkablik — `/model sonnet` (tez + arzonroq) yetadi.';
}

const output = {
  systemMessage: `[Model suggest: ${level}] ${message}`,
  hookSpecificOutput: {
    hookEventName: 'UserPromptSubmit',
    additionalContext: ''
  }
};

process.stdout.write(JSON.stringify(output));
process.exit(0);
