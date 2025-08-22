from django.contrib import admin
from .models import Assignment, AssignmentSubmission, SubmissionAttachment


@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'release_date', 'due_date', 'created_by', 'hidden', 'created_at')
    list_filter = ('hidden', 'release_date', 'due_date', 'created_by')
    search_fields = ('name', 'created_by__username')
    readonly_fields = ('id', 'created_at')
    ordering = ('-release_date', '-id')


@admin.register(AssignmentSubmission)
class AssignmentSubmissionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'assignment', 'status', 'score', 'graded_at', 'created_at')
    list_filter = ('status', 'assignment', 'graded_at', 'created_at')
    search_fields = ('user__username', 'assignment__name')
    readonly_fields = ('id', 'created_at', 'updated_at')
    ordering = ('-created_at', '-id')


@admin.register(SubmissionAttachment)
class SubmissionAttachmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'submission', 'kind', 'blob', 'width', 'height', 'created_at')
    list_filter = ('kind', 'created_at')
    readonly_fields = ('id', 'created_at')
    ordering = ('-created_at', '-id')

