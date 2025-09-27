/*
  # Learning Management System Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `role` (text, 'student' or 'instructor')
      - `avatar_url` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `courses`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `instructor_id` (uuid, references profiles)
      - `thumbnail_url` (text, optional)
      - `price` (decimal, optional)
      - `duration_hours` (integer)
      - `difficulty_level` (text)
      - `is_published` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `enrollments`
      - `id` (uuid, primary key)
      - `student_id` (uuid, references profiles)
      - `course_id` (uuid, references courses)
      - `enrolled_at` (timestamp)
      - `progress_percentage` (integer, default 0)
      - `completed_at` (timestamp, optional)
      - `certificate_issued` (boolean, default false)

    - `assignments`
      - `id` (uuid, primary key)
      - `course_id` (uuid, references courses)
      - `title` (text)
      - `description` (text)
      - `due_date` (timestamp)
      - `max_points` (integer)
      - `created_at` (timestamp)

    - `submissions`
      - `id` (uuid, primary key)
      - `assignment_id` (uuid, references assignments)
      - `student_id` (uuid, references profiles)
      - `content` (text)
      - `file_url` (text, optional)
      - `submitted_at` (timestamp)
      - `grade` (integer, optional)
      - `feedback` (text, optional)
      - `graded_at` (timestamp, optional)

    - `discussions`
      - `id` (uuid, primary key)
      - `course_id` (uuid, references courses)
      - `title` (text)
      - `description` (text)
      - `created_by` (uuid, references profiles)
      - `created_at` (timestamp)

    - `discussion_posts`
      - `id` (uuid, primary key)
      - `discussion_id` (uuid, references discussions)
      - `user_id` (uuid, references profiles)
      - `content` (text)
      - `parent_id` (uuid, optional, references discussion_posts)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Students can only access their own data and enrolled courses
    - Instructors can manage their own courses and related data
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('student', 'instructor')) DEFAULT 'student',
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  instructor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  thumbnail_url text,
  price decimal(10,2) DEFAULT 0,
  duration_hours integer DEFAULT 0,
  difficulty_level text DEFAULT 'Beginner' CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced')),
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at timestamptz DEFAULT now(),
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  completed_at timestamptz,
  certificate_issued boolean DEFAULT false,
  UNIQUE(student_id, course_id)
);

-- Assignments table
CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  due_date timestamptz,
  max_points integer DEFAULT 100,
  created_at timestamptz DEFAULT now()
);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  file_url text,
  submitted_at timestamptz DEFAULT now(),
  grade integer CHECK (grade >= 0),
  feedback text,
  graded_at timestamptz,
  UNIQUE(assignment_id, student_id)
);

-- Discussions table
CREATE TABLE IF NOT EXISTS discussions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  created_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Discussion posts table
CREATE TABLE IF NOT EXISTS discussion_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id uuid NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  parent_id uuid REFERENCES discussion_posts(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_posts ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- Courses policies
CREATE POLICY "Anyone can view published courses"
  ON courses FOR SELECT TO authenticated
  USING (is_published = true OR instructor_id = auth.uid());

CREATE POLICY "Instructors can create courses"
  ON courses FOR INSERT TO authenticated
  WITH CHECK (instructor_id = auth.uid());

CREATE POLICY "Instructors can update own courses"
  ON courses FOR UPDATE TO authenticated
  USING (instructor_id = auth.uid());

-- Enrollments policies
CREATE POLICY "Students can view own enrollments"
  ON enrollments FOR SELECT TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Students can enroll in courses"
  ON enrollments FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Instructors can view course enrollments"
  ON enrollments FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = enrollments.course_id 
      AND courses.instructor_id = auth.uid()
    )
  );

-- Assignments policies
CREATE POLICY "Students can view course assignments"
  ON assignments FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM enrollments 
      WHERE enrollments.course_id = assignments.course_id 
      AND enrollments.student_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = assignments.course_id
      AND courses.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Instructors can manage course assignments"
  ON assignments FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = assignments.course_id
      AND courses.instructor_id = auth.uid()
    )
  );

-- Submissions policies
CREATE POLICY "Students can view own submissions"
  ON submissions FOR SELECT TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Students can create submissions"
  ON submissions FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Instructors can view course submissions"
  ON submissions FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM assignments
      JOIN courses ON courses.id = assignments.course_id
      WHERE assignments.id = submissions.assignment_id
      AND courses.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Instructors can update course submissions"
  ON submissions FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM assignments
      JOIN courses ON courses.id = assignments.course_id
      WHERE assignments.id = submissions.assignment_id
      AND courses.instructor_id = auth.uid()
    )
  );

-- Discussions policies
CREATE POLICY "Users can view course discussions"
  ON discussions FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM enrollments 
      WHERE enrollments.course_id = discussions.course_id 
      AND enrollments.student_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = discussions.course_id
      AND courses.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Instructors can create discussions"
  ON discussions FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = discussions.course_id
      AND courses.instructor_id = auth.uid()
    )
  );

-- Discussion posts policies
CREATE POLICY "Users can view discussion posts"
  ON discussion_posts FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM discussions
      JOIN enrollments ON enrollments.course_id = discussions.course_id
      WHERE discussions.id = discussion_posts.discussion_id
      AND enrollments.student_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM discussions
      JOIN courses ON courses.id = discussions.course_id
      WHERE discussions.id = discussion_posts.discussion_id
      AND courses.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Users can create discussion posts"
  ON discussion_posts FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    (
      EXISTS (
        SELECT 1 FROM discussions
        JOIN enrollments ON enrollments.course_id = discussions.course_id
        WHERE discussions.id = discussion_posts.discussion_id
        AND enrollments.student_id = auth.uid()
      ) OR
      EXISTS (
        SELECT 1 FROM discussions
        JOIN courses ON courses.id = discussions.course_id
        WHERE discussions.id = discussion_posts.discussion_id
        AND courses.instructor_id = auth.uid()
      )
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_courses_instructor ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_assignments_course ON assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_discussions_course ON discussions(course_id);
CREATE INDEX IF NOT EXISTS idx_discussion_posts_discussion ON discussion_posts(discussion_id);