from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .models import Car
from .serializers import CarSerializer
from django.db.models import ProtectedError

class CarListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CarSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role in ['fleet_admin', 'super_admin', 'manager']:
            return Car.objects.all()
        return Car.objects.filter(status='available')
    
    def perform_create(self, serializer):
        serializer.save()

class CarDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CarSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role in ['fleet_admin', 'super_admin', 'manager']:
            return Car.objects.all()
        return Car.objects.filter(status='available')
    
    def perform_destroy(self, instance):
        try:
            if instance.bookings.exists():
                instance.status = 'out_of_service'
                instance.save()
                return
            instance.delete()
        except ProtectedError:
            instance.status = 'out_of_service'
            instance.save()

class AvailableCarsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CarSerializer
    
    def get_queryset(self):
        return Car.objects.filter(status='available')

class UpdateCarStatusView(APIView):
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, pk):
        try:
            car = Car.objects.get(pk=pk)
        except Car.DoesNotExist:
            return Response({'error': 'Car not found'}, status=status.HTTP_404_NOT_FOUND)
        
        new_status = request.data.get('status')
        
        if new_status not in dict(Car.STATUS_CHOICES):
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        
        car.status = new_status
        car.save()
        serializer = CarSerializer(car)
        return Response(serializer.data)