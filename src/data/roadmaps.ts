import { Ionicons } from '@expo/vector-icons';

// Roadmap = statik o'quv yo'li. Backendда yo'q — mavjud kurs `category`'lariga
// bog'lanadi. Har bosqich bitta kategoriyani bildiradi.
export type ColorKey = 'primary' | 'secondary' | 'accent' | 'success';

export interface RoadmapStep {
  category: string; // Course.category enum qiymati
  label: string;
}

export interface Roadmap {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: ColorKey;
  steps: RoadmapStep[];
}

// MUHIM: kategoriyalar Course modeli enum'iga mos bo'lishi shart
// (html/css/javascript/react/typescript/nodejs/general/ai/telegram/security/career/nocode/web3).
// "Python" katalogда yo'q — mavjudlariga moslandi.
export const ROADMAPS: Roadmap[] = [
  {
    id: 'frontend',
    title: 'Frontend Dasturchi',
    subtitle: 'Veb interfeyslar yaratish',
    icon: 'color-palette',
    color: 'primary',
    steps: [
      { category: 'html', label: 'HTML' },
      { category: 'css', label: 'CSS' },
      { category: 'javascript', label: 'JavaScript' },
      { category: 'react', label: 'React' },
      { category: 'typescript', label: 'TypeScript' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend Dasturchi',
    subtitle: 'Server va API qurish',
    icon: 'server',
    color: 'secondary',
    steps: [
      { category: 'javascript', label: 'JavaScript' },
      { category: 'nodejs', label: 'Node.js' },
      { category: 'security', label: 'Xavfsizlik' },
    ],
  },
  {
    id: 'ai',
    title: 'AI Muhandis',
    subtitle: 'Sun\'iy intellekt asoslari',
    icon: 'sparkles',
    color: 'accent',
    steps: [
      { category: 'general', label: 'Umumiy asoslar' },
      { category: 'javascript', label: 'JavaScript' },
      { category: 'ai', label: 'AI' },
    ],
  },
  {
    id: 'web3-nocode',
    title: 'Web3 & No-Code',
    subtitle: 'Zamonaviy yo\'nalishlar',
    icon: 'cube',
    color: 'success',
    steps: [
      { category: 'nocode', label: 'No-Code' },
      { category: 'web3', label: 'Web3' },
      { category: 'telegram', label: 'Telegram' },
    ],
  },
];

export const getRoadmapById = (id: string): Roadmap | undefined =>
  ROADMAPS.find((r) => r.id === id);

// --- Progress hisoblash ---
export interface CategoryStat {
  total: number;
  completed: number;
  started: number;
}

export type StatsByCategory = Record<string, CategoryStat>;

// Bitta bosqich (kategoriya) progressi foizda: tugatilgan / jami kurs.
export const stepPercent = (stats: StatsByCategory, category: string): number => {
  const s = stats[category];
  if (!s || s.total === 0) return 0;
  return Math.round((s.completed / s.total) * 100);
};

// Butun roadmap progressi = bosqichlar foizining o'rtachasi.
export const roadmapProgress = (
  roadmap: Roadmap,
  stats: StatsByCategory,
): { percent: number; doneSteps: number; totalSteps: number } => {
  const totalSteps = roadmap.steps.length;
  if (totalSteps === 0) return { percent: 0, doneSteps: 0, totalSteps: 0 };
  let sum = 0;
  let doneSteps = 0;
  for (const step of roadmap.steps) {
    const p = stepPercent(stats, step.category);
    sum += p;
    if (p >= 100) doneSteps++;
  }
  return { percent: Math.round(sum / totalSteps), doneSteps, totalSteps };
};
