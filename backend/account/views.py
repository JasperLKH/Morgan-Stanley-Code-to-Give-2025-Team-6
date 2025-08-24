from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import UserSerializer, LoginSerializer, UpdateUserNameSerializer
from .models import User

@api_view(['POST'])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        
        user_data = {
            'id': user.id,
            'username': user.username,
            'role': user.role,
            'parent_name': user.parent_name,
            'children_name': user.children_name,
            'staff_name': user.staff_name,
            'teacher_name': user.teacher_name,
            'school': user.school,
            'points': user.points,
            'weekly_points': user.weekly_points,
            'streaks': user.current_streak
        }
        
        return Response({
            'user': user_data
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        
        user_data = {
            'id': user.id,
            'username': user.username,
            'role': user.role,
            'parent_name': user.parent_name,
            'children_name': user.children_name,
            'staff_name': user.staff_name,
            'teacher_name': user.teacher_name,
            'school': user.school,
            'points': user.points,
            'weekly_points': user.weekly_points,
            'streaks': user.current_streak
        }
        
        return Response({
            'user': user_data
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['POST'])
# def logout(request):
#     return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_all_users(request):
    """
    Allow staff users to get all users 
    """
    
    # Get all users with roles: staff, teacher, parent
    allowed_roles = ['staff', 'teacher', 'parent']
    users = User.objects.filter(role__in=allowed_roles)
    
    users_data = []
    for user in users:
        user_data = {
            'id': user.id,
            'username': user.username,
            'role': user.role,
            'parent_name': user.parent_name,
            'children_name': user.children_name,
            'staff_name': user.staff_name,
            'teacher_name': user.teacher_name,
            'school': user.school,
            'points': user.points,
            'weekly_points': user.weekly_points,
            'streaks': user.current_streak,
            'is_active': user.is_active
        }
        users_data.append(user_data)
    
    return Response({
        'users': users_data,
        'total_count': len(users_data)
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_user_by_id(request):
    """
    Allow staff users to get a single user by id.
    Query params: id=<user_id_to_get>
    """
    
    user_id = request.GET.get('id')
    if not user_id:
        return Response({'error': 'Missing query parameter: id'}, status=status.HTTP_400_BAD_REQUEST)

    allowed_roles = ['staff', 'teacher', 'parent']
    try:
        user = User.objects.get(id=user_id, role__in=allowed_roles)
    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    user_data = {
        'id': user.id,
        'username': user.username,
        'role': user.role,
        'parent_name': user.parent_name,
        'children_name': user.children_name,
        'staff_name': user.staff_name,
        'teacher_name': user.teacher_name,
        'school': user.school,
        'points': user.points,
        'weekly_points': user.weekly_points,
        'streaks': user.current_streak,
        'is_active': user.is_active
    }

    return Response({'user': user_data}, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_user_by_school(request):
    """
    Allow staff users to get users by school.
    Query params: school=<school_name>
    """

    school = request.GET.get('school')
    if not school:
        return Response({'error': 'Missing query parameter: school'}, status=status.HTTP_400_BAD_REQUEST)

    allowed_roles = ['staff', 'teacher', 'parent']
    users = User.objects.filter(role__in=allowed_roles, school=school)

    users_data = []
    for user in users:
        user_data = {
            'id': user.id,
            'username': user.username,
            'role': user.role,
            'parent_name': user.parent_name,
            'children_name': user.children_name,
            'staff_name': user.staff_name,
            'teacher_name': user.teacher_name,
            'school': user.school,
            'points': user.points,
            'weekly_points': user.weekly_points,
            'streaks': user.current_streak,
            'is_active': user.is_active
        }
        users_data.append(user_data)

    return Response({
        'users': users_data,
        'total_count': len(users_data)
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
def activate_user(request):
    """
    Allow staff users to activate a user account.
    Usage: POST /.../activate_user/ 
    JSON body: {"user_id": <user_id_to_activate>}
    """
    
    user_id = request.data.get('user_id')
    if not user_id:
        return Response({'error': 'Missing field: user_id'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    # Activate the user
    user.is_active = True
    user.save()

    return Response({
        'message': f'User {user.username} has been activated successfully.',
        'user_id': user.id,
        'username': user.username,
        'is_active': user.is_active
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
def deactivate_user(request):
    """
    Allow staff users to deactivate a user account.
    Usage: POST /.../deactivate_user/ 
    JSON body: {"user_id": <user_id_to_deactivate>}
    """

    user_id = request.data.get('user_id')
    if not user_id:
        return Response({'error': 'Missing field: user_id'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    # Prevent staff from deactivating other staff accounts
    if user.role == 'staff':
        return Response({'error': 'Cannot deactivate staff accounts.'},
                        status=status.HTTP_400_BAD_REQUEST)

    # Deactivate the user
    user.is_active = False
    user.save()

    return Response({
        'message': f'User {user.username} has been deactivated successfully.',
        'user_id': user.id,
        'username': user.username,
        'is_active': user.is_active
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_weekly_leaderboard(request):
    """
    Get top 5 parents with the highest weekly points.
    Query params: school=<school_name> (optional - filter by school)
    """
    
    # Get school filter if provided
    school = request.GET.get('school')
    
    # Filter parents only
    parents = User.objects.filter(role='parent', is_active=True)
    
    # Apply school filter if provided
    if school:
        parents = parents.filter(school=school)
    
    # Order by weekly_points descending and get top 5
    top_parents = parents.order_by('-weekly_points')[:5]
    
    leaderboard_data = []
    for rank, parent in enumerate(top_parents, 1):
        parent_data = {
            'rank': rank,
            'id': parent.id,
            'username': parent.username,
            'parent_name': parent.parent_name,
            'children_name': parent.children_name,
            'school': parent.school,
            'weekly_points': parent.weekly_points,
            'total_points': parent.points,
            'current_streak': parent.current_streak
        }
        leaderboard_data.append(parent_data)
    
    return Response({
        'leaderboard': leaderboard_data,
        'total_count': len(leaderboard_data),
        'school_filter': school if school else 'All schools'
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
def reset_weekly_points(request):
    """
    Reset all users' weekly points to 0.
    This can be called weekly by staff to reset the leaderboard.
    """
    
    # Reset weekly points for all users
    User.objects.all().update(weekly_points=0)
    
    return Response({
        'message': 'Weekly points have been reset for all users.',
        'reset_count': User.objects.count()
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
def update_user_name(request):
    """
    Update user's name fields based on their role.
    Usage: POST /update_user_name/
    JSON body: {
        "user_id": <user_id_to_update>,
        "staff_name": <name_for_staff_role> (optional),
        "teacher_name": <name_for_teacher_role> (optional),
        "parent_name": <name_for_parent_role> (optional)
    }
    
    Note: At least one name field must be provided.
    """
    
    serializer = UpdateUserNameSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    validated_data = serializer.validated_data
    user_id = validated_data['user_id']

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    # Track what fields were updated
    updated_fields = []
    
    # Update fields based on provided data
    if 'staff_name' in validated_data:
        user.staff_name = validated_data['staff_name']
        updated_fields.append('staff_name')
    
    if 'teacher_name' in validated_data:
        user.teacher_name = validated_data['teacher_name']
        updated_fields.append('teacher_name')
    
    if 'parent_name' in validated_data:
        user.parent_name = validated_data['parent_name']
        updated_fields.append('parent_name')
    
    # Save the user with updated fields
    user.save(update_fields=updated_fields)
    
    # Return updated user data
    user_data = {
        'id': user.id,
        'username': user.username,
        'role': user.role,
        'parent_name': user.parent_name,
        'children_name': user.children_name,
        'staff_name': user.staff_name,
        'teacher_name': user.teacher_name,
        'school': user.school,
        'points': user.points,
        'weekly_points': user.weekly_points,
        'streaks': user.current_streak,
        'is_active': user.is_active
    }
    
    return Response({
        'message': f'Successfully updated {", ".join(updated_fields)} for user {user.username}',
        'updated_fields': updated_fields,
        'user': user_data
    }, status=status.HTTP_200_OK)



