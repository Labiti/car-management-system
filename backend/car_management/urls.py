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

def create_test_users(request):
    """One-time endpoint to create test users"""
    users_data = [
        {
            'username': 'superadmin',
            'password': 'SuperAdmin2026!',
            'email': 'superadmin@car.com',
            'first_name': 'Super',
            'last_name': 'Admin',
            'role': 'super_admin',
            'employee_id': 'SA001',
            'phone_number': '+27721234001',
            'driver_license': 'DLSA001',
            'is_staff': True,
            'is_superuser': True,
        },
        {
            'username': 'fleetmanager',
            'password': 'FleetManager2026!',
            'email': 'fleetmanager@car.com',
            'first_name': 'Fleet',
            'last_name': 'Manager',
            'role': 'fleet_admin',
            'employee_id': 'FM001',
            'phone_number': '+27721234002',
            'driver_license': 'DLFM001',
            'is_staff': True,
        },
        {
            'username': 'manager',
            'password': 'Manager2026!',
            'email': 'manager@car.com',
            'first_name': 'John',
            'last_name': 'Manager',
            'role': 'manager',
            'employee_id': 'MGR001',
            'phone_number': '+27721234003',
            'driver_license': 'DLMGR001',
        },
        {
            'username': 'employee',
            'password': 'Employee2026!',
            'email': 'employee@car.com',
            'first_name': 'Jane',
            'last_name': 'Driver',
            'role': 'employee',
            'employee_id': 'EMP001',
            'phone_number': '+27721234004',
            'driver_license': 'DLEMP001',
        },
        {
            'username': 'supermanager',
            'password': 'SuperManager2026!',
            'email': 'supermanager@car.com',
            'first_name': 'Super',
            'last_name': 'Manager',
            'role': 'super_admin',
            'employee_id': 'SM001',
            'phone_number': '+27721234005',
            'driver_license': 'DLSM001',
            'is_staff': True,
            'is_superuser': True,
        },
    ]
    
    created_users = []
    errors = []
    
    for user_data in users_data:
        try:
            user, created = User.objects.get_or_create(
                username=user_data['username'],
                defaults={
                    'email': user_data['email'],
                    'first_name': user_data['first_name'],
                    'last_name': user_data['last_name'],
                    'role': user_data['role'],
                    'employee_id': user_data['employee_id'],
                    'phone_number': user_data['phone_number'],
                    'driver_license': user_data['driver_license'],
                    'is_active': True,
                    'is_staff': user_data.get('is_staff', False),
                    'is_superuser': user_data.get('is_superuser', False),
                }
            )
            if created:
                user.set_password(user_data['password'])
                user.save()
                created_users.append(f"{user.username} ({user.role}) - CREATED")
            else:
                # Update existing user
                user.set_password(user_data['password'])
                user.role = user_data['role']
                user.first_name = user_data['first_name']
                user.last_name = user_data['last_name']
                user.email = user_data['email']
                user.employee_id = user_data['employee_id']
                user.phone_number = user_data['phone_number']
                user.driver_license = user_data['driver_license']
                user.is_staff = user_data.get('is_staff', False)
                user.is_superuser = user_data.get('is_superuser', False)
                user.save()
                created_users.append(f"{user.username} ({user.role}) - UPDATED")
        except Exception as e:
            errors.append(f"{user_data['username']}: {str(e)}")
    
    return JsonResponse({
        'message': 'User creation completed',
        'created_or_updated': created_users,
        'errors': errors,
        'total_users': User.objects.count()
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
    path('create-test-users/', create_test_users),  # ADD THIS LINE
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)