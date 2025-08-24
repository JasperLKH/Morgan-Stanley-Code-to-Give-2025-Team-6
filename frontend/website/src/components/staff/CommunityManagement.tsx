import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Edit,
  Heart,
  MessageCircle,
  Calendar,
  Trash2,
  Pin,
  Paperclip,
  Eye,
  Send,
  CheckCircle2,
  XCircle,
  Loader2,
  Plus,
} from "lucide-react";

type Role = "staff" | "parent";

interface User {
  id: string; // header "User-ID"
  name: string;
  role: Role;
}

/** ===== API TYPES inferred from your curls ===== */
type ApiUserSlim = { id: number; username: string; role: Role };

type ApiPost = {
  id: number;
  content: string;
  posted_by: ApiUserSlim;
  posted_by_name: string;
  posted_at: string; // ISO
  status: "posted" | "pending" | "pending approval" | "rejected" | "draft";
  status_display: string;
  is_pinned: boolean;
  attachments: { id?: number; name?: string; url?: string }[];
  total_likes: number;
  total_comments: number;
  is_liked_by_user: boolean;
};

type ApiPostList = { posts: ApiPost[]; total_count: number };

type ApiComment = {
  id: number;
  content: string;
  comment_from: ApiUserSlim;
  comment_from_name: string;
  comment_at: string; // ISO
  parent_comment: number | null;
  replies: ApiComment[];
};
type ApiCommentList = { comments: ApiComment[]; total_count: number };

/** ===== CONFIG (Vite env; no Node typings needed) ===== */
const BASE_URL = "http://127.0.0.1:8000";

async function api<T = any>(
  path: string,
  opts: RequestInit & { userId: string }
): Promise<T> {
  const { userId, ...rest } = opts;
  const headers: HeadersInit = {
    "User-ID": userId,
    ...(rest.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(rest.headers ?? {}),
  };
  const res = await fetch(`${BASE_URL}${path}`, { ...rest, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} - ${text}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

interface Props {
  user: User;
}

export const CommunityManagement: React.FC<Props> = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"published" | "pending" | "drafts">("published");
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [error, setError] = useState<string | null>(null);

  // detail panel
  const [activePost, setActivePost] = useState<ApiPost | null>(null);
  const [comments, setComments] = useState<ApiComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");

  // edit dialog
  const [editing, setEditing] = useState<ApiPost | null>(null);
  const [editContent, setEditContent] = useState("");

  // create dialog
  const [creating, setCreating] = useState(false);
  const [createContent, setCreateContent] = useState("");
  const [createFiles, setCreateFiles] = useState<File[]>([]);
  const userIsStaff = user.role === "staff";

  /** ===== LOAD POSTS ===== */
  async function fetchPosts(status?: "posted" | "pending" | "draft") {
    setLoading(true);
    setError(null);
    try {
      const q = status ? `?status=${encodeURIComponent(status)}` : "";
      const data = await api<ApiPostList>(`/forum/posts/${q}`, {
        method: "GET",
        userId: user.id,
      });
      setPosts(data.posts);
    } catch (e: any) {
      setError(e.message ?? "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (tab === "published") fetchPosts("posted");
    else if (tab === "pending") fetchPosts("pending"); // server uses "pending" for approval queue
    else fetchPosts("draft");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  /** ===== DETAIL: COMMENTS & ATTACHMENTS ===== */
  async function openPost(post: ApiPost) {
    setActivePost(post);
    await loadComments(post.id);
  }

  async function loadComments(postId: number) {
    setCommentsLoading(true);
    try {
      const data = await api<ApiCommentList>(`/forum/posts/${postId}/comments/`, {
        method: "GET",
        userId: user.id,
      });
      setComments(data.comments);
    } finally {
      setCommentsLoading(false);
    }
  }

  /** ===== ACTIONS ===== */
  async function toggleLike(post: ApiPost) {
    // optimistic
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? {
              ...p,
              is_liked_by_user: !p.is_liked_by_user,
              total_likes: p.is_liked_by_user ? Math.max(0, p.total_likes - 1) : p.total_likes + 1,
            }
          : p
      )
    );
    if (activePost?.id === post.id) {
      setActivePost((prev) =>
        prev
          ? {
              ...prev,
              is_liked_by_user: !prev.is_liked_by_user,
              total_likes: prev.is_liked_by_user ? Math.max(0, prev.total_likes - 1) : prev.total_likes + 1,
            }
          : prev
      );
    }
    try {
      await api(`/forum/posts/${post.id}/like/`, { method: "POST", userId: user.id });
    } catch {
      // on failure, just refetch list
      await fetchPosts(tab === "published" ? "posted" : tab === "pending" ? "pending" : "draft");
    }
  }

  async function togglePin(post: ApiPost) {
    await api(`/forum/posts/${post.id}/pin/`, { method: "POST", userId: user.id });
    await fetchPosts(tab === "published" ? "posted" : tab === "pending" ? "pending" : "draft");
  }

  async function approvePost(post: ApiPost) {
    await api(`/forum/posts/${post.id}/approve/`, { method: "POST", userId: user.id });
    await fetchPosts("pending"); // remove from pending view
  }

  async function rejectPost(post: ApiPost) {
    await api(`/forum/posts/${post.id}/reject/`, { method: "POST", userId: user.id });
    await fetchPosts("pending");
  }

  async function deletePost(post: ApiPost) {
    await api(`/forum/posts/${post.id}/`, { method: "DELETE", userId: user.id });
    await fetchPosts(tab === "published" ? "posted" : tab === "pending" ? "pending" : "draft");
    if (activePost?.id === post.id) setActivePost(null);
  }

  function openEdit(post: ApiPost) {
    setEditing(post);
    setEditContent(post.content ?? "");
  }

  async function saveEdit() {
    if (!editing) return;
    await api(`/forum/posts/${editing.id}/`, {
      method: "PUT",
      userId: user.id,
      body: JSON.stringify({
        content: editContent,
        is_pinned: editing.is_pinned,
        status: editing.status, // keep as-is
      }),
    });
    setEditing(null);
    setEditContent("");
    await fetchPosts(tab === "published" ? "posted" : tab === "pending" ? "pending" : "draft");
  }

  async function addComment() {
    if (!activePost || !newComment.trim()) return;
    await api(`/forum/posts/${activePost.id}/comments/`, {
      method: "POST",
      userId: user.id,
      body: JSON.stringify({ content: newComment.trim() }),
    });
    setNewComment("");
    await loadComments(activePost.id);
    await fetchPosts(tab === "published" ? "posted" : tab === "pending" ? "pending" : "draft");
  }

  async function uploadAttachmentTo(postId: number, file: File) {
    const form = new FormData();
    form.append("file", file);
    await api(`/forum/posts/${postId}/attachments/`, {
      method: "POST",
      userId: user.id,
      body: form,
    });
  }

  /** Create post with optional attachments */
  async function createStaffPost() {
    if (!createContent.trim()) return;

    // 1) Create the post (auto-approved for staff)
    let createdId: number | undefined;
    try {
      const created = await api<ApiPost>(`/forum/posts/`, {
        method: "POST",
        userId: user.id,
        body: JSON.stringify({
          content: createContent.trim()
        }),
      });
      createdId = created?.id;
    } catch (e) {
      // backend might return a different body; still try to find newly created
    }

    // 2) If we didn't get an id, refetch and pick the top post from this user that matches content
    if (!createdId) {
      const data = await api<ApiPostList>(`/forum/posts/?status=posted`, { method: "GET", userId: user.id });
      const mine = data.posts.filter((p) => p.posted_by?.id?.toString() === user.id);
      const candidate = mine.sort((a, b) => +new Date(b.posted_at) - +new Date(a.posted_at)).find((p) =>
        p.content?.includes(createContent.trim().slice(0, 20))
      );
      createdId = candidate?.id;
    }

    // 3) Upload attachments (if any)
    if (createdId && createFiles.length) {
      for (const f of createFiles) {
        await uploadAttachmentTo(createdId, f);
      }
    }

    // 4) Reset UI
    setCreating(false);
    setCreateContent("");
    setCreateFiles([]);
    await fetchPosts("posted");
    setTab("published");
  }

  const published = useMemo(() => posts.filter((p) => p.status === "posted"), [posts]);
  const pending = useMemo(
    () => posts.filter((p) => p.status === "pending" || p.status === "pending approval"),
    [posts]
  );
  const drafts = useMemo(() => posts.filter((p) => p.status === "draft"), [posts]);

  /** ===== Row ===== */
  const PostRow: React.FC<{ post: ApiPost }> = ({ post }) => (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline">{post.status_display}</Badge>
              {post.is_pinned && (
                <Badge className="bg-yellow-100 text-yellow-800">
                  <Pin className="w-3 h-3 mr-1" />
                  Pinned
                </Badge>
              )}
              {!!post.attachments?.length && (
                <Badge variant="secondary" className="gap-1">
                  <Paperclip className="w-3 h-3" />
                  {post.attachments.length}
                </Badge>
              )}
            </div>

            <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>

            <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="bg-blue-500 text-white text-xs">
                    {(post.posted_by_name || post.posted_by.username).slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>{post.posted_by_name || post.posted_by.username}</span>
              </div>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(post.posted_at).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="flex items-center justify-center gap-1">
              <Heart className={`w-4 h-4 ${post.is_liked_by_user ? "text-red-500" : "text-gray-500"}`} />
              <span className="text-gray-900">{post.total_likes}</span>
            </div>
            <p className="text-xs text-gray-500">Likes</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="flex items-center justify-center gap-1">
              <MessageCircle className="w-4 h-4 text-blue-500" />
              <span className="text-gray-900">{post.total_comments}</span>
            </div>
            <p className="text-xs text-gray-500">Comments</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="flex items-center justify-center gap-1">
              <Paperclip className="w-4 h-4 text-purple-500" />
              <span className="text-gray-900">{post.attachments?.length ?? 0}</span>
            </div>
            <p className="text-xs text-gray-500">Attachments</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" className="flex-1" onClick={() => openPost(post)}>
            <Eye className="w-4 h-4 mr-1" />
            View Post
          </Button>

          <Button size="sm" variant="outline" className="flex-1" onClick={() => toggleLike(post)}>
            <Heart className={`w-4 h-4 mr-1 ${post.is_liked_by_user ? "text-red-500" : ""}`} />
            {post.is_liked_by_user ? "Unlike" : "Like"}
          </Button>

          {userIsStaff && (
            <>
              <Button size="sm" variant="outline" className="flex-1" onClick={() => openEdit(post)}>
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button size="sm" variant="outline" className="flex-1" onClick={() => togglePin(post)}>
                <Pin className="w-4 h-4 mr-1" />
                {post.is_pinned ? "Unpin" : "Pin"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-red-600 hover:text-red-700"
                onClick={() => deletePost(post)}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </>
          )}

          {userIsStaff && (post.status === "pending" || post.status === "pending approval") && (
            <>
              <Button size="sm" className="flex-1" onClick={() => approvePost(post)}>
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Approve
              </Button>
              <Button size="sm" variant="outline" className="flex-1" onClick={() => rejectPost(post)}>
                <XCircle className="w-4 h-4 mr-1" />
                Reject
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-gray-900">Community Management</h2>

        {userIsStaff && (
          <Dialog open={creating} onOpenChange={setCreating}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Create Staff Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
                <DialogDescription>Post immediately as staff and upload attachments.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <Label>Content</Label>
                <Textarea
                  rows={6}
                  placeholder="Write your announcement or tip…"
                  value={createContent}
                  onChange={(e) => setCreateContent(e.target.value)}
                />

                <div className="space-y-1">
                  <Label>Attachments (optional)</Label>
                  <Input
                    type="file"
                    multiple
                    onChange={(e) => setCreateFiles(Array.from(e.target.files || []))}
                  />
                  {createFiles.length > 0 && (
                    <p className="text-xs text-gray-500">{createFiles.length} file(s) selected</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button onClick={createStaffPost} disabled={!createContent.trim()}>
                    Publish
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
        <TabsList className="flex-wrap">
          <TabsTrigger value="published">Published ({published.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="drafts">Drafts ({drafts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="published" className="mt-6 space-y-4">
          {loading ? (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading…
            </div>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : published.length ? (
            published.map((p) => <PostRow key={p.id} post={p} />)
          ) : (
            <p className="text-gray-500">No published posts.</p>
          )}
        </TabsContent>

        <TabsContent value="pending" className="mt-6 space-y-4">
          {loading ? (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading…
            </div>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : pending.length ? (
            pending.map((p) => <PostRow key={p.id} post={p} />)
          ) : (
            <p className="text-gray-500">No pending posts.</p>
          )}
        </TabsContent>

        <TabsContent value="drafts" className="mt-6 space-y-4">
          {loading ? (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading…
            </div>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : drafts.length ? (
            drafts.map((p) => <PostRow key={p.id} post={p} />)
          ) : (
            <p className="text-gray-500">No drafts.</p>
          )}
        </TabsContent>
      </Tabs>

      {/* ===== VIEW POST (DETAIL) ===== */}
      <Dialog open={!!activePost} onOpenChange={(o) => !o && setActivePost(null)}>
        <DialogContent className="max-w-3xl">
          {activePost && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Post #{activePost.id}
                  {activePost.is_pinned && (
                    <Badge className="bg-yellow-100 text-yellow-800 ml-1">
                      <Pin className="w-3 h-3 mr-1" />
                      Pinned
                    </Badge>
                  )}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-2 text-gray-600">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="bg-blue-500 text-white text-xs">
                      {(activePost.posted_by_name || activePost.posted_by.username)
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {activePost.posted_by_name || activePost.posted_by.username} •{" "}
                  {new Date(activePost.posted_at).toLocaleString()} •{" "}
                  <Badge variant="outline">{activePost.status_display}</Badge>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <p className="text-gray-900 whitespace-pre-wrap">{activePost.content}</p>

                {/* Attachments */}
                <div className="space-y-2">
                  <Label>Attachments</Label>
                  {activePost.attachments?.length ? (
                    <ul className="list-disc pl-5 text-sm">
                      {activePost.attachments.map((a, i) => (
                        <li key={a.id ?? i}>
                          {a.url ? (
                            <a href={a.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                              {a.name || a.url}
                            </a>
                          ) : (
                            <span>{a.name || "Attachment"}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No attachments</p>
                  )}
                </div>

                {/* Comments */}
                <div className="space-y-2">
                  <Label>Comments ({activePost.total_comments})</Label>
                  {commentsLoading ? (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Loader2 className="w-4 h-4 animate-spin" /> Loading comments…
                    </div>
                  ) : comments.length ? (
                    <ul className="space-y-3">
                      {comments.map((c) => (
                        <li key={c.id} className="border rounded p-2">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="bg-gray-500 text-white text-xs">
                                {c.comment_from_name?.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span>{c.comment_from_name}</span>
                            <span className="text-gray-500">
                              {new Date(c.comment_at).toLocaleString()}
                            </span>
                          </div>
                          <p className="mt-1 whitespace-pre-wrap">{c.content}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No comments yet.</p>
                  )}

                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Write a comment…"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Button onClick={addComment} disabled={!newComment.trim()}>
                      <Send className="w-4 h-4 mr-1" />
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ===== EDIT POST ===== */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
            <DialogDescription>Update the content.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Label>Content</Label>
            <Textarea rows={8} value={editContent} onChange={(e) => setEditContent(e.target.value)} />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button onClick={saveEdit} disabled={!editContent.trim()}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};