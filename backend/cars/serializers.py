from rest_framework import serializers
from .models import Car

class CarSerializer(serializers.ModelSerializer):
    status_display = serializers.SerializerMethodField()
    fuel_type_display = serializers.SerializerMethodField()
    transmission_display = serializers.SerializerMethodField()
    
    class Meta:
        model = Car
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')
    
    def get_status_display(self, obj):
        return dict(Car.STATUS_CHOICES).get(obj.status, obj.status)
    
    def get_fuel_type_display(self, obj):
        return dict(Car.FUEL_TYPES).get(obj.fuel_type, obj.fuel_type)
    
    def get_transmission_display(self, obj):
        return dict(Car.TRANSMISSION_TYPES).get(obj.transmission, obj.transmission)

class CarListSerializer(serializers.ModelSerializer):
    """Simplified serializer for list views"""
    class Meta:
        model = Car
        fields = ('id', 'registration_number', 'brand', 'model', 'year', 
                 'color', 'fuel_type', 'seats', 'status', 'image', 'location')

class CarDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for single car view"""
    class Meta:
        model = Car
        fields = '__all__'