from django.contrib import admin
from .models import Forum, ForumAttachment, ForumComment, ForumLike


class ForumAttachmentInline(admin.TabularInline):
    model = ForumAttachment
    extra = 0
    readonly_fields = ('file_size', 'width', 'height', 'duration_ms')


class ForumCommentInline(admin.TabularInline):
    model = ForumComment
    extra = 0
    readonly_fields = ('comment_at',)


@admin.register(Forum)
class ForumAdmin(admin.ModelAdmin):
    list_display = ('id', 'posted_by', 'status', 'is_pinned', 'total_likes', 'total_comments', 'posted_at')
    list_filter = ('status', 'is_pinned', 'posted_at')
    search_fields = ('content', 'posted_by__username')
    readonly_fields = ('posted_at', 'total_likes', 'total_comments')
    
    fieldsets = (
        (None, {
            'fields': ('content', 'posted_by', 'status', 'is_pinned')
        }),
        ('Timestamps', {
            'fields': ('posted_at', ),
            'classes': ('collapse',)
        }),
        ('Stats', {
            'fields': ('total_likes', 'total_comments'),
            'classes': ('collapse',)
        })
    )
    
    inlines = [ForumAttachmentInline, ForumCommentInline]
    
    actions = ['approve_posts', 'reject_posts', 'pin_posts', 'unpin_posts']
    
    def approve_posts(self, request, queryset):
        updated = queryset.update(status='posted')
        self.message_user(request, f'{updated} posts approved.')
    approve_posts.short_description = "Approve selected posts"
    
    def reject_posts(self, request, queryset):
        updated = queryset.update(status='rejected')
        self.message_user(request, f'{updated} posts rejected.')
    reject_posts.short_description = "Reject selected posts"
    
    def pin_posts(self, request, queryset):
        updated = queryset.update(is_pinned=True)
        self.message_user(request, f'{updated} posts pinned.')
    pin_posts.short_description = "Pin selected posts"
    
    def unpin_posts(self, request, queryset):
        updated = queryset.update(is_pinned=False)
        self.message_user(request, f'{updated} posts unpinned.')
    unpin_posts.short_description = "Unpin selected posts"


@admin.register(ForumAttachment)
class ForumAttachmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'forum_post', 'file_name', 'file_type', 'file_size', 'created_at')
    list_filter = ('file_type', 'created_at')
    search_fields = ('file_name', 'forum_post__content')
    readonly_fields = ('file_size', 'width', 'height', 'duration_ms', 'created_at')


@admin.register(ForumComment)
class ForumCommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'forum_post', 'comment_from', 'content_preview', 'comment_at')
    list_filter = ('comment_at',)
    search_fields = ('content', 'comment_from__username', 'forum_post__content')
    readonly_fields = ('comment_at',)
    
    def content_preview(self, obj):
        return obj.content[:50] + "..." if len(obj.content) > 50 else obj.content
    content_preview.short_description = "Content Preview"


@admin.register(ForumLike)
class ForumLikeAdmin(admin.ModelAdmin):
    list_display = ('id', 'forum_post', 'liked_by', 'liked_at')
    list_filter = ('liked_at',)
    search_fields = ('liked_by__username', 'forum_post__content')
    readonly_fields = ('liked_at',)
