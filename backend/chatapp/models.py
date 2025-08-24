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


class Questionnaire(models.Model):
    """
    A questionnaire with Google Form integration.
    """
    title = models.CharField(max_length=255, help_text="Title of the questionnaire")
    google_form_link = models.URLField(
        max_length=500,
        help_text="Direct link to the Google Form"
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="created_questionnaires"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True, help_text="Whether this questionnaire is active")

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title

    def generate_iframe_from_link(self, width=640, height=524):
        """
        Generate iframe embed code from Google Form link
        Converts regular Google Form links to embedded format
        """
        if not self.google_form_link:
            return None
        
        # Convert regular Google Form link to embed format
        if "docs.google.com/forms" in self.google_form_link:
            # Extract the form ID from the link
            if "/viewform" in self.google_form_link:
                # Handle links like: https://docs.google.com/forms/d/e/FORM_ID/viewform?usp=header
                form_part = self.google_form_link.split("/viewform")[0]
                embed_url = f"{form_part}/viewform?embedded=true"
            else:
                # If it's already in some other format, try to add embedded parameter
                separator = "&" if "?" in self.google_form_link else "?"
                embed_url = f"{self.google_form_link}{separator}embedded=true"
            
            iframe_code = f'<iframe src="{embed_url}" width="{width}" height="{height}" frameborder="0" marginheight="0" marginwidth="0">載入中…</iframe>'
            return iframe_code
        
        return None

    def get_iframe_code(self, width=640, height=524):
        """
        Get iframe code with custom dimensions
        This method is called dynamically when needed
        """
        return self.generate_iframe_from_link(width=width, height=height)


