from django.db import models
from django.utils import timezone
from .knowledge import MedicalSource

class EmergencyRule(models.Model):
    """Explicit, auditable rule for detecting urgent medical red flags."""
    rule_id = models.CharField(max_length=64, unique=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    # Trigger criteria as JSON e.g. {"required_symptoms": ["chest pain", "shortness of breath"], "min_severity": "severe"}
    criteria = models.JSONField(default=dict)
    risk_level = models.CharField(max_length=32, default='URGENT', choices=[
        ('LOW', 'Low / Informational'),
        ('CAUTION', 'Caution / Medical Attention Suggested'),
        ('URGENT', 'Urgent / Immediate Emergency Care Required'),
    ])
    warning_text = models.TextField(help_text="Direct patient advisory message shown with zero delay")
    immediate_first_aid = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    rule_version = models.CharField(max_length=32, default='1.0')
    source = models.ForeignKey(MedicalSource, on_delete=models.SET_NULL, null=True, blank=True)
    last_verified = models.DateField(default=timezone.now)

    class Meta:
        ordering = ['-risk_level', 'rule_id']

    def __str__(self):
        return f"[{self.risk_level}] {self.rule_id}: {self.title}"
