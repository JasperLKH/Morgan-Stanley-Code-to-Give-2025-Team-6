import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { 
  ArrowLeft, 
  Home, 
  Mic, 
  TrendingUp, 
  Calendar, 
  Star, 
  CheckCircle, 
  XCircle,
  Volume2,
  RotateCcw
} from 'lucide-react';

interface PronunciationResult {
  word: string;
  score: number;
  correct: boolean;
  feedback?: string;
}

export function PronunciationPortalV1() {
  const [showPracticeModal, setShowPracticeModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [currentWord] = useState('apple');
  const [result, setResult] = useState<PronunciationResult | null>(null);

  const childData = {
    name: 'Emma Chen',
    weeklyProgress: 85,
    totalWords: 156,
    streak: 7,
    accuracy: 78
  };

  const recentActivities = [
    {
      id: '1',
      word: 'butterfly',
      score: 95,
      timestamp: '2 hours ago',
      correct: true
    },
    {
      id: '2',
      word: 'rainbow',
      score: 72,
      timestamp: '5 hours ago',
      correct: true
    },
    {
      id: '3',
      word: 'elephant',
      score: 65,
      timestamp: '1 day ago',
      correct: false
    },
    {
      id: '4',
      word: 'sunshine',
      score: 88,
      timestamp: '1 day ago',
      correct: true
    }
  ];

  const handleStartRecording = () => {
    setIsRecording(true);
    // Simulate recording for 3 seconds
    setTimeout(() => {
      setIsRecording(false);
      setShowResult(true);
      setResult({
        word: currentWord,
        score: Math.floor(Math.random() * 30) + 70, // Random score 70-100
        correct: Math.random() > 0.3, // 70% success rate
        feedback: 'Great pronunciation! Try to emphasize the "a" sound a bit more.'
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Top Navigation */}
      <div className="bg-white shadow-sm border-b border-blue-100">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="text-blue-600">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-medium text-sm">R</span>
              </div>
              <span className="font-medium text-gray-900">REACH</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-blue-600">
            <Home className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Welcome Section */}
        <div className="text-center py-2">
          <h1 className="text-2xl font-medium text-gray-900 mb-1">
            {childData.name}'s Pronunciation
          </h1>
          <p className="text-gray-600">Keep practicing to improve your speaking skills!</p>
        </div>

        {/* Progress Overview Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-medium text-blue-900 mb-1">
                {childData.weeklyProgress}%
              </div>
              <div className="text-xs text-blue-700">Weekly Progress</div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-medium text-green-900 mb-1">
                {childData.totalWords}
              </div>
              <div className="text-xs text-green-700">Words Learned</div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-medium text-orange-900 mb-1">
                {childData.streak}
              </div>
              <div className="text-xs text-orange-700">Day Streak</div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-medium text-yellow-900 mb-1">
                {childData.accuracy}%
              </div>
              <div className="text-xs text-yellow-700">Accuracy Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Button */}
        <Card className="border-2 border-dashed border-blue-300 bg-blue-50/50">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mic className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Ready to Practice?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Let's work on pronunciation together!
            </p>
            <Button 
              onClick={() => setShowPracticeModal(true)}
              className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-8 py-2"
            >
              Start Pronunciation Practice
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Volume2 className="w-5 h-5 text-blue-600" />
              <span>Recent Practice</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.correct ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {activity.correct ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 capitalize">
                      {activity.word}
                    </div>
                    <div className="text-xs text-gray-500">
                      {activity.timestamp}
                    </div>
                  </div>
                </div>
                <Badge 
                  variant="secondary" 
                  className={`${
                    activity.score >= 80 ? 'bg-green-100 text-green-800' :
                    activity.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}
                >
                  {activity.score}/100
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Pronunciation Practice Modal */}
      <Dialog open={showPracticeModal} onOpenChange={handleClosePractice}>
        <DialogContent className="w-[350px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-medium text-gray-900">
              Pronunciation Practice
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              Practice pronouncing the word clearly and accurately
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6 text-center">
            {!showResult ? (
              <>
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Volume2 className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-2xl font-medium text-gray-900 mb-2 capitalize">
                  {currentWord}
                </h3>
                
                <p className="text-gray-600 mb-8">
                  Say the word aloud when you're ready
                </p>

                <Button
                  onClick={handleStartRecording}
                  disabled={isRecording}
                  className={`w-24 h-24 rounded-full ${
                    isRecording 
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                      : 'bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600'
                  } text-white transition-all duration-300`}
                >
                  <Mic className="w-10 h-10" />
                </Button>
                
                {isRecording && (
                  <p className="text-red-600 mt-4 font-medium animate-pulse">
                    Recording... Speak now!
                  </p>
                )}
              </>
            ) : (
              <>
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                  result?.correct ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {result?.correct ? (
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  ) : (
                    <XCircle className="w-12 h-12 text-red-600" />
                  )}
                </div>
                
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {result?.correct ? 'Great Job!' : 'Keep Practicing!'}
                </h3>
                
                <div className="text-3xl font-medium mb-4">
                  <span className={result?.correct ? 'text-green-600' : 'text-red-600'}>
                    {result?.score}/100
                  </span>
                </div>
                
                {result?.feedback && (
                  <p className="text-gray-600 mb-6 text-sm">
                    {result.feedback}
                  </p>
                )}
                
                <div className="flex space-x-3">
                  <Button
                    onClick={handlePracticeAgain}
                    variant="outline"
                    className="flex-1"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                  <Button
                    onClick={handleClosePractice}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
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