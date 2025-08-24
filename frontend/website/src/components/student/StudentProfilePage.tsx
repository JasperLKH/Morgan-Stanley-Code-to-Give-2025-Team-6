import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { 
  User, 
  Star, 
  Trophy, 
  Calendar,
  Target,
  Clock,
  Award,
  TrendingUp,
  BookOpen,
  Mic
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: string;
}

interface StudentProfilePageProps {
  user: User;
}

export function StudentProfilePage({ user }: StudentProfilePageProps) {
  const studentProfile = {
    username: user.id,
    displayName: user.name || user.id,
    joinDate: '2024-07-15',
    school: 'St. Mary\'s Primary School',
    level: 'Intermediate',
    totalPoints: 245,
    currentStreak: 5,
    bestStreak: 12,
    wordsLearned: 156,
    assignmentsCompleted: 23,
    averageScore: 87,
    weeklyRank: 4,
    totalRank: 15
  };

  const achievements = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first pronunciation',
      icon: '👶',
      earned: true,
      earnedDate: '2024-07-15'
    },
    {
      id: '2',
      title: '5-Day Streak',
      description: 'Practice for 5 days in a row',
      icon: '🔥',
      earned: true,
      earnedDate: '2024-08-20'
    },
    {
      id: '3',
      title: 'Perfect Score',
      description: 'Get 100% on a pronunciation',
      icon: '💯',
      earned: true,
      earnedDate: '2024-08-18'
    },
    {
      id: '4',
      title: 'Word Master',
      description: 'Learn 100 words',
      icon: '📚',
      earned: true,
      earnedDate: '2024-08-22'
    },
    {
      id: '5',
      title: '10-Day Streak',
      description: 'Practice for 10 days in a row',
      icon: '⚡',
      earned: false,
      earnedDate: null
    },
    {
      id: '6',
      title: 'Speed Learner',
      description: 'Complete 5 words in one day',
      icon: '🚀',
      earned: false,
      earnedDate: null
    }
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'pronunciation',
      activity: 'Practiced "butterfly"',
      score: 92,
      date: '2024-08-24',
      time: '10:30 AM'
    },
    {
      id: '2',
      type: 'assignment',
      activity: 'Completed Animal Words task',
      score: 95,
      date: '2024-08-24',
      time: '9:15 AM'
    },
    {
      id: '3',
      type: 'achievement',
      activity: 'Earned "Word Master" badge',
      score: null,
      date: '2024-08-22',
      time: '2:45 PM'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'pronunciation': return <Mic className="w-4 h-4 text-blue-500" />;
      case 'assignment': return <BookOpen className="w-4 h-4 text-green-500" />;
      case 'achievement': return <Trophy className="w-4 h-4 text-yellow-500" />;
      default: return <Star className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Profile Header */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-400 text-white text-2xl">
                {studentProfile.displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h1 className="text-2xl text-gray-900 mb-1">
                {studentProfile.displayName}
              </h1>
              <p className="text-gray-600 mb-2">@{studentProfile.username}</p>
              <p className="text-sm text-gray-500">{studentProfile.school}</p>
              <div className="flex items-center space-x-4 mt-3">
                <Badge className="bg-purple-100 text-purple-800 border-0">
                  🏆 {studentProfile.level} Level
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 border-0">
                  #{studentProfile.weeklyRank} This Week
                </Badge>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl">
              <div className="text-2xl text-yellow-600 mb-1">
                {studentProfile.totalPoints}
              </div>
              <div className="text-sm text-gray-600">Total Points</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl">
              <div className="text-2xl text-red-600 mb-1">
                {studentProfile.currentStreak}
              </div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Statistics */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span>My Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Words Learned</span>
                <span className="text-sm text-gray-900">{studentProfile.wordsLearned}</span>
              </div>
              <Progress value={78} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">78% of target (200 words)</p>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Average Score</span>
                <span className="text-sm text-gray-900">{studentProfile.averageScore}%</span>
              </div>
              <Progress value={studentProfile.averageScore} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">Excellent performance!</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="text-xl text-gray-900 mb-1">
                {studentProfile.assignmentsCompleted}
              </div>
              <div className="text-xs text-gray-600">Tasks Done</div>
            </div>
            
            <div className="text-center">
              <div className="text-xl text-gray-900 mb-1">
                {studentProfile.bestStreak}
              </div>
              <div className="text-xs text-gray-600">Best Streak</div>
            </div>
            
            <div className="text-center">
              <div className="text-xl text-gray-900 mb-1">
                #{studentProfile.totalRank}
              </div>
              <div className="text-xs text-gray-600">Overall Rank</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-yellow-500" />
            <span>Achievements</span>
            <Badge className="bg-yellow-100 text-yellow-800 border-0">
              {achievements.filter(a => a.earned).length}/{achievements.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl border-2 transition-all ${
                  achievement.earned
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <h4 className="font-medium text-gray-900 text-sm mb-1">
                    {achievement.title}
                  </h4>
                  <p className="text-xs text-gray-600 mb-2">
                    {achievement.description}
                  </p>
                  {achievement.earned ? (
                    <Badge className="bg-green-100 text-green-800 border-0 text-xs">
                      ✓ Earned
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      Locked
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                {getActivityIcon(activity.type)}
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.activity}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.date).toLocaleDateString()} at {activity.time}
                  </p>
                </div>
                {activity.score && (
                  <Badge className="bg-blue-100 text-blue-800 border-0">
                    {activity.score}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5 text-gray-500" />
            <span>Account Info</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Username</span>
            <span className="text-sm text-gray-900">{studentProfile.username}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">School</span>
            <span className="text-sm text-gray-900">{studentProfile.school}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Member since</span>
            <span className="text-sm text-gray-900">
              {new Date(studentProfile.joinDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Current Level</span>
            <span className="text-sm text-gray-900">{studentProfile.level}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}