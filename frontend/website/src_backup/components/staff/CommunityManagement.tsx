import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Plus, 
  Edit, 
  Heart, 
  MessageCircle, 
  Eye, 
  Users,
  Calendar,
  Trash2,
  Pin,
  Image as ImageIcon
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: string;
}

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole: 'staff' | 'parent';
  category: 'announcement' | 'tip' | 'event' | 'resource';
  createdDate: string;
  likes: number;
  comments: number;
  views: number;
  isPinned: boolean;
  status: 'published' | 'draft';
  imageUrl?: string;
}

interface NewPost {
  title: string;
  content: string;
  category: 'announcement' | 'tip' | 'event' | 'resource';
  status: 'published' | 'draft';
}

interface CommunityManagementProps {
  user: User;
}

export function CommunityManagement({ user }: CommunityManagementProps) {
  const [newPost, setNewPost] = useState<NewPost>({
    title: '',
    content: '',
    category: 'announcement',
    status: 'published'
  });

  const posts: CommunityPost[] = [
    {
      id: '1',
      title: '🎉 New Reading Program Launch!',
      content: 'We\'re excited to announce our new reading program designed to help kindergarten students develop strong literacy skills. This program includes interactive storytelling sessions, reading comprehension activities, and family reading challenges.',
      author: 'REACH Team',
      authorRole: 'staff',
      category: 'announcement',
      createdDate: '2024-12-20',
      likes: 24,
      comments: 8,
      views: 156,
      isPinned: true,
      status: 'published'
    },
    {
      id: '2',
      title: '💡 Tips for Reading with Your Child',
      content: 'Here are some effective ways to make reading time more engaging: 1) Ask questions about the story, 2) Let your child predict what happens next, 3) Use different voices for characters, 4) Relate the story to your child\'s experiences.',
      author: 'REACH Team',
      authorRole: 'staff',
      category: 'tip',
      createdDate: '2024-12-19',
      likes: 18,
      comments: 5,
      views: 89,
      isPinned: false,
      status: 'published'
    },
    {
      id: '3',
      title: '📚 Emma\'s Reading Success!',
      content: 'So proud of Emma! She read her first complete book today and couldn\'t stop talking about the characters. Thank you REACH team for the amazing support!',
      author: 'Sarah Chen',
      authorRole: 'parent',
      category: 'resource',
      createdDate: '2024-12-18',
      likes: 32,
      comments: 12,
      views: 203,
      isPinned: false,
      status: 'published'
    },
    {
      id: '4',
      title: '🎨 Holiday Art & Craft Workshop',
      content: 'Join us for a special holiday workshop where children and parents can create festive decorations together. This event promotes creativity and family bonding.',
      author: 'REACH Team',
      authorRole: 'staff',
      category: 'event',
      createdDate: '2024-12-17',
      likes: 45,
      comments: 15,
      views: 278,
      isPinned: true,
      status: 'published'
    },
    {
      id: '5',
      title: 'Math Learning Resources',
      content: 'Collection of fun math activities and games that parents can use at home to reinforce learning.',
      author: 'REACH Team',
      authorRole: 'staff',
      category: 'resource',
      createdDate: '2024-12-15',
      likes: 0,
      comments: 0,
      views: 0,
      isPinned: false,
      status: 'draft'
    }
  ];

  const createPost = () => {
    console.log('Creating post:', newPost);
    setNewPost({
      title: '',
      content: '',
      category: 'announcement',
      status: 'published'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'announcement': return 'bg-blue-100 text-blue-800';
      case 'tip': return 'bg-green-100 text-green-800';
      case 'event': return 'bg-purple-100 text-purple-800';
      case 'resource': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'announcement': return '📢';
      case 'tip': return '💡';
      case 'event': return '📅';
      case 'resource': return '📚';
      default: return '📝';
    }
  };

  const publishedPosts = posts.filter(p => p.status === 'published');
  const draftPosts = posts.filter(p => p.status === 'draft');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-gray-900">Community Management</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create Post</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Community Post</DialogTitle>
              <DialogDescription>
                Share announcements, tips, events, or resources with parents
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Post Title</Label>
                <Input
                  id="title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  placeholder="Enter post title"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newPost.category}
                  onValueChange={(value: 'announcement' | 'tip' | 'event' | 'resource') => 
                    setNewPost({...newPost, category: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="announcement">📢 Announcement</SelectItem>
                    <SelectItem value="tip">💡 Educational Tip</SelectItem>
                    <SelectItem value="event">📅 Event</SelectItem>
                    <SelectItem value="resource">📚 Resource</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  placeholder="Write your post content..."
                  rows={6}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newPost.status}
                  onValueChange={(value: 'published' | 'draft') => 
                    setNewPost({...newPost, status: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Publish Immediately</SelectItem>
                    <SelectItem value="draft">Save as Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" className="flex-1">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Add Image
                </Button>
                <Button onClick={createPost} className="flex-1">
                  {newPost.status === 'published' ? 'Publish Post' : 'Save Draft'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl text-gray-900">{publishedPosts.reduce((sum, post) => sum + post.views, 0)}</p>
            <p className="text-xs text-gray-600">Total Views</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Heart className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-2xl text-gray-900">{publishedPosts.reduce((sum, post) => sum + post.likes, 0)}</p>
            <p className="text-xs text-gray-600">Total Likes</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <MessageCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl text-gray-900">{publishedPosts.reduce((sum, post) => sum + post.comments, 0)}</p>
            <p className="text-xs text-gray-600">Total Comments</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl text-gray-900">{publishedPosts.length}</p>
            <p className="text-xs text-gray-600">Published Posts</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="published" className="w-full">
        <TabsList>
          <TabsTrigger value="published">Published Posts ({publishedPosts.length})</TabsTrigger>
          <TabsTrigger value="drafts">Drafts ({draftPosts.length})</TabsTrigger>
        </TabsList>

        {/* Published Posts */}
        <TabsContent value="published" className="space-y-4 mt-6">
          {publishedPosts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getCategoryColor(post.category)} variant="secondary">
                        {getCategoryIcon(post.category)} {post.category}
                      </Badge>
                      {post.isPinned && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Pin className="w-3 h-3 mr-1" />
                          Pinned
                        </Badge>
                      )}
                      <Badge variant="outline">
                        {post.status}
                      </Badge>
                    </div>
                    <h3 className="text-lg text-gray-900 mb-2">{post.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">{post.content}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className={`text-xs ${
                            post.authorRole === 'staff' ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'
                          }`}>
                            {post.author.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span>{post.author}</span>
                      </div>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{post.createdDate}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center space-x-1">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className="text-lg text-gray-900">{post.likes}</span>
                    </div>
                    <p className="text-xs text-gray-600">Likes</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center space-x-1">
                      <MessageCircle className="w-4 h-4 text-blue-500" />
                      <span className="text-lg text-gray-900">{post.comments}</span>
                    </div>
                    <p className="text-xs text-gray-600">Comments</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center space-x-1">
                      <Eye className="w-4 h-4 text-green-500" />
                      <span className="text-lg text-gray-900">{post.views}</span>
                    </div>
                    <p className="text-xs text-gray-600">Views</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    View Post
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Pin className="w-4 h-4 mr-1" />
                    {post.isPinned ? 'Unpin' : 'Pin'}
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Draft Posts */}
        <TabsContent value="drafts" className="space-y-4 mt-6">
          {draftPosts.map((post) => (
            <Card key={post.id} className="border-dashed">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getCategoryColor(post.category)} variant="secondary">
                        {getCategoryIcon(post.category)} {post.category}
                      </Badge>
                      <Badge variant="outline" className="text-gray-600">
                        Draft
                      </Badge>
                    </div>
                    <h3 className="text-lg text-gray-900 mb-2">{post.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{post.content}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="bg-blue-500 text-white text-xs">
                            {post.author.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span>{post.author}</span>
                      </div>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Created: {post.createdDate}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1">
                    Publish Now
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit Draft
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}