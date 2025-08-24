import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Star, Target, BookOpen, Calculator, Palette, Award, Loader2 } from 'lucide-react';
import { apiService } from '../../services/api';
import { useUser } from '../../contexts/UserContext';

interface Assignment {
  id: number;
  title: string;
  subject: string;
  due_date: string;
  status?: 'pending' | 'submitted' | 'graded';
  points: number;
  grade?: string;
  submitted_at?: string;
}

export function PerformancePage() {
  const { user: currentUser } = useUser();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser?.id) return;
      
      setLoading(true);
      try {
        const response = await apiService.getUserAssignments(parseInt(currentUser.id));
        if (response.success && response.data) {
          setAssignments(response.data as Assignment[]);
        }
      } catch (error) {
        console.error('Error fetching performance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser?.id]);

  // Calculate performance data from assignments
  const calculatePerformanceData = () => {
    const gradedAssignments = assignments.filter(a => a.status === 'graded');
    const completedAssignments = assignments.filter(a => a.status === 'graded' || a.status === 'submitted');
    
    // Group by subject
    const subjectStats = assignments.reduce((acc, assignment) => {
      const subject = assignment.subject;
      if (!acc[subject]) {
        acc[subject] = { total: 0, completed: 0, graded: 0, points: 0 };
      }
      acc[subject].total++;
      if (assignment.status === 'graded' || assignment.status === 'submitted') {
        acc[subject].completed++;
      }
      if (assignment.status === 'graded') {
        acc[subject].graded++;
        acc[subject].points += assignment.points;
      }
      return acc;
    }, {} as Record<string, { total: number; completed: number; graded: number; points: number }>);

    // Calculate weekly progress (mock data for chart - in real app you'd track this over time)
    const progressData = [
      { week: 'Week 1', completed: Math.max(0, gradedAssignments.length - 3) },
      { week: 'Week 2', completed: Math.max(0, gradedAssignments.length - 2) },
      { week: 'Week 3', completed: Math.max(0, gradedAssignments.length - 1) },
      { week: 'Week 4', completed: gradedAssignments.length },
    ];

    const totalPoints = gradedAssignments.reduce((sum, a) => sum + a.points, 0);
    const averageScore = gradedAssignments.length > 0 ? totalPoints / gradedAssignments.length : 0;
    
    // Create subject performance array
    const subjectProgress = Object.entries(subjectStats).map(([subject, stats]) => {
      const subjectData = stats as { total: number; completed: number; graded: number; points: number };
      return {
        subject,
        current: subjectData.total > 0 ? (subjectData.completed / subjectData.total) * 100 : 0,
        target: 85,
        color: getSubjectColor(subject)
      };
    });

    return {
      totalAssignments: assignments.length,
      completedAssignments: completedAssignments.length,
      gradedAssignments: gradedAssignments.length,
      averageScore: Math.round(averageScore * 10) / 10, // Round to 1 decimal
      totalPoints,
      progressData,
      subjectProgress,
      subjectStats
    };
  };

  const getSubjectColor = (subject: string) => {
    const colors = {
      'Mathematics': '#3b82f6',
      'English': '#10b981', 
      'Reading': '#10b981',
      'Art': '#f59e0b',
      'Science': '#8b5cf6',
      'Writing': '#ef4444'
    };
    return colors[subject as keyof typeof colors] || '#6b7280';
  };

  const getSubjectIcon = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'mathematics':
      case 'math':
        return Calculator;
      case 'reading':
      case 'english':
        return BookOpen;
      case 'art':
      case 'creative':
        return Palette;
      default:
        return BookOpen;
    }
  };

  const recentAchievements = [
    { 
      title: 'Assignment Streak', 
      description: 'Completed 3 assignments in a row', 
      icon: BookOpen, 
      color: 'green' 
    },
    { 
      title: 'High Score', 
      description: 'Scored above 85% average', 
      icon: Star, 
      color: 'yellow' 
    },
    { 
      title: 'Subject Master', 
      description: 'Excellent progress in all subjects', 
      icon: Award, 
      color: 'purple' 
    },
  ];

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2">Loading performance data...</span>
      </div>
    );
  }

  const performanceData = calculatePerformanceData();

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl text-gray-900">Progress Report</h2>
        <p className="text-sm text-gray-600">
          {currentUser?.children_name || 'Your child'}'s learning journey
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl text-gray-900">
              {performanceData.averageScore > 0 ? `${performanceData.averageScore}` : '0'}
            </p>
            <p className="text-xs text-gray-600">Average Points</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-2xl text-gray-900">{performanceData.totalPoints}</p>
            <p className="text-xs text-gray-600">Total Points</p>
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
              <LineChart data={performanceData.progressData}>
                <XAxis dataKey="week" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis domain={[0, 'dataMax + 1']} axisLine={false} tickLine={false} fontSize={12} />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center mt-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Completed Assignments</span>
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
          {performanceData.subjectProgress.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500">No subject data available yet</p>
              <p className="text-sm text-gray-400">Complete assignments to see progress</p>
            </div>
          ) : (
            performanceData.subjectProgress.map((subject, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-900">{subject.subject}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{Math.round(subject.current)}%</span>
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
            ))
          )}
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
              <p className="text-2xl text-blue-600">
                {performanceData.completedAssignments}/{performanceData.totalAssignments}
              </p>
              <p className="text-xs text-blue-800">Assignments Done</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <p className="text-2xl text-orange-600">{currentUser?.streaks || 0}</p>
              <p className="text-xs text-orange-800">Day Streak</p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800 text-center">
              {performanceData.gradedAssignments > 0 
                ? `Great progress! ${currentUser?.children_name || 'Your child'} has completed ${performanceData.gradedAssignments} assignments and earned ${performanceData.totalPoints} points.`
                : `Keep going! ${currentUser?.children_name || 'Your child'} is just getting started on their learning journey.`
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
