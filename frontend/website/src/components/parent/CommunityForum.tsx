import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { useParentContext } from '../contexts/ParentContext';
import { Heart, MessageCircle, Share, Plus, Video, Image, BookOpen, Users } from 'lucide-react';

interface Post {
  id: string;
  author: string;
  authorZh: string;
  content: string;
  contentZh: string;
  type: 'text' | 'video' | 'resource';
  likes: number;
  comments: number;
  timeAgo: string;
  timeAgoZh: string;
  isReachPost?: boolean;
}

export function CommunityForum() {
  const { state, t } = useParentContext();
  const [newPost, setNewPost] = useState('');
  const [posts] = useState<Post[]>([
    {
      id: '1',
      author: 'REACH Team',
      authorZh: 'REACH團隊',
      content: 'New learning resources for developing reading skills at home! Check out our latest video series on phonics fundamentals.',
      contentZh: '在家培養閱讀技能的新學習資源！查看我們最新的語音基礎視頻系列。',
      type: 'video',
      likes: 24,
      comments: 8,
      timeAgo: '2 hours ago',
      timeAgoZh: '2小時前',
      isReachPost: true,
    },
    {
      id: '2',
      author: 'Maria Santos',
      authorZh: '瑪利亞·桑托斯',
      content: 'My daughter Emma loved the math activities this week! She\'s finally understanding addition. Thank you REACH team for the creative worksheets! 🌟',
      contentZh: '我女兒Emma這週很喜歡數學活動！她終於理解加法了。感謝REACH團隊提供的創意工作表！🌟',
      type: 'text',
      likes: 12,
      comments: 5,
      timeAgo: '4 hours ago',
      timeAgoZh: '4小時前',
    },
    {
      id: '3',
      author: 'REACH Team',
      authorZh: 'REACH團隊',
      content: 'Parent Workshop: "Supporting Your Child\'s Learning at Home" - Join us this Saturday at 10 AM. Free for all REACH families!',
      contentZh: '家長工作坊："在家支持孩子的學習" - 本週六上午10點加入我們。所有REACH家庭免費！',
      type: 'resource',
      likes: 18,
      comments: 12,
      timeAgo: '1 day ago',
      timeAgoZh: '1天前',
      isReachPost: true,
    },
    {
      id: '4',
      author: 'David Chen',
      authorZh: '陳大偉',
      content: 'Does anyone have tips for encouraging reluctant readers? My son loves the stories but struggles with motivation to read independently.',
      contentZh: '有人可以分享鼓勵不願意閱讀的孩子的技巧嗎？我兒子喜歡故事，但缺乏獨立閱讀的動力。',
      type: 'text',
      likes: 8,
      comments: 15,
      timeAgo: '1 day ago',
      timeAgoZh: '1天前',
    },
  ]);

  const handlePost = () => {
    if (newPost.trim()) {
      // In real app, this would submit to API
      setNewPost('');
    }
  };

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'resource':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl text-gray-900">{t('community.title', 'Community')}</h2>
          <p className="text-sm text-gray-600">{t('community.subtitle', 'Connect with other REACH families')}</p>
        </div>
        <div className="flex items-center space-x-1 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span>127 {t('community.families', 'families')}</span>
        </div>
      </div>

      {/* Create Post */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                {state.user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Textarea
                placeholder={t('community.postPlaceholder', "Share your thoughts, questions, or celebrate your child's progress...")}
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-[80px] resize-none"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="text-gray-500">
                    <Image className="w-4 h-4 mr-1" />
                    {t('community.photo', 'Photo')}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-500">
                    <Video className="w-4 h-4 mr-1" />
                    {t('community.video', 'Video')}
                  </Button>
                </div>
                <Button 
                  size="sm" 
                  onClick={handlePost}
                  disabled={!newPost.trim()}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  {t('community.post', 'Post')}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className={post.isReachPost ? 'border-blue-200 bg-blue-50/30' : ''}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className={post.isReachPost ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}>
                    {post.isReachPost ? 'R' : (state.language === 'zh' ? post.authorZh : post.author).split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm text-gray-900">
                      {state.language === 'zh' ? post.authorZh : post.author}
                    </span>
                    {post.isReachPost && (
                      <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                        {t('community.reachOfficial', 'REACH Official')}
                      </Badge>
                    )}
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">
                      {state.language === 'zh' ? post.timeAgoZh : post.timeAgo}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-800 mb-3">
                    {state.language === 'zh' ? post.contentZh : post.content}
                  </p>
                  
                  {post.type === 'video' && (
                    <div className="bg-gray-100 rounded-lg p-3 mb-3 flex items-center space-x-2">
                      <Video className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">
                        {t('community.videoLabel', 'Video: Phonics Fundamentals')}
                      </span>
                    </div>
                  )}
                  
                  {post.type === 'resource' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3 flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-800">
                        {t('community.workshopLabel', 'Workshop Registration')}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <button className="flex items-center space-x-1 hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4" />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments}</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-gray-700 transition-colors">
                      <Share className="w-4 h-4" />
                      <span>{t('community.share', 'Share')}</span>
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center py-4">
        <Button variant="outline" className="w-full">
          {t('community.loadMore', 'Load More Posts')}
        </Button>
      </div>
    </div>
  );
}