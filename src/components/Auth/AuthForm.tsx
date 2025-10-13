import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  BookOpen, Eye, EyeOff, Mail, Lock, User, GraduationCap, Users, ArrowRight, 
  CheckCircle, Star, Award, Target, Zap, Globe, Brain, Lightbulb, 
  FileText, Video, PenTool, Calculator, Microscope, Palette
} from 'lucide-react';

// Enhanced floating page box component with realistic page content
const FloatingPageBox = ({ 
  delay = 0, 
  duration = 30, 
  size = 'md',
  variant = 'default',
  pageType = 'course'
}: {
  delay?: number;
  duration?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glow' | 'flip' | 'bounce';
  pageType?: 'course' | 'assignment' | 'quiz' | 'video' | 'book' | 'certificate';
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const sizeClasses = {
    sm: 'w-20 h-28',
    md: 'w-24 h-32', 
    lg: 'w-28 h-36'
  };

  const pageConfigs = {
    course: {
      title: 'Mathematics 101',
      subtitle: 'Advanced Calculus',
      icon: Calculator,
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'bg-blue-500/20',
      content: ['Chapter 1: Limits', 'Chapter 2: Derivatives', 'Chapter 3: Integrals']
    },
    assignment: {
      title: 'Physics Lab Report',
      subtitle: 'Due: Tomorrow',
      icon: FileText,
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-500/20',
      content: ['Experiment Setup', 'Data Analysis', 'Conclusion']
    },
    quiz: {
      title: 'History Quiz',
      subtitle: '15 Questions',
      icon: Target,
      color: 'from-purple-400 to-violet-500',
      bgColor: 'bg-purple-500/20',
      content: ['World War I', 'Industrial Revolution', 'Ancient Rome']
    },
    video: {
      title: 'Chemistry Lecture',
      subtitle: '45 min video',
      icon: Video,
      color: 'from-red-400 to-rose-500',
      bgColor: 'bg-red-500/20',
      content: ['Organic Compounds', 'Chemical Bonds', 'Reactions']
    },
    book: {
      title: 'Literature Study',
      subtitle: 'Shakespeare',
      icon: BookOpen,
      color: 'from-amber-400 to-yellow-500',
      bgColor: 'bg-amber-500/20',
      content: ['Romeo & Juliet', 'Character Analysis', 'Themes']
    },
    certificate: {
      title: 'Course Certificate',
      subtitle: 'Completed',
      icon: Award,
      color: 'from-indigo-400 to-purple-500',
      bgColor: 'bg-indigo-500/20',
      content: ['Web Development', 'Grade: A+', 'Issued: 2024']
    }
  };

  const config = pageConfigs[pageType];
  const Icon = config.icon;

  return (
    <div 
      className={`absolute ${sizeClasses[size]} cursor-pointer transform transition-all duration-500 hover:scale-110 hover:z-50`}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        left: `${Math.random() * 85 + 5}%`,
        top: `${Math.random() * 80 + 10}%`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Page Container */}
      <div className={`relative w-full h-full bg-white/90 backdrop-blur-sm rounded-lg shadow-2xl border border-white/50 ${
        variant === 'default' ? 'animate-float-page' :
        variant === 'glow' ? 'animate-float-glow-page' :
        variant === 'flip' ? 'animate-float-flip-page' :
        'animate-float-bounce-page'
      } hover:shadow-3xl transition-all duration-300`}>
        
        {/* Page Header */}
        <div className={`h-8 bg-gradient-to-r ${config.color} rounded-t-lg flex items-center px-2 relative overflow-hidden`}>
          <div className="flex items-center space-x-1">
            <Icon className="w-3 h-3 text-white" />
            <div className="w-1 h-1 bg-white/60 rounded-full"></div>
            <div className="w-1 h-1 bg-white/60 rounded-full"></div>
            <div className="w-1 h-1 bg-white/60 rounded-full"></div>
          </div>
          
          {/* Animated header gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-shimmer"></div>
        </div>

        {/* Page Content */}
        <div className="p-2 h-full">
          {/* Title */}
          <div className="mb-1">
            <h4 className="text-xs font-bold text-gray-800 truncate">{config.title}</h4>
            <p className="text-xs text-gray-600 truncate">{config.subtitle}</p>
          </div>

          {/* Content Lines */}
          <div className="space-y-1">
            {config.content.map((line, index) => (
              <div key={index} className="flex items-center space-x-1">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="text-xs text-gray-700 truncate flex-1">{line}</div>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-2 bg-gray-200 h-1 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${config.color} rounded-full animate-progress`}
              style={{ width: `${Math.random() * 100}%` }}
            ></div>
          </div>

          {/* Page Corner Fold Effect */}
          <div className="absolute top-8 right-0 w-0 h-0 border-l-4 border-l-gray-300 border-b-4 border-b-transparent opacity-50"></div>
        </div>

        {/* Hover Tooltip */}
        {isHovered && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50 animate-fade-in">
            {config.title}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-l-transparent border-r-transparent border-t-gray-900"></div>
          </div>
        )}

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 ${config.bgColor} rounded-full animate-float-particle opacity-40`}
              style={{
                left: `${20 + i * 30}%`,
                top: `${30 + i * 20}%`,
                animationDelay: `${i * 2}s`,
                animationDuration: `${8 + i * 2}s`
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Educational themed floating elements collection
const FloatingEducationalElements = ({ mounted }: { mounted: boolean }) => {
  const pageTypes = ['course', 'assignment', 'quiz', 'video', 'book', 'certificate'] as const;
  const variants = ['default', 'glow', 'flip', 'bounce'] as const;
  const sizes = ['sm', 'md', 'lg'] as const;

  if (!mounted) return null;

  return (
    <>
      {/* Floating Page Boxes */}
      {Array.from({ length: 18 }, (_, i) => (
        <FloatingPageBox
          key={`page-${i}`}
          delay={i * 2}
          duration={25 + (i % 10) * 3}
          size={sizes[i % 3]}
          variant={variants[i % 4]}
          pageType={pageTypes[i % 6]}
        />
      ))}

      {/* Additional Educational Elements */}
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={`element-${i}`}
          className="absolute animate-float-slow opacity-30"
          style={{
            left: `${Math.random() * 90}%`,
            top: `${Math.random() * 90}%`,
            animationDelay: `${i * 3}s`,
            animationDuration: `${35 + i * 2}s`
          }}
        >
          <div className={`w-12 h-12 ${
            i % 4 === 0 ? 'bg-gradient-to-br from-blue-400/20 to-cyan-400/20' :
            i % 4 === 1 ? 'bg-gradient-to-br from-purple-400/20 to-violet-400/20' :
            i % 4 === 2 ? 'bg-gradient-to-br from-green-400/20 to-emerald-400/20' :
            'bg-gradient-to-br from-amber-400/20 to-yellow-400/20'
          } rounded-xl backdrop-blur-sm border border-white/20 flex items-center justify-center`}>
            {i % 4 === 0 && <Brain className="w-6 h-6 text-blue-400/60" />}
            {i % 4 === 1 && <Lightbulb className="w-6 h-6 text-purple-400/60" />}
            {i % 4 === 2 && <Globe className="w-6 h-6 text-green-400/60" />}
            {i % 4 === 3 && <Palette className="w-6 h-6 text-amber-400/60" />}
          </div>
        </div>
      ))}
    </>
  );
};

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'student' as 'student' | 'instructor'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { signIn, signUp, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Animation effect
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle redirect after authentication
  useEffect(() => {
    if (!authLoading && user) {
      const redirectTo = searchParams.get('redirect') || '/';
      navigate(redirectTo, { replace: true });
    }
  }, [user, authLoading, navigate, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        await signUp(formData.email, formData.password, formData.fullName, formData.role);
      } else {
        await signIn(formData.email, formData.password);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const demoCredentials = [
    { 
      email: 'student@example.com', 
      role: 'Student Dashboard', 
      icon: GraduationCap, 
      color: 'from-emerald-500 to-teal-600',
      description: 'Access courses, assignments & progress tracking'
    },
    { 
      email: 'instructor@example.com', 
      role: 'Instructor Portal', 
      icon: Users, 
      color: 'from-indigo-500 to-purple-600',
      description: 'Manage courses, students & create content'
    },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80 text-lg">Preparing your learning environment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced Background with Floating Pages */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-400/15 to-teal-400/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-indigo-400/15 to-purple-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>

        {/* Floating Educational Page Elements */}
        <FloatingEducationalElements mounted={mounted} />

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
            backgroundSize: '20px 20px'
          }}></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Enhanced Branding */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-8">
              {/* Logo and Brand */}
              <div className="flex items-center justify-center lg:justify-start space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/20">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-3xl opacity-20 animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                    EduPlatform
                  </h1>
                  <p className="text-sm text-emerald-200/80 font-medium">Interactive Learning Hub</p>
                </div>
              </div>

              {/* Main Heading */}
              <div className="space-y-6">
                <h2 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Your Digital
                  <span className="block bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                    Classroom
                  </span>
                  <span className="block text-3xl lg:text-4xl text-indigo-200 mt-2">
                    Awaits Discovery
                  </span>
                </h2>
                <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
                  Experience immersive learning with floating course pages, interactive assignments, 
                  and real-time progress tracking. Your educational journey comes alive!
                </p>
              </div>

              {/* Interactive Feature Cards */}
              <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto lg:mx-0">
                {[
                  { icon: FileText, text: 'Live Assignments', color: 'text-emerald-400', bg: 'bg-emerald-500/20', count: '24' },
                  { icon: Video, text: 'Video Lectures', color: 'text-blue-400', bg: 'bg-blue-500/20', count: '156' },
                  { icon: Target, text: 'Interactive Quizzes', color: 'text-purple-400', bg: 'bg-purple-500/20', count: '89' },
                  { icon: Award, text: 'Certificates', color: 'text-amber-400', bg: 'bg-amber-500/20', count: '12' }
                ].map((feature, index) => (
                  <div key={index} className={`relative p-4 rounded-xl ${feature.bg} border border-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer overflow-hidden`}>
                    <div className="flex items-center space-x-3">
                      <feature.icon className={`w-5 h-5 ${feature.color} group-hover:scale-110 transition-transform`} />
                      <div>
                        <span className="text-sm font-medium text-white block">{feature.text}</span>
                        <span className={`text-xs ${feature.color} font-bold`}>{feature.count} Available</span>
                      </div>
                    </div>
                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  </div>
                ))}
              </div>

              {/* Animated Stats */}
              <div className="flex justify-center lg:justify-start space-x-8">
                {[
                  { number: '15K+', label: 'Active Students', icon: Users },
                  { number: '800+', label: 'Live Courses', icon: BookOpen },
                  { number: '98%', label: 'Success Rate', icon: Target }
                ].map((stat, index) => (
                  <div key={index} className="text-center group cursor-pointer">
                    <div className="flex items-center justify-center mb-2">
                      <stat.icon className="w-4 h-4 text-emerald-400 mr-1 group-hover:scale-110 transition-transform" />
                      <div className="text-2xl font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">{stat.number}</div>
                    </div>
                    <div className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Enhanced Auth Form */}
          <div className="w-full max-w-lg mx-auto">
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl shadow-black/20 p-8 relative overflow-hidden">
              
              {/* Form background pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>
              
              {/* Form Header */}
              <div className="relative text-center mb-8">
                <div className="inline-flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    {isSignUp ? 'Join Our Learning Community' : 'Welcome Back, Learner'}
                  </h3>
                </div>
                <p className="text-slate-300">
                  {isSignUp ? 'Begin your educational transformation' : 'Continue exploring your courses'}
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-rose-500/20 border border-rose-500/50 rounded-xl text-rose-200 text-sm backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">!</span>
                    </div>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Enhanced Demo Credentials */}
              <div className="mb-8 p-6 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-400/30 rounded-2xl backdrop-blur-sm">
                <div className="flex items-center space-x-2 mb-4">
                  <Zap className="w-5 h-5 text-emerald-400" />
                  <p className="text-emerald-200 font-semibold">Instant Demo Access</p>
                </div>
                <div className="space-y-3">
                  {demoCredentials.map((cred, index) => (
                    <button
                      key={index}
                      onClick={() => setFormData({ ...formData, email: cred.email, password: 'password' })}
                      className="w-full flex items-center space-x-4 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 text-left group border border-white/10 hover:border-white/20 relative overflow-hidden"
                    >
                      <div className={`w-12 h-12 bg-gradient-to-r ${cred.color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
                        <cred.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{cred.role}</p>
                        <p className="text-slate-300 text-sm">{cred.description}</p>
                        <p className="text-emerald-400 text-xs font-mono">{cred.email}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                      
                      {/* Button hover effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Auth Form */}
              <form onSubmit={handleSubmit} className="space-y-6 relative">
                {/* Name Field (Sign Up Only) */}
                {isSignUp && (
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required={isSignUp}
                        className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 backdrop-blur-sm"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 backdrop-blur-sm"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 backdrop-blur-sm"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Role Selection (Sign Up Only) */}
                {isSignUp && (
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Choose Your Learning Path
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'student', label: 'Student', icon: GraduationCap, color: 'emerald', desc: 'Learn & Grow' },
                        { value: 'instructor', label: 'Instructor', icon: Users, color: 'indigo', desc: 'Teach & Guide' }
                      ].map((role) => (
                        <label key={role.value} className="cursor-pointer">
                          <input
                            type="radio"
                            name="role"
                            value={role.value}
                            checked={formData.role === role.value}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <div className={`p-4 rounded-xl border transition-all duration-300 ${
                            formData.role === role.value 
                              ? `bg-${role.color}-500/20 border-${role.color}-400/50 ring-2 ring-${role.color}-400/50` 
                              : 'bg-white/10 border-white/20 hover:border-white/40'
                          }`}>
                            <div className="flex flex-col items-center space-y-2 text-center">
                              <role.icon className={`w-6 h-6 ${formData.role === role.value ? `text-${role.color}-400` : 'text-slate-400'}`} />
                              <div>
                                <span className={`font-medium block ${formData.role === role.value ? 'text-white' : 'text-slate-300'}`}>
                                  {role.label}
                                </span>
                                <span className={`text-xs ${formData.role === role.value ? `text-${role.color}-300` : 'text-slate-400'}`}>
                                  {role.desc}
                                </span>
                              </div>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Enhanced Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40 flex items-center justify-center space-x-3 relative overflow-hidden group"
                >
                  {/* Button shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Connecting to your classroom...</span>
                    </div>
                  ) : (
                    <>
                      <span>{isSignUp ? 'Start Learning Journey' : 'Enter Classroom'}</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Toggle Form Type */}
              <div className="mt-8 text-center relative">
                <div className="flex items-center justify-center space-x-2">
                  <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1"></div>
                  <span className="text-slate-400 text-sm px-3">or</span>
                  <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1"></div>
                </div>
                <p className="text-slate-300 mt-4">
                  {isSignUp ? 'Already part of our community?' : "New to our learning platform?"}
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="ml-2 text-emerald-400 hover:text-emerald-300 font-medium transition-colors relative group"
                  >
                    {isSignUp ? 'Sign In Here' : 'Join Now'}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all duration-300"></span>
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Custom CSS for realistic page animations */}
      <style jsx>{`
        @keyframes float-page {
          0%, 100% { 
            transform: translateY(0) rotateX(0deg) rotateY(0deg) scale(1); 
            opacity: 0.8;
          }
          25% { 
            transform: translateY(-30px) rotateX(5deg) rotateY(2deg) scale(1.02); 
            opacity: 0.9;
          }
          50% { 
            transform: translateY(-20px) rotateX(-2deg) rotateY(-1deg) scale(1.05); 
            opacity: 1;
          }
          75% { 
            transform: translateY(-40px) rotateX(3deg) rotateY(3deg) scale(1.02); 
            opacity: 0.9;
          }
        }
        
        @keyframes float-glow-page {
          0%, 100% { 
            transform: translateY(0) rotateY(0deg); 
            opacity: 0.7;
            filter: drop-shadow(0 0 0px rgba(16, 185, 129, 0.4));
          }
          50% { 
            transform: translateY(-35px) rotateY(5deg); 
            opacity: 1;
            filter: drop-shadow(0 0 25px rgba(16, 185, 129, 0.8));
          }
        }

        @keyframes float-flip-page {
          0%, 100% { 
            transform: translateY(0) rotateY(0deg) rotateX(0deg); 
            opacity: 0.8;
          }
          25% { 
            transform: translateY(-25px) rotateY(90deg) rotateX(5deg); 
            opacity: 0.6;
          }
          50% { 
            transform: translateY(-40px) rotateY(180deg) rotateX(0deg); 
            opacity: 1;
          }
          75% { 
            transform: translateY(-25px) rotateY(270deg) rotateX(-5deg); 
            opacity: 0.6;
          }
        }

        @keyframes float-bounce-page {
          0%, 100% { 
            transform: translateY(0) scale(1); 
            opacity: 0.7;
          }
          25% { 
            transform: translateY(-50px) scale(1.1); 
            opacity: 0.9;
          }
          50% { 
            transform: translateY(-30px) scale(1.15); 
            opacity: 1;
          }
          75% { 
            transform: translateY(-60px) scale(1.05); 
            opacity: 0.8;
          }
        }

        @keyframes float-slow {
          0%, 100% { 
            transform: translateY(0) rotate(0deg); 
            opacity: 0.3;
          }
          50% { 
            transform: translateY(-20px) rotate(180deg); 
            opacity: 0.6;
          }
        }

        @keyframes float-particle {
          0%, 100% { 
            transform: translateY(0) scale(1); 
            opacity: 0.4;
          }
          50% { 
            transform: translateY(-15px) scale(1.5); 
            opacity: 0.8;
          }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }

        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }

        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(-5px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float-page {
          animation: float-page 30s ease-in-out infinite;
        }

        .animate-float-glow-page {
          animation: float-glow-page 25s ease-in-out infinite;
        }

        .animate-float-flip-page {
          animation: float-flip-page 35s ease-in-out infinite;
        }

        .animate-float-bounce-page {
          animation: float-bounce-page 20s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 40s ease-in-out infinite;
        }

        .animate-float-particle {
          animation: float-particle 8s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }

        .animate-progress {
          animation: progress 2s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}