"""
Core URL configuration for SwasthyaAI
"""
from django.urls import path
from .views import (
    index_view, diagnostics_view, admin_dashboard_view,
    service_worker_view, manifest_json_view, video_stream_view
)

urlpatterns = [
    path('', index_view, name='home'),
    path('diagnostics/', diagnostics_view, name='diagnostics'),
    path('dashboard/', admin_dashboard_view, name='admin-dashboard'),
    path('sw.js', service_worker_view, name='service-worker'),
    path('manifest.json', manifest_json_view, name='pwa-manifest'),
    path('male.mp4', video_stream_view, {'filename': 'male.mp4'}, name='male-video'),
    path('female.mp4', video_stream_view, {'filename': 'female.mp4'}, name='female-video'),
    path('static/<str:filename>', video_stream_view, name='static-video-stream'),
]
