import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useParentContext } from '../contexts/ParentContext';
import { 
  TrendingUp, 
  Star, 
  Award, 
  Target, 
  Book, 
  Calculator, 
  Palette, 
  MessageSquare,
  Calendar,
  Trophy,
  Heart,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';

interface SubjectProgress {
  subject: string;
  subjectZh: string;
  icon: any;
  progress: number;
  recentScore: number;
  target: number;
  color: string;
}

interface Achievement {
  id: string;
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  icon: any;
  date: string;
  points: number;
}

export function ChildProgressPage() {
  const { state, t } = useParentContext();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');

  const subjectProgress: SubjectProgress[] = [
    {
      subject: 'Reading',
      subjectZh: '閱讀',
      icon: Book,
      progress: 85,
      recentScore: 92,
      target: 90,
      color: 'from-blue-400 to-blue-600'
    },
    {
      subject: 'Mathematics',
      subjectZh: '數學',
      icon: Calculator,
      progress: 78,
      recentScore: 85,
      target: 80,
      color: 'from-emerald-400 to-emerald-600'
    },
    {
      subject: 'Art & Creativity',
      subjectZh: '藝術創作',
      icon: Palette,
      progress: 95,
      recentScore: 98,
      target: 85,
      color: 'from-purple-400 to-purple-600'
    },
    {
      subject: 'Communication',
      subjectZh: '溝通表達',
      icon: MessageSquare,
      progress: 88,
      recentScore: 90,
      target: 85,
      color: 'from-orange-400 to-orange-600'
    }
  ];

  const recentAchievements: Achievement[] = [
    {
      id: '1',
      title: 'Reading Star',
      titleZh: '閱讀之星',
      description: 'Read 5 books this week',
      descriptionZh: '本週閱讀了5本書',
      icon: Star,
      date: '2024-08-23',
      points: 25
    },
    {
      id: '2',
      title: 'Math Wizard',
      titleZh: '數學小天才',
      description: 'Perfect score on addition quiz',
      descriptionZh: '加法測驗滿分',
      icon: Calculator,
      date: '2024-08-22',
      points: 20
    },
    {
      id: '3',
      title: 'Creative Artist',
      titleZh: '創意藝術家',
      description: 'Beautiful painting completed',
      descriptionZh: '完成了美麗的畫作',
      icon: Palette,
      date: '2024-08-21',
      points: 15
    }
  ];

  const weeklyStats = {
    assignmentsCompleted: 8,
    totalAssignments: 10,
    averageScore: 89,
    streakDays: 5,
    pointsEarned: 125
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-25 to-emerald-25" style={{
      background: 'linear-gradient(to bottom, #f0f9ff, #ecfdf5)'
    }}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl text-gray-900">{t('performance.title', 'Progress Report')}</h2>
          <p className="text-gray-600">{state.user.childName}{t('performance.learningJourney', "'s learning journey")}</p>
        </div>

        {/* Weekly Summary Card */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              <span>{t('performance.weeklySummary', "This Week's Summary")}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-xl text-gray-900">{weeklyStats.assignmentsCompleted}/{weeklyStats.totalAssignments}</div>
                <div className="text-xs text-gray-600">{t('performance.assignmentsDone', 'Assignments Done')}</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Star className="w-6 h-6 text-amber-600" />
                </div>
                <div className="text-xl text-gray-900">{weeklyStats.averageScore}%</div>
                <div className="text-xs text-gray-600">{t('performance.averageScore', 'Average Score')}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Heart className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-xl text-gray-900">{weeklyStats.streakDays}</div>
                <div className="text-xs text-gray-600">{t('performance.dayStreak', 'Day Streak')}</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Trophy className="w-6 h-6 text-sky-600" />
                </div>
                <div className="text-xl text-gray-900">+{weeklyStats.pointsEarned}</div>
                <div className="text-xs text-gray-600">Points Earned</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Weekly Progress</span>
                <span className="text-sm text-gray-900">{Math.round((weeklyStats.assignmentsCompleted / weeklyStats.totalAssignments) * 100)}%</span>
              </div>
              <Progress value={(weeklyStats.assignmentsCompleted / weeklyStats.totalAssignments) * 100} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Subject Performance */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span>{t('performance.subjectPerformance', 'Subject Performance')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {subjectProgress.map((subject, index) => {
              const Icon = subject.icon;
              return (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-r ${subject.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-gray-900 font-medium">
                          {state.language === 'zh' ? subject.subjectZh : subject.subject}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Recent: {subject.recentScore}% • {t('performance.target', 'Target')}: {subject.target}%
                        </p>
                      </div>
                    </div>
                    <Badge className={subject.recentScore >= subject.target ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}>
                      {subject.recentScore >= subject.target ? "✓ Target Met" : "In Progress"}
                    </Badge>
                  </div>
                  <Progress value={subject.progress} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-purple-600" />
              <span>{t('performance.recentAchievements', 'Recent Achievements')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAchievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div key={achievement.id} className="flex items-center space-x-4 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-gray-900 font-medium">
                      {state.language === 'zh' ? achievement.titleZh : achievement.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {state.language === 'zh' ? achievement.descriptionZh : achievement.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{new Date(achievement.date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <Badge className="bg-amber-500 text-white">
                    +{achievement.points}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Encouraging Message */}
        <div className="text-center space-y-3 p-6 bg-gradient-to-r from-emerald-50 to-sky-50 rounded-xl border border-emerald-200">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-sky-400 rounded-full flex items-center justify-center mx-auto">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg text-gray-900">{t('performance.excellentProgress', 'Excellent progress this week!')}</h3>
          <p className="text-gray-600">
            {state.user.childName} {t('performance.greatImprovement', 'is showing great improvement in all subjects.')}
          </p>
          <div className="flex justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}