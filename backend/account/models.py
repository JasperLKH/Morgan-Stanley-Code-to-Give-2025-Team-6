import email
from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import date, timedelta
from django.utils import timezone

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
    points = models.IntegerField(default=0, blank=True, null=True)
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
    
    def update_streak_on_submission(self, submitted_on: date | None = None) -> None:
        """
        Call this when a submission is made today (or pass a specific date).
        If last_submission was exactly yesterday, increment streak; else reset to 1.
        """
        today = submitted_on or date.today()
        if self.last_submission == today - timedelta(days=1):
            self.streaks = (self.streaks or 0) + 1
        else:
            self.streaks = 1
        self.last_submission = today
        self.save(update_fields=["streaks", "last_submission"])
    

    
