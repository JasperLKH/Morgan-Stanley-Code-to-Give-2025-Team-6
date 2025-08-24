import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Calendar, Upload, Star, Clock, CheckCircle, AlertCircle, Camera, Loader2 } from 'lucide-react';
import { apiService } from '../../services/api';
import { useUser } from '../../contexts/UserContext';

interface Assignment {
  id: number;
  title: string;
  subject: string;
  due_date: string;
  status?: 'pending' | 'submitted' | 'graded';
  points: number;
  description?: string;
  feedback?: string;
  grade?: string;
  submitted_at?: string;
  assigned_to?: number[];
}

export function AssignmentsPage() {
  const { user: currentUser } = useUser();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<number | null>(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!currentUser?.id) return;
      
      setLoading(true);
      try {
        const response = await apiService.getUserAssignments(parseInt(currentUser.id));
        if (response.success && response.data) {
          setAssignments(response.data as Assignment[]);
        }
      } catch (error) {
        console.error('Error fetching assignments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [currentUser?.id]);

  const pendingAssignments = assignments.filter(a => a.status === 'pending' || !a.status);
  const submittedAssignments = assignments.filter(a => a.status === 'submitted');
  const gradedAssignments = assignments.filter(a => a.status === 'graded');

  const handleFileUpload = async (assignmentId: number, file?: File) => {
    setSubmitting(assignmentId);
    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      }
      
      const response = await apiService.submitAssignment(assignmentId, formData);
      if (response.success) {
        // Refresh assignments after submission
        if (currentUser?.id) {
          const updatedResponse = await apiService.getUserAssignments(parseInt(currentUser.id));
          if (updatedResponse.success && updatedResponse.data) {
            setAssignments(updatedResponse.data as Assignment[]);
          }
        }
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setSubmitting(null);
    }
  };

  const handleTakePhoto = (assignmentId: number) => {
    // In a real app, this would open camera or photo picker
    console.log('Taking photo for assignment:', assignmentId);
    // For now, just simulate submission
    handleFileUpload(assignmentId);
  };

  const getStatusIcon = (status?: string) => {
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

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-700">Pending</Badge>;
      case 'submitted':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Submitted</Badge>;
      case 'graded':
        return <Badge variant="secondary" className="bg-green-100 text-green-700">Graded</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2">Loading assignments...</span>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-xl text-gray-900">Assignments</h2>
        <p className="text-sm text-gray-600">
          {currentUser?.children_name || 'Your child'}'s learning tasks
        </p>
      </div>

      {/* Weekly Progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>This Week's Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Completed Tasks</span>
              <span className="text-sm text-gray-900">
                {gradedAssignments.length} of {assignments.length}
              </span>
            </div>
            <Progress 
              value={assignments.length > 0 ? (gradedAssignments.length / assignments.length) * 100 : 0} 
              className="h-3" 
            />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{pendingAssignments.length} tasks remaining</span>
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-500" />
                <span>
                  +{gradedAssignments.reduce((sum, a) => sum + a.points, 0)} points earned
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignments Tabs */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pending ({pendingAssignments.length})
          </TabsTrigger>
          <TabsTrigger value="submitted">
            Submitted ({submittedAssignments.length})
          </TabsTrigger>
          <TabsTrigger value="graded">
            Graded ({gradedAssignments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingAssignments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-500">No pending assignments</p>
                <p className="text-sm text-gray-400">All caught up!</p>
              </CardContent>
            </Card>
          ) : (
            pendingAssignments.map((assignment) => (
              <Card key={assignment.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      {getStatusIcon(assignment.status)}
                      <div>
                        <h3 className="text-sm text-gray-900">{assignment.title}</h3>
                        <p className="text-xs text-gray-600">{assignment.subject}</p>
                        {assignment.description && (
                          <p className="text-xs text-gray-500 mt-1">{assignment.description}</p>
                        )}
                      </div>
                    </div>
                    {getStatusBadge(assignment.status)}
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span>+{assignment.points} points</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-primary hover:bg-primary/90"
                      onClick={() => handleTakePhoto(assignment.id)}
                      disabled={submitting === assignment.id}
                    >
                      {submitting === assignment.id ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <Camera className="w-4 h-4 mr-1" />
                      )}
                      Take Photo
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*,application/pdf';
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            handleFileUpload(assignment.id, file);
                          }
                        };
                        input.click();
                      }}
                      disabled={submitting === assignment.id}
                    >
                      {submitting === assignment.id ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4 mr-1" />
                      )}
                      Upload File
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="submitted" className="space-y-4">
          {submittedAssignments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="w-12 h-12 text-orange-500 mx-auto mb-3" />
                <p className="text-gray-500">No submitted assignments</p>
                <p className="text-sm text-gray-400">Complete pending tasks to see them here</p>
              </CardContent>
            </Card>
          ) : (
            submittedAssignments.map((assignment) => (
              <Card key={assignment.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      {getStatusIcon(assignment.status)}
                      <div>
                        <h3 className="text-sm text-gray-900">{assignment.title}</h3>
                        <p className="text-xs text-gray-600">{assignment.subject}</p>
                      </div>
                    </div>
                    {getStatusBadge(assignment.status)}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>
                      Submitted: {assignment.submitted_at ? new Date(assignment.submitted_at).toLocaleDateString() : 'N/A'}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span>+{assignment.points} points</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <p className="text-sm text-blue-800">
                      Waiting for REACH teacher feedback
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="graded" className="space-y-4">
          {gradedAssignments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Star className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                <p className="text-gray-500">No graded assignments yet</p>
                <p className="text-sm text-gray-400">Complete and submit assignments to see grades</p>
              </CardContent>
            </Card>
          ) : (
            gradedAssignments.map((assignment) => (
              <Card key={assignment.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      {getStatusIcon(assignment.status)}
                      <div>
                        <h3 className="text-sm text-gray-900">{assignment.title}</h3>
                        <p className="text-xs text-gray-600">{assignment.subject}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(assignment.status)}
                      {assignment.grade && (
                        <Badge className="bg-green-500 text-white">{assignment.grade}</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>
                      Submitted: {assignment.submitted_at ? new Date(assignment.submitted_at).toLocaleDateString() : 'N/A'}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span>+{assignment.points} points earned</span>
                    </div>
                  </div>

                  {assignment.feedback && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-800">{assignment.feedback}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
