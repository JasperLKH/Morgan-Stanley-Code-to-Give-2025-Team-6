import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './components/LoginPage';
import { SimplifiedParentApp } from './components/SimplifiedParentApp';
import { StaffApp } from './components/StaffApp';
import { TeacherApp } from './components/TeacherApp';

function AppContent() {
  const { user, loading, logout } = useAuth();

  console.log('AppContent render:', { user, loading });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-500">
        <div className="text-lg text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    console.log('No user, showing LoginPage');
    return <LoginPage />;
  }

  // Create legacy user object for compatibility
  const legacyUser = {
    id: user.id.toString(),
    name: user.username || user.parent_name || user.staff_name || user.teacher_name || 'User',
    role: (user.parent_name || user.children_name) ? 'parent' as const :
          user.staff_name ? 'staff' as const :
          user.teacher_name ? 'teacher' as const : 'parent' as const,
    childName: user.children_name || undefined
  };

  switch (legacyUser.role) {
    case 'parent':
      return <SimplifiedParentApp user={legacyUser} onLogout={logout} />;
    case 'staff':
      return <StaffApp user={legacyUser} onLogout={logout} />;
    case 'teacher':
      return <TeacherApp user={legacyUser} onLogout={logout} />;
    default:
      return <SimplifiedParentApp user={legacyUser} onLogout={logout} />;
  }
}

export default function App() {
  console.log('App component rendering');
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}