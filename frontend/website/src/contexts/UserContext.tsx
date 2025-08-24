import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  role: 'parent' | 'staff' | 'student' | 'teacher';
  email?: string;
  points?: number;
  weekly_points?: number;
  name?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  loading: boolean;
  error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log('UserProvider initialized, user:', user);

  // Mock login function
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('UserContext: Attempting real API login with:', username);
      
      // Call real API login
      const response = await fetch('http://localhost:8000/account/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('UserContext: API login successful, data =', data);
        
        // Check if user data is in the response
        if (data.user) {
          // Get the appropriate name based on role
          let userName = data.user.username;
          if (data.user.parent_name) userName = data.user.parent_name;
          else if (data.user.teacher_name) userName = data.user.teacher_name;
          else if (data.user.staff_name) userName = data.user.staff_name;
          else if (data.user.children_name) userName = data.user.children_name;
          
          const apiUser: User = {
            id: data.user.id.toString(),
            username: data.user.username,
            role: data.user.role,
            email: data.user.email || '',
            points: data.user.points || 0,
            weekly_points: data.user.weekly_points || 0,
            name: userName
          };
          
          console.log('UserContext: Setting user from API =', apiUser);
          setUser(apiUser);
          localStorage.setItem('user', JSON.stringify(apiUser));
          return true;
        }
      }
      
      // If API login fails, fall back to mock login for development
      console.log('UserContext: API login failed, using mock login');
      
      // Mock authentication - in real app this would call your API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data based on username
      let role: 'parent' | 'staff' | 'student' | 'teacher' = 'parent';
      if (username.includes('staff') || username === 'staff1') {
        role = 'staff';
      } else if (username.includes('teacher') || username === 'teacher1') {
        role = 'teacher';
      } else if (username.includes('student')) {
        role = 'student';
      } else if (username === 'parent1') {
        role = 'parent';
      }
      
      const mockUser: User = {
        id: '1',
        username: username,
        role: role,
        email: `${username}@example.com`,
        points: 350,
        weekly_points: 85,
        name: username
      };
      
      console.log('UserContext: Mock login successful, user =', mockUser);
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please check your credentials.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('user');
  };

  // Load user from localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const value: UserContextType = {
    user,
    setUser,
    login,
    logout,
    isLoading,
    loading: isLoading, // alias for compatibility
    error
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
