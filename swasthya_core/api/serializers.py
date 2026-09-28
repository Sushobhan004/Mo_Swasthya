from rest_framework import serializers
from swasthya_core.models import (
    MedicalSource, WarningSign, Symptom, RiskFactor, Condition, ConditionSymptom,
    MedicalTopic, MedicineClass, Medicine, MedicineInteraction, HealthcareFacility,
    EmergencyRule, Assessment, ImageAnalysisLog, AIModelRegistry, SyncVersion, SyncPackage
)

class MedicalSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalSource
        fields = '__all__'

class WarningSignSerializer(serializers.ModelSerializer):
    class Meta:
        model = WarningSign
        fields = '__all__'

class SymptomSerializer(serializers.ModelSerializer):
    synonyms_list = serializers.SerializerMethodField()

    class Meta:
        model = Symptom
        fields = ['id', 'code', 'name', 'common_names', 'synonyms_list', 'body_system', 'description', 'is_emergency_flag', 'last_verified', 'review_status']

    def get_synonyms_list(self, obj):
        return obj.get_synonyms_list()

class ConditionSymptomSerializer(serializers.ModelSerializer):
    symptom_name = serializers.ReadOnlyField(source='symptom.name')
    symptom_code = serializers.ReadOnlyField(source='symptom.code')

    class Meta:
        model = ConditionSymptom
        fields = ['symptom_code', 'symptom_name', 'weight', 'is_pathognomonic', 'frequency']

class ConditionSerializer(serializers.ModelSerializer):
    symptoms = ConditionSymptomSerializer(source='conditionsymptom_set', many=True, read_only=True)
    warning_signs = WarningSignSerializer(many=True, read_only=True)
    source_name = serializers.ReadOnlyField(source='source.name')

    class Meta:
        model = Condition
        fields = [
            'id', 'code', 'name', 'scientific_name', 'category', 'overview',
            'recommended_evaluations', 'non_pharmacological_care', 'source_name',
            'source_version', 'last_verified', 'review_status', 'symptoms', 'warning_signs'
        ]

class MedicineSerializer(serializers.ModelSerializer):
    class_name = serializers.ReadOnlyField(source='medicine_class.name')
    brand_list = serializers.SerializerMethodField()

    class Meta:
        model = Medicine
        fields = [
            'id', 'code', 'generic_name', 'brand_names', 'brand_list', 'class_name',
            'dosage_form', 'general_uses', 'warnings', 'contraindications',
            'common_side_effects', 'storage_information', 'pregnancy_category', 'last_verified'
        ]

    def get_brand_list(self, obj):
        return obj.get_brand_list()

class MedicineInteractionSerializer(serializers.ModelSerializer):
    med_a_name = serializers.ReadOnlyField(source='medicine_a.generic_name')
    med_b_name = serializers.ReadOnlyField(source='medicine_b.generic_name')

    class Meta:
        model = MedicineInteraction
        fields = ['id', 'med_a_name', 'med_b_name', 'severity', 'description', 'clinical_recommendation']

class HealthcareFacilitySerializer(serializers.ModelSerializer):
    facility_type_display = serializers.CharField(source='get_facility_type_display', read_only=True)
    distance_km = serializers.SerializerMethodField()

    class Meta:
        model = HealthcareFacility
        fields = [
            'id', 'code', 'name', 'facility_type', 'facility_type_display',
            'latitude', 'longitude', 'address', 'city', 'phone', 'emergency_phone',
            'services', 'is_24x7', 'has_ambulance', 'has_icu', 'last_verified', 'distance_km'
        ]

    def get_distance_km(self, obj):
        user_lat = self.context.get('user_lat')
        user_lon = self.context.get('user_lon')
        if user_lat is not None and user_lon is not None:
            try:
                return obj.calculate_distance(float(user_lat), float(user_lon))
            except Exception:
                return None
        return None

class EmergencyRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyRule
        fields = '__all__'

class AssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assessment
        fields = '__all__'

class AIModelRegistrySerializer(serializers.ModelSerializer):
    class Meta:
        model = AIModelRegistry
        fields = '__all__'

class SyncVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SyncVersion
        fields = '__all__'
