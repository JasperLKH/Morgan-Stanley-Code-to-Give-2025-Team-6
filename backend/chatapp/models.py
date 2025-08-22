from django.conf import settings
from django.db import models
from django.utils import timezone


class Conversation(models.Model):
    """
    A chat room or private conversation.
    """
    CONVERSATION_TYPES = (
        ('private', 'Private (1-to-1)'),
        ('group', 'Group Chat'),
    )
    
    name = models.CharField(max_length=255, blank=True, null=True)  # For group chats
    conversation_type = models.CharField(max_length=10, choices=CONVERSATION_TYPES, default='private')
    participants = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="conversations"
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="created_conversations"
    )
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]

    def __str__(self):
        if self.conversation_type == 'group' and self.name:
            return f"Group: {self.name}"
        return f"Conversation {self.id} with {', '.join([p.username for p in self.participants.all()])}"

    @property
    def last_message(self):
        return self.messages.order_by('-created_at').first()

    def is_participant(self, user):
        return self.participants.filter(id=user.id).exists()


class Message(models.Model):
    """
    A single chat message in a conversation.
    """
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name="messages"
    )
    from_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="sent_messages"
    )
    text = models.TextField(blank=True, null=True)
    attachment = models.FileField(upload_to="chat/attachments/%Y/%m/%d/", blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"From {self.from_user} in Conversation {self.conversation.id}: {self.text[:20] if self.text else '[Attachment]'}"


