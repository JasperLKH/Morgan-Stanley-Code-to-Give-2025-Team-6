import React, { useState } from 'react';
import { Users, BookOpen, BarChart3, MessageCircle, LogOut, Home, Plus, Edit, Calendar, Gift } from 'lucide-react';
import { Button } from './ui/button';
import { HelpDialog } from './HelpDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { StaffProvider } from './contexts/StaffContext';
import { StaffDashboard } from './staff/StaffDashboard';
import { PerformanceAnalytics } from './staff/PerformanceAnalytics';
import { ParentAccountManagement } from './staff/ParentAccountManagement';
import { StaffAssignmentManagement } from './staff/StaffAssignmentManagement';
import { StaffChat } from './staff/StaffChat';
import { CommunityManagement } from './staff/CommunityManagement';
import { RewardsManagement } from './staff/RewardsManagement';

interface User {
  id: string;
  name: string;
  role: string;
}

interface StaffAppProps {
  user: User;
  onLogout: () => void;
}

export function StaffApp({ user, onLogout }: StaffAppProps) {
  console.log('StaffApp - User logged in:', user);
  
  return (
    <StaffProvider user={user}>
      <StaffAppContent user={user} onLogout={onLogout} />
    </StaffProvider>
  );
}

function StaffAppContent({ user, onLogout }: StaffAppProps) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'assignments', label: 'Assignments', icon: BookOpen },
    { id: 'accounts', label: 'Accounts', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'rewards', label: 'Rewards', icon: Gift },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'community', label: 'Community', icon: Edit },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <StaffDashboard user={user} />;
      case 'assignments':
        return <StaffAssignmentManagement user={user} />;
      case 'accounts':
        return <ParentAccountManagement />;
      case 'analytics':
        return <PerformanceAnalytics user={user} />;
      case 'rewards':
        return <RewardsManagement user={user} />;
      case 'chat':
        return <StaffChat />;
      case 'community':
        return <CommunityManagement user={user} />;
      default:
        return <StaffDashboard user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl text-gray-900">REACH Staff Portal</h1>
          <p className="text-sm text-gray-600">Welcome, {user.name}</p>
        </div>
        <div className="flex items-center space-x-2">
          <HelpDialog userRole="staff" currentSection={activeTab} />
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

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200 px-4">
        <div className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {renderContent()}
      </div>
    </div>
  );
}