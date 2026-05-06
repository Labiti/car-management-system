from django.db import models
from django.conf import settings
from cars.models import Car
from django.utils import timezone

class MaintenanceRecord(models.Model):
    MAINTENANCE_TYPES = (
        ('oil_change', 'Oil Change'),
        ('tire_rotation', 'Tire Rotation'),
        ('brake_service', 'Brake Service'),
        ('general_service', 'General Service'),
        ('repair', 'Repair'),
        ('inspection', 'Inspection'),
        ('battery_replacement', 'Battery Replacement'),
        ('air_filter', 'Air Filter Change'),
        ('coolant_flush', 'Coolant Flush'),
        ('transmission_service', 'Transmission Service'),
    )
    
    PRIORITY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    )
    
    STATUS_CHOICES = (
        ('scheduled', 'Scheduled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('overdue', 'Overdue'),
    )
    
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='maintenance_records')
    maintenance_type = models.CharField(max_length=50, choices=MAINTENANCE_TYPES)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    
    scheduled_date = models.DateField()
    completed_date = models.DateField(null=True, blank=True)
    odometer_at_service = models.IntegerField()
    
    estimated_cost = models.DecimalField(max_digits=10, decimal_places=2)
    actual_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    description = models.TextField()
    service_provider = models.CharField(max_length=200)
    invoice_number = models.CharField(max_length=100, blank=True)
    technician_notes = models.TextField(blank=True)
    
    next_service_km = models.IntegerField(null=True, blank=True)
    next_service_date = models.DateField(null=True, blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='created_maintenance')
    approved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='approved_maintenance')
    
    attachments = models.JSONField(default=list)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'maintenance_records'
        ordering = ['scheduled_date']
    
    def __str__(self):
        return f"{self.car.registration_number} - {self.maintenance_type} - {self.scheduled_date}"
    
    @property
    def is_overdue(self):
        return self.status != 'completed' and self.scheduled_date < timezone.now().date()


class ServiceReminder(models.Model):
    REMINDER_TYPES = (
        ('oil_change', 'Oil Change'),
        ('tire_rotation', 'Tire Rotation'),
        ('insurance', 'Insurance Renewal'),
        ('registration', 'Registration Renewal'),
        ('inspection', 'Inspection'),
    )
    
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='reminders')
    reminder_type = models.CharField(max_length=50, choices=REMINDER_TYPES)
    due_date = models.DateField()
    due_km = models.IntegerField(null=True, blank=True)
    is_recurring = models.BooleanField(default=False)
    recurrence_interval_km = models.IntegerField(null=True, blank=True)
    recurrence_interval_days = models.IntegerField(null=True, blank=True)
    last_completed_date = models.DateField(null=True, blank=True)
    last_completed_km = models.IntegerField(null=True, blank=True)
    is_triggered = models.BooleanField(default=False)
    triggered_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'service_reminders'
    
    def __str__(self):
        return f"{self.car.registration_number} - {self.reminder_type} - Due: {self.due_date}"


class InsuranceRecord(models.Model):
    INSURANCE_TYPES = (
        ('comprehensive', 'Comprehensive'),
        ('third_party', 'Third Party'),
        ('liability', 'Liability'),
    )
    
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='insurance_records')
    insurance_type = models.CharField(max_length=50, choices=INSURANCE_TYPES)
    policy_number = models.CharField(max_length=100)
    provider = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField()
    premium_amount = models.DecimalField(max_digits=10, decimal_places=2)
    coverage_details = models.TextField(blank=True)
    document = models.FileField(upload_to='insurance/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'insurance_records'
        ordering = ['-start_date']
    
    def __str__(self):
        return f"{self.car.registration_number} - {self.insurance_type} - {self.policy_number}"
    
    @property
    def is_expired(self):
        return self.end_date < timezone.now().date()