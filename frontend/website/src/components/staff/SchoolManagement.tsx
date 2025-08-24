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

export default function SchoolManagement() {
  const [schoolName, setSchoolName] = useState('');
  const [isCreatingSchool, setIsCreatingSchool] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [accountRole, setAccountRole] = useState('');
  const [accountCount, setAccountCount] = useState('');
  const [generatedAccounts, setGeneratedAccounts] = useState<GeneratedAccount[]>([]);
  const [isGeneratingAccounts, setIsGeneratingAccounts] = useState(false);

  // Mock existing schools - in real app, this would come from API
  const existingSchools = [
    'Hong Kong Primary School',
    'Victoria International School',
    'St. Paul\'s Primary School'
  ];

  const handleCreateSchool = async () => {
    if (!schoolName.trim()) return;
    
    setIsCreatingSchool(true);
    try {
      // TODO: Call API to create school
      // const response = await fetch('http://localhost:8000/api/schools/', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name: schoolName })
      // });
      
      // Mock success
      setTimeout(() => {
        alert(`学校 "${schoolName}" 创建成功！`);
        setSchoolName('');
        setIsCreatingSchool(false);
      }, 1000);
    } catch (error) {
      console.error('Error creating school:', error);
      setIsCreatingSchool(false);
    }
  };

  const generateAccounts = async () => {
    if (!selectedSchool || !accountRole || !accountCount) return;
    
    setIsGeneratingAccounts(true);
    
    try {
      // TODO: Call API to generate accounts
      // const response = await fetch('http://localhost:8000/api/accounts/bulk-create/', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     school: selectedSchool,
      //     role: accountRole,
      //     count: parseInt(accountCount)
      //   })
      // });
      
      // Mock generated accounts
      const count = parseInt(accountCount);
      const mockAccounts: GeneratedAccount[] = [];
      
      for (let i = 1; i <= count; i++) {
        const randomNum = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
        const password = Math.random().toString(36).substring(2, 10);
        
        mockAccounts.push({
          username: `reach${randomNum}`,
          password: password,
          role: accountRole
        });
      }
      
      setTimeout(() => {
        setGeneratedAccounts(mockAccounts);
        setIsGeneratingAccounts(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error generating accounts:', error);
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
        <h1 className="text-3xl font-bold">学校管理</h1>
      </div>

      {/* Create School Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <School className="h-5 w-5" />
            创建新学校
          </CardTitle>
          <CardDescription>
            输入学校名称来创建新学校
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="schoolName">学校名称</Label>
            <Input
              id="schoolName"
              placeholder="例如: 香港小学"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleCreateSchool}
            disabled={!schoolName.trim() || isCreatingSchool}
            className="w-full"
          >
            {isCreatingSchool ? '创建中...' : '创建学校'}
          </Button>
        </CardContent>
      </Card>

      {/* Generate Accounts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            批量创建账户
          </CardTitle>
          <CardDescription>
            为学校批量生成用户账户
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="school">选择学校</Label>
              <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                <SelectTrigger>
                  <SelectValue placeholder="选择学校" />
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
              <Label htmlFor="role">用户角色</Label>
              <Select value={accountRole} onValueChange={setAccountRole}>
                <SelectTrigger>
                  <SelectValue placeholder="选择角色" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parent">家长</SelectItem>
                  <SelectItem value="teacher">教师</SelectItem>
                  <SelectItem value="staff">员工</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="count">账户数量</Label>
              <Input
                id="count"
                type="number"
                placeholder="例如: 30"
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
            {isGeneratingAccounts ? '生成中...' : '生成账户'}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Accounts Display */}
      {generatedAccounts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              生成的账户 ({generatedAccounts.length} 个)
            </CardTitle>
            <CardDescription>
              账户信息已生成，可以下载打印给学生
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={downloadAccountInfo} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                下载账户信息 (CSV)
              </Button>
            </div>

            <Alert>
              <Eye className="h-4 w-4" />
              <AlertDescription>
                <strong>重要提醒：</strong>
                请将这些账户信息安全地分发给相关用户。如果账户丢失，可以重新生成或重新打印。
              </AlertDescription>
            </Alert>

            <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
              <div className="grid grid-cols-3 gap-4 font-semibold border-b pb-2 mb-2">
                <div>用户名</div>
                <div>密码</div>
                <div>角色</div>
              </div>
              {generatedAccounts.map((account, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 py-1 text-sm">
                  <div className="font-mono">{account.username}</div>
                  <div className="font-mono">{account.password}</div>
                  <div>{account.role === 'parent' ? '家长' : account.role === 'teacher' ? '教师' : '员工'}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
