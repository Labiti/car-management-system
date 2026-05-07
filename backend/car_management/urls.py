from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse, JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth.hashers import make_password
from accounts.models import User

def home(request):
    return HttpResponse("""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Car Management System</title>
            <style>
                body { font-family: Arial; text-align: center; padding: 50px; }
                .container { max-width: 600px; margin: auto; }
                .endpoint { background: #f0f0f0; padding: 10px; margin: 10px 0; border-radius: 5px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🚗 Car Management System API</h1>
                <div class="endpoint">
                    <h3>Available Endpoints:</h3>
                    <ul style="text-align: left;">
                        <li><a href="/admin/">Admin Panel</a></li>
                        <li><a href="/api/users/register/">Register</a></li>
                        <li><a href="/api/users/login/">Login</a></li>
                        <li><a href="/api/cars/">Cars API</a></li>
                        <li><a href="/api/bookings/">Bookings API</a></li>
                        <li><a href="/api/maintenance/">Maintenance API</a></li>
                        <li><a href="/create-test-users/">Create Test Users</a></li>
                    </ul>
                </div>
            </div>
        </body>
        </html>
    """)

def create_test_cars(request):
    """One-time endpoint to create test cars"""
    from cars.models import Car
    
    cars_data = [
        {
            'registration_number': 'TOY001GP',
            'brand': 'Toyota',
            'model': 'Corolla',
            'year': 2023,
            'color': 'Silver',
            'fuel_type': 'petrol',
            'transmission': 'automatic',
            'seats': 5,
            'status': 'available',
            'location': 'Main Parking',
            'current_odometer': 15000,
            'current_fuel_level': 85,
            'department_assigned': 'Sales',
            'daily_rate': 55.00,
            'notes': 'Great fuel economy, perfect for sales team'
        },
        {
            'registration_number': 'HON002GP',
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
            'department_assigned': 'Marketing',
            'daily_rate': 55.00,
            'notes': 'Comfortable and reliable'
        },
        {
            'registration_number': 'FRD003GP',
            'brand': 'Ford',
            'model': 'Ranger',
            'year': 2024,
            'color': 'Blue',
            'fuel_type': 'diesel',
            'transmission': 'automatic',
            'seats': 5,
            'status': 'available',
            'location': 'West Parking',
            'current_odometer': 8000,
            'current_fuel_level': 75,
            'department_assigned': 'Logistics',
            'daily_rate': 85.00,
            'notes': 'Heavy duty for deliveries and cargo'
        },
        {
            'registration_number': 'VW004GP',
            'brand': 'Volkswagen',
            'model': 'Polo',
            'year': 2022,
            'color': 'Red',
            'fuel_type': 'petrol',
            'transmission': 'manual',
            'seats': 5,
            'status': 'available',
            'location': 'South Parking',
            'current_odometer': 35000,
            'current_fuel_level': 60,
            'department_assigned': 'Sales',
            'daily_rate': 45.00,
            'notes': 'Compact and efficient for city driving'
        },
        {
            'registration_number': 'BMW005GP',
            'brand': 'BMW',
            'model': '3 Series',
            'year': 2024,
            'color': 'Black',
            'fuel_type': 'petrol',
            'transmission': 'automatic',
            'seats': 5,
            'status': 'available',
            'location': 'Executive Parking',
            'current_odometer': 5000,
            'current_fuel_level': 95,
            'department_assigned': 'Executive',
            'daily_rate': 150.00,
            'notes': 'Executive car for VIP clients'
        },
        {
            'registration_number': 'MER006GP',
            'brand': 'Mercedes',
            'model': 'C-Class',
            'year': 2023,
            'color': 'Grey',
            'fuel_type': 'diesel',
            'transmission': 'automatic',
            'seats': 5,
            'status': 'available',
            'location': 'Executive Parking',
            'current_odometer': 45000,
            'current_fuel_level': 80,
            'department_assigned': 'Executive',
            'daily_rate': 140.00,
            'notes': 'Luxury sedan for executives'
        },
        {
            'registration_number': 'HYU007GP',
            'brand': 'Hyundai',
            'model': 'Tucson',
            'year': 2023,
            'color': 'White',
            'fuel_type': 'hybrid',
            'transmission': 'automatic',
            'seats': 5,
            'status': 'available',
            'location': 'East Parking',
            'current_odometer': 18000,
            'current_fuel_level': 80,
            'department_assigned': 'HR',
            'daily_rate': 75.00,
            'notes': 'Eco-friendly hybrid SUV'
        },
        {
            'registration_number': 'KIA008GP',
            'brand': 'Kia',
            'model': 'Sportage',
            'year': 2022,
            'color': 'Silver',
            'fuel_type': 'petrol',
            'transmission': 'automatic',
            'seats': 5,
            'status': 'available',
            'location': 'East Parking',
            'current_odometer': 28000,
            'current_fuel_level': 70,
            'department_assigned': 'IT',
            'daily_rate': 70.00,
            'notes': 'Spacious and comfortable'
        },
        {
            'registration_number': 'NIS009GP',
            'brand': 'Nissan',
            'model': 'Navara',
            'year': 2023,
            'color': 'Orange',
            'fuel_type': 'diesel',
            'transmission': 'manual',
            'seats': 4,
            'status': 'available',
            'location': 'West Parking',
            'current_odometer': 22000,
            'current_fuel_level': 65,
            'department_assigned': 'Logistics',
            'daily_rate': 90.00,
            'notes': 'Workhorse for heavy loads'
        },
        {
            'registration_number': 'TES010GP',
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
            'current_fuel_level': 100,
            'department_assigned': 'Executive',
            'daily_rate': 180.00,
            'notes': 'Electric vehicle, eco-friendly'
        },
        {
            'registration_number': 'MZD011GP',
            'brand': 'Mazda',
            'model': 'CX-5',
            'year': 2023,
            'color': 'Blue',
            'fuel_type': 'petrol',
            'transmission': 'automatic',
            'seats': 5,
            'status': 'available',
            'location': 'Main Parking',
            'current_odometer': 10000,
            'current_fuel_level': 88,
            'department_assigned': 'Marketing',
            'daily_rate': 80.00,
            'notes': 'Stylish and reliable SUV'
        },
        {
            'registration_number': 'AUD012GP',
            'brand': 'Audi',
            'model': 'A4',
            'year': 2024,
            'color': 'Black',
            'fuel_type': 'petrol',
            'transmission': 'automatic',
            'seats': 5,
            'status': 'available',
            'location': 'Executive Parking',
            'current_odometer': 2000,
            'current_fuel_level': 98,
            'department_assigned': 'Executive',
            'daily_rate': 160.00,
            'notes': 'Luxury sedan for executives'
        },
    ]
    
    added_cars = []
    errors = []
    
    for car_data in cars_data:
        try:
            car, created = Car.objects.get_or_create(
                registration_number=car_data['registration_number'],
                defaults=car_data
            )
            if created:
                added_cars.append(f"{car.brand} {car.model} ({car.registration_number}) - ADDED")
            else:
                # Update existing car
                for key, value in car_data.items():
                    setattr(car, key, value)
                car.save()
                added_cars.append(f"{car.brand} {car.model} ({car.registration_number}) - UPDATED")
        except Exception as e:
            errors.append(f"{car_data['registration_number']}: {str(e)}")
    
    return JsonResponse({
        'message': 'Car creation completed',
        'added_or_updated': added_cars,
        'errors': errors,
        'total_cars': Car.objects.count()
    })

urlpatterns = [
    path('', home),
    path('admin/', admin.site.urls),
    path('api/users/', include('accounts.urls')),
    path('api/cars/', include('cars.urls')),
    path('api/bookings/', include('bookings.urls')),
    path('api/maintenance/', include('maintenance.urls')),
    path('api/token/', TokenObtainPairView.as_view()),
    path('api/reports/', include('reports.urls')),
    path('api/token/refresh/', TokenRefreshView.as_view()),
    path('create-test-cars/', create_test_cars),  # ADD THIS LINE
    ]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)