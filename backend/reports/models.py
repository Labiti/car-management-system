from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator

class Report(models.Model):
    REPORT_TYPES = (
        ('usage_summary', 'Usage Summary'),
        ('cost_analysis', 'Cost Analysis'),
        ('maintenance_report', 'Maintenance Report'),
        ('violation_report', 'Violation Report'),
        ('fuel_efficiency', 'Fuel Efficiency'),
        ('department_usage', 'Department Usage'),
    )
    
    FORMAT_CHOICES = (
        ('pdf', 'PDF'),
        ('excel', 'Excel'),
        ('csv', 'CSV'),
    )
    
    report_type = models.CharField(max_length=50, choices=REPORT_TYPES)
    generated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    date_range_start = models.DateField()
    date_range_end = models.DateField()
    format = models.CharField(max_length=20, choices=FORMAT_CHOICES, default='pdf')
    filters = models.JSONField(default=dict)  # Store filter parameters
    file = models.FileField(upload_to='reports/', null=True, blank=True)
    status = models.CharField(max_length=20, default='processing')  # processing, completed, failed
    error_message = models.TextField(blank=True)
    generated_at = models.DateTimeField(auto_now_add=True)
    downloaded_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'reports'
        ordering = ['-generated_at']
    
    def __str__(self):
        return f"{self.report_type} Report - {self.generated_at.date()}"

class UsageStatistics(models.Model):
    PERIOD_CHOICES = (
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
        ('yearly', 'Yearly'),
    )
    
    period = models.CharField(max_length=20, choices=PERIOD_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField()
    car = models.ForeignKey('cars.Car', on_delete=models.CASCADE, null=True, blank=True)
    department = models.CharField(max_length=100, blank=True)
    
    # Statistics
    total_trips = models.IntegerField(default=0)
    total_km_driven = models.IntegerField(default=0)
    total_hours = models.FloatField(default=0)
    total_fuel_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_fuel_liters = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    average_fuel_efficiency = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    
    # Maintenance
    total_maintenance_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    maintenance_count = models.IntegerField(default=0)
    
    # Violations
    total_violations = models.IntegerField(default=0)
    total_fines = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    # Utilization
    utilization_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'usage_statistics'
        unique_together = ['period', 'start_date', 'car', 'department']
        indexes = [
            models.Index(fields=['period', 'start_date']),
            models.Index(fields=['car', 'start_date']),
        ]
    
    def __str__(self):
        return f"Statistics {self.period} - {self.start_date} to {self.end_date}"