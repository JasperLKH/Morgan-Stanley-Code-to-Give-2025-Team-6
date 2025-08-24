import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  ArrowLeft, 
  Home, 
  Mic, 
  Star, 
  CheckCircle, 
  XCircle,
  Volume2,
  RotateCcw,
  Heart,
  Smile,
  Play,
  Type,
  BookOpen,
  Calendar,
  Target,
  Info,
  Trophy,
  Clock
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: string;
}

interface AssignedWord {
  id: string;
  word: string;
  assignmentTitle: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  score?: number;
  teacherName: string;
}

interface StudentPronunciationPageProps {
  user: User;
  activeSection?: 'practice' | 'assignments';
}

export function StudentPronunciationPage({ user, activeSection = 'practice' }: StudentPronunciationPageProps) {
  const [showPracticeModal, setShowPracticeModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [currentWord, setCurrentWord] = useState('wonderful');
  const [result, setResult] = useState<any>(null);
  const [customWord, setCustomWord] = useState('');
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [activeTab, setActiveTab] = useState<'practice' | 'assignments'>(activeSection);
  const [practiceSource, setPracticeSource] = useState<'custom' | 'assignment'>('custom');
  const [selectedAssignment, setSelectedAssignment] = useState<AssignedWord | null>(null);

  const studentData = {
    name: user.name || user.id,
    todaysWords: 8,
    totalPoints: 245,
    streak: 5,
    level: 'Intermediate'
  };

  const recentWords = [
    { word: 'butterfly', score: 92, emoji: '🦋', correct: true },
    { word: 'rainbow', score: 88, emoji: '🌈', correct: true },
    { word: 'elephant', score: 74, emoji: '🐘', correct: true },
    { word: 'sunshine', score: 95, emoji: '☀️', correct: true }
  ];

  // Mock assigned words from teachers
  const assignedWords: AssignedWord[] = [
    {
      id: '1',
      word: 'elephant',
      assignmentTitle: 'Animal Words Practice',
      dueDate: '2024-08-25',
      priority: 'high',
      completed: false,
      teacherName: 'Ms. Johnson'
    },
    {
      id: '2',
      word: 'butterfly',
      assignmentTitle: 'Animal Words Practice',
      dueDate: '2024-08-25',
      priority: 'high',
      completed: true,
      score: 92,
      teacherName: 'Ms. Johnson'
    },
    {
      id: '3',
      word: 'wonderful',
      assignmentTitle: 'Descriptive Words',
      dueDate: '2024-08-26',
      priority: 'medium',
      completed: false,
      teacherName: 'Ms. Johnson'
    },
    {
      id: '4',
      word: 'beautiful',
      assignmentTitle: 'Descriptive Words',
      dueDate: '2024-08-26',
      priority: 'medium',
      completed: false,
      teacherName: 'Ms. Johnson'
    },
    {
      id: '5',
      word: 'rainbow',
      assignmentTitle: 'Nature Words',
      dueDate: '2024-08-27',
      priority: 'low',
      completed: true,
      score: 88,
      teacherName: 'Mr. Smith'
    }
  ];

  const pendingWords = assignedWords.filter(w => !w.completed);
  const completedWords = assignedWords.filter(w => w.completed);

  const handleStartRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setShowResult(true);
      const score = Math.floor(Math.random() * 25) + 75;
      setResult({
        word: currentWord,
        score: score,
        correct: score >= 70,
        feedback: score >= 90 ? 'Perfect! You nailed it! 🌟' : 
                 score >= 80 ? 'Great job! Well done! 👏' :
                 'Good effort! Keep practicing! 💪'
      });

      // Mark assignment word as completed if practicing from assignment
      if (practiceSource === 'assignment' && selectedAssignment) {
        // In real app, this would update the backend
        selectedAssignment.completed = true;
        selectedAssignment.score = score;
      }
    }, 2800);
  };

  const handlePracticeAgain = () => {
    setShowResult(false);
    setResult(null);
  };

  const handleClosePractice = () => {
    setShowPracticeModal(false);
    setShowResult(false);
    setResult(null);
    setIsRecording(false);
    setSelectedAssignment(null);
    setPracticeSource('custom');
  };

  const handlePlayCustomWord = () => {
    if (!customWord.trim()) return;
    
    setIsPlayingTTS(true);
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(customWord.trim());
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.lang = 'en-US';
      
      utterance.onend = () => {
        setIsPlayingTTS(false);
      };
      
      utterance.onerror = () => {
        setIsPlayingTTS(false);
      };
      
      speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        setIsPlayingTTS(false);
      }, 1000);
    }
  };

  const startAssignmentPractice = (word: AssignedWord) => {
    setCurrentWord(word.word);
    setSelectedAssignment(word);
    setPracticeSource('assignment');
    setShowPracticeModal(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    return `${diffDays} days left`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-25 to-emerald-25" style={{
      background: 'linear-gradient(to bottom, #f0f9ff, #ecfdf5)'
    }}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl text-gray-900 mb-2">
            Hi {studentData.name}! 👋
          </h1>
          <p className="text-gray-600">Ready to practice your pronunciation?</p>
        </div>

        {/* Progress Overview */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-sky-600" />
                </div>
                <div className="text-2xl text-gray-900 mb-1">
                  {studentData.totalPoints}
                </div>
                <div className="text-sm text-gray-600">Points Earned</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-2xl text-gray-900 mb-1">
                  {studentData.streak}
                </div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">Today's Progress</span>
                <span className="text-sm text-gray-900">
                  {studentData.todaysWords}/10 words
                </span>
              </div>
              <Progress value={(studentData.todaysWords / 10) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        <div className="flex bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-lg">
          <button
            onClick={() => setActiveTab('practice')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all ${
              activeTab === 'practice'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Type className="w-5 h-5" />
            <span>Free Practice</span>
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all ${
              activeTab === 'assignments'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>My Tasks</span>
            {pendingWords.length > 0 && (
              <Badge className="bg-red-500 text-white text-xs ml-1">
                {pendingWords.length}
              </Badge>
            )}
          </button>
        </div>

        {activeTab === 'practice' ? (
          <>
            {/* Custom Word Practice */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                  <Type className="w-5 h-5 mr-2 text-blue-500" />
                  Practice Any Word
                </h3>
                <div className="flex space-x-3">
                  <Input
                    placeholder="Type any word to practice..."
                    value={customWord}
                    onChange={(e) => setCustomWord(e.target.value)}
                    className="flex-1 bg-gray-50 border-gray-200 rounded-xl"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handlePlayCustomWord();
                      }
                    }}
                  />
                  <Button
                    onClick={handlePlayCustomWord}
                    disabled={!customWord.trim() || isPlayingTTS}
                    className={`px-6 rounded-xl ${
                      isPlayingTTS 
                        ? 'bg-amber-400 hover:bg-amber-500' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                    } text-white transition-all duration-300`}
                  >
                    <Play className={`w-4 h-4 ${isPlayingTTS ? 'animate-pulse' : ''}`} />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Type any word and tap play to hear pronunciation
                </p>
              </CardContent>
            </Card>

            {/* Big Practice Button */}
            <div className="text-center">
              <Button 
                onClick={() => {
                  setCurrentWord(customWord || 'wonderful');
                  setPracticeSource('custom');
                  setShowPracticeModal(true);
                }}
                className="w-48 h-48 rounded-full bg-gradient-to-br from-sky-400 to-emerald-400 hover:from-sky-500 hover:to-emerald-500 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <div className="text-center">
                  <Mic className="w-16 h-16 mx-auto mb-2" />
                  <div className="text-lg">Practice</div>
                  <div className="text-sm opacity-90">Tap to start</div>
                </div>
              </Button>
            </div>

            {/* Recent Activity */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                  <Smile className="w-5 h-5 mr-2 text-amber-500" />
                  Recent Words
                </h3>
                <div className="space-y-3">
                  {recentWords.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{item.emoji}</span>
                        <div>
                          <div className="font-medium text-gray-900 capitalize">
                            {item.word}
                          </div>
                          <div className="text-xs text-gray-500">Great job!</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <Badge className="bg-emerald-100 text-emerald-800 border-0">
                          {item.score}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Assignment Tasks */}
            {pendingWords.length > 0 && (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-red-500" />
                    <span>Pending Tasks</span>
                    <Badge className="bg-red-100 text-red-800 border-0">
                      {pendingWords.length} words
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pendingWords.map((word) => (
                    <div key={word.id} className="p-4 border border-gray-200 rounded-xl bg-white">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900 text-lg capitalize">
                            {word.word}
                          </h4>
                          <p className="text-sm text-gray-600">{word.assignmentTitle}</p>
                          <p className="text-xs text-gray-500">by {word.teacherName}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={`${getPriorityColor(word.priority)} border-0 mb-1`}>
                            {word.priority}
                          </Badge>
                          <p className="text-xs text-gray-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {getDaysUntilDue(word.dueDate)}
                          </p>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => startAssignmentPractice(word)}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        <Mic className="w-4 h-4 mr-2" />
                        Practice This Word
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Completed Tasks */}
            {completedWords.length > 0 && (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-green-500" />
                    <span>Completed Tasks</span>
                    <Badge className="bg-green-100 text-green-800 border-0">
                      {completedWords.length} done
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {completedWords.map((word) => (
                    <div key={word.id} className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="font-medium text-gray-900 capitalize">
                            {word.word}
                          </div>
                          <div className="text-xs text-gray-500">{word.assignmentTitle}</div>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-0">
                        {word.score}/100
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {pendingWords.length === 0 && (
              <Alert>
                <Info className="w-4 h-4" />
                <AlertDescription>
                  Great job! You've completed all your assigned pronunciation tasks. 
                  Check back later for new assignments from your teacher.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}

        {/* Level Badge */}
        <div className="text-center">
          <Badge className="bg-amber-100 text-amber-800 px-4 py-2 text-sm border-0">
            🏆 {studentData.level} Level
          </Badge>
        </div>
      </div>

      {/* Practice Modal */}
      <Dialog open={showPracticeModal} onOpenChange={handleClosePractice}>
        <DialogContent className="w-[340px] rounded-3xl border-0 shadow-2xl bg-white">
          <DialogHeader className="text-center pb-2">
            <DialogTitle className="text-2xl text-gray-900">
              {practiceSource === 'assignment' ? 'Assignment Practice' : 'Practice Time'}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              {practiceSource === 'assignment' && selectedAssignment ? (
                <div className="space-y-1">
                  <p>From: {selectedAssignment.assignmentTitle}</p>
                  <p className="text-xs">Teacher: {selectedAssignment.teacherName}</p>
                </div>
              ) : (
                'Say the word clearly when you\'re ready'
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-8 text-center">
            {!showResult ? (
              <>
                <div className="w-20 h-20 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Volume2 className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-4xl text-gray-900 mb-3 capitalize">
                  {currentWord}
                </h3>
                
                <p className="text-gray-600 mb-8 px-4">
                  Say the word clearly and confidently
                </p>

                <Button
                  onClick={handleStartRecording}
                  disabled={isRecording}
                  className={`w-24 h-24 rounded-full border-0 shadow-xl ${
                    isRecording 
                      ? 'bg-red-400 hover:bg-red-500 animate-pulse scale-110' 
                      : 'bg-gradient-to-br from-sky-400 to-emerald-400 hover:from-sky-500 hover:to-emerald-500 hover:scale-105'
                  } text-white transition-all duration-300`}
                >
                  <Mic className="w-10 h-10" />
                </Button>
                
                {isRecording && (
                  <p className="text-red-500 mt-6 animate-pulse">
                    Listening... 🎤
                  </p>
                )}
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <CheckCircle className="w-12 h-12 text-emerald-600" />
                </div>
                
                <h3 className="text-2xl text-gray-900 mb-3">
                  {practiceSource === 'assignment' ? 'Task Complete! 🎉' : 'Amazing! 🎉'}
                </h3>
                
                <div className="text-4xl text-emerald-600 mb-4">
                  {result?.score}/100
                </div>
                
                {result?.feedback && (
                  <p className="text-gray-600 mb-8 px-4">
                    {result.feedback}
                  </p>
                )}
                
                {practiceSource === 'assignment' && (
                  <div className="mb-6 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      ✅ Assignment task completed successfully!
                    </p>
                  </div>
                )}
                
                <div className="flex space-x-4">
                  <Button
                    onClick={handlePracticeAgain}
                    variant="outline"
                    className="flex-1 rounded-xl border-gray-200"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Again
                  </Button>
                  <Button
                    onClick={handleClosePractice}
                    className="flex-1 rounded-xl bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-500 hover:to-emerald-500 border-0"
                  >
                    Continue
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}