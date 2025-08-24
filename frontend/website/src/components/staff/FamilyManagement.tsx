import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import { ArrowLeft, UserPlus, Users, School, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface School {
  id: string;
  name: string;
}

interface Family {
  id: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  studentName: string;
  studentAge: string;
  schoolId: string;
  schoolName: string;
  createdAt: string;
}

interface FamilyManagementProps {
  onBack?: () => void;
}

export function FamilyManagement({ onBack }: FamilyManagementProps) {
  const [schools] = useState<School[]>([
    { id: '1', name: 'Sunshine Kindergarten' },
    { id: '2', name: 'Happy Learning Center' },
    { id: '3', name: 'Little Stars Academy' }
  ]);

  const [families, setFamilies] = useState<Family[]>([
    {
      id: '1',
      parentName: 'Sarah Chen',
      parentEmail: 'sarah.chen@email.com',
      parentPhone: '+852 9123 4567',
      studentName: 'Emma Chen',
      studentAge: '5',
      schoolId: '1',
      schoolName: 'Sunshine Kindergarten',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      parentName: 'Michael Wong',
      parentEmail: 'michael.wong@email.com',
      parentPhone: '+852 9876 5432',
      studentName: 'Lucas Wong',
      studentAge: '4',
      schoolId: '2',
      schoolName: 'Happy Learning Center',
      createdAt: '2024-02-20'
    }
  ]);

  const [formData, setFormData] = useState({
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    studentName: '',
    studentAge: '',
    schoolId: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const requiredFields = ['parentName', 'parentEmail', 'studentName', 'studentAge', 'schoolId'];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData].trim()) {
        return false;
      }
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.parentEmail)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    // Age validation
    const age = parseInt(formData.studentAge);
    if (isNaN(age) || age < 3 || age > 6) {
      toast.error('Student age must be between 3 and 6 years');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const selectedSchool = schools.find(s => s.id === formData.schoolId);
      
      const newFamily: Family = {
        id: Date.now().toString(),
        parentName: formData.parentName.trim(),
        parentEmail: formData.parentEmail.trim(),
        parentPhone: formData.parentPhone.trim(),
        studentName: formData.studentName.trim(),
        studentAge: formData.studentAge.trim(),
        schoolId: formData.schoolId,
        schoolName: selectedSchool?.name || '',
        createdAt: new Date().toISOString().split('T')[0]
      };

      setFamilies(prev => [...prev, newFamily]);
      
      // Reset form
      setFormData({
        parentName: '',
        parentEmail: '',
        parentPhone: '',
        studentName: '',
        studentAge: '',
        schoolId: ''
      });
      
      setIsSubmitting(false);
      setShowForm(false);
      toast.success(`Family "${newFamily.parentName}" added successfully`);
    }, 1000);
  };

  if (showForm) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowForm(false)}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <UserPlus className="h-6 w-6 text-primary" />
          <h1>Add New Family</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Family Information</CardTitle>
            <CardDescription>
              Enter parent and student details to create a new family account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Parent Information */}
            <div>
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Parent Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="parentName">Parent Name *</Label>
                  <Input
                    id="parentName"
                    value={formData.parentName}
                    onChange={(e) => handleInputChange('parentName', e.target.value)}
                    placeholder="Enter parent's full name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="parentEmail">Email Address *</Label>
                  <Input
                    id="parentEmail"
                    type="email"
                    value={formData.parentEmail}
                    onChange={(e) => handleInputChange('parentEmail', e.target.value)}
                    placeholder="parent@email.com"
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="parentPhone">Phone Number</Label>
                <Input
                  id="parentPhone"
                  value={formData.parentPhone}
                  onChange={(e) => handleInputChange('parentPhone', e.target.value)}
                  placeholder="+852 9123 4567"
                  className="mt-1"
                />
              </div>
            </div>

            <Separator />

            {/* Student Information */}
            <div>
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <School className="h-4 w-4" />
                Student Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="studentName">Student Name *</Label>
                  <Input
                    id="studentName"
                    value={formData.studentName}
                    onChange={(e) => handleInputChange('studentName', e.target.value)}
                    placeholder="Enter student's full name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="studentAge">Age *</Label>
                  <Input
                    id="studentAge"
                    type="number"
                    min="3"
                    max="6"
                    value={formData.studentAge}
                    onChange={(e) => handleInputChange('studentAge', e.target.value)}
                    placeholder="5"
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="school">School *</Label>
                <Select value={formData.schoolId} onValueChange={(value) => handleInputChange('schoolId', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a school" />
                  </SelectTrigger>
                  <SelectContent>
                    {schools.map((school) => (
                      <SelectItem key={school.id} value={school.id}>
                        {school.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                After adding the family, parent login credentials will be automatically generated and can be shared with the parent.
              </AlertDescription>
            </Alert>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowForm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Adding Family...' : 'Add Family'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <Users className="h-6 w-6 text-primary" />
          <h1>Family Management</h1>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Family
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registered Families</CardTitle>
          <CardDescription>
            View and manage all families registered in the REACH platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {families.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No families registered yet</p>
              <p className="text-sm">Click "Add Family" to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {families.map((family) => (
                <div key={family.id} className="border rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="font-medium text-primary">{family.parentName}</h3>
                      <p className="text-sm text-muted-foreground">{family.parentEmail}</p>
                      {family.parentPhone && (
                        <p className="text-sm text-muted-foreground">{family.parentPhone}</p>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{family.studentName}</h3>
                      <p className="text-sm text-muted-foreground">Age: {family.studentAge} years</p>
                      <p className="text-sm text-muted-foreground">{family.schoolName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Added: {family.createdAt}</p>
                      <div className="flex justify-end gap-2 mt-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}