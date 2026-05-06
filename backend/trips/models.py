from django.db import models
from django.conf import settings
from bookings.models import Booking  # Import the correct model name

class TripLog(models.Model):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='trip_log')
    
    # Check-out Data
    checked_out_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='checked_out_trips')
    check_out_time = models.DateTimeField(auto_now_add=True)
    start_odometer = models.IntegerField()
    start_fuel_level = models.IntegerField()
    start_photos = models.JSONField(default=list)
    start_notes = models.TextField(blank=True)
    
    # Check-in Data
    checked_in_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='checked_in_trips')
    check_in_time = models.DateTimeField(null=True, blank=True)
    end_odometer = models.IntegerField(null=True, blank=True)
    end_fuel_level = models.IntegerField(null=True, blank=True)
    end_photos = models.JSONField(default=list)
    end_notes = models.TextField(blank=True)
    
    # Issues & Damages
    issues_reported = models.TextField(blank=True)
    damages = models.TextField(blank=True)
    damage_photos = models.JSONField(default=list)
    
    # Cost Tracking
    fuel_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_km_driven = models.IntegerField(null=True, blank=True)
    
    # Compliance
    is_late_return = models.BooleanField(default=False)
    late_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    class Meta:
        db_table = 'trip_logs'
    
    def __str__(self):
        return f"Trip Log for Booking #{self.booking.id}"