from django.db import models
from django.conf import settings
from cars.models import Car

class Booking(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
        ('in_progress', 'In Progress'),
    )
    
    TRIP_TYPES = (
        ('business', 'Business'),
        ('private', 'Private'),
    )
    
    # Relationships
    employee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='bookings')
    approved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_bookings')
    
    # Trip Details
    purpose = models.TextField()
    destination = models.CharField(max_length=500)
    estimated_km = models.IntegerField(default=0)
    trip_type = models.CharField(max_length=20, choices=TRIP_TYPES, default='business')
    passengers = models.IntegerField(default=1)
    
    # Date & Time
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    actual_start_datetime = models.DateTimeField(null=True, blank=True)
    actual_end_datetime = models.DateTimeField(null=True, blank=True)
    
    # Status & Comments
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    manager_comments = models.TextField(blank=True)
    employee_notes = models.TextField(blank=True)
    reminder_sent = models.BooleanField(default=False)
    
    # Timestamps
    requested_at = models.DateTimeField(auto_now_add=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    rejected_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'bookings'
        ordering = ['-requested_at']
    
    def __str__(self):
        return f"Booking #{self.id} - {self.employee.username} - {self.car.registration_number}"
    
    @property
    def is_pending(self):
        return self.status == 'pending'
    
    @property
    def is_approved(self):
        return self.status == 'approved'