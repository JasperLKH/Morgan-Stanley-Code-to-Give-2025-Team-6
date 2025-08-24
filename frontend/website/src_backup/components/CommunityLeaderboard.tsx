import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useParentContext, LeaderboardEntry, KindergartenRanking } from '../contexts/ParentContext';
import { 
  Trophy,
  Crown,
  Medal,
  Star,
  TrendingUp,
  Users,
  School,
  Calendar,
  Flame,
  Award
} from 'lucide-react';

interface LeaderboardProps {
  kindergartenId?: string;
}

export function CommunityLeaderboard({ kindergartenId }: LeaderboardProps) {
  const { state, t } = useParentContext();
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'all'>('week');

  // Mock data - in real app, this would come from API
  const topParents: LeaderboardEntry[] = [
    {
      id: '1',
      parentName: 'Sarah Chen',
      childName: 'Emma Chen',
      points: 245,
      kindergarten: 'Sunshine Kindergarten',
      rank: 1,
    },
    {
      id: '2',
      parentName: 'Lisa Wong',
      childName: 'Alex Wong',
      points: 230,
      kindergarten: 'Happy Learning Center',
      rank: 2,
    },
    {
      id: '3',
      parentName: 'David Lee',
      childName: 'Sophie Lee',
      points: 210,
      kindergarten: 'Bright Stars Academy',
      rank: 3,
    },
    {
      id: '4',
      parentName: 'Maria Garcia',
      childName: 'Diego Garcia',
      points: 195,
      kindergarten: 'Rainbow Kids',
      rank: 4,
    },
    {
      id: '5',
      parentName: 'James Smith',
      childName: 'Lily Smith',
      points: 180,
      kindergarten: 'Little Scholars',
      rank: 5,
    },
  ];

  const topKindergartens: KindergartenRanking[] = [
    {
      id: '1',
      name: 'Sunshine Kindergarten',
      nameZh: '陽光幼稚園',
      totalPoints: 1850,
      participantCount: 45,
      rank: 1,
    },
    {
      id: '2',
      name: 'Happy Learning Center',
      nameZh: '快樂學習中心',
      totalPoints: 1720,
      participantCount: 38,
      rank: 2,
    },
    {
      id: '3',
      name: 'Bright Stars Academy',
      nameZh: '明星學院',
      totalPoints: 1650,
      participantCount: 42,
      rank: 3,
    },
    {
      id: '4',
      name: 'Rainbow Kids',
      nameZh: '彩虹兒童',
      totalPoints: 1590,
      participantCount: 35,
      rank: 4,
    },
    {
      id: '5',
      name: 'Little Scholars',
      nameZh: '小學者',
      totalPoints: 1480,
      participantCount: 40,
      rank: 5,
    },
  ];

  const userRank = topParents.findIndex(p => p.id === state.user.id) + 1;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-orange-500" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm text-gray-600">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const ParentLeaderboardCard = ({ parent, isCurrentUser = false }: { parent: LeaderboardEntry; isCurrentUser?: boolean }) => (
    <Card className={`transition-all duration-200 ${
      isCurrentUser ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          {/* Rank */}
          <div className={`flex items-center justify-center w-12 h-12 rounded-full ${getRankBadgeColor(parent.rank)}`}>
            {getRankIcon(parent.rank)}
          </div>

          {/* Avatar */}
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-blue-100 text-blue-700">
              {parent.parentName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h4 className="text-gray-900 truncate">{parent.parentName}</h4>
              {isCurrentUser && (
                <Badge className="bg-blue-500 text-white text-xs">
                  {t('leaderboard.you', 'You')}
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600 truncate">{parent.childName}</p>
            <p className="text-xs text-gray-500 truncate">{parent.kindergarten}</p>
          </div>

          {/* Points */}
          <div className="text-right">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-lg text-gray-900">{parent.points}</span>
            </div>
            <p className="text-xs text-gray-500">{t('leaderboard.points', 'points')}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const KindergartenLeaderboardCard = ({ kindergarten, isCurrentUserKindergarten = false }: { kindergarten: KindergartenRanking; isCurrentUserKindergarten?: boolean }) => (
    <Card className={`transition-all duration-200 ${
      isCurrentUserKindergarten ? 'ring-2 ring-green-500 bg-green-50' : 'hover:shadow-md'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          {/* Rank */}
          <div className={`flex items-center justify-center w-12 h-12 rounded-full ${getRankBadgeColor(kindergarten.rank)}`}>
            {getRankIcon(kindergarten.rank)}
          </div>

          {/* School Icon */}
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <School className="w-6 h-6 text-green-600" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h4 className="text-gray-900 truncate">
                {state.language === 'zh' ? kindergarten.nameZh : kindergarten.name}
              </h4>
              {isCurrentUserKindergarten && (
                <Badge className="bg-green-500 text-white text-xs">
                  {t('leaderboard.yourSchool', 'Your School')}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="w-3 h-3" />
              <span>{kindergarten.participantCount} {t('leaderboard.participants', 'participants')}</span>
            </div>
            <p className="text-xs text-gray-500">
              {t('leaderboard.avgPoints', 'Avg')}: {Math.round(kindergarten.totalPoints / kindergarten.participantCount)} {t('leaderboard.points', 'points')}
            </p>
          </div>

          {/* Total Points */}
          <div className="text-right">
            <div className="flex items-center space-x-1">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-lg text-gray-900">{kindergarten.totalPoints}</span>
            </div>
            <p className="text-xs text-gray-500">{t('leaderboard.totalPoints', 'total points')}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h2 className="text-xl text-gray-900">{t('leaderboard.title', 'Leaderboard')}</h2>
        </div>
        
        {/* Time Filter */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {(['week', 'month', 'all'] as const).map((filter) => (
            <Button
              key={filter}
              variant={timeFilter === filter ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeFilter(filter)}
              className={`text-xs ${
                timeFilter === filter 
                  ? 'bg-white shadow-sm' 
                  : 'hover:bg-gray-200'
              }`}
            >
              {t(`leaderboard.${filter}`, filter)}
            </Button>
          ))}
        </div>
      </div>

      {/* User's Current Rank */}
      {userRank > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white">#{userRank}</span>
                </div>
                <div>
                  <h4 className="text-gray-900">{t('leaderboard.yourRank', 'Your Current Rank')}</h4>
                  <p className="text-sm text-gray-600">
                    {state.dashboard.totalPoints} {t('leaderboard.points', 'points')} • 
                    {userRank <= 3 ? (
                      <span className="text-green-600 ml-1">
                        🎉 {t('leaderboard.topThree', 'Top 3!')}
                      </span>
                    ) : (
                      <span className="text-blue-600 ml-1">
                        {t('leaderboard.keepGoing', 'Keep going!')}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  {userRank === 1 ? (
                    <span className="text-yellow-600 flex items-center">
                      <Crown className="w-4 h-4 mr-1" />
                      {t('leaderboard.champion', 'Champion!')}
                    </span>
                  ) : (
                    <>
                      {topParents[0]?.points - state.dashboard.totalPoints} {t('leaderboard.pointsToFirst', 'to #1')}
                    </>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard Tabs */}
      <Tabs defaultValue="parents" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="parents" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>{t('leaderboard.topParents', 'Top Parents')}</span>
          </TabsTrigger>
          <TabsTrigger value="kindergartens" className="flex items-center space-x-2">
            <School className="w-4 h-4" />
            <span>{t('leaderboard.topKindergartens', 'Top Schools')}</span>
          </TabsTrigger>
        </TabsList>

        {/* Parents Leaderboard */}
        <TabsContent value="parents" className="space-y-4 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-gray-900">
              {t('leaderboard.thisWeekTop', 'This Week\'s Top Parents')}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{t('leaderboard.updatesDaily', 'Updates daily')}</span>
            </div>
          </div>

          <div className="space-y-3">
            {topParents.map((parent, index) => (
              <ParentLeaderboardCard
                key={parent.id}
                parent={parent}
                isCurrentUser={parent.id === state.user.id}
              />
            ))}
          </div>

          {/* Achievement Spotlight */}
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Flame className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h4 className="text-gray-900">{t('leaderboard.weeklyChampion', 'Weekly Champion')}</h4>
                  <p className="text-sm text-gray-600">
                    {topParents[0]?.parentName} {t('leaderboard.leads', 'leads with')} {topParents[0]?.points} {t('leaderboard.points', 'points')}!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Kindergartens Leaderboard */}
        <TabsContent value="kindergartens" className="space-y-4 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-gray-900">
              {t('leaderboard.topSchools', 'Top Performing Schools')}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <TrendingUp className="w-4 h-4" />
              <span>{t('leaderboard.thisWeek', 'This week')}</span>
            </div>
          </div>

          <div className="space-y-3">
            {topKindergartens.map((kindergarten) => (
              <KindergartenLeaderboardCard
                key={kindergarten.id}
                kindergarten={kindergarten}
                isCurrentUserKindergarten={kindergarten.name === state.user.kindergarten}
              />
            ))}
          </div>

          {/* School Pride Section */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-4">
              <div className="text-center">
                <School className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h4 className="text-gray-900 mb-2">
                  {t('leaderboard.schoolPride', 'School Spirit!')}
                </h4>
                <p className="text-sm text-gray-600">
                  {t('leaderboard.yourSchoolRank', 'Your school')} <strong>{state.user.kindergarten}</strong> {t('leaderboard.rankPosition', 'is ranked')} #{topKindergartens.find(k => k.name === state.user.kindergarten)?.rank || 'N/A'} {t('leaderboard.thisWeek', 'this week')}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}