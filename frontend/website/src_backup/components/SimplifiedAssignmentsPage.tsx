import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useParentContext } from '../contexts/ParentContext';
// Simple file upload component
const SimpleFileUpload = ({ onUploadComplete }: { onUploadComplete: (files: any[]) => void }) => {
  const [files, setFiles] = useState<File[]>([]);
  const { t } = useParentContext();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
    }
  };

  const handleSubmit = () => {
    onUploadComplete(files);
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        multiple
        accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileSelect}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Selected files:</p>
          {files.map((file, index) => (
            <div key={index} className="text-sm text-gray-700 bg-gray-100 p-2 rounded">
              {file.name} ({Math.round(file.size / 1024)}KB)
            </div>
          ))}
          <Button onClick={handleSubmit} className="w-full mt-3">
            Submit Files
          </Button>
        </div>
      )}
    </div>
  );
};
import { 
  Calendar, 
  Upload, 
  Star, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Camera, 
  FileText,
  TrendingUp,
  Award
} from 'lucide-react';

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

export function SimplifiedAssignmentsPage() {
  const { state, t } = useParentContext();
  const [showUploader, setShowUploader] = useState<string | null>(null);
  const [assignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Math Worksheet - Addition',
      titleZh: '數學工作表 - 加法',
      subject: 'Mathematics',
      subjectZh: '數學',
      dueDate: '2024-08-24',
      status: 'pending',
      points: 5,
    },
    {
      id: '2',
      title: 'Reading Comprehension',
      titleZh: '閱讀理解',
      subject: 'English',
      subjectZh: '英語',
      dueDate: '2024-08-25',
      status: 'pending',
      points: 3,
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
  const gradedAssignments = assignments.filter(a => a.status === 'graded');
  const completedCount = assignments.filter(a => a.status === 'graded').length;
  const totalAssignments = assignments.length;

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

  const handleUploadComplete = (files: any[]) => {
    console.log('Assignment uploaded:', files);
    setShowUploader(null);
    // In real app, would update assignment status
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-25 to-emerald-25" style={{
      background: 'linear-gradient(to bottom, #f0f9ff, #ecfdf5)'
    }}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl text-gray-900">{t('assignments.title', 'Assignments')}</h2>
          <p className="text-gray-600">{state.user.childName}{t('assignments.learningTasks', "'s learning tasks")}</p>
        </div>

        {/* Progress Overview */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span>{t('assignments.weekProgress', "This Week's Progress")}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-xl text-gray-900">{completedCount}</div>
                <div className="text-xs text-gray-600">{t('assignments.completedTasks', 'Completed Tasks')}</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Star className="w-6 h-6 text-amber-600" />
                </div>
                <div className="text-xl text-gray-900">+{gradedAssignments.reduce((sum, a) => sum + a.points, 0)}</div>
                <div className="text-xs text-gray-600">{t('assignments.pointsEarned', 'Points Earned')}</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Overall Progress</span>
                <span className="text-sm text-gray-900">{completedCount}/{totalAssignments} assignments</span>
              </div>
              <Progress value={(completedCount / totalAssignments) * 100} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Assignment Tabs */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending">
              {t('assignments.pending', 'Pending')} ({pendingAssignments.length})
            </TabsTrigger>
            <TabsTrigger value="graded">
              {t('assignments.graded', 'Completed')} ({gradedAssignments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4 mt-6">
            {pendingAssignments.length === 0 ? (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <Award className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-lg text-gray-900 mb-2">All Caught Up!</h3>
                  <p className="text-gray-600">No pending assignments at the moment.</p>
                </CardContent>
              </Card>
            ) : (
              pendingAssignments.map((assignment) => (
                <Card key={assignment.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        {getStatusIcon(assignment.status)}
                        <div>
                          <h3 className="text-gray-900 mb-1">
                            {state.language === 'zh' ? assignment.titleZh : assignment.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {state.language === 'zh' ? assignment.subjectZh : assignment.subject}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(assignment.status)}
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{t('assignments.due', 'Due')}: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>+{assignment.points} {t('assignments.points', 'points')}</span>
                        </div>
                      </div>
                    </div>

                    {showUploader === assignment.id ? (
                      <div className="space-y-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h4 className="text-blue-900 mb-2">Submit Assignment</h4>
                          <SimpleFileUpload onUploadComplete={handleUploadComplete} />
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => setShowUploader(null)}
                          className="w-full"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <Button 
                          className="bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-500 hover:to-emerald-500 text-white border-0"
                          onClick={() => setShowUploader(assignment.id)}
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          {t('assignments.takePhoto', 'Take Photo')}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setShowUploader(assignment.id)}
                          className="border-gray-300"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {t('assignments.uploadFile', 'Upload File')}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="graded" className="space-y-4 mt-6">
            {gradedAssignments.map((assignment) => (
              <Card key={assignment.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      {getStatusIcon(assignment.status)}
                      <div>
                        <h3 className="text-gray-900 mb-1">
                          {state.language === 'zh' ? assignment.titleZh : assignment.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {state.language === 'zh' ? assignment.subjectZh : assignment.subject}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(assignment.status)}
                      <Badge className="bg-emerald-500 text-white">{assignment.grade}</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{t('assignments.submitted', 'Submitted')}: {assignment.submittedAt ? new Date(assignment.submittedAt).toLocaleDateString() : 'N/A'}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>+{assignment.points} {t('assignments.pointsEarned', 'points earned')}</span>
                    </div>
                  </div>

                  {assignment.feedback && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <div className="flex items-start space-x-2">
                        <FileText className="w-4 h-4 text-emerald-600 mt-0.5" />
                        <div>
                          <h4 className="text-emerald-900 mb-1">Teacher Feedback</h4>
                          <p className="text-sm text-emerald-800">
                            {state.language === 'zh' ? assignment.feedbackZh : assignment.feedback}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}