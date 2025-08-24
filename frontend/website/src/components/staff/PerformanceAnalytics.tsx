import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip, Legend } from 'recharts';
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
  // Updated data structure with values farther apart between subjects
  const monthlySubjectData = [
    { month: 'Jan', alphabet: 60, vocabulary: 68, phonemic: 75, pointRead: 55 },
    { month: 'Feb', alphabet: 63, vocabulary: 71, phonemic: 78, pointRead: 58 },
    { month: 'Mar', alphabet: 67, vocabulary: 74, phonemic: 81, pointRead: 62 },
    { month: 'Apr', alphabet: 70, vocabulary: 77, phonemic: 83, pointRead: 65 },
    { month: 'May', alphabet: 73, vocabulary: 80, phonemic: 85, pointRead: 68 },
    { month: 'Jun', alphabet: 75, vocabulary: 82, phonemic: 86, pointRead: 70 },
    { month: 'Jul', alphabet: 77, vocabulary: 84, phonemic: 88, pointRead: 72 },
    { month: 'Aug', alphabet: 79, vocabulary: 86, phonemic: 90, pointRead: 74 },
    { month: 'Sep', alphabet: 81, vocabulary: 88, phonemic: 91, pointRead: 76 },
    { month: 'Oct', alphabet: 83, vocabulary: 89, phonemic: 92, pointRead: 78 },
    { month: 'Nov', alphabet: 85, vocabulary: 90, phonemic: 93, pointRead: 80 },
    { month: 'Dec', alphabet: 87, vocabulary: 92, phonemic: 94, pointRead: 82 },
  ];

  const subjectPerformance = [
    { subject: 'Alphabet Recognition', average: 77 },
    { subject: 'Vocabulary Knowledge', average: 83 },
    { subject: 'Phonemic Awareness', average: 86 },
    { subject: 'Point and Read', average: 70 },
  ];

  const stats = {
    totalStudents: 95,
    averageCompletion: 84,
    totalAssignments: 156,
    parentEngagement: 92,
  };

  // Colors for each subject line
  const subjectColors = {
    alphabet: '#3b82f6', // Blue
    vocabulary: '#10b981', // Green
    phonemic: '#8b5cf6', // Purple
    pointRead: '#f59e0b', // Orange
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

      {/* Monthly Performance - Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Monthly Literacy Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlySubjectData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  domain={[50, 100]}
                />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="alphabet" 
                  stroke={subjectColors.alphabet} 
                  strokeWidth={2}
                  dot={{ fill: subjectColors.alphabet, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Alphabet Recognition"
                />
                <Line 
                  type="monotone" 
                  dataKey="vocabulary" 
                  stroke={subjectColors.vocabulary} 
                  strokeWidth={2}
                  dot={{ fill: subjectColors.vocabulary, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Vocabulary Knowledge"
                />
                <Line 
                  type="monotone" 
                  dataKey="phonemic" 
                  stroke={subjectColors.phonemic} 
                  strokeWidth={2}
                  dot={{ fill: subjectColors.phonemic, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Phonemic Awareness"
                />
                <Line 
                  type="monotone" 
                  dataKey="pointRead" 
                  stroke={subjectColors.pointRead} 
                  strokeWidth={2}
                  dot={{ fill: subjectColors.pointRead, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Point and Read"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Subject Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Literacy Skill Average</CardTitle>
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