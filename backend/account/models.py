import email
from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import date, timedelta
from django.utils import timezone

class School(models.Model):
    """
    School model with auto-incrementing ID and unique name
    """
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200, unique=True, help_text="Name of the school")

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class User(AbstractUser):
    ROLE_CHOICES = [
        ('parent', 'Parent'),
        ('teacher', 'Teacher'),
        ('staff', 'Staff'),
        ('admin', 'Admin'),
    ]
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='parent')
    staff_name = models.CharField(max_length=100, blank=True, null=True)
    teacher_name = models.CharField(max_length=100, blank=True, null=True)
    parent_name = models.CharField(max_length=100, blank=True, null=True)
    children_name = models.CharField(max_length=100, blank=True, null=True)
    school = models.ForeignKey(School, on_delete=models.CASCADE, blank=True, null=True, help_text="School the user belongs to")
    points = models.IntegerField(default=0, blank=True, null=True)
    weekly_points = models.IntegerField(default=0, blank=True, null=True)
    streaks = models.IntegerField(default=0, blank=True, null=True)
    last_submission = models.DateField(blank=True, null=True)

    

    @property
    def current_streak(self) -> int:
        """
        Live/“effective” streak for *today*:
        - If last_submission is today  -> return stored streaks
        - If last_submission was yesterday -> return stored streaks
        - Otherwise -> 0 (streak broken)
        """
        if not self.last_submission:
            return 0
        today = timezone.localdate()
        delta_days = (today - self.last_submission).days
        return self.streaks if delta_days in (0, 1) else 0

    # Hide unnecessary fields by setting them to null/blank
    first_name = None
    last_name = None
    email = None
    date_joined = None
    last_login = None

    def __str__(self):
        return f"{self.username} ({self.role})"
    
    def update_on_submission(self, points: int = 0, submitted_on: date | None = None) -> None:
        """
        Call this when a submission is made today (or pass a specific date).
        Updates streak, points, and weekly points all at once.
        
        Args:
            points: Points to add to total points
            weekly_points: Points to add to weekly points
            submitted_on: Date of submission (defaults to today)
        """
        today = submitted_on or date.today()
        
        # Update streak logic
        if self.last_submission == today - timedelta(days=1):
            self.streaks = (self.streaks or 0) + 1
        else:
            self.streaks = 1
        self.last_submission = today
        
        # Update points
        if points:
            self.points = (self.points or 0) + points
            self.weekly_points = (self.weekly_points or 0) + points
        
        # Save all changes at once
        update_fields = ["streaks", "last_submission"]
        if points:
            update_fields.append("points")
            update_fields.append("weekly_points")
            
        self.save(update_fields=update_fields)


