import React, { useState, useEffect } from 'react';
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
  ShoppingBag,
  Loader2
} from 'lucide-react';
import { apiService } from '../../services/api';
import { useParentContext } from '../contexts/ParentContext';

interface Assignment {
  id: number;
  title: string;
  subject: string;
  due_date: string;
  points: number;
  description: string;
  status?: 'pending' | 'submitted' | 'graded';
  assigned_to?: number[];
}

interface User {
  id: string;
  name: string;
  role: string;
  children_name?: string;
  parent_name?: string;
  points?: number;
  weekly_points?: number;
  streaks?: number;
}

interface ParentHomeProps {
  user: User;
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
  const { state } = useParentContext();
  const currentUser = state.user;
  const dashboard = state.dashboard;
  
  // Log user ID for debugging
  console.log('ParentHome - Current User ID:', currentUser?.id);
  
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser?.id) return;
      
      setLoading(true);
      try {
        // Fetch assignments
        const assignmentResponse = await apiService.getUserAssignments(parseInt(currentUser.id));
        if (assignmentResponse.success && assignmentResponse.data) {
          setAssignments(assignmentResponse.data as Assignment[]);
        }

        // Fetch user data to get latest points and streaks
        const userResponse = await apiService.getUserById(currentUser.id);
        if (userResponse.success && userResponse.data) {
          // Update user context if needed
          // You might want to update the user context here
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser?.id]);

  // Get today's pending assignments
  const todaysTasks = assignments.filter(assignment => {
    const dueDate = new Date(assignment.due_date);
    const today = new Date();
    return dueDate.toDateString() === today.toDateString() && !completedTasks.includes(assignment.id.toString());
  });

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

  const currentPoints = dashboard?.totalPoints || 0;
  const currentStreak = dashboard?.currentStreak || 0;
  const completedToday = completedTasks.length;
  const totalToday = todaysTasks.length;
  const todaysPoints = todaysTasks
    .filter(task => completedTasks.includes(task.id.toString()))
    .reduce((sum, task) => sum + task.points, 0);

  const completeTask = async (assignmentId: string) => {
    try {
      // In a real implementation, you would submit the assignment here
      // For now, we'll just mark it as completed locally
      setCompletedTasks(prev => [...prev, assignmentId]);
      
      // You could also call the API to submit the assignment
      // const response = await apiService.submitAssignment(parseInt(assignmentId), formData);
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const getTypeColor = (subject: string) => {
    const lowerSubject = subject.toLowerCase();
    if (lowerSubject.includes('reading') || lowerSubject.includes('english')) return 'bg-blue-100 text-blue-800';
    if (lowerSubject.includes('math')) return 'bg-green-100 text-green-800';
    if (lowerSubject.includes('writing')) return 'bg-purple-100 text-purple-800';
    if (lowerSubject.includes('art') || lowerSubject.includes('creative')) return 'bg-pink-100 text-pink-800';
    return 'bg-gray-100 text-gray-800';
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
          Let's help {currentUser?.childName || 'your child'} learn and grow today
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
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading assignments...</span>
            </div>
          ) : todaysTasks.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No assignments for today</p>
              <p className="text-sm text-gray-400">Check back later for new tasks!</p>
            </div>
          ) : (
            todaysTasks.map((task) => {
              const isCompleted = completedTasks.includes(task.id.toString());
              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    isCompleted 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge className={getTypeColor(task.subject)} variant="secondary">
                          {task.subject}
                        </Badge>
                        <span className="text-sm text-gray-600">+{task.points} points</span>
                      </div>
                      <h4 className="text-gray-900 mb-1">{task.title}</h4>
                      <p className="text-sm text-gray-600">{task.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Due: {new Date(task.due_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="ml-4">
                      {isCompleted ? (
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => completeTask(task.id.toString())}
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          Mark Done
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
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