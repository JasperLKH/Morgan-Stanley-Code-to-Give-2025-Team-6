from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.contrib.auth import get_user_model
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer, MessageCreateSerializer, UserBasicSerializer

User = get_user_model()


def get_user_from_request(request):
    """Get user from User-ID header"""
    user_id = request.headers.get('User-ID')
    if not user_id:
        return None
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return None


@api_view(['POST'])
def create_private_conversation(request):
    """
    Create a 1-to-1 conversation
    Headers: User-ID: <user_id>
    Body: {"participant_id": <other_user_id>}
    """
    user = get_user_from_request(request)
    if not user:
        return Response({'error': 'User-ID invalid'}, status=status.HTTP_401_UNAUTHORIZED)

    participant_id = request.data.get('participant_id')
    if not participant_id:
        return Response({'error': 'participant_id required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        other_user = User.objects.get(id=participant_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    # Check if conversation already exists
    existing_conv = Conversation.objects.filter(
        conversation_type='private',
        participants=user
    ).filter(participants=other_user).first()

    if existing_conv:
        serializer = ConversationSerializer(existing_conv)
        return Response({'conversation': serializer.data}, status=status.HTTP_200_OK)

    # Create new conversation
    conversation = Conversation.objects.create(
        conversation_type='private',
        created_by=user
    )
    conversation.participants.add(user, other_user)

    serializer = ConversationSerializer(conversation)
    return Response({'conversation': serializer.data}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def create_group_conversation(request):
    """
    Create a group conversation
    Headers: User-ID: <user_id>
    Body: {"participant_ids": [<user_id1>, <user_id2>, ...], "name": "Group Name"}
    """
    user = get_user_from_request(request)
    if not user:
        return Response({'error': 'User-ID invalid'}, status=status.HTTP_401_UNAUTHORIZED)

    participant_ids = request.data.get('participant_ids', [])
    name = request.data.get('name', '')

    if len(participant_ids) < 1:
        return Response({'error': 'At least one participant required'}, status=status.HTTP_400_BAD_REQUEST)

    # Create conversation
    conversation = Conversation.objects.create(
        conversation_type='group',
        name=name,
        created_by=user
    )
    
    # Add creator
    conversation.participants.add(user)
    
    # Add other participants
    participants = User.objects.filter(id__in=participant_ids)
    conversation.participants.add(*participants)

    serializer = ConversationSerializer(conversation)
    return Response({'conversation': serializer.data}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def get_conversations(request):
    """
    Get user's conversations
    Headers: User-ID: <user_id>
    """
    user = get_user_from_request(request)
    if not user:
        return Response({'error': 'User-ID invalid'}, status=status.HTTP_401_UNAUTHORIZED)

    conversations = Conversation.objects.filter(participants=user)
    serializer = ConversationSerializer(conversations, many=True)
    
    return Response({
        'conversations': serializer.data,
        'total_count': len(serializer.data)
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_conversation_detail(request, conversation_id):
    """
    Get conversation details
    Headers: User-ID: <user_id>
    """
    user = get_user_from_request(request)
    if not user:
        return Response({'error': 'User-ID invalid'}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        conversation = Conversation.objects.get(id=conversation_id, participants=user)
    except Conversation.DoesNotExist:
        return Response({'error': 'Conversation not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ConversationSerializer(conversation)
    return Response({'conversation': serializer.data}, status=status.HTTP_200_OK)


@api_view(['POST'])
def send_message(request, conversation_id):
    """
    Send a message in conversation
    Headers: User-ID: <user_id>
    Body: {"text": "message", "attachment": <file>}
    """
    user = get_user_from_request(request)
    if not user:
        return Response({'error': 'User-ID invalid'}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        conversation = Conversation.objects.get(id=conversation_id, participants=user)
    except Conversation.DoesNotExist:
        return Response({'error': 'Conversation not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = MessageCreateSerializer(data=request.data)
    if serializer.is_valid():
        message = serializer.save(
            conversation=conversation,
            from_user=user
        )
        
        # Update conversation updated_at
        conversation.save()
        
        response_serializer = MessageSerializer(message)
        return Response({'message': response_serializer.data}, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_messages(request, conversation_id):
    """
    Get all messages in conversation
    Headers: User-ID: <user_id>
    """
    user = get_user_from_request(request)
    if not user:
        return Response({'error': 'User-ID invalid'}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        conversation = Conversation.objects.get(id=conversation_id, participants=user)
    except Conversation.DoesNotExist:
        return Response({'error': 'Conversation not found'}, status=status.HTTP_404_NOT_FOUND)

    # Get all messages in the conversation, ordered by creation time
    messages = Message.objects.filter(conversation=conversation).order_by('created_at')
    serializer = MessageSerializer(messages, many=True)
    
    return Response({
        'messages': serializer.data,
        'total_count': len(serializer.data)
    }, status=status.HTTP_200_OK)


@api_view(['DELETE'])
def delete_message(request, message_id):
    """
    Delete a message (sender only)
    Headers: User-ID: <user_id>
    """
    user = get_user_from_request(request)
    if not user:
        return Response({'error': 'User-ID invalid'}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        message = Message.objects.get(id=message_id, from_user=user)
    except Message.DoesNotExist:
        return Response({'error': 'Message not found or you are not the sender'}, status=status.HTTP_404_NOT_FOUND)

    message.delete()
    return Response({'message': 'Message deleted successfully'}, status=status.HTTP_200_OK)


@api_view(['POST'])
def add_participants(request, conversation_id):
    """
    Add participants to group conversation
    Headers: User-ID: <user_id>
    Body: {"participant_ids": [<user_id1>, <user_id2>]}
    """
    user = get_user_from_request(request)
    if not user:
        return Response({'error': 'User-ID invalid'}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        conversation = Conversation.objects.get(
            id=conversation_id, 
            participants=user,
            conversation_type='group'
        )
    except Conversation.DoesNotExist:
        return Response({'error': 'Group conversation not found'}, status=status.HTTP_404_NOT_FOUND)

    participant_ids = request.data.get('participant_ids', [])
    if not participant_ids:
        return Response({'error': 'participant_ids required'}, status=status.HTTP_400_BAD_REQUEST)

    participants = User.objects.filter(id__in=participant_ids)
    conversation.participants.add(*participants)

    serializer = ConversationSerializer(conversation)
    return Response({'conversation': serializer.data}, status=status.HTTP_200_OK)


@api_view(['POST'])
def remove_participant(request, conversation_id):
    """
    Remove participant from group conversation
    Headers: User-ID: <user_id>
    Body: {"participant_id": <user_id>}
    """
    user = get_user_from_request(request)
    if not user:
        return Response({'error': 'User-ID invalid'}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        conversation = Conversation.objects.get(
            id=conversation_id, 
            participants=user,
            conversation_type='group'
        )
    except Conversation.DoesNotExist:
        return Response({'error': 'Group conversation not found'}, status=status.HTTP_404_NOT_FOUND)

    participant_id = request.data.get('participant_id')
    if not participant_id:
        return Response({'error': 'participant_id required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        participant = User.objects.get(id=participant_id)
        conversation.participants.remove(participant)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ConversationSerializer(conversation)
    return Response({'conversation': serializer.data}, status=status.HTTP_200_OK)


@api_view(['POST'])
def leave_conversation(request, conversation_id):
    """
    Leave a conversation
    Headers: User-ID: <user_id>
    """
    user = get_user_from_request(request)
    if not user:
        return Response({'error': 'User-ID invalid'}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        conversation = Conversation.objects.get(id=conversation_id, participants=user)
    except Conversation.DoesNotExist:
        return Response({'error': 'Conversation not found'}, status=status.HTTP_404_NOT_FOUND)

    conversation.participants.remove(user)
    
    # If no participants left, delete the conversation
    if conversation.participants.count() == 0:
        conversation.delete()
        return Response({'message': 'Left conversation and conversation deleted'}, status=status.HTTP_200_OK)

    return Response({'message': 'Left conversation successfully'}, status=status.HTTP_200_OK)


@api_view(['GET'])
def search_users(request):
    """
    Search users to start conversation
    Headers: User-ID: <user_id>
    Query: ?q=<search_term>&role=<role>
    """
    user = get_user_from_request(request)
    if not user:
        return Response({'error': 'User-ID invalid'}, status=status.HTTP_401_UNAUTHORIZED)

    search_term = request.GET.get('q', '')
    role_filter = request.GET.get('role', '')

    users = User.objects.exclude(id=user.id)  # Exclude current user

    if search_term:
        users = users.filter(
            Q(parent_name__icontains=search_term)|
            Q(children_name__icontains=search_term)
        )

    if role_filter:
        users = users.filter(role=role_filter)

    users = users[:20]  # Limit results
    serializer = UserBasicSerializer(users, many=True)
    
    return Response({
        'users': serializer.data,
        'total_count': len(serializer.data)
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
def find_conversation(request):
    """
    Find existing conversation by participant name or conversation name
    Headers: User-ID: <user_id>
    Query: ?participant_name=<username_or_parent_name> OR ?name=<conversation_name>
    """
    user = get_user_from_request(request)
    if not user:
        return Response({'error': 'User-ID invalid'}, status=status.HTTP_401_UNAUTHORIZED)

    participant_name = request.GET.get('participant_name')
    conversation_name = request.GET.get('name')

    if not participant_name and not conversation_name:
        return Response({'error': 'Either participant_name or name is required'}, status=status.HTTP_400_BAD_REQUEST)

    conversation = None

    # Find by participant name (username or parent_name)
    if participant_name:
        try:
            # Search for user by username or parent_name
            other_user = User.objects.filter(
                Q(username__icontains=participant_name) |
                Q(parent_name__icontains=participant_name)
            ).first()
            
            if not other_user:
                return Response({'error': 'User not found with that name'}, status=status.HTTP_404_NOT_FOUND)
            
        except Exception as e:
            return Response({'error': 'Error searching for user'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Find private conversation between these two users
        conversation = Conversation.objects.filter(
            conversation_type='private',
            participants=user
        ).filter(participants=other_user).first()

    # Find by conversation name (group conversation)
    elif conversation_name:
        conversation = Conversation.objects.filter(
            conversation_type='group',
            name__icontains=conversation_name,
            participants=user
        ).first()

    if conversation:
        serializer = ConversationSerializer(conversation)
        return Response({'conversation': serializer.data}, status=status.HTTP_200_OK)
    else:
        return Response({'conversation': None}, status=status.HTTP_200_OK)
