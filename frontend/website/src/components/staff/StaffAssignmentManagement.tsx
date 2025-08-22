import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Eye, 
  Edit,
  BookOpen,
  Users,
  Star,
  MessageCircle
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: string;
}

interface Assignment {
  id: string;
  title: string;
  type: 'reading' | 'math' | 'writing' | 'art';
  description: string;
  releaseDate: string;
  dueDate: string;
  points: number;
  totalSubmissions: number;
  pendingReview: number;
  completedReviews: number;
  averageScore: number;
  status: 'draft' | 'active' | 'completed';
}

interface Submission {
  id: string;
  studentName: string;
  parentName: string;
  assignmentTitle: string;
  submittedDate: string;
  content: string;
  score?: number;
  feedback?: string;
  status: 'pending' | 'graded';
}

interface StaffAssignmentManagementProps {
  user: User;
}

export function StaffAssignmentManagement({ user }: StaffAssignmentManagementProps) {
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    type: 'reading' as 'reading' | 'math' | 'writing' | 'art',
    description: '',
    releaseDate: '',
    dueDate: '',
    points: 10
  });
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [gradeScore, setGradeScore] = useState('');
  const [gradeFeedback, setGradeFeedback] = useState('');

  const assignments: Assignment[] = [
    {
      id: '1',
      title: 'Read "The Little Red Hen"',
      type: 'reading',
      description: 'Students read the story and discuss with parents',
      releaseDate: '2024-12-20',
      dueDate: '2024-12-25',
      points: 10,
      totalSubmissions: 15,
      pendingReview: 3,
      completedReviews: 12,
      averageScore: 82,
      status: 'active'
    },
    {
      id: '2',
      title: 'Practice Writing Numbers 1-5',
      type: 'writing',
      description: 'Number tracing and writing practice',
      releaseDate: '2024-12-21',
      dueDate: '2024-12-26',
      points: 15,
      totalSubmissions: 12,
      pendingReview: 5,
      completedReviews: 7,
      averageScore: 78,
      status: 'active'
    },
    {
      id: '3',
      title: 'Holiday Math Activities',
      type: 'math',
      description: 'Count and sort holiday decorations',
      releaseDate: '2024-12-28',
      dueDate: '2025-01-05',
      points: 12,
      totalSubmissions: 0,
      pendingReview: 0,
      completedReviews: 0,
      averageScore: 0,
      status: 'draft'
    }
  ];

  const submissions: Submission[] = [
    {
      id: '1',
      studentName: 'Emma Chen',
      parentName: 'Sarah Chen',
      assignmentTitle: 'Read "The Little Red Hen"',
      submittedDate: '2024-12-23',
      content: 'Emma read the entire story and we discussed the moral about hard work. She particularly enjoyed the part where the hen bakes the bread.',
      status: 'pending'
    },
    {
      id: '2',
      studentName: 'Alex Wong',
      parentName: 'Lisa Wong',
      assignmentTitle: 'Practice Writing Numbers 1-5',
      submittedDate: '2024-12-24',
      content: 'Alex practiced writing numbers 1-5. He did well with 1,2,3 but needed help with 4 and 5. We will continue practicing.',
      status: 'pending'
    },
    {
      id: '3',
      studentName: 'Sophie Lee',
      parentName: 'David Lee',
      assignmentTitle: 'Read "The Little Red Hen"',
      submittedDate: '2024-12-22',
      content: 'Sophie listened to the story and helped me point out all the animals. She drew a picture of the hen afterwards.',
      score: 85,
      feedback: 'Great comprehension and creativity! Sophie shows good understanding of the story characters.',
      status: 'graded'
    }
  ];

  const createAssignment = () => {
    console.log('Creating assignment:', newAssignment);
    setNewAssignment({
      title: '',
      type: 'reading',
      description: '',
      releaseDate: '',
      dueDate: '',
      points: 10
    });
  };

  const gradeSubmission = () => {
    if (selectedSubmission && gradeScore && gradeFeedback) {
      console.log('Grading submission:', {
        submissionId: selectedSubmission.id,
        score: gradeScore,
        feedback: gradeFeedback
      });
      setSelectedSubmission(null);
      setGradeScore('');
      setGradeFeedback('');
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'reading': return 'bg-blue-100 text-blue-800';
      case 'math': return 'bg-green-100 text-green-800';
      case 'writing': return 'bg-purple-100 text-purple-800';
      case 'art': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-gray-900">Assignment Management</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create Assignment</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Assignment</DialogTitle>
              <DialogDescription>
                Add a new assignment for students to complete
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Assignment Title</Label>
                <Input
                  id="title"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                  placeholder="Enter assignment title"
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={newAssignment.type}
                  onValueChange={(value: 'reading' | 'math' | 'writing' | 'art') => 
                    setNewAssignment({...newAssignment, type: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reading">Reading</SelectItem>
                    <SelectItem value="math">Math</SelectItem>
                    <SelectItem value="writing">Writing</SelectItem>
                    <SelectItem value="art">Art</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                  placeholder="Describe the assignment"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="releaseDate">Release Date</Label>
                  <Input
                    id="releaseDate"
                    type="date"
                    value={newAssignment.releaseDate}
                    onChange={(e) => setNewAssignment({...newAssignment, releaseDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="points">Points</Label>
                <Input
                  id="points"
                  type="number"
                  value={newAssignment.points}
                  onChange={(e) => setNewAssignment({...newAssignment, points: parseInt(e.target.value) || 0})}
                  min="1"
                  max="50"
                />
              </div>
              <Button onClick={createAssignment} className="w-full">
                Create Assignment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="assignments" className="w-full">
        <TabsList>
          <TabsTrigger value="assignments">All Assignments</TabsTrigger>
          <TabsTrigger value="grading">Pending Grading</TabsTrigger>
        </TabsList>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-4 mt-6">
          {assignments.map((assignment) => (
            <Card key={assignment.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getTypeColor(assignment.type)} variant="secondary">
                        {assignment.type}
                      </Badge>
                      <Badge className={getStatusColor(assignment.status)} variant="secondary">
                        {assignment.status}
                      </Badge>
                      <span className="text-sm text-gray-600">+{assignment.points} points</span>
                    </div>
                    <h3 className="text-lg text-gray-900 mb-1">{assignment.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{assignment.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Release: {assignment.releaseDate}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>Due: {assignment.dueDate}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-lg text-gray-900">{assignment.totalSubmissions}</p>
                    <p className="text-xs text-gray-600">Total Submissions</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <p className="text-lg text-gray-900">{assignment.pendingReview}</p>
                    <p className="text-xs text-gray-600">Pending Review</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-lg text-gray-900">{assignment.completedReviews}</p>
                    <p className="text-xs text-gray-600">Completed</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-lg text-gray-900">{assignment.averageScore}%</p>
                    <p className="text-xs text-gray-600">Avg Score</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    View Submissions
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  {assignment.pendingReview > 0 && (
                    <Button size="sm" className="flex-1">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Grade ({assignment.pendingReview})
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Grading Tab */}
        <TabsContent value="grading" className="space-y-4 mt-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600">
                {submissions.filter(s => s.status === 'pending').length} submissions pending review
              </span>
            </div>
          </div>

          {submissions.map((submission) => (
            <Card key={submission.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gray-200 text-gray-600">
                        {submission.studentName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-gray-900">{submission.studentName}</h4>
                      <p className="text-sm text-gray-600">Parent: {submission.parentName}</p>
                      <p className="text-sm text-gray-600">Assignment: {submission.assignmentTitle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={submission.status === 'graded' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                      {submission.status}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-1">
                      Submitted: {submission.submittedDate}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-800">{submission.content}</p>
                </div>

                {submission.status === 'graded' ? (
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-900">Score: {submission.score}%</span>
                    </div>
                    <p className="text-sm text-gray-700">{submission.feedback}</p>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => setSelectedSubmission(submission)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Grade Submission
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Grade Submission</DialogTitle>
                          <DialogDescription>
                            Provide a score and feedback for {submission.studentName}'s work
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-800">{submission.content}</p>
                          </div>
                          <div>
                            <Label htmlFor="score">Score (0-100)</Label>
                            <Input
                              id="score"
                              type="number"
                              min="0"
                              max="100"
                              value={gradeScore}
                              onChange={(e) => setGradeScore(e.target.value)}
                              placeholder="Enter score"
                            />
                          </div>
                          <div>
                            <Label htmlFor="feedback">Feedback</Label>
                            <Textarea
                              id="feedback"
                              value={gradeFeedback}
                              onChange={(e) => setGradeFeedback(e.target.value)}
                              placeholder="Provide constructive feedback"
                              rows={4}
                            />
                          </div>
                          <Button 
                            onClick={gradeSubmission} 
                            className="w-full"
                            disabled={!gradeScore || !gradeFeedback}
                          >
                            Submit Grade
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button size="sm" variant="outline">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Message Parent
                    </Button>
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