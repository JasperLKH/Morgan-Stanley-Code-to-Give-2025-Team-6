import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useStaffContext } from '../contexts/StaffContext';
import { QuestionnaireManager } from './QuestionnaireManager';
import { 
  MessageCircle, 
  Send, 
  GraduationCap, 
  Heart, 
  Search, 
  Paperclip, 
  X,
  FileQuestion
} from 'lucide-react';

const API_BASE = 'http://localhost:8000';
const CURRENT_STAFF = { id: 2, username: 'staff1', role: 'staff' as const };

const withUserHeader = (init?: RequestInit): RequestInit => ({
  credentials: 'omit',
  ...(init || {}),
  headers: {
    ...(init?.headers || {}),
    'User-ID': String(CURRENT_STAFF.id),
  },
});

type Role = 'parent' | 'teacher' | 'staff';

interface ApiUser {
  id: number;
  username: string;
  role: Role;
  parent_name?: string | null;
  children_name?: string | null;
}

interface ApiMessage {
  id: number;
  conversation: number;
  from_user: ApiUser;
  text: string | null;
  attachment: string | null;
  questionnaire_id: string | null;
  created_at: string;
}

interface ApiConversation {
  id: number;
  name: string | null;
  conversation_type: 'private' | 'group';
  participants: ApiUser[];
  created_by: ApiUser;
  created_at: string;
  updated_at: string;
  last_message: ApiMessage | null;
}

interface Questionnaire {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'closed';
  questions?: Question[];
}

interface Question {
  id: string;
  type: 'text' | 'multiple_choice' | 'rating' | 'yes_no' | 'checkbox';
  question: string;
  options?: QuestionOption[];
  required: boolean;
  ratingScale?: number;
}

interface QuestionOption {
  id: string;
  text: string;
}

type ChatBubble = {
  id: string | number;
  type: 'sent' | 'received';
  text?: string;
  attachmentUrl?: string;
  questionnaire?: Questionnaire;
  senderName: string;
  timestampISO: string;
};

export function StaffChat() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // conversations + selection
  const [conversations, setConversations] = useState<ApiConversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<ApiConversation | null>(null);

  // messages & composer
  const [messages, setMessages] = useState<ChatBubble[]>([]);
  const [composerText, setComposerText] = useState('');
  const [composerFile, setComposerFile] = useState<File | null>(null);

  // directory (all users) + search
  const [allUsers, setAllUsers] = useState<ApiUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDirectory, setShowDirectory] = useState(false);

  // Questionnaire sharing
  const [showQuestionnaireSelector, setShowQuestionnaireSelector] = useState(false);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<string>('');

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample questionnaires data
  const sampleQuestionnaires: Questionnaire[] = [
    {
      id: '1',
      title: 'Monthly Child Progress Survey',
      description: 'Help us understand how your child is progressing at home',
      status: 'active',
      questions: [
        {
          id: 'q1',
          type: 'rating',
          question: 'How engaged is your child with homework activities?',
          required: true,
          ratingScale: 5
        },
        {
          id: 'q2',
          type: 'multiple_choice',
          question: 'How would you rate your child\'s reading progress this month?',
          required: true,
          options: [
            { id: 'opt1', text: 'Excellent progress' },
            { id: 'opt2', text: 'Good progress' },
            { id: 'opt3', text: 'Some progress' },
            { id: 'opt4', text: 'Little progress' }
          ]
        },
        {
          id: 'q3',
          type: 'text',
          question: 'What challenges has your child faced this month??',
          required: false
        }
      ]
    },
    {
      id: '2',
      title: 'Parent Satisfaction Survey',
      description: 'We value your feedback on our teaching methods',
      status: 'active',
      questions: [
        {
          id: 'q1',
          type: 'rating',
          question: 'How satisfied are you with our communication?',
          required: true,
          ratingScale: 5
        },
        {
          id: 'q2',
          type: 'yes_no',
          question: 'Would you recommend REACH to other parents?',
          required: true
        }
      ]
    }
  ];

  /* -------------------- load conversations -------------------- */
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const res = await fetch(`${API_BASE}/chat/conversations/`, withUserHeader());
        if (!res.ok) throw new Error(`Failed to load conversations (${res.status})`);
        const data: { conversations: ApiConversation[] } = await res.json();
        if (!alive) return;
        setConversations(data.conversations || []);
        if ((data.conversations || []).length > 0) setSelectedConv(data.conversations[0]);
      } catch (e: any) {
        if (alive) setErrorMsg(e.message || 'Load failed');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  /* -------------------- load ALL users (directory) -------------------- */
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/account/users/`, withUserHeader());
        if (!res.ok) throw new Error(`Failed to load users (${res.status})`);
        const data: { users: ApiUser[] } = await res.json();
        if (!alive) return;
        // exclude self
        setAllUsers((data.users || []).filter(u => u.id !== CURRENT_STAFF.id));
      } catch (e) {
        // non-fatal for chat
        console.warn(e);
      }
    })();
    return () => { alive = false; };
  }, []);

  /* -------------------- load questionnaires -------------------- */
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // This endpoint should return the staff's questionnaires
        const res = await fetch(`${API_BASE}/questionnaires/`, withUserHeader());
        if (!res.ok) throw new Error(`Failed to load questionnaires (${res.status})`);
        const data: { questionnaires: Questionnaire[] } = await res.json();
        if (!alive) return;
        setQuestionnaires(data.questionnaires || []);
      } catch (e) {
        console.warn('Failed to load questionnaires, using sample data', e);
        // Use sample data for demo purposes
        setQuestionnaires(sampleQuestionnaires);
      }
    })();
    return () => { alive = false; };
  }, []);

  /* -------------------- helper: fetch messages for a conversation -------------------- */
  const fetchMessages = async (convId: number) => {
    try {
      const res = await fetch(`${API_BASE}/chat/conversations/${convId}/messages/list`, withUserHeader());
      if (!res.ok) throw new Error(`Failed to load messages (${res.status})`);
      const data: { messages: ApiMessage[] } = await res.json();
      const mapped: ChatBubble[] = (data.messages || []).map((m) => ({
        id: m.id,
        type: m.from_user.id === CURRENT_STAFF.id ? 'sent' : 'received',
        text: m.text || undefined,
        attachmentUrl: m.attachment ? `${API_BASE}${m.attachment}` : undefined,
        questionnaire: m.questionnaire_id ? questionnaires.find(q => q.id === m.questionnaire_id) : undefined,
        senderName: m.from_user.parent_name || m.from_user.username,
        timestampISO: m.created_at,
      }));
      setMessages(mapped);
    } catch (e) {
      console.warn('Failed to fetch messages, using sample data', e);
      // For demo, add some sample messages with questionnaires
      if (messages.length === 0) {
        setMessages([
          {
            id: 1,
            type: 'sent',
            text: "Hello Sarah Chen! I'm from the REACH support team. How can I help you today?",
            senderName: 'You',
            timestampISO: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: 2,
            type: 'sent',
            questionnaire: questionnaires.find(q => q.id === '1'),
            senderName: 'You',
            timestampISO: new Date().toISOString(),
          }
        ]);
      }
    }
  };

  /* -------------------- load messages when selection changes -------------------- */
  useEffect(() => {
    if (!selectedConv) { 
      // For demo, show some sample messages when no conversation is selected
      if (messages.length === 0) {
        setMessages([
          {
            id: 1,
            type: 'sent',
            text: "Hello! Please select a conversation to start chatting.",
            senderName: 'System',
            timestampISO: new Date().toISOString(),
          }
        ]);
      }
      return; 
    }
    
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        await fetchMessages(selectedConv.id);
      } catch (e: any) {
        if (alive) setErrorMsg(e.message || 'Load failed');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [selectedConv, questionnaires]);

  /* -------------------- autoscroll -------------------- */
  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 0);
    }
  }, [messages, selectedConv]);

  /* -------------------- contacts from conversations (left list) -------------------- */
  const contacts = useMemo(() => {
    return conversations.map((c) => {
      const other = c.participants.find((p) => p.id !== CURRENT_STAFF.id) || c.participants[0];
      return {
        id: c.id,
        name: c.conversation_type === 'private'
          ? (other?.parent_name || other?.username)
          : (c.name || `Group #${c.id}`),
        role: (other?.role || 'parent') as 'parent' | 'teacher',
        childName: other?.children_name || undefined,
        lastMessage: c.last_message?.text || (c.last_message?.attachment ? 'Attachment' : ''),
        lastMessageTime: c.last_message?.created_at || c.updated_at,
        otherUserId: other?.id,
      };
    });
  }, [conversations]);

  const parentContacts = contacts.filter((c) => c.role === 'parent');
  const teacherContacts = contacts.filter((c) => c.role === 'teacher');

  /* -------------------- directory search (users) -------------------- */
  const filteredDirectory: ApiUser[] = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    setShowDirectory(true);
    return allUsers
      .filter(u =>
        (u.username || '').toLowerCase().includes(q) ||
        (u.parent_name || '').toLowerCase().includes(q) ||
        (u.children_name || '').toLowerCase().includes(q) ||
        (u.role || '').toLowerCase().includes(q)
      )
      .slice(0, 25);
  }, [searchQuery, allUsers]);

  /* -------------------- open OR create a private conversation -------------------- */
  const openOrCreateConversation = async (targetUserId: number) => {
    // 1) try to find an existing private conversation with this user
    const existing = conversations.find(
      (c) =>
        c.conversation_type === 'private' &&
        c.participants.some((p) => p.id === targetUserId) &&
        c.participants.some((p) => p.id === CURRENT_STAFF.id)
    );
    if (existing) {
      setSelectedConv(existing);
      return;
    }

    // 2) else create it
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/chat/conversations/create/`, {
        method: 'POST',
        headers: {
          'User-ID': String(CURRENT_STAFF.id),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ participant_id: targetUserId }),
      });
      if (!res.ok) throw new Error(`Create conversation failed (${res.status})`);
      const created: { conversation: ApiConversation } | ApiConversation = await res.json();
      const convo = (created as any).conversation ?? (created as ApiConversation);

      // push to list if not present
      setConversations((prev) => {
        const already = prev.find((c) => c.id === convo.id);
        return already ? prev : [convo, ...prev];
      });
      setSelectedConv(convo);
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed creating conversation');
    } finally {
      setLoading(false);
      setShowDirectory(false);
    }
  };

  const avatarInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  const selectedHeader = useMemo(() => {
    if (!selectedConv) return null;
    const other = selectedConv.participants.find((p) => p.id !== CURRENT_STAFF.id) || selectedConv.participants[0];
    const displayName = selectedConv.conversation_type === 'private'
      ? (other?.parent_name || other?.username)
      : (selectedConv.name || `Group #${selectedConv.id}`);
    return { displayName, role: (other?.role || 'parent') as Role, childName: other?.children_name, lastActive: selectedConv.updated_at };
  }, [selectedConv]);

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setComposerFile(f);
  };

  const sendMessage = async () => {
    if (!selectedConv) return;
    const hasText = composerText.trim().length > 0;
    const hasQuestionnaire = !!selectedQuestionnaire;
    
    if (!hasText && !composerFile && !hasQuestionnaire) return;

    const localId = `${Date.now()}`;
    const questionnaire = questionnaires.find(q => q.id === selectedQuestionnaire);
    
    // Add message to UI immediately
    const newMessage: ChatBubble = {
      id: localId,
      type: 'sent',
      text: hasText ? composerText.trim() : undefined,
      attachmentUrl: composerFile ? URL.createObjectURL(composerFile) : undefined,
      questionnaire: questionnaire,
      senderName: CURRENT_STAFF.username,
      timestampISO: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, newMessage]);

    try {
      const url = `${API_BASE}/chat/conversations/${selectedConv.id}/messages/`;
      let res: Response;

      if (composerFile) {
        const form = new FormData();
        if (composerText.trim()) form.append('text', composerText.trim());
        if (selectedQuestionnaire) form.append('questionnaire_id', selectedQuestionnaire);
        form.append('attachment', composerFile);
        res = await fetch(url, {
          method: 'POST',
          headers: { 'User-ID': String(CURRENT_STAFF.id) },
          body: form,
        });
      } else {
        res = await fetch(url, {
          method: 'POST',
          headers: { 
            'User-ID': String(CURRENT_STAFF.id), 
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({ 
            text: composerText.trim(),
            questionnaire_id: selectedQuestionnaire || undefined
          }),
        });
      }

      if (!res.ok) throw new Error(`Send failed (${res.status})`);
      // Refresh messages to get the real ID from server
      await fetchMessages(selectedConv.id);
    } catch (err) {
      console.error(err);
      // Keep the message in UI even if API fails for demo purposes
    } finally {
      setComposerText('');
      setComposerFile(null);
      setSelectedQuestionnaire('');
    }
  };

  const renderQuestionnairePreview = (questionnaire: Questionnaire) => {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-center space-x-2 mb-3">
          <FileQuestion className="w-5 h-5 text-blue-600" />
          <h4 className="font-medium text-gray-900">Questionnaire: {questionnaire.title}</h4>
        </div>
        <p className="text-sm text-gray-600 mb-3">{questionnaire.description}</p>
        
        {questionnaire.questions && questionnaire.questions.slice(0, 2).map((question, index) => (
          <div key={question.id} className="mb-2">
            <p className="text-xs font-medium text-gray-700">
              {index + 1}. {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </p>
            {question.type === 'multiple_choice' && question.options && (
              <div className="ml-2 mt-1">
                {question.options.map(option => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full border border-gray-400"></div>
                    <span className="text-xs text-gray-600">{option.text}</span>
                  </div>
                ))}
              </div>
            )}
            {question.type === 'rating' && (
              <div className="ml-2 mt-1 flex space-x-1">
                {[...Array(question.ratingScale || 5)].map((_, i) => (
                  <div key={i} className="w-4 h-4 rounded-full bg-gray-200"></div>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {questionnaire.questions && questionnaire.questions.length > 2 && (
          <p className="text-xs text-gray-500 mt-2">
            +{questionnaire.questions.length - 2} more questions...
          </p>
        )}
        
        <div className="mt-3 pt-2 border-t border-gray-100">
          <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-xs">
            Complete Questionnaire
          </Button>
        </div>
      </div>
    );
  };

  const renderMessageContent = (message: ChatBubble) => {
    if (message.questionnaire) {
      return renderQuestionnairePreview(message.questionnaire);
    }
    
    return (
      <>
        {message.text && <p className="text-sm whitespace-pre-line">{message.text}</p>}
        {message.attachmentUrl && (
          <div className="mt-2">
            <a href={message.attachmentUrl} target="_blank" rel="noreferrer" className={`text-xs underline ${message.type === 'sent' ? 'text-blue-100' : 'text-blue-700'}`}>
              View attachment
            </a>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <MessageCircle className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl text-gray-900">Chat Center</h2>
        <Badge variant="secondary" className="ml-auto">{0} unread</Badge>
      </div>

      {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

      <Tabs defaultValue="messages" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="messages" className="flex items-center space-x-2">
            <MessageCircle className="w-4 h-4" />
            <span>Messages</span>
          </TabsTrigger>
          <TabsTrigger value="questionnaires" className="flex items-center space-x-2">
            <FileQuestion className="w-4 h-4" />
            <span>Questionnaires</span>
          </TabsTrigger>
        </TabsList>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contacts + Directory Search */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Contacts</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search parents / teachers / staff..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowDirectory(true)}
                    className="pl-10"
                  />
                  {/* directory results popover */}
                  {showDirectory && searchQuery.trim() && (
                    <div
                      className="absolute z-20 mt-2 w-full max-h-72 overflow-auto rounded-md border bg-white shadow-lg"
                      onMouseLeave={() => setShowDirectory(false)}
                    >
                      {filteredDirectory.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-gray-500">No matches</div>
                      ) : (
                        filteredDirectory.map(u => {
                          const display = u.parent_name || u.username;
                          const badge =
                            u.role === 'parent' ? <Heart className="w-3 h-3 text-blue-500" /> :
                            u.role === 'teacher' ? <GraduationCap className="w-3 h-3 text-green-500" /> :
                            <MessageCircle className="w-3 h-3 text-gray-500" />;
                          return (
                            <button
                              key={u.id}
                              className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center space-x-3"
                              onClick={() => openOrCreateConversation(u.id)}
                            >
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className={`${u.role === 'parent' ? 'bg-blue-500' : u.role === 'teacher' ? 'bg-green-500' : 'bg-gray-500'} text-white`}>
                                  {avatarInitials(display)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900 truncate">{display}</p>
                                {u.children_name && <p className="text-xs text-gray-500 truncate">Child: {u.children_name}</p>}
                              </div>
                              {badge}
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <Tabs defaultValue="all">
                  <TabsList className="w-full px-4">
                    <TabsTrigger value="all" className="flex-1">Recent</TabsTrigger>
                    <TabsTrigger value="parents" className="flex-1">Parents</TabsTrigger>
                    <TabsTrigger value="teachers" className="flex-1">Teachers</TabsTrigger>
                  </TabsList>

                  {/* All */}
                  <TabsContent value="all" className="mt-0">
                    <ScrollArea className="h-[500px]">
                      {contacts.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => setSelectedConv(conversations.find((cv) => cv.id === c.id) || null)}
                          className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selectedConv?.id === c.id ? 'bg-blue-50 border-blue-200' : ''}`}
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className={`text-white ${c.role === 'parent' ? 'bg-blue-500' : 'bg-green-500'}`}>
                                {avatarInitials(c.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <p className="text-sm text-gray-900 truncate">{c.name}</p>
                                {c.role === 'parent' ? <Heart className="w-3 h-3 text-blue-500" /> : <GraduationCap className="w-3 h-3 text-green-500" />}
                              </div>
                              {c.childName && <p className="text-xs text-gray-500">Child: {c.childName}</p>}
                              <p className="text-xs text-gray-600 truncate mt-1">{c.lastMessage}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </TabsContent>

                  {/* Parents */}
                  <TabsContent value="parents" className="mt-0">
                    <ScrollArea className="h-[500px]">
                      {parentContacts.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => setSelectedConv(conversations.find((cv) => cv.id === c.id) || null)}
                          className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selectedConv?.id === c.id ? 'bg-blue-50 border-blue-200' : ''}`}
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-blue-500 text-white">{avatarInitials(c.name)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <p className="text-sm text-gray-900 truncate">{c.name}</p>
                                <Heart className="w-3 h-3 text-blue-500" />
                              </div>
                              {c.childName && <p className="text-xs text-gray-500">Child: {c.childName}</p>}
                              <p className="text-xs text-gray-600 truncate mt-1">{c.lastMessage}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </TabsContent>

                  {/* Teachers */}
                  <TabsContent value="teachers" className="mt-0">
                    <ScrollArea className="h-[500px]">
                      {teacherContacts.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => setSelectedConv(conversations.find((cv) => cv.id === c.id) || null)}
                          className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selectedConv?.id === c.id ? 'bg-blue-50 border-blue-200' : ''}`}
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-green-500 text-white">{avatarInitials(c.name)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <p className="text-sm text-gray-900 truncate">{c.name}</p>
                                <GraduationCap className="w-3 h-3 text-green-500" />
                              </div>
                              <p className="text-xs text-gray-600 truncate mt-1">{c.lastMessage}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Chat Area */}
            <Card className="lg:col-span-2">
              {selectedConv && selectedHeader ? (
                <>
                  <CardHeader className="pb-0">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className={`text-white ${selectedHeader.role === 'parent' ? 'bg-blue-500' : selectedHeader.role === 'teacher' ? 'bg-green-500' : 'bg-gray-500'}`}>
                          {avatarInitials(selectedHeader.displayName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg text-gray-900">{selectedHeader.displayName}</h3>
                          {selectedHeader.role === 'parent'
                            ? <Heart className="w-4 h-4 text-blue-500" />
                            : <GraduationCap className="w-4 h-4 text-green-500" />}
                        </div>
                        {selectedHeader.childName && <p className="text-sm text-gray-600">Child: {selectedHeader.childName}</p>}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0">
                    <div className="flex flex-col h-[600px]">
                      {/* messages list */}
                      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
                        <div className="space-y-4">
                          {messages.map((m) => (
                            <div key={m.id} className={`flex ${m.type === 'sent' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[80%] rounded-lg p-3 ${m.type === 'sent' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'}`}>
                                {renderMessageContent(m)}
                                <p className={`text-[11px] mt-1 ${m.type === 'sent' ? 'text-blue-100' : 'text-gray-500'}`}>
                                  {m.senderName} • {new Date(m.timestampISO).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* composer */}
                      <div className="border-t border-gray-200 p-3">
                        {composerFile && (
                          <div className="flex items-center mb-2">
                            <Badge variant="secondary" className="mr-2">{composerFile.name}</Badge>
                            <Button variant="ghost" size="sm" onClick={() => setComposerFile(null)} className="h-7 px-2" title="Remove file">
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )}

                        {selectedQuestionnaire && (
                          <div className="flex items-center mb-2">
                            <Badge variant="secondary" className="mr-2">
                              <FileQuestion className="w-3 h-3 mr-1" />
                              {questionnaires.find(q => q.id === selectedQuestionnaire)?.title}
                            </Badge>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedQuestionnaire('')} className="h-7 px-2" title="Remove questionnaire">
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )}

                        <div className="flex items-center space-x-2">
                          <input 
                            id="attach" 
                            type="file" 
                            className="hidden" 
                            ref={fileInputRef}
                            onChange={onPickFile} 
                          />
                          <label htmlFor="attach" className="inline-flex items-center justify-center h-10 w-10 rounded-md border border-gray-300 hover:bg-gray-50 cursor-pointer" title="Attach file or image">
                            <Paperclip className="w-4 h-4 text-gray-600" />
                          </label>

                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => setShowQuestionnaireSelector(true)}
                            title="Share questionnaire"
                            className="h-10 w-10"
                          >
                            <FileQuestion className="w-4 h-4" />
                          </Button>

                          <Input
                            placeholder="Type your message..."
                            value={composerText}
                            onChange={(e) => setComposerText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
                            }}
                            className="flex-1"
                          />
                          <Button onClick={sendMessage} disabled={!composerText.trim() && !composerFile && !selectedQuestionnaire} className="h-10">
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="flex items-center justify-center h-[600px]">
                  <div className="text-center">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg text-gray-900 mb-2">Select a conversation</h3>
                    <p className="text-gray-600">Choose a parent or teacher to start chatting</p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* Questionnaires Tab */}
        <TabsContent value="questionnaires">
          <QuestionnaireManager user={{
            id: CURRENT_STAFF.id.toString(),
            name: CURRENT_STAFF.username,
            role: CURRENT_STAFF.role
          }} />
        </TabsContent>
      </Tabs>

      {/* Questionnaire Selector Dialog - Fixed positioning with better styling */}
      {showQuestionnaireSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto shadow-xl border border-gray-200">
            <h3 className="text-lg font-medium mb-4 text-gray-900">Select a Questionnaire to Share</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {questionnaires.filter(q => q.status === 'active').length > 0 ? (
                questionnaires.filter(q => q.status === 'active').map((questionnaire) => (
                  <div 
                    key={questionnaire.id} 
                    className="p-3 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors border-gray-200"
                    onClick={() => {
                      setSelectedQuestionnaire(questionnaire.id);
                      setShowQuestionnaireSelector(false);
                    }}
                  >
                    <h4 className="font-medium text-gray-900">{questionnaire.title}</h4>
                    <p className="text-sm text-gray-600">{questionnaire.description}</p>
                    <div className="mt-2 text-xs text-blue-600">
                      {questionnaire.questions?.length || 0} questions
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No active questionnaires available</p>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => setShowQuestionnaireSelector(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}