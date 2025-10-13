import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { BookOpen, Users, Award, TrendingUp, LogOut, User as UserIcon } from 'lucide-react';

export function Dashboard() {
  const { user, signOut } = useAuth();

  const studentStats = [
    { icon: BookOpen, label: 'Enrolled Courses', value: '5', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: Award, label: 'Certificates', value: '2', color: 'text-green-600', bg: 'bg-green-50' },
    { icon: TrendingUp, label: 'Progress', value: '78%', color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const instructorStats = [
    { icon: BookOpen, label: 'Created Courses', value: '12', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: Users, label: 'Total Students', value: '248', color: 'text-green-600', bg: 'bg-green-50' },
    { icon: Award, label: 'Certificates Issued', value: '156', color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const stats = user?.role === 'instructor' ? instructorStats : studentStats;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user.full_name}!
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {user.role === 'instructor' 
                  ? 'Manage your courses and students' 
                  : 'Continue your learning journey'
                }
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.full_name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-gray-500" />
                  </div>
                )}
                <div className="text-sm">
                  <p className="text-gray-900 font-medium">{user.full_name}</p>
                  <p className="text-gray-500">{user.email}</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full capitalize">
                  {user.role}
                </span>
              </div>
              
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors px-3 py-1 rounded-lg hover:bg-gray-100"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/courses"
                className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <BookOpen className="w-6 h-6 text-blue-600 mr-3 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="font-medium text-gray-900">Browse Courses</h3>
                  <p className="text-sm text-gray-500">Explore available courses</p>
                </div>
              </a>
              
              <a
                href="/assignments"
                className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group"
              >
                <Award className="w-6 h-6 text-green-600 mr-3 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="font-medium text-gray-900">Assignments</h3>
                  <p className="text-sm text-gray-500">
                    {user.role === 'instructor' ? 'Manage assignments' : 'View assignments'}
                  </p>
                </div>
              </a>

              {user.role === 'instructor' && (
                <a
                  href="/instructor"
                  className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group"
                >
                  <Users className="w-6 h-6 text-purple-600 mr-3 group-hover:scale-110 transition-transform" />
                  <div>
                    <h3 className="font-medium text-gray-900">Instructor Panel</h3>
                    <p className="text-sm text-gray-500">Manage your courses</p>
                  </div>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {user.role === 'instructor' ? 'Recent Activity' : 'Continue Learning'}
            </h2>
          </div>
          <div className="p-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {user.role === 'instructor' ? 'No Recent Activity' : 'Ready to Learn?'}
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {user.role === 'instructor' 
                  ? 'Your recent course activity and student interactions will appear here. Start by creating your first course!'
                  : 'Start exploring courses to see your learning progress here. Find courses that match your interests!'
                }
              </p>
              <a
                href="/courses"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                {user.role === 'instructor' ? 'Browse Courses' : 'Explore Courses'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}