import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Users, BookOpen, CheckCircle, AlertCircle, TrendingUp, Calendar, MessageCircle, Star } from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: string;
}

interface StaffDashboardProps {
  user: User;
}

export function StaffDashboard({ user }: StaffDashboardProps) {
  // Mock data - in real app, this would come from API
  const stats = {
    totalFamilies: 127,
    activeStudents: 95,
    pendingAssignments: 23,
    completedThisWeek: 67,
    averageEngagement: 85,
    newMessages: 8,
  };

  const recentActivity = [
    {
      id: '1',
      type: 'assignment_submitted',
      student: 'Emma Chen',
      parent: 'Sarah Chen',
      content: 'Math Worksheet - Addition',
      time: '2 hours ago',
    },
    {
      id: '2',
      type: 'new_message',
      student: 'Alex Wong',
      parent: 'Lisa Wong',
      content: 'Question about reading homework',
      time: '3 hours ago',
    },
    {
      id: '3',
      type: 'account_created',
      student: 'Sophie Lee',
      parent: 'David Lee',
      content: 'New family account created',
      time: '1 day ago',
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'assignment_submitted':
        return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'new_message':
        return <MessageCircle className="w-4 h-4 text-green-500" />;
      case 'account_created':
        return <Users className="w-4 h-4 text-purple-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl text-gray-900">{stats.totalFamilies}</p>
                <p className="text-xs text-gray-600">Total Families</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl text-gray-900">{stats.activeStudents}</p>
                <p className="text-xs text-gray-600">Active Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl text-gray-900">{stats.pendingAssignments}</p>
                <p className="text-xs text-gray-600">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl text-gray-900">{stats.averageEngagement}%</p>
                <p className="text-xs text-gray-600">Avg Engagement</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              {getActivityIcon(activity.type)}
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{activity.student}</span> ({activity.parent})
                </p>
                <p className="text-sm text-gray-600">{activity.content}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>


    </div>
  );
}