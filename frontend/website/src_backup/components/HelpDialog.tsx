import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  HelpCircle, 
  Home, 
  Users, 
  BookOpen, 
  TrendingUp, 
  MessageCircle, 
  Star, 
  Flame, 
  Trophy, 
  Camera, 
  Upload,
  Gift,
  BarChart3,
  UserPlus
} from 'lucide-react';

interface HelpDialogProps {
  userRole: 'parent' | 'teacher' | 'staff';
  currentSection?: string;
}

export function HelpDialog({ userRole, currentSection }: HelpDialogProps) {
  const parentFeatures = [
    {
      icon: Home,
      title: 'Home Dashboard',
      description: 'View your child\'s progress, daily tasks, and quick stats',
      steps: [
        'Check weekly progress bar to see completion status',
        'View current streak days and total stars earned',
        'Complete today\'s tasks to earn points and stars',
        'Track your child\'s level and total points'
      ]
    },
    {
      icon: Users,
      title: 'Community Forum',
      description: 'Connect with other parents and access REACH resources',
      steps: [
        'Share your child\'s achievements and ask questions',
        'View posts from REACH team with educational resources',
        'Like and comment on posts to engage with community',
        'Upload photos and videos to share experiences'
      ]
    },
    {
      icon: BookOpen,
      title: 'Assignments',
      description: 'Upload homework and view teacher feedback',
      steps: [
        'Check pending assignments with due dates',
        'Take photos or upload files for homework submission',
        'View submitted assignments waiting for feedback',
        'Read teacher comments and grades in completed section'
      ]
    },
    {
      icon: TrendingUp,
      title: 'Progress Report',
      description: 'Monitor your child\'s learning journey and achievements',
      steps: [
        'View learning progress charts across subjects',
        'Track recent achievements and badges earned',
        'Monitor subject-specific performance metrics',
        'See weekly summary and completion rates'
      ]
    },
    {
      icon: MessageCircle,
      title: 'Chat with REACH',
      description: 'Direct communication with teachers and staff',
      steps: [
        'Send messages to ask questions about assignments',
        'Use quick reply buttons for common responses',
        'Attach photos or files to your messages',
        'Get real-time responses from REACH team'
      ]
    }
  ];

  const gamificationFeatures = [
    {
      icon: Star,
      title: 'Star System',
      description: 'Earn stars by completing assignments and activities',
      color: 'text-yellow-600'
    },
    {
      icon: Flame,
      title: 'Daily Streaks',
      description: 'Maintain learning streaks by completing daily tasks',
      color: 'text-orange-600'
    },
    {
      icon: Trophy,
      title: 'Levels & Points',
      description: 'Gain experience points and level up as your child progresses',
      color: 'text-purple-600'
    },
    {
      icon: Gift,
      title: 'Rewards Store',
      description: 'Exchange points for rewards and incentives',
      color: 'text-green-600'
    }
  ];

  const staffFeatures = [
    {
      icon: Home,
      title: 'Dashboard Overview',
      description: 'Monitor system-wide metrics and urgent tasks',
      steps: [
        'View total families and active students',
        'Check pending assignments requiring review',
        'Monitor average engagement across platform',
        'Review recent activity and urgent tasks'
      ]
    },
    {
      icon: BookOpen,
      title: 'Assignment Management',
      description: 'Grade submissions and provide feedback',
      steps: [
        'Review pending submissions from students',
        'Grade assignments with standardized criteria',
        'Provide constructive feedback for improvement',
        'Track graded assignments and completion rates'
      ]
    },
    {
      icon: UserPlus,
      title: 'Account Management',
      description: 'Create and manage parent/student accounts',
      steps: [
        'Add new family accounts to the system',
        'Monitor parent engagement and activity',
        'Send messages to parents when needed',
        'Track account status and completion rates'
      ]
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Analyze student performance and engagement trends',
      steps: [
        'Review monthly assignment completion trends',
        'Monitor subject-specific performance averages',
        'Track overall student engagement metrics',
        'Generate reports for program improvement'
      ]
    }
  ];

  const teacherFeatures = [
    {
      icon: Home,
      title: 'Student Dashboard',
      description: 'Monitor individual student progress and performance',
      steps: [
        'View class overview with completion statistics',
        'Review individual student performance cards',
        'Track assignment progress and scores',
        'Add notes and feedback for students'
      ]
    }
  ];

  const getHelpContent = () => {
    switch (userRole) {
      case 'parent':
        return {
          title: 'Parent Guide',
          description: 'Learn how to support your child\'s learning journey with REACH',
          features: parentFeatures,
          showGamification: true
        };
      case 'staff':
        return {
          title: 'Staff Guide',
          description: 'Manage the REACH platform and support families',
          features: staffFeatures,
          showGamification: false
        };
      case 'teacher':
        return {
          title: 'Teacher Guide',
          description: 'Monitor and support your students\' progress',
          features: teacherFeatures,
          showGamification: false
        };
      default:
        return {
          title: 'Help Guide',
          description: 'Welcome to REACH',
          features: [],
          showGamification: false
        };
    }
  };

  const helpContent = getHelpContent();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
          <HelpCircle className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <span>{helpContent.title}</span>
          </DialogTitle>
          <DialogDescription>
            {helpContent.description}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="features" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          </TabsList>

          <TabsContent value="features" className="space-y-4 mt-4">
            {helpContent.features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center space-x-2">
                      <Icon className="w-5 h-5 text-blue-600" />
                      <span>{feature.title}</span>
                    </CardTitle>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ol className="space-y-2">
                      {feature.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start space-x-2">
                          <Badge variant="outline" className="mt-0.5 text-xs min-w-[20px] h-5 flex items-center justify-center">
                            {stepIndex + 1}
                          </Badge>
                          <span className="text-sm text-gray-700">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              );
            })}

            {helpContent.showGamification && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">🎮 Gamification Features</CardTitle>
                  <p className="text-sm text-gray-600">Keep your child motivated with our reward system</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {gamificationFeatures.map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Icon className={`w-5 h-5 ${feature.color}`} />
                          <div>
                            <p className="text-sm text-gray-900">{feature.title}</p>
                            <p className="text-xs text-gray-600">{feature.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="getting-started" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">🚀 Quick Start Guide</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {userRole === 'parent' && (
                  <ol className="space-y-3">
                    <li className="flex items-start space-x-2">
                      <Badge className="mt-0.5 bg-blue-500">1</Badge>
                      <div>
                        <p className="text-sm text-gray-900">Explore the Home Dashboard</p>
                        <p className="text-xs text-gray-600">Check your child's current progress and today's tasks</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Badge className="mt-0.5 bg-blue-500">2</Badge>
                      <div>
                        <p className="text-sm text-gray-900">Complete Pending Assignments</p>
                        <p className="text-xs text-gray-600">Use camera or upload feature to submit homework</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Badge className="mt-0.5 bg-blue-500">3</Badge>
                      <div>
                        <p className="text-sm text-gray-900">Join the Community</p>
                        <p className="text-xs text-gray-600">Share experiences and get tips from other parents</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Badge className="mt-0.5 bg-blue-500">4</Badge>
                      <div>
                        <p className="text-sm text-gray-900">Track Progress</p>
                        <p className="text-xs text-gray-600">Monitor your child's learning journey and achievements</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Badge className="mt-0.5 bg-blue-500">5</Badge>
                      <div>
                        <p className="text-sm text-gray-900">Chat with Teachers</p>
                        <p className="text-xs text-gray-600">Ask questions and get support from REACH staff</p>
                      </div>
                    </li>
                  </ol>
                )}

                {userRole === 'staff' && (
                  <ol className="space-y-3">
                    <li className="flex items-start space-x-2">
                      <Badge className="mt-0.5 bg-green-500">1</Badge>
                      <div>
                        <p className="text-sm text-gray-900">Review Dashboard Overview</p>
                        <p className="text-xs text-gray-600">Check urgent tasks and system metrics</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Badge className="mt-0.5 bg-green-500">2</Badge>
                      <div>
                        <p className="text-sm text-gray-900">Grade Pending Assignments</p>
                        <p className="text-xs text-gray-600">Provide feedback and grades for student submissions</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Badge className="mt-0.5 bg-green-500">3</Badge>
                      <div>
                        <p className="text-sm text-gray-900">Manage Parent Accounts</p>
                        <p className="text-xs text-gray-600">Add new families and monitor engagement</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Badge className="mt-0.5 bg-green-500">4</Badge>
                      <div>
                        <p className="text-sm text-gray-900">Analyze Performance</p>
                        <p className="text-xs text-gray-600">Review analytics and generate reports</p>
                      </div>
                    </li>
                  </ol>
                )}

                {userRole === 'teacher' && (
                  <ol className="space-y-3">
                    <li className="flex items-start space-x-2">
                      <Badge className="mt-0.5 bg-purple-500">1</Badge>
                      <div>
                        <p className="text-sm text-gray-900">Review Class Overview</p>
                        <p className="text-xs text-gray-600">Check overall class performance and completion rates</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Badge className="mt-0.5 bg-purple-500">2</Badge>
                      <div>
                        <p className="text-sm text-gray-900">Monitor Individual Students</p>
                        <p className="text-xs text-gray-600">Track each student's progress and performance</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Badge className="mt-0.5 bg-purple-500">3</Badge>
                      <div>
                        <p className="text-sm text-gray-900">Add Teaching Notes</p>
                        <p className="text-xs text-gray-600">Document observations and feedback for students</p>
                      </div>
                    </li>
                  </ol>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">💡 Tips for Success</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {userRole === 'parent' && (
                    <>
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <p className="text-sm text-gray-700">Complete tasks daily to maintain streaks and earn more stars</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <p className="text-sm text-gray-700">Take clear photos of homework for better teacher feedback</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <p className="text-sm text-gray-700">Engage with the community to share experiences and get tips</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <p className="text-sm text-gray-700">Use the chat feature to ask questions about assignments</p>
                      </div>
                    </>
                  )}

                  {userRole === 'staff' && (
                    <>
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <p className="text-sm text-gray-700">Provide detailed feedback to help students improve</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <p className="text-sm text-gray-700">Respond to parent messages promptly to maintain engagement</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <p className="text-sm text-gray-700">Monitor analytics regularly to identify improvement areas</p>
                      </div>
                    </>
                  )}

                  {userRole === 'teacher' && (
                    <>
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <p className="text-sm text-gray-700">Review student progress weekly to identify those needing support</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <p className="text-sm text-gray-700">Add detailed notes to track student development over time</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}