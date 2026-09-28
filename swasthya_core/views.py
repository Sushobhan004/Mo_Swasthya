"""
Views for SwasthyaAI Web Interface
"""
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.conf import settings
from swasthya_core.models import (
    Symptom, Condition, Medicine, HealthcareFacility, WarningSign,
    EmergencyRule, AIModelRegistry, SyncVersion, AuditLog, Assessment
)

def index_view(request):
    """Main interactive single-page offline healthcare platform."""
    context = {
        "system_version": getattr(settings, 'SWASTHYA_CONFIG', {}).get('SYSTEM_VERSION', '2.4.0'),
        "knowledge_version": getattr(settings, 'SWASTHYA_CONFIG', {}).get('KNOWLEDGE_BASE_VERSION', 18),
        "last_verified_date": getattr(settings, 'SWASTHYA_CONFIG', {}).get('LAST_VERIFIED_DATE', '2026-09-18'),
        "symptoms_count": Symptom.objects.count(),
        "conditions_count": Condition.objects.count(),
        "medicines_count": Medicine.objects.count(),
        "facilities_count": HealthcareFacility.objects.count(),
    }
    return render(request, 'index.html', context)

def diagnostics_view(request):
    """Dedicated 10-point 'No-Internet System Check' verification screen."""
    return render(request, 'diagnostics.html')

def admin_dashboard_view(request):
    """Medical Content and AI Model Management Dashboard."""
    context = {
        "symptoms": Symptom.objects.all(),
        "conditions": Condition.objects.all(),
        "warning_signs": WarningSign.objects.all(),
        "medicines": Medicine.objects.all(),
        "facilities": HealthcareFacility.objects.all(),
        "emergency_rules": EmergencyRule.objects.all(),
        "ai_models": AIModelRegistry.objects.all(),
        "sync_versions": SyncVersion.objects.all(),
        "audit_logs": AuditLog.objects.all()[:25],
        "assessments_recent": Assessment.objects.all()[:15],
    }
    return render(request, 'admin_dashboard.html', context)

def service_worker_view(request):
    """Serves the service worker with proper Service-Worker-Allowed and Cache-Control headers."""
    with open(settings.BASE_DIR / 'static' / 'js' / 'sw.js', 'r', encoding='utf-8') as f:
        content = f.read()
    response = HttpResponse(content, content_type='application/javascript')
    response['Service-Worker-Allowed'] = '/'
    response['Cache-Control'] = 'no-cache, no-store, must-revalidate, max-age=0'
    response['Pragma'] = 'no-cache'
    response['Expires'] = '0'
    return response

def manifest_json_view(request):
    """PWA manifest for offline installation on Android / Desktop."""
    manifest = {
        "name": "SwasthyaAI - Offline Healthcare Decision Support",
        "short_name": "SwasthyaAI",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#090d16",
        "theme_color": "#0ea5e9",
        "description": "Production offline AI medical decision-support and emergency assistance system.",
        "icons": [
            {
                "src": "/static/assets/icon-192.png",
                "sizes": "192x192",
                "type": "image/png"
            },
            {
                "src": "/static/assets/icon-512.png",
                "sizes": "512x512",
                "type": "image/png"
            }
        ]
    }
    return JsonResponse(manifest)

def video_stream_view(request, filename):
    """
    High-performance video streaming endpoint with HTTP Range / Partial Content support.
    Serves /male.mp4 and /female.mp4 for smooth scrubbing and 360-degree rotation.
    """
    if filename not in ['male.mp4', 'female.mp4']:
        return HttpResponse("Asset not found", status=404)
    
    file_path = settings.BASE_DIR / filename
    if not file_path.exists():
        # Fallback to static if placed in static directory
        file_path = settings.BASE_DIR / 'static' / filename
        if not file_path.exists():
            return HttpResponse("Video asset not found on server", status=404)
            
    from django.http import FileResponse
    response = FileResponse(open(file_path, 'rb'), content_type='video/mp4')
    response['Accept-Ranges'] = 'bytes'
    response['Cache-Control'] = 'public, max-age=31536000, immutable'
    return response
