"""
API URL patterns for SwasthyaAI
"""
from django.urls import path
from .views import (
    SymptomSearchView, AssessmentView, MedicalSearchUnifiedView,
    ConditionListView, ConditionDetailView, MedicineListView, MedicineInteractionCheckView,
    FacilityListView, RoutingPlanView, ImageAnalysisView,
    SyncManifestView, SyncPackageView, SyncApplyView,
    SystemDiagnosticView, AIModelsListView
)

urlpatterns = [
    # Symptoms & Assessment
    path('symptoms/search/', SymptomSearchView.as_view(), name='api-symptom-search'),
    path('assessment/', AssessmentView.as_view(), name='api-assessment'),

    # Medical Knowledge & BM25 Search
    path('search/', MedicalSearchUnifiedView.as_view(), name='api-search-unified'),
    path('conditions/', ConditionListView.as_view(), name='api-conditions-list'),
    path('conditions/<int:pk>/', ConditionDetailView.as_view(), name='api-condition-detail'),

    # Medicines & Interactions
    path('medicines/', MedicineListView.as_view(), name='api-medicines-list'),
    path('medicines/interactions/', MedicineInteractionCheckView.as_view(), name='api-medicine-interactions'),

    # Facilities & Routing
    path('facilities/', FacilityListView.as_view(), name='api-facilities-list'),
    path('facilities/nearby/', FacilityListView.as_view(), name='api-facilities-nearby'),
    path('routing/plan/', RoutingPlanView.as_view(), name='api-routing-plan'),

    # Medical Image Analysis
    path('image-analysis/', ImageAnalysisView.as_view(), name='api-image-analysis'),

    # Synchronization & Versions
    path('sync/manifest/', SyncManifestView.as_view(), name='api-sync-manifest'),
    path('sync/package/<int:version>/', SyncPackageView.as_view(), name='api-sync-package'),
    path('sync/apply/', SyncApplyView.as_view(), name='api-sync-apply'),

    # AI Models & Diagnostics
    path('models/', AIModelsListView.as_view(), name='api-models-list'),
    path('system/diagnostic/', SystemDiagnosticView.as_view(), name='api-system-diagnostic'),
]
