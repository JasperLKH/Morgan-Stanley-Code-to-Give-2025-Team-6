import React from 'react';
import { TeacherStudents } from './teacher/TeacherStudents';
import { TeacherAssignments } from './teacher/TeacherAssignments';
import { TeacherChat } from './teacher/TeacherChat';
import { HelpDialog } from './HelpDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { TeacherProvider } from './contexts/TeacherContext';

interface User {
  id: string;
  name: string;
  role: string;
}
interface TeacherAppProps {
  user: User;
  onLogout: () => void;
}

export function TeacherApp({ user, onLogout }: TeacherAppProps) {
  return (
    <TeacherProvider user={user}>
      <TeacherAppContent onLogout={onLogout} />
    </TeacherProvider>
  );
}

function TeacherAppContent({ onLogout }: { onLogout: () => void }) {
  const teacherName = 'John'; // fixed as per brief

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
          <Button variant="ghost" size="sm" onClick={onLogout} className="text-gray-500 hover:text-gray-700">
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

          <TabsContent value="students" className="space-y-6 mt-6">
            <TeacherStudents />
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6 mt-6">
            <TeacherAssignments />
          </TabsContent>

          <TabsContent value="chat" className="mt-6">
            <TeacherChat />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}