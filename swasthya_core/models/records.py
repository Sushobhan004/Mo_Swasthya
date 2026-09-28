from django.db import models
from django.utils import timezone
from .knowledge import Symptom, Condition, WarningSign

class Assessment(models.Model):
    """Local decision-support assessment session log."""
    session_id = models.CharField(max_length=64, unique=True)
    raw_input_text = models.TextField()
    extracted_symptoms = models.JSONField(default=list)
    negated_symptoms = models.JSONField(default=list)
    duration_str = models.CharField(max_length=128, blank=True)
    severity_level = models.CharField(max_length=64, default='Unknown')
    risk_level = models.CharField(max_length=32, default='LOW')
    matched_conditions = models.JSONField(default=list)
    detected_warning_signs = models.JSONField(default=list)
    decision_support_summary = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    system_version = models.CharField(max_length=32, default='2.4.0')
    knowledge_version = models.IntegerField(default=18)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Assessment {self.session_id} [{self.risk_level}] - {self.created_at.strftime('%Y-%m-%d %H:%M')}"


class ImageAnalysisLog(models.Model):
    """Log for medical image quality validation and local inference result."""
    task_name = models.CharField(max_length=128)
    image_quality_status = models.CharField(max_length=64, default='Adequate')
    quality_score = models.FloatField(default=0.95)
    inferred_category = models.CharField(max_length=128)
    confidence_score = models.FloatField(default=0.0)
    uncertainty_level = models.CharField(max_length=64, default='Low')
    findings_summary = models.TextField()
    safety_disclaimer = models.TextField(default="Decision support screening prototype only. NOT a definitive medical diagnostic.")
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.task_name} Analysis ({self.inferred_category}) - {self.created_at.strftime('%Y-%m-%d %H:%M')}"


class UserHealthProfile(models.Model):
    """Locally stored profile for personal health history."""
    profile_id = models.CharField(max_length=64, unique=True, default='local_user_default')
    encrypted_payload = models.TextField(blank=True, help_text="Client-side AES-GCM encrypted allergies, chronic conditions, and meds")
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile {self.profile_id}"
