import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { BookOpen, GraduationCap, Star, TrendingUp, Users } from 'lucide-react';

type Status = 'excellent' | 'good' | 'needs_attention';

interface Student {
  id: number | string;
  name: string;
  parentName: string;
  averageScore: number;
  completedAssignments: number;
  totalAssignments: number;
  recentFeedback: string;
  status: Status;
}

export function TeacherStudents() {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/account/users/')
      .then((r) => r.json())
      .then((data) => {
        const users = data?.users ?? [];
        const mapped: Student[] = users
          .filter((u: any) => u.children_name)
          .map((u: any) => ({
            id: u.id,
            name: u.children_name,
            parentName: u.parent_name,
            averageScore: u.points || 0,
            completedAssignments: 0,
            totalAssignments: 0,
            recentFeedback: '',
            // map to one of our three; adjust if you keep active/inactive
            status: (u.is_active ? 'good' : 'needs_attention') as Status,
          }));
        setStudents(mapped);
      })
      .catch(() => setStudents([]));
  }, []);

  const classStats = useMemo(() => {
    const total = students.length;
    const averageCompletion =
      total > 0
        ? Math.round(
            (students.reduce(
              (acc, s) =>
                acc + (s.totalAssignments ? s.completedAssignments / s.totalAssignments : 0),
              0
            ) /
              total) *
              100
          )
        : 0;
    const averageScore =
      total > 0
        ? Math.round(students.reduce((acc, s) => acc + (s.averageScore || 0), 0) / total)
        : 0;
    return { totalStudents: total, averageCompletion, averageScore };
  }, [students]);

  const getStatusBadge = (status: Status) => {
    switch (status) {
      case 'excellent':
        return <Badge className="bg-green-500 text-white">Excellent</Badge>;
      case 'good':
        return <Badge className="bg-blue-500 text-white">Good</Badge>;
      case 'needs_attention':
        return <Badge className="bg-orange-500 text-white">Needs Attention</Badge>;
    }
  };

  return (
    <>
      {/* Class Overview */}
      <div>
        <h2 className="text-xl text-gray-900 mb-4">Class Overview</h2>
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl text-gray-900">{classStats.totalStudents}</p>
              <p className="text-xs text-gray-600">Students</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl text-gray-900">{classStats.averageCompletion}%</p>
              <p className="text-xs text-gray-600">Avg Completion</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl text-gray-900">{classStats.averageScore}%</p>
              <p className="text-xs text-gray-600">Avg Score</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Student Dashboard */}
      <div>
        <h2 className="text-xl text-gray-900 mb-4">Student Dashboard</h2>
        <div className="space-y-4">
          {students.map((student) => (
            <Card key={student.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gray-200 text-gray-600">
                        {student.name.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-600">Parent: {student.parentName}</p>
                    </div>
                  </div>
                  {getStatusBadge(student.status)}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Assignment Progress</p>
                    <div className="flex items-center space-x-2">
                      <Progress
                        value={
                          student.totalAssignments
                            ? (student.completedAssignments / student.totalAssignments) * 100
                            : 0
                        }
                        className="flex-1 h-2"
                      />
                      <span className="text-sm text-gray-600">
                        {student.completedAssignments}/{student.totalAssignments}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Average Score</p>
                    <div className="flex items-center space-x-2">
                      <Progress value={student.averageScore} className="flex-1 h-2" />
                      <span className="text-sm text-gray-600">{student.averageScore}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600 mb-1">Recent Feedback</p>
                  <p className="text-sm text-gray-800">{student.recentFeedback || '—'}</p>
                </div>

                <div className="flex space-x-2 mt-4">
                  <Button size="sm" variant="outline" className="flex-1">
                    <BookOpen className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <GraduationCap className="w-4 h-4 mr-1" />
                    Add Note
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}