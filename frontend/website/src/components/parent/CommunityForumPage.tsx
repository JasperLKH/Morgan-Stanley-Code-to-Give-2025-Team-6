import React, { useState, useEffect } from 'react';
import { CommunityLeaderboardFull } from './CommunityLeaderboardFull';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { 
  MessageSquare, 
  Heart, 
  Plus, 
  Search, 
  Filter,
  Loader2,
  Clock,
  User,
  Trophy,
  Crown
} from 'lucide-react';
import { apiService } from '../../services/api';
import { useParentContext } from "../contexts/ParentContext";

interface ForumPost {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    username: string;
    name: string;
  };
  created_at: string;
  category?: string;
  likes_count?: number;
  comments_count?: number;
  liked_by_user?: boolean;
}

interface Comment {
  id: number;
  content: string;
  author: {
    id: number;
    username: string;
    name: string;
  };
  created_at: string;
}

export function CommunityForumPage() {
  const { state, t } = useParentContext();
  const currentUser = state.user;
  
  // Log user ID for debugging
  console.log('CommunityForumPage - Current User ID:', currentUser?.id);
  
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [loading, setLoading] = useState(true);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showNewPostDialog, setShowNewPostDialog] = useState(false);
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [showFullLeaderboard, setShowFullLeaderboard] = useState(false);

  // Weekly leaderboard data (mock)
  const weeklyLeaderboard = [
    {
      id: 1,
      parentName: 'Sarah Chen',
      childName: 'Emma',
      points: 285,
      avatar: 'SC',
      rank: 1,
      weeklyPoints: 125,
      streak: 7
    },
    {
      id: 2,
      parentName: 'Lisa Wong',
      childName: 'Alex',
      points: 267,
      avatar: 'LW',
      rank: 2,
      weeklyPoints: 118,
      streak: 5
    },
    {
      id: 3,
      parentName: 'David Liu',
      childName: 'Marcus',
      points: 251,
      avatar: 'DL',
      rank: 3,
      weeklyPoints: 112,
      streak: 6
    }
  ];

  // Helper for leaderboard icons
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <span role="img" aria-label="crown">👑</span>;
      case 2:
        return <span role="img" aria-label="medal">🥈</span>;
      case 3:
        return <span role="img" aria-label="award">🥉</span>;
      default:
        return <span className="text-gray-500">#{rank}</span>;
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await apiService.getForumPosts();
      if (response.success && response.data && Array.isArray(response.data)) {
        setPosts(response.data as ForumPost[]);
      } else {
        // Use mock data if API fails or data is not an array
        console.log('API failed or returned non-array data, using mock data');
        setPosts(mockPosts);
      }
    } catch (error) {
      console.error('Error fetching forum posts:', error);
      // Use mock data as fallback
      setPosts(mockPosts);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for development
  const mockPosts: ForumPost[] = [
    {
      id: 1,
      title: "Welcome to the REACH Community Forum!",
      content: "This is a space for parents and teachers to connect, share experiences, and support each other in our children's learning journey.",
      author: {
        id: 1,
        username: "admin",
        name: "REACH Admin"
      },
      created_at: new Date().toISOString(),
      category: "general",
      likes_count: 5,
      comments_count: 3,
      liked_by_user: false
    },
    {
      id: 2,
      title: "Tips for Helping Kids with Homework",
      content: "Here are some effective strategies I've found helpful when my child struggles with homework assignments...",
      author: {
        id: 2,
        username: "parent_sarah",
        name: "Sarah Chen"
      },
      created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      category: "tips",
      likes_count: 12,
      comments_count: 8,
      liked_by_user: true
    },
    {
      id: 3,
      title: "Celebrating Small Wins",
      content: "My daughter just completed her first week of assignments! So proud of her progress. What achievements are you celebrating?",
      author: {
        id: 3,
        username: "proud_parent",
        name: "Mike Johnson"
      },
      created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      category: "achievements",
      likes_count: 18,
      comments_count: 15,
      liked_by_user: false
    }
  ];

  const fetchComments = async (postId: number) => {
    try {
      const response = await apiService.getForumComments(postId);
      if (response.success && response.data) {
        setComments(prev => ({
          ...prev,
          [postId]: response.data as Comment[]
        }));
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    
    try {
      const response = await apiService.createForumPost(
        newPostTitle,
        newPostContent,
        newPostCategory || undefined
      );
      
      if (response.success) {
        setNewPostTitle('');
        setNewPostContent('');
        setNewPostCategory('');
        setShowNewPostDialog(false);
        fetchPosts(); // Refresh posts
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLikePost = async (postId: number) => {
    try {
      const response = await apiService.toggleForumLike(postId);
      if (response.success) {
        fetchPosts(); // Refresh to get updated like count
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const togglePostExpansion = (postId: number) => {
    if (expandedPost === postId) {
      setExpandedPost(null);
    } else {
      setExpandedPost(postId);
      if (!comments[postId]) {
        fetchComments(postId);
      }
    }
  };

  const filteredPosts = Array.isArray(posts) ? posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) : [];

  const categories = ['all', 'general', 'homework-help', 'achievements', 'tips', 'questions'];

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2">Loading forum posts...</span>
      </div>
    );
  }

  if (showFullLeaderboard) {
    return <CommunityLeaderboardFull />;
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl text-gray-900">Community Forum</h2>
          <p className="text-sm text-gray-600">Connect with other parents and share experiences</p>
        </div>
        <Dialog open={showNewPostDialog} onOpenChange={setShowNewPostDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
              <DialogDescription>
                Share your thoughts, questions, or experiences with the community
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Category</label>
                <select
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-200 rounded-md text-sm"
                >
                  <option value="">Select category</option>
                  <option value="general">General Discussion</option>
                  <option value="homework-help">Homework Help</option>
                  <option value="achievements">Achievements</option>
                  <option value="tips">Tips & Advice</option>
                  <option value="questions">Questions</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Title</label>
                <Input
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="Enter post title..."
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Content</label>
                <Textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="mt-1 min-h-[100px]"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowNewPostDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleCreatePost}
                  disabled={!newPostTitle.trim() || !newPostContent.trim()}
                >
                  Post
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Leaderboard Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-purple-600" />
            <span>Weekly Champions</span>
            <Badge className="bg-purple-100 text-purple-800 ml-2">🏆 Top 3</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {weeklyLeaderboard.map((entry) => (
            <div key={entry.id} className="flex items-center space-x-3 p-3 rounded-lg border bg-gradient-to-r from-white to-purple-50">
              <div className="flex items-center justify-center w-8 h-8">
                {getRankIcon(entry.rank)}
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-700">
                {entry.avatar}
              </div>
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
          <Button variant="outline" className="w-full mt-3" size="sm" onClick={() => setShowFullLeaderboard(true)}>
            <Trophy className="w-4 h-4 mr-2" />
            View Full Leaderboard
          </Button>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border border-gray-200 rounded-md text-sm"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : 
                 category.split('-').map(word => 
                   word.charAt(0).toUpperCase() + word.slice(1)
                 ).join(' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No posts found</p>
              <p className="text-sm text-gray-400">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Be the first to start a discussion!'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {post.author?.name || post.author?.username || 'Anonymous'}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(post.created_at)}</span>
                        {post.category && (
                          <Badge variant="secondary" className="text-xs">
                            {post.category.replace('-', ' ')}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3">{post.content}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLikePost(post.id)}
                      className="flex items-center space-x-1"
                    >
                      <Heart className={`w-4 h-4 ${post.liked_by_user ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
                      <span className="text-sm">{post.likes_count || 0}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePostExpansion(post.id)}
                      className="flex items-center space-x-1"
                    >
                      <MessageSquare className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{post.comments_count || 0}</span>
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePostExpansion(post.id)}
                  >
                    {expandedPost === post.id ? 'Show Less' : 'Read More'}
                  </Button>
                </div>
                {/* Expanded Comments Section */}
                {expandedPost === post.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="mb-4">
                      <p className="text-gray-700">{post.content}</p>
                    </div>
                    {comments[post.id] && comments[post.id].length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-900">Comments</h4>
                        {comments[post.id].map((comment) => (
                          <div key={comment.id} className="flex space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                              <User className="w-3 h-3 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-sm font-medium text-gray-900">
                                  {comment.author?.name || comment.author?.username || 'Anonymous'}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {formatTimeAgo(comment.created_at)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}