from django.db import models
from django.conf import settings
from django.utils import timezone


class Forum(models.Model):
    """
    Main forum post model
    """
    STATUS_CHOICES = [
        ('pending', 'Pending Approval'),
        ('posted', 'Posted'),
        ('rejected', 'Rejected'),
    ]
    
    posted_at = models.DateTimeField(auto_now_add=True)
    posted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='forum_posts'
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    content = models.TextField()
    is_pinned = models.BooleanField(default=False, help_text="Pin this post to the top")
    
    class Meta:
        ordering = ['-is_pinned', '-posted_at']
        indexes = [
            models.Index(fields=['status', '-posted_at']),
            models.Index(fields=['posted_by']),
            models.Index(fields=['is_pinned', '-posted_at']),
        ]
    
    def __str__(self):
        return f"Post by {self.posted_by.username} - {self.content[:50]}..."
    
    @property
    def total_likes(self):
        return self.likes.count()
    
    @property
    def total_comments(self):
        return self.comments.count()


class ForumAttachment(models.Model):
    """
    Attachments for forum posts
    """
    ATTACHMENT_TYPES = [
        ('image', 'Image'),
        ('video', 'Video'),
        ('document', 'Document'),
        ('pdf', 'PDF'),
    ]
    
    forum_post = models.ForeignKey(
        Forum,
        on_delete=models.CASCADE,
        related_name='attachments'
    )
    file = models.FileField(upload_to='forum/attachments/%Y/%m/%d/')
    file_type = models.CharField(max_length=20, choices=ATTACHMENT_TYPES)
    file_name = models.CharField(max_length=255)
    file_size = models.PositiveIntegerField(help_text="File size in bytes")
    
    # For images/videos
    width = models.PositiveIntegerField(null=True, blank=True)
    height = models.PositiveIntegerField(null=True, blank=True)
    duration_ms = models.PositiveIntegerField(null=True, blank=True, help_text="Duration in milliseconds for videos")
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.file_name} - {self.forum_post.id}"


class ForumComment(models.Model):
    """
    Comments on forum posts
    """
    forum_post = models.ForeignKey(
        Forum,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    comment_from = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='forum_comments'
    )
    content = models.TextField()
    comment_at = models.DateTimeField(auto_now_add=True)
    
    # For threaded comments (optional)
    parent_comment = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='replies'
    )
    
    class Meta:
        ordering = ['comment_at']
        indexes = [
            models.Index(fields=['forum_post', 'comment_at']),
            models.Index(fields=['comment_from']),
        ]
    
    def __str__(self):
        return f"Comment by {self.comment_from.username} on {self.forum_post.id}"


class ForumLike(models.Model):
    """
    Likes on forum posts
    """
    forum_post = models.ForeignKey(
        Forum,
        on_delete=models.CASCADE,
        related_name='likes'
    )
    liked_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='forum_likes'
    )
    liked_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['forum_post', 'liked_by']  # Prevent duplicate likes
        indexes = [
            models.Index(fields=['forum_post']),
            models.Index(fields=['liked_by']),
        ]
    
    def __str__(self):
        return f"{self.liked_by.username} likes post {self.forum_post.id}"
