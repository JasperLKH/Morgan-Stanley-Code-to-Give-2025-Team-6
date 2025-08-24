import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { 
  Gift, 
  Star, 
  Trophy, 
  Ticket, 
  Coffee, 
  ShoppingBag, 
  Loader2,
  Check,
  X
} from 'lucide-react';
import { apiService } from '../../services/api';
import { useParentContext } from '../contexts/ParentContext';

interface Reward {
  id: number;
  name: string;
  description: string;
  cost: number;
  category: 'voucher' | 'coupon' | 'activity';
  available: boolean;
}

export function RewardsPage() {
  const { state, t } = useParentContext();
  const currentUser = state.user;
  const dashboard = state.dashboard;
  
  // Log user ID for debugging
  console.log('RewardsPage - Current User ID:', currentUser?.id);
  
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<number | null>(null);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

  useEffect(() => {
    const fetchRewards = async () => {
      setLoading(true);
      try {
        const response = await apiService.getAvailableRewards();
        if (response.success && response.data) {
          setRewards(response.data as Reward[]);
        }
      } catch (error) {
        console.error('Error fetching rewards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, []);

  const handleRedeemReward = async (reward: Reward) => {
    if (!currentUser?.id || redeeming || currentPoints < reward.cost) return;
    
    setRedeeming(reward.id);
    try {
      const response = await apiService.redeemReward(reward.id, currentUser.id);
      if (response.success) {
        // Update local user points (in a real app, you'd refetch user data)
        setSelectedReward(null);
        
        // Refresh user data
        const userResponse = await apiService.getUserById(currentUser.id);
        if (userResponse.success && userResponse.data) {
          // Update user context with new points
          // You might want to update the user context here
        }
        
        alert('Reward redeemed successfully! Check your email for details.');
      } else {
        alert('Failed to redeem reward. Please try again.');
      }
    } catch (error) {
      console.error('Error redeeming reward:', error);
      alert('Failed to redeem reward. Please try again.');
    } finally {
      setRedeeming(null);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'voucher':
        return Ticket;
      case 'coupon':
        return ShoppingBag;
      case 'activity':
        return Trophy;
      default:
        return Gift;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'voucher':
        return 'bg-blue-100 text-blue-700';
      case 'coupon':
        return 'bg-green-100 text-green-700';
      case 'activity':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const currentPoints = dashboard?.totalPoints || 0;
  const weeklyPoints = dashboard?.totalPoints || 0; // Note: weeklyPoints might need a separate field in the dashboard

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2">{t('rewards.loadingRewards')}</span>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl text-gray-900">{t('rewards.title')}</h2>
        <p className="text-sm text-gray-600">
          {t('rewards.subtitle')}
        </p>
      </div>

      {/* Points Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-600" />
            <span>{t('rewards.yourPoints')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">{currentPoints}</p>
              <p className="text-sm text-blue-800">{t('rewards.totalPoints')}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">{weeklyPoints}</p>
              <p className="text-sm text-green-800">{t('rewards.thisWeek')}</p>
            </div>
          </div>
          
          {/* Progress to next reward */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">{t('rewards.progressToNext')}</span>
              <span className="text-sm text-gray-900">
                {currentPoints}/100 {t('rewards.points')}
              </span>
            </div>
            <Progress value={(currentPoints / 100) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rewards.map((reward) => {
          const Icon = getCategoryIcon(reward.category);
          const canAfford = currentPoints >= reward.cost;
          
          return (
            <Card 
              key={reward.id} 
              className={`transition-all hover:shadow-md ${
                reward.available && canAfford
                  ? 'border-green-200 hover:border-green-300'
                  : 'border-gray-200'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    reward.available && canAfford
                      ? 'bg-green-100'
                      : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      reward.available && canAfford
                        ? 'text-green-600'
                        : 'text-gray-400'
                    }`} />
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge 
                      className={getCategoryColor(reward.category)}
                      variant="secondary"
                    >
                      {t(`rewards.${reward.category}`)}
                    </Badge>
                    {!reward.available && (
                      <Badge variant="secondary" className="bg-red-100 text-red-700">
                        {t('rewards.unavailable')}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{reward.name}</h3>
                  <p className="text-sm text-gray-600">{reward.description}</p>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-lg font-bold text-purple-600">
                      {reward.cost} {t('rewards.points')}
                    </span>
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full"
                      disabled={!reward.available || !canAfford}
                      variant={canAfford && reward.available ? "default" : "secondary"}
                      onClick={() => setSelectedReward(reward)}
                    >
                      {!reward.available ? (
                        <>
                          <X className="w-4 h-4 mr-2" />
                          {t('rewards.unavailable')}
                        </>
                      ) : !canAfford ? (
                        <>
                          <Star className="w-4 h-4 mr-2" />
                          {t('rewards.needMore')} {reward.cost - currentPoints} {t('rewards.morePoints')}
                        </>
                      ) : (
                        <>
                          <Gift className="w-4 h-4 mr-2" />
                          {t('rewards.redeemNow')}
                        </>
                      )}
                    </Button>
                  </DialogTrigger>
                  
                  {selectedReward && (
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>{t('rewards.redeemReward')}</DialogTitle>
                        <DialogDescription>
                          {t('rewards.confirmRedeem')}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Icon className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{selectedReward.name}</h4>
                            <p className="text-sm text-gray-600">{selectedReward.description}</p>
                            <p className="text-sm font-medium text-purple-600">
                              {t('rewards.cost')}: {selectedReward.cost} {t('rewards.points')}
                            </p>
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>{t('rewards.currentPoints')}:</strong> {currentPoints}
                          </p>
                          <p className="text-sm text-blue-800">
                            <strong>{t('rewards.afterRedemption')}:</strong> {currentPoints - selectedReward.cost}
                          </p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setSelectedReward(null)}
                          >
                            {t('rewards.cancel')}
                          </Button>
                          <Button
                            className="flex-1"
                            onClick={() => handleRedeemReward(selectedReward)}
                            disabled={redeeming === selectedReward.id}
                          >
                            {redeeming === selectedReward.id ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                {t('rewards.redeeming')}
                              </>
                            ) : (
                              <>
                                <Check className="w-4 h-4 mr-2" />
                                {t('rewards.confirm')}
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  )}
                </Dialog>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* How to Earn Points */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-orange-600" />
            <span>{t('rewards.howToEarn')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Star className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{t('rewards.completeAssignments')}</p>
              <p className="text-xs text-gray-600">{t('rewards.completeAssignmentsDesc')}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Trophy className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{t('rewards.dailyStreak')}</p>
              <p className="text-xs text-gray-600">{t('rewards.dailyStreakDesc')}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Gift className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{t('rewards.communityParticipation')}</p>
              <p className="text-xs text-gray-600">{t('rewards.communityParticipationDesc')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
