import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  MessageCircle, 
  Send, 
  Users, 
  GraduationCap, 
  Heart,
  Search,
  Phone,
  Video
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  type: 'sent' | 'received';
}

interface ChatContact {
  id: string;
  name: string;
  role: 'parent' | 'teacher';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  childName?: string;
}

interface StaffChatProps {
  user: User;
}

export function StaffChat({ user }: StaffChatProps) {
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const contacts: ChatContact[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      role: 'parent',
      lastMessage: 'Thank you for the feedback on Emma\'s assignment!',
      lastMessageTime: '10:30 AM',
      unreadCount: 0,
      isOnline: true,
      childName: 'Emma Chen'
    },
    {
      id: '2',
      name: 'Lisa Wong',
      role: 'parent',
      lastMessage: 'Could you help with Alex\'s math homework?',
      lastMessageTime: '09:45 AM',
      unreadCount: 2,
      isOnline: false,
      childName: 'Alex Wong'
    },
    {
      id: '3',
      name: 'Miss Wong',
      role: 'teacher',
      lastMessage: 'The new grading rubric looks great!',
      lastMessageTime: 'Yesterday',
      unreadCount: 0,
      isOnline: true
    },
    {
      id: '4',
      name: 'David Lee',
      role: 'parent',
      lastMessage: 'Sophie completed her reading assignment.',
      lastMessageTime: 'Yesterday',
      unreadCount: 1,
      isOnline: false,
      childName: 'Sophie Lee'
    },
    {
      id: '5',
      name: 'Mr. Johnson',
      role: 'teacher',
      lastMessage: 'Need assistance with assignment grading.',
      lastMessageTime: '2 days ago',
      unreadCount: 0,
      isOnline: false
    }
  ];

  const sampleMessages: { [key: string]: ChatMessage[] } = {
    '1': [
      {
        id: '1',
        sender: 'Sarah Chen',
        message: 'Hi! I wanted to ask about Emma\'s progress in reading.',
        timestamp: '10:15 AM',
        type: 'received'
      },
      {
        id: '2',
        sender: 'You',
        message: 'Hello Sarah! Emma is doing wonderfully. She\'s shown great improvement in comprehension.',
        timestamp: '10:18 AM',
        type: 'sent'
      },
      {
        id: '3',
        sender: 'Sarah Chen',
        message: 'That\'s great to hear! Thank you for the feedback on Emma\'s assignment!',
        timestamp: '10:30 AM',
        type: 'received'
      }
    ],
    '2': [
      {
        id: '1',
        sender: 'Lisa Wong',
        message: 'Hello, Alex seems to be struggling with the math concepts. Could you help with his homework?',
        timestamp: '09:40 AM',
        type: 'received'
      },
      {
        id: '2',
        sender: 'Lisa Wong',
        message: 'Specifically with counting and number recognition.',
        timestamp: '09:45 AM',
        type: 'received'
      }
    ]
  };

  const handleContactSelect = (contact: ChatContact) => {
    setSelectedContact(contact);
    setMessages(sampleMessages[contact.id] || []);
  };

  const sendMessage = () => {
    if (messageInput.trim() && selectedContact) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'You',
        message: messageInput,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'sent'
      };
      setMessages(prev => [...prev, newMessage]);
      setMessageInput('');
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (contact.childName && contact.childName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const parentContacts = filteredContacts.filter(c => c.role === 'parent');
  const teacherContacts = filteredContacts.filter(c => c.role === 'teacher');

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <MessageCircle className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl text-gray-900">Chat Center</h2>
        <Badge variant="secondary" className="ml-auto">
          {contacts.reduce((sum, contact) => sum + contact.unreadCount, 0)} unread
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contacts List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Contacts</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="all">
              <TabsList className="w-full px-4">
                <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                <TabsTrigger value="parents" className="flex-1">Parents</TabsTrigger>
                <TabsTrigger value="teachers" className="flex-1">Teachers</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                <ScrollArea className="h-[500px]">
                  {filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => handleContactSelect(contact)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedContact?.id === contact.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className={`text-white ${
                              contact.role === 'parent' ? 'bg-blue-500' : 'bg-green-500'
                            }`}>
                              {contact.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {contact.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm text-gray-900 truncate">{contact.name}</p>
                            {contact.role === 'parent' ? (
                              <Heart className="w-3 h-3 text-blue-500" />
                            ) : (
                              <GraduationCap className="w-3 h-3 text-green-500" />
                            )}
                          </div>
                          {contact.childName && (
                            <p className="text-xs text-gray-500">Child: {contact.childName}</p>
                          )}
                          <p className="text-xs text-gray-600 truncate mt-1">{contact.lastMessage}</p>
                          <p className="text-xs text-gray-400">{contact.lastMessageTime}</p>
                        </div>
                        {contact.unreadCount > 0 && (
                          <Badge className="bg-red-500 text-white text-xs">
                            {contact.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="parents" className="mt-0">
                <ScrollArea className="h-[500px]">
                  {parentContacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => handleContactSelect(contact)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedContact?.id === contact.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-blue-500 text-white">
                              {contact.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {contact.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm text-gray-900 truncate">{contact.name}</p>
                            <Heart className="w-3 h-3 text-blue-500" />
                          </div>
                          <p className="text-xs text-gray-500">Child: {contact.childName}</p>
                          <p className="text-xs text-gray-600 truncate mt-1">{contact.lastMessage}</p>
                          <p className="text-xs text-gray-400">{contact.lastMessageTime}</p>
                        </div>
                        {contact.unreadCount > 0 && (
                          <Badge className="bg-red-500 text-white text-xs">
                            {contact.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="teachers" className="mt-0">
                <ScrollArea className="h-[500px]">
                  {teacherContacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => handleContactSelect(contact)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedContact?.id === contact.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-green-500 text-white">
                              {contact.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {contact.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm text-gray-900 truncate">{contact.name}</p>
                            <GraduationCap className="w-3 h-3 text-green-500" />
                          </div>
                          <p className="text-xs text-gray-600 truncate mt-1">{contact.lastMessage}</p>
                          <p className="text-xs text-gray-400">{contact.lastMessageTime}</p>
                        </div>
                        {contact.unreadCount > 0 && (
                          <Badge className="bg-red-500 text-white text-xs">
                            {contact.unreadCount}
                          </Badge>
                        )}
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
          {selectedContact ? (
            <>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className={`text-white ${
                        selectedContact.role === 'parent' ? 'bg-blue-500' : 'bg-green-500'
                      }`}>
                        {selectedContact.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg text-gray-900">{selectedContact.name}</h3>
                        {selectedContact.role === 'parent' ? (
                          <Heart className="w-4 h-4 text-blue-500" />
                        ) : (
                          <GraduationCap className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      {selectedContact.childName && (
                        <p className="text-sm text-gray-600">Child: {selectedContact.childName}</p>
                      )}
                      <p className="text-sm text-gray-500">
                        {selectedContact.isOnline ? 'Online' : 'Last seen ' + selectedContact.lastMessageTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Video className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col h-[500px] p-0">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.type === 'sent'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p className={`text-xs mt-1 ${
                            message.type === 'sent' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {message.sender} • {message.timestamp}
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
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={sendMessage} disabled={!messageInput.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
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
    </div>
  );
}