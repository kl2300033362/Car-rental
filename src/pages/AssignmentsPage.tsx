import React from 'react';
import { FileText, Home } from 'lucide-react';

export default function AssignmentsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-green-600" />
              Assignments
            </h1>
            <nav className="flex items-center space-x-4">
              <a href="/" className="flex items-center text-gray-600 hover:text-green-600 transition-colors">
                <Home className="w-4 h-4 mr-1" />
                Dashboard
              </a>
              <a href="/courses" className="flex items-center text-gray-600 hover:text-green-600 transition-colors">
                <FileText className="w-4 h-4 mr-1" />
                Courses
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Assignment Management</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Manage your assignments, submissions, and grading. This feature will include assignment creation, submission tracking, and automated grading.
          </p>

          {/* Sample assignment list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {[
              { title: 'React Component Assignment', due: '2 days', status: 'pending' },
              { title: 'JavaScript Algorithm Challenge', due: '5 days', status: 'submitted' },
              { title: 'CSS Layout Project', due: '1 week', status: 'graded' },
              { title: 'Database Design Task', due: '3 days', status: 'pending' }
            ].map((assignment, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 text-left hover:border-green-300 transition-colors">
                <h3 className="font-medium text-gray-900 mb-2">{assignment.title}</h3>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Due in {assignment.due}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    assignment.status === 'graded' ? 'bg-green-100 text-green-800' :
                    assignment.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {assignment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
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
