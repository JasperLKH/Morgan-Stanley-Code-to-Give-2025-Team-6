import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useParentContext } from '../contexts/ParentContext';
import { 
  Trophy, 
  Crown, 
  Medal, 
  Award,
  Star,
  Flame,
  Calendar,
  Users,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  parentName: string;
  childName: string;
  points: number;
  avatar: string;
  rank: number;
  weeklyPoints: number;
  monthlyPoints: number;
  streak: number;
  lastWeekRank?: number;
  trend?: 'up' | 'down' | 'same';
}

export function CommunityLeaderboardFull() {
  const { state, t } = useParentContext();
  const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly' | 'allTime'>('weekly');

  // Extended leaderboard data
  const fullLeaderboard: LeaderboardEntry[] = [
    {
      id: '1',
      parentName: 'Sarah Chen',
      childName: 'Emma',
      points: 285,
      avatar: 'SC',
      rank: 1,
      weeklyPoints: 125,
      monthlyPoints: 420,
      streak: 7,
      lastWeekRank: 2,
      trend: 'up'
    },
    {
      id: '2',
      parentName: 'Lisa Wong',
      childName: 'Alex',
      points: 267,
      avatar: 'LW',
      rank: 2,
      weeklyPoints: 118,
      monthlyPoints: 398,
      streak: 5,
      lastWeekRank: 1,
      trend: 'down'
    },
    {
      id: '3',
      parentName: 'David Liu',
      childName: 'Marcus',
      points: 251,
      avatar: 'DL',
      rank: 3,
      weeklyPoints: 112,
      monthlyPoints: 375,
      streak: 6,
      lastWeekRank: 3,
      trend: 'same'
    },
    {
      id: '4',
      parentName: 'Maria Garcia',
      childName: 'Sofia',
      points: 235,
      avatar: 'MG',
      rank: 4,
      weeklyPoints: 98,
      monthlyPoints: 342,
      streak: 4,
      lastWeekRank: 5,
      trend: 'up'
    },
    {
      id: '5',
      parentName: 'James Johnson',
      childName: 'Lily',
      points: 220,
      avatar: 'JJ',
      rank: 5,
      weeklyPoints: 89,
      monthlyPoints: 315,
      streak: 3,
      lastWeekRank: 4,
      trend: 'down'
    },
    {
      id: '6',
      parentName: 'Anna Kim',
      childName: 'Oliver',
      points: 205,
      avatar: 'AK',
      rank: 6,
      weeklyPoints: 78,
      monthlyPoints: 298,
      streak: 2,
      lastWeekRank: 7,
      trend: 'up'
    },
    {
      id: '7',
      parentName: 'Michael Brown',
      childName: 'Zoe',
      points: 190,
      avatar: 'MB',
      rank: 7,
      weeklyPoints: 65,
      monthlyPoints: 275,
      streak: 4,
      lastWeekRank: 6,
      trend: 'down'
    },
    {
      id: '8',
      parentName: 'Sophie Taylor',
      childName: 'Nathan',
      points: 175,
      avatar: 'ST',
      rank: 8,
      weeklyPoints: 58,
      monthlyPoints: 252,
      streak: 1,
      lastWeekRank: 8,
      trend: 'same'
    }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-8 h-8 flex items-center justify-center text-lg font-medium text-gray-600 bg-gray-100 rounded-full">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-100 to-amber-100 border-yellow-200';
      case 2:
        return 'from-gray-100 to-slate-100 border-gray-200';
      case 3:
        return 'from-orange-100 to-amber-100 border-orange-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <ArrowDown className="w-4 h-4 text-red-500" />;
      case 'same':
        return <Minus className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const getCurrentUserRank = () => {
    // Find current user in leaderboard (assuming Sarah Chen is current user for demo)
    return fullLeaderboard.find(entry => entry.parentName === 'Sarah Chen');
  };

  const currentUserRank = getCurrentUserRank();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-25 to-emerald-25" style={{
      background: 'linear-gradient(to bottom, #f0f9ff, #ecfdf5)'
    }}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl text-gray-900">{t('leaderboard.title', 'Community Leaderboard')}</h2>
          <p className="text-gray-600">{t('leaderboard.subtitle', 'See how REACH families are progressing together')}</p>
        </div>

        {/* Current User Highlight */}
        {currentUserRank && (
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12">
                  {getRankIcon(currentUserRank.rank)}
                </div>
                
                <Avatar className="w-14 h-14 border-2 border-blue-300">
                  <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-400 text-white text-lg">
                    {currentUserRank.avatar}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-medium text-gray-900">Your Rank: #{currentUserRank.rank}</span>
                    {getTrendIcon(currentUserRank.trend)}
                  </div>
                  <p className="text-gray-600">{currentUserRank.childName}'s progress</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge className="bg-blue-100 text-blue-800">
                      <Star className="w-3 h-3 mr-1" />
                      {currentUserRank.weeklyPoints} this week
                    </Badge>
                    <Badge className="bg-orange-100 text-orange-800">
                      <Flame className="w-3 h-3 mr-1" />
                      {currentUserRank.streak} day streak
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Period Tabs */}
        <Tabs value={selectedPeriod} onValueChange={(value: 'weekly' | 'monthly' | 'allTime') => setSelectedPeriod(value)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weekly">This Week</TabsTrigger>
            <TabsTrigger value="monthly">This Month</TabsTrigger>
            <TabsTrigger value="allTime">All Time</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg text-gray-900">Weekly Champions</h3>
              <Badge className="bg-purple-100 text-purple-800">
                <Calendar className="w-3 h-3 mr-1" />
                Dec 16-22, 2024
              </Badge>
            </div>

            {fullLeaderboard.map((entry) => (
              <Card 
                key={entry.id} 
                className={`border-0 shadow-lg transition-all duration-300 ${
                  entry.rank <= 3 ? `bg-gradient-to-r ${getRankColor(entry.rank)}` : 'bg-white'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12">
                      {getRankIcon(entry.rank)}
                    </div>
                    
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-400 text-white">
                        {entry.avatar}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{entry.parentName}</span>
                        {entry.rank <= 3 && <Trophy className="w-4 h-4 text-amber-500" />}
                        {getTrendIcon(entry.trend)}
                      </div>
                      <p className="text-sm text-gray-600">{entry.childName}'s parent</p>
                      
                      <div className="flex items-center space-x-3 mt-2">
                        <Badge variant="outline" className="text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          {entry.weeklyPoints} pts
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Flame className="w-3 h-3 mr-1" />
                          {entry.streak} day streak
                        </Badge>
                        {entry.lastWeekRank && (
                          <span className="text-xs text-gray-500">
                            Last week: #{entry.lastWeekRank}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xl font-medium text-gray-900">#{entry.rank}</div>
                      <div className="text-sm text-gray-600">{entry.points} total</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="monthly" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg text-gray-900">Monthly Leaders</h3>
              <Badge className="bg-emerald-100 text-emerald-800">
                <Calendar className="w-3 h-3 mr-1" />
                December 2024
              </Badge>
            </div>

            {fullLeaderboard.sort((a, b) => b.monthlyPoints - a.monthlyPoints).map((entry, index) => (
              <Card key={entry.id} className="border-0 shadow-lg bg-white">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12">
                      <span className="w-8 h-8 flex items-center justify-center text-lg font-medium text-gray-600 bg-gray-100 rounded-full">
                        #{index + 1}
                      </span>
                    </div>
                    
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-r from-emerald-400 to-teal-400 text-white">
                        {entry.avatar}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">{entry.parentName}</span>
                      <p className="text-sm text-gray-600">{entry.childName}'s parent</p>
                      
                      <Badge variant="outline" className="text-xs mt-2">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {entry.monthlyPoints} monthly points
                      </Badge>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xl font-medium text-gray-900">#{index + 1}</div>
                      <div className="text-sm text-gray-600">{entry.monthlyPoints} pts</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="allTime" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg text-gray-900">Hall of Fame</h3>
              <Badge className="bg-amber-100 text-amber-800">
                <Trophy className="w-3 h-3 mr-1" />
                All Time Leaders
              </Badge>
            </div>

            {fullLeaderboard.sort((a, b) => b.points - a.points).map((entry, index) => (
              <Card key={entry.id} className="border-0 shadow-lg bg-white">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12">
                      {index === 0 ? (
                        <Crown className="w-8 h-8 text-yellow-500" />
                      ) : (
                        <span className="w-8 h-8 flex items-center justify-center text-lg font-medium text-gray-600 bg-gray-100 rounded-full">
                          #{index + 1}
                        </span>
                      )}
                    </div>
                    
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-r from-purple-400 to-pink-400 text-white">
                        {entry.avatar}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{entry.parentName}</span>
                        {index === 0 && <Crown className="w-4 h-4 text-yellow-500" />}
                      </div>
                      <p className="text-sm text-gray-600">{entry.childName}'s parent</p>
                      
                      <Badge variant="outline" className="text-xs mt-2">
                        <Star className="w-3 h-3 mr-1" />
                        {entry.points} total points
                      </Badge>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xl font-medium text-gray-900">#{index + 1}</div>
                      <div className="text-sm text-gray-600">{entry.points} pts</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Motivation Section */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50 border-emerald-200">
          <CardContent className="p-6 text-center">
            <Trophy className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
            <h3 className="text-lg text-gray-900 mb-2">Keep Going!</h3>
            <p className="text-gray-600 mb-4">
              Every point counts towards your child's learning journey. Stay active and climb the leaderboard!
            </p>
            <div className="flex justify-center space-x-2">
              <Badge className="bg-emerald-100 text-emerald-800">
                <Users className="w-3 h-3 mr-1" />
                {fullLeaderboard.length} active families
              </Badge>
              <Badge className="bg-blue-100 text-blue-800">
                <Star className="w-3 h-3 mr-1" />
                Updated weekly
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}