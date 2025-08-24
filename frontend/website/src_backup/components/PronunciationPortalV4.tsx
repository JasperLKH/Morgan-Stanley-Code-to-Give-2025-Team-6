import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
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
  Type
} from 'lucide-react';

export function PronunciationPortalV4() {
  const [showPracticeModal, setShowPracticeModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [currentWord] = useState('wonderful');
  const [result, setResult] = useState<any>(null);
  const [customWord, setCustomWord] = useState('');
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);

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

  const handleStartRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setShowResult(true);
      setResult({
        word: currentWord,
        score: Math.floor(Math.random() * 25) + 75,
        correct: true,
        feedback: 'Perfect! You nailed it! 🌟'
      });
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
  };

  const handlePlayCustomWord = () => {
    if (!customWord.trim()) return;
    
    setIsPlayingTTS(true);
    
    // Use Web Speech API for text-to-speech (existing TTS flow)
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
      // Fallback: just toggle the playing state
      setTimeout(() => {
        setIsPlayingTTS(false);
      }, 1000);
    }
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
            onClick={() => setShowPracticeModal(true)}
            className="w-48 h-48 rounded-full bg-gradient-to-br from-sky-400 to-emerald-400 hover:from-sky-500 hover:to-emerald-500 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <div className="text-center">
              <Mic className="w-16 h-16 mx-auto mb-2" />
              <div className="text-lg font-medium">Practice</div>
              <div className="text-sm opacity-90">Tap to start</div>
            </div>
          </Button>
        </div>

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

      {/* Clean Practice Modal */}
      <Dialog open={showPracticeModal} onOpenChange={handleClosePractice}>
        <DialogContent className="w-[340px] rounded-3xl border-0 shadow-2xl bg-white">
          <DialogHeader className="text-center pb-2">
            <DialogTitle className="text-2xl font-light text-gray-900">
              Practice Time
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              Say the word clearly when you're ready
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-8 text-center">
            {!showResult ? (
              <>
                <div className="w-20 h-20 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Volume2 className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-4xl font-light text-gray-900 mb-3 capitalize">
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
                  <p className="text-red-500 mt-6 font-medium animate-pulse">
                    Listening... 🎤
                  </p>
                )}
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <CheckCircle className="w-12 h-12 text-emerald-600" />
                </div>
                
                <h3 className="text-2xl font-light text-gray-900 mb-3">
                  Amazing! 🎉
                </h3>
                
                <div className="text-4xl font-light text-emerald-600 mb-4">
                  {result?.score}/100
                </div>
                
                {result?.feedback && (
                  <p className="text-gray-600 mb-8 px-4">
                    {result.feedback}
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