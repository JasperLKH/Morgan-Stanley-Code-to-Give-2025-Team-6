from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    # Only show username, password and role fields
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('role', 'parent_name', 'children_name', 'school', 'point', 'streak')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'role', 'parent_name', 'children_name', 'school', 'point', 'streak'),
        }),
    )
    
    # Show only username and role in the list view
    list_display = ('id', 'username', 'role', 'is_active')
    list_filter = ('role', 'is_active')
    search_fields = ('username',)
    ordering = ('username',)