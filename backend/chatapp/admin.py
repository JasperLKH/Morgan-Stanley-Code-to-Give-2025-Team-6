from django.contrib import admin
from .models import Conversation, Message, Questionnaire


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    """
    Admin interface for Conversation model.
    """
    list_display = ('id', 'name', 'conversation_type', 'created_by', 'participant_count', 'created_at', 'updated_at')
    list_filter = ('conversation_type', 'created_at', 'updated_at')
    search_fields = ('name', 'participants__username', 'created_by__username')
    readonly_fields = ('created_at', 'updated_at')
    filter_horizontal = ('participants',)
    raw_id_fields = ('created_by',)
    
    def participant_count(self, obj):
        """Show number of participants in the conversation."""
        return obj.participants.count()
    participant_count.short_description = 'Participants'
    
    def get_queryset(self, request):
        """Optimize queryset with select_related and prefetch_related."""
        return super().get_queryset(request).select_related('created_by').prefetch_related('participants')


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    """
    Admin interface for Message model.
    """
    list_display = ('id', 'conversation_preview', 'from_user', 'text_preview', 'has_attachment', 'created_at')
    list_filter = ('created_at', 'conversation__conversation_type')
    search_fields = ('text', 'from_user__username', 'conversation__name')
    readonly_fields = ('created_at',)
    raw_id_fields = ('conversation', 'from_user')
    date_hierarchy = 'created_at'
    
    def conversation_preview(self, obj):
        """Show a preview of the conversation."""
        if obj.conversation.conversation_type == 'group' and obj.conversation.name:
            return f"Group: {obj.conversation.name}"
        return f"Conversation {obj.conversation.id}"
    conversation_preview.short_description = 'Conversation'
    
    def text_preview(self, obj):
        """Show a preview of the message text."""
        if obj.text:
            return obj.text[:50] + "..." if len(obj.text) > 50 else obj.text
        return "[No text]"
    text_preview.short_description = 'Message'
    
    def has_attachment(self, obj):
        """Show if message has an attachment."""
        return bool(obj.attachment)
    has_attachment.boolean = True
    has_attachment.short_description = 'Attachment'
    
    def get_queryset(self, request):
        """Optimize queryset with select_related."""
        return super().get_queryset(request).select_related('conversation', 'from_user')


@admin.register(Questionnaire)
class QuestionnaireAdmin(admin.ModelAdmin):
    """
    Admin interface for Questionnaire model.
    """
    list_display = ('id', 'title', 'created_by', 'is_active', 'created_at', 'updated_at')
    list_filter = ('is_active', 'created_at', 'updated_at', 'created_by')
    search_fields = ('title', 'created_by__username')
    readonly_fields = ('created_at', 'updated_at')
    raw_id_fields = ('created_by',)
    
    fieldsets = (
        (None, {
            'fields': ('title', 'created_by', 'is_active')
        }),
        ('Google Form Integration', {
            'fields': ('google_form_link', 'embedding_html'),
            'description': 'Add either a direct link to the Google Form or the HTML embed code (iframe)'
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def get_queryset(self, request):
        """Optimize queryset with select_related."""
        return super().get_queryset(request).select_related('created_by')