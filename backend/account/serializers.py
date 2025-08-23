from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'role', 'parent_name', 'children_name', 'staff_name', 'teacher_name', 'password', 'school', 'points', 'streaks']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, required=False)
    
    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        role = data.get('role')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                if not user.is_active:
                    raise serializers.ValidationError('User account is disabled.')
                
                if role and user.role != role:
                    raise serializers.ValidationError('Invalid role for this user.')
                
                data['user'] = user
                return data
            else:
                raise serializers.ValidationError('Unable to log in with provided credentials.')
        else:
            raise serializers.ValidationError('Must include username and password.')

class UpdateUserNameSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    staff_name = serializers.CharField(max_length=100, required=False, allow_blank=True, allow_null=True)
    teacher_name = serializers.CharField(max_length=100, required=False, allow_blank=True, allow_null=True)
    parent_name = serializers.CharField(max_length=100, required=False, allow_blank=True, allow_null=True)
    
    def validate(self, data):
        # Check that at least one name field is provided
        name_fields = ['staff_name', 'teacher_name', 'parent_name']
        if not any(field in data for field in name_fields):
            raise serializers.ValidationError(
                'At least one name field must be provided (staff_name, teacher_name, or parent_name)'
            )
        return data