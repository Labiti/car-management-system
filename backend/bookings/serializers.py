from rest_framework import serializers
from .models import Booking
from cars.serializers import CarListSerializer

class BookingSerializer(serializers.ModelSerializer):
    car_details = CarListSerializer(source='car', read_only=True)
    employee_name = serializers.SerializerMethodField()
    status_display = serializers.SerializerMethodField()
    
    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ('id', 'employee', 'requested_at', 'approved_at', 'rejected_at', 'cancelled_at', 'approved_by', 'status')
    
    def get_employee_name(self, obj):
        return obj.employee.get_full_name() or obj.employee.username
    
    def get_status_display(self, obj):
        return dict(Booking.STATUS_CHOICES).get(obj.status, obj.status)