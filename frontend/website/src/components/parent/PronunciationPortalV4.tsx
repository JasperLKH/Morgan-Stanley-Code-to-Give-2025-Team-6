import React, { useState, useRef } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Separator } from '../ui/separator';
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
  Target,
  Clock,
  Award,
  Info,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AssignedWord {
  id: string;
  word: string;
  pronunciation: string;
  meaning: string;
  example: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  attempts: number;
  lastAttempt?: string;
  score?: number;
}

interface Assignment {
  id: string;
  title: string;
  teacherName: string;
  dueDate: string;
  words: AssignedWord[];
  totalWords: number;
  completedWords: number;
  status: 'active' | 'completed' | 'overdue';
}

export function PronunciationPortalV4() {
  const [showPracticeModal, setShowPracticeModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [currentWord, setCurrentWord] = useState('wonderful');
  const [result, setResult] = useState<any>(null);
  const [customWord, setCustomWord] = useState('');
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [isAnalyzingPronunciation, setIsAnalyzingPronunciation] = useState(false);
  const [selectedAssignmentWord, setSelectedAssignmentWord] = useState<AssignedWord | null>(null);
  const [practiceMode, setPracticeMode] = useState<'free' | 'assignment'>('free');
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  // Mock data for teacher assignments
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Weekly Vocabulary Practice',
      teacherName: 'Ms. Johnson',
      dueDate: '2024-08-30',
      totalWords: 8,
      completedWords: 3,
      status: 'active',
      words: [
        {
          id: '1',
          word: 'apple',
          pronunciation: '/ˈæpəl/',
          meaning: 'A round fruit with red or green skin',
          example: 'I eat an apple every day.',
          difficulty: 'easy',
          completed: true,
          attempts: 2,
          lastAttempt: '2024-08-25',
          score: 85
        },
        {
          id: '2',
          word: 'beautiful',
          pronunciation: '/ˈbjuːtɪfəl/',
          meaning: 'Pleasing to look at; attractive',
          example: 'The sunset is beautiful tonight.',
          difficulty: 'medium',
          completed: true,
          attempts: 3,
          lastAttempt: '2024-08-25',
          score: 92
        },
        {
          id: '3',
          word: 'playground',
          pronunciation: '/ˈpleɪɡraʊnd/',
          meaning: 'An area designed for children to play',
          example: 'Children play at the playground.',
          difficulty: 'easy',
          completed: true,
          attempts: 1,
          lastAttempt: '2024-08-24',
          score: 78
        },
        {
          id: '4',
          word: 'butterfly',
          pronunciation: '/ˈbʌtərflaɪ/',
          meaning: 'A flying insect with colorful wings',
          example: 'The butterfly has pretty wings.',
          difficulty: 'medium',
          completed: false,
          attempts: 1,
          score: 65
        },
        {
          id: '5',
          word: 'umbrella',
          pronunciation: '/ʌmˈbrelə/',
          meaning: 'A device used to protect from rain',
          example: 'Use an umbrella when it rains.',
          difficulty: 'medium',
          completed: false,
          attempts: 0
        },
        {
          id: '6',
          word: 'rainbow',
          pronunciation: '/ˈreɪnboʊ/',
          meaning: 'An arc of colors in the sky',
          example: 'Look at the rainbow after the rain.',
          difficulty: 'easy',
          completed: false,
          attempts: 0
        },
        {
          id: '7',
          word: 'adventure',
          pronunciation: '/ədˈventʃər/',
          meaning: 'An exciting or remarkable experience',
          example: 'Reading is a great adventure.',
          difficulty: 'hard',
          completed: false,
          attempts: 0
        },
        {
          id: '8',
          word: 'elephant',
          pronunciation: '/ˈeləfənt/',
          meaning: 'A large African or Asian mammal',
          example: 'The elephant is very big.',
          difficulty: 'medium',
          completed: false,
          attempts: 0
        }
      ]
    }
  ]);

  const childData = {
    name: 'Emma',
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

  // Enhanced ASR functionality with pronunciation grading
  const startRecordingWithASR = async (wordToRecord?: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        analyzePronunciationWithASR(wordToRecord || currentWord);
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      toast.error('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  // Enhanced pronunciation analysis with more detailed feedback
  const analyzePronunciationWithASR = (targetWord: string) => {
    setIsAnalyzingPronunciation(true);
    
    // Simulate advanced ASR analysis
    setTimeout(() => {
      const accuracy = Math.floor(Math.random() * 30) + 70; // 70-100%
      const phonemeAccuracy = Math.floor(Math.random() * 25) + 75;
      const fluency = Math.floor(Math.random() * 20) + 80;
      
      let feedback = '';
      let recommendation = '';
      
      if (accuracy >= 90) {
        feedback = `Excellent pronunciation! "${targetWord}" - ${accuracy}% accurate 🌟`;
        recommendation = 'Perfect! Your pronunciation is spot on!';
      } else if (accuracy >= 80) {
        feedback = `Great job! "${targetWord}" - ${accuracy}% accurate 👏`;
        recommendation = 'Very good! Keep practicing for even better results.';
      } else if (accuracy >= 70) {
        feedback = `Good attempt! "${targetWord}" - ${accuracy}% accurate 📚`;
        recommendation = 'Listen to the example and focus on the stressed syllables.';
      } else {
        feedback = `Keep practicing! "${targetWord}" - ${accuracy}% accurate 💪`;
        recommendation = 'Try speaking more slowly and clearly. You can do it!';
      }

      const detailedResult = {
        word: targetWord,
        score: accuracy,
        phonemeScore: phonemeAccuracy,
        fluencyScore: fluency,
        correct: accuracy >= 75,
        feedback: feedback,
        recommendation: recommendation,
        breakdown: {
          clarity: Math.floor(Math.random() * 20) + 80,
          timing: Math.floor(Math.random() * 15) + 85,
          intonation: Math.floor(Math.random() * 25) + 75
        }
      };

      setResult(detailedResult);
      setIsAnalyzingPronunciation(false);
      setShowResult(true);

      // Update assignment progress if practicing assigned word
      if (selectedAssignmentWord && practiceMode === 'assignment') {
        markWordAsCompleted(selectedAssignmentWord.id, accuracy);
      }
    }, 2800);
  };

  const markWordAsCompleted = (wordId: string, score: number) => {
    setAssignments(prev => prev.map(assignment => ({
      ...assignment,
      words: assignment.words.map(word => 
        word.id === wordId 
          ? { 
              ...word, 
              completed: score >= 75, 
              attempts: word.attempts + 1,
              score: score,
              lastAttempt: new Date().toISOString().split('T')[0]
            }
          : word
      ),
      completedWords: assignment.words.filter(w => 
        w.id === wordId ? score >= 75 : w.completed
      ).length
    })));
  };

  const handleStartRecording = () => {
    if (practiceMode === 'assignment' && selectedAssignmentWord) {
      startRecordingWithASR(selectedAssignmentWord.word);
    } else {
      startRecordingWithASR(currentWord);
    }
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
    setSelectedAssignmentWord(null);
    setPracticeMode('free');
  };

  // Enhanced TTS with better pronunciation
  const handlePlayCustomWord = () => {
    if (!customWord.trim()) return;
    
    setIsPlayingTTS(true);
    
    // Use Web Speech API for text-to-speech with enhanced settings
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(customWord.trim());
      utterance.rate = 0.7; // Slower for better pronunciation learning
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.lang = 'en-US';
      
      utterance.onend = () => {
        setIsPlayingTTS(false);
      };
      
      utterance.onerror = () => {
        setIsPlayingTTS(false);
        toast.error('Unable to play audio. Please try again.');
      };
      
      speechSynthesis.speak(utterance);
      toast.success(`Playing pronunciation: ${customWord.trim()}`);
    } else {
      setTimeout(() => {
        setIsPlayingTTS(false);
        toast.error('Text-to-speech not supported on this device.');
      }, 1000);
    }
  };

  const handlePlayAssignmentWord = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.7;
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
      toast.success(`Playing: ${word}`);
    }
  };

  const handlePracticeAssignmentWord = (word: AssignedWord) => {
    setSelectedAssignmentWord(word);
    setPracticeMode('assignment');
    setCurrentWord(word.word);
    setShowPracticeModal(true);
  };

  const getDifficultyColor = (difficulty: AssignedWord['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-25 to-emerald-25" style={{
      background: 'linear-gradient(to bottom, #f0f9ff, #ecfdf5)'
    }}>

      <div className="p-6 space-y-8">
        {/* Simple Welcome */}
        <div className="text-center">
          <h1 className="text-3xl font-light text-gray-900 mb-2">
            Hi {childData.name}! 👋
          </h1>
          <p className="text-gray-600">Ready to practice your pronunciation?</p>
        </div>

        {/* Clean Progress Overview */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-sky-600" />
                </div>
                <div className="text-2xl font-light text-gray-900 mb-1">
                  {childData.totalPoints}
                </div>
                <div className="text-sm text-gray-600">Points Earned</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-2xl font-light text-gray-900 mb-1">
                  {childData.streak}
                </div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">Today's Progress</span>
                <span className="text-sm font-medium text-gray-900">
                  {childData.todaysWords}/10 words
                </span>
              </div>
              <Progress value={(childData.todaysWords / 10) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

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
              setPracticeMode('free');
              setShowPracticeModal(true);
            }}
            className="w-48 h-48 rounded-full bg-gradient-to-br from-sky-400 to-emerald-400 hover:from-sky-500 hover:to-emerald-500 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <div className="text-center">
              <Mic className="w-16 h-16 mx-auto mb-2" />
              <div className="text-lg font-medium">Practice</div>
              <div className="text-sm opacity-90">Tap to start</div>
            </div>
          </Button>
        </div>

        {/* Teacher Assignments Section */}
        {assignments.length > 0 && (
          <>
            <Separator className="my-8" />
            
            <div className="space-y-6">
              <h2 className="text-2xl font-light text-gray-900 flex items-center">
                <BookOpen className="w-6 h-6 mr-3 text-blue-500" />
                Teacher Assignments
              </h2>
              
              {assignments.map((assignment) => (
                <Card key={assignment.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium text-gray-900 text-lg">{assignment.title}</h3>
                        <p className="text-sm text-gray-600">Teacher: {assignment.teacherName}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={`${
                          assignment.status === 'active' ? 'bg-blue-100 text-blue-800' : 
                          assignment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'
                        } border-0`}>
                          {assignment.status}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {getDaysRemaining(assignment.dueDate)} days left
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-medium text-gray-900">
                          {assignment.completedWords}/{assignment.totalWords} words
                        </span>
                      </div>
                      <Progress value={(assignment.completedWords / assignment.totalWords) * 100} className="h-2" />
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {assignment.words.map((word) => (
                        <div 
                          key={word.id}
                          className={`p-4 rounded-xl transition-all hover:shadow-sm ${
                            word.completed ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-medium text-gray-900 capitalize">{word.word}</h4>
                                <Badge className={`${getDifficultyColor(word.difficulty)} border-0 text-xs`}>
                                  {word.difficulty}
                                </Badge>
                                {word.completed && (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-1">{word.pronunciation}</p>
                              <p className="text-xs text-gray-500">{word.meaning}</p>
                              
                              {word.score && (
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge className="bg-emerald-100 text-emerald-800 border-0 text-xs">
                                    Score: {word.score}%
                                  </Badge>
                                  <span className="text-xs text-gray-500">
                                    Attempts: {word.attempts}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePlayAssignmentWord(word.word)}
                                className="rounded-lg"
                              >
                                <Volume2 className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => handlePracticeAssignmentWord(word)}
                                size="sm"
                                className="bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-500 hover:to-emerald-500 text-white border-0 rounded-lg"
                              >
                                <Mic className="w-4 h-4 mr-1" />
                                Practice
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Simple Recent Activity */}
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

        {/* Level Badge */}
        <div className="text-center">
          <Badge className="bg-amber-100 text-amber-800 px-4 py-2 text-sm border-0">
            🏆 {childData.level} Level
          </Badge>
        </div>
      </div>

      {/* Enhanced Practice Modal with ASR feedback */}
      <Dialog open={showPracticeModal} onOpenChange={handleClosePractice}>
        <DialogContent className="w-[340px] rounded-3xl border-0 shadow-2xl bg-white">
          <DialogHeader className="text-center pb-2">
            <DialogTitle className="text-2xl font-light text-gray-900">
              {practiceMode === 'assignment' && selectedAssignmentWord ? 'Assignment Practice' : 'Practice Time'}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              {practiceMode === 'assignment' && selectedAssignmentWord 
                ? `Practice saying "${selectedAssignmentWord.word}" clearly`
                : 'Say the word clearly when you\'re ready'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-8 text-center">
            {!showResult && !isAnalyzingPronunciation ? (
              <>
                <div className="w-20 h-20 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Volume2 className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-4xl font-light text-gray-900 mb-3 capitalize">
                  {practiceMode === 'assignment' && selectedAssignmentWord ? selectedAssignmentWord.word : currentWord}
                </h3>

                {practiceMode === 'assignment' && selectedAssignmentWord && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">{selectedAssignmentWord.pronunciation}</p>
                    <p className="text-xs text-gray-500">{selectedAssignmentWord.meaning}</p>
                  </div>
                )}
                
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
                  <p className="text-red-500 mt-6 font-medium animate-pulse">
                    Listening... 🎤
                  </p>
                )}
              </>
            ) : isAnalyzingPronunciation ? (
              <>
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Target className="w-12 h-12 text-amber-600 animate-spin" />
                </div>
                
                <h3 className="text-2xl font-light text-gray-900 mb-3">
                  Analyzing... 🤔
                </h3>
                
                <p className="text-gray-600 mb-4 px-4">
                  Checking your pronunciation with AI
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="text-xs text-gray-500">Processing audio...</div>
                  <Progress value={66} className="h-1" />
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <CheckCircle className="w-12 h-12 text-emerald-600" />
                </div>
                
                <h3 className="text-2xl font-light text-gray-900 mb-3">
                  {result?.score >= 90 ? 'Amazing! 🎉' : result?.score >= 80 ? 'Great job! 👏' : 'Good try! 📚'}
                </h3>
                
                <div className="text-4xl font-light text-emerald-600 mb-4">
                  {result?.score}/100
                </div>

                {result?.breakdown && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg text-left">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Detailed Analysis:</h4>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex justify-between">
                        <span>Clarity:</span>
                        <span>{result.breakdown.clarity}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Timing:</span>
                        <span>{result.breakdown.timing}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Intonation:</span>
                        <span>{result.breakdown.intonation}%</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {result?.recommendation && (
                  <p className="text-gray-600 mb-8 px-4 text-sm">
                    {result.recommendation}
                  </p>
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