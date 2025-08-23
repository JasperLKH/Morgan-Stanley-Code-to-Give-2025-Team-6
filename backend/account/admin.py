from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    # Show all user data fields
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('role', 'parent_name', 'children_name', 'staff_name', 'teacher_name', 'school')}),
        ('Points & Activity', {'fields': ('points', 'weekly_points', 'streaks', 'last_submission')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'role', 'parent_name', 'children_name', 'staff_name', 'teacher_name', 'school', 'points', 'weekly_points', 'streaks'),
        }),
    )
    
    # Show all relevant data in the list view
    list_display = ('id', 'username', 'role', 'parent_name', 'children_name', 'staff_name', 'teacher_name', 'school', 'points', 'weekly_points', 'streaks', 'last_submission', 'is_active')
    list_filter = ('role', 'is_active', 'school', 'is_staff', 'is_superuser')
    search_fields = ('username', 'parent_name', 'children_name', 'staff_name', 'teacher_name', 'school')
    ordering = ('username',)
    readonly_fields = ('last_submission',)