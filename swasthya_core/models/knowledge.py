from django.db import models
from django.utils import timezone

class MedicalSource(models.Model):
    """Authoritative source tracking for medical knowledge."""
    name = models.CharField(max_length=255, unique=True)
    organization = models.CharField(max_length=255)
    url = models.URLField(blank=True, null=True)
    version = models.CharField(max_length=50, default='1.0')
    last_verified = models.DateField(default=timezone.now)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} (v{self.version})"


class WarningSign(models.Model):
    """Emergency and urgent warning signs with auditable severity level."""
    SEVERITY_CHOICES = [
        ('LOW', 'Low / Informational'),
        ('CAUTION', 'Caution / Medical Attention Suggested'),
        ('URGENT', 'Urgent / Immediate Emergency Care Required'),
    ]
    code = models.CharField(max_length=64, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField()
    severity_level = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='URGENT')
    immediate_action = models.TextField(help_text="Standardized immediate first aid or emergency action guidance")
    source = models.ForeignKey(MedicalSource, on_delete=models.SET_NULL, null=True, blank=True)
    last_verified = models.DateField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-severity_level', 'name']

    def __str__(self):
        return f"[{self.severity_level}] {self.name}"


class Symptom(models.Model):
    """Medical symptoms with synonyms, body systems, and canonical codes."""
    code = models.CharField(max_length=64, unique=True)
    name = models.CharField(max_length=255)
    common_names = models.TextField(help_text="Comma-separated synonyms or colloquial terms")
    body_system = models.CharField(max_length=128, default='General')
    description = models.TextField(blank=True)
    is_emergency_flag = models.BooleanField(default=False)
    source = models.ForeignKey(MedicalSource, on_delete=models.SET_NULL, null=True, blank=True)
    last_verified = models.DateField(default=timezone.now)
    review_status = models.CharField(max_length=50, default='Approved')

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

    def get_synonyms_list(self):
        if not self.common_names:
            return []
        return [s.strip().lower() for s in self.common_names.split(',') if s.strip()]


class RiskFactor(models.Model):
    """Pre-existing conditions, age groups, lifestyle, or environmental risk factors."""
    code = models.CharField(max_length=64, unique=True)
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=128, default='Medical')
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Condition(models.Model):
    """Medical conditions with relationships, structured evidence, and sources."""
    code = models.CharField(max_length=64, unique=True)
    name = models.CharField(max_length=255)
    scientific_name = models.CharField(max_length=255, blank=True)
    category = models.CharField(max_length=128, default='General Medicine')
    overview = models.TextField()
    symptoms = models.ManyToManyField(Symptom, through='ConditionSymptom', related_name='conditions')
    warning_signs = models.ManyToManyField(WarningSign, blank=True, related_name='conditions')
    risk_factors = models.ManyToManyField(RiskFactor, blank=True, related_name='conditions')
    recommended_evaluations = models.TextField(help_text="Recommended clinical evaluations for doctor consultation")
    non_pharmacological_care = models.TextField(blank=True, help_text="Evidence-based home comfort and hydration support")
    source = models.ForeignKey(MedicalSource, on_delete=models.SET_NULL, null=True, blank=True)
    source_version = models.CharField(max_length=50, default='1.0')
    last_verified = models.DateField(default=timezone.now)
    review_status = models.CharField(max_length=50, default='Approved')

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class ConditionSymptom(models.Model):
    """Relationship between Condition and Symptom with frequency / weight."""
    condition = models.ForeignKey(Condition, on_delete=models.CASCADE)
    symptom = models.ForeignKey(Symptom, on_delete=models.CASCADE)
    weight = models.FloatField(default=1.0, help_text="Relevance weight (0.1 to 1.0)")
    is_pathognomonic = models.BooleanField(default=False)
    frequency = models.CharField(max_length=64, default='Common', choices=[
        ('Very Common', 'Very Common (>80%)'),
        ('Common', 'Common (50-80%)'),
        ('Occasional', 'Occasional (20-50%)'),
        ('Rare', 'Rare (<20%)'),
    ])

    class Meta:
        unique_together = ('condition', 'symptom')

    def __str__(self):
        return f"{self.condition.name} -> {self.symptom.name} ({self.frequency})"


class MedicalTopic(models.Model):
    """General health topics, prevention guides, and first-aid protocols."""
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=128, default='First Aid')
    content = models.TextField()
    step_by_step_guide = models.JSONField(default=list, blank=True)
    warning_notes = models.TextField(blank=True)
    source = models.ForeignKey(MedicalSource, on_delete=models.SET_NULL, null=True, blank=True)
    last_verified = models.DateField(default=timezone.now)

    def __str__(self):
        return f"[{self.category}] {self.title}"
