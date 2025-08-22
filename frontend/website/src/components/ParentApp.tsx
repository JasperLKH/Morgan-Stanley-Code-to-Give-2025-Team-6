import React, { useState } from 'react';
import { Home, Users, BookOpen, TrendingUp, MessageCircle, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { HelpDialog } from './HelpDialog';
import { ParentHome } from './parent/ParentHome';
import { CommunityForum } from './parent/CommunityForum';
import { AssignmentsPage } from './parent/AssignmentsPage';
import { PerformancePage } from './parent/PerformancePage';
import { ChatPage } from './parent/ChatPage';

interface User {
  id: string;
  name: string;
  role: string;
  childName?: string;
}

interface ParentAppProps {
  user: User;
  onLogout: () => void;
}

type TabType = 'home' | 'community' | 'assignments' | 'performance' | 'chat';

export function ParentApp({ user, onLogout }: ParentAppProps) {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'community' as TabType, label: 'Community', icon: Users },
    { id: 'assignments' as TabType, label: 'Tasks', icon: BookOpen },
    { id: 'performance' as TabType, label: 'Progress', icon: TrendingUp },
    { id: 'chat' as TabType, label: 'Chat', icon: MessageCircle },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <ParentHome user={user} />;
      case 'community':
        return <CommunityForum user={user} />;
      case 'assignments':
        return <AssignmentsPage user={user} />;
      case 'performance':
        return <PerformancePage user={user} />;
      case 'chat':
        return <ChatPage user={user} />;
      default:
        return <ParentHome user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl text-gray-900">REACH</h1>
          <p className="text-sm text-gray-600">Hi, {user.name}</p>
        </div>
        <div className="flex items-center space-x-2">
          <HelpDialog userRole="parent" currentSection={activeTab} />
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

      {/* Content */}
      <div className="pb-20">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-primary' : ''}`} />
                <span className="text-xs">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}