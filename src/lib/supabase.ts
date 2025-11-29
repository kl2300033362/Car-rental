import { createClient } from '@supabase/supabase-js';

// Remove global declarations to avoid conflicts with Vite's built-in types
// Vite already provides these types

// Environment configuration with proper error handling
const getSupabaseConfig = () => {
  // Use proper environment variable access
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
  
  // Default demo values if environment variables are not set
  const defaultUrl = 'https://demo.supabase.co';
  const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
  
  const finalUrl = supabaseUrl || defaultUrl;
  const finalKey = supabaseAnonKey || defaultKey;
  
  // Production validation
  if (import.meta.env.PROD && (finalUrl === defaultUrl || finalKey === defaultKey)) {
    console.error('❌ Production environment detected but using demo Supabase credentials!');
    console.warn('Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
  }

  // Development info
  if (import.meta.env.DEV && (finalUrl === defaultUrl || finalKey === defaultKey)) {
    console.warn('⚠️ Using demo Supabase credentials. The app will work in demo mode.');
    console.info('💡 To use real Supabase: Create .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  }

  return { supabaseUrl: finalUrl, supabaseAnonKey: finalKey };
};

// Initialize Supabase client
const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  },
  realtime: {
    params: {
      eventsPerSecond: 2
    }
  }
});

// Database type definitions with proper null handling
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: 'student' | 'instructor';
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role?: 'student' | 'instructor';
          avatar_url?: string | null;
          bio?: string | null;
        };
        Update: {
          email?: string;
          full_name?: string;
          role?: 'student' | 'instructor';
          avatar_url?: string | null;
          bio?: string | null;
          updated_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          title: string;
          description: string;
          instructor_id: string;
          thumbnail_url: string | null;
          price: number | null;
          duration_hours: number | null;
          difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced';
          is_published: boolean;
          category: string | null;
          tags: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          description: string;
          instructor_id: string;
          thumbnail_url?: string | null;
          price?: number | null;
          duration_hours?: number | null;
          difficulty_level?: 'Beginner' | 'Intermediate' | 'Advanced';
          is_published?: boolean;
          category?: string | null;
          tags?: string[] | null;
        };
        Update: {
          title?: string;
          description?: string;
          thumbnail_url?: string | null;
          price?: number | null;
          duration_hours?: number | null;
          difficulty_level?: 'Beginner' | 'Intermediate' | 'Advanced';
          is_published?: boolean;
          category?: string | null;
          tags?: string[] | null;
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
          completed_at: string | null;
          certificate_issued: boolean;
          last_accessed_at: string | null;
        };
        Insert: {
          student_id: string;
          course_id: string;
          progress_percentage?: number;
        };
        Update: {
          progress_percentage?: number;
          completed_at?: string | null;
          certificate_issued?: boolean;
          last_accessed_at?: string | null;
        };
      };
      assignments: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          description: string;
          due_date: string | null;
          max_points: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          course_id: string;
          title: string;
          description: string;
          due_date?: string | null;
          max_points?: number;
          is_published?: boolean;
        };
        Update: {
          title?: string;
          description?: string;
          due_date?: string | null;
          max_points?: number;
          is_published?: boolean;
          updated_at?: string;
        };
      };
      submissions: {
        Row: {
          id: string;
          assignment_id: string;
          student_id: string;
          content: string;
          file_urls: string[] | null;
          submitted_at: string;
          grade: number | null;
          feedback: string | null;
          graded_at: string | null;
          graded_by: string | null;
        };
        Insert: {
          assignment_id: string;
          student_id: string;
          content: string;
          file_urls?: string[] | null;
        };
        Update: {
          content?: string;
          file_urls?: string[] | null;
          grade?: number | null;
          feedback?: string | null;
          graded_at?: string | null;
          graded_by?: string | null;
        };
      };
    };
    Views: {
      course_stats: {
        Row: {
          course_id: string;
          total_enrollments: number;
          avg_progress: number;
          completion_rate: number;
        };
      };
      student_progress: {
        Row: {
          student_id: string;
          course_id: string;
          course_title: string;
          progress_percentage: number;
          enrolled_at: string;
          last_accessed_at: string | null;
        };
      };
    };
    Functions: {
      get_user_role: {
        Args: { user_id: string };
        Returns: 'student' | 'instructor' | null;
      };
      calculate_course_progress: {
        Args: { course_id: string; student_id: string };
        Returns: number;
      };
    };
  };
};

// Type helpers for easier usage
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Course = Database['public']['Tables']['courses']['Row'];
export type Enrollment = Database['public']['Tables']['enrollments']['Row'];
export type Assignment = Database['public']['Tables']['assignments']['Row'];
export type Submission = Database['public']['Tables']['submissions']['Row'];

// Utility functions for Supabase operations
export const supabaseHelpers = {
  // Check if Supabase is available
  async isAvailable(): Promise<boolean> {
    try {
      const { error } = await supabase.from('profiles').select('count').limit(1);
      return !error;
    } catch (err) {
      console.warn('Supabase connection check failed:', err);
      return false;
    }
  },

  // Get current user profile
  async getCurrentUserProfile(): Promise<Profile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.warn('Failed to fetch user profile:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.warn('Error getting current user profile:', err);
      return null;
    }
  },

  // Create or update user profile
  async upsertProfile(profile: Database['public']['Tables']['profiles']['Insert']): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert(profile)
        .select()
        .single();

      if (error) {
        console.warn('Failed to upsert profile:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.warn('Error upserting profile:', err);
      return null;
    }
  },

  // Demo mode checker
  isDemoMode(): boolean {
    return supabaseUrl === 'https://demo.supabase.co';
  },

  // Get connection status
  async getConnectionStatus(): Promise<{ connected: boolean; message: string }> {
    try {
      const isAvailable = await this.isAvailable();
      return {
        connected: isAvailable,
        message: isAvailable 
          ? 'Connected to Supabase' 
          : this.isDemoMode() 
            ? 'Running in demo mode'
            : 'Connection failed'
      };
    } catch (err) {
      return {
        connected: false,
        message: 'Connection error: ' + (err instanceof Error ? err.message : 'Unknown error')
      };
    }
  }
};

// Export configured client as default
export default supabase;