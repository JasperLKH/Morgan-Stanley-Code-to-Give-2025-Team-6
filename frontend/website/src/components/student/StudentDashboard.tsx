import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Star, 
  Heart, 
  BookOpen, 
  CheckCircle, 
  Calendar,
  Trophy,
  Target,
  Mic,
  Play
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: string;
}

interface StudentDashboardProps {
  user: User;
}

export function StudentDashboard({ user }: StudentDashboardProps) {
  // Mock student data - in real app, this would come from API
  const studentData = {
    name: user.name || user.id,
    points: 245,
    streak: 5,
    level: 'Intermediate',
    todaysWords: 8,
    targetWords: 10,
    completedAssignments: 3,
    pendingAssignments: 2,
    weeklyRank: 4
  };

  const recentActivity = [
    { 
      id: '1', 
      type: 'pronunciation', 
      word: 'butterfly', 
      score: 92, 
      time: '10 mins ago',
      emoji: '🦋'
    },
    { 
      id: '2', 
      type: 'assignment', 
      word: 'completed homework', 
      score: 95, 
      time: '2 hours ago',
      emoji: '📝'
    },
    { 
      id: '3', 
      type: 'pronunciation', 
      word: 'rainbow', 
      score: 88, 
      time: '1 day ago',
      emoji: '🌈'
    }
  ];

  const upcomingTasks = [
    {
      id: '1',
      title: 'Practice Words: Animals',
      words: ['elephant', 'butterfly', 'penguin'],
      dueDate: 'Today',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Reading Assignment',
      words: ['wonderful', 'beautiful', 'colorful'],
      dueDate: 'Tomorrow',
      priority: 'medium'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-2xl text-gray-900 mb-2">
          Welcome back! 🌟
        </h1>
        <p className="text-gray-600">
          You're doing great! Keep up the excellent work.
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl text-gray-900 mb-1">
                {studentData.points}
              </div>
              <div className="text-sm text-gray-600">Total Points</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-red-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl text-gray-900 mb-1">
                {studentData.streak}
              </div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Today's Progress</span>
                <span className="text-sm text-gray-900">
                  {studentData.todaysWords}/{studentData.targetWords} words
                </span>
              </div>
              <Progress 
                value={(studentData.todaysWords / studentData.targetWords) * 100} 
                className="h-3"
              />
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <Badge className="bg-purple-100 text-purple-800 border-0">
                  🏆 {studentData.level} Level
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 border-0">
                  #{studentData.weeklyRank} This Week
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white cursor-pointer hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6 text-center">
            <Mic className="w-12 h-12 mx-auto mb-3" />
            <h3 className="font-medium mb-1">Practice Words</h3>
            <p className="text-sm opacity-90">Improve pronunciation</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white cursor-pointer hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6 text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-3" />
            <h3 className="font-medium mb-1">My Tasks</h3>
            <p className="text-sm opacity-90">{studentData.pendingAssignments} pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Tasks */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <h3 className="font-medium text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-orange-500" />
            Upcoming Tasks
          </h3>
          
          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{task.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {task.words.length} words to practice
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {task.words.slice(0, 2).map((word, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {word}
                        </Badge>
                      ))}
                      {task.words.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{task.words.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      className={`text-xs ${
                        task.priority === 'high' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      } border-0`}
                    >
                      {task.dueDate}
                    </Badge>
                  </div>
                </div>
                
                <Button size="sm" className="w-full mt-3 bg-blue-600 hover:bg-blue-700">
                  <Play className="w-4 h-4 mr-2" />
                  Start Practice
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <h3 className="font-medium text-gray-900 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
            Recent Activity
          </h3>
          
          <div className="space-y-3">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-2xl">{item.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 capitalize">
                    {item.type === 'pronunciation' ? 'Pronounced' : 'Completed'}: <strong>{item.word}</strong>
                  </p>
                  <p className="text-xs text-gray-500">{item.time}</p>
                </div>
                <Badge className="bg-green-100 text-green-800 border-0">
                  {item.score}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}