import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { useUser } from '../../contexts/UserContext';
import { 
  Gift, 
  Star, 
  Trophy, 
  Heart, 
  Sparkles,
  ShoppingBag,
  Crown,
  Zap,
  CheckCircle,
  Clock,
  Coins,
  QrCode,
  User,
  Copy,
  Coffee,
  Utensils,
  ShoppingCart,
  CreditCard
} from 'lucide-react';

interface Reward {
  id: string;
  name: string;
  description: string;
  points: number;
  category: 'physical' | 'digital' | 'coupon';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  available: boolean;
  claimed?: boolean;
  image?: string;
  couponId?: string;
  merchantName?: string;
  expiryDate?: string;
}

interface RedemptionHistory {
  id: string;
  rewardName: string;
  points: number;
  date: string;
  status: 'pending' | 'delivered' | 'claimed';
}

export function RewardsPage() {
  const { user } = useUser();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'physical' | 'digital' | 'coupon'>('all');
  const [showRedeemDialog, setShowRedeemDialog] = useState<Reward | null>(null);
  const [redemptionMethod, setRedemptionMethod] = useState<'qr' | 'direct'>('qr');
  
  // Mock user points
  const userPoints = user?.points || 350;

  const availableRewards: Reward[] = [
    {
      id: '1',
      name: 'Walmart Gift Card $50',
      description: '$50 gift card for Walmart stores',
      points: 250,
      category: 'coupon',
      icon: ShoppingCart,
      color: 'from-blue-500 to-blue-600',
      available: true,
      couponId: 'WAL2024001',
      merchantName: 'Walmart',
      expiryDate: '2025-12-31'
    },
    {
      id: '2',
      name: '7-Eleven $30 Voucher',
      description: '$30 voucher for 7-Eleven convenience stores',
      points: 150,
      category: 'coupon',
      icon: Coffee,
      color: 'from-green-500 to-emerald-500',
      available: true,
      couponId: '7EL2024002',
      merchantName: '7-Eleven',
      expiryDate: '2025-06-30'
    },
    {
      id: '3',
      name: 'Educational Sticker Pack',
      description: 'Colorful educational stickers for learning activities',
      points: 50,
      category: 'physical',
      icon: Star,
      color: 'from-yellow-400 to-orange-400',
      available: true
    },
    {
      id: '4',
      name: 'Digital Achievement Badge',
      description: 'Special digital achievement badge for your profile',
      points: 25,
      category: 'digital',
      icon: Trophy,
      color: 'from-blue-400 to-purple-400',
      available: true
    }
  ];

  const redemptionHistory: RedemptionHistory[] = [
    {
      id: '1',
      rewardName: '7-Eleven $30 Voucher',
      points: 150,
      date: '2024-08-20',
      status: 'delivered'
    },
    {
      id: '2',
      rewardName: 'Digital Achievement Badge',
      points: 25,
      date: '2024-08-18',
      status: 'claimed'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Rewards' },
    { id: 'coupon', name: 'Gift Cards & Vouchers' },
    { id: 'physical', name: 'Educational Items' },
    { id: 'digital', name: 'Digital Rewards' }
  ];

  const filteredRewards = selectedCategory === 'all' 
    ? availableRewards 
    : availableRewards.filter(reward => reward.category === selectedCategory);

  const handleRedeem = (reward: Reward) => {
    if (userPoints >= reward.points && reward.available) {
      setShowRedeemDialog(reward);
    }
  };

  const confirmRedeem = () => {
    if (!showRedeemDialog) return;
    console.log('Reward redeemed:', showRedeemDialog);
    setShowRedeemDialog(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'claimed':
        return <Trophy className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-25 to-emerald-25 p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl text-gray-900">Rewards Store</h2>
        <p className="text-gray-600">Redeem your points for practical rewards!</p>
      </div>

      {/* Points Balance */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full flex items-center justify-center shadow-lg">
              <Coins className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <div className="text-3xl text-gray-900 mb-1">{userPoints}</div>
              <div className="text-gray-600">Available Points</div>
              <Badge className="bg-amber-500 text-white mt-2">
                <Crown className="w-3 h-3 mr-1" />
                Gold Member
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.id as 'all' | 'physical' | 'digital' | 'coupon')}
            className="whitespace-nowrap"
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Rewards Grid */}
      <div className="space-y-4">
        <h3 className="text-lg text-gray-900">Available Rewards</h3>
        
        {filteredRewards.map((reward) => {
          const Icon = reward.icon;
          const canAfford = userPoints >= reward.points;
          const canRedeem = canAfford && reward.available;
          
          return (
            <Card 
              key={reward.id} 
              className={`border-0 shadow-lg bg-white/80 backdrop-blur-sm ${
                canRedeem ? 'hover:shadow-xl transition-all duration-300' : 'opacity-75'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${reward.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-lg text-gray-900 mb-1">{reward.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{reward.description}</p>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-blue-100 text-blue-800">
                        {reward.points} points
                      </Badge>
                      <Badge variant="outline">
                        {reward.category === 'coupon' ? 'voucher' : 
                         reward.category === 'physical' ? 'physical' : 'digital'}
                      </Badge>
                      {reward.category === 'coupon' && reward.expiryDate && (
                        <Badge className="bg-amber-100 text-amber-800 text-xs">
                          Expires: {new Date(reward.expiryDate).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    {!reward.available ? (
                      <Badge className="bg-gray-500 text-white">Out of Stock</Badge>
                    ) : (
                      <Button
                        onClick={() => handleRedeem(reward)}
                        disabled={!canRedeem}
                        className={`${
                          canRedeem 
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? 'Redeem' : `Need ${reward.points - userPoints} more`}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Redemption History */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-gray-600" />
            <span>Redemption History</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {redemptionHistory.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No redemptions yet</p>
          ) : (
            redemptionHistory.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(item.status)}
                  <div>
                    <p className="text-gray-900 font-medium">{item.rewardName}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(item.date).toLocaleDateString()} • {item.points} points
                    </p>
                  </div>
                </div>
                <Badge 
                  className={
                    item.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    item.status === 'claimed' ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-800'
                  }
                >
                  {item.status}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Redeem Confirmation Dialog */}
      <Dialog open={showRedeemDialog !== null} onOpenChange={() => setShowRedeemDialog(null)}>
        <DialogContent className="w-[340px] rounded-3xl">
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl">Confirm Redemption</DialogTitle>
          </DialogHeader>
          
          {showRedeemDialog && (
            <div className="text-center space-y-4 py-4">
              <div className={`w-20 h-20 bg-gradient-to-br ${showRedeemDialog.color} rounded-full flex items-center justify-center mx-auto shadow-lg`}>
                <showRedeemDialog.icon className="w-10 h-10 text-white" />
              </div>
              
              <div>
                <h3 className="text-lg text-gray-900 mb-2">{showRedeemDialog.name}</h3>
                <p className="text-gray-600 mb-4">{showRedeemDialog.description}</p>
                
                {/* Show redemption method choice only for physical items */}
                {showRedeemDialog.category === 'physical' && (
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 mb-4">
                    <p className="text-blue-800 text-sm mb-3">Choose delivery method:</p>
                    <RadioGroup value={redemptionMethod} onValueChange={(value: 'qr' | 'direct') => setRedemptionMethod(value)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="qr" id="qr" />
                        <Label htmlFor="qr" className="flex items-center text-sm">
                          <QrCode className="w-4 h-4 mr-2" />
                          QR Code (pickup at center)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="direct" id="direct" />
                        <Label htmlFor="direct" className="flex items-center text-sm">
                          <User className="w-4 h-4 mr-2" />
                          Direct to child
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
                
                <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                  <p className="text-amber-800">
                    Cost: <strong>{showRedeemDialog.points} points</strong>
                  </p>
                  <p className="text-amber-700 text-sm">
                    Remaining: {userPoints - showRedeemDialog.points} points
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowRedeemDialog(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={confirmRedeem}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                >
                  Redeem Now
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
