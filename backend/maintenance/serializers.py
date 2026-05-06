from rest_framework import serializers
from .models import MaintenanceRecord, ServiceReminder, InsuranceRecord
from cars.models import Car
from django.utils import timezone

class MaintenanceRecordSerializer(serializers.ModelSerializer):
    car_details = serializers.SerializerMethodField()
    
    class Meta:
        model = MaintenanceRecord
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at', 'created_by', 'approved_by')
    
    def get_car_details(self, obj):
        if obj.car:
            return {
                'id': obj.car.id,
                'brand': obj.car.brand,
                'model': obj.car.model,
                'registration_number': obj.car.registration_number
            }
        return None
    
    def validate(self, data):
        if data.get('scheduled_date') and data['scheduled_date'] < timezone.now().date():
            raise serializers.ValidationError({"scheduled_date": "Scheduled date cannot be in the past"})
        return data
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class ServiceReminderSerializer(serializers.ModelSerializer):
    car_details = serializers.SerializerMethodField()
    
    class Meta:
        model = ServiceReminder
        fields = '__all__'
        read_only_fields = ('id', 'created_at')
    
    def get_car_details(self, obj):
        if obj.car:
            return {
                'id': obj.car.id,
                'brand': obj.car.brand,
                'model': obj.car.model,
                'registration_number': obj.car.registration_number
            }
        return None


class InsuranceRecordSerializer(serializers.ModelSerializer):
    car_details = serializers.SerializerMethodField()
    is_expired = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = InsuranceRecord
        fields = '__all__'
        read_only_fields = ('id', 'created_at')
    
    def get_car_details(self, obj):
        if obj.car:
            return {
                'id': obj.car.id,
                'brand': obj.car.brand,
                'model': obj.car.model,
                'registration_number': obj.car.registration_number
            }
        return None