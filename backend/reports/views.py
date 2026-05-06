from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Sum, Avg, Q, F
from django.db.models.functions import TruncMonth, TruncWeek, TruncDay
from django.utils import timezone
from datetime import timedelta
from bookings.models import Booking
from cars.models import Car
from trips.models import TripLog
from accounts.models import User
from maintenance.models import MaintenanceRecord

class DashboardStatsView(APIView):
    """Get main dashboard statistics"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        today = timezone.now().date()
        start_of_month = today.replace(day=1)
        start_of_week = today - timedelta(days=today.weekday())
        
        stats = {
            'total_cars': Car.objects.count(),
            'total_users': User.objects.count(),
            'total_bookings': Booking.objects.count(),
            'pending_bookings': Booking.objects.filter(status='pending').count(),
            'approved_bookings': Booking.objects.filter(status='approved').count(),
            'completed_bookings': Booking.objects.filter(status='completed').count(),
            'in_progress_bookings': Booking.objects.filter(status='in_progress').count(),
            'active_trips': TripLog.objects.filter(check_in_time__isnull=True).count(),
            'total_maintenance': MaintenanceRecord.objects.count(),
            'pending_maintenance': MaintenanceRecord.objects.filter(status='scheduled').count(),
            'cars_by_status': list(Car.objects.values('status').annotate(count=Count('id'))),
            'bookings_this_month': Booking.objects.filter(requested_at__date__gte=start_of_month).count(),
            'bookings_this_week': Booking.objects.filter(requested_at__date__gte=start_of_week).count(),
        }
        return Response(stats)

class BookingReportView(APIView):
    """Get booking reports"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        period = request.query_params.get('period', 'month')  # day, week, month, year
        today = timezone.now().date()
        
        if period == 'day':
            start_date = today
            trunc_func = TruncDay
        elif period == 'week':
            start_date = today - timedelta(days=today.weekday())
            trunc_func = TruncWeek
        elif period == 'year':
            start_date = today.replace(month=1, day=1)
            trunc_func = TruncMonth
        else:  # month
            start_date = today.replace(day=1)
            trunc_func = TruncMonth
        
        # Bookings over time
        bookings_over_time = Booking.objects.filter(
            requested_at__date__gte=start_date
        ).annotate(
            period=trunc_func('requested_at')
        ).values('period').annotate(
            count=Count('id'),
            approved=Count('id', filter=Q(status='approved')),
            rejected=Count('id', filter=Q(status='rejected')),
            cancelled=Count('id', filter=Q(status='cancelled')),
            completed=Count('id', filter=Q(status='completed'))
        ).order_by('period')
        
        # Bookings by car
        bookings_by_car = Booking.objects.values(
            'car__brand', 'car__model', 'car__registration_number'
        ).annotate(
            total_bookings=Count('id'),
            total_km=Sum('estimated_km'),
            approved_count=Count('id', filter=Q(status='approved')),
            completed_count=Count('id', filter=Q(status='completed'))
        ).order_by('-total_bookings')[:10]
        
        # Bookings by employee
        bookings_by_employee = Booking.objects.values(
            'employee__username', 'employee__first_name', 'employee__last_name', 'employee__department'
        ).annotate(
            total_bookings=Count('id'),
            total_km=Sum('estimated_km'),
            approved_count=Count('id', filter=Q(status='approved'))
        ).order_by('-total_bookings')[:10]
        
        # Bookings by department
        bookings_by_department = Booking.objects.values(
            'employee__department'
        ).annotate(
            total_bookings=Count('id'),
            total_km=Sum('estimated_km')
        ).exclude(employee__department__isnull=True).exclude(employee__department='').order_by('-total_bookings')
        
        return Response({
            'over_time': bookings_over_time,
            'by_car': bookings_by_car,
            'by_employee': bookings_by_employee,
            'by_department': bookings_by_department,
        })

class TripReportView(APIView):
    """Get trip reports"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        period = request.query_params.get('period', 'month')
        today = timezone.now().date()
        
        if period == 'month':
            start_date = today.replace(day=1)
        elif period == 'week':
            start_date = today - timedelta(days=today.weekday())
        elif period == 'year':
            start_date = today.replace(month=1, day=1)
        else:
            start_date = today
        
        # Trip statistics
        trip_stats = TripLog.objects.filter(
            check_out_time__date__gte=start_date
        ).aggregate(
            total_trips=Count('id'),
            total_km=Sum('total_km_driven'),
            avg_km=Avg('total_km_driven'),
            total_late_returns=Count('id', filter=Q(is_late_return=True)),
            total_late_fees=Sum('late_fee'),
            total_fuel_cost=Sum('fuel_cost')
        )
        
        # Trips by car
        trips_by_car = TripLog.objects.filter(
            check_out_time__date__gte=start_date
        ).values(
            'booking__car__brand', 'booking__car__model', 'booking__car__registration_number'
        ).annotate(
            total_trips=Count('id'),
            total_km=Sum('total_km_driven'),
            avg_km=Avg('total_km_driven'),
            total_late_returns=Count('id', filter=Q(is_late_return=True))
        ).order_by('-total_trips')[:10]
        
        # Recent trips
        recent_trips = TripLog.objects.filter(
            check_in_time__isnull=False
        ).select_related(
            'booking__car', 'booking__employee'
        ).order_by('-check_in_time')[:20]
        
        recent_trips_data = []
        for trip in recent_trips:
            recent_trips_data.append({
                'id': trip.id,
                'car': f"{trip.booking.car.brand} {trip.booking.car.model}",
                'registration': trip.booking.car.registration_number,
                'employee': trip.booking.employee.get_full_name() or trip.booking.employee.username,
                'start_time': trip.check_out_time,
                'end_time': trip.check_in_time,
                'total_km': trip.total_km_driven,
                'late_return': trip.is_late_return,
            })
        
        return Response({
            'statistics': trip_stats,
            'by_car': trips_by_car,
            'recent_trips': recent_trips_data,
        })

class MaintenanceReportView(APIView):
    """Get maintenance reports"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        period = request.query_params.get('period', 'month')
        today = timezone.now().date()
        
        if period == 'month':
            start_date = today.replace(day=1)
        else:
            start_date = today - timedelta(days=30)
        
        # Maintenance statistics
        maintenance_stats = MaintenanceRecord.objects.filter(
            scheduled_date__gte=start_date
        ).aggregate(
            total_scheduled=Count('id', filter=Q(status='scheduled')),
            total_completed=Count('id', filter=Q(status='completed')),
            total_cost=Sum('actual_cost'),
            avg_cost=Avg('actual_cost'),
            total_estimated_cost=Sum('estimated_cost')
        )
        
        # Maintenance by type
        maintenance_by_type = MaintenanceRecord.objects.filter(
            scheduled_date__gte=start_date
        ).values('maintenance_type').annotate(
            count=Count('id'),
            total_cost=Sum('actual_cost'),
            avg_cost=Avg('actual_cost')
        ).order_by('-count')
        
        # Upcoming maintenance
        upcoming_maintenance = MaintenanceRecord.objects.filter(
            scheduled_date__gte=today,
            status='scheduled'
        ).select_related('car').order_by('scheduled_date')[:10]
        
        upcoming_data = []
        for maint in upcoming_maintenance:
            upcoming_data.append({
                'id': maint.id,
                'car': f"{maint.car.brand} {maint.car.model}",
                'registration': maint.car.registration_number,
                'type': maint.get_maintenance_type_display(),
                'scheduled_date': maint.scheduled_date,
                'estimated_cost': maint.estimated_cost,
                'priority': maint.priority,
            })
        
        return Response({
            'statistics': maintenance_stats,
            'by_type': maintenance_by_type,
            'upcoming': upcoming_data,
        })

class CostReportView(APIView):
    """Get cost reports"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        period = request.query_params.get('period', 'month')
        today = timezone.now().date()
        
        if period == 'month':
            start_date = today.replace(day=1)
        elif period == 'year':
            start_date = today.replace(month=1, day=1)
        else:
            start_date = today - timedelta(days=30)
        
        # Fuel costs by car
        fuel_costs = TripLog.objects.filter(
            check_out_time__date__gte=start_date
        ).values(
            'booking__car__brand', 'booking__car__model', 'booking__car__registration_number'
        ).annotate(
            total_fuel_cost=Sum('fuel_cost'),
            total_km=Sum('total_km_driven'),
            cost_per_km=Avg(F('fuel_cost') / F('total_km_driven'), output_field=models.FloatField())
        ).exclude(total_km=0).order_by('-total_fuel_cost')[:10]
        
        # Late fees by employee
        late_fees = TripLog.objects.filter(
            check_out_time__date__gte=start_date,
            is_late_return=True
        ).values(
            'booking__employee__username', 'booking__employee__first_name', 'booking__employee__last_name'
        ).annotate(
            total_late_fees=Sum('late_fee'),
            total_late_returns=Count('id')
        ).order_by('-total_late_fees')[:10]
        
        # Monthly costs
        monthly_costs = TripLog.objects.filter(
            check_out_time__date__gte=start_date
        ).annotate(
            month=TruncMonth('check_out_time')
        ).values('month').annotate(
            total_fuel_cost=Sum('fuel_cost'),
            total_late_fees=Sum('late_fee'),
            total_trips=Count('id')
        ).order_by('month')
        
        return Response({
            'fuel_costs_by_car': fuel_costs,
            'late_fees_by_employee': late_fees,
            'monthly_costs': monthly_costs,
        })

class DepartmentReportView(APIView):
    """Get department reports"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Department statistics
        dept_stats = Booking.objects.values(
            'employee__department'
        ).annotate(
            total_bookings=Count('id'),
            total_km=Sum('estimated_km'),
            total_completed=Count('id', filter=Q(status='completed')),
            total_approved=Count('id', filter=Q(status='approved')),
            total_cancelled=Count('id', filter=Q(status='cancelled'))
        ).exclude(employee__department__isnull=True).exclude(employee__department='').order_by('-total_bookings')
        
        return Response({
            'departments': dept_stats,
        })

class ExportReportView(APIView):
    """Export reports as CSV/Excel"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        report_type = request.query_params.get('type', 'bookings')
        format_type = request.query_params.get('format', 'csv')
        
        if report_type == 'bookings':
            data = list(Booking.objects.values(
                'id', 'employee__username', 'car__brand', 'car__model',
                'destination', 'start_datetime', 'end_datetime', 'status',
                'estimated_km', 'requested_at'
            ).order_by('-requested_at'))
        elif report_type == 'trips':
            data = list(TripLog.objects.values(
                'id', 'booking__employee__username', 'booking__car__brand',
                'booking__car__model', 'check_out_time', 'check_in_time',
                'total_km_driven', 'is_late_return', 'late_fee', 'fuel_cost'
            ).order_by('-check_out_time'))
        elif report_type == 'maintenance':
            data = list(MaintenanceRecord.objects.values(
                'id', 'car__brand', 'car__model', 'maintenance_type',
                'scheduled_date', 'completed_date', 'estimated_cost',
                'actual_cost', 'status', 'service_provider'
            ).order_by('-scheduled_date'))
        else:
            data = []
        
        return Response({
            'data': data,
            'count': len(data),
            'report_type': report_type
        })