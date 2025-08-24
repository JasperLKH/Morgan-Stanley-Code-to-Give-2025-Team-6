import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Heart, MessageCircle, Share, Plus, Video, Image, BookOpen, Users, Loader2 } from 'lucide-react';
import { apiService } from '../../services/api';
import { useUser } from '../../contexts/UserContext';

interface Post {
  id: number;
  title: string;
  content: string;
  author: number;
  author_name?: string;
  category?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  is_pinned: boolean;
  status: 'published' | 'draft' | 'pending';
  has_liked?: boolean;
}

interface Comment {
  id: number;
  content: string;
  author: number;
  author_name?: string;
  created_at: string;
}

export function CommunityForum() {
  const { user: currentUser } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commenting, setCommenting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await apiService.getForumPosts();
      if (response.success && response.data) {
        setPosts(response.data as Post[]);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim() || !newPostTitle.trim() || posting) return;
    
    setPosting(true);
    try {
      const response = await apiService.createForumPost(newPostTitle, newPost);
      if (response.success) {
        setNewPost('');
        setNewPostTitle('');
        fetchPosts(); // Refresh posts
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setPosting(false);
    }
  };

  const handleLikePost = async (postId: number) => {
    try {
      const response = await apiService.toggleForumLike(postId);
      if (response.success) {
        // Update the post's like count and status
        setPosts(prev => prev.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                likes_count: post.has_liked ? post.likes_count - 1 : post.likes_count + 1,
                has_liked: !post.has_liked 
              }
            : post
        ));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const fetchComments = async (postId: number) => {
    try {
      const response = await apiService.getForumComments(postId);
      if (response.success && response.data) {
        setComments(response.data as Comment[]);
        setSelectedPost(postId);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedPost || commenting) return;
    
    setCommenting(true);
    try {
      const response = await apiService.createForumComment(selectedPost, newComment);
      if (response.success) {
        setNewComment('');
        fetchComments(selectedPost); // Refresh comments
        // Also update the post's comment count
        setPosts(prev => prev.map(post => 
          post.id === selectedPost 
            ? { ...post, comments_count: post.comments_count + 1 }
            : post
        ));
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setCommenting(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  const getCategoryIcon = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'resource':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'video':
        return 'bg-red-100 text-red-700';
      case 'resource':
        return 'bg-blue-100 text-blue-700';
      case 'announcement':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2">Loading community posts...</span>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl text-gray-900">Community Forum</h2>
          <p className="text-sm text-gray-600">Connect with other parents and REACH team</p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90"
          onClick={() => setSelectedPost(null)} // Show create post form
        >
          <Plus className="w-4 h-4 mr-1" />
          New Post
        </Button>
      </div>

      {/* Create Post */}
      {selectedPost === null && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Share with the Community</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <input
              type="text"
              placeholder="Post title..."
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Textarea
              placeholder="What's on your mind? Share your experiences, questions, or tips with other parents..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Image className="w-4 h-4 mr-1" />
                  Photo
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="w-4 h-4 mr-1" />
                  Video
                </Button>
              </div>
              <Button
                onClick={handleCreatePost}
                disabled={!newPost.trim() || !newPostTitle.trim() || posting}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {posting ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 mr-1" />
                )}
                Post
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments View */}
      {selectedPost !== null && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Comments</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPost(null)}
              >
                Back to Posts
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Comment */}
            <div className="flex space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-blue-500 text-white text-xs">
                  {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
                <Button
                  size="sm"
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || commenting}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  {commenting ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : null}
                  Comment
                </Button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-3">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gray-400 text-white text-xs">
                        {comment.author_name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm text-gray-900">
                          {comment.author_name || 'Anonymous'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts List */}
      {selectedPost === null && (
        <div className="space-y-4">
          {posts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No posts yet</p>
                <p className="text-sm text-gray-400">Be the first to start a conversation!</p>
              </CardContent>
            </Card>
          ) : (
            posts
              .filter(post => post.status === 'published')
              .sort((a, b) => {
                // Pinned posts first, then by creation date
                if (a.is_pinned && !b.is_pinned) return -1;
                if (!a.is_pinned && b.is_pinned) return 1;
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
              })
              .map((post) => (
                <Card key={post.id} className={post.is_pinned ? 'border-blue-200 bg-blue-50/50' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-blue-500 text-white">
                          {post.author_name?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm text-gray-900">
                            {post.author_name || 'Anonymous'}
                          </span>
                          {post.category && (
                            <Badge className={getCategoryColor(post.category)} variant="secondary">
                              <div className="flex items-center space-x-1">
                                {getCategoryIcon(post.category)}
                                <span className="text-xs">{post.category}</span>
                              </div>
                            </Badge>
                          )}
                          {post.is_pinned && (
                            <Badge className="bg-yellow-100 text-yellow-700" variant="secondary">
                              Pinned
                            </Badge>
                          )}
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(post.created_at)}
                          </span>
                        </div>
                        
                        <h3 className="text-gray-900 mb-2 font-medium">{post.title}</h3>
                        <p className="text-gray-700 mb-3">{post.content}</p>
                        
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLikePost(post.id)}
                            className={`text-xs ${post.has_liked ? 'text-red-500' : 'text-gray-500'}`}
                          >
                            <Heart 
                              className={`w-4 h-4 mr-1 ${post.has_liked ? 'fill-current' : ''}`} 
                            />
                            {post.likes_count}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => fetchComments(post.id)}
                            className="text-xs text-gray-500"
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {post.comments_count}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs text-gray-500">
                            <Share className="w-4 h-4 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </div>
      )}
    </div>
  );
}
