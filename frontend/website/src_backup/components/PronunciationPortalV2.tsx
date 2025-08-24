import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { 
  ArrowLeft, 
  Home, 
  Mic, 
  TrendingUp, 
  Clock, 
  Star, 
  CheckCircle, 
  XCircle,
  Volume2,
  RotateCcw,
  Trophy,
  Target
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'practice' | 'achievement' | 'feedback';
  word?: string;
  score?: number;
  correct?: boolean;
  message: string;
  timestamp: string;
  icon: React.ReactNode;
}

export function PronunciationPortalV2() {
  const [showPracticeModal, setShowPracticeModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [currentWord] = useState('butterfly');
  const [result, setResult] = useState<any>(null);

  const childData = {
    name: 'Emma Chen',
    todayProgress: 75,
    weeklyGoal: 50,
    weeklyCompleted: 38,
    currentStreak: 7,
    bestScore: 96
  };

  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'practice',
      word: 'rainbow',
      score: 92,
      correct: true,
      message: 'Excellent pronunciation of "rainbow"!',
      timestamp: '2 hours ago',
      icon: <CheckCircle className="w-5 h-5 text-green-600" />
    },
    {
      id: '2',
      type: 'achievement',
      message: '7-day streak achieved! 🎉',
      timestamp: '3 hours ago',
      icon: <Trophy className="w-5 h-5 text-yellow-600" />
    },
    {
      id: '3',
      type: 'practice',
      word: 'elephant',
      score: 68,
      correct: false,
      message: 'Keep practicing "elephant" - focus on the "ph" sound',
      timestamp: '5 hours ago',
      icon: <XCircle className="w-5 h-5 text-orange-600" />
    },
    {
      id: '4',
      type: 'feedback',
      message: 'Teacher feedback: Emma is improving her vowel sounds!',
      timestamp: '1 day ago',
      icon: <Star className="w-5 h-5 text-blue-600" />
    },
    {
      id: '5',
      type: 'practice',
      word: 'sunshine',
      score: 85,
      correct: true,
      message: 'Good work on "sunshine"!',
      timestamp: '1 day ago',
      icon: <CheckCircle className="w-5 h-5 text-green-600" />
    }
  ];

  const handleStartRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setShowResult(true);
      setResult({
        word: currentWord,
        score: Math.floor(Math.random() * 30) + 70,
        correct: Math.random() > 0.3,
        feedback: 'Great job! Your pronunciation is getting clearer.'
      });
    }, 3000);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
      {/* Top Navigation */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="text-slate-600">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-medium text-sm">R</span>
              </div>
              <span className="font-medium text-slate-900">REACH Pronunciation</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-slate-600">
            <Home className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Header with Child Name */}
        <div className="text-center py-2">
          <h1 className="text-xl font-medium text-slate-900">
            {childData.name}'s Progress
          </h1>
          <p className="text-slate-600 text-sm">Track your pronunciation journey</p>
        </div>

        {/* Today's Progress */}
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-teal-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-slate-900">Today's Progress</span>
              </div>
              <span className="text-2xl font-medium text-blue-900">
                {childData.todayProgress}%
              </span>
            </div>
            <Progress value={childData.todayProgress} className="h-3 mb-2" />
            <p className="text-xs text-slate-600">
              {Math.round(childData.todayProgress / 10)} practices completed today
            </p>
          </CardContent>
        </Card>

        {/* Weekly Goal */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-medium text-green-900 mb-1">
                {childData.weeklyCompleted}/{childData.weeklyGoal}
              </div>
              <div className="text-xs text-green-700">Weekly Goal</div>
              <Progress value={(childData.weeklyCompleted / childData.weeklyGoal) * 100} className="h-2 mt-2" />
            </CardContent>
          </Card>
          
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-medium text-orange-900 mb-1">
                {childData.bestScore}
              </div>
              <div className="text-xs text-orange-700">Best Score</div>
              <div className="flex items-center justify-center mt-1">
                <Star className="w-3 h-3 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Practice Button */}
        <Button 
          onClick={() => setShowPracticeModal(true)}
          className="w-full h-16 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white rounded-xl"
        >
          <Mic className="w-6 h-6 mr-3" />
          <div className="text-left">
            <div className="font-medium">Practice Pronunciation</div>
            <div className="text-xs opacity-90">Ready for today's word?</div>
          </div>
        </Button>

        {/* Activity Timeline */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Clock className="w-5 h-5 text-slate-600" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="mt-1">
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-900 font-medium">
                          {activity.message}
                        </p>
                        {activity.score && (
                          <Badge 
                            variant="secondary"
                            className={`text-xs ${
                              activity.score >= 80 ? 'bg-green-100 text-green-800' :
                              activity.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}
                          >
                            {activity.score}/100
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {activity.timestamp}
                      </p>
                      {activity.word && (
                        <div className="mt-2 inline-flex items-center px-2 py-1 bg-slate-100 rounded text-xs">
                          <Volume2 className="w-3 h-3 mr-1 text-slate-600" />
                          {activity.word}
                        </div>
                      )}
                    </div>
                    {index < activities.length - 1 && (
                      <div className="absolute left-6 mt-8 w-px h-6 bg-slate-200" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Pronunciation Practice Modal */}
      <Dialog open={showPracticeModal} onOpenChange={handleClosePractice}>
        <DialogContent className="w-[350px] rounded-2xl bg-gradient-to-b from-white to-blue-50">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-medium text-slate-900">
              Practice Time!
            </DialogTitle>
            <DialogDescription className="text-center text-slate-600">
              Pronounce the word clearly when you're ready to record
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6 text-center">
            {!showResult ? (
              <>
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Volume2 className="w-12 h-12 text-white" />
                </div>
                
                <h3 className="text-3xl font-medium text-slate-900 mb-2 capitalize">
                  {currentWord}
                </h3>
                
                <p className="text-slate-600 mb-8">
                  Say the word aloud clearly
                </p>

                <Button
                  onClick={handleStartRecording}
                  disabled={isRecording}
                  className={`w-28 h-28 rounded-full shadow-lg ${
                    isRecording 
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                      : 'bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600'
                  } text-white transition-all duration-300`}
                >
                  <Mic className="w-12 h-12" />
                </Button>
                
                {isRecording && (
                  <>
                    <p className="text-red-600 mt-4 font-medium animate-pulse">
                      Listening...
                    </p>
                    <div className="flex justify-center mt-2">
                      <div className="flex space-x-1">
                        {[...Array(3)].map((_, i) => (
                          <div 
                            key={i}
                            className="w-2 h-8 bg-red-400 rounded animate-bounce"
                            style={{ animationDelay: `${i * 0.1}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg ${
                  result?.correct ? 'bg-green-100' : 'bg-orange-100'
                }`}>
                  {result?.correct ? (
                    <CheckCircle className="w-16 h-16 text-green-600" />
                  ) : (
                    <TrendingUp className="w-16 h-16 text-orange-600" />
                  )}
                </div>
                
                <h3 className="text-xl font-medium text-slate-900 mb-2">
                  {result?.correct ? 'Excellent!' : 'Good Try!'}
                </h3>
                
                <div className="text-4xl font-medium mb-4">
                  <span className={result?.correct ? 'text-green-600' : 'text-orange-600'}>
                    {result?.score}/100
                  </span>
                </div>
                
                {result?.feedback && (
                  <p className="text-slate-600 mb-6 text-sm px-4">
                    {result.feedback}
                  </p>
                )}
                
                <div className="flex space-x-3">
                  <Button
                    onClick={handlePracticeAgain}
                    variant="outline"
                    className="flex-1 border-slate-300"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                  <Button
                    onClick={handleClosePractice}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
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