import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { School, Users, UserPlus, Download, Eye } from 'lucide-react';

interface GeneratedAccount {
  username: string;
  password: string;
  role: string;
}

// Add this new sub-component at the top of your file (before export default function SchoolManagement)

function SchoolsList() {
  const [schools, setSchools] = React.useState<{ id: number; name: string }[]>([]);
  const [editingSchool, setEditingSchool] = React.useState<number | null>(null);
  const [newName, setNewName] = React.useState('');
  const [usersBySchool, setUsersBySchool] = React.useState<Record<string, any[]>>({});

  // Fetch schools
  const fetchSchools = async () => {
    try {
      const res = await fetch('http://localhost:8000/account/schools/');
      if (!res.ok) throw new Error('Failed to fetch schools');
      const data = await res.json();
      setSchools(data.schools);
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    fetchSchools();
  }, []);

  // Fetch users in a school
  const fetchUsersForSchool = async (schoolName: string) => {
    try {
      const res = await fetch(`http://localhost:8000/account/schools/${encodeURIComponent(schoolName)}/users/`);
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsersBySchool((prev) => ({ ...prev, [schoolName]: data.users }));
    } catch (err) {
      console.error(err);
    }
  };

  // Update school name
  const handleUpdateSchool = async (oldName: string, id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/account/schools/${encodeURIComponent(oldName)}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });
      if (!res.ok) throw new Error('Failed to update school');
      await fetchSchools();
      setEditingSchool(null);
    } catch (err) {
      console.error(err);
      alert('Failed to update school');
    }
  };

  // Delete school
  const handleDeleteSchool = async (schoolName: string) => {
    if (!window.confirm(`Delete school "${schoolName}" and all its users?`)) return;
    try {
      const res = await fetch(`http://localhost:8000/account/schools/${encodeURIComponent(schoolName)}/`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete school');
      await fetchSchools();
    } catch (err) {
      console.error(err);
      alert('Failed to delete school');
    }
  };

  // Delete all users in school
  const handleDeleteAllUsers = async (schoolName: string) => {
    if (!window.confirm(`Delete ALL users in "${schoolName}"?`)) return;
    try {
      const res = await fetch(
        `http://localhost:8000/account/schools/${encodeURIComponent(schoolName)}/users/delete-all/`,
        { method: 'DELETE' }
      );
      if (!res.ok) throw new Error('Failed to delete all users');
      await fetchUsersForSchool(schoolName);
    } catch (err) {
      console.error(err);
      alert('Failed to delete users');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <School className="h-5 w-5" />
          Schools
        </CardTitle>
        <CardDescription>View, update, or delete schools and their users</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {schools.map((school) => (
          <div key={school.id} className="border rounded-lg p-3 space-y-2">
            {/* School row with edit/delete */}
            <div className="flex justify-between items-center">
              {editingSchool === school.id ? (
                <>
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-1/2"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleUpdateSchool(school.name, school.id)}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingSchool(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <span className="font-semibold">{school.name}</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingSchool(school.id);
                        setNewName(school.name);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteSchool(school.name)}
                    >
                      Delete School
                    </Button>
                  </div>
                </>
              )}
            </div>

            {/* User controls */}
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => fetchUsersForSchool(school.name)}
              >
                Show Users
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDeleteAllUsers(school.name)}
              >
                Delete All Users
              </Button>
            </div>

            {/* Users list */}
            {usersBySchool[school.name] && (
              <div className="mt-3 border-t pt-2 space-y-1">
                {usersBySchool[school.name].length === 0 ? (
                  <p className="text-sm text-gray-500">No users found</p>
                ) : (
                  usersBySchool[school.name].map((u) => (
                    <div
                      key={u.id}
                      className="flex justify-between text-sm px-2 py-1 rounded hover:bg-gray-50"
                    >
                      <span className="font-mono">{u.username}</span>
                      <span>{u.role}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function SchoolManagement() {
  const [schoolName, setSchoolName] = useState('');
  const [isCreatingSchool, setIsCreatingSchool] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [accountRole, setAccountRole] = useState('');
  const [accountCount, setAccountCount] = useState('');
  const [generatedAccounts, setGeneratedAccounts] = useState<GeneratedAccount[]>([]);
  const [isGeneratingAccounts, setIsGeneratingAccounts] = useState(false);

  const [existingSchools, setExistingSchools] = useState<string[]>([]);

  React.useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await fetch('http://localhost:8000/account/schools/');
        if (!res.ok) throw new Error('Failed to fetch schools');
        const data = await res.json();
        // Assuming backend returns { schools: [ { id, name } ] }
        setExistingSchools(data.schools.map((s: any) => s.name));
      } catch (err) {
        console.error(err);
      }
    };

    fetchSchools();
  }, []);


  const handleCreateSchool = async () => {
  if (!schoolName.trim()) return;

  setIsCreatingSchool(true);
    try {
      const response = await fetch('http://localhost:8000/account/schools/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: schoolName }),
      });

      if (!response.ok) {
        throw new Error('Failed to create school');
      }

      const data = await response.json();
      alert(`School "${data.name}" created successfully!`);

      // Clear input + reset
      setSchoolName('');
      setIsCreatingSchool(false);

      // Optionally add to local school dropdown
      // so it immediately shows up in Select
      // (remove this if you prefer fetching from backend instead)
      // setExistingSchools((prev) => [...prev, data.name]);

      } catch (error) {
        console.error('Error creating school:', error);
        alert('Error creating school. Please try again.');
        setIsCreatingSchool(false);
      }
  };


  const generateAccounts = async () => {
    if (!selectedSchool || !accountRole || !accountCount) return;

    setIsGeneratingAccounts(true);

    try {
      const response = await fetch('http://localhost:8000/account/generate_accounts_by_school/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          school_name: selectedSchool,
          role: accountRole,
          number: parseInt(accountCount, 10),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate accounts');
      }

      const data = await response.json();

      // Adjust this depending on your backend’s real response format
      // For now let’s assume it returns { accounts: [ { username, password, role } ] }
      setGeneratedAccounts(data.accounts || []);

    } catch (error) {
      console.error('Error generating accounts:', error);
      alert('Error generating accounts. Please try again.');
    } finally {
      setIsGeneratingAccounts(false);
    }
  };

  const downloadAccountInfo = () => {
    const csvContent = [
      'Username,Password,Role,School',
      ...generatedAccounts.map(acc => `${acc.username},${acc.password},${acc.role},${selectedSchool}`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedSchool}_accounts.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-2">
        <School className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">School Management</h1>
      </div>

      {/* NEW SCHOOLS WIDGET */}
      <SchoolsList />

      {/* Create School Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <School className="h-5 w-5" />
            Create New School
          </CardTitle>
          <CardDescription>
            Enter the school name to create a new school
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="schoolName">School Name</Label>
            <Input
              id="schoolName"
              placeholder="Example: Hong Kong Primary School"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleCreateSchool}
            disabled={!schoolName.trim() || isCreatingSchool}
            className="w-full"
          >
            {isCreatingSchool ? 'Creating...' : 'Create School'}
          </Button>
        </CardContent>
      </Card>

      {/* Generate Accounts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Bulk Create User Accounts
          </CardTitle>
          <CardDescription>
            Generate user accounts in bulk for the school
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="school">Select School</Label>
              <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                <SelectTrigger>
                  <SelectValue placeholder="Select School" />
                </SelectTrigger>
                <SelectContent>
                  {existingSchools.map((school) => (
                    <SelectItem key={school} value={school}>
                      {school}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">User Role</Label>
              <Select value={accountRole} onValueChange={setAccountRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  {/* <SelectItem value="staff">Staff</SelectItem> */}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="count">Account Count</Label>
              <Input
                id="count"
                type="number"
                placeholder="Example: 30"
                min="1"
                max="100"
                value={accountCount}
                onChange={(e) => setAccountCount(e.target.value)}
              />
            </div>
          </div>

          <Button 
            onClick={generateAccounts}
            disabled={!selectedSchool || !accountRole || !accountCount || isGeneratingAccounts}
            className="w-full"
          >
            {isGeneratingAccounts ? 'Generating...' : 'Generate Accounts'}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Accounts Display */}
      {generatedAccounts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Generated Accounts ({generatedAccounts.length})
            </CardTitle>
            <CardDescription>
              Account information has been generated and can be downloaded and printed for students.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={downloadAccountInfo} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Account Information (CSV)
              </Button>
            </div>

            <Alert>
              <Eye className="h-4 w-4" />
              <AlertDescription>
                <strong>Important Reminder:</strong>
                Please distribute this account information securely to the relevant users. If an account is lost, it can be regenerated or reprinted.
              </AlertDescription>
            </Alert>

            <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
              <div className="grid grid-cols-3 gap-4 font-semibold border-b pb-2 mb-2">
                <div>Username</div>
                <div>Password</div>
                <div>Role</div>
              </div>
              {generatedAccounts.map((account, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 py-1 text-sm">
                  <div className="font-mono">{account.username}</div>
                  <div className="font-mono">{account.password}</div>
                  <div>{account.role === 'parent' ? 'parent' : account.role === 'teacher' ? 'teacher' : 'staff'}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
