import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '../ui/card';
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
  MessageCircle,
  ArrowLeft,
  FileText,
  FileCheck2,
  Users,
  Star,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface User {
  id: string | number;
  name?: string;
  role: string;
}

type AssignmentType = 'reading' | 'math' | 'writing' | 'art';
type AssignmentStatus = 'draft' | 'active' | 'completed';

interface Assignment {
  id: number;
  // API fields
  name: string;
  release_date: string; // YYYY-MM-DD
  due_date: string;     // YYYY-MM-DD
  questions?: string | null;
  answers?: string | null;
  created_by?: { id: number; username: string; role: string };
  hidden?: boolean;

  // derived / UI
  title?: string;
  type?: AssignmentType;
  description?: string;
  points?: number;
  status?: AssignmentStatus;

  // computed from submissions
  totalSubmissions?: number;
  pendingReview?: number;
  completedReviews?: number;
  averageScore?: number;
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

  file_url?: string | null;
  thumbnail_url?: string | null;

  submittedDate?: string;
  assignmentTitle?: string;
}

/** Raw user from /account/users/ */
interface AccountUser {
  id: number;
  username: string;
  role: 'parent' | 'staff' | 'teacher' | string;
  parent_name?: string | null;
  children_name?: string | null;
  school?: string | null;
}

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

const API_BASE = 'http://localhost:8000';

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function StaffAssignmentManagement({ user }: { user: User }) {
  /* ----------------------------- Recipient data ----------------------------- */
  const [allAccounts, setAllAccounts] = useState<AccountUser[]>([]);
  const parentAccounts = useMemo(
    () => allAccounts.filter((u) => u.role === 'parent'),
    [allAccounts]
  );
  const schoolNames = useMemo(() => {
    const set = new Set<string>();
    parentAccounts.forEach((p) => {
      if (p.school) set.add(p.school);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [parentAccounts]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/account/users/`, { credentials: 'include' });
        const data = await res.json();
        const users: AccountUser[] = Array.isArray(data?.users) ? data.users : [];
        setAllAccounts(users);
      } catch (e) {
        console.error('Failed to load accounts', e);
        setAllAccounts([]);
      }
    })();
  }, []);

  /* ---------------------------- Create state ---------------------------- */
  const [createOpen, setCreateOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState<{
    title: string;
    type: AssignmentType;
    description: string;
    releaseDate: string;
    dueDate: string;
    points: number;
    questionFile?: File | null;
    answerFile?: File | null;
  }>({
    title: '',
    type: 'reading',
    description: '',
    releaseDate: '',
    dueDate: '',
    points: 10,
    questionFile: null,
    answerFile: null,
  });

  /** Recipient selection */
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [studentSearch, setStudentSearch] = useState('');

  const toggleStudent = (id: number) =>
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const toggleSchool = (name: string) =>
    setSelectedSchools((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]
    );

  /** Resolve final ids from both sources (unique) */
  const resolvedAssignedTo = useMemo(() => {
    const ids = new Set<number>();
    selectedStudentIds.forEach((id) => ids.add(id));
    if (selectedSchools.length) {
      parentAccounts
        .filter((p) => p.school && selectedSchools.includes(p.school))
        .forEach((p) => ids.add(p.id));
    }
    return Array.from(ids);
  }, [selectedStudentIds, selectedSchools, parentAccounts]);

  /* ----------------------------- Data state ----------------------------- */
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissionsByAssignment, setSubmissionsByAssignment] = useState<Record<number, Submission[]>>({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  /* --------------------- Details / inline “page” view -------------------- */
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);
  const selectedAssignment = assignments.find(a => a.id === selectedAssignmentId) || null;

  // inline edit (kept, but you can hide if not needed)
  const [editDetails, setEditDetails] = useState(false);
  const [editForm, setEditForm] = useState<{
    title: string;
    type: AssignmentType;
    description: string;
    releaseDate: string;
    dueDate: string;
    points: number;
    questionFile?: File | null;
    answerFile?: File | null;
  } | null>(null);

  /* ---------------------------- Grading state ---------------------------- */
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<number | null>(null);
  const [gradeScore, setGradeScore] = useState('');
  const [gradeFeedback, setGradeFeedback] = useState('');

  /* ------------------------------------------------------------------ */
  /* Fetch                                                             */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const res = await fetch(`${API_BASE}/assignments/`, {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
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

        if (isMounted) setAssignments(normalized);

        // Fetch submissions for stats
        for (const a of normalized) {
          try {
            const subRes = await fetch(`${API_BASE}/assignments/${a.id}/submissions/`, {
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
            });
            if (!subRes.ok) throw new Error(`Failed to load submissions for assignment ${a.id}`);
            const subs: Submission[] = (await subRes.json()).map((s: any) => ({
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
              file_url: s.file_url ?? null,
              submittedDate: s.created_at,
              assignmentTitle: s.assignment_name,
            }));

            if (!isMounted) return;

            setSubmissionsByAssignment((prev) => ({ ...prev, [a.id]: subs }));

            // compute stats on the assignment row
            setAssignments((prev) =>
              prev.map((row) => {
                if (row.id !== a.id) return row;
                const total = subs.length;
                const graded = subs.filter((s) => (s.status_display || '').toLowerCase() === 'graded' || s.score != null).length;
                const pending = total - graded;
                const avg =
                  graded > 0
                    ? Math.round(
                        (subs.filter((s) => s.score != null).reduce((acc, s) => acc + (s.score as number), 0) / graded) * 100
                      ) / 100
                    : 0;
                return { ...row, totalSubmissions: total, pendingReview: pending, completedReviews: graded, averageScore: avg };
              })
            );
          } catch (e) {
            console.error(e);
          }
        }
      } catch (e: any) {
        console.error(e);
        if (isMounted) setErrorMsg(e.message || 'Failed to load assignments');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  const allSubmissions: Submission[] = useMemo(() => Object.values(submissionsByAssignment).flat(), [submissionsByAssignment]);

  /* ------------------------------------------------------------------ */
  /* Helpers                                                            */
  /* ------------------------------------------------------------------ */

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

  const fileUrl = (rel?: string | null) => (rel ? `${API_BASE}${rel}` : '');

  /* ------------------------------------------------------------------ */
  /* Create + Edit actions                                              */
/* ------------------------------------------------------------------ */

  const resetCreateForm = () => {
    setNewAssignment({
      title: '',
      type: 'reading',
      description: '',
      releaseDate: '',
      dueDate: '',
      points: 10,
      questionFile: null,
      answerFile: null,
    });
    setSelectedStudentIds([]);
    setSelectedSchools([]);
    setStudentSearch('');
  };

  const createAssignment = async () => {
    if (!newAssignment.title || !newAssignment.releaseDate || !newAssignment.dueDate) {
      alert('Please fill required fields.');
      return;
    }
    if (!newAssignment.questionFile) {
      alert('Please attach the Question PDF.');
      return;
    }
    if (resolvedAssignedTo.length === 0) {
      alert('Please choose at least one student or school.');
      return;
    }

    try {
      const form = new FormData();
      form.append('name', newAssignment.title);
      form.append('release_date', newAssignment.releaseDate);
      form.append('due_date', newAssignment.dueDate);
      form.append('type', newAssignment.type);
      form.append('points', String(newAssignment.points));
      form.append('description', newAssignment.description);
      form.append('questions', newAssignment.questionFile);
      if (newAssignment.answerFile) form.append('answers', newAssignment.answerFile);

      // ✅ required: assigned_to (one key per user id)
      resolvedAssignedTo.forEach((id) => form.append('assigned_to', String(id)));

      const res = await fetch(`${API_BASE}/assignments/`, {
        method: 'POST',
        body: form,
        credentials: 'include',
        headers: {
          'User-ID': String(user.id), // your backend uses header auth
        },
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(`Create failed (${res.status}): ${txt || 'Unknown error'}`);
      }

      // naive refresh
      setCreateOpen(false);
      resetCreateForm();
      // reload list
      const list = await fetch(`${API_BASE}/assignments/`, { credentials: 'include' }).then(r => r.json());
      setAssignments(list);
    } catch (e: any) {
      console.error(e);
      alert(e.message || 'Create failed');
    }
  };

  const saveAssignmentEdits = async () => {
    if (!selectedAssignment || !editForm) return;
    try {
      const form = new FormData();
      form.append('name', editForm.title);
      form.append('release_date', editForm.releaseDate);
      form.append('due_date', editForm.dueDate);
      form.append('type', editForm.type);
      form.append('points', String(editForm.points));
      form.append('description', editForm.description);
      if (editForm.questionFile) form.append('questions', editForm.questionFile);
      if (editForm.answerFile) form.append('answers', editForm.answerFile);

      const res = await fetch(`${API_BASE}/assignments/${selectedAssignment.id}/`, {
        method: 'PATCH',
        body: form,
        credentials: 'include',
        headers: { 'User-ID': String(user.id) },
      });
      if (!res.ok) throw new Error(`Failed to update (${res.status})`);

      setEditDetails(false);
      // refresh
      const list = await fetch(`${API_BASE}/assignments/`, { credentials: 'include' }).then(r => r.json());
      setAssignments(list);
    } catch (e: any) {
      console.error(e);
      alert(e.message || 'Update failed');
    }
  };

  /* ------------------------------------------------------------------ */
  /* UI: List view vs Details view                                      */
  /* ------------------------------------------------------------------ */

  if (selectedAssignment) {
    const subs = submissionsByAssignment[selectedAssignment.id] || [];
    const selectedSubmission = subs.find(s => s.id === selectedSubmissionId) || null;

    return (
      <div className="space-y-6">
        {/* Header with Back */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedAssignmentId(null);
                setSelectedSubmissionId(null);
                setEditDetails(false);
              }}
              className="mr-3"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <h2 className="text-2xl text-gray-900">Assignment Details</h2>
          </div>
        </div>

        {/* Details Card */}
        <Card className="p-10">
          <CardContent className="p-6">
            {!editDetails ? (
              <>
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
                {selectedAssignment.description && (
                  <p className="text-sm text-gray-700 mb-3">{selectedAssignment.description}</p>
                )}

                <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Release: {selectedAssignment.release_date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Due: {selectedAssignment.due_date}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3 mb-4">
                  <Button variant="outline" disabled={!selectedAssignment.questions} onClick={() => window.open(fileUrl(selectedAssignment.questions), '_blank')}>
                    <FileText className="w-4 h-4 mr-1" />
                    Question PDF
                  </Button>
                  <Button variant="outline" disabled={!selectedAssignment.answers} onClick={() => window.open(fileUrl(selectedAssignment.answers), '_blank')}>
                    <FileCheck2 className="w-4 h-4 mr-1" />
                    Marking Scheme
                  </Button>
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    setEditDetails(true);
                    setEditForm({
                      title: selectedAssignment.title || selectedAssignment.name,
                      type: selectedAssignment.type || 'reading',
                      description: selectedAssignment.description || '',
                      releaseDate: selectedAssignment.release_date,
                      dueDate: selectedAssignment.due_date,
                      points: selectedAssignment.points || 10,
                      questionFile: null,
                      answerFile: null,
                    });
                  }}
                >
                  Edit
                </Button>
              </>
            ) : (
              /* Edit form */
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={editForm?.title || ''}
                      onChange={(e) => setEditForm(f => ({ ...(f as any), title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Select
                      value={editForm?.type || 'reading'}
                      onValueChange={(v: AssignmentType) => setEditForm(f => ({ ...(f as any), type: v }))}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reading">Reading</SelectItem>
                        <SelectItem value="math">Math</SelectItem>
                        <SelectItem value="writing">Writing</SelectItem>
                        <SelectItem value="art">Art</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    rows={3}
                    value={editForm?.description || ''}
                    onChange={(e) => setEditForm(f => ({ ...(f as any), description: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Release Date</Label>
                    <Input
                      type="date"
                      value={editForm?.releaseDate || ''}
                      onChange={(e) => setEditForm(f => ({ ...(f as any), releaseDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Due Date</Label>
                    <Input
                      type="date"
                      value={editForm?.dueDate || ''}
                      onChange={(e) => setEditForm(f => ({ ...(f as any), dueDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Points</Label>
                    <Input
                      type="number"
                      min={1}
                      max={50}
                      value={editForm?.points ?? 10}
                      onChange={(e) => setEditForm(f => ({ ...(f as any), points: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Question PDF</Label>
                    <Input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setEditForm(f => ({ ...(f as any), questionFile: e.target.files?.[0] || null }))}
                    />
                    {selectedAssignment.questions && (
                      <p className="text-xs text-gray-500 mt-1">Current: {selectedAssignment.questions}</p>
                    )}
                  </div>
                  <div>
                    <Label>Marking Scheme (optional)</Label>
                    <Input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setEditForm(f => ({ ...(f as any), answerFile: e.target.files?.[0] || null }))}
                    />
                    {selectedAssignment.answers && (
                      <p className="text-xs text-gray-500 mt-1">Current: {selectedAssignment.answers}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" onClick={saveAssignmentEdits}>Save</Button>
                  <Button variant="outline" className="flex-1" onClick={() => setEditDetails(false)}>Cancel</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submissions + Preview + Grading */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: submissions list */}
          <Card className="lg:col-span-1">
            <CardContent className="p-4">
              <h3 className="text-lg text-gray-900 mb-3">Submissions ({(submissionsByAssignment[selectedAssignment.id] || []).length})</h3>
              <div className="space-y-3">
                {(submissionsByAssignment[selectedAssignment.id] || []).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedSubmissionId(s.id);
                      setGradeScore(s.score != null ? String(s.score) : '');
                      setGradeFeedback(s.feedback || '');
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition
                      ${selectedSubmissionId === s.id ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gray-200 text-gray-600">
                          {(s.user_name || '').split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{s.user_name}</p>
                        <p className="text-xs text-gray-500">{new Date(s.created_at).toLocaleString()}</p>
                      </div>
                      <Badge className={(s.status_display || '').toLowerCase() === 'graded' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                        {(s.status_display || '').toLowerCase() === 'graded' ? 'graded' : 'pending'}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Right: preview + grade (stub) */}
          <Card className="lg:col-span-2">
            <CardContent className="p-4">
              {!selectedSubmission ? (
                <div className="text-center py-16 text-gray-500">Select a submission to view & grade</div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gray-200 text-gray-600">
                          {(selectedSubmission.user_name || '').split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="text-gray-900">{selectedSubmission.user_name}</h4>
                        <p className="text-sm text-gray-500">{new Date(selectedSubmission.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                    <Badge className={(selectedSubmission.status_display || '').toLowerCase() === 'graded' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                      {(selectedSubmission.status_display || '').toLowerCase() === 'graded' ? 'graded' : 'pending'}
                    </Badge>
                  </div>

                  <div className="mb-4">
                    {/* Add real preview when your backend returns a file URL per submission */}
                    <div className="rounded-lg border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
                      Preview placeholder (wire submission file URL here)
                    </div>
                  </div>

                  <div className="text-sm text-gray-500">
                    Grading is handled on the staff side in your current setup.
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  /* ------------------------------- LIST VIEW ------------------------------ */

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-gray-900">Assignment Management</h2>

        {/* Create Assignment Dialog */}
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create Assignment</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create New Assignment</DialogTitle>
              <DialogDescription>Add a new assignment and choose recipients by student or school</DialogDescription>
            </DialogHeader>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Assignment Title</Label>
                  <Input
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                    placeholder="Enter assignment title"
                  />
                </div>
                <div>
                  <Label>Type</Label>
                  <Select
                    value={newAssignment.type}
                    onValueChange={(value: AssignmentType) => setNewAssignment({ ...newAssignment, type: value })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reading">Reading</SelectItem>
                      <SelectItem value="math">Math</SelectItem>
                      <SelectItem value="writing">Writing</SelectItem>
                      <SelectItem value="art">Art</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  placeholder="Describe the assignment"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Release Date</Label>
                  <Input
                    type="date"
                    value={newAssignment.releaseDate}
                    onChange={(e) => setNewAssignment({ ...newAssignment, releaseDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Points</Label>
                  <Input
                    type="number"
                    min={1}
                    max={50}
                    value={newAssignment.points}
                    onChange={(e) => setNewAssignment({ ...newAssignment, points: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Question PDF</Label>
                  <Input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setNewAssignment({ ...newAssignment, questionFile: e.target.files?.[0] || null })}
                  />
                </div>
                <div>
                  <Label>Marking Scheme (optional)</Label>
                  <Input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setNewAssignment({ ...newAssignment, answerFile: e.target.files?.[0] || null })}
                  />
                </div>
              </div>

              {/* Recipients */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Students list with search + checkboxes */}
                <div className="rounded-lg border p-3">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm">Select Students</Label>
                    <span className="text-xs text-gray-500">{selectedStudentIds.length} selected</span>
                  </div>
                  <Input
                    placeholder="Search students (parent name or child name)…"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="mb-2"
                  />
                  <div className="h-56 overflow-auto pr-2 space-y-1">
                    {parentAccounts
                      .filter((p) => {
                        const q = studentSearch.toLowerCase();
                        const a = (p.parent_name || p.username || '').toLowerCase();
                        const b = (p.children_name || '').toLowerCase();
                        return !q || a.includes(q) || b.includes(q);
                      })
                      .map((p) => {
                        const label = `${p.parent_name || p.username || 'Parent'}${p.children_name ? ` — Child: ${p.children_name}` : ''}${p.school ? ` — ${p.school}` : ''}`;
                        const checked = selectedStudentIds.includes(p.id);
                        return (
                          <label key={p.id} className="flex items-center gap-2 text-sm py-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleStudent(p.id)}
                            />
                            <span className="truncate">{label}</span>
                          </label>
                        );
                      })}
                  </div>
                </div>

                {/* Schools list with checkboxes */}
                <div className="rounded-lg border p-3">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm">Select Schools</Label>
                    <span className="text-xs text-gray-500">{selectedSchools.length} selected</span>
                  </div>
                  <div className="h-56 overflow-auto pr-2 space-y-1">
                    {schoolNames.map((s) => {
                      const checked = selectedSchools.includes(s);
                      return (
                        <label key={s} className="flex items-center gap-2 text-sm py-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleSchool(s)}
                          />
                          <span className="truncate">{s}</span>
                        </label>
                      );
                    })}
                    {schoolNames.length === 0 && (
                      <p className="text-xs text-gray-500">No schools found in parent accounts.</p>
                    )}
                  </div>
                  {resolvedAssignedTo.length > 0 && (
                    <p className="text-xs text-gray-600 mt-2">
                      Will assign to <b>{resolvedAssignedTo.length}</b> unique parent account(s).
                    </p>
                  )}
                </div>
              </div>

              <Button onClick={createAssignment} className="w-full">Create Assignment</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading assignments…</p>}
      {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

      <Tabs defaultValue="assignments" className="w-full">
        <TabsList>
          <TabsTrigger value="assignments">All Assignments</TabsTrigger>
          <TabsTrigger value="grading">
            Pending Grading ({allSubmissions.filter((s) => (s.status_display || '').toLowerCase() !== 'graded' && s.score == null).length})
          </TabsTrigger>
        </TabsList>

        {/* Assignments Tab */}
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

        {/* Grading Tab – cross-assignment */}
        <TabsContent value="grading" className="space-y-4 mt-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600">
                {allSubmissions.filter((s) => (s.status_display || '').toLowerCase() !== 'graded' && s.score == null).length} submissions pending review
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
                    <Badge
                      className={(submission.status_display || '').toLowerCase() === 'graded'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-orange-100 text-orange-800'}
                    >
                      {(submission.status_display || '').toLowerCase() === 'graded' ? 'graded' : 'pending'}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-1">Submitted: {new Date(submission.created_at).toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-800">Open the assignment to view details and grade (in staff workflows).</p>
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
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setSelectedAssignmentId(submission.assignment);
                        setSelectedSubmissionId(submission.id);
                        setGradeScore('');
                        setGradeFeedback('');
                      }}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      View in Details
                    </Button>
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