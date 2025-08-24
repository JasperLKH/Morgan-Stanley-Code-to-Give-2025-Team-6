import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import { Clock, CheckCircle, Star, MessageCircle } from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: string;
}

interface AssignmentSubmission {
  id: string;
  studentName: string;
  parentName: string;
  assignmentTitle: string;
  subject: string;
  submittedAt: string;
  status: 'pending' | 'graded';
  grade?: string;
  feedback?: string;
}

interface AssignmentManagementProps {
  user: User;
}

export function AssignmentManagement({ user }: AssignmentManagementProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [grade, setGrade] = useState('');

  const submissions: AssignmentSubmission[] = [
    {
      id: '1',
      studentName: 'Emma Chen',
      parentName: 'Sarah Chen',
      assignmentTitle: 'Math Worksheet - Addition',
      subject: 'Mathematics',
      submittedAt: '2024-08-21 14:30',
      status: 'pending',
    },
    {
      id: '2',
      studentName: 'Alex Wong',
      parentName: 'Lisa Wong',
      assignmentTitle: 'Reading Comprehension',
      subject: 'English',
      submittedAt: '2024-08-21 16:45',
      status: 'pending',
    },
    {
      id: '3',
      studentName: 'Sophie Lee',
      parentName: 'David Lee',
      assignmentTitle: 'Color Recognition Activity',
      subject: 'Art',
      submittedAt: '2024-08-20 10:20',
      status: 'graded',
      grade: 'Excellent',
      feedback: 'Great work on identifying all the colors! Sophie showed excellent attention to detail.',
    },
  ];

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');
  const gradedSubmissions = submissions.filter(s => s.status === 'graded');

  const handleGradeSubmission = (submissionId: string) => {
    // In real app, this would submit to API
    console.log('Grading submission:', submissionId, { grade, feedback });
    setSelectedSubmission(null);
    setFeedback('');
    setGrade('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl text-gray-900">Assignment Management</h2>
        <p className="text-sm text-gray-600">Review and grade student submissions</p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">
            Pending Review ({pendingSubmissions.length})
          </TabsTrigger>
          <TabsTrigger value="graded">
            Graded ({gradedSubmissions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingSubmissions.map((submission) => (
            <Card key={submission.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm text-gray-900">{submission.assignmentTitle}</h3>
                    <p className="text-xs text-gray-600">{submission.subject}</p>
                    <p className="text-xs text-gray-500">
                      {submission.studentName} (Parent: {submission.parentName})
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                    <Clock className="w-3 h-3 mr-1" />
                    Pending
                  </Badge>
                </div>

                <div className="text-xs text-gray-500 mb-3">
                  Submitted: {new Date(submission.submittedAt).toLocaleString()}
                </div>

                {selectedSubmission === submission.id ? (
                  <div className="space-y-3 border-t pt-3">
                    <div>
                      <label className="text-sm text-gray-700 block mb-1">Grade</label>
                      <select
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="">Select grade...</option>
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Satisfactory">Satisfactory</option>
                        <option value="Needs Improvement">Needs Improvement</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-700 block mb-1">Feedback</label>
                      <Textarea
                        placeholder="Provide constructive feedback for the student and parent..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleGradeSubmission(submission.id)}
                        disabled={!grade || !feedback}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Submit Grade
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedSubmission(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => setSelectedSubmission(submission.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Star className="w-4 h-4 mr-1" />
                      Grade
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Contact Parent
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="graded" className="space-y-4">
          {gradedSubmissions.map((submission) => (
            <Card key={submission.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm text-gray-900">{submission.assignmentTitle}</h3>
                    <p className="text-xs text-gray-600">{submission.subject}</p>
                    <p className="text-xs text-gray-500">
                      {submission.studentName} (Parent: {submission.parentName})
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Graded
                    </Badge>
                    <Badge className="bg-blue-500 text-white">{submission.grade}</Badge>
                  </div>
                </div>

                <div className="text-xs text-gray-500 mb-3">
                  Submitted: {new Date(submission.submittedAt).toLocaleString()}
                </div>

                {submission.feedback && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">{submission.feedback}</p>
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