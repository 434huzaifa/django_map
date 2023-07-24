from django.urls import path
from .views import save_location,get_location,overview

urlpatterns = [
    path('',overview,name='overview'),
    path('save-location/',save_location,name='save location'),
    path('get-location/',get_location,name='get locations')
]
