from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Car(models.Model):
    FUEL_TYPES = (
        ('petrol', 'Petrol'),
        ('diesel', 'Diesel'),
        ('electric', 'Electric'),
        ('hybrid', 'Hybrid'),
    )
    
    TRANSMISSION_TYPES = (
        ('manual', 'Manual'),
        ('automatic', 'Automatic'),
    )
    
    STATUS_CHOICES = (
        ('available', 'Available'),
        ('in_use', 'In Use'),
        ('maintenance', 'Under Maintenance'),
        ('reserved', 'Reserved'),
        ('out_of_service', 'Out of Service'),
    )
    
    # Basic Information
    registration_number = models.CharField(max_length=20, unique=True)
    brand = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    year = models.IntegerField(validators=[MinValueValidator(1900), MaxValueValidator(2026)])
    color = models.CharField(max_length=30)
    vin_number = models.CharField(max_length=17, unique=True, blank=True, null=True)
    
    # Technical Specifications
    fuel_type = models.CharField(max_length=20, choices=FUEL_TYPES, default='petrol')
    transmission = models.CharField(max_length=20, choices=TRANSMISSION_TYPES, default='manual')
    seats = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(15)], default=5)
    
    # Status & Tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    current_odometer = models.IntegerField(default=0)
    current_fuel_level = models.IntegerField(default=100, validators=[MinValueValidator(0), MaxValueValidator(100)])
    location = models.CharField(max_length=200, default='Main Parking')
    
    # Assignment
    department_assigned = models.CharField(max_length=100, blank=True, null=True)
    
    # Maintenance
    last_maintenance_date = models.DateField(blank=True, null=True)
    next_maintenance_km = models.IntegerField(blank=True, null=True)
    insurance_expiry = models.DateField(blank=True, null=True)
    
    # Media
    image = models.ImageField(upload_to='cars/', blank=True, null=True)
    
    # Additional Info
    daily_rate = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    notes = models.TextField(blank=True, null=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'cars'
        ordering = ['brand', 'model']
    
    def __str__(self):
        return f"{self.brand} {self.model} - {self.registration_number}"
    
    @property
    def is_available(self):
        return self.status == 'available'
    
    @property
    def full_name(self):
        return f"{self.brand} {self.model} ({self.registration_number})"