from django.contrib import admin
from .models import Car

@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ('registration_number', 'brand', 'model', 'year', 'fuel_type', 'status', 'current_odometer', 'location')
    list_filter = ('status', 'fuel_type', 'transmission', 'year')
    search_fields = ('registration_number', 'brand', 'model', 'vin_number')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('registration_number', 'brand', 'model', 'year', 'color', 'vin_number')
        }),
        ('Technical Specifications', {
            'fields': ('fuel_type', 'transmission', 'seats')
        }),
        ('Status & Tracking', {
            'fields': ('status', 'current_odometer', 'current_fuel_level', 'location')
        }),
        ('Maintenance', {
            'fields': ('last_maintenance_date', 'next_maintenance_km', 'insurance_expiry')
        }),
        ('Additional', {
            'fields': ('department_assigned', 'daily_rate', 'image', 'notes')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )