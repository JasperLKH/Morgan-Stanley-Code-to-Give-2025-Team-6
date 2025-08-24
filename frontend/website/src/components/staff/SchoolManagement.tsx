import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { Copy, Download, RefreshCw, School, Users, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface School {
  id: string;
  name: string;
  createdAt: string;
  studentCount: number;
}

interface StudentAccount {
  id: string;
  username: string;
  password: string;
  schoolId: string;
  schoolName: string;
  createdAt: string;
  passwordReset: boolean;
}

export function SchoolManagement() {
  const [schools, setSchools] = useState<School[]>([
    { id: '1', name: 'Sunshine Kindergarten', createdAt: '2024-01-15', studentCount: 25 },
    { id: '2', name: 'Happy Learning Center', createdAt: '2024-02-20', studentCount: 18 }
  ]);
  
  const [studentAccounts, setStudentAccounts] = useState<StudentAccount[]>([
    { id: '1', username: 'reach00001', password: 'Kj8mN2pQ', schoolId: '1', schoolName: 'Sunshine Kindergarten', createdAt: '2024-01-15', passwordReset: false },
    { id: '2', username: 'reach00002', password: 'Xp9vC4fR', schoolId: '1', schoolName: 'Sunshine Kindergarten', createdAt: '2024-01-15', passwordReset: false },
    { id: '3', username: 'reach00003', password: 'Qs7nV1mK', schoolId: '2', schoolName: 'Happy Learning Center', createdAt: '2024-02-20', passwordReset: true }
  ]);

  const [newSchoolName, setNewSchoolName] = useState('');
  const [studentCount, setStudentCount] = useState(10);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const getNextStudentNumber = () => {
    const lastAccount = [...studentAccounts].sort((a, b) => 
      parseInt(a.username.slice(5)) - parseInt(b.username.slice(5))
    ).pop();
    
    if (!lastAccount) return 1;
    return parseInt(lastAccount.username.slice(5)) + 1;
  };

  const handleCreateSchool = async () => {
    if (!newSchoolName.trim()) {
      toast.error('Please enter a school name');
      return;
    }

    setIsCreating(true);
    
    // Simulate API call
    setTimeout(() => {
      const newSchool: School = {
        id: Date.now().toString(),
        name: newSchoolName.trim(),
        createdAt: new Date().toISOString().split('T')[0],
        studentCount: 0
      };

      setSchools(prev => [...prev, newSchool]);
      setNewSchoolName('');
      setIsCreating(false);
      toast.success(`School "${newSchool.name}" created successfully`);
    }, 1000);
  };

  const handleGenerateStudentAccounts = async (schoolId: string, count: number) => {
    const school = schools.find(s => s.id === schoolId);
    if (!school) return;

    setIsCreating(true);
    
    // Simulate API call
    setTimeout(() => {
      const newAccounts: StudentAccount[] = [];
      let nextNumber = getNextStudentNumber();

      for (let i = 0; i < count; i++) {
        const account: StudentAccount = {
          id: `${Date.now()}-${i}`,
          username: `reach${nextNumber.toString().padStart(5, '0')}`,
          password: generateRandomPassword(),
          schoolId: schoolId,
          schoolName: school.name,
          createdAt: new Date().toISOString().split('T')[0],
          passwordReset: false
        };
        newAccounts.push(account);
        nextNumber++;
      }

      setStudentAccounts(prev => [...prev, ...newAccounts]);
      setSchools(prev => prev.map(s => 
        s.id === schoolId 
          ? { ...s, studentCount: s.studentCount + count }
          : s
      ));
      setIsCreating(false);
      toast.success(`Generated ${count} student accounts for ${school.name}`);
    }, 1500);
  };

  const handleResetPassword = (accountId: string) => {
    const newPassword = generateRandomPassword();
    setStudentAccounts(prev => prev.map(acc => 
      acc.id === accountId 
        ? { ...acc, password: newPassword, passwordReset: true }
        : acc
    ));
    toast.success('Password reset successfully');
  };

  const handleCopyCredentials = (username: string, password: string) => {
    navigator.clipboard.writeText(`Username: ${username}\nPassword: ${password}`);
    toast.success('Credentials copied to clipboard');
  };

  const handlePrintAccounts = (schoolId: string) => {
    const schoolAccounts = studentAccounts.filter(acc => acc.schoolId === schoolId);
    const school = schools.find(s => s.id === schoolId);
    
    if (schoolAccounts.length === 0) {
      toast.error('No student accounts found for this school');
      return;
    }

    // Create printable content
    const printContent = `
      <html>
        <head>
          <title>Student Accounts - ${school?.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #3b82f6; margin-bottom: 20px; }
            .account { 
              border: 1px solid #e2e8f0; 
              padding: 10px; 
              margin: 10px 0; 
              border-radius: 8px;
              page-break-inside: avoid;
            }
            .username { font-weight: bold; font-size: 18px; }
            .password { font-size: 16px; margin-top: 5px; }
            @media print {
              .account { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <h1>REACH Student Accounts - ${school?.name}</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          ${schoolAccounts.map(acc => `
            <div class="account">
              <div class="username">Username: ${acc.username}</div>
              <div class="password">Password: ${acc.password}</div>
            </div>
          `).join('')}
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <School className="h-6 w-6 text-primary" />
        <h1>School & Student Account Management</h1>
      </div>

      {/* Create School Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <School className="h-5 w-5" />
            Create New School
          </CardTitle>
          <CardDescription>
            Add a new school to the REACH platform and generate student accounts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="schoolName">School Name</Label>
              <Input
                id="schoolName"
                value={newSchoolName}
                onChange={(e) => setNewSchoolName(e.target.value)}
                placeholder="Enter school name..."
                className="mt-1"
              />
            </div>
            <div className="w-32">
              <Label htmlFor="studentCount">Students</Label>
              <Input
                id="studentCount"
                type="number"
                min="1"
                max="50"
                value={studentCount}
                onChange={(e) => setStudentCount(Number(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>
          <Button 
            onClick={handleCreateSchool}
            disabled={isCreating || !newSchoolName.trim()}
            className="w-full"
          >
            {isCreating ? 'Creating...' : 'Create School & Generate Student Accounts'}
          </Button>
        </CardContent>
      </Card>

      {/* Schools List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Existing Schools
          </CardTitle>
          <CardDescription>
            Manage existing schools and their student accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {schools.map((school) => (
              <div key={school.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-medium">{school.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Created: {school.createdAt} • {school.studentCount} students
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Users className="h-4 w-4 mr-1" />
                          Add Students
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Generate Student Accounts</DialogTitle>
                          <DialogDescription>
                            Create new student accounts for {school.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="newStudentCount">Number of Students</Label>
                            <Input
                              id="newStudentCount"
                              type="number"
                              min="1"
                              max="20"
                              value={studentCount}
                              onChange={(e) => setStudentCount(Number(e.target.value))}
                              className="mt-1"
                            />
                          </div>
                          <Button 
                            onClick={() => {
                              handleGenerateStudentAccounts(school.id, studentCount);
                              const openElement = document.querySelector('[data-state="open"]') as HTMLElement;
                              openElement?.click();
                            }}
                            disabled={isCreating}
                            className="w-full"
                          >
                            {isCreating ? 'Generating...' : `Generate ${studentCount} Accounts`}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handlePrintAccounts(school.id)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Print Accounts
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Student Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Student Accounts</CardTitle>
          <CardDescription>
            View and manage all generated student accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Password</TableHead>
                <TableHead>School</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentAccounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-mono">{account.username}</TableCell>
                  <TableCell className="font-mono">{account.password}</TableCell>
                  <TableCell>{account.schoolName}</TableCell>
                  <TableCell>{account.createdAt}</TableCell>
                  <TableCell>
                    {account.passwordReset ? (
                      <Badge variant="outline" className="text-warning">
                        Reset
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-success">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyCredentials(account.username, account.password)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleResetPassword(account.id)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}