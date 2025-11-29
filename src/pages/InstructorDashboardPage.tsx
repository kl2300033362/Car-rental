import React from 'react';
import { Users, BookOpen, FileText, Home } from 'lucide-react';

export default function InstructorDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Users className="w-6 h-6 mr-2 text-purple-600" />
              Instructor Dashboard
            </h1>
            <nav className="flex items-center space-x-4">
              <a href="/" className="flex items-center text-gray-600 hover:text-purple-600 transition-colors">
                <Home className="w-4 h-4 mr-1" />
                Main Dashboard
              </a>
              <a href="/courses" className="flex items-center text-gray-600 hover:text-purple-600 transition-colors">
                <BookOpen className="w-4 h-4 mr-1" />
                Courses
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Stats */}
          {[
            { title: 'Active Courses', value: '8', icon: BookOpen, color: 'blue' },
            { title: 'Total Students', value: '156', icon: Users, color: 'green' },
            { title: 'Pending Reviews', value: '23', icon: FileText, color: 'yellow' }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Instructor Control Panel</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Manage your courses, students, and assignments. Create content, track progress, and engage with your learning community.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {[
              { title: 'Create New Course', desc: 'Build and publish new learning content', color: 'blue' },
              { title: 'Student Analytics', desc: 'Track student progress and engagement', color: 'green' },
              { title: 'Grade Assignments', desc: 'Review and grade student submissions', color: 'yellow' },
              { title: 'Course Settings', desc: 'Manage course configurations and access', color: 'purple' }
            ].map((feature, index) => (
              <div key={index} className={`border-2 border-gray-200 rounded-lg p-4 hover:border-${feature.color}-300 transition-colors cursor-pointer`}>
                <h3 className="font-medium text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Main Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
