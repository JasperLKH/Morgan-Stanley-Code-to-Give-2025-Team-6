from rest_framework import serializers
from account.models import User
from .models import Forum, ForumAttachment, ForumComment, ForumLike


class UserBasicSerializer(serializers.ModelSerializer):
    """Basic user info for forum-related data"""
    class Meta:
        model = User
        fields = ["id", "username", "role"]


class ForumAttachmentSerializer(serializers.ModelSerializer):
    """Serializer for forum attachments"""
    
    class Meta:
        model = ForumAttachment
        fields = [
            "id",
            "file",
            "file_type", 
            "file_name",
            "file_size",
            "width",
            "height", 
            "duration_ms",
        ]
        read_only_fields = ["id", "file_size"]


class ForumCommentSerializer(serializers.ModelSerializer):
    """Serializer for forum comments"""
    comment_from = UserBasicSerializer(read_only=True)
    comment_from_name = serializers.CharField(source='comment_from.username', read_only=True)
    replies = serializers.SerializerMethodField()
    
    def get_replies(self, obj):
        """Get replies to this comment"""
        if obj.replies.exists():
            return ForumCommentSerializer(obj.replies.all(), many=True).data
        return []
    
    class Meta:
        model = ForumComment
        fields = [
            "id",
            "content",
            "comment_from",
            "comment_from_name", 
            "comment_at",
            "parent_comment",
            "replies",
        ]
        read_only_fields = ["id", "comment_at", "comment_from", "comment_from_name", "replies"]


class ForumLikeSerializer(serializers.ModelSerializer):
    """Serializer for forum likes"""
    liked_by = UserBasicSerializer(read_only=True)
    
    class Meta:
        model = ForumLike
        fields = ["id", "liked_by", "liked_at"]
        read_only_fields = ["id", "liked_at", "liked_by"]


class ForumSerializer(serializers.ModelSerializer):
    """Main forum post serializer"""
    posted_by = UserBasicSerializer(read_only=True)
    posted_by_name = serializers.CharField(source='posted_by.username', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    # Related data
    attachments = ForumAttachmentSerializer(many=True, read_only=True)
    comments = ForumCommentSerializer(many=True, read_only=True)
    likes = ForumLikeSerializer(many=True, read_only=True)
    
    # Counts
    total_likes = serializers.ReadOnlyField()
    total_comments = serializers.ReadOnlyField()
    
    # Check if current user liked this post
    is_liked_by_user = serializers.SerializerMethodField()
    
    def get_is_liked_by_user(self, obj):
        """Check if the current user liked this post"""
        request = self.context.get('request')
        if request:
            # Get user_id from request (could be from headers, query params, or body)
            user_id = request.headers.get('User-ID') or request.GET.get('user_id') or request.data.get('user_id')
            if user_id:
                try:
                    from account.models import User
                    user = User.objects.get(id=user_id)
                    return obj.likes.filter(liked_by=user).exists()
                except User.DoesNotExist:
                    pass
        return False
    
    class Meta:
        model = Forum
        fields = [
            "id",
            "content",
            "posted_by",
            "posted_by_name",
            "posted_at", 
            "status",
            "status_display",
            "is_pinned",
            "attachments",
            "comments",
            "likes",
            "total_likes",
            "total_comments",
            "is_liked_by_user",
        ]
        read_only_fields = [
            "id", "posted_at", "posted_by", "posted_by_name", "status_display",
            "attachments", "comments", "likes", "total_likes", "total_comments",
            "is_liked_by_user"
        ]


class ForumCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating forum posts"""
    
    class Meta:
        model = Forum
        fields = ["content"]
