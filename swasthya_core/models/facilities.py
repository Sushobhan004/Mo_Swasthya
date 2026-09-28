from django.db import models
from django.utils import timezone
import math

class HealthcareFacility(models.Model):
    """Preloaded offline healthcare facilities, clinics, pharmacies, and blood banks."""
    FACILITY_TYPES = [
        ('HOSPITAL', 'Multi-Speciality Hospital'),
        ('EMERGENCY_CENTER', '24/7 Emergency & Trauma Center'),
        ('CLINIC', 'Primary Health Clinic'),
        ('PHARMACY', 'Pharmacy / Chemist'),
        ('BLOOD_BANK', 'Blood Bank & Transfusion Unit'),
        ('DIAGNOSTIC_LAB', 'Diagnostic Laboratory & Imaging'),
    ]

    code = models.CharField(max_length=64, unique=True)
    name = models.CharField(max_length=255, db_index=True)
    facility_type = models.CharField(max_length=32, choices=FACILITY_TYPES, default='HOSPITAL')
    latitude = models.FloatField(help_text="WGS-84 Latitude")
    longitude = models.FloatField(help_text="WGS-84 Longitude")
    address = models.TextField()
    city = models.CharField(max_length=128, default='Metropolis')
    phone = models.CharField(max_length=64, default='112 / 108')
    emergency_phone = models.CharField(max_length=64, blank=True, help_text="Direct emergency line")
    services = models.TextField(help_text="Comma-separated available clinical services")
    is_24x7 = models.BooleanField(default=True)
    has_ambulance = models.BooleanField(default=True)
    has_icu = models.BooleanField(default=True)
    last_verified = models.DateField(default=timezone.now)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.get_facility_type_display()})"

    def calculate_distance(self, user_lat, user_lon):
        """Calculates distance in kilometers using the Haversine formula."""
        R = 6371.0 # Earth radius in kilometers
        dlat = math.radians(self.latitude - user_lat)
        dlon = math.radians(self.longitude - user_lon)
        a = (math.sin(dlat / 2) ** 2 +
             math.cos(math.radians(user_lat)) * math.cos(math.radians(self.latitude)) *
             math.sin(dlon / 2) ** 2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return round(R * c, 2)
