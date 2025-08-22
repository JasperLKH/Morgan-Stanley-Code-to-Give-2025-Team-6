import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, BookOpen, Target, Award } from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: string;
}

interface PerformanceAnalyticsProps {
  user: User;
}

export function PerformanceAnalytics({ user }: PerformanceAnalyticsProps) {
  const monthlyData = [
    { month: 'Jul', completed: 45, submitted: 52 },
    { month: 'Aug', completed: 67, submitted: 78 },
  ];

  const subjectPerformance = [
    { subject: 'Math', average: 82 },
    { subject: 'Reading', average: 88 },
    { subject: 'Art', average: 91 },
    { subject: 'Social', average: 79 },
  ];

  const stats = {
    totalStudents: 95,
    averageCompletion: 84,
    totalAssignments: 156,
    parentEngagement: 92,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl text-gray-900">Performance Analytics</h2>
        <p className="text-sm text-gray-600">Overview of student performance and engagement</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl text-gray-900">{stats.totalStudents}</p>
            <p className="text-xs text-gray-600">Active Students</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl text-gray-900">{stats.averageCompletion}%</p>
            <p className="text-xs text-gray-600">Avg Completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl text-gray-900">{stats.totalAssignments}</p>
            <p className="text-xs text-gray-600">Total Assignments</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-2xl text-gray-900">{stats.parentEngagement}%</p>
            <p className="text-xs text-gray-600">Parent Engagement</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Monthly Assignment Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Bar dataKey="submitted" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-gray-300 rounded"></div>
              <span className="text-xs text-gray-600">Submitted</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-xs text-gray-600">Completed</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Subject Performance Averages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {subjectPerformance.map((subject, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-900">{subject.subject}</span>
                <span className="text-sm text-gray-600">{subject.average}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${subject.average}%` }}
                ></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}