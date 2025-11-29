import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, supabaseHelpers } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { Database, Profile } from '../lib/supabase';

// Use the Profile type from supabase.ts for consistency
type User = Profile;

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
  connectionStatus: { connected: boolean; message: string };
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Enhanced demo users with proper typing and null handling
const DEMO_USERS: User[] = [
  {
    id: 'demo-student-1',
    email: 'student@example.com',
    full_name: 'Demo Student',
    role: 'student',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    bio: 'Enthusiastic learner exploring various subjects and building knowledge.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-instructor-1',
    email: 'instructor@example.com',
    full_name: 'Demo Instructor',
    role: 'instructor',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    bio: 'Experienced educator passionate about teaching and mentoring students.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-instructor-2',
    email: 'john.doe@example.com',
    full_name: 'Prof. John Doe',
    role: 'instructor',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    bio: 'Mathematics professor with 15+ years of teaching experience.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-student-2',
    email: 'jane.smith@example.com',
    full_name: 'Jane Smith',
    role: 'student',
    avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150',
    bio: 'Computer Science student interested in web development and AI.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

// Local storage keys for fallback auth
const LOCAL_USERS_KEY = 'local-users';
const LOCAL_SESSION_KEY = 'local-session';

type LocalUser = User & { password?: string };

const readLocalUsers = (): LocalUser[] => {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LocalUser[];
  } catch (e) {
    console.warn('Failed to read local users', e);
    return [];
  }
};

const saveLocalUsers = (users: LocalUser[]) => {
  try {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.warn('Failed to save local users', e);
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<{ connected: boolean; message: string }>({
    connected: false,
    message: 'Checking connection...'
  });

  // Check Supabase connection status
  const checkConnection = async () => {
    try {
      const status = await supabaseHelpers.getConnectionStatus();
      setConnectionStatus(status);
      return status.connected;
    } catch (error) {
      console.warn('Connection check failed:', error);
      setConnectionStatus({
        connected: false,
        message: 'Connection check failed'
      });
      return false;
    }
  };

  const fetchUserProfile = async (userId: string, authUser?: SupabaseUser): Promise<User | null> => {
    try {
      // Use the helper function from supabase.ts
      const profile = await supabaseHelpers.getCurrentUserProfile();
      
      if (profile) {
        setUser(profile);
        console.log('✅ Profile loaded for:', profile.email, '- Role:', profile.role);
        return profile;
      }

      // Fallback: Create profile from auth user if it doesn't exist
      const currentAuthUser = authUser || supabaseUser;
      if (currentAuthUser) {
        const newProfile: Database['public']['Tables']['profiles']['Insert'] = {
          id: userId,
          email: currentAuthUser.email || 'unknown@example.com',
          full_name: currentAuthUser.user_metadata?.full_name || 'User',
          role: currentAuthUser.user_metadata?.role || 'student',
        };

        const createdProfile = await supabaseHelpers.upsertProfile(newProfile);
        if (createdProfile) {
          setUser(createdProfile);
          console.log('✅ Created new profile for:', createdProfile.email);
          return createdProfile;
        }
      }

      console.warn('⚠️ Could not fetch or create user profile');
      return null;

    } catch (error) {
      console.error('❌ Error fetching user profile:', error);
      return null;
    }
  };

  const initializeAuth = async () => {
    try {
      setLoading(true);
      
      // Check connection first
      const isConnected = await checkConnection();
      
      if (isConnected) {
        // Try to get existing Supabase session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.warn('⚠️ Supabase session error:', error.message);
        }

        if (session?.user) {
          setSupabaseUser(session.user);
          await fetchUserProfile(session.user.id, session.user);
        }
      }

      // If Supabase not connected, check local session (local users stored in localStorage)
      if (!isConnected) {
        const sessionId = localStorage.getItem(LOCAL_SESSION_KEY);
        if (sessionId) {
          const locals = readLocalUsers();
          const localUser = locals.find(u => u.id === sessionId);
          if (localUser) {
            setUser(localUser as User);
            console.log('🟢 Restored local session for:', localUser.email);
          } else {
            localStorage.removeItem(LOCAL_SESSION_KEY);
          }
        }
      }

    } catch (error) {
      console.warn('⚠️ Auth initialization error:', error);
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
        console.log('🔄 Auth state changed:', event, session?.user?.email || 'no user');
        
        if (session?.user) {
          setSupabaseUser(session.user);
          await fetchUserProfile(session.user.id, session.user);
        } else {
          setSupabaseUser(null);
          // If there's a local session, preserve it; otherwise clear user
          const sessionId = localStorage.getItem(LOCAL_SESSION_KEY);
          if (!sessionId) {
            setUser(null);
            localStorage.removeItem('demo-user');
          } else {
            const locals = readLocalUsers();
            const localUser = locals.find(u => u.id === sessionId);
            if (localUser) setUser(localUser as User);
            else {
              setUser(null);
              localStorage.removeItem(LOCAL_SESSION_KEY);
            }
          }
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
      
      // Enhanced input validation
      if (!email?.trim() || !password || !fullName?.trim()) {
        throw new Error('All fields are required');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      if (!['student', 'instructor'].includes(role)) {
        throw new Error('Invalid role selected');
      }

      const trimmedEmail = email.trim();
      const trimmedFullName = fullName.trim();
      
      // Check connection status
      const isConnected = await checkConnection();

      if (isConnected) {
        // Try Supabase signup
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            data: {
              full_name: trimmedFullName,
              role: role,
            }
          }
        });

        if (error) {
          console.warn('⚠️ Supabase signup error:', error.message);
        } else if (data.user) {
          // Profile will be created automatically via database trigger or manually
          const profileData: Database['public']['Tables']['profiles']['Insert'] = {
            id: data.user.id,
            email: trimmedEmail,
            full_name: trimmedFullName,
            role,
          };

          await supabaseHelpers.upsertProfile(profileData);
          setSupabaseUser(data.user);
          console.log('✅ Supabase signup successful for:', trimmedEmail);
          return;
        }
      }

      // Fallback to local signup (stored in localStorage)
      const locals = readLocalUsers();
      const exists = locals.find(u => u.email === trimmedEmail);
      if (exists) {
        throw new Error('An account with that email already exists (local)');
      }

      const newLocalUser: LocalUser = {
        id: `local-${Date.now()}`,
        email: trimmedEmail,
        full_name: trimmedFullName,
        role,
        avatar_url: null,
        bio: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        password,
      };

      locals.push(newLocalUser);
      saveLocalUsers(locals);
      setUser(newLocalUser);
      localStorage.setItem(LOCAL_SESSION_KEY, newLocalUser.id);
      console.log('🟢 Created local account for:', trimmedEmail, '- Role:', role);

    } catch (error) {
      console.error('❌ Signup error:', error);
      throw error instanceof Error ? error : new Error('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);

      // Enhanced input validation
      if (!email?.trim() || !password) {
        throw new Error('Email and password are required');
      }

      const trimmedEmail = email.trim();

      // Check for demo users first (always available)
      // Check local users stored in localStorage
      const localUsers = readLocalUsers();
      const localFound = localUsers.find(u => u.email === trimmedEmail && u.password === password);
      if (localFound) {
        setUser(localFound as User);
        setSupabaseUser(null);
        localStorage.setItem(LOCAL_SESSION_KEY, localFound.id);
        console.log('🟢 Local login successful for:', trimmedEmail, '- Role:', localFound.role);
        return;
      }

      // Check demo users (preset) - password for these is 'password'
      const demoUser = DEMO_USERS.find(u => u.email === trimmedEmail);
      if (demoUser && password === 'password') {
        setUser(demoUser);
        setSupabaseUser(null); // Clear any existing Supabase user
        localStorage.setItem(LOCAL_SESSION_KEY, demoUser.id);
        console.log('🎭 Demo login successful for:', trimmedEmail, '- Role:', demoUser.role);
        return;
      }

      // Check connection status before trying Supabase
      const isConnected = await checkConnection();

      if (isConnected) {
        // Try Supabase authentication
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: password,
        });

        if (error) {
          console.warn('⚠️ Supabase signin error:', error.message);
        } else if (data?.user) {
          setSupabaseUser(data.user);
          await fetchUserProfile(data.user.id, data.user);
          console.log('✅ Supabase login successful for:', trimmedEmail);
          return;
        }
      }

      // If we get here, both demo and Supabase login failed
      throw new Error('Invalid credentials. Try demo: student@example.com / password or instructor@example.com / password');

    } catch (error) {
      console.error('❌ Signin error:', error);
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
      localStorage.removeItem(LOCAL_SESSION_KEY);
      
      // Sign out from Supabase if there's a session
      if (supabaseUser) {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.warn('⚠️ Supabase signout error:', error.message);
        }
      }

      setUser(null);
      setSupabaseUser(null);
      console.log('✅ Signed out successfully');

    } catch (error) {
      console.error('❌ Signout error:', error);
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
        const updatedUser: User = { 
          ...user, 
          ...updates, 
          updated_at: new Date().toISOString() 
        };
        setUser(updatedUser);
        localStorage.setItem('demo-user', JSON.stringify(updatedUser));
        console.log('🎭 Demo profile updated for:', user.email);
        return;
      }

      // Update Supabase profile using helper
      const updatedProfile = await supabaseHelpers.upsertProfile({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        ...updates,
      });

      if (updatedProfile) {
        setUser(updatedProfile);
        console.log('✅ Supabase profile updated successfully');
      } else {
        throw new Error('Failed to update profile in database');
      }

    } catch (error) {
      console.error('❌ Profile update error:', error);
      throw error instanceof Error ? error : new Error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Computed properties for easier access
  const isAuthenticated = !!user;
  const isInstructor = user?.role === 'instructor';
  const isStudent = user?.role === 'student';
  const isDemoMode = supabaseHelpers.isDemoMode() || (user?.id.startsWith('demo-') ?? false);

  const value: AuthContextType = {
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
    connectionStatus,
    isDemoMode,
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