export interface Instructor {
  _id: string;
  username?: string;
  email?: string;
  jobTitle?: string;
  position?: string;
  avatar?: string;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  instructor: string | Instructor;
  category: string;
  level: string;
  viewCount: number;
  studentsCount: number;
  rating: number;
  ratingCount: number;
  isFree: boolean;
  totalDuration: string;
}

export interface Video {
  _id: string;
  title: string;
  description: string;
  course: string;
  order: number;
  duration: string;
  thumbnail: string;
  bunnyVideoId: string;
  bunnyStatus: string;
  viewCount: number;
  sectionId?: string;
}

export interface Section {
  _id: string;
  title: string;
  courseId: string;
  videos: Video[];
}
