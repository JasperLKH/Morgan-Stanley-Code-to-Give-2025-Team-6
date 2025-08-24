// TeacherAssignments.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Input } from '../ui/input';
import {
  Calendar, Clock, ArrowLeft, FileText, FileCheck2, Users, Star, MessageCircle,
} from 'lucide-react';

/* ---- Types copied from Staff so shape & labels are identical ---- */
type AssignmentType = 'reading' | 'math' | 'writing' | 'art';
type AssignmentStatus = 'draft' | 'active' | 'completed';

interface Assignment {
  id: number;
  name: string;
  release_date: string;
  due_date: string;
  questions?: string | null;
  answers?: string | null;
  created_by?: { id: number; username: string; role: string };
  hidden?: boolean;

  title?: string;
  type?: AssignmentType;
  description?: string;
  points?: number;
  status?: AssignmentStatus;

  totalSubmissions?: number;
  pendingReview?: number;
  completedReviews?: number;
  averageScore?: number;
}

interface SubmissionAttachment {
  id: number;
  submission: number;
  kind: string;
  blob: string;
}

interface Submission {
  id: number;
  user: { id: number; username: string; role: string };
  user_name: string;
  assignment: number;
  assignment_name: string;
  status: number;
  status_display: string;
  score: number | null;
  feedback: string;
  graded_at: string | null;
  created_at: string;
  updated_at: string;
  attachments?: SubmissionAttachment[];

  file_url?: string | null;
  submittedDate?: string;
  assignmentTitle?: string;
}

const API_BASE = 'http://localhost:8000';
const fileUrl = (rel?: string | null) => (rel ? `${API_BASE}${rel}` : '');

const getTypeColor = (type?: string) => {
  switch (type) {
    case 'reading': return 'bg-blue-100 text-blue-800';
    case 'math': return 'bg-green-100 text-green-800';
    case 'writing': return 'bg-purple-100 text-purple-800';
    case 'art': return 'bg-pink-100 text-pink-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'draft': return 'bg-gray-100 text-gray-800';
    case 'completed': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export function TeacherAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissionsByAssignment, setSubmissionsByAssignment] = useState<Record<number, Submission[]>>({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);
  const selectedAssignment = assignments.find(a => a.id === selectedAssignmentId) || null;

  const refreshAssignments = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`${API_BASE}/assignments/`, { headers: { 'Content-Type': 'application/json' }, credentials: 'include' });
      if (!res.ok) throw new Error(`Failed to load assignments (${res.status})`);
      const data: any[] = await res.json();

      const normalized: Assignment[] = data.map((a) => ({
        id: a.id,
        name: a.name,
        release_date: a.release_date,
        due_date: a.due_date,
        questions: a.questions ?? null,
        answers: a.answers ?? null,
        created_by: a.created_by,
        hidden: a.hidden,
        title: a.name,
        description: a.description ?? '',
        type: (a.type as AssignmentType) ?? 'reading',
        points: a.points ?? 10,
        status: (a.status as AssignmentStatus) ?? 'active',
      }));

      setAssignments(normalized);

      // fetch submissions and compute stats
      for (const a of normalized) {
        const subRes = await fetch(`${API_BASE}/assignments/${a.id}/submissions/`, { headers: { 'Content-Type': 'application/json' }, credentials: 'include' });
        if (!subRes.ok) continue;
        const rawSubs: any[] = await subRes.json();
        const subs: Submission[] = rawSubs.map((s) => {
          const file = Array.isArray(s.attachments) && s.attachments.length > 0 ? s.attachments[0].blob : null;
          return {
            id: s.id,
            user: s.user,
            user_name: s.user_name,
            assignment: s.assignment,
            assignment_name: s.assignment_name,
            status: s.status,
            status_display: s.status_display,
            score: s.score,
            feedback: s.feedback,
            graded_at: s.graded_at,
            created_at: s.created_at,
            updated_at: s.updated_at,
            attachments: s.attachments,
            file_url: file ? `${API_BASE}${file}` : null,
            submittedDate: s.created_at,
            assignmentTitle: s.assignment_name,
          };
        });

        setSubmissionsByAssignment((prev) => ({ ...prev, [a.id]: subs }));

        const total = subs.length;
        const graded = subs.filter((s) => (s.status_display || '').toLowerCase() === 'graded' || s.score != null).length;
        const pending = total - graded;
        const avg = graded > 0
          ? Math.round((subs.filter((s) => s.score != null).reduce((acc, s) => acc + (s.score as number), 0) / graded) * 100) / 100
          : 0;

        setAssignments((prev) => prev.map((row) =>
          row.id === a.id ? { ...row, totalSubmissions: total, pendingReview: pending, completedReviews: graded, averageScore: avg } : row
        ));
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refreshAssignments(); }, []);

  const allSubmissions: Submission[] = useMemo(
    () => Object.values(submissionsByAssignment).flat(),
    [submissionsByAssignment]
  );

  if (selectedAssignment) {
    const subs = submissionsByAssignment[selectedAssignment.id] || [];

    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="outline" onClick={() => setSelectedAssignmentId(null)} className="mr-3">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h2 className="text-2xl text-gray-900">Assignment Details</h2>
        </div>

        <Card className="p-10">
          <CardContent className="p-6">
            <div className="flex items-center flex-wrap gap-2 mb-2">
              <Badge className={getTypeColor(selectedAssignment.type)} variant="secondary">
                {selectedAssignment.type ?? 'reading'}
              </Badge>
              <Badge className={getStatusColor(selectedAssignment.status)} variant="secondary">
                {selectedAssignment.status ?? 'active'}
              </Badge>
              <span className="text-sm text-gray-600">+{selectedAssignment.points ?? 10} points</span>
            </div>

            <h3 className="text-xl text-gray-900 mb-1">{selectedAssignment.title ?? selectedAssignment.name}</h3>
            {selectedAssignment.description && <p className="text-sm text-gray-700 mb-3">{selectedAssignment.description}</p>}

            <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> Release: {selectedAssignment.release_date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> Due: {selectedAssignment.due_date}
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="outline" disabled={!selectedAssignment.questions} onClick={() => window.open(fileUrl(selectedAssignment.questions), '_blank')}>
                <FileText className="w-4 h-4 mr-1" /> Question PDF
              </Button>
              <Button variant="outline" disabled={!selectedAssignment.answers} onClick={() => window.open(fileUrl(selectedAssignment.answers), '_blank')}>
                <FileCheck2 className="w-4 h-4 mr-1" /> Marking Scheme
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Submissions (view-only) */}
        <div className="space-y-3">
          <h3 className="text-lg text-gray-900">Submissions ({subs.length})</h3>
          {subs.map((s) => (
            <Card key={s.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gray-200 text-gray-600">
                        {(s.user_name || '').split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-gray-900">{s.user_name}</h4>
                      <p className="text-sm text-gray-500">{new Date(s.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={(s.status_display || '').toLowerCase() === 'graded' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                      {(s.status_display || '').toLowerCase() === 'graded' ? 'graded' : 'pending'}
                    </Badge>
                  </div>
                </div>

                <div className="mt-3">
                  {s.file_url ? (
                    <iframe title={`submission-${s.id}`} src={s.file_url} className="w-full h-[420px] rounded-lg border border-gray-200" />
                  ) : (
                    <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                      No attached file.
                    </div>
                  )}
                </div>

                {(s.status_display || '').toLowerCase() === 'graded' || s.score != null ? (
                  <div className="bg-green-50 rounded-lg p-3 mt-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-900">Score: {s.score}%</span>
                    </div>
                    <p className="text-sm text-gray-700">{s.feedback}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 mt-3">Awaiting grading by staff.</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  /* ---- LIST view (read-only, same layout as staff) ---- */
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-gray-900">Assignments</h2>
        {/* Teachers: no Create button */}
      </div>

      {loading && <p className="text-sm text-gray-500">Loading assignments…</p>}
      {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

      <Tabs defaultValue="assignments" className="w-full">
        <TabsList>
          <TabsTrigger value="assignments">All Assignments</TabsTrigger>
          <TabsTrigger value="grading">All Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="space-y-4 mt-6">
          {assignments.map((assignment) => (
            <Card key={assignment.id} className="cursor-pointer" onClick={() => setSelectedAssignmentId(assignment.id)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getTypeColor(assignment.type)} variant="secondary">
                        {assignment.type ?? 'reading'}
                      </Badge>
                      <Badge className={getStatusColor(assignment.status)} variant="secondary">
                        {assignment.status ?? 'active'}
                      </Badge>
                      <span className="text-sm text-gray-600">+{assignment.points ?? 10} points</span>
                    </div>
                    <h3 className="text-lg text-gray-900 mb-1">{assignment.title ?? assignment.name}</h3>
                    {assignment.description && <p className="text-sm text-gray-600 mb-3">{assignment.description}</p>}
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Release: {assignment.release_date}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>Due: {assignment.due_date}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-lg text-gray-900">{assignment.totalSubmissions ?? 0}</p>
                    <p className="text-xs text-gray-600">Total Submissions</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <p className="text-lg text-gray-900">{assignment.pendingReview ?? 0}</p>
                    <p className="text-xs text-gray-600">Pending Review</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-lg text-gray-900">{assignment.completedReviews ?? 0}</p>
                    <p className="text-xs text-gray-600">Completed</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-lg text-gray-900">{assignment.averageScore ?? 0}%</p>
                    <p className="text-xs text-gray-600">Avg Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Cross-assignment submissions – view-only */}
        <TabsContent value="grading" className="space-y-4 mt-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600">
                {allSubmissions.length} total submissions
              </span>
            </div>
          </div>

          {allSubmissions.map((submission) => (
            <Card key={submission.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gray-200 text-gray-600">
                        {(submission.user_name || '').split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-gray-900">{submission.user_name}</h4>
                      <p className="text-sm text-gray-600">Assignment: {submission.assignmentTitle ?? submission.assignment_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={(submission.status_display || '').toLowerCase() === 'graded'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-orange-100 text-orange-800'}>
                      {(submission.status_display || '').toLowerCase() === 'graded' ? 'graded' : 'pending'}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-1">Submitted: {new Date(submission.created_at).toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-800">Open the assignment to view the submission preview and the given grade.</p>
                </div>

                {(submission.status_display || '').toLowerCase() === 'graded' || submission.score != null ? (
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-900">Score: {submission.score}%</span>
                    </div>
                    <p className="text-sm text-gray-700">{submission.feedback}</p>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    {/* message action is optional; left as a placeholder to mirror staff card */}
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