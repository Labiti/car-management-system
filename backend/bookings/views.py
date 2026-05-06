from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import datetime

from .models import Booking
from .serializers import BookingSerializer
from cars.models import Car
from accounts.utils import (
    send_booking_confirmation_email, 
    send_booking_approved_email, 
    send_booking_rejected_email,
    send_trip_reminder_email
)

class BookingViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        # Managers and admins see all bookings, employees see only theirs
        if user.role in ['manager', 'fleet_admin', 'super_admin']:
            return Booking.objects.all()
        return Booking.objects.filter(employee=user)
    
    def get_serializer_class(self):
        return BookingSerializer
    
    def perform_create(self, serializer):
        booking = serializer.save(employee=self.request.user)
        # Send confirmation email
        send_booking_confirmation_email(booking)
    
    @action(detail=False, methods=['get'])
    def my_bookings(self, request):
        """Get current user's bookings"""
        bookings = Booking.objects.filter(employee=request.user)
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Get all pending bookings (Managers only)"""
        if request.user.role not in ['manager', 'fleet_admin', 'super_admin']:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        pending_bookings = Booking.objects.filter(status='pending')
        serializer = BookingSerializer(pending_bookings, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def pending_count(self, request):
        """Get count of pending bookings for manager badge"""
        if request.user.role not in ['manager', 'fleet_admin', 'super_admin']:
            return Response({'count': 0})
        
        count = Booking.objects.filter(status='pending').count()
        return Response({'count': count})
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve a booking (Managers only) - Changes car status to RESERVED"""
        if request.user.role not in ['manager', 'fleet_admin', 'super_admin']:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        booking = self.get_object()
        booking.status = 'approved'
        booking.approved_by = request.user
        booking.approved_at = timezone.now()
        booking.manager_comments = request.data.get('comments', '')
        booking.save()
        
        # Update car status to RESERVED
        car = booking.car
        if car.status == 'available':
            car.status = 'reserved'
            car.save()
        
        # Send approval email  
        send_booking_approved_email(booking)
        
        return Response({
            'message': 'Booking approved successfully',
            'status': booking.status,
            'car_status': car.status,
            'approved_by': booking.approved_by.username,
            'comments': booking.manager_comments
        })
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject a booking (Managers only)"""
        if request.user.role not in ['manager', 'fleet_admin', 'super_admin']:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        booking = self.get_object()
        booking.status = 'rejected'
        booking.rejected_at = timezone.now()
        booking.manager_comments = request.data.get('comments', '')
        booking.save()

        # Send rejection email
        send_booking_rejected_email(booking)
        
        return Response({
            'message': 'Booking rejected',
            'status': booking.status,
            'comments': booking.manager_comments
        })
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a booking"""
        booking = self.get_object()
        
        # Check permission
        if booking.employee != request.user and request.user.role not in ['manager', 'fleet_admin', 'super_admin']:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        # Check if cancellation is within allowed time (4 hours before start)
        hours_until_start = (booking.start_datetime - timezone.now()).total_seconds() / 3600
        
        if hours_until_start < 4 and booking.employee == request.user:
            return Response({'error': 'Cannot cancel less than 4 hours before start time'}, status=status.HTTP_400_BAD_REQUEST)
        
        booking.status = 'cancelled'
        booking.cancelled_at = timezone.now()
        booking.save()
        
        # If car was reserved, make it available again
        if booking.car.status == 'reserved':
            car = booking.car
            car.status = 'available'
            car.save()
        
        return Response({'message': 'Booking cancelled successfully'})
    
    @action(detail=True, methods=['post'])
    def checkout(self, request, pk=None):
        """Check-out a car (start trip)"""
        booking = self.get_object()
        
        # Check if trip log already exists
        from trips.models import TripLog
        if hasattr(booking, 'trip_log'):
            return Response({'error': 'Trip already started'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if booking is approved
        if booking.status != 'approved':
            return Response({'error': 'Booking must be approved first'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if current time is within booking window
        now = timezone.now()
        if now < booking.start_datetime:
            return Response({'error': f'Trip cannot start before {booking.start_datetime}'}, status=status.HTTP_400_BAD_REQUEST)
        
        start_odometer = request.data.get('start_odometer')
        start_fuel_level = request.data.get('start_fuel_level')
        
        if not start_odometer or not start_fuel_level:
            return Response({'error': 'Start odometer and fuel level are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Convert to appropriate types
        try:
            start_odometer = int(start_odometer)
            start_fuel_level = int(start_fuel_level)
        except (ValueError, TypeError):
            return Response({'error': 'Odometer and fuel level must be valid numbers'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create trip log
        trip_log = TripLog.objects.create(
            booking=booking,
            checked_out_by=request.user,
            start_odometer=start_odometer,
            start_fuel_level=start_fuel_level,
            start_photos=request.data.get('start_photos', []),
            start_notes=request.data.get('start_notes', '')
        )
        
        # Update car status
        car = booking.car
        car.status = 'in_use'
        car.save()
        
        # Update booking status
        booking.status = 'in_progress'
        booking.actual_start_datetime = now
        booking.save()
        
        return Response({
            'message': 'Trip started successfully!',
            'trip_id': trip_log.id,
            'booking_status': booking.status,
            'car_status': car.status
        })
    
    @action(detail=True, methods=['post'])
    def checkin(self, request, pk=None):
        """Check-in a car (end trip)"""
        booking = self.get_object()
        
        from trips.models import TripLog
        try:
            trip_log = booking.trip_log
        except TripLog.DoesNotExist:
            return Response({'error': 'Trip not started yet. Please check out first.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if trip is already ended
        if trip_log.check_in_time:
            return Response({'error': 'Trip already ended'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if trip is in progress
        if booking.status != 'in_progress':
            return Response({'error': 'Trip is not in progress'}, status=status.HTTP_400_BAD_REQUEST)
        
        end_odometer = request.data.get('end_odometer')
        end_fuel_level = request.data.get('end_fuel_level')
        
        if not end_odometer or not end_fuel_level:
            return Response({'error': 'End odometer and fuel level are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Convert to appropriate types
        try:
            end_odometer = int(end_odometer)
            end_fuel_level = int(end_fuel_level)
        except (ValueError, TypeError):
            return Response({'error': 'Odometer and fuel level must be valid numbers'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update trip log
        trip_log.checked_in_by = request.user
        trip_log.check_in_time = timezone.now()
        trip_log.end_odometer = end_odometer
        trip_log.end_fuel_level = end_fuel_level
        trip_log.end_photos = request.data.get('end_photos', [])
        trip_log.end_notes = request.data.get('end_notes', '')
        
        # Calculate kilometers driven
        trip_log.total_km_driven = trip_log.end_odometer - trip_log.start_odometer
        
        # Check for damages
        if request.data.get('damages'):
            trip_log.damages = request.data['damages']
            trip_log.damage_reported_by = request.user
        
        # Calculate late return
        if trip_log.check_in_time > booking.end_datetime:
            trip_log.is_late_return = True
            trip_log.late_minutes = int((trip_log.check_in_time - booking.end_datetime).total_seconds() / 60)
            trip_log.late_fee = round((trip_log.late_minutes / 60) * 25, 2)
        
        trip_log.save()
        
        # Update car status and odometer
        car = booking.car
        car.status = 'available'
        car.current_odometer = trip_log.end_odometer
        car.current_fuel_level = trip_log.end_fuel_level
        car.save()
        
        # Update booking status
        booking.status = 'completed'
        booking.actual_end_datetime = trip_log.check_in_time
        booking.completed_at = trip_log.check_in_time
        booking.save()
        
        return Response({
            'message': 'Trip ended successfully!',
            'total_km': trip_log.total_km_driven,
            'late_return': trip_log.is_late_return,
            'late_fee': trip_log.late_fee,
            'car_status': car.status,
            'fuel_used': trip_log.start_fuel_level - trip_log.end_fuel_level,
            'odometer_diff': trip_log.total_km_driven
        })
    
    @action(detail=False, methods=['get'])
    def calendar(self, request):
        """Get calendar events for date range"""
        start_date = request.query_params.get('start')
        end_date = request.query_params.get('end')
        
        if not start_date or not end_date:
            return Response({'error': 'Start and end dates required'}, status=400)
        
        # Parse dates - handle different formats
        try:
            # Try to parse ISO format dates
            start_dt = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
            end_dt = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
        except:
            try:
                # Try simple date format
                start_dt = datetime.strptime(start_date, '%Y-%m-%d')
                end_dt = datetime.strptime(end_date, '%Y-%m-%d')
            except:
                return Response({'error': 'Invalid date format'}, status=400)
        
        # Make dates timezone aware
        from django.utils import timezone
        if timezone.is_naive(start_dt):
            start_dt = timezone.make_aware(start_dt)
        if timezone.is_naive(end_dt):
            end_dt = timezone.make_aware(end_dt)
        
        # Get all approved, in-progress, and pending bookings within date range
        bookings = Booking.objects.filter(
            status__in=['approved', 'in_progress', 'pending'],
            start_datetime__lte=end_dt,
            end_datetime__gte=start_dt
        ).select_related('car', 'employee')
        
        calendar_events = []
        for booking in bookings:
            # Get employee name
            employee_name = booking.employee.get_full_name() or booking.employee.username
            
            calendar_events.append({
                'id': booking.id,
                'title': f"{booking.car.brand} {booking.car.model} - {employee_name}",
                'start': booking.start_datetime.isoformat(),
                'end': booking.end_datetime.isoformat(),
                'car_id': booking.car.id,
                'car_name': f"{booking.car.brand} {booking.car.model}",
                'car_registration': booking.car.registration_number,
                'employee_name': employee_name,
                'destination': booking.destination,
                'purpose': booking.purpose,
                'status': booking.status,
                'backgroundColor': '#28a745' if booking.status == 'approved' else '#ffc107',
                'borderColor': '#28a745' if booking.status == 'approved' else '#ffc107',
                'textColor': '#ffffff',
            })
        
        return Response(calendar_events)
    
    @action(detail=False, methods=['get'])
    def available_cars_by_date(self, request):
        """Get available cars for a specific date range"""
        start_date = request.query_params.get('start')
        end_date = request.query_params.get('end')
        
        if not start_date or not end_date:
            return Response({'error': 'Start and end dates required'}, status=400)
        
        # Parse dates
        try:
            start_dt = datetime.strptime(start_date, '%Y-%m-%d')
            end_dt = datetime.strptime(end_date, '%Y-%m-%d')
        except:
            try:
                start_dt = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
                end_dt = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
            except:
                return Response({'error': 'Invalid date format'}, status=400)
        
        # Make dates timezone aware
        from django.utils import timezone
        if timezone.is_naive(start_dt):
            start_dt = timezone.make_aware(start_dt)
        if timezone.is_naive(end_dt):
            end_dt = timezone.make_aware(end_dt)
        
        # Get all cars
        all_cars = Car.objects.all()
        
        # Get booked car IDs for the date range
        booked_car_ids = Booking.objects.filter(
            status__in=['approved', 'in_progress'],
            start_datetime__lt=end_dt,
            end_datetime__gt=start_dt
        ).values_list('car_id', flat=True).distinct()
        
        # Get available cars
        available_cars = all_cars.exclude(id__in=booked_car_ids)
        
        # Serialize available cars
        available_cars_data = []
        for car in available_cars:
            available_cars_data.append({
                'id': car.id,
                'brand': car.brand,
                'model': car.model,
                'registration_number': car.registration_number,
                'year': car.year,
                'color': car.color,
                'fuel_type': car.fuel_type,
                'transmission': car.transmission,
                'seats': car.seats,
                'status': car.status,
                'location': car.location,
            })
        
        return Response({
            'available': available_cars_data,
            'count': len(available_cars_data),
            'total': all_cars.count()
        })