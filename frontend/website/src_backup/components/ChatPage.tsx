import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Send, Paperclip, Camera, Smile, Phone, Video } from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: string;
  childName?: string;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isStaff: boolean;
  type: 'text' | 'image' | 'file';
}

interface ChatPageProps {
  user: User;
}

export function ChatPage({ user }: ChatPageProps) {
  const [newMessage, setNewMessage] = useState('');
  const [messages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Miss Chen (REACH)',
      content: 'Hello! How is Emma doing with her reading practice at home?',
      timestamp: '10:30 AM',
      isStaff: true,
      type: 'text',
    },
    {
      id: '2',
      sender: 'You',
      content: 'She\'s doing great! She read her favorite book twice yesterday and was so proud of herself.',
      timestamp: '10:45 AM',
      isStaff: false,
      type: 'text',
    },
    {
      id: '3',
      sender: 'Miss Chen (REACH)',
      content: 'That\'s wonderful to hear! Reading the same book multiple times really helps with fluency. Keep encouraging her!',
      timestamp: '10:47 AM',
      isStaff: true,
      type: 'text',
    },
    {
      id: '4',
      sender: 'You',
      content: 'I have a question about the math homework. Should I help her count with her fingers or encourage mental math?',
      timestamp: '2:15 PM',
      isStaff: false,
      type: 'text',
    },
    {
      id: '5',
      sender: 'Miss Chen (REACH)',
      content: 'At her age, finger counting is perfectly fine and actually helpful for building number sense. We can gradually work towards mental math as she gets more confident.',
      timestamp: '2:30 PM',
      isStaff: true,
      type: 'text',
    },
  ]);

  const quickReplies = [
    'Thank you!',
    'Got it',
    'Will do',
    'Any tips?',
    'How is Emma doing?',
    'Need help with...',
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In real app, this would send to API
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-blue-500 text-white">MC</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg text-gray-900">Miss Chen</h2>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">REACH Teacher</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isStaff ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.isStaff
                  ? 'bg-white border border-gray-200'
                  : 'bg-blue-500 text-white'
              }`}
            >
              {message.isStaff && (
                <p className="text-xs text-gray-500 mb-1">{message.sender}</p>
              )}
              <p className="text-sm">{message.content}</p>
              <p
                className={`text-xs mt-1 ${
                  message.isStaff ? 'text-gray-400' : 'text-blue-100'
                }`}
              >
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Replies */}
      <div className="bg-white border-t border-gray-200 p-3">
        <div className="flex flex-wrap gap-2 mb-3">
          {quickReplies.map((reply, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setNewMessage(reply)}
              className="text-xs"
            >
              {reply}
            </Button>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Paperclip className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Camera className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="rounded-full"
            />
          </div>
          <Button variant="ghost" size="sm">
            <Smile className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="rounded-full bg-blue-500 hover:bg-blue-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}