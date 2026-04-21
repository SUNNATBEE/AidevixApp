export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: { email?: string };
  ResetPassword: { email: string; code: string };
};

export type MainTabParamList = {
  HomeStack: undefined;
  CoursesStack: undefined;
  AIChat: undefined;
  PromptsStack: undefined;
  Leaderboard: undefined;
  ProfileStack: undefined;
};

export type CourseStackParamList = {
  Courses: undefined;
  CourseDetail: { courseId: string };
  VideoPlayer: { videoId: string; courseId: string };
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Subscription: undefined;
  DailyChallenge: undefined;
};
