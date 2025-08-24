import React, { useState } from 'react';
import { ParentProvider } from './contexts/ParentContext';
import { EnhancedParentHome } from './parent/EnhancedParentHome';
import { MultiFileUpload } from './parent/MultiFileUpload';
import { EnhancedChatInterface } from './parent/EnhancedChatInterface';
import { CommunityLeaderboard } from './parent/CommunityLeaderboard';
import { AssignmentsPage } from './parent/AssignmentsPage';
import { PerformancePage } from './parent/PerformancePage';
import { CommunityForum } from './parent/CommunityForum';
import { HelpDialog } from './HelpDialog';
import { PronunciationSelector } from './parent/PronunciationSelector';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Home,
  Upload,
  MessageCircle,
  CheckSquare,
  TrendingUp,
  Users,
  Gift,
  LogOut,
  Menu,
  X,
  Mic
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: string;
  childName?: string;
}

interface EnhancedParentAppProps {
  user: User;
  onLogout: () => void;
}

type ActivePage = 'home' | 'assignments' | 'chat' | 'tasks' | 'progress' | 'community' | 'rewards' | 'pronunciation';

export function EnhancedParentApp({ user, onLogout }: EnhancedParentAppProps) {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navigationItems = [
    { id: 'home' as ActivePage, icon: Home, labelKey: 'nav.home', label: 'Home' },
    { id: 'pronunciation' as ActivePage, icon: Mic, labelKey: 'nav.pronunciation', label: 'Pronunciation' },
    { id: 'assignments' as ActivePage, icon: Upload, labelKey: 'nav.assignments', label: 'Assignments' },
    { id: 'chat' as ActivePage, icon: MessageCircle, labelKey: 'nav.chat', label: 'Chat', badge: 2 },
    { id: 'tasks' as ActivePage, icon: CheckSquare, labelKey: 'nav.tasks', label: 'Tasks' },
    { id: 'progress' as ActivePage, icon: TrendingUp, labelKey: 'nav.progress', label: 'Progress' },
    { id: 'community' as ActivePage, icon: Users, labelKey: 'nav.community', label: 'Community' },
    { id: 'rewards' as ActivePage, icon: Gift, labelKey: 'nav.rewards', label: 'Rewards' },
  ];

  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return <EnhancedParentHome />;
      case 'pronunciation':
        return <PronunciationSelector />;
      case 'assignments':
        return <AssignmentsPage />;
      case 'chat':
        return <EnhancedChatInterface />;
      case 'tasks':
        return <AssignmentsPage />; // Using existing component for now
      case 'progress':
        return <PerformancePage />;
      case 'community':
        return (
          <div className="space-y-6">
            <CommunityLeaderboard />
            <CommunityForum />
          </div>
        );
      case 'rewards':
        return <div className="p-4">Rewards page coming soon...</div>;
      default:
        return <EnhancedParentHome />;
    }
  };

  return (
    <ParentProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Navigation Overlay */}
        {showMobileMenu && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowMobileMenu(false)} />
            <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg text-gray-900">REACH Parent</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <nav className="p-4 space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActivePage(item.id);
                        setShowMobileMenu(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activePage === item.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                      {item.badge && (
                        <Badge className="ml-auto bg-red-500 text-white">
                          {item.badge}
                        </Badge>
                      )}
                    </button>
                  );
                })}
                <div className="border-t pt-4 mt-4">
                  <Button
                    variant="ghost"
                    onClick={onLogout}
                    className="w-full justify-start text-red-600 hover:text-red-700"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                  </Button>
                </div>
              </nav>
            </div>
          </div>
        )}

        {/* Desktop Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMobileMenu(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-lg text-gray-900">REACH Parent</h1>
            <div className="flex items-center space-x-2">
              <HelpDialog userRole="parent" currentSection={activePage} />
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="text-gray-500 hover:text-gray-700"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:flex lg:h-screen">
          {/* Desktop Sidebar */}
          <div className="hidden lg:flex lg:flex-col lg:w-64 lg:bg-white lg:border-r lg:border-gray-200">
            <div className="flex items-center justify-between p-4 border-b">
              <h1 className="text-xl text-gray-900">REACH Parent</h1>
              <HelpDialog userRole="parent" currentSection={activePage} />
            </div>
            
            {/* User Info */}
            <div className="p-4 border-b">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-600">{user.childName}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activePage === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <Badge className="ml-auto bg-red-500 text-white text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t">
              <Button
                variant="ghost"
                onClick={onLogout}
                className="w-full justify-start text-red-600 hover:text-red-700"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 lg:overflow-auto">
            {renderContent()}
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
          <div className="grid grid-cols-4 gap-1 p-2">
            {navigationItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                    activePage === item.id
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className="relative">
                    <Icon className="w-5 h-5" />
                    {item.badge && (
                      <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center p-0">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs mt-1 truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Bottom Padding */}
        <div className="lg:hidden h-16" />
      </div>
    </ParentProvider>
  );
}