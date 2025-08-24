import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { HelpDialog } from './HelpDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
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
  AlertCircle,
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: string;
}

interface Student {
  id: number | string;
  name: string;
  parentName: string;
  averageScore: number;
  completedAssignments: number;
  totalAssignments: number;
  recentFeedback: string;
  status: 'excellent' | 'good' | 'needs_attention';
}

interface Assignment {
  id: string | number;
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
  sender: string; // "You" or "REACH Staff"
  message: string;
  timestamp: string; // human readable (e.g., '10:35 AM')
  type: 'sent' | 'received';
}

interface BackendChatMessage {
  id: string | number;
  sender_id: number;
  sender_role: 'teacher' | 'staff';
  message: string;
  timestamp: string; // ISO or human; we’ll format in UI
}

interface TeacherAppProps {
  user: User;
  onLogout: () => void;
}

/** ===== Chat API Config ===== */
const API_BASE = 'http://localhost:8000';
const CHAT_POLL_MS = 3000;

/** Utility: format a timestamp into HH:MM AM/PM */
function formatTime(ts: string) {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) {
    // fallback if backend already sends friendly text
    return ts;
  }
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function TeacherApp({ user, onLogout }: TeacherAppProps) {
  /** --------- Identity (fixed for now as requested) --------- */
  // Even if a user prop is passed, we hard-assign teacher identity to John (id 8) per the brief.
  const teacherId = 8;
  const teacherName = 'John';

  /** -------- Chat state -------- */
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const pollingRef = useRef<number | null>(null);
  const lastSeenIdsRef = useRef<Set<string>>(new Set());

  const withUserHeader = (init?: RequestInit): RequestInit => ({
    credentials: 'include',
    ...(init || {}),
    headers: {
      ...(init?.headers || {}),
      'User-ID': String(teacherId),
    },
  });

  /** Fetch & map chat messages from backend */
  const fetchChatMessages = async (signal?: AbortSignal) => {
    try {
      const res = await fetch(`${API_BASE}/chat/conversations/`, withUserHeader());
      console.log('Chat fetch response:', res);
      if (!res.ok) throw new Error(`Failed to fetch messages: ${res.status}`);
      const data: BackendChatMessage[] = await res.json();

      const mapped: ChatMessage[] = (Array.isArray(data) ? data : []).map((m) => {
        const isTeacher = m.sender_role === 'teacher' && m.sender_id === teacherId;
        return {
          id: String(m.id),
          sender: isTeacher ? 'You' : 'REACH Staff',
          message: m.message,
          timestamp: formatTime(m.timestamp),
          type: isTeacher ? 'sent' : 'received',
        };
      });

      // Avoid duplicate re-inserts if backend returns the same list repeatedly
      setChatMessages((prev) => {
        const seen = new Set<string>();
        const dedup = [...prev, ...mapped].filter((m) => {
          if (seen.has(m.id)) return false;
          seen.add(m.id);
          return true;
        });
        // track IDs we’ve seen to help optimistic update reconciliation
        lastSeenIdsRef.current = new Set(dedup.map((m) => m.id));
        return dedup.sort((a, b) => {
          // We can’t rely on id ordering; create Date from timestamp fallback to original order
          const ta = a.timestamp;
          const tb = b.timestamp;
          return ta.localeCompare(tb);
        });
      });

      setChatError(null);
    } catch (err: any) {
      if (err?.name === 'AbortError') return; // ignore aborts
      setChatError(err?.message || 'Unable to load messages');
    }
  };

  /** Initial load + start polling */
  useEffect(() => {
    const controller = new AbortController();
    setChatLoading(true);
    fetchChatMessages(controller.signal).finally(() => setChatLoading(false));

    // Polling
    pollingRef.current = window.setInterval(() => {
      fetchChatMessages();
    }, CHAT_POLL_MS) as unknown as number;

    return () => {
      controller.abort();
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Send a message to REACH staff */
  const sendMessage = async () => {
    const text = chatMessage.trim();
    if (!text) return;

    // Optimistic update
    const tempId = `temp-${Date.now()}`;
    const optimistic: ChatMessage = {
      id: tempId,
      sender: 'You',
      message: text,
      timestamp: formatTime(new Date().toISOString()),
      type: 'sent',
    };
    setChatMessages((prev) => [...prev, optimistic]);
    setChatMessage('');

    try {
      const res = await fetch(`${API_BASE}/chat/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacher_id: teacherId,
          message: text,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to send message: ${res.status}`);
      }

      // After successful send, refetch to replace optimistic with real ID & capture staff replies
      await fetchChatMessages();
    } catch (err: any) {
      // Roll back optimistic message on failure
      setChatMessages((prev) => prev.filter((m) => m.id !== tempId));
      setChatError(err?.message || 'Failed to send message');
      // Restore input so they can retry quickly
      setChatMessage(text);
    }
  };

  /** Key handler */
  const onChatKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  /** -------- Students (from /account/users/) -------- */
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://localhost:8000/account/users/');
        const data = await res.json();
        const users: any[] = Array.isArray(data?.users) ? data.users : [];

        // Treat each parent as a “student card” for the teacher’s dashboard
        const mapped: Student[] = users
          .filter((u) => u.role === 'parent')
          .map((u) => {
            const avg = 0; // replace with real field if backend adds it
            const completed = 0; // "
            const total = 0; // "

            const status: Student['status'] =
              avg >= 85 ? 'excellent' : avg >= 70 ? 'good' : 'needs_attention';

            return {
              id: u.id,
              name: u.children_name || 'Student',
              parentName: u.parent_name || u.username || '—',
              averageScore: avg,
              completedAssignments: completed,
              totalAssignments: total,
              recentFeedback: '', // map a real field when available
              status,
            };
          });

        setStudents(mapped);
      } catch (err) {
        console.error('Error fetching students:', err);
        setStudents([]);
      }
    })();
  }, []);

  /** -------- Assignments (example fetch; adapt mapping to your API) -------- */
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://localhost:8000/assignments/');
        const data = await res.json();
        setAssignments(
          (Array.isArray(data) ? data : []).map((a: any) => ({
            id: a.id,
            title: a.title ?? a.name ?? 'Assignment',
            type: (a.type as Assignment['type']) ?? 'reading',
            dueDate: a.dueDate ?? a.due_date ?? '',
            totalSubmissions: a.totalSubmissions ?? 0,
            pendingReview: a.pendingReview ?? 0,
            completedReviews: a.completedReviews ?? 0,
            averageScore: a.averageScore ?? 0,
            description: a.description ?? '',
          }))
        );
      } catch (err) {
        console.error('Error fetching assignments:', err);
        setAssignments([]);
      }
    })();
  }, []);

  /** -------- Helpers -------- */
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
      case 'reading':
        return 'bg-blue-100 text-blue-800';
      case 'math':
        return 'bg-green-100 text-green-800';
      case 'writing':
        return 'bg-purple-100 text-purple-800';
      case 'art':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAssignmentStatus = (assignment: Assignment) => {
    const pending = assignment.pendingReview ?? 0;
    const completed = assignment.completedReviews ?? 0;
    const total = assignment.totalSubmissions ?? 0;

    if (pending > 0) {
      return { icon: Clock, color: 'text-orange-500', text: `${pending} pending` };
    } else if (total > 0 && completed === total) {
      return { icon: CheckCircle, color: 'text-green-500', text: 'All reviewed' };
    } else {
      return { icon: AlertCircle, color: 'text-blue-500', text: 'In progress' };
    }
  };

  const classStats = {
    totalStudents: students.length,
    averageCompletion:
      students.length > 0
        ? Math.round(
            (students.reduce(
              (acc, s) =>
                acc + (s.totalAssignments ? s.completedAssignments / s.totalAssignments : 0),
              0
            ) /
              students.length) *
              100
          )
        : 0,
    averageScore:
      students.length > 0
        ? Math.round(
            students.reduce((acc, s) => acc + (s.averageScore || 0), 0) / students.length
          )
        : 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl text-gray-900">REACH Teacher Portal</h1>
          <p className="text-sm text-gray-600">Welcome, {teacherName}</p>
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
                              {student.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
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
                              value={
                                student.totalAssignments
                                  ? (student.completedAssignments / student.totalAssignments) * 100
                                  : 0
                              }
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
                        <p className="text-sm text-gray-800">
                          {student.recentFeedback || '—'}
                        </p>
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
                    {chatLoading && chatMessages.length === 0 && (
                      <div className="text-xs text-gray-500">Loading messages…</div>
                    )}
                    {chatError && (
                      <div className="text-xs text-red-500">Error: {chatError}</div>
                    )}
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
                          <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                          <p
                            className={`text-xs mt-1 ${
                              msg.type === 'sent' ? 'text-blue-100' : 'text-gray-500'
                            }`}
                          >
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
                      placeholder="Type your message to REACH Staff…"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyDown={onChatKeyDown}
                      className="flex-1"
                    />
                    <Button onClick={sendMessage} disabled={!chatMessage.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-2">
                    You’re messaging <strong>REACH Staff</strong>. Teachers cannot message other teachers or parents.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}