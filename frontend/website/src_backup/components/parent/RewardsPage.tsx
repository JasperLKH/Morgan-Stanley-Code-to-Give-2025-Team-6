import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { useParentContext } from '../contexts/ParentContext';
import { ImageWithFallback } from '../figma/ImageWithFallback';
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
  Ticket,
  Copy,
  Coffee,
  Utensils,
  ShoppingCart,
  CreditCard
} from 'lucide-react';

interface Reward {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
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
  rewardNameZh: string;
  points: number;
  date: string;
  status: 'pending' | 'delivered' | 'claimed';
}

interface RedemptionData {
  rewardId: string;
  rewardName: string;
  method: 'qr' | 'direct' | 'instant';
  qrCodeId: string | null;
  couponCode: string;
  expiryDate: string;
  merchantName: string;
}

export function RewardsPage() {
  const { state } = useParentContext();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'physical' | 'digital' | 'coupon'>('all');
  const [showRedeemDialog, setShowRedeemDialog] = useState<Reward | null>(null);
  const [redemptionMethod, setRedemptionMethod] = useState<'qr' | 'direct'>('qr');
  const [showSuccessDialog, setShowSuccessDialog] = useState<RedemptionData | null>(null);

  const availableRewards: Reward[] = [
    // Practical Gift Cards & Coupons - Always QR Code redemption
    {
      id: '1',
      name: 'Walmart Gift Card $50',
      nameZh: 'Walmart $50 禮品卡',
      description: '$50 gift card for Walmart stores',
      descriptionZh: 'Walmart 商店 $50 禮品卡',
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
      nameZh: '7-Eleven $30 代用券',
      description: '$30 voucher for 7-Eleven convenience stores',
      descriptionZh: '7-Eleven 便利店 $30 代用券',
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
      name: 'PARKnSHOP $100 Voucher',
      nameZh: '百佳超級市場 $100 代用券',
      description: '$100 grocery voucher for PARKnSHOP supermarket',
      descriptionZh: '百佳超級市場 $100 購物代用券',
      points: 400,
      category: 'coupon',
      icon: ShoppingBag,
      color: 'from-orange-500 to-red-500',
      available: true,
      couponId: 'PNS2024003',
      merchantName: 'PARKnSHOP 百佳',
      expiryDate: '2025-08-31'
    },
    {
      id: '4',
      name: 'Wellcome $75 Voucher',
      nameZh: '惠康超級市場 $75 代用券',
      description: '$75 grocery voucher for Wellcome supermarket',
      descriptionZh: '惠康超級市場 $75 購物代用券',
      points: 300,
      category: 'coupon',
      icon: ShoppingBag,
      color: 'from-red-500 to-pink-500',
      available: true,
      couponId: 'WEL2024004',
      merchantName: 'Wellcome 惠康',
      expiryDate: '2025-07-31'
    },
    {
      id: '5',
      name: 'Circle K $25 Voucher',
      nameZh: 'Circle K $25 代用券',
      description: '$25 voucher for Circle K convenience stores',
      descriptionZh: 'Circle K 便利店 $25 代用券',
      points: 125,
      category: 'coupon',
      icon: Coffee,
      color: 'from-teal-500 to-cyan-500',
      available: true,
      couponId: 'CK2024005',
      merchantName: 'Circle K',
      expiryDate: '2025-09-30'
    },
    {
      id: '6',
      name: 'McDonald\'s Family Meal',
      nameZh: '麥當勞家庭套餐',
      description: 'Family meal voucher for 4 people at McDonald\'s',
      descriptionZh: '麥當勞4人家庭套餐代用券',
      points: 180,
      category: 'coupon',
      icon: Utensils,
      color: 'from-yellow-500 to-orange-500',
      available: true,
      couponId: 'MCD2024006',
      merchantName: 'McDonald\'s 麥當勞',
      expiryDate: '2025-05-31'
    },
    {
      id: '7',
      name: 'KFC Family Bucket',
      nameZh: 'KFC 家庭全家桶',
      description: 'Family bucket meal for 4-6 people at KFC',
      descriptionZh: 'KFC 4-6人家庭全家桶套餐',
      points: 200,
      category: 'coupon',
      icon: Utensils,
      color: 'from-red-600 to-red-700',
      available: true,
      couponId: 'KFC2024007',
      merchantName: 'KFC 肯德基',
      expiryDate: '2025-04-30'
    },
    {
      id: '8',
      name: 'Octopus Card $100 Top-up',
      nameZh: '八達通卡 $100 增值',
      description: '$100 top-up voucher for Octopus transport card',
      descriptionZh: '八達通交通卡 $100 增值券',
      points: 400,
      category: 'coupon',
      icon: CreditCard,
      color: 'from-purple-500 to-indigo-500',
      available: true,
      couponId: 'OCT2024008',
      merchantName: 'Octopus 八達通',
      expiryDate: '2025-12-31'
    },
    {
      id: '9',
      name: 'HKTVmall $80 Voucher',
      nameZh: 'HKTVmall $80 購物券',
      description: '$80 online shopping voucher for HKTVmall',
      descriptionZh: 'HKTVmall 網上購物 $80 代用券',
      points: 320,
      category: 'coupon',
      icon: ShoppingCart,
      color: 'from-pink-500 to-rose-500',
      available: true,
      couponId: 'HKTV2024009',
      merchantName: 'HKTVmall',
      expiryDate: '2025-10-31'
    },
    {
      id: '10',
      name: 'Starbucks $40 Gift Card',
      nameZh: '星巴克 $40 禮品卡',
      description: '$40 gift card for Starbucks coffee',
      descriptionZh: '星巴克咖啡 $40 禮品卡',
      points: 160,
      category: 'coupon',
      icon: Coffee,
      color: 'from-green-600 to-green-700',
      available: true,
      couponId: 'SB2024010',
      merchantName: 'Starbucks 星巴克',
      expiryDate: '2025-11-30'
    },
    // Physical Educational Items - Choice of pickup or direct delivery
    {
      id: '11',
      name: 'Educational Sticker Pack',
      nameZh: '教育貼紙包',
      description: 'Colorful educational stickers for learning activities',
      descriptionZh: '彩色學習活動教育貼紙',
      points: 50,
      category: 'physical',
      icon: Star,
      color: 'from-yellow-400 to-orange-400',
      available: true
    },
    {
      id: '12',
      name: 'Children\'s Story Book',
      nameZh: '兒童故事書',
      description: 'Beautiful illustrated children\'s story book',
      descriptionZh: '精美插圖兒童故事書',
      points: 120,
      category: 'physical',
      icon: Gift,
      color: 'from-emerald-400 to-teal-400',
      available: true
    },
    {
      id: '13',
      name: 'Art Supplies Kit',
      nameZh: '美術用品套裝',
      description: 'Complete art supplies kit for creative activities',
      descriptionZh: '完整創意活動美術用品套裝',
      points: 200,
      category: 'physical',
      icon: Heart,
      color: 'from-purple-400 to-pink-400',
      available: true
    },
    // Digital Rewards - Instant activation
    {
      id: '14',
      name: 'Digital Achievement Badge',
      nameZh: '數位成就徽章',
      description: 'Special digital achievement badge for your profile',
      descriptionZh: '個人檔案特殊數位成就徽章',
      points: 25,
      category: 'digital',
      icon: Trophy,
      color: 'from-blue-400 to-purple-400',
      available: true
    },
    {
      id: '15',
      name: 'Premium Learning Game Access',
      nameZh: '高級學習遊戲訪問權',
      description: '30-day premium access to educational games',
      descriptionZh: '教育遊戲30天高級訪問權限',
      points: 100,
      category: 'digital',
      icon: Zap,
      color: 'from-pink-400 to-red-400',
      available: true
    }
  ];

  const redemptionHistory: RedemptionHistory[] = [
    {
      id: '1',
      rewardName: '7-Eleven $30 Voucher',
      rewardNameZh: '7-Eleven $30 代用券',
      points: 150,
      date: '2024-08-20',
      status: 'delivered'
    },
    {
      id: '2',
      rewardName: 'Digital Achievement Badge',
      rewardNameZh: '數位成就徽章',
      points: 25,
      date: '2024-08-18',
      status: 'claimed'
    },
    {
      id: '3',
      rewardName: 'Starbucks $40 Gift Card',
      rewardNameZh: '星巴克 $40 禮品卡',
      points: 160,
      date: '2024-08-15',
      status: 'delivered'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Rewards', nameZh: '所有獎勵' },
    { id: 'coupon', name: 'Gift Cards & Vouchers', nameZh: '禮品卡及代用券' },
    { id: 'physical', name: 'Educational Items', nameZh: '教育用品' },
    { id: 'digital', name: 'Digital Rewards', nameZh: '數位獎勵' }
  ];

  const filteredRewards = selectedCategory === 'all' 
    ? availableRewards 
    : availableRewards.filter(reward => reward.category === selectedCategory);

  const handleRedeem = (reward: Reward) => {
    if (state.dashboard.totalPoints >= reward.points && reward.available) {
      setShowRedeemDialog(reward);
    }
  };

  const confirmRedeem = () => {
    if (!showRedeemDialog) return;
    
    const reward = showRedeemDialog;
    
    // Determine redemption method based on category
    let finalMethod: 'qr' | 'direct' | 'instant';
    if (reward.category === 'digital') {
      finalMethod = 'instant';
    } else if (reward.category === 'coupon') {
      finalMethod = 'qr'; // Always QR for coupons
    } else {
      finalMethod = redemptionMethod; // Physical items can choose
    }
    
    // Generate redemption data
    const redemptionData: RedemptionData = {
      rewardId: reward.id,
      rewardName: reward.name,
      method: finalMethod,
      qrCodeId: finalMethod === 'qr' ? `REACH-QR-${reward.couponId || reward.id}-${Date.now()}` : null,
      couponCode: reward.couponId || `REACH-${reward.id}`,
      expiryDate: reward.expiryDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      merchantName: reward.merchantName || 'REACH Store'
    };
    
    setShowSuccessDialog(redemptionData);
    setShowRedeemDialog(null);
    console.log('Reward redeemed:', redemptionData);
    // In real app, would update points and add to history
  };

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    // Show toast or feedback in real app
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
    <div className="min-h-screen bg-gradient-to-b from-sky-25 to-emerald-25" style={{
      background: 'linear-gradient(to bottom, #f0f9ff, #ecfdf5)'
    }}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl text-gray-900">
            {state.language === 'zh' ? '獎勵商店' : 'Rewards Store'}
          </h2>
          <p className="text-gray-600">
            {state.language === 'zh' ? '用您的積分換取實用獎勵！' : 'Redeem your points for practical rewards!'}
          </p>
        </div>

        {/* Points Balance */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                <Coins className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <div className="text-3xl text-gray-900 mb-1">{state.dashboard.totalPoints}</div>
                <div className="text-gray-600">
                  {state.language === 'zh' ? '可用積分' : 'Available Points'}
                </div>
                <Badge className="bg-amber-500 text-white mt-2">
                  <Crown className="w-3 h-3 mr-1" />
                  {state.language === 'zh' ? '金牌會員' : 'Gold Member'}
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
              {state.language === 'zh' ? category.nameZh : category.name}
            </Button>
          ))}
        </div>

        {/* Featured Info */}
        {selectedCategory === 'all' && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-200">
            <h3 className="text-lg text-gray-900 mb-2 flex items-center">
              <Sparkles className="w-5 h-5 text-blue-500 mr-2" />
              {state.language === 'zh' ? '實用獎勵說明' : 'Reward Types'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="bg-white rounded-lg p-3">
                <QrCode className="w-6 h-6 text-green-500 mb-2" />
                <p className="font-medium text-gray-900 mb-1">
                  {state.language === 'zh' ? '禮品卡及代用券' : 'Gift Cards & Vouchers'}
                </p>
                <p className="text-gray-600">
                  {state.language === 'zh' ? 'QR碼商戶兌換' : 'QR code merchant redemption'}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <Gift className="w-6 h-6 text-purple-500 mb-2" />
                <p className="font-medium text-gray-900 mb-1">
                  {state.language === 'zh' ? '教育用品' : 'Educational Items'}
                </p>
                <p className="text-gray-600">
                  {state.language === 'zh' ? '取貨或直接配送' : 'Pickup or direct delivery'}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <Zap className="w-6 h-6 text-blue-500 mb-2" />
                <p className="font-medium text-gray-900 mb-1">
                  {state.language === 'zh' ? '數位獎勵' : 'Digital Rewards'}
                </p>
                <p className="text-gray-600">
                  {state.language === 'zh' ? '即時啟用' : 'Instant activation'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Rewards Grid */}
        <div className="space-y-4">
          <h3 className="text-lg text-gray-900">
            {state.language === 'zh' ? '可用獎勵' : 'Available Rewards'}
          </h3>
          
          {filteredRewards.map((reward) => {
            const Icon = reward.icon;
            const canAfford = state.dashboard.totalPoints >= reward.points;
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
                      <h4 className="text-lg text-gray-900 mb-1">
                        {state.language === 'zh' ? reward.nameZh : reward.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {state.language === 'zh' ? reward.descriptionZh : reward.description}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-blue-100 text-blue-800">
                          {reward.points} {state.language === 'zh' ? '積分' : 'points'}
                        </Badge>
                        <Badge variant="outline">
                          {reward.category === 'coupon' ? (state.language === 'zh' ? '優惠券' : 'voucher') : 
                           reward.category === 'physical' ? (state.language === 'zh' ? '實體' : 'physical') :
                           (state.language === 'zh' ? '數位' : 'digital')}
                        </Badge>
                        {reward.category === 'coupon' && reward.expiryDate && (
                          <Badge className="bg-amber-100 text-amber-800 text-xs">
                            {state.language === 'zh' ? '到期：' : 'Expires: '}{new Date(reward.expiryDate).toLocaleDateString()}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      {!reward.available ? (
                        <Badge className="bg-gray-500 text-white">
                          {state.language === 'zh' ? '缺貨' : 'Out of Stock'}
                        </Badge>
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
                          {canAfford ? (state.language === 'zh' ? '兌換' : 'Redeem') : 
                           `${state.language === 'zh' ? '還需要' : 'Need'} ${reward.points - state.dashboard.totalPoints} ${state.language === 'zh' ? '積分' : 'more'}`}
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
              <span>{state.language === 'zh' ? '兌換歷史' : 'Redemption History'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {redemptionHistory.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                {state.language === 'zh' ? '還沒有兌換記錄' : 'No redemptions yet'}
              </p>
            ) : (
              redemptionHistory.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(item.status)}
                    <div>
                      <p className="text-gray-900 font-medium">
                        {state.language === 'zh' ? item.rewardNameZh : item.rewardName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(item.date).toLocaleDateString()} • {item.points} {state.language === 'zh' ? '積分' : 'points'}
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
              <DialogTitle className="text-xl">
                {state.language === 'zh' ? '確認兌換' : 'Confirm Redemption'}
              </DialogTitle>
            </DialogHeader>
            
            {showRedeemDialog && (
              <div className="text-center space-y-4 py-4">
                <div className={`w-20 h-20 bg-gradient-to-br ${showRedeemDialog.color} rounded-full flex items-center justify-center mx-auto shadow-lg`}>
                  <showRedeemDialog.icon className="w-10 h-10 text-white" />
                </div>
                
                <div>
                  <h3 className="text-lg text-gray-900 mb-2">
                    {state.language === 'zh' ? showRedeemDialog.nameZh : showRedeemDialog.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {state.language === 'zh' ? showRedeemDialog.descriptionZh : showRedeemDialog.description}
                  </p>
                  
                  {/* Show redemption method choice only for physical items */}
                  {showRedeemDialog.category === 'physical' && (
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 mb-4">
                      <p className="text-blue-800 text-sm mb-3">
                        {state.language === 'zh' ? '選擇領取方式：' : 'Choose delivery method:'}
                      </p>
                      <RadioGroup value={redemptionMethod} onValueChange={(value: 'qr' | 'direct') => setRedemptionMethod(value)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="qr" id="qr" />
                          <Label htmlFor="qr" className="flex items-center text-sm">
                            <QrCode className="w-4 h-4 mr-2" />
                            {state.language === 'zh' ? 'QR碼（到中心領取）' : 'QR Code (pickup at center)'}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="direct" id="direct" />
                          <Label htmlFor="direct" className="flex items-center text-sm">
                            <User className="w-4 h-4 mr-2" />
                            {state.language === 'zh' ? '直接給孩子' : 'Direct to child'}
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}
                  
                  {/* Show info for coupon redemption */}
                  {showRedeemDialog.category === 'coupon' && (
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200 mb-4">
                      <div className="flex items-center justify-center mb-2">
                        <QrCode className="w-5 h-5 text-green-600 mr-2" />
                        <p className="text-green-800 text-sm font-medium">
                          {state.language === 'zh' ? '商戶QR碼兌換' : 'Merchant QR Code Redemption'}
                        </p>
                      </div>
                      <p className="text-green-700 text-xs">
                        {state.language === 'zh' ? 
                          `在${showRedeemDialog.merchantName}出示QR碼即可使用` :
                          `Show QR code at ${showRedeemDialog.merchantName} to redeem`
                        }
                      </p>
                    </div>
                  )}
                  
                  {/* Show info for digital rewards */}
                  {showRedeemDialog.category === 'digital' && (
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-200 mb-4">
                      <div className="flex items-center justify-center mb-2">
                        <Zap className="w-5 h-5 text-purple-600 mr-2" />
                        <p className="text-purple-800 text-sm font-medium">
                          {state.language === 'zh' ? '即時啟用' : 'Instant Activation'}
                        </p>
                      </div>
                      <p className="text-purple-700 text-xs">
                        {state.language === 'zh' ? '獎勵將立即添加到您的帳戶' : 'Reward will be added to your account immediately'}
                      </p>
                    </div>
                  )}
                  
                  <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                    <p className="text-amber-800">
                      {state.language === 'zh' ? '花費：' : 'Cost: '} 
                      <strong>{showRedeemDialog.points} {state.language === 'zh' ? '積分' : 'points'}</strong>
                    </p>
                    <p className="text-amber-700 text-sm">
                      {state.language === 'zh' ? '剩餘：' : 'Remaining: '} 
                      {state.dashboard.totalPoints - showRedeemDialog.points} {state.language === 'zh' ? '積分' : 'points'}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowRedeemDialog(null)}
                    className="flex-1"
                  >
                    {state.language === 'zh' ? '取消' : 'Cancel'}
                  </Button>
                  <Button 
                    onClick={confirmRedeem}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                  >
                    {state.language === 'zh' ? '立即兌換' : 'Redeem Now'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Success Dialog */}
        <Dialog open={showSuccessDialog !== null} onOpenChange={() => setShowSuccessDialog(null)}>
          <DialogContent className="w-[340px] rounded-3xl">
            <DialogHeader className="text-center">
              <DialogTitle className="text-xl">
                🎉 {state.language === 'zh' ? '兌換成功！' : 'Redemption Successful!'}
              </DialogTitle>
            </DialogHeader>
            
            {showSuccessDialog && (
              <div className="text-center space-y-4 py-4">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle className="w-12 h-12 text-emerald-600" />
                </div>
                
                <div>
                  <h3 className="text-lg text-gray-900 mb-3">
                    {showSuccessDialog.rewardName}
                  </h3>
                  
                  {/* QR Code for coupons and physical pickup */}
                  {showSuccessDialog.qrCodeId && (
                    <div className="bg-gray-50 rounded-lg p-4 border">
                      <div className="w-32 h-32 mx-auto mb-3 border rounded-lg overflow-hidden">
                        <ImageWithFallback 
                          src="https://images.unsplash.com/photo-1603880920696-faf1d9ccc6a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxRUiUyMGNvZGUlMjBwbGFjZWhvbGRlcnxlbnwxfHx8fDE3NTYwMTgyMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                          alt="QR Code"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        {state.language === 'zh' ? 
                          `在${showSuccessDialog.merchantName}出示此QR碼` : 
                          `Show this QR code at ${showSuccessDialog.merchantName}`
                        }
                      </p>
                      <div className="bg-white rounded p-2 border text-xs font-mono">
                        ID: {showSuccessDialog.qrCodeId}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(showSuccessDialog.qrCodeId || '')}
                        className="mt-2"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        {state.language === 'zh' ? '複製ID' : 'Copy ID'}
                      </Button>
                    </div>
                  )}
                  
                  {/* Direct delivery message */}
                  {showSuccessDialog.method === 'direct' && (
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <User className="w-12 h-12 mx-auto mb-3 text-green-600" />
                      <p className="text-sm text-green-700">
                        {state.language === 'zh' ? 
                          `您的獎勵將由REACH工作人員直接給予${state.user.childName}` :
                          `Your reward will be given directly to ${state.user.childName} by REACH staff`
                        }
                      </p>
                    </div>
                  )}
                  
                  {/* Instant activation message */}
                  {showSuccessDialog.method === 'instant' && (
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <Zap className="w-12 h-12 mx-auto mb-3 text-purple-600" />
                      <p className="text-sm text-purple-700">
                        {state.language === 'zh' ? 
                          '數位獎勵已添加到您的帳戶！' :
                          'Digital reward has been added to your account!'
                        }
                      </p>
                    </div>
                  )}
                  
                  {/* Coupon code info */}
                  {showSuccessDialog.couponCode && showSuccessDialog.method === 'qr' && (
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 mt-3">
                      <p className="text-blue-800 text-sm mb-1">
                        {state.language === 'zh' ? '優惠券代碼：' : 'Coupon Code:'}
                      </p>
                      <div className="bg-white rounded p-2 border text-sm font-mono">
                        {showSuccessDialog.couponCode}
                      </div>
                      <p className="text-xs text-blue-600 mt-1">
                        {state.language === 'zh' ? '有效期至：' : 'Valid until: '}
                        {new Date(showSuccessDialog.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={() => setShowSuccessDialog(null)}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                >
                  {state.language === 'zh' ? '太好了！' : 'Great!'}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}