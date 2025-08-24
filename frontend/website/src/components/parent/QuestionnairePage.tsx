import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { 
  ClipboardList, 
  Plus, 
  Send, 
  CheckCircle, 
  Clock, 
  MessageSquare,
  Loader2,
  Eye,
  Edit
} from 'lucide-react';
import { apiService } from '../../services/api';
import { useParentContext } from '../contexts/ParentContext';

interface Questionnaire {
  id: number;
  title: string;
  questions: string[];
  is_active: boolean;
  created_by: number;
  created_at: string;
  responses_count?: number;
}

interface QuestionnaireResponse {
  id: number;
  questionnaire: number;
  answers: Record<string, string>;
  submitted_at: string;
}

export function QuestionnairePage() {
  const { state } = useParentContext();
  const currentUser = state.user;
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<number | null>(null);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<Questionnaire | null>(null);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newQuestions, setNewQuestions] = useState(['']);

  useEffect(() => {
    fetchQuestionnaires();
  }, []);

  const fetchQuestionnaires = async () => {
    setLoading(true);
    try {
      const response = await apiService.getQuestionnaires();
      if (response.success && response.data) {
        setQuestionnaires(response.data as Questionnaire[]);
      }
    } catch (error) {
      console.error('Error fetching questionnaires:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestionnaire = async () => {
    if (!newTitle.trim() || newQuestions.some(q => !q.trim())) return;
    
    try {
      const validQuestions = newQuestions.filter(q => q.trim());
      const response = await apiService.createQuestionnaire(newTitle, validQuestions);
      if (response.success) {
        setNewTitle('');
        setNewQuestions(['']);
        setShowCreateForm(false);
        fetchQuestionnaires();
      }
    } catch (error) {
      console.error('Error creating questionnaire:', error);
    }
  };

  const handleSubmitResponse = async () => {
    if (!selectedQuestionnaire || submitting) return;
    
    setSubmitting(selectedQuestionnaire.id);
    try {
      // Mock submission - in a real app this would be a separate API endpoint
      console.log('Submitting questionnaire response:', {
        questionnaire_id: selectedQuestionnaire.id,
        answers: responses
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSelectedQuestionnaire(null);
      setResponses({});
      alert('Questionnaire submitted successfully!');
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
    } finally {
      setSubmitting(null);
    }
  };

  const addQuestion = () => {
    setNewQuestions([...newQuestions, '']);
  };

  const updateQuestion = (index: number, value: string) => {
    const updated = [...newQuestions];
    updated[index] = value;
    setNewQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    if (newQuestions.length > 1) {
      setNewQuestions(newQuestions.filter((_, i) => i !== index));
    }
  };

  const updateResponse = (questionIndex: number, answer: string) => {
    setResponses(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2">Loading questionnaires...</span>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl text-gray-900">Questionnaires</h2>
          <p className="text-sm text-gray-600">
            Participate in surveys and provide feedback to REACH
          </p>
        </div>
        {false && (
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-1" />
            Create Survey
          </Button>
        )}
      </div>

      {/* Create Questionnaire Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Questionnaire</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter questionnaire title..."
              />
            </div>
            
            <div>
              <Label>Questions</Label>
              <div className="space-y-2">
                {newQuestions.map((question, index) => (
                  <div key={index} className="flex space-x-2">
                    <Input
                      value={question}
                      onChange={(e) => updateQuestion(index, e.target.value)}
                      placeholder={`Question ${index + 1}...`}
                      className="flex-1"
                    />
                    {newQuestions.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeQuestion(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addQuestion}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Question
                </Button>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateQuestionnaire}
                disabled={!newTitle.trim() || newQuestions.some(q => !q.trim())}
              >
                Create Questionnaire
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Questionnaire Response Form */}
      {selectedQuestionnaire && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{selectedQuestionnaire.title}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedQuestionnaire(null)}
              >
                Back to List
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedQuestionnaire.questions.map((question, index) => (
              <div key={index} className="space-y-2">
                <Label htmlFor={`question-${index}`}>
                  {index + 1}. {question}
                </Label>
                <Textarea
                  id={`question-${index}`}
                  value={responses[index] || ''}
                  onChange={(e) => updateResponse(index, e.target.value)}
                  placeholder="Your answer..."
                  className="min-h-[80px]"
                />
              </div>
            ))}
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setSelectedQuestionnaire(null)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitResponse}
                disabled={submitting === selectedQuestionnaire.id || 
                         selectedQuestionnaire.questions.some((_, i) => !responses[i]?.trim())}
              >
                {submitting === selectedQuestionnaire.id ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Response
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Questionnaires List */}
      {!selectedQuestionnaire && !showCreateForm && (
        <div className="space-y-4">
          {questionnaires.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No questionnaires available</p>
                <p className="text-sm text-gray-400">Check back later for new surveys</p>
              </CardContent>
            </Card>
          ) : (
            questionnaires
              .filter(q => q.is_active)
              .map((questionnaire) => (
                <Card key={questionnaire.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {questionnaire.title}
                          </h3>
                          <Badge 
                            variant="secondary"
                            className={questionnaire.is_active 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-700'
                            }
                          >
                            {questionnaire.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 mb-3">
                          <p className="text-sm text-gray-600">
                            {questionnaire.questions.length} questions
                          </p>
                          <p className="text-xs text-gray-500">
                            Created on {formatDate(questionnaire.created_at)}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <ClipboardList className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Help us improve REACH by sharing your feedback
                          </span>
                        </div>
                      </div>
                      
                      <div className="ml-4 flex flex-col space-y-2">
                        <Button
                          size="sm"
                          onClick={() => setSelectedQuestionnaire(questionnaire)}
                          disabled={!questionnaire.is_active}
                        >
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Respond
                        </Button>
                        
                        {false && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // View responses functionality
                              console.log('View responses for questionnaire:', questionnaire.id);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Results
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </div>
      )}

      {/* Quick Stats */}
      {false && !selectedQuestionnaire && !showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Survey Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {questionnaires.filter(q => q.is_active).length}
                </p>
                <p className="text-sm text-blue-800">Active Surveys</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {questionnaires.reduce((sum, q) => sum + (q.responses_count || 0), 0)}
                </p>
                <p className="text-sm text-green-800">Total Responses</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {questionnaires.length}
                </p>
                <p className="text-sm text-purple-800">Total Surveys</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
