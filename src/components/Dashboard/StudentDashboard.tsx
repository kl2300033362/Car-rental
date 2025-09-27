import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Award, TrendingUp, Calendar, MessageSquare } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { Enrollment, Course } from '../../types';

export function StudentDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    totalHours: 0,
  });

  useEffect(() => {
    if (user) {
      fetchEnrollments();
    }
  }, [user]);

  const fetchEnrollments = async () => {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          course:courses(*)
        `)
        .eq('student_id', user!.id)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;

      const enrollmentsWithCourses = data as (Enrollment & { course: Course })[];
      setEnrollments(enrollmentsWithCourses);

      // Calculate stats
      const totalCourses = enrollmentsWithCourses.length;
      const completedCourses = enrollmentsWithCourses.filter(e => e.progress_percentage === 100).length;
      const inProgressCourses = enrollmentsWithCourses.filter(e => e.progress_percentage > 0 && e.progress_percentage < 100).length;
      const totalHours = enrollmentsWithCourses.reduce((sum, e) => sum + (e.course?.duration_hours || 0), 0);

      setStats({
        totalCourses,
        completedCourses,
        inProgressCourses,
        totalHours,
      });
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.full_name}!
          </h1>
          <p className="text-gray-600">Continue your learning journey</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgressCourses}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedCourses}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Award className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Learning Hours</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalHours}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Courses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">My Courses</h2>
              <Link
                to="/my-courses"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
              >
                View all
              </Link>
            </div>
          </div>

          {enrollments.length === 0 ? (
            <div className="p-8 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
              <p className="text-gray-600 mb-4">Start your learning journey by enrolling in a course</p>
              <Link
                to="/courses"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid gap-4">
                {enrollments.slice(0, 3).map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      {enrollment.course?.thumbnail_url ? (
                        <img
                          src={enrollment.course.thumbnail_url}
                          alt={enrollment.course.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-white" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-gray-900">{enrollment.course?.title}</h3>
                        <p className="text-sm text-gray-500">
                          {enrollment.progress_percentage}% complete
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${enrollment.progress_percentage}%` }}
                        />
                      </div>
                      <Link
                        to={`/courses/${enrollment.course?.id}`}
                        className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                      >
                        Continue
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Assignments</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">Stay on track with your coursework</p>
            <Link
              to="/assignments"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200"
            >
              View assignments →
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageSquare className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Discussion Forums</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">Connect with classmates and instructors</p>
            <Link
              to="/discussions"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200"
            >
              Join discussions →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}