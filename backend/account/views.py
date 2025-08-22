from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import UserSerializer, LoginSerializer
from .models import User

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
            'school': user.school,
            'points': user.points,
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
            'school': user.school,
            'points': user.points,
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
    Headers: User-ID: <staff_user_id>
    """
    is_staff, staff_user = is_staff_user(request)
    if not is_staff:
         return Response({'error': 'Access denied. Only staff can access this endpoint.'}, 
                       status=status.HTTP_403_FORBIDDEN)
    
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
            'school': user.school,
            'points': user.points,
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
    Headers: User-ID: <staff_user_id>
    Query params: id=<user_id_to_get>
    """
    # role check (we're not using token auth)
    is_staff, staff_user = is_staff_user(request)
    if not is_staff:
         return Response({'error': 'Access denied. Only staff can access this endpoint.'}, 
                       status=status.HTTP_403_FORBIDDEN)
    
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
        'school': user.school,
        'points': user.points,
        'streaks': user.current_streak,
        'is_active': user.is_active
    }

    return Response({'user': user_data}, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_user_by_school(request):
    """
    Allow staff users to get users by school.
    Headers: User-ID: <staff_user_id>
    Query params: school=<school_name>
    """
    is_staff, staff_user = is_staff_user(request)
    if not is_staff:
         return Response({'error': 'Access denied. Only staff can access this endpoint.'}, 
                       status=status.HTTP_403_FORBIDDEN)

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
            'school': user.school,
            'points': user.points,
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
    Headers: User-ID: <staff_user_id>
    JSON body: {"user_id": <user_id_to_activate>}
    """
    # Role check using existing helper function
    is_staff, staff_user = is_staff_user(request)
    if not is_staff:
        return Response({'error': 'Access denied. Only staff can access this endpoint.'},
                        status=status.HTTP_403_FORBIDDEN)

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
    Headers: User-ID: <staff_user_id>
    JSON body: {"user_id": <user_id_to_deactivate>}
    """
    # Role check using existing helper function
    is_staff, staff_user = is_staff_user(request)
    if not is_staff:
        return Response({'error': 'Access denied. Only staff can access this endpoint.'},
                        status=status.HTTP_403_FORBIDDEN)

    user_id = request.data.get('user_id')
    if not user_id:
        return Response({'error': 'Missing field: user_id'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    # Prevent staff from deactivating themselves
    if user.id == staff_user.id:
        return Response({'error': 'Cannot deactivate your own account.'},
                        status=status.HTTP_400_BAD_REQUEST)

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

