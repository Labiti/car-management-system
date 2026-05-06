import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'car_management.settings')
django.setup()

from cars.models import Car

def add_sample_cars():
    sample_cars = [
        {
            'registration_number': 'ABC123GP',
            'brand': 'Toyota',
            'model': 'Corolla',
            'year': 2022,
            'color': 'Silver',
            'fuel_type': 'petrol',
            'transmission': 'automatic',
            'seats': 5,
            'status': 'available',
            'location': 'Main Parking',
            'current_odometer': 25000,
            'current_fuel_level': 75,
        },
        {
            'registration_number': 'XYZ789GP',
            'brand': 'Honda',
            'model': 'Civic',
            'year': 2023,
            'color': 'White',
            'fuel_type': 'petrol',
            'transmission': 'automatic',
            'seats': 5,
            'status': 'available',
            'location': 'Main Parking',
            'current_odometer': 12000,
            'current_fuel_level': 90,
        },
        {
            'registration_number': 'DEF456GP',
            'brand': 'Ford',
            'model': 'Ranger',
            'year': 2023,
            'color': 'Blue',
            'fuel_type': 'diesel',
            'transmission': 'automatic',
            'seats': 5,
            'status': 'available',
            'location': 'West Parking',
            'current_odometer': 18000,
            'current_fuel_level': 60,
        },
        {
            'registration_number': 'JKL012GP',
            'brand': 'BMW',
            'model': '3 Series',
            'year': 2024,
            'color': 'Black',
            'fuel_type': 'petrol',
            'transmission': 'automatic',
            'seats': 5,
            'status': 'available',
            'location': 'Main Parking',
            'current_odometer': 5000,
            'current_fuel_level': 100,
        },
        {
            'registration_number': 'PQR678GP',
            'brand': 'Hyundai',
            'model': 'Tucson',
            'year': 2023,
            'color': 'White',
            'fuel_type': 'hybrid',
            'transmission': 'automatic',
            'seats': 5,
            'status': 'available',
            'location': 'East Parking',
            'current_odometer': 15000,
            'current_fuel_level': 85,
        },
        {
            'registration_number': 'YZA567GP',
            'brand': 'Tesla',
            'model': 'Model 3',
            'year': 2024,
            'color': 'Red',
            'fuel_type': 'electric',
            'transmission': 'automatic',
            'seats': 5,
            'status': 'available',
            'location': 'Charging Station',
            'current_odometer': 3000,
            'current_fuel_level': 95,
        },
    ]

    added = 0
    for car_data in sample_cars:
        if not Car.objects.filter(registration_number=car_data['registration_number']).exists():
            Car.objects.create(**car_data)
            added += 1
            print(f"✅ Added: {car_data['brand']} {car_data['model']}")

    print(f"\n📊 Added {added} new cars. Total: {Car.objects.count()}")

if __name__ == '__main__':
    add_sample_cars()