import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useParentContext } from '../contexts/ParentContext';
import { CommunityLeaderboardFull } from './CommunityLeaderboardFull';
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Share2, 
  Plus,
  Image,
  Video,
  Star,
  Pin,
  Calendar,
  ThumbsUp,
  MessageCircle,
  Trophy,
  Sparkles,
  Camera,
  Crown,
  Medal,
  Award
} from 'lucide-react';

interface ForumPost {
  id: string;
  author: string;
  authorZh?: string;
  avatar: string;
  role: 'parent' | 'teacher' | 'staff';
  title: string;
  titleZh?: string;
  content: string;
  contentZh?: string;
  timestamp: string;
  likes: number;
  comments: number;
  tags: string[];
  pinned?: boolean;
  hasImage?: boolean;
  hasVideo?: boolean;
}

interface CommunityStats {
  totalFamilies: number;
  postsThisWeek: number;
  activeToday: number;
}

interface LeaderboardEntry {
  id: string;
  parentName: string;
  childName: string;
  points: number;
  avatar: string;
  rank: number;
  weeklyPoints: number;
  streak: number;
}

export function CommunityForumPage() {
  const { state, t } = useParentContext();
  const [selectedTab, setSelectedTab] = useState<'recent' | 'popular' | 'announcements'>('recent');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [showFullLeaderboard, setShowFullLeaderboard] = useState(false);

  const communityStats: CommunityStats = {
    totalFamilies: 156,
    postsThisWeek: 23,
    activeToday: 12
  };

  // Weekly leaderboard data
  const weeklyLeaderboard: LeaderboardEntry[] = [
    {
      id: '1',
      parentName: 'Sarah Chen',
      childName: 'Emma',
      points: 285,
      avatar: 'SC',
      rank: 1,
      weeklyPoints: 125,
      streak: 7
    },
    {
      id: '2',
      parentName: 'Lisa Wong',
      childName: 'Alex',
      points: 267,
      avatar: 'LW',
      rank: 2,
      weeklyPoints: 118,
      streak: 5
    },
    {
      id: '3',
      parentName: 'David Liu',
      childName: 'Marcus',
      points: 251,
      avatar: 'DL',
      rank: 3,
      weeklyPoints: 112,
      streak: 6
    },
    {
      id: '4',
      parentName: 'Maria Garcia',
      childName: 'Sofia',
      points: 235,
      avatar: 'MG',
      rank: 4,
      weeklyPoints: 98,
      streak: 4
    },
    {
      id: '5',
      parentName: 'James Johnson',
      childName: 'Lily',
      points: 220,
      avatar: 'JJ',
      rank: 5,
      weeklyPoints: 89,
      streak: 3
    }
  ];

  const forumPosts: ForumPost[] = [
    {
      id: '1',
      author: 'Sarah Chen',
      authorZh: '陳莎拉',
      avatar: 'SC',
      role: 'parent',
      title: 'Emma\'s First Reading Milestone! 🎉',
      titleZh: 'Emma的第一個閱讀里程碑！🎉',
      content: 'So excited to share that Emma just read her first complete book today! The REACH reading program has been amazing. Any book recommendations for next steps?',
      contentZh: '很興奮地分享Emma今天讀完了她的第一本完整的書！REACH閱讀計劃非常棒。有什麼下一步的書推薦嗎？',
      timestamp: '2024-08-23T10:30:00Z',
      likes: 12,
      comments: 8,
      tags: ['reading', 'milestone', 'celebration'],
      hasImage: true
    },
    {
      id: '2',
      author: 'Ms. Wong',
      authorZh: '黃老師',
      avatar: 'MW',
      role: 'teacher',
      title: 'Weekly Math Tips for Parents',
      titleZh: '給家長的每週數學小貼士',
      content: 'Here are some fun ways to practice counting at home: use snacks, toys, or even stairs! Making math part of daily activities helps children learn naturally.',
      contentZh: '以下是在家練習數數的有趣方法：使用零食、玩具，甚至樓梯！讓數學成為日常活動的一部分，幫助孩子自然地學習。',
      timestamp: '2024-08-23T09:15:00Z',
      likes: 18,
      comments: 5,
      tags: ['math', 'tips', 'home-learning'],
      pinned: true
    },
    {
      id: '3',
      author: 'David Liu',
      authorZh: '劉大衛',
      avatar: 'DL',
      role: 'parent',
      title: 'Art Project Success!',
      titleZh: '藝術項目成功！',
      content: 'My son Alex created the most beautiful painting today. The creativity that REACH nurtures is incredible. Sharing some photos!',
      contentZh: '我兒子Alex今天創作了最美麗的畫作。REACH培養的創造力令人難以置信。分享一些照片！',
      timestamp: '2024-08-22T16:45:00Z',
      likes: 15,
      comments: 6,
      tags: ['art', 'creativity', 'proud-parent'],
      hasImage: true
    },
    {
      id: '4',
      author: 'REACH Official',
      authorZh: 'REACH官方',
      avatar: 'RO',
      role: 'staff',
      title: 'Workshop: Parent-Child Learning Activities',
      titleZh: '工作坊：親子學習活動',
      content: 'Join us this Saturday for a special workshop on interactive learning activities you can do at home with your child. Registration link in comments!',
      contentZh: '這個星期六加入我們的特別工作坊，學習在家與孩子一起進行的互動學習活動。註冊鏈接在評論中！',
      timestamp: '2024-08-22T14:20:00Z',
      likes: 25,
      comments: 12,
      tags: ['workshop', 'parent-child', 'learning'],
      pinned: true,
      hasVideo: true
    }
  ];

  const filteredPosts = () => {
    switch (selectedTab) {
      case 'recent':
        return forumPosts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      case 'popular':
        return forumPosts.sort((a, b) => b.likes - a.likes);
      case 'announcements':
        return forumPosts.filter(post => post.role === 'staff' || post.pinned);
      default:
        return forumPosts;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'teacher':
        return 'bg-blue-100 text-blue-800';
      case 'staff':
        return 'bg-purple-100 text-purple-800';
      case 'parent':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'teacher':
        return state.language === 'zh' ? '老師' : 'Teacher';
      case 'staff':
        return state.language === 'zh' ? '工作人員' : 'Staff';
      case 'parent':
        return state.language === 'zh' ? '家長' : 'Parent';
      default:
        return role;
    }
  };

  const handleCreatePost = () => {
    console.log('Creating post:', { title: newPostTitle, content: newPostContent });
    setNewPostTitle('');
    setNewPostContent('');
    setShowNewPost(false);
    // In real app, would create the post
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - postTime.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-medium text-gray-600">#{rank}</span>;
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
        return 'from-blue-50 to-indigo-50 border-blue-200';
    }
  };

  // If showing full leaderboard, render that component
  if (showFullLeaderboard) {
    return <CommunityLeaderboardFull />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-25 to-emerald-25" style={{
      background: 'linear-gradient(to bottom, #f0f9ff, #ecfdf5)'
    }}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl text-gray-900">{t('community.title', 'Community')}</h2>
          <p className="text-gray-600">{t('community.subtitle', 'Connect with other REACH families')}</p>
        </div>

        {/* Weekly Leaderboard */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-purple-600" />
              <span>Weekly Champions</span>
              <Badge className="bg-purple-100 text-purple-800 ml-2">
                🏆 Top 3
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {weeklyLeaderboard.slice(0, 3).map((entry) => (
              <div 
                key={entry.id} 
                className={`flex items-center space-x-3 p-3 rounded-lg border bg-gradient-to-r ${getRankColor(entry.rank)}`}
              >
                <div className="flex items-center justify-center w-8 h-8">
                  {getRankIcon(entry.rank)}
                </div>
                
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-400 text-white">
                    {entry.avatar}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{entry.parentName}</span>
                    {entry.rank === 1 && <Crown className="w-4 h-4 text-yellow-500" />}
                  </div>
                  <p className="text-sm text-gray-600">{entry.childName}'s parent</p>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-medium text-gray-900">+{entry.weeklyPoints}</div>
                  <div className="text-xs text-gray-600">this week</div>
                </div>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              className="w-full mt-3" 
              size="sm"
              onClick={() => setShowFullLeaderboard(true)}
            >
              <Trophy className="w-4 h-4 mr-2" />
              View Full Leaderboard
            </Button>
          </CardContent>
        </Card>

        {/* Community Stats */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-xl text-gray-900">{communityStats.totalFamilies}</div>
                <div className="text-xs text-gray-600">{t('community.families', 'families')}</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <MessageSquare className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-xl text-gray-900">{communityStats.postsThisWeek}</div>
                <div className="text-xs text-gray-600">Posts this week</div>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Sparkles className="w-6 h-6 text-amber-600" />
                </div>
                <div className="text-xl text-gray-900">{communityStats.activeToday}</div>
                <div className="text-xs text-gray-600">Active today</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Create Post Button */}
        <Dialog open={showNewPost} onOpenChange={setShowNewPost}>
          <DialogTrigger asChild>
            <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white h-12">
              <Plus className="w-5 h-5 mr-2" />
              Share Your Thoughts
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[90vw] max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                placeholder="Post title..."
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
              />
              <Textarea
                placeholder={t('community.postPlaceholder', "Share your thoughts, questions, or celebrate your child's progress...")}
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={4}
              />
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Camera className="w-4 h-4 mr-2" />
                  {t('community.photo', 'Photo')}
                </Button>
                <Button variant="outline" size="sm">
                  <Video className="w-4 h-4 mr-2" />
                  {t('community.video', 'Video')}
                </Button>
              </div>
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewPost(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreatePost}
                  disabled={!newPostTitle.trim() || !newPostContent.trim()}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  {t('community.post', 'Post')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Filter Tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <Button
            variant={selectedTab === 'recent' ? "default" : "outline"}
            onClick={() => setSelectedTab('recent')}
            className="whitespace-nowrap"
          >
            Recent
          </Button>
          <Button
            variant={selectedTab === 'popular' ? "default" : "outline"}
            onClick={() => setSelectedTab('popular')}
            className="whitespace-nowrap"
          >
            Popular
          </Button>
          <Button
            variant={selectedTab === 'announcements' ? "default" : "outline"}
            onClick={() => setSelectedTab('announcements')}
            className="whitespace-nowrap"
          >
            Announcements
          </Button>
        </div>

        {/* Forum Posts */}
        <div className="space-y-4">
          {filteredPosts().map((post) => (
            <Card key={post.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                {/* Post Header */}
                <div className="flex items-start space-x-3 mb-4">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-400 text-white">
                      {post.avatar}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {state.language === 'zh' ? (post.authorZh || post.author) : post.author}
                      </span>
                      <Badge className={getRoleColor(post.role)}>
                        {getRoleLabel(post.role)}
                      </Badge>
                      {post.pinned && <Pin className="w-4 h-4 text-amber-500" />}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{formatTimeAgo(post.timestamp)}</span>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  <h3 className="text-lg text-gray-900 mb-2">
                    {state.language === 'zh' ? (post.titleZh || post.title) : post.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {state.language === 'zh' ? (post.contentZh || post.content) : post.content}
                  </p>
                </div>

                {/* Media Indicators */}
                {(post.hasImage || post.hasVideo) && (
                  <div className="flex space-x-2 mb-4">
                    {post.hasImage && (
                      <Badge variant="outline" className="text-xs">
                        <Image className="w-3 h-3 mr-1" />
                        Image
                      </Badge>
                    )}
                    {post.hasVideo && (
                      <Badge variant="outline" className="text-xs">
                        <Video className="w-3 h-3 mr-1" />
                        Video
                      </Badge>
                    )}
                  </div>
                )}

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex space-x-4">
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-red-500">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-500">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {post.comments}
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-green-500">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button variant="outline" className="w-full">
            {t('community.loadMore', 'Load More Posts')}
          </Button>
        </div>
      </div>
    </div>
  );
}