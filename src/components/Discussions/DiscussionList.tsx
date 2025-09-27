import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Users, Clock, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { Discussion, Course } from '../../types';

export function DiscussionList() {
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState<(Discussion & { course?: Course })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDiscussions();
    }
  }, [user]);

  const fetchDiscussions = async () => {
    try {
      let courseIds: string[] = [];

      if (user?.role === 'student') {
        // Get enrolled course IDs
        const { data: enrollments } = await supabase
          .from('enrollments')
          .select('course_id')
          .eq('student_id', user.id);
        
        courseIds = enrollments?.map(e => e.course_id) || [];
      } else if (user?.role === 'instructor') {
        // Get instructor's course IDs
        const { data: courses } = await supabase
          .from('courses')
          .select('id')
          .eq('instructor_id', user.id);
        
        courseIds = courses?.map(c => c.id) || [];
      }

      if (courseIds.length === 0) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('discussions')
        .select(`
          *,
          course:courses(*),
          creator:profiles(*),
          posts_count:discussion_posts(count)
        `)
        .in('course_id', courseIds)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process the data to get post counts
      const discussionsWithCounts = data?.map(discussion => ({
        ...discussion,
        posts_count: discussion.posts_count?.[0]?.count || 0
      })) || [];

      setDiscussions(discussionsWithCounts);
    } catch (error) {
      console.error('Error fetching discussions:', error);
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Discussions</h1>
            <p className="text-gray-600">
              {user?.role === 'student' 
                ? 'Participate in course discussions and connect with classmates'
                : 'Manage course discussions and engage with students'
              }
            </p>
          </div>
          {user?.role === 'instructor' && (
            <Link
              to="/instructor/discussions/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Start Discussion
            </Link>
          )}
        </div>

        {discussions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No discussions yet</h3>
            <p className="text-gray-600">
              {user?.role === 'student' 
                ? 'Discussions will appear here when instructors create them'
                : 'Start your first discussion to engage with students'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {discussions.map((discussion) => (
              <Link
                key={discussion.id}
                to={`/discussions/${discussion.id}`}
                className="block bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-blue-300 transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200">
                        {discussion.title}
                      </h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {discussion.course?.title}
                      </span>
                    </div>
                    
                    {discussion.description && (
                      <p className="text-gray-600 mb-3 line-clamp-2">{discussion.description}</p>
                    )}
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>Started by {discussion.creator?.full_name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{discussion.posts_count} {discussion.posts_count === 1 ? 'reply' : 'replies'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(discussion.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="ml-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}