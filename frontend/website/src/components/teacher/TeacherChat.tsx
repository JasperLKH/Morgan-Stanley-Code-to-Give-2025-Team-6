import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { MessageCircle, Send } from 'lucide-react';

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

type ChatMessage = {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  type: 'sent' | 'received';
};

const API_BASE = 'http://localhost:8000';
const CHAT_POLL_MS = 3000;
const TEACHER_ID = 19;
// TODO: replace with actual logged-in user

const formatTime = (ts: string) => {
  const d = new Date(ts);
  return Number.isNaN(d.getTime())
    ? ts
    : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export function TeacherChat() {
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [selectedConv, setSelectedConv] = useState<ApiConversation | null>(null);

  const pollingRef = useRef<number | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  const withUserHeader = (init?: RequestInit): RequestInit => ({
    credentials: 'omit',
    ...(init || {}),
    headers: { ...(init?.headers || {}), 'User-ID': String(TEACHER_ID) },
  });

  const ensureStaffConversation = async (): Promise<ApiConversation | null> => {
    const convRes = await fetch(`${API_BASE}/chat/conversations/`, withUserHeader());
    if (!convRes.ok) throw new Error(`Failed to load conversations (${convRes.status})`);
    const convPayload: { conversations: ApiConversation[] } = await convRes.json();
    console.log(convPayload)
    const all = convPayload.conversations || [];

    const existing =
      all.find(
        (c) =>
          c.conversation_type === 'private' &&
          c.participants.some((p) => p.id === TEACHER_ID) &&
          c.participants.some((p) => p.role === 'staff')
      ) || null;
    if (existing) return existing;

    const usersRes = await fetch(`${API_BASE}/account/users/`, withUserHeader());
    if (!usersRes.ok) throw new Error(`Failed to load users (${usersRes.status})`);
    const usersPayload: { users: ApiUser[] } = await usersRes.json();
    const anyStaff = (usersPayload.users || []).find((u) => u.role === 'staff');
    if (!anyStaff) return null;

    const createRes = await fetch(`${API_BASE}/chat/conversations/create/`, {
      method: 'POST',
      headers: { 'User-ID': String(TEACHER_ID), 'Content-Type': 'application/json' },
      body: JSON.stringify({ participant_id: anyStaff.id }),
    });
    if (!createRes.ok) throw new Error(`Failed to create conversation (${createRes.status})`);
    const created: { conversation: ApiConversation } | ApiConversation = await createRes.json();
    return (created as any).conversation ?? (created as ApiConversation);
  };

  const loadMessages = async (convId: number, signal?: AbortSignal) => {
    const res = await fetch(
      `${API_BASE}/chat/conversations/${convId}/messages/list`,
      withUserHeader({ signal })
    );
    if (!res.ok) throw new Error(`Failed to fetch messages (${res.status})`);
    const data: { messages: ApiMessage[] } = await res.json();

    const mapped: ChatMessage[] = (data.messages || [])
      .map((m) => {
        const isMe = m.from_user.id === TEACHER_ID;
        return {
          id: String(m.id),
          sender: isMe ? 'You' : m.from_user.parent_name || m.from_user.username || 'REACH Staff',
          message: m.text || (m.attachment ? '[Attachment]' : ''),
          timestamp: formatTime(m.created_at),
          type: isMe ? ('sent' as const) : ('received' as const),
        };
      })
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp));

    setChatMessages(mapped);
  };

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        setChatLoading(true);
        const convo = await ensureStaffConversation();
        if (convo) {
          setSelectedConv(convo);
          await loadMessages(convo.id, controller.signal);
          pollingRef.current = window.setInterval(() => {
            loadMessages(convo.id).catch(() => {});
          }, CHAT_POLL_MS) as unknown as number;
        } else {
          setChatError('No staff available to chat.');
        }
      } catch (e: any) {
        setChatError(e?.message || 'Unable to initialize chat');
      } finally {
        setChatLoading(false);
      }
    })();

    return () => {
      controller.abort();
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, []);

  // autoscroll to bottom on new messages
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const sendMessage = async () => {
    const text = chatMessage.trim();
    if (!text || !selectedConv) return;

    const tempId = `tmp-${Date.now()}`;
    setChatMessages((prev) => [
      ...prev,
      {
        id: tempId,
        sender: 'You',
        message: text,
        timestamp: formatTime(new Date().toISOString()),
        type: 'sent',
      } as ChatMessage,
    ]);
    setChatMessage('');

    try {
      const url = `${API_BASE}/chat/conversations/${selectedConv.id}/messages/`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'User-ID': String(TEACHER_ID), 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error(`Failed to send message (${res.status})`);
      await loadMessages(selectedConv.id);
    } catch (e: any) {
      setChatMessages((prev) => prev.filter((m) => m.id !== tempId));
      setChatError(e?.message || 'Failed to send message');
      setChatMessage(text);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="max-h-[70vh] min-h-[420px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          <span>Chat with REACH Staff</span>
        </CardTitle>
      </CardHeader>

      {/* min-h-0 ensures the ScrollArea can shrink and become scrollable */}
      <CardContent className="flex-1 min-h-0 flex flex-col p-0">
        {/* This viewport scrolls when messages overflow */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {chatLoading && chatMessages.length === 0 && (
              <div className="text-xs text-gray-500">Loading messages…</div>
            )}
            {chatError && <div className="text-xs text-red-500">Error: {chatError}</div>}
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.type === 'sent' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'
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
            <div ref={endRef} />
          </div>
        </ScrollArea>

        {/* Composer stays pinned; the area above scrolls */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <Input
              placeholder="Type your message to REACH Staff…"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={onKeyDown}
              className="flex-1"
            />
            <Button onClick={sendMessage} disabled={!chatMessage.trim() || !selectedConv}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">
            You’re messaging <strong>REACH Staff</strong>. Teachers cannot message other teachers or
            parents.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}