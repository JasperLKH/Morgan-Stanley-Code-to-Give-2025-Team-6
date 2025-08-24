import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Send, Paperclip, Camera, Smile, Phone, Video, Loader2 } from 'lucide-react';
import { apiService } from '../../services/api';
import { useUser } from '../../contexts/UserContext';

interface User {
  id: string;
  name: string;
  role: string;
  children_name?: string;
}

interface Message {
  id: number;
  content: string;
  timestamp: string;
  sender: number;
  message_type: 'text' | 'image' | 'file';
}

interface Conversation {
  id: number;
  name?: string;
  is_group: boolean;
  participants: any[];
}

interface ChatPageProps {
  user: User;
}

export function ChatPage({ user }: ChatPageProps) {
  const { user: currentUser } = useUser();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!currentUser?.id) return;
      
      setLoading(true);
      try {
        const response = await apiService.getConversations(parseInt(currentUser.id));
        if (response.success && response.data) {
          const convs = response.data as Conversation[];
          setConversations(convs);
          
          // If no conversations exist, create one with teachers
          if (convs.length === 0) {
            // You might want to search for teachers and create a conversation
            // For now, we'll just show empty state
          } else {
            // Select the first conversation by default
            setSelectedConversation(convs[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [currentUser?.id]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation) return;
      
      try {
        const response = await apiService.getMessages(selectedConversation);
        if (response.success && response.data) {
          setMessages(response.data as Message[]);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [selectedConversation]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sending) return;
    
    setSending(true);
    try {
      const response = await apiService.sendMessage(selectedConversation, newMessage);
      if (response.success) {
        // Refresh messages
        const messagesResponse = await apiService.getMessages(selectedConversation);
        if (messagesResponse.success && messagesResponse.data) {
          setMessages(messagesResponse.data as Message[]);
        }
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickReplies = [
    'Thank you!',
    'Got it',
    'Will do',
    'Any tips?',
    'How is my child doing?',
    'Need help with...',
  ];

  const getConversationName = (conversation: Conversation) => {
    if (conversation.name) return conversation.name;
    if (conversation.is_group) return 'Group Chat';
    
    // For private conversations, show the other participant's name
    const otherParticipant = conversation.participants.find(
      p => p.id !== parseInt(currentUser?.id || '0')
    );
    return otherParticipant?.name || 'Chat';
  };

  const isOwnMessage = (message: Message) => {
    return message.sender === parseInt(currentUser?.id || '0');
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2">Loading conversations...</span>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 p-4">
          <h2 className="text-xl text-gray-900">Chat</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">No conversations yet</p>
            <p className="text-sm text-gray-400">
              Conversations with teachers will appear here
            </p>
          </div>
        </div>
      </div>
    );
  }

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-blue-500 text-white">
                {selectedConv ? getConversationName(selectedConv).charAt(0).toUpperCase() : 'C'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg text-gray-900">
                {selectedConv ? getConversationName(selectedConv) : 'Chat'}
              </h2>
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

      {/* Conversation List (if multiple conversations) */}
      {conversations.length > 1 && (
        <div className="bg-white border-b border-gray-200 p-2">
          <div className="flex space-x-2 overflow-x-auto">
            {conversations.map((conv) => (
              <Button
                key={conv.id}
                variant={selectedConversation === conv.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedConversation(conv.id)}
                className="whitespace-nowrap"
              >
                {getConversationName(conv)}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No messages yet</p>
            <p className="text-sm text-gray-400">Start a conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = isOwnMessage(message);
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    isOwn
                      ? 'bg-blue-500 text-white'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwn ? 'text-blue-100' : 'text-gray-400'
                    }`}
                  >
                    {formatTimestamp(message.timestamp)}
                  </p>
                </div>
              </div>
            );
          })
        )}
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
              disabled={sending}
            />
          </div>
          <Button variant="ghost" size="sm">
            <Smile className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            className="rounded-full bg-blue-500 hover:bg-blue-600"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
