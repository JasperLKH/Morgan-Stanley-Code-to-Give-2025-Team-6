import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { 
  ArrowLeft, 
  Home, 
  Mic, 
  TrendingUp, 
  BarChart3, 
  Star, 
  CheckCircle, 
  XCircle,
  Volume2,
  RotateCcw,
  Award,
  Calendar,
  Zap
} from 'lucide-react';

export function PronunciationPortalV3() {
  const [showPracticeModal, setShowPracticeModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [currentWord] = useState('beautiful');
  const [result, setResult] = useState<any>(null);

  const childData = {
    name: 'Emma Chen',
    overallScore: 82,
    weeklyImprovement: 12,
    streak: 9,
    wordsLearned: 203,
    accuracy: 85,
    practiceMinutes: 45
  };

  // Chart data
  const weeklyProgress = [
    { day: 'Mon', score: 72 },
    { day: 'Tue', score: 78 },
    { day: 'Wed', score: 75 },
    { day: 'Thu', score: 82 },
    { day: 'Fri', score: 88 },
    { day: 'Sat', score: 85 },
    { day: 'Sun', score: 89 }
  ];

  const categoryScores = [
    { category: 'Vowels', score: 88 },
    { category: 'Consonants', score: 85 },
    { category: 'Blends', score: 72 },
    { category: 'Silent Letters', score: 68 }
  ];

  const handleStartRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setShowResult(true);
      setResult({
        word: currentWord,
        score: Math.floor(Math.random() * 30) + 70,
        correct: Math.random() > 0.2,
        feedback: 'Wonderful! Your pronunciation of long vowels is improving.'
      });
    }, 3500);
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Top Navigation */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-indigo-100">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="text-indigo-600">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-medium text-sm">R</span>
              </div>
              <span className="font-medium text-gray-900">Analytics Dashboard</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-indigo-600">
            <Home className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Welcome Section */}
        <div className="text-center py-2">
          <h1 className="text-2xl font-medium text-gray-900 mb-1">
            {childData.name}'s Dashboard
          </h1>
          <p className="text-gray-600">Track your pronunciation mastery</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-indigo-100">
            <CardContent className="p-3 text-center">
              <Award className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
              <div className="text-xl font-medium text-indigo-900">
                {childData.overallScore}
              </div>
              <div className="text-xs text-indigo-700">Overall Score</div>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100">
            <CardContent className="p-3 text-center">
              <TrendingUp className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
              <div className="text-xl font-medium text-emerald-900">
                +{childData.weeklyImprovement}%
              </div>
              <div className="text-xs text-emerald-700">This Week</div>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100">
            <CardContent className="p-3 text-center">
              <Zap className="w-6 h-6 text-amber-600 mx-auto mb-2" />
              <div className="text-xl font-medium text-amber-900">
                {childData.streak}
              </div>
              <div className="text-xs text-amber-700">Day Streak</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-cyan-200 bg-cyan-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-4 h-4 text-cyan-600" />
                  <span className="text-sm font-medium text-gray-900">Words Learned</span>
                </div>
                <span className="text-lg font-medium text-cyan-900">
                  {childData.wordsLearned}
                </span>
              </div>
              <Progress value={85} className="h-2" />
            </CardContent>
          </Card>

          <Card className="border-rose-200 bg-rose-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-rose-600" />
                  <span className="text-sm font-medium text-gray-900">Practice Time</span>
                </div>
                <span className="text-lg font-medium text-rose-900">
                  {childData.practiceMinutes}m
                </span>
              </div>
              <Progress value={75} className="h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Practice Button */}
        <Card className="border-2 border-dashed border-indigo-300 bg-gradient-to-r from-indigo-50 to-cyan-50">
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Mic className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Daily Practice Session</h3>
            <p className="text-sm text-gray-600 mb-4">
              Ready to improve your pronunciation score?
            </p>
            <Button 
              onClick={() => setShowPracticeModal(true)}
              className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white px-8 py-3 rounded-xl"
            >
              Start Practice Session
            </Button>
          </CardContent>
        </Card>

        {/* Weekly Progress Chart */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <span>Weekly Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyProgress}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={12} />
                  <YAxis domain={[60, 100]} axisLine={false} tickLine={false} fontSize={12} />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#4f46e5" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#4f46e5' }}
                    activeDot={{ r: 6, fill: '#6366f1' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center">
              <Badge className="bg-green-100 text-green-800">
                +{childData.weeklyImprovement}% improvement this week
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Star className="w-5 h-5 text-amber-600" />
              <span>Category Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {categoryScores.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    {category.category}
                  </span>
                  <Badge 
                    variant="secondary"
                    className={`${
                      category.score >= 85 ? 'bg-green-100 text-green-800' :
                      category.score >= 75 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {category.score}%
                  </Badge>
                </div>
                <Progress value={category.score} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Pronunciation Practice Modal */}
      <Dialog open={showPracticeModal} onOpenChange={handleClosePractice}>
        <DialogContent className="w-[360px] rounded-2xl bg-gradient-to-b from-white to-indigo-50 border-indigo-200">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-medium text-gray-900">
              Pronunciation Analysis
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              Advanced analysis to help improve your pronunciation accuracy
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6 text-center">
            {!showResult ? (
              <>
                <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Volume2 className="w-12 h-12 text-white" />
                </div>
                
                <h3 className="text-3xl font-medium text-gray-900 mb-2 capitalize">
                  {currentWord}
                </h3>
                
                <p className="text-gray-600 mb-8">
                  Speak clearly for accurate analysis
                </p>

                <Button
                  onClick={handleStartRecording}
                  disabled={isRecording}
                  className={`w-32 h-32 rounded-full shadow-xl ${
                    isRecording 
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse scale-110' 
                      : 'bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 hover:scale-105'
                  } text-white transition-all duration-300`}
                >
                  <Mic className="w-14 h-14" />
                </Button>
                
                {isRecording && (
                  <>
                    <p className="text-red-600 mt-4 font-medium animate-pulse">
                      Analyzing pronunciation...
                    </p>
                    <div className="flex justify-center mt-3">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div 
                            key={i}
                            className="w-1 h-12 bg-red-400 rounded animate-pulse"
                            style={{ 
                              animationDelay: `${i * 0.1}s`,
                              height: `${20 + Math.random() * 28}px`
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl ${
                  result?.correct ? 'bg-emerald-100' : 'bg-amber-100'
                }`}>
                  {result?.correct ? (
                    <CheckCircle className="w-16 h-16 text-emerald-600" />
                  ) : (
                    <TrendingUp className="w-16 h-16 text-amber-600" />
                  )}
                </div>
                
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {result?.correct ? 'Outstanding!' : 'Great Progress!'}
                </h3>
                
                <div className="text-5xl font-medium mb-2">
                  <span className={result?.correct ? 'text-emerald-600' : 'text-amber-600'}>
                    {result?.score}
                  </span>
                  <span className="text-lg text-gray-500">/100</span>
                </div>

                <div className="flex justify-center mb-4">
                  <Progress value={result?.score} className="w-32 h-2" />
                </div>
                
                {result?.feedback && (
                  <p className="text-gray-600 mb-6 text-sm px-4">
                    {result.feedback}
                  </p>
                )}
                
                <div className="flex space-x-3">
                  <Button
                    onClick={handlePracticeAgain}
                    variant="outline"
                    className="flex-1 border-gray-300"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Practice Again
                  </Button>
                  <Button
                    onClick={handleClosePractice}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600"
                  >
                    View Analytics
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