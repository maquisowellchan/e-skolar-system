
from django.contrib import admin
from django.urls import path
from eskolar.views import register, verify_email

urlpatterns = [
    path('api/register/', register, name='register'),
    path('api/verify-email/<str:token>/', verify_email, name='verify_email'),
]
