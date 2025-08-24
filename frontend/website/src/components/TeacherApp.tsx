import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { HelpDialog } from './HelpDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { 
  LogOut, 
  GraduationCap, 
  Star, 
  TrendingUp, 
  BookOpen, 
  Users, 
  MessageCircle,
  Send,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: string;
}

interface Student {
  id: string;
  name: string;
  parentName: string;
  averageScore: number;
  completedAssignments: number;
  totalAssignments: number;
  recentFeedback: string;
  status: 'excellent' | 'good' | 'needs_attention';
}

interface Assignment {
  id: string;
  title: string;
  type: 'reading' | 'math' | 'writing' | 'art';
  dueDate: string;
  totalSubmissions: number;
  pendingReview: number;
  completedReviews: number;
  averageScore: number;
  description: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  type: 'sent' | 'received';
}

interface TeacherAppProps {
  user: User;
  onLogout: () => void;
}

export function TeacherApp({ user, onLogout }: TeacherAppProps) {
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'REACH Staff',
      message: 'Hello! How can we help you today?',
      timestamp: '10:30 AM',
      type: 'received'
    },
    {
      id: '2',
      sender: 'You',
      message: 'I need help with grading criteria for the reading assignment.',
      timestamp: '10:32 AM',
      type: 'sent'
    },
    {
      id: '3',
      sender: 'REACH Staff',
      message: 'Of course! Please check the grading rubric in the assignment details. Focus on comprehension, pronunciation, and engagement.',
      timestamp: '10:35 AM',
      type: 'received'
    }
  ]);

  // const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // useEffect(() => {
  //   fetch('http://localhost:8000/chat/messages/')
  //     .then((response) => response.json())
  //     .then((data) => setChatMessages(data))
  //     .catch((error) => console.error('Error fetching chat messages:', error));
  // }, []);

  // sample data
  // const students: Student[] = [
  //   {
  //     id: '1',
  //     name: 'Emma Chen',
  //     parentName: 'Sarah Chen',
  //     averageScore: 88,
  //     completedAssignments: 12,
  //     totalAssignments: 15,
  //     recentFeedback: 'Excellent progress in reading comprehension. Keep up the great work!',
  //     status: 'excellent',
  //   },
  //   {
  //     id: '2',
  //     name: 'Alex Wong',
  //     parentName: 'Lisa Wong',
  //     averageScore: 75,
  //     completedAssignments: 8,
  //     totalAssignments: 12,
  //     recentFeedback: 'Good effort in math activities. Could benefit from more practice with addition.',
  //     status: 'good',
  //   },
  //   {
  //     id: '3',
  //     name: 'Sophie Lee',
  //     parentName: 'David Lee',
  //     averageScore: 65,
  //     completedAssignments: 5,
  //     totalAssignments: 8,
  //     recentFeedback: 'Shows creativity in art activities but needs encouragement with reading tasks.',
  //     status: 'needs_attention',
  //   },
  // ];

  // students fetched from backend, created by julian
  const [students, setStudents] = useState<Student[]>([]);

  /**
   * What is this doing?
   * -------------------
   * The code below runs once when your component loads (because of the empty dependency array `[]`).
   * It fetches data from your backend at http://localhost:8000/account/users/.
   * When the data is received, it parses the JSON and puts the result into your `students` state variable.
   * 
   * However, the data you get from the backend is not a list of students directly.
   * Instead, you get an object with a "users" array inside it, and each user has fields like "children_name".
   * 
   * What do I do next?
   * ------------------
   * 1. You need to extract the "users" array from the response.
   * 2. You need to decide what you want to display as a "student". In your sample data, a student has a name, parentName, etc.
   *    In your backend data, "children_name" is the student's name, and "parent_name" is the parent's name.
   * 3. You probably want to filter out users that don't have a "children_name" (since only parents have children).
   * 4. You can then map this data into the format you want for display.
   * 
   * Here is how you can update your code:
   */
  useEffect(() => {
    fetch('http://localhost:8000/account/users/')
      .then((response) => response.json())
      .then((data) => {
        // Extract the users array
        const users = data.users || [];
        // Filter for users that have a children_name (i.e., students)
        const studentsList = users
          .filter(user => user.children_name) // only users with a student
          .map(user => ({
            id: user.id,
            name: user.children_name,
            parentName: user.parent_name,
            // You can add more fields here if you want, or set defaults
            averageScore: user.points || 0, // or some other logic
            completedAssignments: 0, // backend doesn't provide, so set to 0 or fetch elsewhere
            totalAssignments: 0,     // backend doesn't provide, so set to 0 or fetch elsewhere
            recentFeedback: '',      // backend doesn't provide, so set to empty or fetch elsewhere
            status: user.is_active ? 'active' : 'inactive', // or your own logic
          }));
        setStudents(studentsList);
      })
      .catch((error) => console.error('Error fetching students:', error));
  }, []);
  /**
   * Now, in your JSX, you can display the students like this:
   * 
   * <ul>
   *   {students.map(student => (
   *     <li key={student.id}>
   *       <strong>{student.name}</strong> (Parent: {student.parentName})<br />
   *       Status: {student.status}
   *     </li>
   *   ))}
   * </ul>
   * 
   * You can add more fields as you get more data from your backend.
   */

  // // sample data
  const assignments: Assignment[] = [
    {
      id: '1',
      title: 'Read "The Little Red Hen"',
      type: 'reading',
      dueDate: 'Dec 25, 2024',
      totalSubmissions: 15,
      pendingReview: 3,
      completedReviews: 12,
      averageScore: 82,
      description: 'Students read the story and discuss with parents'
    },
    {
      id: '2',
      title: 'Practice Writing Numbers 1-5',
      type: 'writing',
      dueDate: 'Dec 26, 2024',
      totalSubmissions: 12,
      pendingReview: 5,
      completedReviews: 7,
      averageScore: 78,
      description: 'Number tracing and writing practice'
    },
    {
      id: '3',
      title: 'Counting with Toys',
      type: 'math',
      dueDate: 'Dec 27, 2024',
      totalSubmissions: 18,
      pendingReview: 1,
      completedReviews: 17,
      averageScore: 85,
      description: 'Count household items and record results'
    },
    {
      id: '4',
      title: 'Draw a Family Picture',
      type: 'art',
      dueDate: 'Dec 28, 2024',
      totalSubmissions: 8,
      pendingReview: 8,
      completedReviews: 0,
      averageScore: 0,
      description: 'Create family artwork and discuss relationships'
    }
  ];

  // // assignments fetched from backend, created by julian
  // const [assignments, setAssignments] = useState<Assignment[]>([]);

  // useEffect(() => {
  //   fetch('http://localhost:8000/assignments/')
  //     .then((response) => response.json())
  //     .then((data) => setAssignments(data))
  //     .catch((error) => console.error('Error fetching assignments:', error));
  // }, []);

  // sample data
  const sendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'You',
        message: chatMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'sent'
      };
      setChatMessages(prev => [...prev, newMessage]);
      setChatMessage('');
      
      // Simulate response
      setTimeout(() => {
        const response: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'REACH Staff',
          message: 'Thank you for your message. We\'ll get back to you shortly!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'received'
        };
        setChatMessages(prev => [...prev, response]);
      }, 1000);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'excellent':
        return <Badge className="bg-green-500 text-white">Excellent</Badge>;
      case 'good':
        return <Badge className="bg-blue-500 text-white">Good</Badge>;
      case 'needs_attention':
        return <Badge className="bg-orange-500 text-white">Needs Attention</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'reading': return 'bg-blue-100 text-blue-800';
      case 'math': return 'bg-green-100 text-green-800';
      case 'writing': return 'bg-purple-100 text-purple-800';
      case 'art': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAssignmentStatus = (assignment: Assignment) => {
    if (assignment.pendingReview > 0) {
      return { icon: Clock, color: 'text-orange-500', text: `${assignment.pendingReview} pending` };
    } else if (assignment.completedReviews === assignment.totalSubmissions) {
      return { icon: CheckCircle, color: 'text-green-500', text: 'All reviewed' };
    } else {
      return { icon: AlertCircle, color: 'text-blue-500', text: 'In progress' };
    }
  };

  const classStats = {
    totalStudents: students.length,
    averageCompletion: students.length > 0 ? Math.round(students.reduce((acc, student) => 
      acc + (student.completedAssignments / student.totalAssignments), 0) / students.length * 100) : 0,
    averageScore: students.length > 0 ? Math.round(students.reduce((acc, student) => acc + student.averageScore, 0) / students.length) : 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl text-gray-900">REACH Teacher Portal</h1>
          <p className="text-sm text-gray-600">Welcome, {user.name}</p>
        </div>
        <div className="flex items-center space-x-2">
          <HelpDialog userRole="teacher" currentSection="dashboard" />
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

      <div className="p-4">
        <Tabs defaultValue="students" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="chat">Chat with REACH</TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6 mt-6">
            {/* Class Overview */}
            <div>
              <h2 className="text-xl text-gray-900 mb-4">Class Overview</h2>
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-2xl text-gray-900">{classStats.totalStudents}</p>
                    <p className="text-xs text-gray-600">Students</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-2xl text-gray-900">{classStats.averageCompletion}%</p>
                    <p className="text-xs text-gray-600">Avg Completion</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Star className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-2xl text-gray-900">{classStats.averageScore}%</p>
                    <p className="text-xs text-gray-600">Avg Score</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Student Dashboard */}
            <div>
              <h2 className="text-xl text-gray-900 mb-4">Student Dashboard</h2>
              <div className="space-y-4">
                {students.map((student) => (
                  <Card key={student.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-gray-200 text-gray-600">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-lg text-gray-900">{student.name}</h3>
                            <p className="text-sm text-gray-600">Parent: {student.parentName}</p>
                          </div>
                        </div>
                        {getStatusBadge(student.status)}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Assignment Progress</p>
                          <div className="flex items-center space-x-2">
                            <Progress 
                              value={(student.completedAssignments / student.totalAssignments) * 100} 
                              className="flex-1 h-2" 
                            />
                            <span className="text-sm text-gray-600">
                              {student.completedAssignments}/{student.totalAssignments}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Average Score</p>
                          <div className="flex items-center space-x-2">
                            <Progress value={student.averageScore} className="flex-1 h-2" />
                            <span className="text-sm text-gray-600">{student.averageScore}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600 mb-1">Recent Feedback</p>
                        <p className="text-sm text-gray-800">{student.recentFeedback}</p>
                      </div>

                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1">
                          <BookOpen className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <GraduationCap className="w-4 h-4 mr-1" />
                          Add Note
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-6 mt-6">
            <div>
              <h2 className="text-xl text-gray-900 mb-4">Assignment Overview</h2>
              <div className="space-y-4">
                {assignments.map((assignment) => {
                  const status = getAssignmentStatus(assignment);
                  const StatusIcon = status.icon;
                  
                  return (
                    <Card key={assignment.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge className={getTypeColor(assignment.type)} variant="secondary">
                                {assignment.type}
                              </Badge>
                              <div className={`flex items-center space-x-1 ${status.color}`}>
                                <StatusIcon className="w-4 h-4" />
                                <span className="text-sm">{status.text}</span>
                              </div>
                            </div>
                            <h3 className="text-lg text-gray-900 mb-1">{assignment.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>Due: {assignment.dueDate}</span>
                              </span>
                              <span>{assignment.totalSubmissions} submissions</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-lg text-gray-900">{assignment.pendingReview}</p>
                            <p className="text-xs text-gray-600">Pending Review</p>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <p className="text-lg text-gray-900">{assignment.completedReviews}</p>
                            <p className="text-xs text-gray-600">Completed</p>
                          </div>
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <p className="text-lg text-gray-900">{assignment.averageScore}%</p>
                            <p className="text-xs text-gray-600">Avg Score</p>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button size="sm" className="flex-1">
                            <BookOpen className="w-4 h-4 mr-1" />
                            Review Submissions
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="mt-6">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  <span>Chat with REACH Staff</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            msg.type === 'sent'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                          <p className={`text-xs mt-1 ${
                            msg.type === 'sent' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {msg.sender} • {msg.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type your message..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={sendMessage} disabled={!chatMessage.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}