import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Plus, 
  Edit, 
  Trash2,
  Gift, 
  Ticket,
  Coffee,
  ShoppingBag,
  Trophy,
  Calendar,
  Users,
  TrendingUp,
  BarChart3
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: string;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  category: 'voucher' | 'coupon' | 'activity' | 'digital';
  cost: number;
  stockQuantity?: number;
  isUnlimited: boolean;
  isActive: boolean;
  createdDate: string;
  totalRedeemed: number;
  icon: string;
  validUntil?: string;
  terms?: string;
}

interface RedemptionStats {
  totalRedemptions: number;
  pointsRedeemed: number;
  popularReward: string;
  activeRewards: number;
}

interface NewReward {
  name: string;
  description: string;
  category: 'voucher' | 'coupon' | 'activity' | 'digital';
  cost: number;
  stockQuantity: number;
  isUnlimited: boolean;
  validUntil: string;
  terms: string;
  icon: string;
}

interface RewardsManagementProps {
  user: User;
}

export function RewardsManagement({ user }: RewardsManagementProps) {
  const [newReward, setNewReward] = useState<NewReward>({
    name: '',
    description: '',
    category: 'voucher',
    cost: 50,
    stockQuantity: 10,
    isUnlimited: false,
    validUntil: '',
    terms: '',
    icon: 'ticket'
  });

  const rewards: Reward[] = [
    {
      id: '1',
      name: 'McDonald\'s Happy Meal',
      description: 'Free Happy Meal voucher redeemable at any McDonald\'s location',
      category: 'voucher',
      cost: 50,
      stockQuantity: 25,
      isUnlimited: false,
      isActive: true,
      createdDate: '2024-12-15',
      totalRedeemed: 12,
      icon: 'coffee',
      validUntil: '2025-03-31',
      terms: 'Valid at participating McDonald\'s locations. Cannot be combined with other offers.'
    },
    {
      id: '2',
      name: 'Toys"R"Us Discount',
      description: '20% off any single item at Toys"R"Us',
      category: 'coupon',
      cost: 75,
      stockQuantity: 15,
      isUnlimited: false,
      isActive: true,
      createdDate: '2024-12-10',
      totalRedeemed: 8,
      icon: 'shopping-bag',
      validUntil: '2025-02-28',
      terms: 'Excludes sale items and special promotions. One coupon per family.'
    },
    {
      id: '3',
      name: 'Science Museum Family Pass',
      description: 'Free entry for family of 4 to Hong Kong Science Museum',
      category: 'activity',
      cost: 100,
      stockQuantity: 8,
      isUnlimited: false,
      isActive: true,
      createdDate: '2024-12-01',
      totalRedeemed: 15,
      icon: 'trophy',
      validUntil: '2025-06-30',
      terms: 'Valid for 2 adults and 2 children. Must be used on weekdays only.'
    },
    {
      id: '4',
      name: 'Cinema Tickets',
      description: '2 free movie tickets for weekend shows',
      category: 'voucher',
      cost: 80,
      stockQuantity: 0,
      isUnlimited: false,
      isActive: false,
      createdDate: '2024-11-20',
      totalRedeemed: 20,
      icon: 'ticket',
      validUntil: '2025-01-31',
      terms: 'Valid for weekend shows only. Subject to availability.'
    },
    {
      id: '5',
      name: 'Digital Storybook Collection',
      description: 'Access to premium digital storybooks for 1 month',
      category: 'digital',
      cost: 30,
      isUnlimited: true,
      isActive: true,
      createdDate: '2024-12-05',
      totalRedeemed: 45,
      icon: 'gift',
      validUntil: '2025-12-31',
      terms: 'Digital access only. Requires internet connection.'
    }
  ];

  const redemptionStats: RedemptionStats = {
    totalRedemptions: 100,
    pointsRedeemed: 6850,
    popularReward: 'Digital Storybook Collection',
    activeRewards: rewards.filter(r => r.isActive).length
  };

  const createReward = () => {
    console.log('Creating reward:', newReward);
    setNewReward({
      name: '',
      description: '',
      category: 'voucher',
      cost: 50,
      stockQuantity: 10,
      isUnlimited: false,
      validUntil: '',
      terms: '',
      icon: 'ticket'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'voucher': return 'bg-blue-100 text-blue-800';
      case 'coupon': return 'bg-green-100 text-green-800';
      case 'activity': return 'bg-purple-100 text-purple-800';
      case 'digital': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string, iconName?: string) => {
    if (iconName) {
      switch (iconName) {
        case 'coffee': return Coffee;
        case 'shopping-bag': return ShoppingBag;
        case 'trophy': return Trophy;
        case 'ticket': return Ticket;
        case 'gift': return Gift;
        default: return Gift;
      }
    }
    
    switch (category) {
      case 'voucher': return Ticket;
      case 'coupon': return Gift;
      case 'activity': return Trophy;
      case 'digital': return Gift;
      default: return Gift;
    }
  };

  const activeRewards = rewards.filter(r => r.isActive);
  const inactiveRewards = rewards.filter(r => !r.isActive);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-gray-900">Rewards Management</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create Reward</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Reward</DialogTitle>
              <DialogDescription>
                Add a new reward that parents can redeem with their points
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Reward Name</Label>
                  <Input
                    id="name"
                    value={newReward.name}
                    onChange={(e) => setNewReward({...newReward, name: e.target.value})}
                    placeholder="Enter reward name"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newReward.category}
                    onValueChange={(value: 'voucher' | 'coupon' | 'activity' | 'digital') => 
                      setNewReward({...newReward, category: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="voucher">🎫 Voucher</SelectItem>
                      <SelectItem value="coupon">🎟️ Coupon</SelectItem>
                      <SelectItem value="activity">🏆 Activity</SelectItem>
                      <SelectItem value="digital">💻 Digital</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newReward.description}
                  onChange={(e) => setNewReward({...newReward, description: e.target.value})}
                  placeholder="Describe the reward"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cost">Point Cost</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={newReward.cost}
                    onChange={(e) => setNewReward({...newReward, cost: parseInt(e.target.value) || 0})}
                    min="1"
                    placeholder="Points required"
                  />
                </div>
                <div>
                  <Label htmlFor="validUntil">Valid Until</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={newReward.validUntil}
                    onChange={(e) => setNewReward({...newReward, validUntil: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="unlimited"
                    checked={newReward.isUnlimited}
                    onCheckedChange={(checked) => setNewReward({...newReward, isUnlimited: checked})}
                  />
                  <Label htmlFor="unlimited">Unlimited Stock</Label>
                </div>
                {!newReward.isUnlimited && (
                  <div className="flex-1">
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={newReward.stockQuantity}
                      onChange={(e) => setNewReward({...newReward, stockQuantity: parseInt(e.target.value) || 0})}
                      min="1"
                      placeholder="Available quantity"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Textarea
                  id="terms"
                  value={newReward.terms}
                  onChange={(e) => setNewReward({...newReward, terms: e.target.value})}
                  placeholder="Enter terms and conditions"
                  rows={2}
                />
              </div>

              <Button onClick={createReward} className="w-full">
                Create Reward
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Gift className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl text-gray-900">{redemptionStats.activeRewards}</p>
            <p className="text-xs text-gray-600">Active Rewards</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl text-gray-900">{redemptionStats.totalRedemptions}</p>
            <p className="text-xs text-gray-600">Total Redemptions</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl text-gray-900">{redemptionStats.pointsRedeemed}</p>
            <p className="text-xs text-gray-600">Points Redeemed</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-lg text-gray-900">{redemptionStats.popularReward}</p>
            <p className="text-xs text-gray-600">Most Popular</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active Rewards ({activeRewards.length})</TabsTrigger>
          <TabsTrigger value="inactive">Inactive ({inactiveRewards.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Active Rewards */}
        <TabsContent value="active" className="space-y-4 mt-6">
          {activeRewards.map((reward) => {
            const IconComponent = getCategoryIcon(reward.category, reward.icon);
            return (
              <Card key={reward.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg text-gray-900">{reward.name}</h3>
                          <Badge className={getCategoryColor(reward.category)} variant="secondary">
                            {reward.category}
                          </Badge>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{reward.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{reward.cost} points</span>
                          <span>•</span>
                          <span>Redeemed: {reward.totalRedeemed} times</span>
                          <span>•</span>
                          <span>
                            Stock: {reward.isUnlimited ? 'Unlimited' : `${reward.stockQuantity} left`}
                          </span>
                          {reward.validUntil && (
                            <>
                              <span>•</span>
                              <span>Valid until: {reward.validUntil}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {reward.terms && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-700">{reward.terms}</p>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      View Redemptions
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Deactivate
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Inactive Rewards */}
        <TabsContent value="inactive" className="space-y-4 mt-6">
          {inactiveRewards.map((reward) => {
            const IconComponent = getCategoryIcon(reward.category, reward.icon);
            return (
              <Card key={reward.id} className="opacity-75">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg text-gray-900">{reward.name}</h3>
                          <Badge className={getCategoryColor(reward.category)} variant="secondary">
                            {reward.category}
                          </Badge>
                          <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{reward.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{reward.cost} points</span>
                          <span>•</span>
                          <span>Redeemed: {reward.totalRedeemed} times</span>
                          <span>•</span>
                          <span>
                            Reason: {reward.stockQuantity === 0 ? 'Out of stock' : 'Manually deactivated'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      Reactivate
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Performing Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {rewards
                    .sort((a, b) => b.totalRedeemed - a.totalRedeemed)
                    .slice(0, 5)
                    .map((reward, index) => (
                      <div key={reward.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline">{index + 1}</Badge>
                          <span className="text-sm text-gray-900">{reward.name}</span>
                        </div>
                        <span className="text-sm text-gray-600">{reward.totalRedeemed} redemptions</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['voucher', 'coupon', 'activity', 'digital'].map((category) => {
                    const categoryRewards = rewards.filter(r => r.category === category);
                    const totalRedemptions = categoryRewards.reduce((sum, r) => sum + r.totalRedeemed, 0);
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge className={getCategoryColor(category)} variant="secondary">
                            {category}
                          </Badge>
                          <span className="text-sm text-gray-600">{categoryRewards.length} rewards</span>
                        </div>
                        <span className="text-sm text-gray-900">{totalRedemptions} total redemptions</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}