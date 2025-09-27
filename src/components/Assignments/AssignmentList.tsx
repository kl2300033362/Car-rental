import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { Assignment, Submission, Course } from '../../types';

export function AssignmentList() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<(Assignment & { course?: Course; submission?: Submission })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAssignments();
    }
  }, [user]);

  const fetchAssignments = async () => {
    try {
      if (user?.role === 'student') {
        // Fetch assignments from enrolled courses
        const { data, error } = await supabase
          .from('assignments')
          .select(`
            *,
            course:courses(*),
            submissions:submissions(*)
          `)
          .in('course_id', 
            await supabase
              .from('enrollments')
              .select('course_id')
              .eq('student_id', user.id)
              .then(({ data }) => data?.map(e => e.course_id) || [])
          )
          .order('due_date', { ascending: true });

        if (error) throw error;

        // Add submission info for each assignment
        const assignmentsWithSubmissions = data?.map(assignment => ({
          ...assignment,
          submission: assignment.submissions?.find((s: any) => s.student_id === user.id)
        })) || [];

        setAssignments(assignmentsWithSubmissions);
      } else if (user?.role === 'instructor') {
        // Fetch assignments from instructor's courses
        const { data, error } = await supabase
          .from('assignments')
          .select(`
            *,
            course:courses(*)
          `)
          .in('course_id',
            await supabase
              .from('courses')
              .select('id')
              .eq('instructor_id', user.id)
              .then(({ data }) => data?.map(c => c.id) || [])
          )
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAssignments(data || []);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAssignmentStatus = (assignment: Assignment & { submission?: Submission }) => {
    if (user?.role === 'instructor') return null;

    if (assignment.submission) {
      if (assignment.submission.grade !== null) {
        return { status: 'graded', color: 'green', icon: CheckCircle };
      }
      return { status: 'submitted', color: 'blue', icon: CheckCircle };
    }

    if (assignment.due_date && new Date(assignment.due_date) < new Date()) {
      return { status: 'overdue', color: 'red', icon: AlertCircle };
    }

    return { status: 'pending', color: 'yellow', icon: Clock };
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Assignments</h1>
            <p className="text-gray-600">
              {user?.role === 'student' ? 'Track your assignments and submissions' : 'Manage course assignments'}
            </p>
          </div>
          {user?.role === 'instructor' && (
            <Link
              to="/instructor/assignments/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Assignment
            </Link>
          )}
        </div>

        {assignments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
            <p className="text-gray-600">
              {user?.role === 'student' 
                ? 'Assignments will appear here when your instructors create them'
                : 'Create your first assignment to get started'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {assignments.map((assignment) => {
              const status = getAssignmentStatus(assignment);
              const StatusIcon = status?.icon;

              return (
                <div
                  key={assignment.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                        {status && StatusIcon && (
                          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                            status.color === 'green' ? 'bg-green-100 text-green-800' :
                            status.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                            status.color === 'red' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            <StatusIcon className="h-3 w-3" />
                            <span className="capitalize">{status.status}</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-3">{assignment.description}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <span className="font-medium">Course:</span>
                          <span>{assignment.course?.title}</span>
                        </div>
                        {assignment.due_date && (
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <span>{assignment.max_points} points</span>
                        </div>
                      </div>

                      {assignment.submission && user?.role === 'student' && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Your submission</span>
                            {assignment.submission.grade !== null && (
                              <span className="text-sm font-bold text-green-600">
                                {assignment.submission.grade}/{assignment.max_points}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Submitted: {new Date(assignment.submission.submitted_at).toLocaleDateString()}
                          </p>
                          {assignment.submission.feedback && (
                            <p className="text-sm text-gray-600 mt-2">
                              <span className="font-medium">Feedback:</span> {assignment.submission.feedback}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {user?.role === 'student' && !assignment.submission && (
                        <Link
                          to={`/assignments/${assignment.id}/submit`}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                          Submit
                        </Link>
                      )}
                      {user?.role === 'instructor' && (
                        <>
                          <Link
                            to={`/instructor/assignments/${assignment.id}/submissions`}
                            className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                          >
                            View Submissions
                          </Link>
                          <Link
                            to={`/instructor/assignments/${assignment.id}/edit`}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                          >
                            Edit
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}