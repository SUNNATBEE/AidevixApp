// Backend Quiz kontrakti — xpController.js / Quiz.js bilan mos.
// MUHIM: correctAnswer client'ga HECH QACHON kelmaydi
// (backend `.select('-questions.correctAnswer')` qiladi).

export interface QuizQuestion {
  _id: string;
  question: string;
  options: string[];
  xpReward?: number;
}

export interface Quiz {
  _id: string;
  videoId: string;
  courseId: string;
  title: string;
  passingScore: number; // foiz, default 70
  isActive: boolean;
  questions: QuizQuestion[];
}

// GET /xp/quiz/video/:videoId → data
export interface QuizFetch {
  quiz: Quiz;
  alreadySolved: boolean;
  previousScore: number | null;
}

// POST /xp/quiz/:quizId body
export interface QuizAnswer {
  questionIndex: number;
  selectedOption: number;
}

export interface QuizResultAnswer {
  questionIndex: number;
  selectedOption: number;
  isCorrect: boolean;
}

// POST /xp/quiz/:quizId → data
export interface QuizSubmitResult {
  score: number;
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
  xpEarned: number;
  totalXp: number;
  level: string;
  levelProgress?: number;
  answers: QuizResultAnswer[];
}
