from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.core.paginator import Paginator
from account.models import User

from .models import Assignment, AssignmentSubmission
from .serializers import AssignmentSerializer, AssignmentSubmissionSerializer


def is_staff_user(request):
    """Check if user role is staff"""
    # Get user_id from request (could be from headers, query params, or body)
    user_id = request.headers.get('User-ID') or request.GET.get('user_id') or request.data.get('user_id')
    
    if not user_id:
        return False, None
    
    try:
        user = User.objects.get(id=user_id)
        return user.role == 'staff', user
    except User.DoesNotExist:
        return False, None


@api_view(['GET', 'POST'])
@parser_classes([MultiPartParser, FormParser])
def assignment_list_create(request):
    """
    GET: List all assignments (staff only)
    POST: Create a new assignment (staff only)
    """
    is_staff, user = is_staff_user(request)
    if not is_staff:
        return Response({'detail': 'Staff access required'}, status=status.HTTP_403_FORBIDDEN)
    
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


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@parser_classes([MultiPartParser, FormParser])
def assignment_detail(request, pk):
    """
    GET: Retrieve an assignment
    PUT/PATCH: Update an assignment (staff only)
    DELETE: Delete an assignment (staff only)
    """
    is_staff, user = is_staff_user(request)
    if not is_staff:
        return Response({'detail': 'Staff access required'}, status=status.HTTP_403_FORBIDDEN)
    
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
    is_staff, user = is_staff_user(request)
    if not is_staff:
        return Response({'detail': 'Staff access required'}, status=status.HTTP_403_FORBIDDEN)
    
    assignment = get_object_or_404(Assignment, pk=pk)
    assignment.hidden = True
    assignment.save(update_fields=['hidden'])
    return Response({'status': 'hidden', 'assignment_id': assignment.id})


@api_view(['POST'])
def assignment_unhide(request, pk):
    """Unhide an assignment (staff only)"""
    is_staff, user = is_staff_user(request)
    if not is_staff:
        return Response({'detail': 'Staff access required'}, status=status.HTTP_403_FORBIDDEN)
    
    assignment = get_object_or_404(Assignment, pk=pk)
    assignment.hidden = False
    assignment.save(update_fields=['hidden'])
    return Response({'status': 'visible', 'assignment_id': assignment.id})


@api_view(['POST'])
def assignment_update_deadline(request, pk):
    """Update assignment deadline (staff only)"""
    is_staff, user = is_staff_user(request)
    if not is_staff:
        return Response({'detail': 'Staff access required'}, status=status.HTTP_403_FORBIDDEN)
    
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
    is_staff, user = is_staff_user(request)
    if not is_staff:
        return Response({'detail': 'Staff access required'}, status=status.HTTP_403_FORBIDDEN)
    
    assignment = get_object_or_404(Assignment, pk=assignment_pk)
    submissions = AssignmentSubmission.objects.filter(assignment=assignment).order_by('-created_at')
    serializer = AssignmentSubmissionSerializer(submissions, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def grade_submission(request, submission_pk):
    """Grade a submission (staff only)"""
    is_staff, user = is_staff_user(request)
    if not is_staff:
        return Response({'detail': 'Staff access required'}, status=status.HTTP_403_FORBIDDEN)
    
    submission = get_object_or_404(AssignmentSubmission, pk=submission_pk)
    score = request.data.get('score')
    feedback = request.data.get('feedback')
    
    submission.mark_graded(score=score, feedback=feedback)
    serializer = AssignmentSubmissionSerializer(submission)
    return Response(serializer.data)


@api_view(['PATCH'])
def update_submission_feedback(request, submission_pk):
    """Update feedback for a submission (staff only)"""
    is_staff, user = is_staff_user(request)
    if not is_staff:
        return Response({'detail': 'Staff access required'}, status=status.HTTP_403_FORBIDDEN)
    
    submission = get_object_or_404(AssignmentSubmission, pk=submission_pk)
    feedback = request.data.get('feedback')
    
    if feedback is None:
        return Response({'detail': 'feedback is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    submission.feedback = feedback
    submission.save(update_fields=['feedback', 'updated_at'])
    
    # TODO: Implement user notification system
    # TODO: Notify the student that feedback has been updated
    # TODO: Send push notification or email to student about feedback update
    # TODO: Create notification record in database for student dashboard
    
    serializer = AssignmentSubmissionSerializer(submission)
    return Response({
        'status': 'feedback_updated',
        'submission_id': submission.id,
        'message': 'Feedback updated successfully',
        'data': serializer.data
    })
