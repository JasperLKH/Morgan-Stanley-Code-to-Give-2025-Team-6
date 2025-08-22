from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('parent', 'Parent'),
        ('teacher', 'Teacher'),
        ('staff', 'Staff'),
        ('admin', 'Admin'),
    ]
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='parent')
    parent_name = models.CharField(max_length=100, blank=True, null=True)
    children_name = models.CharField(max_length=100, blank=True, null=True)
    school = models.CharField(max_length=200, blank=True, null=True)
    point = models.IntegerField(default=0, blank=True, null=True)
    streak = models.IntegerField(default=0, blank=True, null=True)

    # Hide unnecessary fields by setting them to null/blank
    first_name = None
    last_name = None
    email = None
    date_joined = None
    last_login = None

    def __str__(self):
        return f"{self.username} ({self.role})"