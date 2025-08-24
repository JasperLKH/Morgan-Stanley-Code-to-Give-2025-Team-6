from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, School

class SchoolSerializer(serializers.ModelSerializer):
    """Serializer for School model - handles create, read, update operations"""
    
    class Meta:
        model = School
        fields = ['id', 'name']
        read_only_fields = ['id']  # ID is auto-generated
    
    def validate_name(self, value):
        """Validate school name is not empty and unique"""
        if not value or not value.strip():
            raise serializers.ValidationError("School name cannot be empty.")
        
        # Check for uniqueness during creation
        if not self.instance and School.objects.filter(name=value).exists():
            raise serializers.ValidationError(f"School with name '{value}' already exists.")
        
        # Check for uniqueness during update (excluding current instance)
        if self.instance and School.objects.filter(name=value).exclude(pk=self.instance.pk).exists():
            raise serializers.ValidationError(f"School with name '{value}' already exists.")
            
        return value.strip()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    school = serializers.CharField(required=False, allow_blank=True, allow_null=True)  # Accept school name as string
    
    class Meta:
        model = User
        fields = ['id', 'username', 'role', 'parent_name', 'children_name', 'staff_name', 'teacher_name', 'password', 'school', 'points', 'weekly_points', 'streaks']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def validate_school(self, value):
        """Validate that the school exists if provided"""
        if value:
            try:
                school = School.objects.get(name=value)
                return school
            except School.DoesNotExist:
                raise serializers.ValidationError(f"School '{value}' does not exist. Please provide a valid school name.")
        return None
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        school = validated_data.pop('school', None)
        
        user = User(**validated_data)
        user.set_password(password)
        
        # Set the school if provided and validated
        if school:
            user.school = school
            
        user.save()
        return user
    
    def to_representation(self, instance):
        """Return school name in the response"""
        ret = super().to_representation(instance)
        ret['school'] = instance.school.name if instance.school else None
        return ret

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