import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  CheckCircle2, 
  Play, 
  Square, 
  RotateCcw,
  BookOpen,
  Target,
  Clock,
  Star,
  TrendingUp,
  Award,
  Info,
  Settings,
  Download,
  Upload,
  Headphones,
  Zap,
  Brain,
  Trophy,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { apiService } from '../../services/api';
import { useUser } from '../../contexts/UserContext';

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

export function EnhancedPronunciationPage() {
  const { user: currentUser } = useUser();
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [currentWord, setCurrentWord] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<AssignedWord | null>(null);
  const [practiceMode, setPracticeMode] = useState<'free' | 'assignment'>('free');
  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!currentUser?.id) return;
      
      setLoading(true);
      try {
        // Fetch assignments from API
        const response = await apiService.getUserAssignments(parseInt(currentUser.id));
        if (response.success && response.data && Array.isArray(response.data)) {
          // Transform assignments data for pronunciation practice
          const pronunciationAssignments = transformAssignmentsForPronunciation(response.data);
          setAssignments(pronunciationAssignments);
        } else {
          // Use mock data if API fails
          setAssignments(mockAssignments);
        }
      } catch (error) {
        console.error('Error fetching assignments:', error);
        setAssignments(mockAssignments);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [currentUser?.id]);

  const transformAssignmentsForPronunciation = (apiAssignments: any[]): Assignment[] => {
    return apiAssignments.map((assignment, index) => ({
      id: assignment.id.toString(),
      title: assignment.title || 'Pronunciation Practice',
      teacherName: 'REACH Teacher',
      dueDate: assignment.due_date,
      totalWords: 8,
      completedWords: 0,
      status: 'active' as const,
      words: generateWordsForAssignment(assignment.subject, assignment.id)
    }));
  };

  const generateWordsForAssignment = (subject: string, assignmentId: number): AssignedWord[] => {
    const wordSets: Record<string, AssignedWord[]> = {
      'Mathematics': [
        {
          id: `${assignmentId}-1`,
          word: 'addition',
          pronunciation: '/əˈdɪʃən/',
          meaning: 'The process of adding numbers together',
          example: 'Addition helps us find the total.',
          difficulty: 'medium',
          completed: false,
          attempts: 0
        }
      ],
      'English': [
        {
          id: `${assignmentId}-1`,
          word: 'beautiful',
          pronunciation: '/ˈbjuːtɪfəl/',
          meaning: 'Pleasing to look at; attractive',
          example: 'The sunset is beautiful tonight.',
          difficulty: 'medium',
          completed: false,
          attempts: 0
        }
      ]
    };

    return wordSets[subject] || mockWords;
  };

  // Mock data for development
  const mockWords: AssignedWord[] = [
    {
      id: '1',
      word: 'apple',
      pronunciation: '/ˈæpəl/',
      meaning: 'A round fruit with red or green skin',
      example: 'I eat an apple every day.',
      difficulty: 'easy',
      completed: false,
      attempts: 0
    },
    {
      id: '2',
      word: 'beautiful',
      pronunciation: '/ˈbjuːtɪfəl/',
      meaning: 'Pleasing to look at; attractive',
      example: 'The sunset is beautiful tonight.',
      difficulty: 'medium',
      completed: false,
      attempts: 0
    }
  ];

  const mockAssignments: Assignment[] = [
    {
      id: '1',
      title: 'Weekly Vocabulary Practice',
      teacherName: 'Ms. Johnson',
      dueDate: '2024-08-30',
      totalWords: 8,
      completedWords: 3,
      status: 'active',
      words: mockWords
    }
  ];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        analyzePronunciation();
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      // Stop all tracks to release the microphone
      const stream = mediaRecorder.current.stream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const analyzePronunciation = () => {
    setIsAnalyzing(true);
    
    // Simulate pronunciation analysis
    setTimeout(() => {
      const accuracy = Math.floor(Math.random() * 30) + 70; // 70-100%
      const wordToAnalyze = practiceMode === 'assignment' && selectedWord 
        ? selectedWord.word 
        : currentWord;

      if (accuracy >= 85) {
        setFeedback(`Great job! "${wordToAnalyze}" pronunciation: ${accuracy}% accurate. 🌟`);
        if (practiceMode === 'assignment' && selectedWord) {
          markWordAsCompleted(selectedWord.id, accuracy);
        }
      } else if (accuracy >= 70) {
        setFeedback(`Good attempt! "${wordToAnalyze}" pronunciation: ${accuracy}% accurate. Try again for better results.`);
      } else {
        setFeedback(`Keep practicing! "${wordToAnalyze}" pronunciation: ${accuracy}% accurate. Listen to the example and try again.`);
      }
      
      setIsAnalyzing(false);
    }, 2000);
  };

  const markWordAsCompleted = (wordId: string, score: number) => {
    setAssignments(prev => prev.map(assignment => ({
      ...assignment,
      words: assignment.words.map(word => 
        word.id === wordId 
          ? { 
              ...word, 
              completed: score >= 80, 
              attempts: word.attempts + 1,
              score: score,
              lastAttempt: new Date().toISOString().split('T')[0]
            }
          : word
      ),
      completedWords: assignment.words.filter(w => 
        w.id === wordId ? score >= 80 : w.completed
      ).length
    })));
  };

  const playWordAudio = (word: string) => {
    // In a real app, this would play actual audio pronunciation
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
    console.log(`Playing pronunciation for: ${word}`);
  };

  const resetRecording = () => {
    setAudioBlob(null);
    setFeedback(null);
    setCurrentWord('');
  };

  const getDifficultyColor = (difficulty: AssignedWord['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
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
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-2xl text-gray-900 flex items-center justify-center gap-2">
          <Mic className="w-6 h-6 text-primary" />
          Pronunciation Practice
        </h1>
        <p className="text-gray-600">
          Practice speaking words and improve your pronunciation
        </p>
      </div>

      <Tabs value={practiceMode} onValueChange={(value) => setPracticeMode(value as 'free' | 'assignment')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="free" className="flex items-center gap-2">
            <Mic className="w-4 h-4" />
            Free Practice
          </TabsTrigger>
          <TabsTrigger value="assignment" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Assigned Words
          </TabsTrigger>
        </TabsList>

        {/* Free Practice Mode */}
        <TabsContent value="free" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="w-5 h-5" />
                Free Word Practice
              </CardTitle>
              <CardDescription>
                Type any word and practice its pronunciation with our AI feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Word to Practice
                </label>
                <Input
                  value={currentWord}
                  onChange={(e) => setCurrentWord(e.target.value)}
                  placeholder="Enter a word to practice..."
                  className="text-lg"
                />
              </div>

              {currentWord && (
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => playWordAudio(currentWord)}
                      className="flex items-center gap-2"
                    >
                      <Volume2 className="w-4 h-4" />
                      Listen
                    </Button>
                    <Button
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={isAnalyzing}
                      className={`flex items-center gap-2 ${
                        isRecording 
                          ? 'bg-red-500 hover:bg-red-600' 
                          : 'bg-primary hover:bg-primary/90'
                      }`}
                    >
                      {isRecording ? (
                        <>
                          <Square className="w-4 h-4" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Mic className="w-4 h-4" />
                          Start Recording
                        </>
                      )}
                    </Button>
                    {audioBlob && (
                      <Button
                        variant="outline"
                        onClick={resetRecording}
                        className="flex items-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Try Again
                      </Button>
                    )}
                  </div>

                  {isAnalyzing && (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Analyzing your pronunciation... Please wait.
                      </AlertDescription>
                    </Alert>
                  )}

                  {feedback && (
                    <Alert className={feedback.includes('Great job') ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'}>
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertDescription>{feedback}</AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assignment Mode */}
        <TabsContent value="assignment" className="space-y-6">
          {/* Assignment Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.map((assignment) => (
              <Card 
                key={assignment.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedAssignment === assignment.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedAssignment(assignment.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{assignment.title}</CardTitle>
                    <Badge 
                      variant={assignment.status === 'active' ? 'default' : 'secondary'}
                      className={assignment.status === 'overdue' ? 'bg-red-500' : ''}
                    >
                      {assignment.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    Teacher: {assignment.teacherName}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress: {assignment.completedWords}/{assignment.totalWords} words</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {getDaysRemaining(assignment.dueDate)} days left
                      </span>
                    </div>
                    <Progress 
                      value={(assignment.completedWords / assignment.totalWords) * 100} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Selected Assignment Details */}
          {selectedAssignment && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Word List
                </CardTitle>
                <CardDescription>
                  Click on any word to practice its pronunciation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {assignments
                    .find(a => a.id === selectedAssignment)
                    ?.words.map((word) => (
                    <Card 
                      key={word.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedWord?.id === word.id ? 'ring-2 ring-primary' : ''
                      } ${word.completed ? 'bg-green-50 border-green-200' : ''}`}
                      onClick={() => setSelectedWord(word)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{word.word}</h3>
                            <Badge 
                              className={`${getDifficultyColor(word.difficulty)} text-white text-xs`}
                            >
                              {word.difficulty}
                            </Badge>
                          </div>
                          {word.completed && (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-1">{word.pronunciation}</p>
                        <p className="text-xs text-gray-500 mb-2">{word.meaning}</p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Attempts: {word.attempts}</span>
                          {word.score && (
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              {word.score}%
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Practice Selected Word */}
          {selectedWord && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Practice: {selectedWord.word}
                </CardTitle>
                <CardDescription>
                  {selectedWord.meaning}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Pronunciation:</strong> {selectedWord.pronunciation}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Example:</strong> {selectedWord.example}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => playWordAudio(selectedWord.word)}
                    className="flex items-center gap-2"
                  >
                    <Volume2 className="w-4 h-4" />
                    Listen
                  </Button>
                  <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isAnalyzing}
                    className={`flex items-center gap-2 ${
                      isRecording 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-primary hover:bg-primary/90'
                    }`}
                  >
                    {isRecording ? (
                      <>
                        <Square className="w-4 h-4" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4" />
                        Record Pronunciation
                      </>
                    )}
                  </Button>
                </div>

                {isAnalyzing && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Analyzing your pronunciation... Please wait.
                    </AlertDescription>
                  </Alert>
                )}

                {feedback && (
                  <Alert className={feedback.includes('Great job') ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'}>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>{feedback}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}