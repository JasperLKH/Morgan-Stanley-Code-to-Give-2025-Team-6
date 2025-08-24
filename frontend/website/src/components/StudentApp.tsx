import React, { useState } from 'react';
import { Home, Mic, BookOpen, Star, LogOut, User } from 'lucide-react';
import { Button } from './ui/button';
import { StudentPronunciationPage } from './student/StudentPronunciationPage';
import { StudentDashboard } from './student/StudentDashboard';
import { StudentProfilePage } from './student/StudentProfilePage';

interface User {
  id: string;
  name: string;
  role: string;
}

interface StudentAppProps {
  user: User;
  onLogout: () => void;
}

export function StudentApp({ user, onLogout }: StudentAppProps) {
  const [activeTab, setActiveTab] = useState('home');

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'pronunciation', label: 'Practice', icon: Mic },
    { id: 'assignments', label: 'Tasks', icon: BookOpen },
    { id: 'profile', label: 'Me', icon: User },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <StudentDashboard user={user} />;
      case 'pronunciation':
        return <StudentPronunciationPage user={user} />;
      case 'assignments':
        return <StudentPronunciationPage user={user} activeSection="assignments" />;
      case 'profile':
        return <StudentProfilePage user={user} />;
      default:
        return <StudentDashboard user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-25 to-emerald-25" style={{
      background: 'linear-gradient(to bottom, #f0f9ff, #ecfdf5)'
    }}>
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-xl text-gray-900">REACH Learning</h1>
          <p className="text-sm text-gray-600">Hi {user.name || user.id}! 👋</p>
        </div>
        <div className="flex items-center space-x-2">
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
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}