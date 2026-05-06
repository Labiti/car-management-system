from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, AuditLog

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'employee_id', 'role', 'department', 'is_active')
    list_filter = ('role', 'department', 'is_active', 'is_staff')
    search_fields = ('username', 'email', 'employee_id', 'phone_number')
    
    fieldsets = UserAdmin.fieldsets + (
        ('Company Information', {
            'fields': ('role', 'department', 'employee_id', 'phone_number', 'driver_license', 'is_approved')
        }),
        ('Emergency Contact', {
            'fields': ('emergency_contact', 'emergency_phone', 'address')
        }),
    )
    
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Company Information', {
            'fields': ('role', 'department', 'employee_id', 'phone_number', 'driver_license')
        }),
    )

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'action', 'model_name', 'object_repr', 'timestamp')
    list_filter = ('action', 'model_name', 'timestamp')
    search_fields = ('user__username', 'object_repr', 'model_name')
    readonly_fields = ('user', 'action', 'model_name', 'object_id', 'object_repr', 'changes', 'ip_address', 'user_agent', 'timestamp')
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False

# Register User model
admin.site.register(User, CustomUserAdmin)