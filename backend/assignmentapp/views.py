from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.core.paginator import Paginator
from account.models import User

from .models import Assignment, AssignmentSubmission, SubmissionAttachment
from account.models import User
from .serializers import AssignmentSerializer, AssignmentSubmissionSerializer


def get_user(request):
    """Check if user role is staff"""
    # Get user_id from request (could be from headers, query params, or body)
    user_id = request.headers.get('User-ID') or request.GET.get('user_id') or request.data.get('user_id')
    
    if not user_id:
        return False, None
    
    try:
        user = User.objects.get(id=user_id)
        return user
    except User.DoesNotExist:
        return False, None

@api_view(['GET', 'POST'])
@parser_classes([JSONParser, MultiPartParser, FormParser])
def assignment_list_create(request):
    """
    GET: List all assignments (staff only)
    POST: Create a new assignment (staff only)
    """
    user = get_user(request)
 
    if request.method == 'GET':
        assignments = Assignment.objects.all().order_by('-release_date')
        serializer = AssignmentSerializer(assignments, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = AssignmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def user_assignments(request, user_id):
    """Get assignments for a specific user"""
    user = get_object_or_404(User, id=user_id)
    
    # Get all non-hidden assignments
    all_assignments = Assignment.objects.filter(hidden=False).order_by('-release_date')
    
    # Filter assignments that are assigned to this user
    assignments = [assignment for assignment in all_assignments if assignment.is_assigned_to_user(user)]
    
    # Serialize assignments with submission status for this user
    assignment_data = []
    for assignment in assignments:
        assignment_serializer = AssignmentSerializer(assignment)
        assignment_info = assignment_serializer.data
        
        # Check if user has submitted this assignment
        submission = AssignmentSubmission.objects.filter(
            user=user, 
            assignment=assignment
        ).first()
        
        if submission:
            submission_serializer = AssignmentSubmissionSerializer(submission)
            assignment_info['submission'] = submission_serializer.data
        else:
            assignment_info['submission'] = None
            
        assignment_data.append(assignment_info)
    
    return Response({
        'user_id': user_id,
        'user_name': user.username,
        'assignments': assignment_data
    })


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@parser_classes([JSONParser, MultiPartParser, FormParser])
def assignment_detail(request, pk):
    """
    GET: Retrieve an assignment
    PUT/PATCH: Update an assignment (staff only)
    DELETE: Delete an assignment (staff only)
    """

    assignment = get_object_or_404(Assignment, pk=pk)
    
    if request.method == 'GET':
        serializer = AssignmentSerializer(assignment)
        return Response(serializer.data)
    
    elif request.method in ['PUT', 'PATCH']:
        partial = request.method == 'PATCH'
        serializer = AssignmentSerializer(assignment, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        assignment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
def assignment_hide(request, pk):
    """Hide an assignment (staff only)"""

    assignment = get_object_or_404(Assignment, pk=pk)
    assignment.hidden = True
    assignment.save(update_fields=['hidden'])
    return Response({'status': 'hidden', 'assignment_id': assignment.id})


@api_view(['POST'])
def assignment_unhide(request, pk):
    """Unhide an assignment (staff only)"""

    assignment = get_object_or_404(Assignment, pk=pk)
    assignment.hidden = False
    assignment.save(update_fields=['hidden'])
    return Response({'status': 'visible', 'assignment_id': assignment.id})


@api_view(['POST'])
@parser_classes([JSONParser, MultiPartParser, FormParser])
def assignment_update_deadline(request, pk):
    """Update assignment deadline (staff only)"""

    assignment = get_object_or_404(Assignment, pk=pk)
    due_date = request.data.get('due_date')
    
    if not due_date:
        return Response({'detail': 'due_date is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    assignment.due_date = due_date
    assignment.save(update_fields=['due_date'])
    return Response({
        'status': 'updated', 
        'assignment_id': assignment.id,
        'due_date': assignment.due_date
    })


@api_view(['GET'])
def assignment_submissions(request, assignment_pk):
    """List submissions for an assignment (staff only)"""

    assignment = get_object_or_404(Assignment, pk=assignment_pk)
    submissions = AssignmentSubmission.objects.filter(assignment=assignment).order_by('-created_at')
    serializer = AssignmentSubmissionSerializer(submissions, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@parser_classes([JSONParser, MultiPartParser, FormParser])
def grade_submission(request, submission_pk):
    """Grade a submission (staff only)"""

    submission = get_object_or_404(AssignmentSubmission, pk=submission_pk)
    score = request.data.get('score')
    feedback = request.data.get('feedback')
    
    submission.mark_graded(score=score, feedback=feedback)
    serializer = AssignmentSubmissionSerializer(submission)
    return Response(serializer.data)


@api_view(['PATCH'])
@parser_classes([JSONParser, MultiPartParser, FormParser])
def update_submission_feedback(request, submission_pk):
    """Update feedback and/or score for a submission (staff only)"""

    submission = get_object_or_404(AssignmentSubmission, pk=submission_pk)
    feedback = request.data.get('feedback')
    score = request.data.get('score')
    
    # Check if at least one field is provided
    if feedback is None and score is None:
        return Response({'detail': 'At least feedback or score is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Update fields if provided
    updated_fields = ['updated_at']
    
    if feedback is not None:
        submission.feedback = feedback
        updated_fields.append('feedback')
    
    if score is not None:
        submission.score = score
        updated_fields.append('score')
        
        # If we're updating the score and submission isn't graded yet, mark it as graded
        if submission.status != AssignmentSubmission.STATUS_GRADED:
            submission.status = AssignmentSubmission.STATUS_GRADED
            submission.graded_at = timezone.now()
            updated_fields.extend(['status', 'graded_at'])
    
    submission.save(update_fields=updated_fields)
    
    # TODO: Implement user notification system
    # TODO: Notify the student that feedback/score has been updated
    # TODO: Send push notification or email to student about feedback/score update
    # TODO: Create notification record in database for student dashboard
    
    serializer = AssignmentSubmissionSerializer(submission)
    return Response({
        'status': 'updated',
        'submission_id': submission.id,
        'message': 'Feedback and/or score updated successfully',
        'data': serializer.data
    })


@api_view(['POST'])
@parser_classes([JSONParser, MultiPartParser, FormParser])
def assign_to_parents(request, assignment_pk):
    """Assign an assignment to specific parents (staff only)"""
    user = get_user(request)
    # Note: Add staff check if needed: if user.role != 'staff': return 403
    
    assignment = get_object_or_404(Assignment, pk=assignment_pk)
    parent_ids = request.data.get('parent_ids', [])
    
    if not parent_ids:
        return Response({'detail': 'parent_ids list is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Get parent users
    parents = User.objects.filter(id__in=parent_ids, role='parent')
    if len(parents) != len(parent_ids):
        missing_ids = set(parent_ids) - set(parents.values_list('id', flat=True))
        return Response({
            'detail': f'Parent users not found with IDs: {list(missing_ids)}'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Clear existing assignments and add new ones
    assignment.assigned_to.clear()
    assignment.assigned_to.set(parents)
    
    return Response({
        'status': 'assigned',
        'assignment_id': assignment.id,
        'assigned_to': [{'id': p.id, 'username': p.username} for p in parents],
        'message': f'Assignment assigned to {len(parents)} parents'
    })


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def submit_assignment(request, assignment_pk):
    """Submit an assignment (parent only)"""
    user = get_user(request)

    assignment = get_object_or_404(Assignment, pk=assignment_pk)
    
    # Check if assignment is assigned to this user
    if not assignment.is_assigned_to_user(user):
        return Response({'detail': 'This assignment is not assigned to you'}, status=status.HTTP_403_FORBIDDEN)
    
    # Check if assignment is not hidden
    if assignment.hidden:
        return Response({'detail': 'Assignment is not available'}, status=status.HTTP_404_NOT_FOUND)
    
    # Check if assignment is still accepting submissions (not past due date)
    now = timezone.now()
    if now > assignment.due_date:
        return Response({'detail': 'Assignment deadline has passed'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if user already has a submission for this assignment
    existing_submission = AssignmentSubmission.objects.filter(
        user=user, 
        assignment=assignment
    ).first()
    
    if existing_submission:
        # Update existing submission
        submission = existing_submission
        submission.mark_submitted()  # This will update the status and user's streak
    else:
        # Create new submission
        submission = AssignmentSubmission.objects.create(
            user=user,
            assignment=assignment,
            status=AssignmentSubmission.STATUS_SUBMITTED
        )
        submission.mark_submitted()  
        
    
    # Handle single file attachment from request.FILES
    if request.FILES:
        # Get the first (and expected only) file
        uploaded_file = next(iter(request.FILES.values()))
        
        # Clear existing attachments for this submission (in case of resubmission)
        SubmissionAttachment.objects.filter(submission=submission).delete()
        
        # Determine file type based on content type
        content_type = uploaded_file.content_type or ''
        
        if content_type.startswith('image/'):
            kind = SubmissionAttachment.IMAGE
        elif content_type.startswith('video/'):
            kind = SubmissionAttachment.VIDEO
        elif content_type.startswith('audio/'):
            kind = SubmissionAttachment.AUDIO
        else:
            kind = SubmissionAttachment.FILE
        
        # Create SubmissionAttachment object
        attachment = SubmissionAttachment.objects.create(
            submission=submission,
            kind=kind,
            blob=uploaded_file
        )
        
        # Set metadata for images
        if kind == SubmissionAttachment.IMAGE:
            try:
                from PIL import Image
                image = Image.open(uploaded_file)
                attachment.width = image.width
                attachment.height = image.height
                attachment.save(update_fields=['width', 'height'])
            except ImportError:
                # PIL not installed, skip metadata
                pass
            except Exception:
                # Error processing image, skip metadata
                pass
    
    serializer = AssignmentSubmissionSerializer(submission)
    return Response({
        'status': 'submitted',
        'submission_id': submission.id,
        'message': 'Assignment submitted successfully',
        'data': serializer.data
    }, status=status.HTTP_201_CREATED)


@api_view(['PATCH'])
@parser_classes([MultiPartParser, FormParser])
def edit_submission(request, submission_pk):
    """Edit a submission (parent only - can only edit their own submissions)"""
    user = get_user(request)

    submission = get_object_or_404(AssignmentSubmission, pk=submission_pk)
    
    # Check if the submission belongs to the requesting user
    if submission.user != user:
        return Response({'detail': 'You can only edit your own submissions'}, status=status.HTTP_403_FORBIDDEN)
    
    # Check if assignment is still accepting submissions (not past due date)
    now = timezone.now()
    if now > submission.assignment.due_date:
        return Response({'detail': 'Assignment deadline has passed'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if assignment is not hidden
    if submission.assignment.hidden:
        return Response({'detail': 'Assignment is not available'}, status=status.HTTP_404_NOT_FOUND)
    
    # Check if submission hasn't been graded yet
    if submission.status == AssignmentSubmission.STATUS_GRADED:
        return Response({'detail': 'Cannot edit graded submissions'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Handle file replacement if new file is provided
    if request.FILES:
        # Get the new file
        uploaded_file = next(iter(request.FILES.values()))
        
        # Clear existing attachments
        SubmissionAttachment.objects.filter(submission=submission).delete()
        
        # Determine file type based on content type
        content_type = uploaded_file.content_type or ''
        
        if content_type.startswith('image/'):
            kind = SubmissionAttachment.IMAGE
        elif content_type.startswith('video/'):
            kind = SubmissionAttachment.VIDEO
        elif content_type.startswith('audio/'):
            kind = SubmissionAttachment.AUDIO
        else:
            kind = SubmissionAttachment.FILE
        
        # Create new SubmissionAttachment object
        attachment = SubmissionAttachment.objects.create(
            submission=submission,
            kind=kind,
            blob=uploaded_file
        )
        
        # Set metadata for images
        if kind == SubmissionAttachment.IMAGE:
            try:
                from PIL import Image
                image = Image.open(uploaded_file)
                attachment.width = image.width
                attachment.height = image.height
                attachment.save(update_fields=['width', 'height'])
            except ImportError:
                pass
            except Exception:
                pass
    
    # Update submission timestamp
    submission.save(update_fields=['updated_at'])
    
    serializer = AssignmentSubmissionSerializer(submission)
    return Response({
        'status': 'updated',
        'submission_id': submission.id,
        'message': 'Submission updated successfully',
        'data': serializer.data
    })
