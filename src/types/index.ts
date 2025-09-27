export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'student' | 'instructor';
  avatar_url?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor_id: string;
  instructor?: User;
  thumbnail_url?: string;
  price?: number;
  duration_hours?: number;
  difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced';
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  course?: Course;
  enrolled_at: string;
  progress_percentage: number;
  completed_at?: string;
  certificate_issued: boolean;
}

export interface Assignment {
  id: string;
  course_id: string;
  title: string;
  description: string;
  due_date?: string;
  max_points: number;
  created_at: string;
}

export interface Submission {
  id: string;
  assignment_id: string;
  assignment?: Assignment;
  student_id: string;
  student?: User;
  content: string;
  file_url?: string;
  submitted_at: string;
  grade?: number;
  feedback?: string;
  graded_at?: string;
}

export interface Discussion {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  created_by: string;
  creator?: User;
  created_at: string;
  posts_count?: number;
}

export interface DiscussionPost {
  id: string;
  discussion_id: string;
  user_id: string;
  user?: User;
  content: string;
  parent_id?: string;
  created_at: string;
  replies?: DiscussionPost[];
}