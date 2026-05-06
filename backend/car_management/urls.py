from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse, JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

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
                    </ul>
                </div>
            </div>
        </body>
        </html>
    """)

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
    
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)