import { createClient } from '@supabase/supabase-js';

// Fallback values for demo purposes
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key';

// Only show warning in development
if (import.meta.env.DEV && (supabaseUrl === 'https://demo.supabase.co' || supabaseAnonKey === 'demo-key')) {
  console.warn('⚠️ Using demo Supabase credentials. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env for production.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: 'student' | 'instructor';
          avatar_url?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role?: 'student' | 'instructor';
          avatar_url?: string;
        };
        Update: {
          email?: string;
          full_name?: string;
          role?: 'student' | 'instructor';
          avatar_url?: string;
          updated_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          title: string;
          description: string;
          instructor_id: string;
          thumbnail_url?: string;
          price?: number;
          duration_hours?: number;
          difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced';
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          description: string;
          instructor_id: string;
          thumbnail_url?: string;
          price?: number;
          duration_hours?: number;
          difficulty_level?: 'Beginner' | 'Intermediate' | 'Advanced';
          is_published?: boolean;
        };
        Update: {
          title?: string;
          description?: string;
          thumbnail_url?: string;
          price?: number;
          duration_hours?: number;
          difficulty_level?: 'Beginner' | 'Intermediate' | 'Advanced';
          is_published?: boolean;
          updated_at?: string;
        };
      };
      enrollments: {
        Row: {
          id: string;
          student_id: string;
          course_id: string;
          enrolled_at: string;
          progress_percentage: number;
          completed_at?: string;
          certificate_issued: boolean;
        };
        Insert: {
          student_id: string;
          course_id: string;
          progress_percentage?: number;
        };
        Update: {
          progress_percentage?: number;
          completed_at?: string;
          certificate_issued?: boolean;
        };
      };
    };
  };
};