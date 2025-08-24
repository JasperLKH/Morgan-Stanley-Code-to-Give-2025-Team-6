import React, { useState, useEffect } from 'react';
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
  User
} from 'lucide-react';
import { apiService } from '../../services/api';
import { useUser } from '../../contexts/UserContext';

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
  const { user: currentUser } = useUser();
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

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await apiService.getForumPosts();
      if (response.success && response.data) {
        setPosts(response.data as ForumPost[]);
      } else {
        // Use mock data if API fails
        console.log('API failed, using mock data');
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

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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