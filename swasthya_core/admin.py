from django.contrib import admin
from .models import (
    MedicalSource, WarningSign, Symptom, RiskFactor, Condition, ConditionSymptom,
    MedicalTopic, MedicineClass, Medicine, MedicineInteraction, HealthcareFacility,
    EmergencyRule, Assessment, ImageAnalysisLog, UserHealthProfile,
    SyncVersion, SyncPackage, AuditLog, AIModelRegistry
)

class ConditionSymptomInline(admin.TabularInline):
    model = ConditionSymptom
    extra = 1

@admin.register(Symptom)
class SymptomAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'body_system', 'is_emergency_flag', 'last_verified', 'review_status')
    list_filter = ('body_system', 'is_emergency_flag', 'review_status')
    search_fields = ('name', 'common_names', 'code')

@admin.register(Condition)
class ConditionAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'category', 'source_version', 'last_verified', 'review_status')
    list_filter = ('category', 'review_status')
    search_fields = ('name', 'scientific_name', 'overview')
    inlines = [ConditionSymptomInline]

@admin.register(WarningSign)
class WarningSignAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'severity_level', 'last_verified')
    list_filter = ('severity_level',)
    search_fields = ('name', 'description')

@admin.register(Medicine)
class MedicineAdmin(admin.ModelAdmin):
    list_display = ('code', 'generic_name', 'medicine_class', 'dosage_form', 'last_verified')
    list_filter = ('medicine_class', 'dosage_form')
    search_fields = ('generic_name', 'brand_names', 'general_uses')

@admin.register(HealthcareFacility)
class HealthcareFacilityAdmin(admin.ModelAdmin):
    list_display = ('name', 'facility_type', 'city', 'phone', 'is_24x7', 'has_icu', 'has_ambulance')
    list_filter = ('facility_type', 'is_24x7', 'has_icu')
    search_fields = ('name', 'address', 'services')

@admin.register(EmergencyRule)
class EmergencyRuleAdmin(admin.ModelAdmin):
    list_display = ('rule_id', 'title', 'risk_level', 'is_active', 'rule_version')
    list_filter = ('risk_level', 'is_active')
    search_fields = ('rule_id', 'title', 'description')

@admin.register(Assessment)
class AssessmentAdmin(admin.ModelAdmin):
    list_display = ('session_id', 'risk_level', 'duration_str', 'severity_level', 'created_at')
    list_filter = ('risk_level', 'created_at')
    search_fields = ('session_id', 'raw_input_text')
    readonly_fields = ('created_at',)

@admin.register(AIModelRegistry)
class AIModelRegistryAdmin(admin.ModelAdmin):
    list_display = ('model_name', 'model_version', 'task', 'is_active', 'is_offline_ready', 'last_updated')
    list_filter = ('task', 'is_active')

@admin.register(SyncVersion)
class SyncVersionAdmin(admin.ModelAdmin):
    list_display = ('package_version', 'previous_version', 'release_date', 'checksum_sha256', 'is_mandatory')

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('timestamp', 'action', 'entity_type', 'entity_id', 'performed_by')
    list_filter = ('action', 'entity_type')
    search_fields = ('details', 'performed_by')
    readonly_fields = ('timestamp',)

admin.site.register(MedicalSource)
admin.site.register(MedicineClass)
admin.site.register(MedicineInteraction)
admin.site.register(RiskFactor)
admin.site.register(MedicalTopic)
admin.site.register(ImageAnalysisLog)
