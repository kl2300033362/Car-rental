import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { Database } from '../lib/supabase';

type User = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, role: 'student' | 'instructor') => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  isInstructor: boolean;
  isStudent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for testing without database
const DEMO_USERS = [
  {
    id: 'demo-student-1',
    email: 'student@example.com',
    full_name: 'Demo Student',
    role: 'student' as const,
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-instructor-1',
    email: 'instructor@example.com',
    full_name: 'Demo Instructor',
    role: 'instructor' as const,
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-instructor-2',
    email: 'john.doe@example.com',
    full_name: 'John Doe',
    role: 'instructor' as const,
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-student-2',
    email: 'jane.smith@example.com',
    full_name: 'Jane Smith',
    role: 'student' as const,
    avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string, authUser?: SupabaseUser) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('Profile fetch error:', error.message);
        
        // Create a basic profile from auth user
        const currentAuthUser = authUser || supabaseUser;
        if (currentAuthUser) {
          const fallbackProfile: User = {
            id: userId,
            email: currentAuthUser.email || '',
            full_name: currentAuthUser.user_metadata?.full_name || 'User',
            role: 'student',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setUser(fallbackProfile);
        }
        return;
      }

      setUser(data);
      console.log('Profile loaded for:', data.email, '- Role:', data.role);
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
    }
  };

  const initializeAuth = async () => {
    try {
      // Check for existing Supabase session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.warn('Supabase session error:', error.message);
      }

      if (session?.user) {
        setSupabaseUser(session.user);
        await fetchUserProfile(session.user.id, session.user);
      } else {
        // Check for demo session in localStorage
        const demoUser = localStorage.getItem('demo-user');
        if (demoUser) {
          try {
            const parsedUser = JSON.parse(demoUser);
            setUser(parsedUser);
            console.log('Restored demo session for:', parsedUser.email);
          } catch (e) {
            console.warn('Invalid demo user data in localStorage');
            localStorage.removeItem('demo-user');
          }
        }
      }
    } catch (error) {
      console.warn('Auth initialization error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initialize authentication state
    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          setSupabaseUser(session.user);
          await fetchUserProfile(session.user.id, session.user);
        } else {
          setSupabaseUser(null);
          setUser(null);
          // Clear any stored demo session
          localStorage.removeItem('demo-user');
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string, role: 'student' | 'instructor') => {
    try {
      setLoading(true);
      
      // Input validation
      if (!email || !password || !fullName) {
        throw new Error('All fields are required');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      
      // Try Supabase signup first
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            role: role,
          }
        }
      });

      if (error) {
        console.warn('Supabase signup error:', error.message);
        
        // Fallback to demo signup
        const newDemoUser: User = {
          id: `demo-${role}-${Date.now()}`,
          email: email.trim(),
          full_name: fullName.trim(),
          role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        setUser(newDemoUser);
        localStorage.setItem('demo-user', JSON.stringify(newDemoUser));
        console.log('Created demo account for:', email);
        return;
      }

      if (data.user) {
        // Create profile in database
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: email.trim(),
              full_name: fullName.trim(),
              role,
            });

          if (profileError) {
            console.warn('Profile creation error:', profileError.message);
          }
        } catch (profileErr) {
          console.warn('Profile creation failed:', profileErr);
        }

        setSupabaseUser(data.user);
      }

    } catch (error) {
      console.error('Signup error:', error);
      throw error instanceof Error ? error : new Error('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);

      // Input validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const trimmedEmail = email.trim();

      // Check for demo users first
      const demoUser = DEMO_USERS.find(u => u.email === trimmedEmail);
      if (demoUser && password === 'password') {
        setUser(demoUser);
        setSupabaseUser(null); // Clear any existing Supabase user
        localStorage.setItem('demo-user', JSON.stringify(demoUser));
        console.log('Demo login successful for:', trimmedEmail, '- Role:', demoUser.role);
        return;
      }

      // Try Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: password,
      });

      if (error) {
        console.warn('Supabase signin error:', error.message);
        throw new Error('Invalid email or password. Try demo credentials: student@example.com / password');
      }

      if (data?.user) {
        setSupabaseUser(data.user);
        await fetchUserProfile(data.user.id, data.user);
        console.log('Supabase login successful for:', trimmedEmail);
      }

    } catch (error) {
      console.error('Signin error:', error);
      throw error instanceof Error ? error : new Error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Clear demo session
      localStorage.removeItem('demo-user');
      
      // Sign out from Supabase if there's a session
      if (supabaseUser) {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.warn('Supabase signout error:', error.message);
        }
      }

      setUser(null);
      setSupabaseUser(null);
      console.log('Signed out successfully');

    } catch (error) {
      console.error('Signout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    try {
      setLoading(true);

      // Update demo user
      if (user.id.startsWith('demo-')) {
        const updatedUser = { 
          ...user, 
          ...updates, 
          updated_at: new Date().toISOString() 
        };
        setUser(updatedUser);
        localStorage.setItem('demo-user', JSON.stringify(updatedUser));
        console.log('Demo profile updated');
        return;
      }

      // Update Supabase profile
      const { error } = await supabase
        .from('profiles')
        .update({ 
          ...updates, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', user.id);

      if (error) {
        throw new Error(error.message);
      }

      setUser(prev => prev ? { ...prev, ...updates } : null);
      console.log('Profile updated successfully');

    } catch (error) {
      console.error('Profile update error:', error);
      throw error instanceof Error ? error : new Error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Computed properties for easier access
  const isAuthenticated = !!user;
  const isInstructor = user?.role === 'instructor';
  const isStudent = user?.role === 'student';

  const value = {
    user,
    supabaseUser,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    isAuthenticated,
    isInstructor,
    isStudent,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Utility hooks for common use cases
export function useRequireAuth() {
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login if not authenticated
      window.location.href = '/auth';
    }
  }, [user, loading]);

  return { user, loading };
}

export function useRequireRole(role: 'student' | 'instructor') {
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (!loading && (!user || user.role !== role)) {
      // Redirect if user doesn't have required role
      window.location.href = '/unauthorized';
    }
  }, [user, loading, role]);

  return { user, loading };
}