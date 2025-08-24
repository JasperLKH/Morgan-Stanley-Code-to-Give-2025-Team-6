import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useParentContext } from '../contexts/ParentContext';
import { Calendar, Upload, Download, Star, Clock, CheckCircle, AlertCircle, Camera, FileText } from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  titleZh: string;
  subject: string;
  subjectZh: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  points: number;
  feedback?: string;
  feedbackZh?: string;
  grade?: string;
  submittedAt?: string;
}

export function AssignmentsPage() {
  const { state, t } = useParentContext();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [assignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Math Worksheet - Addition',
      titleZh: '數學工作表 - 加法',
      subject: 'Mathematics',
      subjectZh: '數學',
      dueDate: '2024-08-23',
      status: 'pending',
      points: 5,
    },
    {
      id: '2',
      title: 'Reading Comprehension',
      titleZh: '閱讀理解',
      subject: 'English',
      subjectZh: '英語',
      dueDate: '2024-08-22',
      status: 'submitted',
      points: 3,
      submittedAt: '2024-08-21',
    },
    {
      id: '3',
      title: 'Color Recognition Activity',
      titleZh: '顏色識別活動',
      subject: 'Art',
      subjectZh: '藝術',
      dueDate: '2024-08-20',
      status: 'graded',
      points: 4,
      grade: 'Excellent',
      feedback: 'Great work on identifying all the colors! Emma showed excellent attention to detail.',
      feedbackZh: '在識別所有顏色方面做得很好！Emma表現出極佳的注意力。',
      submittedAt: '2024-08-19',
    },
    {
      id: '4',
      title: 'Number Writing Practice',
      titleZh: '數字書寫練習',
      subject: 'Mathematics',
      subjectZh: '數學',
      dueDate: '2024-08-18',
      status: 'graded',
      points: 3,
      grade: 'Good',
      feedback: 'Numbers 1-5 are written well. Keep practicing numbers 6-10 for better formation.',
      feedbackZh: '數字1-5寫得很好。繼續練習數字6-10以更好地形成。',
      submittedAt: '2024-08-17',
    },
  ]);

  const pendingAssignments = assignments.filter(a => a.status === 'pending');
  const submittedAssignments = assignments.filter(a => a.status === 'submitted');
  const gradedAssignments = assignments.filter(a => a.status === 'graded');

  const handleFileUpload = (assignmentId: string) => {
    // In real app, this would upload to API
    console.log('Uploading file for assignment:', assignmentId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'submitted':
        return <Upload className="w-4 h-4 text-blue-500" />;
      case 'graded':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-700">{t('status.pending', 'Pending')}</Badge>;
      case 'submitted':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700">{t('status.submitted', 'Submitted')}</Badge>;
      case 'graded':
        return <Badge variant="secondary" className="bg-green-100 text-green-700">{t('status.graded', 'Graded')}</Badge>;
      default:
        return <Badge variant="secondary">{t('status.unknown', 'Unknown')}</Badge>;
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-xl text-gray-900">{t('assignments.title', 'Assignments')}</h2>
        <p className="text-sm text-gray-600">{state.user.childName}{t('assignments.learningTasks', "'s learning tasks")}</p>
      </div>

      {/* Weekly Progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>{t('assignments.weekProgress', "This Week's Progress")}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('assignments.completedTasks', 'Completed Tasks')}</span>
              <span className="text-sm text-gray-900">3 {t('assignments.of', 'of')} 4</span>
            </div>
            <Progress value={75} className="h-3" />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>1 {t('assignments.taskRemaining', 'task remaining')}</span>
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-500" />
                <span>+12 {t('assignments.pointsEarned', 'points earned')}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignments Tabs */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            {t('assignments.pending', 'Pending')} ({pendingAssignments.length})
          </TabsTrigger>
          <TabsTrigger value="submitted">
            {t('assignments.submitted', 'Submitted')} ({submittedAssignments.length})
          </TabsTrigger>
          <TabsTrigger value="graded">
            {t('assignments.graded', 'Graded')} ({gradedAssignments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingAssignments.map((assignment) => (
            <Card key={assignment.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    {getStatusIcon(assignment.status)}
                    <div>
                      <h3 className="text-sm text-gray-900">
                        {state.language === 'zh' ? assignment.titleZh : assignment.title}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {state.language === 'zh' ? assignment.subjectZh : assignment.subject}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(assignment.status)}
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{t('assignments.due', 'Due')}: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span>+{assignment.points} {t('assignments.points', 'points')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                    <Camera className="w-4 h-4 mr-1" />
                    {t('assignments.takePhoto', 'Take Photo')}
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Upload className="w-4 h-4 mr-1" />
                    {t('assignments.uploadFile', 'Upload File')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="submitted" className="space-y-4">
          {submittedAssignments.map((assignment) => (
            <Card key={assignment.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    {getStatusIcon(assignment.status)}
                    <div>
                      <h3 className="text-sm text-gray-900">
                        {state.language === 'zh' ? assignment.titleZh : assignment.title}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {state.language === 'zh' ? assignment.subjectZh : assignment.subject}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(assignment.status)}
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>{t('assignments.submitted', 'Submitted')}: {assignment.submittedAt ? new Date(assignment.submittedAt).toLocaleDateString() : 'N/A'}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span>+{assignment.points} {t('assignments.points', 'points')}</span>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-blue-800">
                    {t('assignments.waitingFeedback', 'Waiting for REACH teacher feedback')}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="graded" className="space-y-4">
          {gradedAssignments.map((assignment) => (
            <Card key={assignment.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    {getStatusIcon(assignment.status)}
                    <div>
                      <h3 className="text-sm text-gray-900">
                        {state.language === 'zh' ? assignment.titleZh : assignment.title}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {state.language === 'zh' ? assignment.subjectZh : assignment.subject}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(assignment.status)}
                    <Badge className="bg-green-500 text-white">{assignment.grade}</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>{t('assignments.submitted', 'Submitted')}: {assignment.submittedAt ? new Date(assignment.submittedAt).toLocaleDateString() : 'N/A'}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span>+{assignment.points} {t('assignments.pointsEarned', 'points earned')}</span>
                  </div>
                </div>

                {assignment.feedback && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">
                      {state.language === 'zh' ? assignment.feedbackZh : assignment.feedback}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}