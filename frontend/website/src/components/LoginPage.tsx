import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { GraduationCap, Heart, Users, HelpCircle, Star, Flame, Trophy, MessageCircle } from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: 'parent' | 'teacher' | 'staff';
  childName?: string;
}

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // Add error state

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/account/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Adjust this mapping to match your backend's user object
        const user = {
          id: data.user.id,
          name: data.user.role === 'parent' ? data.user.parent_name : 
           data.user.role === 'teacher' ? data.user.teacher_name :
           data.user.role === 'staff' ? data.user.staff_name : 
           data.user.username,
          role: data.user.role,
          childName: data.user.children_name,
        };
        onLogin(user);
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

/*export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate login - in real app, this would call an API
    setTimeout(() => {
      let user: User;
      
      if (username === 'parent1') {
        user = { id: '1', name: 'Sarah Chen', role: 'parent', childName: 'Emma Chen' };
      } else if (username === 'teacher1') {
        user = { id: '2', name: 'Miss Wong', role: 'teacher' };
      } else if (username === 'staff1') {
        user = { id: '3', name: 'David Lee', role: 'staff' };
      } else {
        user = { id: '1', name: 'Sarah Chen', role: 'parent', childName: 'Emma Chen' };
      }
      
      onLogin(user);
      setLoading(false);
    }, 1000);
  };*/

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <h1 className="text-3xl text-gray-900">REACH</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                  <HelpCircle className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <HelpCircle className="w-5 h-5 text-blue-600" />
                    <span>Welcome to REACH</span>
                  </DialogTitle>
                  <DialogDescription>
                    Learn about our education platform that supports kindergarten students in Hong Kong
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    REACH is an education platform that connects parents, teachers, and staff to support 
                    underprivileged kindergarten students in Hong Kong.
                  </p>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm text-gray-900">For Parents:</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span>Earn stars & points</span>
                      </div>
                      <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                        <Flame className="w-3 h-3 text-orange-500" />
                        <span>Daily streaks</span>
                      </div>
                      <div className="flex items-center space-x-2 p-2 bg-purple-50 rounded-lg">
                        <Trophy className="w-3 h-3 text-purple-500" />
                        <span>Progress tracking</span>
                      </div>
                      <div className="flex items-center space-x-2 p-2 bg-pink-50 rounded-lg">
                        <MessageCircle className="w-3 h-3 text-blue-500" />
                        <span>Chat with teachers</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm text-gray-900">Key Features:</h4>
                    <ul className="text-xs text-gray-600 space-y-1 pl-4">
                      <li>• Submit homework with photos</li>
                      <li>• Join community discussions</li>
                      <li>• Track your child's progress</li>
                      <li>• Direct communication with REACH staff</li>
                      <li>• Gamified learning experience</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-blue-800">
                      <strong>Get Started:</strong> Use the demo accounts below to explore the platform, 
                      or contact REACH staff for your family account credentials.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-gray-600">Supporting every child's learning journey</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-gray-800">Welcome Back</CardTitle>
            <CardDescription>Sign in to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 bg-primary hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card className="border border-gray-200 bg-white/60 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-700">Demo Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Heart className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-800">Parent</p>
                  <p className="text-xs text-blue-600">username: parent1</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setUsername('parent1');
                  setPassword('demo');
                }}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                Try
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <GraduationCap className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm text-green-800">Teacher</p>
                  <p className="text-xs text-green-600">username: teacher1</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setUsername('teacher1');
                  setPassword('demo');
                }}
                className="text-green-600 border-green-200 hover:bg-green-50"
              >
                Try
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Users className="w-4 h-4 text-purple-600" />
                <div>
                  <p className="text-sm text-purple-800">Staff</p>
                  <p className="text-xs text-purple-600">username: staff1</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setUsername('staff1');
                  setPassword('demo');
                }}
                className="text-purple-600 border-purple-200 hover:bg-purple-50"
              >
                Try
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}