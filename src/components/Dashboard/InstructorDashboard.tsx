import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, TrendingUp, Plus, Eye, CreditCard as Edit } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { Course } from '../../types';

export function InstructorDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    publishedCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    if (user) {
      fetchInstructorData();
    }
  }, [user]);

  const fetchInstructorData = async () => {
    try {
      // Fetch courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .eq('instructor_id', user!.id)
        .order('created_at', { ascending: false });

      if (coursesError) throw coursesError;

      setCourses(coursesData || []);

      // Calculate course stats
      const totalCourses = coursesData?.length || 0;
      const publishedCourses = coursesData?.filter(c => c.is_published).length || 0;

      // Fetch enrollment stats
      const { data: enrollmentsData, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select('*, course:courses!inner(*)')
        .eq('course.instructor_id', user!.id);

      if (enrollmentsError) throw enrollmentsError;

      const totalStudents = enrollmentsData?.length || 0;
      const totalRevenue = enrollmentsData?.reduce((sum, e) => sum + (e.course?.price || 0), 0) || 0;

      setStats({
        totalCourses,
        publishedCourses,
        totalStudents,
        totalRevenue,
      });
    } catch (error) {
      console.error('Error fetching instructor data:', error);
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.full_name}!
              </h1>
              <p className="text-gray-600">Manage your courses and track your teaching progress</p>
            </div>
            <Link
              to="/instructor/courses/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Link>
          </div>
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
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-gray-900">{stats.publishedCourses}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Award className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Courses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Your Courses</h2>
              <Link
                to="/instructor/courses"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
              >
                View all
              </Link>
            </div>
          </div>

          {courses.length === 0 ? (
            <div className="p-8 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
              <p className="text-gray-600 mb-4">Create your first course to start teaching</p>
              <Link
                to="/instructor/courses/new"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Course
              </Link>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid gap-4">
                {courses.slice(0, 5).map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      {course.thumbnail_url ? (
                        <img
                          src={course.thumbnail_url}
                          alt={course.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-white" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900">{course.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            course.is_published 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {course.is_published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {course.difficulty_level} • {course.duration_hours} hours
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/courses/${course.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                        title="View course"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/instructor/courses/${course.id}/edit`}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                        title="Edit course"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}