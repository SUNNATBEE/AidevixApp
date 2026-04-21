export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  xp: number;
  streak: number;
  rankTitle: string;
  aiStack: string[];
  role: 'user' | 'admin';
  socialSubscriptions: {
    telegram: { subscribed: boolean; username?: string };
    instagram: { subscribed: boolean; username?: string };
  };
  referralCode: string;
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  badges: Array<{
    name: string;
    icon: string;
    earnedAt: string;
  }>;
  bio?: string;
  skills: string[];
  videosWatched: number;
  quizzesCompleted: number;
  weeklyXp: number;
  streakFreezeCount: number;
}
