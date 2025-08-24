import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { useParentContext } from '../contexts/ParentContext';
import { 
  Upload,
  MessageCircle,
  CheckSquare,
  TrendingUp,
  Users,
  Gift,
  Flame,
  Trophy,
  Calendar,
  ChevronRight,
  Globe
} from 'lucide-react';

interface NavigationButton {
  id: string;
  titleKey: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  action: () => void;
}

export function EnhancedParentHome() {
  const { state, dispatch, t } = useParentContext();
  const [timeOfDay, setTimeOfDay] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('morning');
    else if (hour < 18) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');
  }, []);

  // Navigation buttons configuration
  const navigationButtons: NavigationButton[] = [
    {
      id: 'submit-assignment',
      titleKey: 'nav.submitAssignment',
      icon: Upload,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      action: () => console.log('Navigate to Submit Assignment'),
    },
    {
      id: 'chat-reach',
      titleKey: 'nav.chatWithReach',
      icon: MessageCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      action: () => console.log('Navigate to Chat'),
    },
    {
      id: 'tasks-list',
      titleKey: 'nav.tasksList',
      icon: CheckSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      action: () => console.log('Navigate to Tasks'),
    },
    {
      id: 'progress-view',
      titleKey: 'nav.progressView',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      action: () => console.log('Navigate to Progress'),
    },
    {
      id: 'community-forum',
      titleKey: 'nav.communityForum',
      icon: Users,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      action: () => console.log('Navigate to Community'),
    },
    {
      id: 'rewards',
      titleKey: 'nav.rewards',
      icon: Gift,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      action: () => console.log('Navigate to Rewards'),
    },
  ];

  const greetingKey = `dashboard.${timeOfDay}Greeting`;
  
  const toggleLanguage = () => {
    dispatch({ 
      type: 'SET_LANGUAGE', 
      payload: state.language === 'en' ? 'zh' : 'en' 
    });
  };

  const completionPercentage = state.dashboard.todaysTasks.length > 0 
    ? (state.dashboard.completedTasksToday / state.dashboard.todaysTasks.length) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-xl text-gray-900 mb-1">
              {t('dashboard.welcome', 'Good morning')}, {state.user.name}! 👋
            </h1>
            <p className="text-sm text-gray-600">
              {t('dashboard.helpChild', "Let's help")} {state.user.childName} {t('dashboard.learnGrow', 'learn and grow today')}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="ml-4 h-9 w-9 p-0"
            aria-label="Switch Language"
          >
            <Globe className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Dynamic Indicators */}
        <div className="grid grid-cols-3 gap-3">
          {/* Total Points */}
          <Card className="relative overflow-hidden">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl text-gray-900 mb-1">{state.dashboard.totalPoints}</p>
              <p className="text-xs text-gray-600">{t('dashboard.totalPoints')}</p>
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 -z-10" />
            </CardContent>
          </Card>

          {/* Current Streak */}
          <Card className="relative overflow-hidden">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl text-gray-900 mb-1">{state.dashboard.currentStreak}</p>
              <p className="text-xs text-gray-600">{t('dashboard.currentStreak')}</p>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 -z-10" />
            </CardContent>
          </Card>

          {/* Completed Tasks Today */}
          <Card className="relative overflow-hidden">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckSquare className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl text-gray-900 mb-1">
                {state.dashboard.completedTasksToday}/{state.dashboard.todaysTasks.length || 0}
              </p>
              <p className="text-xs text-gray-600">{t('dashboard.completedToday')}</p>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 -z-10" />
            </CardContent>
          </Card>
        </div>

        {/* Progress Overview */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-900">{t('dashboard.todaysProgress', "Today's Progress")}</h3>
              <Badge 
                variant="secondary" 
                className="bg-purple-100 text-purple-800"
              >
                {Math.round(completionPercentage)}%
              </Badge>
            </div>
            <Progress 
              value={completionPercentage} 
              className="h-3 mb-2" 
            />
            <p className="text-sm text-gray-600">
              {t('dashboard.keepGoing', 'Keep going! You\'re doing great!')}
            </p>
          </CardContent>
        </Card>

        {/* Main Navigation Buttons */}
        <div className="space-y-4">
          <h2 className="text-lg text-gray-900 mb-4">
            {t('dashboard.quickActions', 'Quick Actions')}
          </h2>
          
          {/* Primary Actions (Top 2) */}
          <div className="grid grid-cols-2 gap-4">
            {navigationButtons.slice(0, 2).map((button) => {
              const Icon = button.icon;
              return (
                <Button
                  key={button.id}
                  onClick={button.action}
                  className="h-24 flex-col space-y-2 bg-white border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md"
                  variant="ghost"
                >
                  <div className={`w-12 h-12 ${button.bgColor} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${button.color}`} />
                  </div>
                  <span className="text-sm text-gray-700 text-center leading-tight">
                    {t(button.titleKey)}
                  </span>
                </Button>
              );
            })}
          </div>

          {/* Secondary Actions (Bottom 4) */}
          <div className="grid grid-cols-2 gap-3">
            {navigationButtons.slice(2).map((button) => {
              const Icon = button.icon;
              return (
                <Button
                  key={button.id}
                  onClick={button.action}
                  className="h-20 flex-col space-y-1 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                  variant="ghost"
                >
                  <div className={`w-10 h-10 ${button.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${button.color}`} />
                  </div>
                  <span className="text-xs text-gray-700 text-center leading-tight">
                    {t(button.titleKey)}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Today's Urgent Tasks Preview */}
        {state.dashboard.todaysTasks.length > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  <h3 className="text-gray-900">{t('dashboard.urgentTasks', 'Urgent Tasks')}</h3>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
              <div className="space-y-2">
                {state.dashboard.todaysTasks.slice(0, 2).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-2 bg-white rounded-lg">
                    <span className="text-sm text-gray-800">
                      {state.language === 'zh' ? task.titleZh : task.title}
                    </span>
                    <Badge 
                      variant={task.completed ? "default" : "secondary"}
                      className={task.completed ? "bg-green-500" : "bg-gray-300"}
                    >
                      {task.completed ? '✓' : '○'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats Summary */}
        <Card className="bg-gradient-to-r from-gray-50 to-blue-50">
          <CardContent className="p-4">
            <h3 className="text-gray-900 mb-3">{t('dashboard.thisWeek', 'This Week Summary')}</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg text-gray-900">12</p>
                <p className="text-xs text-gray-600">{t('dashboard.tasksCompleted', 'Tasks Completed')}</p>
              </div>
              <div>
                <p className="text-lg text-gray-900">85%</p>
                <p className="text-xs text-gray-600">{t('dashboard.accuracy', 'Accuracy')}</p>
              </div>
              <div>
                <p className="text-lg text-gray-900">#{state.leaderboard.topParents.findIndex(p => p.id === state.user.id) + 1 || 'N/A'}</p>
                <p className="text-xs text-gray-600">{t('dashboard.ranking', 'Ranking')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}