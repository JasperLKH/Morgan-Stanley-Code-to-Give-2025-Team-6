import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  ArrowLeft,
  Save,
  Send,
  Upload,
  Plus,
  X,
  Calendar,
  FileText,
  BookOpen,
  Target,
  Users,
  Info,
  File,
  Paperclip,
  Download,
  Trash2
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: string;
}

interface CreateAssignmentPageProps {
  user: User;
  onBack: () => void;
}

interface WordListItem {
  id: string;
  word: string;
}

interface AttachedDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
}

export function CreateAssignmentPage({ user, onBack }: CreateAssignmentPageProps) {
  console.log('CreateAssignmentPage rendered with user:', user);
  const [assignment, setAssignment] = useState({
    name: '',
    type: 'reading' as 'reading' | 'math' | 'writing' | 'art' | 'pronunciation',
    description: '',
    dueDate: '',
    points: 10,
    notes: ''
  });
  
  const [wordList, setWordList] = useState<WordListItem[]>([]);
  const [newWord, setNewWord] = useState('');
  const [wordListInput, setWordListInput] = useState('');
  const [inputMethod, setInputMethod] = useState<'manual' | 'bulk' | 'upload'>('manual');
  const [attachedDocuments, setAttachedDocuments] = useState<AttachedDocument[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock students data for assignment targeting
  const students = [
    { id: '1', name: 'Emma Chen', class: 'K1-A' },
    { id: '2', name: 'Alex Wong', class: 'K1-A' },
    { id: '3', name: 'Sophie Lee', class: 'K1-B' },
    { id: '4', name: 'Marcus Johnson', class: 'K2-A' },
    { id: '5', name: 'Lily Zhang', class: 'K2-B' }
  ];

  const addWord = () => {
    if (newWord.trim()) {
      const newWordItem: WordListItem = {
        id: Date.now().toString(),
        word: newWord.trim()
      };
      setWordList([...wordList, newWordItem]);
      setNewWord('');
    }
  };

  const removeWord = (id: string) => {
    setWordList(wordList.filter(item => item.id !== id));
  };

  const processBulkWords = () => {
    if (wordListInput.trim()) {
      const words = wordListInput
        .split(/[,\n]/)
        .map(word => word.trim())
        .filter(word => word.length > 0)
        .map(word => ({
          id: Date.now().toString() + Math.random(),
          word
        }));
      
      setWordList([...wordList, ...words]);
      setWordListInput('');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) {
          setWordListInput(content);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newDocuments: AttachedDocument[] = Array.from(files as FileList).map((file: File) => ({
        id: Date.now().toString() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        file: file
      }));
      
      setAttachedDocuments(prev => [...prev, ...newDocuments]);
      // Reset the input
      event.target.value = '';
    }
  };

  const removeDocument = (id: string) => {
    setAttachedDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="w-4 h-4 text-red-500" />;
    if (type.includes('image')) return <File className="w-4 h-4 text-blue-500" />;
    if (type.includes('document') || type.includes('word')) return <FileText className="w-4 h-4 text-blue-600" />;
    if (type.includes('sheet') || type.includes('excel')) return <FileText className="w-4 h-4 text-green-600" />;
    return <File className="w-4 h-4 text-gray-500" />;
  };

  const validateForm = () => {
    if (!assignment.name.trim()) return false;
    if (!assignment.dueDate) return false;
    if (assignment.type === 'pronunciation' && wordList.length === 0) return false;
    return true;
  };

  const saveAsDraft = async () => {
    if (!assignment.name.trim()) return;
    
    setIsSubmitting(true);
    
    const assignmentData = {
      ...assignment,
      wordList: wordList.map(item => item.word),
      attachedDocuments: attachedDocuments.map(doc => ({
        name: doc.name,
        size: doc.size,
        type: doc.type
      })),
      status: 'draft',
      createdBy: user.id,
      createdAt: new Date().toISOString()
    };
    
    console.log('Saving assignment as draft:', assignmentData);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Assignment saved as draft!');
    }, 1000);
  };

  const publishAssignment = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    const assignmentData = {
      ...assignment,
      wordList: wordList.map(item => item.word),
      attachedDocuments: attachedDocuments.map(doc => ({
        name: doc.name,
        size: doc.size,
        type: doc.type
      })),
      status: 'published',
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString()
    };
    
    console.log('Publishing assignment:', assignmentData);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Assignment published successfully!');
      onBack();
    }, 1000);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'reading': return 'bg-blue-100 text-blue-800';
      case 'math': return 'bg-green-100 text-green-800';
      case 'writing': return 'bg-purple-100 text-purple-800';
      case 'art': return 'bg-pink-100 text-pink-800';
      case 'pronunciation': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Assignments</span>
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="text-xl text-gray-900">Create Assignment</h1>
              <p className="text-sm text-gray-600">Design a new learning activity for students</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={saveAsDraft}
              disabled={isSubmitting || !assignment.name.trim()}
              className="flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Draft</span>
            </Button>
            <Button
              onClick={publishAssignment}
              disabled={isSubmitting || !validateForm()}
              className="flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Publish Assignment</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Basic Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="name">Assignment Name *</Label>
                <Input
                  id="name"
                  value={assignment.name}
                  onChange={(e) => setAssignment({...assignment, name: e.target.value})}
                  placeholder="e.g., Read 'The Little Red Hen' with Parent"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="type">Assignment Type *</Label>
                <Select
                  value={assignment.type}
                  onValueChange={(value: 'reading' | 'math' | 'writing' | 'art' | 'pronunciation') => 
                    setAssignment({...assignment, type: value})
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reading">Reading</SelectItem>
                    <SelectItem value="math">Math</SelectItem>
                    <SelectItem value="writing">Writing</SelectItem>
                    <SelectItem value="art">Art</SelectItem>
                    <SelectItem value="pronunciation">Pronunciation Practice</SelectItem>
                  </SelectContent>
                </Select>
                <Badge className={`${getTypeColor(assignment.type)} mt-2`} variant="secondary">
                  {assignment.type}
                </Badge>
              </div>
              
              <div>
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={assignment.dueDate}
                  onChange={(e) => setAssignment({...assignment, dueDate: e.target.value})}
                  className="mt-1"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                <Label htmlFor="points">Points Reward</Label>
                <Input
                  id="points"
                  type="number"
                  value={assignment.points}
                  onChange={(e) => setAssignment({...assignment, points: parseInt(e.target.value) || 0})}
                  min="1"
                  max="100"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">Points students earn for completion</p>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={assignment.description}
                onChange={(e) => setAssignment({...assignment, description: e.target.value})}
                placeholder="Describe what students need to do for this assignment..."
                rows={4}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Word List (for pronunciation assignments) */}
        {assignment.type === 'pronunciation' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Word List</span>
                <Badge className="bg-orange-100 text-orange-800">Required for Pronunciation</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2 mb-4">
                <Button
                  variant={inputMethod === 'manual' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setInputMethod('manual')}
                >
                  Add One by One
                </Button>
                <Button
                  variant={inputMethod === 'bulk' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setInputMethod('bulk')}
                >
                  Bulk Input
                </Button>
                <Button
                  variant={inputMethod === 'upload' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setInputMethod('upload')}
                >
                  Upload File
                </Button>
              </div>

              {inputMethod === 'manual' && (
                <div className="flex space-x-2">
                  <Input
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                    placeholder="Enter a word"
                    onKeyDown={(e) => e.key === 'Enter' && addWord()}
                    className="flex-1"
                  />
                  <Button onClick={addWord} disabled={!newWord.trim()}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {inputMethod === 'bulk' && (
                <div className="space-y-2">
                  <Textarea
                    value={wordListInput}
                    onChange={(e) => setWordListInput(e.target.value)}
                    placeholder="Enter words separated by commas or new lines&#10;e.g., butterfly, wonderful, sunshine"
                    rows={4}
                  />
                  <Button onClick={processBulkWords} disabled={!wordListInput.trim()}>
                    Add Words
                  </Button>
                </div>
              )}

              {inputMethod === 'upload' && (
                <div className="space-y-2">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Upload a text file with words</p>
                    <input
                      type="file"
                      accept=".txt"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      <Button variant="outline" size="sm" asChild>
                        <span>Choose File</span>
                      </Button>
                    </Label>
                  </div>
                  {wordListInput && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Preview from file:</p>
                      <Textarea
                        value={wordListInput}
                        onChange={(e) => setWordListInput(e.target.value)}
                        rows={3}
                        className="text-sm"
                      />
                      <Button onClick={processBulkWords} disabled={!wordListInput.trim()}>
                        Add Words from File
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Word List Display */}
              {wordList.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Current Word List ({wordList.length} words)</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setWordList([])}
                      className="text-red-600 hover:text-red-700"
                    >
                      Clear All
                    </Button>
                  </div>
                  <div className="max-h-32 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                    <div className="flex flex-wrap gap-2">
                      {wordList.map((item) => (
                        <Badge
                          key={item.id}
                          variant="secondary"
                          className="flex items-center space-x-1 bg-white border"
                        >
                          <span>{item.word}</span>
                          <button
                            onClick={() => removeWord(item.id)}
                            className="ml-1 hover:text-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Document Attachments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Paperclip className="w-5 h-5" />
              <span>Assignment Documents</span>
              <Badge variant="outline">Optional</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              Upload worksheets, reading materials, instruction sheets, or other documents for this assignment.
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Upload assignment documents (PDF, DOC, DOCX, JPG, PNG)
              </p>
              <p className="text-xs text-gray-500 mb-3">
                Maximum file size: 10MB per file
              </p>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                onChange={handleDocumentUpload}
                className="hidden"
                id="document-upload"
              />
              <Label htmlFor="document-upload" className="cursor-pointer">
                <Button variant="outline" size="sm" asChild>
                  <span>Choose Files</span>
                </Button>
              </Label>
            </div>

            {/* Uploaded Documents Display */}
            {attachedDocuments.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    Uploaded Documents ({attachedDocuments.length})
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAttachedDocuments([])}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Remove All
                  </Button>
                </div>
                
                <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                  {attachedDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border"
                    >
                      <div className="flex items-center space-x-3">
                        {getFileIcon(doc.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 truncate">
                            {doc.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(doc.size)} • {doc.type.split('/')[1]?.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // Create a temporary download link
                            const url = URL.createObjectURL(doc.file);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = doc.name;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument(doc.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Alert>
                  <Info className="w-4 h-4" />
                  <AlertDescription>
                    These documents will be available to parents and students when they view the assignment. 
                    Make sure all materials are appropriate and clearly support the learning objectives.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes and Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Additional Notes & Instructions</span>
              <Badge variant="outline">Optional</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="notes">Notes for Parents and Students</Label>
              <Textarea
                id="notes"
                value={assignment.notes}
                onChange={(e) => setAssignment({...assignment, notes: e.target.value})}
                placeholder="Add any special instructions, tips, or additional context for parents and students..."
                rows={4}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                This information will be visible to parents when they view the assignment
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Assignment Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="w-5 h-5" />
              <span>Assignment Preview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Badge className={getTypeColor(assignment.type)} variant="secondary">
                  {assignment.type}
                </Badge>
                <span className="text-sm text-gray-600">+{assignment.points} points</span>
              </div>
              <h3 className="text-lg text-gray-900 mb-2">
                {assignment.name || 'Assignment Name'}
              </h3>
              <p className="text-sm text-gray-700 mb-2">
                {assignment.description || 'Assignment description will appear here...'}
              </p>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>Due: {assignment.dueDate || 'Select date'}</span>
                </span>
                {assignment.type === 'pronunciation' && (
                  <span className="flex items-center space-x-1">
                    <BookOpen className="w-3 h-3" />
                    <span>{wordList.length} words to practice</span>
                  </span>
                )}
                {attachedDocuments.length > 0 && (
                  <span className="flex items-center space-x-1">
                    <Paperclip className="w-3 h-3" />
                    <span>{attachedDocuments.length} document{attachedDocuments.length !== 1 ? 's' : ''}</span>
                  </span>
                )}
              </div>
              {attachedDocuments.length > 0 && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-xs text-blue-700 mb-2">
                    <strong>Attached Documents:</strong>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {attachedDocuments.map((doc) => (
                      <Badge
                        key={doc.id}
                        variant="outline"
                        className="flex items-center space-x-1 text-xs bg-white"
                      >
                        {getFileIcon(doc.type)}
                        <span className="truncate max-w-20">{doc.name}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {assignment.notes && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-xs text-blue-700">
                    <strong>Notes:</strong> {assignment.notes}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Validation Alerts */}
        {assignment.type === 'pronunciation' && wordList.length === 0 && (
          <Alert>
            <Info className="w-4 h-4" />
            <AlertDescription>
              Pronunciation assignments require at least one word in the word list.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}