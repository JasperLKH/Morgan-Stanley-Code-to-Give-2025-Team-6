import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Star, Target, BookOpen, Calculator, Palette, Award } from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: string;
  childName?: string;
}

interface PerformancePageProps {
  user: User;
}

export function PerformancePage({ user }: PerformancePageProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Mock data for charts
  const progressData = [
    { week: 'Week 1', math: 65, reading: 70, art: 80 },
    { week: 'Week 2', math: 70, reading: 75, art: 85 },
    { week: 'Week 3', math: 75, reading: 80, art: 82 },
    { week: 'Week 4', math: 80, reading: 85, art: 88 },
  ];

  const subjectProgress = [
    { subject: 'Mathematics', current: 80, target: 85, color: '#3b82f6' },
    { subject: 'Reading', current: 85, target: 90, color: '#10b981' },
    { subject: 'Art & Creativity', current: 88, target: 85, color: '#f59e0b' },
    { subject: 'Social Skills', current: 75, target: 80, color: '#8b5cf6' },
  ];

  const recentAchievements = [
    { title: 'Reading Streak', description: '7 days of daily reading', icon: BookOpen, color: 'green' },
    { title: 'Math Master', description: 'Completed all addition exercises', icon: Calculator, color: 'blue' },
    { title: 'Creative Artist', description: 'Excellent color recognition', icon: Palette, color: 'yellow' },
    { title: 'Star Student', description: 'Earned 50 total stars', icon: Star, color: 'purple' },
  ];

  const weeklyStats = {
    totalAssignments: 12,
    completedAssignments: 10,
    averageScore: 85,
    starsEarned: 15,
    streakDays: 7,
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl text-gray-900">Progress Report</h2>
        <p className="text-sm text-gray-600">{user.childName}'s learning journey</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl text-gray-900">{weeklyStats.averageScore}%</p>
            <p className="text-xs text-gray-600">Average Score</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-2xl text-gray-900">{weeklyStats.starsEarned}</p>
            <p className="text-xs text-gray-600">Stars This Week</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Chart */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Learning Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <XAxis dataKey="week" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis domain={[60, 100]} axisLine={false} tickLine={false} fontSize={12} />
                <Line type="monotone" dataKey="math" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="reading" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="art" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Math</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Reading</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Art</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject Performance */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Target className="w-5 h-5 text-green-600" />
            <span>Subject Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {subjectProgress.map((subject, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-900">{subject.subject}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{subject.current}%</span>
                  <Badge 
                    variant={subject.current >= subject.target ? "default" : "secondary"}
                    className={subject.current >= subject.target ? "bg-green-500" : "bg-gray-200 text-gray-700"}
                  >
                    Target: {subject.target}%
                  </Badge>
                </div>
              </div>
              <Progress value={subject.current} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Award className="w-5 h-5 text-purple-600" />
            <span>Recent Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentAchievements.map((achievement, index) => {
            const Icon = achievement.icon;
            const colorClasses = {
              green: 'bg-green-100 text-green-600',
              blue: 'bg-blue-100 text-blue-600',
              yellow: 'bg-yellow-100 text-yellow-600',
              purple: 'bg-purple-100 text-purple-600',
            };
            
            return (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClasses[achievement.color as keyof typeof colorClasses]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-900">{achievement.title}</p>
                  <p className="text-xs text-gray-600">{achievement.description}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Weekly Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">This Week's Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl text-blue-600">{weeklyStats.completedAssignments}/{weeklyStats.totalAssignments}</p>
              <p className="text-xs text-blue-800">Assignments Done</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <p className="text-2xl text-orange-600">{weeklyStats.streakDays}</p>
              <p className="text-xs text-orange-800">Day Streak</p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800 text-center">
              Excellent progress this week! {user.childName} is showing great improvement in all subjects.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}