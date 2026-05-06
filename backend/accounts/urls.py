from django.urls import path
from .views import UserViewSet

# Create instance of the viewset
user_viewset = UserViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

urlpatterns = [
    # Authentication endpoints
    path('register/', UserViewSet.as_view({'post': 'register'}), name='register'),
    path('login/', UserViewSet.as_view({'post': 'login'}), name='login'),
    
    # User profile endpoints
    path('me/', UserViewSet.as_view({'get': 'me', 'put': 'me'}), name='me'),
    path('change-password/', UserViewSet.as_view({'post': 'change_password'}), name='change-password'),
    
    # Basic CRUD endpoints
    path('', UserViewSet.as_view({'get': 'list'}), name='user-list'),
    path('<int:pk>/', UserViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='user-detail'),
    
    # Admin user management endpoints
    path('user_stats/', UserViewSet.as_view({'get': 'user_stats'}), name='user-stats'),
    path('employees/', UserViewSet.as_view({'get': 'employees'}), name='employees'),
    path('managers/', UserViewSet.as_view({'get': 'managers'}), name='managers'),
    
    # User management actions
    path('<int:pk>/update_role/', UserViewSet.as_view({'patch': 'update_role'}), name='update-role'),
    path('<int:pk>/toggle_active/', UserViewSet.as_view({'patch': 'toggle_active'}), name='toggle-active'),
    path('<int:pk>/delete_user/', UserViewSet.as_view({'delete': 'delete_user'}), name='delete-user'),
    path('<int:pk>/reset_password/', UserViewSet.as_view({'post': 'reset_password'}), name='reset-password'),
    path('<int:pk>/approve/', UserViewSet.as_view({'post': 'approve'}), name='approve-user'),
    
    # Promotion endpoints
    path('<int:pk>/promote_to_manager/', UserViewSet.as_view({'post': 'promote_to_manager'}), name='promote-to-manager'),
    path('<int:pk>/promote_to_fleet_admin/', UserViewSet.as_view({'post': 'promote_to_fleet_admin'}), name='promote-to-fleet-admin'),
]