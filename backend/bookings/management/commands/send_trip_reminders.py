from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from bookings.models import Booking
from accounts.utils import send_trip_reminder_email

class Command(BaseCommand):
    help = 'Send trip reminder emails for bookings starting within the next hour'
    
    def handle(self, *args, **options):
        now = timezone.now()
        one_hour_later = now + timedelta(hours=1)
        
        # Find bookings starting within the next hour
        upcoming_bookings = Booking.objects.filter(
            status='approved',
            start_datetime__gte=now,
            start_datetime__lte=one_hour_later,
            reminder_sent=False  # You'll need to add this field
        )
        
        count = 0
        for booking in upcoming_bookings:
            send_trip_reminder_email(booking)
            # booking.reminder_sent = True  # Add this field to model
            # booking.save()
            count += 1
            self.stdout.write(f"Sent reminder for booking #{booking.id}")
        
        self.stdout.write(self.style.SUCCESS(f"Sent {count} trip reminders"))