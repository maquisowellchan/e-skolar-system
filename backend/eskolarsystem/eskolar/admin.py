from django.contrib import admin
from .models import UserRole
# Register your models here.

admin.site.register(UserRole)

verified_users = UserRole.objects.filter(is_active=True)

