from django.contrib import admin
from django.contrib.admin.models import LogEntry
from .models import UserRole

# Register your UserAccountAdmin for the UserAccount model
class UserAccountAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'is_active')
    search_fields = ('email', 'first_name', 'last_name')

    def get_queryset(self, request):
        return UserRole.objects.filter(is_active=True)

admin.site.register(UserRole, UserAccountAdmin)

# Register a separate admin for LogEntry
class LogEntryAdmin(admin.ModelAdmin):
    list_display = ('action_time', 'user', 'content_type', 'object_id', 'object_repr', 'action_flag', 'change_message')
    search_fields = ('user__email', 'object_repr', 'change_message')

admin.site.register(LogEntry, LogEntryAdmin)
