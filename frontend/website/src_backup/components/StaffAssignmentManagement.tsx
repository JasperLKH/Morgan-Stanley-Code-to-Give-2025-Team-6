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
import { Checkbox } from '../ui/checkbox';
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
  MessageCircle,
  Brain,
  Repeat,
  Target,
  PlusCircle
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

interface WordAssignment {
  id: string;
  word: string;
  studentId: string;
  studentName: string;
  initialDate: string;
  reviewDates: string[];
  completedReviews: number;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'active' | 'completed' | 'overdue';
  nextReviewDate: string;
}

interface StaffAssignmentManagementProps {
  user: User;
  onCreateAssignment?: () => void;
}

export function StaffAssignmentManagement({ user, onCreateAssignment }: StaffAssignmentManagementProps) {
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
  
  // Word assignment states
  const [wordAssignmentForm, setWordAssignmentForm] = useState({
    word: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    selectedStudents: [] as string[]
  });
  
  // Available students for word assignments
  const students = [
    { id: '1', name: 'Emma Chen' },
    { id: '2', name: 'Alex Wong' },
    { id: '3', name: 'Sophie Lee' },
    { id: '4', name: 'Marcus Johnson' },
    { id: '5', name: 'Lily Zhang' }
  ];

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

  // Mock word assignments data
  const wordAssignments: WordAssignment[] = [
    {
      id: '1',
      word: 'butterfly',
      studentId: '1',
      studentName: 'Emma Chen',
      initialDate: '2024-12-20',
      reviewDates: ['2024-12-21', '2024-12-23', '2024-12-27', '2025-01-03'],
      completedReviews: 2,
      difficulty: 'medium',
      status: 'active',
      nextReviewDate: '2024-12-27'
    },
    {
      id: '2',
      word: 'wonderful',
      studentId: '2',
      studentName: 'Alex Wong',
      initialDate: '2024-12-19',
      reviewDates: ['2024-12-20', '2024-12-22', '2024-12-26', '2025-01-02'],
      completedReviews: 3,
      difficulty: 'hard',
      status: 'active',
      nextReviewDate: '2025-01-02'
    },
    {
      id: '3',
      word: 'sunshine',
      studentId: '3',
      studentName: 'Sophie Lee',
      initialDate: '2024-12-18',
      reviewDates: ['2024-12-19', '2024-12-21', '2024-12-25'],
      completedReviews: 3,
      difficulty: 'easy',
      status: 'completed',
      nextReviewDate: '2024-12-25'
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

  // Calculate forgetting curve intervals (in days)
  const getForgettingCurveIntervals = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return [1, 3, 7]; // 3 reviews total
      case 'medium':
        return [1, 2, 5, 10]; // 4 reviews total
      case 'hard':
        return [1, 2, 4, 8, 15]; // 5 reviews total
      default:
        return [1, 2, 5, 10];
    }
  };

  const createWordAssignment = () => {
    if (!wordAssignmentForm.word || wordAssignmentForm.selectedStudents.length === 0) return;
    
    const intervals = getForgettingCurveIntervals(wordAssignmentForm.difficulty);
    const today = new Date();
    
    wordAssignmentForm.selectedStudents.forEach(studentId => {
      const student = students.find(s => s.id === studentId);
      if (student) {
        const reviewDates = intervals.map(interval => {
          const reviewDate = new Date(today);
          reviewDate.setDate(today.getDate() + interval);
          return reviewDate.toISOString().split('T')[0];
        });
        
        console.log('Creating word assignment:', {
          word: wordAssignmentForm.word,
          studentId,
          studentName: student.name,
          difficulty: wordAssignmentForm.difficulty,
          reviewDates,
          nextReviewDate: reviewDates[0]
        });
      }
    });
    
    // Reset form
    setWordAssignmentForm({
      word: '',
      difficulty: 'medium',
      selectedStudents: []
    });
  };

  const toggleStudentSelection = (studentId: string) => {
    setWordAssignmentForm(prev => ({
      ...prev,
      selectedStudents: prev.selectedStudents.includes(studentId)
        ? prev.selectedStudents.filter(id => id !== studentId)
        : [...prev.selectedStudents, studentId]
    }));
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
        <Button 
          className="flex items-center space-x-2"
          onClick={() => {
            if (onCreateAssignment) {
              onCreateAssignment();
            } else {
              alert('Create Assignment feature not available');
            }
          }}
        >
          <Plus className="w-4 h-4" />
          <span>Create Assignment</span>
        </Button>
      </div>

      <Tabs defaultValue="assignments" className="w-full">
        <TabsList>
          <TabsTrigger value="assignments">All Assignments</TabsTrigger>
          <TabsTrigger value="words">Word Practice</TabsTrigger>
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

        {/* Word Practice Tab */}
        <TabsContent value="words" className="space-y-6 mt-6">
          {/* Create Word Assignment */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <span>Assign Words (Spaced Repetition)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="word">Word to Practice</Label>
                  <Input
                    id="word"
                    value={wordAssignmentForm.word}
                    onChange={(e) => setWordAssignmentForm({...wordAssignmentForm, word: e.target.value})}
                    placeholder="Enter word (e.g., butterfly)"
                  />
                </div>
                <div>
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select
                    value={wordAssignmentForm.difficulty}
                    onValueChange={(value: 'easy' | 'medium' | 'hard') => 
                      setWordAssignmentForm({...wordAssignmentForm, difficulty: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy (3 reviews)</SelectItem>
                      <SelectItem value="medium">Medium (4 reviews)</SelectItem>
                      <SelectItem value="hard">Hard (5 reviews)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label>Select Students</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={student.id}
                        checked={wordAssignmentForm.selectedStudents.includes(student.id)}
                        onCheckedChange={() => toggleStudentSelection(student.id)}
                      />
                      <Label htmlFor={student.id} className="text-sm">{student.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              {wordAssignmentForm.difficulty && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm text-blue-800 mb-2">Review Schedule:</p>
                  <div className="flex items-center space-x-2 text-xs text-blue-700">
                    <Repeat className="w-3 h-3" />
                    <span>
                      Days: {getForgettingCurveIntervals(wordAssignmentForm.difficulty).join(' → ')}
                      {' '}(total {getForgettingCurveIntervals(wordAssignmentForm.difficulty).length} reviews)
                    </span>
                  </div>
                </div>
              )}
              
              <Button 
                onClick={createWordAssignment}
                disabled={!wordAssignmentForm.word || wordAssignmentForm.selectedStudents.length === 0}
                className="w-full"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Assign Word with Spaced Repetition
              </Button>
            </CardContent>
          </Card>

          {/* Current Word Assignments */}
          <div className="space-y-4">
            <h3 className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-emerald-600" />
              <span>Active Word Assignments</span>
            </h3>
            
            {wordAssignments.map((wordAssignment) => (
              <Card key={wordAssignment.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="text-lg text-gray-900 capitalize">{wordAssignment.word}</h4>
                        <p className="text-sm text-gray-600">{wordAssignment.studentName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={
                        wordAssignment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        wordAssignment.status === 'overdue' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }>
                        {wordAssignment.status}
                      </Badge>
                      <Badge className="ml-2 bg-gray-100 text-gray-800">
                        {wordAssignment.difficulty}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-600">Progress</p>
                      <p className="text-sm">{wordAssignment.completedReviews}/{wordAssignment.reviewDates.length} reviews</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Next Review</p>
                      <p className="text-sm">{wordAssignment.nextReviewDate}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-xs text-gray-600">Review Schedule:</span>
                    <div className="flex space-x-1">
                      {wordAssignment.reviewDates.map((date, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className={`text-xs ${
                            index < wordAssignment.completedReviews 
                              ? 'bg-green-100 text-green-800 border-green-200' 
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {date}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      View Progress
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      Adjust Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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