import React, { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { SimplifiedParentApp } from './components/SimplifiedParentApp';
import { StaffApp } from './components/StaffApp';
import { TeacherApp } from './components/TeacherApp';

type UserRole = 'parent' | 'teacher' | 'staff' | null;

interface User {
  id: string;
  name: string;
  role: UserRole;
  childName?: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  switch (user.role) {
    case 'parent':
      return <SimplifiedParentApp user={user} onLogout={handleLogout} />;
    case 'staff':
      return <StaffApp user={user} onLogout={handleLogout} />;
    case 'teacher':
      return <TeacherApp user={user} onLogout={handleLogout} />;
    default:
      return <LoginPage onLogin={handleLogin} />;
  }
}