import React from 'react';
import { BookOpen, FileText, Home } from 'lucide-react';

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <BookOpen className="w-6 h-6 mr-2 text-blue-600" />
              Courses
            </h1>
            <nav className="flex items-center space-x-4">
              <a href="/" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <Home className="w-4 h-4 mr-1" />
                Dashboard
              </a>
              <a href="/assignments" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <FileText className="w-4 h-4 mr-1" />
                Assignments
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Course Catalog</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Explore our comprehensive course catalog. This feature will include course browsing, enrollment, and progress tracking.
          </p>

          {/* Sample course cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {[
              { title: 'React Fundamentals', students: '120', level: 'Beginner' },
              { title: 'Advanced JavaScript', students: '85', level: 'Advanced' },
              { title: 'UI/UX Design', students: '95', level: 'Intermediate' }
            ].map((course, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <h3 className="font-medium text-gray-900 mb-2">{course.title}</h3>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>{course.students} students enrolled</p>
                  <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs">{course.level}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
