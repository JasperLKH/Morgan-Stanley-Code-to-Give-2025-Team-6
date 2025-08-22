from __future__ import annotations
from django.conf import settings
from django.db import models
from django.utils import timezone


class Assignment(models.Model):
    """
    Assignments entity: represents a homework or project assignment created by staff.
    Created by: Jasper
    """
    name = models.CharField(max_length=255)
    release_date = models.DateField()
    due_date = models.DateField()

    questions = models.FileField(
        upload_to="assignments/questions/%Y/%m/%d/",
        blank=True, null=True,
        help_text="PDF/Doc containing the questions."
    )

    # answers = models.FileField(
    #     upload_to="assignments/answers/%Y/%m/%d/",
    #     blank=True, null=True,
    #     help_text="Optional teacher answer sheet."
    # )

    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,             
        related_name="created_assignments",
    )

    hidden = models.BooleanField(default=False, help_text="Whether this assignment is hidden from students/parents")

    class Meta:
        ordering = ["-release_date", "id"]
        indexes = [
            models.Index(fields=["release_date"]),
            models.Index(fields=["due_date"]),
        ]

    def __str__(self) -> str:
        return f"{self.name} (due {self.due_date})"

class AssignmentSubmission(models.Model):
    """
    AssignmentsSubmission entity: links a user to an assignment submission, tracking status and grading.
    Created by: Jasper
    """
    STATUS_NOT_SUBMITTED = 0
    STATUS_SUBMITTED = 1
    STATUS_GRADED = 2
    STATUS_CHOICES = [
        (STATUS_NOT_SUBMITTED, "Not submitted"),
        (STATUS_SUBMITTED, "Submitted"),
        (STATUS_GRADED, "Graded"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="submissions",
    )
    assignment = models.ForeignKey(
        Assignment,
        on_delete=models.CASCADE,
        related_name="submissions",
    )

    status = models.PositiveSmallIntegerField(choices=STATUS_CHOICES, default=STATUS_NOT_SUBMITTED)

    # Grading
    score = models.FloatField(blank=True, null=True)
    feedback = models.TextField(blank=True, null=True)

    # Timestamps
    graded_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "assignment"],
                name="uniq_user_assignment"
            ),
        ]
        indexes = [
            models.Index(fields=["user", "assignment"]),
            models.Index(fields=["status"]),
        ]

    def __str__(self) -> str:
        return f"{self.user} → {self.assignment} ({self.get_status_display()})"

    def mark_submitted(self, when: timezone.datetime | None = None) -> None:
        """
        Set status to SUBMITTED
        Attachments should be created separately and linked to this submission.
        """
        now = when or timezone.now()
        self.status = self.STATUS_SUBMITTED
        self.save(update_fields=["status", "updated_at"])
        
        # Update user's streak if applicable
        submitted_day = now.date()
        self.user.update_streak_on_submission(submitted_on=submitted_day)

    def mark_graded(self, score: float | None, feedback: str | None, when: timezone.datetime | None = None) -> None:
        """
        Set status to GRADED and stamp graded_at.
        """
        self.status = self.STATUS_GRADED
        self.score = score
        self.feedback = feedback
        self.graded_at = when or timezone.now()
        self.save(update_fields=["status", "score", "feedback", "graded_at", "updated_at"])

class SubmissionAttachment(models.Model):
    """
    SubmissionAttachment entity: links a file to an assignment submission, allowing for media uploads.
    Created by: Jasper
    """
    IMAGE, VIDEO, AUDIO, FILE = "image", "video", "audio", "file"
    KIND_CHOICES = [
        (IMAGE, "Image"),
        (VIDEO, "Video"),
        (AUDIO, "Audio"),
        (FILE, "File"),
    ]

    submission = models.ForeignKey(
        AssignmentSubmission,
        on_delete=models.CASCADE,
        related_name="attachments",
    )
    kind = models.CharField(max_length=10, choices=KIND_CHOICES, default=FILE)

    blob = models.FileField(
        upload_to="submissions/%Y/%m/%d/",
        blank=True, null=True,
        help_text="Uploaded file (image/video/audio/pdf)."
    )

    # Media metadata
    width = models.IntegerField(blank=True, null=True)     # images/video
    height = models.IntegerField(blank=True, null=True)
    duration_ms = models.IntegerField(blank=True, null=True)  # audio/video
    transcode_status = models.CharField(
        max_length=20, blank=True, null=True,
        help_text="e.g., pending/success/failed (if you add processing)."
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["submission", "kind"]),
        ]

    def __str__(self) -> str:
        return f"Attachment[{self.kind}] for submission {self.submission_id}"
