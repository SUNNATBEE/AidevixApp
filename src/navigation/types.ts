export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  VerifyEmail: { email: string; password?: string };
  ForgotPassword: { email?: string };
  ResetPassword: { email: string; code: string };
};

export type MainTabParamList = {
  HomeStack: undefined;
  CoursesStack: undefined;
  AIChat: undefined;
  Leaderboard: undefined;
  ProfileStack: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  Playground: undefined;
  Shorts: undefined;
  Founders: undefined;
};

export type CourseStackParamList = {
  Courses: undefined;
  CourseDetail: { courseId: string };
  VideoPlayer: { videoId: string; courseId: string };
};

export type ProfileStackParamList = {
  Profile: undefined;
  MyCourses: undefined;
  Settings: undefined;
  EditProfile: undefined;
  Certificates: undefined;
  Follow: { tab?: 'followers' | 'following' };
  Referrals: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Subscription: undefined;
  DailyChallenge: undefined;
};
