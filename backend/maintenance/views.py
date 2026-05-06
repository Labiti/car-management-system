from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.utils import timezone
from django.db import models
from .models import MaintenanceRecord, ServiceReminder, InsuranceRecord
from .serializers import MaintenanceRecordSerializer, ServiceReminderSerializer, InsuranceRecordSerializer


# ========== MaintenanceRecord ViewSet (for frontend compatibility) ==========
class MaintenanceRecordViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = MaintenanceRecordSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role in ['fleet_admin', 'super_admin', 'manager']:
            return MaintenanceRecord.objects.all().order_by('-scheduled_date')
        return MaintenanceRecord.objects.filter(created_by=user).order_by('-scheduled_date')
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        today = timezone.now().date()
        queryset = MaintenanceRecord.objects.filter(
            scheduled_date__gte=today,
            status__in=['scheduled', 'overdue']
        ).order_by('scheduled_date', 'priority')
        
        car_id = request.query_params.get('car')
        if car_id:
            queryset = queryset.filter(car_id=car_id)
        
        maintenance_type = request.query_params.get('type')
        if maintenance_type:
            queryset = queryset.filter(maintenance_type=maintenance_type)
        
        # Handle pagination response format
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def overdue(self, request):
        today = timezone.now().date()
        queryset = MaintenanceRecord.objects.filter(
            scheduled_date__lt=today,
            status='scheduled'
        ).order_by('scheduled_date')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        maintenance = self.get_object()
        
        if maintenance.status == 'completed':
            return Response({'error': 'Maintenance already completed'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        actual_cost = request.data.get('actual_cost', maintenance.estimated_cost)
        technician_notes = request.data.get('technician_notes', '')
        
        maintenance.status = 'completed'
        maintenance.completed_date = timezone.now().date()
        maintenance.actual_cost = actual_cost
        maintenance.technician_notes = technician_notes
        maintenance.save()
        
        car = maintenance.car
        car.last_maintenance_date = timezone.now()
        if maintenance.next_service_km:
            car.next_maintenance_km = maintenance.next_service_km
        car.save()
        
        if maintenance.next_service_km or maintenance.next_service_date:
            ServiceReminder.objects.create(
                car=car,
                reminder_type=maintenance.maintenance_type,
                due_date=maintenance.next_service_date or timezone.now().date(),
                due_km=maintenance.next_service_km,
                is_recurring=True
            )
        
        return Response({
            'message': 'Maintenance completed successfully',
            'status': maintenance.status,
            'completed_date': maintenance.completed_date
        })


# ========== APIView classes for urls.py ==========
class MaintenanceRecordListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MaintenanceRecordSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role in ['fleet_admin', 'super_admin', 'manager']:
            return MaintenanceRecord.objects.all().order_by('-scheduled_date')
        return MaintenanceRecord.objects.none()  # Regular users can't see all maintenance
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class MaintenanceRecordDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MaintenanceRecordSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role in ['fleet_admin', 'super_admin', 'manager']:
            return MaintenanceRecord.objects.all()
        return MaintenanceRecord.objects.filter(created_by=user)


class UpcomingMaintenanceView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MaintenanceRecordSerializer
    
    def get_queryset(self):
        today = timezone.now().date()
        user = self.request.user
        
        queryset = MaintenanceRecord.objects.filter(
            scheduled_date__gte=today,
            status__in=['scheduled', 'overdue']
        ).order_by('scheduled_date', 'priority')
        
        # Filter by user role
        if user.role not in ['fleet_admin', 'super_admin', 'manager']:
            queryset = queryset.filter(created_by=user)
        
        car_id = self.request.query_params.get('car')
        if car_id:
            queryset = queryset.filter(car_id=car_id)
        
        maintenance_type = self.request.query_params.get('type')
        if maintenance_type:
            queryset = queryset.filter(maintenance_type=maintenance_type)
        
        return queryset


class OverdueMaintenanceView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MaintenanceRecordSerializer
    
    def get_queryset(self):
        today = timezone.now().date()
        user = self.request.user
        
        queryset = MaintenanceRecord.objects.filter(
            scheduled_date__lt=today,
            status='scheduled'
        ).order_by('scheduled_date')
        
        if user.role not in ['fleet_admin', 'super_admin', 'manager']:
            queryset = queryset.filter(created_by=user)
        
        return queryset


class OverdueCountView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        today = timezone.now().date()
        count = MaintenanceRecord.objects.filter(
            scheduled_date__lt=today,
            status='scheduled'
        ).count()
        return Response({'count': count})


class CompleteMaintenanceView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, pk):
        # Check permission
        if request.user.role not in ['fleet_admin', 'super_admin']:
            return Response({'error': 'Permission denied. Only Fleet Admin can complete maintenance.'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        try:
            maintenance = MaintenanceRecord.objects.get(pk=pk)
        except MaintenanceRecord.DoesNotExist:
            return Response({'error': 'Maintenance record not found'}, 
                          status=status.HTTP_404_NOT_FOUND)
        
        if maintenance.status == 'completed':
            return Response({'error': 'Maintenance already completed'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        actual_cost = request.data.get('actual_cost', maintenance.estimated_cost)
        technician_notes = request.data.get('technician_notes', '')
        
        maintenance.status = 'completed'
        maintenance.completed_date = timezone.now().date()
        maintenance.actual_cost = actual_cost
        maintenance.technician_notes = technician_notes
        maintenance.save()
        
        # Update car's last maintenance date
        car = maintenance.car
        car.last_maintenance_date = timezone.now()
        if maintenance.next_service_km:
            car.next_maintenance_km = maintenance.next_service_km
        car.save()
        
        # Create recurring reminder if needed
        if maintenance.next_service_km or maintenance.next_service_date:
            ServiceReminder.objects.create(
                car=car,
                reminder_type=maintenance.maintenance_type,
                due_date=maintenance.next_service_date or timezone.now().date(),
                due_km=maintenance.next_service_km,
                is_recurring=True
            )
        
        return Response({
            'message': 'Maintenance completed successfully',
            'status': maintenance.status,
            'completed_date': maintenance.completed_date
        })


# ========== Service Reminders Views ==========
class ServiceReminderListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ServiceReminderSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role in ['fleet_admin', 'super_admin', 'manager']:
            return ServiceReminder.objects.all().order_by('due_date')
        return ServiceReminder.objects.filter(car__created_by=user).order_by('due_date')


class ServiceReminderDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ServiceReminderSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role in ['fleet_admin', 'super_admin', 'manager']:
            return ServiceReminder.objects.all()
        return ServiceReminder.objects.filter(car__created_by=user)


class TriggeredRemindersView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ServiceReminderSerializer
    
    def get_queryset(self):
        today = timezone.now().date()
        user = self.request.user
        
        queryset = ServiceReminder.objects.filter(
            models.Q(due_date__lte=today) | models.Q(due_km__lte=models.F('car__current_odometer')),
            is_triggered=False
        )
        
        # Mark them as triggered
        for reminder in queryset:
            reminder.is_triggered = True
            reminder.triggered_at = timezone.now()
            reminder.save()
        
        if user.role not in ['fleet_admin', 'super_admin', 'manager']:
            queryset = queryset.filter(car__created_by=user)
        
        return queryset


# ========== Insurance Records Views ==========
class InsuranceRecordListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InsuranceRecordSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role in ['fleet_admin', 'super_admin', 'manager']:
            return InsuranceRecord.objects.all().order_by('-start_date')
        return InsuranceRecord.objects.filter(car__created_by=user).order_by('-start_date')


class InsuranceRecordDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InsuranceRecordSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role in ['fleet_admin', 'super_admin', 'manager']:
            return InsuranceRecord.objects.all()
        return InsuranceRecord.objects.filter(car__created_by=user)


class ExpiringInsuranceView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InsuranceRecordSerializer
    
    def get_queryset(self):
        today = timezone.now().date()
        thirty_days_later = today + timezone.timedelta(days=30)
        user = self.request.user
        
        queryset = InsuranceRecord.objects.filter(
            is_active=True,
            end_date__lte=thirty_days_later
        ).order_by('end_date')
        
        if user.role not in ['fleet_admin', 'super_admin', 'manager']:
            queryset = queryset.filter(car__created_by=user)
        
        return queryset