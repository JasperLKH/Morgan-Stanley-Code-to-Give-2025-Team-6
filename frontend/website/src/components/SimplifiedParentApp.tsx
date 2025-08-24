import React, { useState } from 'react';
import { ParentProvider, useParentContext } from './contexts/ParentContext';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { 
  Mic, 
  Upload, 
  MessageCircle, 
  LogOut, 
  Globe,
  ArrowLeft,
  Star,
  Heart,
  TrendingUp,
  Gift,
  Users
} from 'lucide-react';
import { PronunciationPortalV4 } from './parent/PronunciationPortalV4';
import { SimplifiedAssignmentsPage } from './parent/SimplifiedAssignmentsPage';
import { SimplifiedChatPage } from './parent/SimplifiedChatPage';
import { ChildProgressPage } from './parent/ChildProgressPage';
import { RewardsPage } from './parent/RewardsPage';
import { CommunityForumPage } from './parent/CommunityForumPage';

interface User {
  id: string;
  name: string;
  role: string;
  childName?: string;
}

interface SimplifiedParentAppProps {
  user: User;
  onLogout: () => void;
}

type ActivePage = 'home' | 'pronunciation' | 'assignments' | 'chat' | 'progress' | 'rewards' | 'community';

function SimplifiedParentContent({ user, onLogout }: SimplifiedParentAppProps) {
  const { state, dispatch, t } = useParentContext();
  const [activePage, setActivePage] = useState<ActivePage>('home');

  const toggleLanguage = () => {
    dispatch({
      type: 'SET_LANGUAGE',
      payload: state.language === 'en' ? 'zh' : 'en'
    });
  };

  const handleBackToHome = () => {
    setActivePage('home');
  };

  const quickActions = [
    {
      id: 'pronunciation' as ActivePage,
      title: 'Pronunciation Practice',
      titleZh: '發音練習',
      icon: Mic,
      color: 'from-sky-400 to-emerald-400',
      hoverColor: 'from-sky-500 to-emerald-500',
      description: 'Practice speaking and improve pronunciation',
      descriptionZh: '練習說話和提高發音',
    },
    {
      id: 'assignments' as ActivePage,
      title: 'Assignments Submission',
      titleZh: '作業提交',
      icon: Upload,
      color: 'from-blue-400 to-purple-400',
      hoverColor: 'from-blue-500 to-purple-500',
      description: 'Submit homework and track progress',
      descriptionZh: '提交作業和跟蹤進度',
    },
    {
      id: 'chat' as ActivePage,
      title: 'Chat with REACH Support',
      titleZh: '與REACH支援聊天',
      icon: MessageCircle,
      color: 'from-orange-400 to-pink-400',
      hoverColor: 'from-orange-500 to-pink-500',
      description: 'Get help and support from teachers',
      descriptionZh: '獲得老師的幫助和支援',
    },
    {
      id: 'progress' as ActivePage,
      title: 'Child Progress',
      titleZh: '孩子進度',
      icon: TrendingUp,
      color: 'from-emerald-400 to-teal-400',
      hoverColor: 'from-emerald-500 to-teal-500',
      description: 'View learning progress and achievements',
      descriptionZh: '查看學習進度和成就',
    },
    {
      id: 'rewards' as ActivePage,
      title: 'Redeem Rewards',
      titleZh: '兌換獎勵',
      icon: Gift,
      color: 'from-amber-400 to-orange-400',
      hoverColor: 'from-amber-500 to-orange-500',
      description: 'Redeem points for exciting rewards',
      descriptionZh: '用積分兌換精彩獎勵',
    },
    {
      id: 'community' as ActivePage,
      title: 'Community Forum',
      titleZh: '社區論壇',
      icon: Users,
      color: 'from-violet-400 to-purple-400',
      hoverColor: 'from-violet-500 to-purple-500',
      description: 'Connect with other REACH families',
      descriptionZh: '與其他REACH家庭聯繫',
    },
  ];

  if (activePage !== 'home') {
    let PageComponent;
    switch (activePage) {
      case 'pronunciation':
        PageComponent = PronunciationPortalV4;
        break;
      case 'assignments':
        PageComponent = SimplifiedAssignmentsPage;
        break;
      case 'chat':
        PageComponent = SimplifiedChatPage;
        break;
      case 'progress':
        PageComponent = ChildProgressPage;
        break;
      case 'rewards':
        PageComponent = RewardsPage;
        break;
      case 'community':
        PageComponent = CommunityForumPage;
        break;
      default:
        PageComponent = () => <div>Page not found</div>;
    }

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Top navigation for individual pages */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              onClick={handleBackToHome}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t('common.back', 'Back')}
            </Button>
            
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">R</span>
              </div>
              <span className="font-medium text-gray-900">REACH</span>
            </div>

            <Button
              variant="ghost"
              onClick={onLogout}
              className="text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <PageComponent />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-25 to-emerald-25" style={{
      background: 'linear-gradient(to bottom, #f0f9ff, #ecfdf5)'
    }}>
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">R</span>
            </div>
            <div>
              <h1 className="font-medium text-gray-900">REACH Parent</h1>
              <p className="text-xs text-gray-600">{user.childName}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-600" />
              <Switch
                checked={state.language === 'zh'}
                onCheckedChange={toggleLanguage}
                className="data-[state=checked]:bg-emerald-500"
              />
              <span className="text-sm text-gray-600">
                {state.language === 'zh' ? '中文' : 'EN'}
              </span>
            </div>

            <Button
              variant="ghost"
              onClick={onLogout}
              className="text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl text-gray-900">
            {t('dashboard.welcome', 'Good morning')}, {user.name}! 👋
          </h2>
          <p className="text-gray-600">
            {t('dashboard.helpChild', "Let's help")} {user.childName} {t('dashboard.learnGrow', 'learn and grow today')}
          </p>
        </div>

        {/* Quick Stats */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Star className="w-6 h-6 text-sky-600" />
                </div>
                <div className="text-xl text-gray-900">{state.dashboard.totalPoints}</div>
                <div className="text-xs text-gray-600">{t('dashboard.totalPoints', 'Total Points')}</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Heart className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-xl text-gray-900">{state.dashboard.currentStreak}</div>
                <div className="text-xs text-gray-600">{t('dashboard.currentStreak', 'Day Streak')}</div>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Upload className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-xl text-gray-900">{state.dashboard.completedTasksToday}</div>
                <div className="text-xs text-gray-600">{t('dashboard.completedToday', 'Completed Today')}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Section */}
        <div className="space-y-4">
          <h3 className="text-center text-lg text-gray-900">
            {t('dashboard.quickActions', 'Quick Actions')}
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card 
                  key={action.id}
                  className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => setActivePage(action.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="text-lg text-gray-900 mb-1">
                          {state.language === 'zh' ? action.titleZh : action.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {state.language === 'zh' ? action.descriptionZh : action.description}
                        </p>
                      </div>

                      {action.id === 'chat' && (
                        <Badge className="bg-red-500 text-white">2</Badge>
                      )}
                      {action.id === 'rewards' && (
                        <Badge className="bg-amber-500 text-white">{state.dashboard.totalPoints}</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Encouraging Message */}
        <div className="text-center space-y-2">
          <p className="text-gray-600 text-sm">
            {t('dashboard.keepGoing', "Keep going! You're doing great!")}
          </p>
          <div className="flex justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SimplifiedParentApp({ user, onLogout }: SimplifiedParentAppProps) {
  return (
    <ParentProvider user={{
      id: user.id,
      name: user.name,
      childName: user.childName,
      kindergarten: 'Sunshine Kindergarten' // Default value, could be passed from user if available
    }}>
      <SimplifiedParentContent user={user} onLogout={onLogout} />
    </ParentProvider>
  );
}