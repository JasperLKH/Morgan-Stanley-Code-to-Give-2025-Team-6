import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { 
  CheckCircle, 
  Clock, 
  Flame, 
  Gift, 
  BookOpen, 
  Camera, 
  MessageCircle,
  ChevronRight,
  Trophy,
  Ticket,
  Coffee,
  ShoppingBag
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: string;
  childName?: string;
}

interface ParentHomeProps {
  user: User;
}

interface Task {
  id: string;
  title: string;
  type: 'reading' | 'math' | 'writing' | 'art';
  completed: boolean;
  points: number;
  description: string;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: 'voucher' | 'coupon' | 'activity';
  icon: any;
  available: boolean;
}

export function ParentHome({ user }: ParentHomeProps) {
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const todaysTasks: Task[] = [
    {
      id: '1',
      title: 'Read "The Little Red Hen"',
      type: 'reading',
      completed: completedTasks.includes('1'),
      points: 10,
      description: 'Read the story and discuss with your child'
    },
    {
      id: '2',
      title: 'Practice Writing Numbers 1-5',
      type: 'writing',
      completed: completedTasks.includes('2'),
      points: 15,
      description: 'Help your child trace and write numbers'
    },
    {
      id: '3',
      title: 'Counting with Toys',
      type: 'math',
      completed: completedTasks.includes('3'),
      points: 10,
      description: 'Count household items together'
    },
    {
      id: '4',
      title: 'Draw a Family Picture',
      type: 'art',
      completed: completedTasks.includes('4'),
      points: 12,
      description: 'Create art together and talk about family'
    }
  ];

  const rewards: Reward[] = [
    {
      id: '1',
      name: 'McDonald\'s Happy Meal',
      description: 'Free Happy Meal voucher',
      cost: 50,
      category: 'voucher',
      icon: Coffee,
      available: true
    },
    {
      id: '2',
      name: 'Toy Store Discount',
      description: '20% off at Toys"R"Us',
      cost: 75,
      category: 'coupon',
      icon: ShoppingBag,
      available: true
    },
    {
      id: '3',
      name: 'Museum Family Pass',
      description: 'Free entry for family of 4',
      cost: 100,
      category: 'activity',
      icon: Trophy,
      available: true
    },
    {
      id: '4',
      name: 'Cinema Tickets',
      description: '2 free movie tickets',
      cost: 80,
      category: 'voucher',
      icon: Ticket,
      available: false
    }
  ];

  const currentPoints = 185;
  const currentStreak = 5;
  const completedToday = completedTasks.length;
  const totalToday = todaysTasks.length;
  const todaysPoints = todaysTasks
    .filter(task => completedTasks.includes(task.id))
    .reduce((sum, task) => sum + task.points, 0);

  const completeTask = (taskId: string) => {
    setCompletedTasks(prev => [...prev, taskId]);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'reading': return 'bg-blue-100 text-blue-800';
      case 'math': return 'bg-green-100 text-green-800';
      case 'writing': return 'bg-purple-100 text-purple-800';
      case 'art': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'voucher': return Ticket;
      case 'coupon': return Gift;
      case 'activity': return Trophy;
      default: return Gift;
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl text-gray-900">
          Good morning, {user.name}! 👋
        </h1>
        <p className="text-gray-600">
          Let's help {user.childName} learn and grow today
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Gift className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl text-gray-900">{currentPoints}</p>
            <p className="text-xs text-gray-600">Total Points</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Flame className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-2xl text-gray-900">{currentStreak}</p>
            <p className="text-xs text-gray-600">Day Streak</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl text-gray-900">{completedToday}/{totalToday}</p>
            <p className="text-xs text-gray-600">Today's Tasks</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Tasks */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>Today's Tasks</span>
            </span>
            <Badge variant="secondary">
              +{todaysPoints} points earned
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {todaysTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-lg border transition-colors ${
                task.completed 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge className={getTypeColor(task.type)} variant="secondary">
                      {task.type}
                    </Badge>
                    <span className="text-sm text-gray-600">+{task.points} points</span>
                  </div>
                  <h4 className="text-gray-900 mb-1">{task.title}</h4>
                  <p className="text-sm text-gray-600">{task.description}</p>
                </div>
                <div className="ml-4">
                  {task.completed ? (
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => completeTask(task.id)}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      Mark Done
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Rewards Store */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Gift className="w-5 h-5 text-purple-600" />
              <span>Rewards Store</span>
            </span>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Rewards Store</DialogTitle>
                  <DialogDescription>
                    Redeem your points for amazing rewards and vouchers
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  {rewards.map((reward) => {
                    const Icon = reward.icon;
                    const canAfford = currentPoints >= reward.cost;
                    return (
                      <div
                        key={reward.id}
                        className={`p-3 rounded-lg border ${
                          reward.available && canAfford
                            ? 'border-green-200 bg-green-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              reward.available && canAfford
                                ? 'bg-green-100'
                                : 'bg-gray-100'
                            }`}>
                              <Icon className={`w-5 h-5 ${
                                reward.available && canAfford
                                  ? 'text-green-600'
                                  : 'text-gray-400'
                              }`} />
                            </div>
                            <div>
                              <p className="text-sm text-gray-900">{reward.name}</p>
                              <p className="text-xs text-gray-600">{reward.description}</p>
                              <p className="text-xs text-purple-600">{reward.cost} points</p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            disabled={!reward.available || !canAfford}
                            variant={canAfford && reward.available ? "default" : "secondary"}
                          >
                            {!reward.available ? 'Unavailable' : 
                             !canAfford ? 'Need More' : 'Redeem'}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {rewards.slice(0, 4).map((reward) => {
              const Icon = reward.icon;
              const canAfford = currentPoints >= reward.cost;
              return (
                <div
                  key={reward.id}
                  className={`p-3 rounded-lg border text-center ${
                    reward.available && canAfford
                      ? 'border-purple-200 bg-purple-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${
                    reward.available && canAfford
                      ? 'text-purple-600'
                      : 'text-gray-400'
                  }`} />
                  <p className="text-xs text-gray-900 mb-1">{reward.name}</p>
                  <p className="text-xs text-purple-600">{reward.cost} pts</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button className="h-16 flex-col space-y-1" variant="outline">
          <Camera className="w-5 h-5" />
          <span className="text-sm">Upload Homework</span>
        </Button>
        <Button className="h-16 flex-col space-y-1" variant="outline">
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm">Chat with Teachers</span>
        </Button>
      </div>
    </div>
  );
}