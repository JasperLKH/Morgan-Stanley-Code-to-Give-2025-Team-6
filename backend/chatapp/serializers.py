from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Conversation, Message, Questionnaire

User = get_user_model()


class UserBasicSerializer(serializers.ModelSerializer):
    """Basic user info for chat participants"""
    school = serializers.SerializerMethodField()  # Return school name only
    
    class Meta:
        model = User
        fields = ['id', 'username', 'role', 'parent_name', 'children_name', 'staff_name', 'teacher_name', 'school']
    
    def get_school(self, obj):
        """Return school name or None if no school is assigned"""
        return obj.school.name if obj.school else None


class MessageSerializer(serializers.ModelSerializer):
    from_user = UserBasicSerializer(read_only=True)

    class Meta:
        model = Message
        fields = [
            'id', 'conversation', 'from_user', 'text', 'attachment', 'created_at'
        ]
        read_only_fields = ['id', 'from_user', 'created_at']


class ConversationSerializer(serializers.ModelSerializer):
    participants = UserBasicSerializer(many=True, read_only=True)
    participant_ids = serializers.ListField(
        child=serializers.IntegerField(), 
        write_only=True, 
        required=False
    )
    last_message = MessageSerializer(read_only=True)
    created_by = UserBasicSerializer(read_only=True)

    class Meta:
        model = Conversation
        fields = [
            'id', 'name', 'conversation_type', 'participants', 'participant_ids',
            'created_by', 'created_at', 'updated_at', 'last_message'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

    def create(self, validated_data):
        participant_ids = validated_data.pop('participant_ids', [])
        conversation = Conversation.objects.create(**validated_data)
        
        # Add the creator as a participant
        conversation.participants.add(self.context['request'].user)
        
        # Add other participants
        if participant_ids:
            participants = User.objects.filter(id__in=participant_ids)
            conversation.participants.add(*participants)
        
        return conversation


class MessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['text', 'attachment']

    def validate(self, data):
        if not data.get('text') and not data.get('attachment'):
            raise serializers.ValidationError("Either text or attachment must be provided.")
        return data


class QuestionnaireSerializer(serializers.ModelSerializer):
    created_by = UserBasicSerializer(read_only=True)
    iframe_code = serializers.SerializerMethodField()  # Dynamic iframe generation

    class Meta:
        model = Questionnaire
        fields = [
            'id', 'title', 'google_form_link', 
            'created_by', 'created_at', 'updated_at', 'is_active',
            'iframe_code'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at', 'iframe_code']

    def get_iframe_code(self, obj):
        """
        Dynamically generate iframe code based on request parameters
        """
        request = self.context.get('request')
        
        # Get width and height from query parameters, with defaults
        width = 640
        height = 524
        
        if request:
            try:
                width = int(request.GET.get('width', 640))
                height = int(request.GET.get('height', 524))
            except (ValueError, TypeError):
                # If invalid parameters, use defaults
                width = 640
                height = 524
        
        return obj.get_iframe_code(width=width, height=height)

    def update(self, instance, validated_data):
        # Extract width and height from validated data
        width = validated_data.pop('width', 640)
        height = validated_data.pop('height', 524)
        
        # Update the instance fields first
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # If google_form_link was updated, regenerate iframe with custom dimensions
        if 'google_form_link' in validated_data and instance.google_form_link:
            instance.embedding_html = instance.generate_iframe_from_link(width=width, height=height)
        
        # Save the instance
        instance.save()
        
        return instance
