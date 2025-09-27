import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Users, Award, BookOpen, Play, FileText, MessageSquare, ArrowLeft, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { Course, Enrollment, Assignment, Discussion } from '../../types';

export function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCourseData();
    }
  }, [id, user]);

  const fetchCourseData = async () => {
    try {
      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select(`
          *,
          instructor:profiles(*)
        `)
        .eq('id', id)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      // Check if student is enrolled
      if (user?.role === 'student') {
        const { data: enrollmentData } = await supabase
          .from('enrollments')
          .select('*')
          .eq('student_id', user.id)
          .eq('course_id', id)
          .single();

        setEnrollment(enrollmentData);
      }

      // Fetch assignments if enrolled or instructor
      if (user?.role === 'instructor' && courseData.instructor_id === user.id) {
        const { data: assignmentsData } = await supabase
          .from('assignments')
          .select('*')
          .eq('course_id', id)
          .order('created_at', { ascending: false });

        setAssignments(assignmentsData || []);
      }

      // Fetch discussions
      const { data: discussionsData } = await supabase
        .from('discussions')
        .select(`
          *,
          creator:profiles(*),
          posts_count:discussion_posts(count)
        `)
        .eq('course_id', id)
        .order('created_at', { ascending: false });

      setDiscussions(discussionsData || []);
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user || !course) return;

    setEnrolling(true);
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .insert({
          student_id: user.id,
          course_id: course.id,
        })
        .select()
        .single();

      if (error) throw error;
      setEnrollment(data);
    } catch (error) {
      console.error('Error enrolling in course:', error);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course not found</h2>
          <button
            onClick={() => navigate('/courses')}
            className="text-blue-600 hover:text-blue-700"
          >
            Back to courses
          </button>
        </div>
      </div>
    );
  }

  const isInstructor = user?.role === 'instructor' && course.instructor_id === user.id;
  const isEnrolled = !!enrollment;
  const canAccess = isInstructor || isEnrolled;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {course.thumbnail_url ? (
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-full h-64 object-cover"
                />
              ) : (
                <div className="w-full h-64 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <BookOpen className="h-20 w-20 text-white" />
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    course.difficulty_level === 'Beginner' 
                      ? 'bg-green-100 text-green-800' 
                      : course.difficulty_level === 'Intermediate'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {course.difficulty_level}
                  </span>
                  {isEnrolled && (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">Enrolled</span>
                    </div>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
                <p className="text-gray-600 mb-6">{course.description}</p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  {course.duration_hours && (
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration_hours} hours</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Award className="h-4 w-4" />
                    <span>Certificate included</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Content Tabs */}
            {canAccess && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6">
                    <button className="py-4 px-1 border-b-2 border-blue-500 text-blue-600 font-medium text-sm">
                      Overview
                    </button>
                    <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm">
                      Assignments ({assignments.length})
                    </button>
                    <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm">
                      Discussions ({discussions.length})
                    </button>
                  </nav>
                </div>
                
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Course Materials</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors duration-200">
                          <Play className="h-5 w-5 text-blue-600" />
                          <span className="font-medium">Introduction Video</span>
                        </div>
                        <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors duration-200">
                          <FileText className="h-5 w-5 text-green-600" />
                          <span className="font-medium">Course Syllabus</span>
                        </div>
                        <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors duration-200">
                          <FileText className="h-5 w-5 text-purple-600" />
                          <span className="font-medium">Reading Materials</span>
                        </div>
                      </div>
                    </div>

                    {assignments.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Assignments</h3>
                        <div className="space-y-3">
                          {assignments.slice(0, 3).map((assignment) => (
                            <div key={assignment.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                              <div>
                                <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                                <p className="text-sm text-gray-500">
                                  Due: {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'No due date'}
                                </p>
                              </div>
                              <span className="text-sm text-gray-500">{assignment.max_points} pts</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="text-center mb-6">
                {course.price && course.price > 0 ? (
                  <div className="text-3xl font-bold text-gray-900 mb-2">${course.price}</div>
                ) : (
                  <div className="text-3xl font-bold text-green-600 mb-2">Free</div>
                )}
              </div>

              {user?.role === 'student' && (
                <div className="space-y-4">
                  {isEnrolled ? (
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 text-green-600 mb-4">
                        <CheckCircle className="h-6 w-6" />
                        <span className="font-medium">You're enrolled!</span>
                      </div>
                      {enrollment && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{enrollment.progress_percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${enrollment.progress_percentage}%` }}
                            />
                          </div>
                        </div>
                      )}
                      <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
                        Continue Learning
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {enrolling ? 'Enrolling...' : 'Enroll Now'}
                    </button>
                  )}
                </div>
              )}

              {isInstructor && (
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
                    Edit Course
                  </button>
                  <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200">
                    View Analytics
                  </button>
                </div>
              )}
            </div>

            {/* Instructor Info */}
            {course.instructor && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructor</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-white">
                      {course.instructor.full_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{course.instructor.full_name}</h4>
                    <p className="text-sm text-gray-500">Course Instructor</p>
                  </div>
                </div>
              </div>
            )}

            {/* Course Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Info</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{course.duration_hours || 0} hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Level</span>
                  <span className="font-medium">{course.difficulty_level}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Certificate</span>
                  <span className="font-medium text-green-600">Included</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}