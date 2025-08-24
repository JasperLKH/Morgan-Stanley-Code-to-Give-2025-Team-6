from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from PIL import Image
import os

from .models import Forum, ForumAttachment, ForumComment, ForumLike
from .serializers import (
    ForumSerializer, 
    ForumCreateSerializer,
    ForumCommentSerializer, 
    ForumAttachmentSerializer
)
from account.models import User


def get_user(request):
    """Get user from User-ID header"""
    # Get user_id from request (could be from headers, query params, or body)
    user_id = request.headers.get('User-ID') or request.GET.get('user_id') or request.data.get('user_id')
    
    if not user_id:
        return None
    
    try:
        user = User.objects.get(id=user_id)
        return user
    except User.DoesNotExist:
        return None


@api_view(['GET', 'POST'])
def forum_posts(request):
    """
    GET: List all approved forum posts
    POST: Create a new forum post (any authenticated user)
    """
    if request.method == 'GET':
        # Query params
        status_filter = request.GET.get('status', 'posted')  # Default to only posted
        posted_by = request.GET.get('posted_by')
        
        posts = Forum.objects.filter(status=status_filter)
        
        if posted_by:
            posts = posts.filter(posted_by_id=posted_by)
            
        posts = posts.select_related('posted_by').prefetch_related(
            'attachments', 'comments__comment_from', 'likes__liked_by'
        )
        
        serializer = ForumSerializer(posts, many=True, context={'request': request})
        return Response({
            'posts': serializer.data,
            'total_count': posts.count()
        }, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        user = get_user(request)
        if not user:
            return Response({'error': 'User-ID header required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        serializer = ForumCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            # Create the post and set the posted_by field manually
            post = serializer.save(posted_by=user)
            
            # Staff posts are automatically approved, others need approval
            if user.role == 'staff':
                post.status = 'posted'
                post.save()
            
            # Handle file attachments
            attachments_data = []
            for key, file in request.FILES.items():
                if key.startswith('attachment'):
                    attachment_data = create_attachment(post, file)
                    if attachment_data:
                        attachments_data.append(attachment_data)
            
            # Return the created post with attachments
            response_serializer = ForumSerializer(post, context={'request': request})
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def forum_post_detail(request, pk):
    """
    GET: Get a specific forum post
    PUT: Update a forum post (only by owner or staff)
    DELETE: Delete a forum post (only by owner or staff)
    """
    post = get_object_or_404(Forum, pk=pk)
    user = get_user(request)
    
    if request.method == 'GET':
        serializer = ForumSerializer(post, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'PUT':
        if not user:
            return Response({'error': 'User-ID header required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Check permissions
        if post.posted_by != user and user.role != 'staff':
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = ForumCreateSerializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            response_serializer = ForumSerializer(post, context={'request': request})
            return Response(response_serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        if not user:
            return Response({'error': 'User-ID header required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Check permissions
        if post.posted_by != user and user.role != 'staff':
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        post.delete()
        return Response({'message': 'Post deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
def upload_attachment(request, post_pk):
    """Upload attachment to a forum post"""
    user = get_user(request)
    if not user:
        return Response({'error': 'User-ID header required'}, status=status.HTTP_401_UNAUTHORIZED)
    
    post = get_object_or_404(Forum, pk=post_pk)
    
    # Check permissions
    if post.posted_by != user and user.role != 'staff':
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    
    if 'file' not in request.FILES:
        return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    file = request.FILES['file']
    attachment_data = create_attachment(post, file)
    
    if attachment_data:
        return Response(attachment_data, status=status.HTTP_201_CREATED)
    else:
        return Response({'error': 'Failed to create attachment'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def toggle_like(request, post_pk):
    """Toggle like on a forum post"""
    user = get_user(request)
    if not user:
        return Response({'error': 'User-ID header required'}, status=status.HTTP_401_UNAUTHORIZED)
    
    post = get_object_or_404(Forum, pk=post_pk)
    
    # Check if user already liked this post
    existing_like = ForumLike.objects.filter(forum_post=post, liked_by=user).first()
    
    if existing_like:
        # Remove like
        existing_like.delete()
        action = 'unliked'
    else:
        # Add like
        ForumLike.objects.create(forum_post=post, liked_by=user)
        action = 'liked'
    
    return Response({
        'action': action,
        'total_likes': post.total_likes,
        'post_id': post.id
    }, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
def forum_comments(request, post_pk):
    """
    GET: Get comments for a post
    POST: Add a comment to a post
    """
    post = get_object_or_404(Forum, pk=post_pk)
    
    if request.method == 'GET':
        comments = post.comments.filter(parent_comment=None)  # Only top-level comments
        serializer = ForumCommentSerializer(comments, many=True)
        return Response({
            'comments': serializer.data,
            'total_count': post.total_comments
        }, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        user = get_user(request)
        if not user:
            return Response({'error': 'User-ID header required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        serializer = ForumCommentSerializer(data=request.data)
        if serializer.is_valid():
            comment = serializer.save(
                forum_post=post,
                comment_from=user
            )
            
            response_serializer = ForumCommentSerializer(comment)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
def comment_detail(request, comment_pk):
    """
    PUT: Update a comment (only by owner)
    DELETE: Delete a comment (only by owner or staff)
    """
    comment = get_object_or_404(ForumComment, pk=comment_pk)
    user = get_user(request)
    
    if not user:
        return Response({'error': 'User-ID header required'}, status=status.HTTP_401_UNAUTHORIZED)
    
    if request.method == 'PUT':
        # Check permissions
        if comment.comment_from != user:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = ForumCommentSerializer(comment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        # Check permissions
        if comment.comment_from != user and user.role != 'staff':
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        comment.delete()
        return Response({'message': 'Comment deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
def approve_post(request, post_pk):
    """Approve a pending forum post (staff only)"""
    user = get_user(request)
    if not user or user.role != 'staff':
        return Response({'error': 'Staff permission required'}, status=status.HTTP_403_FORBIDDEN)
    
    post = get_object_or_404(Forum, pk=post_pk)
    
    action = request.data.get('action', 'approve')  # approve or reject
    
    if action == 'approve':
        post.status = 'posted'
    elif action == 'reject':
        post.status = 'rejected'
    else:
        return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)
    
    post.save()
    
    return Response({
        'message': f'Post {action}d successfully',
        'post_id': post.id,
        'status': post.status
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
def reject_post(request, post_pk):
    """Reject a pending forum post (staff only)"""
    user = get_user(request)
    if not user or user.role != 'staff':
        return Response({'error': 'Staff permission required'}, status=status.HTTP_403_FORBIDDEN)
    
    post = get_object_or_404(Forum, pk=post_pk)
    post.status = 'rejected'
    post.save()
    
    return Response({
        'message': 'Post rejected successfully',
        'post_id': post.id,
        'status': post.status
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
def toggle_pin(request, post_pk):
    """Toggle pin status of a forum post (staff only)"""
    user = get_user(request)
    if not user or user.role != 'staff':
        return Response({'error': 'Staff permission required'}, status=status.HTTP_403_FORBIDDEN)
    
    post = get_object_or_404(Forum, pk=post_pk)
    post.is_pinned = not post.is_pinned
    post.save()
    
    action = 'pinned' if post.is_pinned else 'unpinned'
    
    return Response({
        'message': f'Post {action} successfully',
        'post_id': post.id,
        'is_pinned': post.is_pinned
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
def pending_posts(request):
    """Get all pending posts for staff approval"""
    user = get_user(request)
    if not user or user.role != 'staff':
        return Response({'error': 'Staff permission required'}, status=status.HTTP_403_FORBIDDEN)
    
    posts = Forum.objects.filter(status='pending').select_related('posted_by')
    serializer = ForumSerializer(posts, many=True, context={'request': request})
    
    return Response({
        'posts': serializer.data,
        'total_count': posts.count()
    }, status=status.HTTP_200_OK)


def create_attachment(post, file):
    """Helper function to create attachment with metadata"""
    try:
        # Determine file type
        file_type = 'document'
        if file.content_type.startswith('image/'):
            file_type = 'image'
        elif file.content_type.startswith('video/'):
            file_type = 'video'
        elif file.content_type == 'application/pdf':
            file_type = 'pdf'
        
        # Create attachment
        attachment = ForumAttachment.objects.create(
            forum_post=post,
            file=file,
            file_type=file_type,
            file_name=file.name,
            file_size=file.size
        )
        
        # For images, get dimensions
        if file_type == 'image':
            try:
                with Image.open(file) as img:
                    attachment.width = img.width
                    attachment.height = img.height
                    attachment.save()
            except Exception:
                pass  # If we can't get dimensions, that's ok
        
        serializer = ForumAttachmentSerializer(attachment)
        return serializer.data
        
    except Exception as e:
        print(f"Error creating attachment: {e}")
        return None
