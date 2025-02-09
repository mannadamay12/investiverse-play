export interface ApiLesson {
  id: string;
  title: string;
  shortDescription: string;
  xp: number;
  status: 'completed' | 'inProgress' | 'available' | 'locked';
  locked: boolean;
}

export interface ApiCategory {
  id: string;
  title: string;
  description: string;
  lessons: ApiLesson[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  locked: boolean;
  xp: number;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface LessonContent {
  title: string;
  content: string;
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
  };
}
