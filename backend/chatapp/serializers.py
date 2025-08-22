from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Conversation, Message

User = get_user_model()


class UserBasicSerializer(serializers.ModelSerializer):
    """Basic user info for chat participants"""
    class Meta:
        model = User
        fields = ['id', 'username', 'role', 'parent_name', 'children_name']


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
