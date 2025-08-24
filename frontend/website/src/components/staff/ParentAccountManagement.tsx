import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { UserPlus, Search, MoreHorizontal, MessageCircle } from 'lucide-react';
// for creating new parent accounts
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog"; 


interface User {
  id: number;
  username: string;
  role: string;
  parent_name: string | null;
  children_name: string | null;
  email?: string; // backend doesn’t return email directly, you might need to adjust
  is_active: boolean;
  school: string;
}

interface ParentAccountManagementProps {
  user: User;
}

export function ParentAccountManagement({ user }: ParentAccountManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [accounts, setAccounts] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // inside ParentAccountManagement

  const [open, setOpen] = useState(false);
  const [newParent, setNewParent] = useState({
    username: '',
    password: '',
    parent_name: '',
    children_name: '',
    school: '',
  });

  const handleAddParent = async () => {
  try {
    const res = await fetch('http://localhost:8000/account/signup/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: newParent.username,
        password: newParent.password,
        role: 'parent',
        parent_name: newParent.parent_name,
        children_name: newParent.children_name,
        school: newParent.school,
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to create parent');
    }

    // refresh parent list
    const created = await res.json();
    setAccounts((prev) => [...prev, created]); // depends on backend response shape
    setOpen(false);
    setNewParent({ username: '', password: '', parent_name: '', children_name: '', school: '' });
  } catch (err) {
    console.error(err);
    alert('Error creating parent');
  }
};



  useEffect(() => {
    fetch('http://localhost:8000/account/users/')
      .then(res => res.json())
      .then(data => {
        // only keep parents
        const parents = data.users.filter((u: User) => u.role === 'parent');
        setAccounts(parents);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredAccounts = accounts.filter(account =>
    account.parent_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.children_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl text-gray-900">Parent Account Management</h2>
          <p className="text-sm text-gray-600">Manage family accounts and access</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Parent Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Parent Account</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                placeholder="Username"
                value={newParent.username}
                onChange={(e) => setNewParent({ ...newParent, username: e.target.value })}
              />
              <Input
                type="password"
                placeholder="Password"
                value={newParent.password}
                onChange={(e) => setNewParent({ ...newParent, password: e.target.value })}
              />
              <Input
                placeholder="Parent Name"
                value={newParent.parent_name}
                onChange={(e) => setNewParent({ ...newParent, parent_name: e.target.value })}
              />
              <Input
                placeholder="Child Name"
                value={newParent.children_name}
                onChange={(e) => setNewParent({ ...newParent, children_name: e.target.value })}
              />
              <Input
                placeholder="School"
                value={newParent.school}
                onChange={(e) => setNewParent({ ...newParent, school: e.target.value })}
              />
            </div>

            <DialogFooter>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleAddParent}
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                      {account.parent_name?.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h3 className="text-sm text-gray-900">{account.parent_name}</h3>
                    <p className="text-sm text-gray-600">Child: {account.children_name}</p>
                    <p className="text-xs text-gray-500">School: {account.school}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <Badge 
                      variant={account.is_active ? 'default' : 'secondary'}
                      className={account.is_active ? 'bg-green-500' : ''}
                    >
                      {account.is_active ? 'active' : 'inactive'}
                    </Badge>
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
