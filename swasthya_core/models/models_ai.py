from django.db import models
from django.utils import timezone

class AIModelRegistry(models.Model):
    """Registry of validated local AI and Computer Vision models."""
    model_name = models.CharField(max_length=128, unique=True)
    model_version = models.CharField(max_length=32, default='1.0.0')
    task = models.CharField(max_length=128, help_text="e.g. skin_lesion_screening, chest_xray_opacity, nlp_entity_extractor")
    input_format = models.CharField(max_length=128, default="224x224 RGB Image")
    output_format = models.CharField(max_length=128, default="Classification probabilities + uncertainty score")
    accuracy_metrics = models.JSONField(default=dict, help_text="Evaluated accuracy, precision, recall, F1, AUROC")
    training_dataset = models.CharField(max_length=255, default="ISIC Archive & NIH CXR-14 Clinical Subsets")
    license = models.CharField(max_length=64, default="Apache 2.0 / Open Medical AI")
    is_active = models.BooleanField(default=True)
    is_offline_ready = models.BooleanField(default=True)
    local_weights_path = models.CharField(max_length=255, blank=True)
    last_updated = models.DateField(default=timezone.now)

    class Meta:
        ordering = ['model_name']

    def __str__(self):
        return f"{self.model_name} (v{self.model_version}) - {self.task}"
