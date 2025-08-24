import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { UserPlus, Search, MoreHorizontal, MessageCircle, Calendar, School } from 'lucide-react';
import { SchoolManagement } from './SchoolManagement';
import { FamilyManagement } from './FamilyManagement';

interface User {
  id: string;
  name: string;
  role: string;
}

interface ParentAccount {
  id: string;
  parentName: string;
  childName: string;
  email: string;
  joinDate: string;
  status: 'active' | 'inactive';
  lastActivity: string;
  assignmentsCompleted: number;
  totalAssignments: number;
}

interface ParentAccountManagementProps {
  user: User;
}

export function ParentAccountManagement({ user }: ParentAccountManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState<'parents' | 'schools' | 'addFamily'>('parents');
  
  const accounts: ParentAccount[] = [
    {
      id: '1',
      parentName: 'Sarah Chen',
      childName: 'Emma Chen',
      email: 'sarah.chen@email.com',
      joinDate: '2024-07-15',
      status: 'active',
      lastActivity: '2 hours ago',
      assignmentsCompleted: 12,
      totalAssignments: 15,
    },
    {
      id: '2',
      parentName: 'Lisa Wong',
      childName: 'Alex Wong',
      email: 'lisa.wong@email.com',
      joinDate: '2024-07-20',
      status: 'active',
      lastActivity: '1 day ago',
      assignmentsCompleted: 8,
      totalAssignments: 12,
    },
    {
      id: '3',
      parentName: 'David Lee',
      childName: 'Sophie Lee',
      email: 'david.lee@email.com',
      joinDate: '2024-08-01',
      status: 'active',
      lastActivity: '3 hours ago',
      assignmentsCompleted: 5,
      totalAssignments: 8,
    },
  ];

  const filteredAccounts = accounts.filter(account =>
    account.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.childName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (activeView === 'addFamily') {
    return (
      <FamilyManagement onBack={() => setActiveView('parents')} />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl text-gray-900">Account Management</h2>
          <p className="text-sm text-gray-600">Manage families and schools</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={activeView === 'parents' ? 'default' : 'outline'}
            onClick={() => setActiveView('parents')}
            size="sm"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Families
          </Button>
          <Button
            variant={activeView === 'schools' ? 'default' : 'outline'}
            onClick={() => setActiveView('schools')}
            size="sm"
          >
            <School className="w-4 h-4 mr-2" />
            Schools
          </Button>
        </div>
      </div>

      {activeView === 'parents' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg text-gray-900">Parent Families</h3>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setActiveView('addFamily')}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Family
            </Button>
          </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by parent or child name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Accounts List */}
      <div className="space-y-4">
        {filteredAccounts.map((account) => (
          <Card key={account.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {account.parentName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="text-sm text-gray-900">{account.parentName}</h3>
                    <p className="text-sm text-gray-600">Child: {account.childName}</p>
                    <p className="text-xs text-gray-500">{account.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={account.status === 'active' ? 'default' : 'secondary'}
                        className={account.status === 'active' ? 'bg-green-500' : ''}
                      >
                        {account.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Last active: {account.lastActivity}
                    </p>
                    <p className="text-xs text-gray-500">
                      Progress: {account.assignmentsCompleted}/{account.totalAssignments}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Message
                    </Button>
                    <Button size="sm" variant="ghost">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Member since: {new Date(account.joinDate).toLocaleDateString()}</span>
                  <span>Completion rate: {Math.round((account.assignmentsCompleted / account.totalAssignments) * 100)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
        </div>
      ) : (
        <SchoolManagement />
      )}
    </div>
  );
}