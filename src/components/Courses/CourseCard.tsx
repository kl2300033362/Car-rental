import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Award, BookOpen } from 'lucide-react';
import { Course } from '../../types';

interface CourseCardProps {
  course: Course;
  showEnrollButton?: boolean;
  onEnroll?: (courseId: string) => void;
  enrolled?: boolean;
}

export function CourseCard({ course, showEnrollButton = true, onEnroll, enrolled = false }: CourseCardProps) {
  const handleEnroll = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onEnroll) {
      onEnroll(course.id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 group">
      <div className="relative">
        {course.thumbnail_url ? (
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center group-hover:from-blue-600 group-hover:to-purple-600 transition-colors duration-200">
            <BookOpen className="h-16 w-16 text-white" />
          </div>
        )}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            course.difficulty_level === 'Beginner' 
              ? 'bg-green-100 text-green-800' 
              : course.difficulty_level === 'Intermediate'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {course.difficulty_level}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-3">
          <Link to={`/courses/${course.id}`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors duration-200 line-clamp-2">
              {course.title}
            </h3>
          </Link>
          <p className="text-gray-600 text-sm line-clamp-2">{course.description}</p>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            {course.duration_hours && (
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{course.duration_hours}h</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Award className="h-4 w-4" />
              <span>Certificate</span>
            </div>
          </div>
        </div>

        {course.instructor && (
          <div className="mb-4 pb-4 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-white">
                  {course.instructor.full_name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-gray-600">{course.instructor.full_name}</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {course.price && course.price > 0 ? (
              <span className="text-lg font-bold text-gray-900">${course.price}</span>
            ) : (
              <span className="text-lg font-bold text-green-600">Free</span>
            )}
          </div>

          {showEnrollButton && (
            <div>
              {enrolled ? (
                <Link
                  to={`/courses/${course.id}`}
                  className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium text-sm hover:bg-green-200 transition-colors duration-200"
                >
                  Continue
                </Link>
              ) : (
                <button
                  onClick={handleEnroll}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors duration-200"
                >
                  Enroll Now
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}