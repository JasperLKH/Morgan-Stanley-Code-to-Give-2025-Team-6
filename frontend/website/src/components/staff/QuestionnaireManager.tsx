import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { 
  FileQuestion, 
  Plus, 
  Edit3, 
  Trash2, 
  Send, 
  Eye, 
  Users, 
  Calendar,
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  Download
} from 'lucide-react';

export type QuestionType = 'text' | 'multiple_choice' | 'rating' | 'yes_no' | 'checkbox';

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: QuestionOption[];
  required: boolean;
  ratingScale?: number;
}

export interface Questionnaire {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  status: 'draft' | 'active' | 'closed';
  createdAt: string;
  updatedAt: string;
  targetParents: string[];
  responses: number;
  totalSent: number;
}

export interface QuestionnaireResponse {
  id: string;
  questionnaireId: string;
  parentId: string;
  parentName: string;
  childName: string;
  submittedAt: string;
  answers: { [questionId: string]: any };
}

interface User {
  id: string;
  name: string;
  role: string;
}

interface QuestionnaireManagerProps {
  user: User;
}

export function QuestionnaireManager({ user }: QuestionnaireManagerProps) {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([
    {
      id: '1',
      title: 'Monthly Child Progress Survey',
      description: 'Help us understand how your child is progressing at home',
      questions: [
        {
          id: 'q1',
          type: 'multiple_choice',
          question: 'How would you rate your child\'s reading progress this month?',
          options: [
            { id: 'opt1', text: 'Excellent progress' },
            { id: 'opt2', text: 'Good progress' },
            { id: 'opt3', text: 'Some progress' },
            { id: 'opt4', text: 'Little progress' }
          ],
          required: true
        },
        {
          id: 'q2',
          type: 'rating',
          question: 'How engaged is your child with homework activities?',
          ratingScale: 5,
          required: true
        },
        {
          id: 'q3',
          type: 'text',
          question: 'What challenges has your child faced this month?',
          required: false
        }
      ],
      status: 'active',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
      targetParents: ['1', '2', '4'],
      responses: 2,
      totalSent: 3
    },
    {
      id: '2',
      title: 'Parent Satisfaction Survey',
      description: 'We value your feedback on our teaching methods',
      questions: [
        {
          id: 'q1',
          type: 'rating',
          question: 'How satisfied are you with our communication?',
          ratingScale: 5,
          required: true
        },
        {
          id: 'q2',
          type: 'yes_no',
          question: 'Would you recommend REACH to other parents?',
          required: true
        }
      ],
      status: 'draft',
      createdAt: '2024-01-20',
      updatedAt: '2024-01-20',
      targetParents: [],
      responses: 0,
      totalSent: 0
    }
  ]);

  const [responses] = useState<QuestionnaireResponse[]>([
    {
      id: '1',
      questionnaireId: '1',
      parentId: '1',
      parentName: 'Sarah Chen',
      childName: 'Emma Chen',
      submittedAt: '2024-01-16 10:30 AM',
      answers: {
        'q1': 'opt2',
        'q2': 4,
        'q3': 'Emma sometimes struggles with concentration during homework time.'
      }
    },
    {
      id: '2',
      questionnaireId: '1',
      parentId: '2',
      parentName: 'Lisa Wong',
      childName: 'Alex Wong',
      submittedAt: '2024-01-17 2:15 PM',
      answers: {
        'q1': 'opt3',
        'q2': 3,
        'q3': 'Math concepts are challenging for Alex.'
      }
    }
  ]);

  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<Questionnaire | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentQuestionnaire, setCurrentQuestionnaire] = useState<Partial<Questionnaire>>({
    title: '',
    description: '',
    questions: [],
    status: 'draft',
    targetParents: []
  });

  const handleCreateNew = () => {
    setCurrentQuestionnaire({
      title: '',
      description: '',
      questions: [],
      status: 'draft',
      targetParents: []
    });
    setIsCreating(true);
    setIsEditing(false);
  };

  const handleEdit = (questionnaire: Questionnaire) => {
    setCurrentQuestionnaire(questionnaire);
    setIsCreating(true);
    setIsEditing(true);
  };

  const handleSave = () => {
    const now = new Date().toISOString().split('T')[0];
    
    if (isEditing && currentQuestionnaire.id) {
      setQuestionnaires(prev => prev.map(q => 
        q.id === currentQuestionnaire.id 
          ? { ...currentQuestionnaire, updatedAt: now } as Questionnaire
          : q
      ));
    } else {
      const newQuestionnaire: Questionnaire = {
        ...currentQuestionnaire,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now,
        responses: 0,
        totalSent: 0
      } as Questionnaire;
      
      setQuestionnaires(prev => [...prev, newQuestionnaire]);
    }
    
    setIsCreating(false);
    setIsEditing(false);
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q${Date.now()}`,
      type: 'text',
      question: '',
      required: false
    };
    
    setCurrentQuestionnaire(prev => ({
      ...prev,
      questions: [...(prev.questions || []), newQuestion]
    }));
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setCurrentQuestionnaire(prev => ({
      ...prev,
      questions: prev.questions?.map(q => 
        q.id === questionId ? { ...q, ...updates } : q
      ) || []
    }));
  };

  const removeQuestion = (questionId: string) => {
    setCurrentQuestionnaire(prev => ({
      ...prev,
      questions: prev.questions?.filter(q => q.id !== questionId) || []
    }));
  };

  const addOption = (questionId: string) => {
    const newOption: QuestionOption = {
      id: `opt${Date.now()}`,
      text: ''
    };
    
    updateQuestion(questionId, {
      options: [
        ...((currentQuestionnaire.questions?.find(q => q.id === questionId)?.options || [])),
        newOption
      ]
    });
  };

  const updateOption = (questionId: string, optionId: string, text: string) => {
    const question = currentQuestionnaire.questions?.find(q => q.id === questionId);
    if (question && question.options) {
      const updatedOptions = question.options.map(opt => 
        opt.id === optionId ? { ...opt, text } : opt
      );
      updateQuestion(questionId, { options: updatedOptions });
    }
  };

  const removeOption = (questionId: string, optionId: string) => {
    const question = currentQuestionnaire.questions?.find(q => q.id === questionId);
    if (question && question.options) {
      const updatedOptions = question.options.filter(opt => opt.id !== optionId);
      updateQuestion(questionId, { options: updatedOptions });
    }
  };

  const getQuestionTypeLabel = (type: QuestionType) => {
    const labels = {
      text: 'Text Response',
      multiple_choice: 'Multiple Choice',
      rating: 'Rating Scale',
      yes_no: 'Yes/No',
      checkbox: 'Checkboxes'
    };
    return labels[type];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'draft': return 'bg-yellow-500';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getResponsesForQuestionnaire = (questionnaireId: string) => {
    return responses.filter(r => r.questionnaireId === questionnaireId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <FileQuestion className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl text-gray-900">Questionnaire Manager</h2>
        </div>
        <Button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create New
        </Button>
      </div>

      <Tabs defaultValue="questionnaires" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="questionnaires">My Questionnaires</TabsTrigger>
          <TabsTrigger value="responses">View Responses</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Questionnaires Tab */}
        <TabsContent value="questionnaires" className="space-y-4">
          <div className="grid gap-4">
            {questionnaires.map((questionnaire) => (
              <Card key={questionnaire.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900">{questionnaire.title}</h3>
                        <Badge className={`${getStatusColor(questionnaire.status)} text-white`}>
                          {questionnaire.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600">{questionnaire.description}</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Target className="w-4 h-4" />
                          <span>{questionnaire.questions.length} questions</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{questionnaire.responses}/{questionnaire.totalSent} responses</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Updated {questionnaire.updatedAt}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedQuestionnaire(questionnaire)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(questionnaire)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-green-600">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Responses Tab */}
        <TabsContent value="responses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Parent Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {responses.map((response) => {
                    const questionnaire = questionnaires.find(q => q.id === response.questionnaireId);
                    return (
                      <Card key={response.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900">{questionnaire?.title}</h4>
                              <p className="text-sm text-gray-600">
                                {response.parentName} (Child: {response.childName})
                              </p>
                              <p className="text-xs text-gray-500">Submitted: {response.submittedAt}</p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                          <Separator className="my-3" />
                          <div className="space-y-3">
                            {questionnaire?.questions.map((question) => (
                              <div key={question.id} className="space-y-1">
                                <p className="text-sm font-medium text-gray-700">{question.question}</p>
                                <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                  {question.type === 'multiple_choice' ? (
                                    question.options?.find(opt => opt.id === response.answers[question.id])?.text
                                  ) : question.type === 'rating' ? (
                                    `${response.answers[question.id]}/5 stars`
                                  ) : question.type === 'yes_no' ? (
                                    response.answers[question.id] ? 'Yes' : 'No'
                                  ) : (
                                    response.answers[question.id] || 'No response'
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <FileQuestion className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{questionnaires.length}</p>
                    <p className="text-sm text-gray-600">Total Questionnaires</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{responses.length}</p>
                    <p className="text-sm text-gray-600">Total Responses</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {questionnaires.filter(q => q.status === 'active').length}
                    </p>
                    <p className="text-sm text-gray-600">Active Surveys</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Questionnaire Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Questionnaire' : 'Create New Questionnaire'}
            </DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Make changes to your questionnaire. You can modify questions, options, and settings.' 
                : 'Create a new questionnaire to collect feedback from parents. Add questions and configure settings.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Questionnaire Title</Label>
                <Input
                  id="title"
                  placeholder="Enter questionnaire title"
                  value={currentQuestionnaire.title}
                  onChange={(e) => setCurrentQuestionnaire(prev => ({ 
                    ...prev, 
                    title: e.target.value 
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={currentQuestionnaire.status}
                  onValueChange={(value) => setCurrentQuestionnaire(prev => ({ 
                    ...prev, 
                    status: value as 'draft' | 'active' | 'closed'
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter questionnaire description"
                value={currentQuestionnaire.description}
                onChange={(e) => setCurrentQuestionnaire(prev => ({ 
                  ...prev, 
                  description: e.target.value 
                }))}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium">Questions</h4>
                <Button onClick={addQuestion} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
              </div>

              {currentQuestionnaire.questions?.map((question, index) => (
                <Card key={question.id} className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium">Question {index + 1}</h5>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={question.required}
                            onCheckedChange={(checked) => 
                              updateQuestion(question.id, { required: checked })
                            }
                          />
                          <Label>Required</Label>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQuestion(question.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Question Text</Label>
                        <Input
                          placeholder="Enter your question"
                          value={question.question}
                          onChange={(e) => 
                            updateQuestion(question.id, { question: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Question Type</Label>
                        <Select
                          value={question.type}
                          onValueChange={(value) => 
                            updateQuestion(question.id, { type: value as QuestionType })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text Response</SelectItem>
                            <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                            <SelectItem value="rating">Rating Scale</SelectItem>
                            <SelectItem value="yes_no">Yes/No</SelectItem>
                            <SelectItem value="checkbox">Checkboxes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {question.type === 'multiple_choice' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Answer Options</Label>
                          <Button
                            onClick={() => addOption(question.id)}
                            variant="outline"
                            size="sm"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Option
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {question.options?.map((option) => (
                            <div key={option.id} className="flex items-center space-x-2">
                              <Input
                                placeholder="Enter option text"
                                value={option.text}
                                onChange={(e) => 
                                  updateOption(question.id, option.id, e.target.value)
                                }
                                className="flex-1"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeOption(question.id, option.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {question.type === 'rating' && (
                      <div className="space-y-2">
                        <Label>Rating Scale (1 to X)</Label>
                        <Select
                          value={question.ratingScale?.toString()}
                          onValueChange={(value) => 
                            updateQuestion(question.id, { ratingScale: parseInt(value) })
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Select scale" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3">1 to 3</SelectItem>
                            <SelectItem value="5">1 to 5</SelectItem>
                            <SelectItem value="7">1 to 7</SelectItem>
                            <SelectItem value="10">1 to 10</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                {isEditing ? 'Update' : 'Create'} Questionnaire
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Questionnaire Dialog */}
      <Dialog open={!!selectedQuestionnaire} onOpenChange={() => setSelectedQuestionnaire(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Preview: {selectedQuestionnaire?.title}</DialogTitle>
            <DialogDescription>
              Review the questionnaire structure and content before sending to parents.
            </DialogDescription>
          </DialogHeader>
          {selectedQuestionnaire && (
            <div className="space-y-4">
              <p className="text-gray-600">{selectedQuestionnaire.description}</p>
              <Separator />
              <div className="space-y-4">
                {selectedQuestionnaire.questions.map((question, index) => (
                  <div key={question.id} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">
                        {index + 1}. {question.question}
                      </span>
                      {question.required && (
                        <Badge variant="destructive" className="text-xs">Required</Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Type: {getQuestionTypeLabel(question.type)}
                      {question.type === 'rating' && ` (1-${question.ratingScale})`}
                    </p>
                    {question.options && (
                      <div className="ml-4 space-y-1">
                        {question.options.map((option) => (
                          <p key={option.id} className="text-sm text-gray-600">• {option.text}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}