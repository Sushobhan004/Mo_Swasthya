from django.db import models
from django.utils import timezone

class SyncVersion(models.Model):
    """Tracks published version packages and installed client package versions."""
    package_version = models.IntegerField(unique=True)
    previous_version = models.IntegerField(default=0)
    release_date = models.DateField(default=timezone.now)
    checksum_sha256 = models.CharField(max_length=64)
    manifest_data = models.JSONField(default=dict)
    is_mandatory = models.BooleanField(default=False)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-package_version']

    def __str__(self):
        return f"Package v{self.package_version} (from v{self.previous_version})"


class SyncPackage(models.Model):
    """Delta update payload files and metadata for offline distribution."""
    version = models.ForeignKey(SyncVersion, on_delete=models.CASCADE, related_name='packages')
    content_type = models.CharField(max_length=64, choices=[
        ('KNOWLEDGE', 'Medical Knowledge Base Delta'),
        ('MEDICINE', 'Medicine Repository Delta'),
        ('FACILITY', 'Healthcare Facility Directory Delta'),
        ('EMERGENCY_RULES', 'Emergency Rules Update'),
        ('AI_MODELS', 'Local AI Inference Weight Package'),
    ])
    delta_payload = models.JSONField(default=dict)
    file_size_bytes = models.BigIntegerField(default=0)
    sha256_hash = models.CharField(max_length=64)
    applied_successfully = models.BooleanField(default=True)

    def __str__(self):
        return f"v{self.version.package_version} - {self.content_type}"


class AuditLog(models.Model):
    """Auditable log of medical content edits, updates, and sync operations."""
    timestamp = models.DateTimeField(default=timezone.now)
    action = models.CharField(max_length=64)
    entity_type = models.CharField(max_length=128)
    entity_id = models.CharField(max_length=128, blank=True)
    details = models.TextField()
    performed_by = models.CharField(max_length=128, default='System / Clinical Manager')

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"[{self.timestamp.strftime('%Y-%m-%d %H:%M')}] {self.action} on {self.entity_type}"
