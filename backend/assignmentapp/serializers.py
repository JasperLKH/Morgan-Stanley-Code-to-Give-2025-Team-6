from rest_framework import serializers
from account.models import User
from .models import Assignment, AssignmentSubmission, SubmissionAttachment


class UserBasicSerializer(serializers.ModelSerializer):
    """Basic user info for assignment-related data"""
    class Meta:
        model = User
        fields = ["id", "username", "role"]


class AssignmentSerializer(serializers.ModelSerializer):
    created_by = UserBasicSerializer(read_only=True)
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    questions = serializers.FileField(required=False, allow_null=True)

    class Meta:
        model = Assignment
        fields = [
            "id",
            "name",
            "release_date",
            "due_date",
            "questions",
            "created_at",
            "created_by",
            "created_by_name",
            "hidden",
        ]
        read_only_fields = ["id", "created_at", "created_by", "created_by_name"]

class AssignmentSubmissionSerializer(serializers.ModelSerializer):
    user = UserBasicSerializer(read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)
    assignment = serializers.PrimaryKeyRelatedField(read_only=True)
    assignment_name = serializers.CharField(source='assignment.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = AssignmentSubmission
        fields = [
            "id",
            "user",
            "user_name",
            "assignment",
            "assignment_name",
            "status",
            "status_display",
            "score",
            "feedback",
            "graded_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "graded_at", "user_name", "assignment_name", "status_display"]


class SubmissionAttachmentSerializer(serializers.ModelSerializer):
    """Serializer for submission attachments"""

    class Meta:
        model = SubmissionAttachment
        fields = [
            "id",
            "submission",
            "kind",
            "blob",
            "width",
            "height",
            "duration_ms",
            "transcode_status",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]
