from django.db import models
from django.utils import timezone
from .knowledge import MedicalSource, WarningSign

class MedicineClass(models.Model):
    """Pharmacological or therapeutic classification of medicines."""
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    mechanism = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Medicine(models.Model):
    """Offline reference information for approved medications."""
    code = models.CharField(max_length=64, unique=True)
    generic_name = models.CharField(max_length=255, db_index=True)
    brand_names = models.TextField(help_text="Comma-separated popular brand names", blank=True)
    medicine_class = models.ForeignKey(MedicineClass, on_delete=models.SET_NULL, null=True, blank=True, related_name='medicines')
    dosage_form = models.CharField(max_length=128, help_text="e.g. Tablet, Syrup, Inhaler, Topical Cream")
    general_uses = models.TextField(help_text="General recognized indications")
    warnings = models.TextField(help_text="Key precautions and black-box warnings")
    contraindications = models.TextField(help_text="Conditions where this medicine must NOT be used")
    common_side_effects = models.TextField(blank=True)
    storage_information = models.TextField(default="Store below 25°C in a dry place away from direct sunlight and children.")
    pregnancy_category = models.CharField(max_length=32, default='Consult Physician')
    source = models.ForeignKey(MedicalSource, on_delete=models.SET_NULL, null=True, blank=True)
    last_verified = models.DateField(default=timezone.now)
    review_status = models.CharField(max_length=50, default='Approved')

    class Meta:
        ordering = ['generic_name']

    def __str__(self):
        return f"{self.generic_name} ({self.dosage_form})"

    def get_brand_list(self):
        if not self.brand_names:
            return []
        return [b.strip() for b in self.brand_names.split(',') if b.strip()]


class MedicineInteraction(models.Model):
    """Pairwise drug-drug or drug-food interactions with severity levels."""
    SEVERITY_CHOICES = [
        ('MINOR', 'Minor - Monitor'),
        ('MODERATE', 'Moderate - Caution advised'),
        ('MAJOR', 'Major - Avoid combination / Severe risk'),
    ]
    medicine_a = models.ForeignKey(Medicine, on_delete=models.CASCADE, related_name='interactions_as_a')
    medicine_b = models.ForeignKey(Medicine, on_delete=models.CASCADE, related_name='interactions_as_b')
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='MODERATE')
    description = models.TextField()
    clinical_recommendation = models.TextField(blank=True)
    source = models.ForeignKey(MedicalSource, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        unique_together = ('medicine_a', 'medicine_b')

    def __str__(self):
        return f"[{self.severity}] {self.medicine_a.generic_name} + {self.medicine_b.generic_name}"
