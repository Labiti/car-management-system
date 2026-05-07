from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from .utils import send_welcome_email

from .models import User
from .serializers import (
    UserSerializer, UserDetailSerializer, RegisterSerializer,
    ChangePasswordSerializer, UpdateProfileSerializer
)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['username', 'email', 'first_name', 'last_name', 'employee_id']
    filterset_fields = ['role', 'is_active', 'department']
    ordering_fields = ['username', 'date_joined', 'role']
    
    def get_permissions(self):
        if self.action in ['register', 'login']:
            return [AllowAny()]
        elif self.action in ['list', 'update_role', 'toggle_active', 'delete_user', 
                              'promote_to_manager', 'promote_to_fleet_admin', 'user_stats',
                              'employees', 'managers', 'approve']:
            # Only admins can perform these actions
            return [IsAuthenticated()]
        return super().get_permissions()
    
    def get_serializer_class(self):
        if self.action == 'register':
            return RegisterSerializer
        elif self.action == 'me':
            return UserDetailSerializer
        return UserSerializer
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        """Register a new user"""
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)

            # Send welcome email - Wrap in try-except to prevent 500 errors
            try:
                send_welcome_email(user)
                print(f"Welcome email sent to {user.email}")
            except Exception as email_error:
                # Catch ANY email error so registration still succeeds
                print(f"Email sending failed (non-critical error): {str(email_error)}")
                # Don't fail the registration just because email failed
            
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'message': 'Registration successful!'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def login(self, request):
        """Login user and return JWT tokens"""
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'error': 'Please provide both username and password'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(username=username, password=password)
        
        if user:
            if not user.is_active:
                return Response(
                    {'error': 'Account is disabled'}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'message': 'Login successful!'
            })
        return Response(
            {'error': 'Invalid credentials'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    @action(detail=False, methods=['get', 'put'])
    def me(self, request):
        """Get or update current user profile"""
        user = request.user
        if request.method == 'GET':
            serializer = UserDetailSerializer(user)
            return Response(serializer.data)
        elif request.method == 'PUT':
            serializer = UpdateProfileSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def change_password(self, request):
        """Change user password"""
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if not user.check_password(serializer.validated_data['old_password']):
                return Response({'old_password': 'Wrong password.'}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({'message': 'Password changed successfully!'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # ========== ADMIN USER MANAGEMENT ACTIONS ==========
    
    @action(detail=True, methods=['patch'])
    def update_role(self, request, pk=None):
        """Update user role (Admin only)"""
        if request.user.role not in ['super_admin', 'fleet_admin']:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        user = self.get_object()
        new_role = request.data.get('role')
        
        if new_role not in dict(User.ROLE_CHOICES):
            return Response({'error': 'Invalid role'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Prevent demoting self
        if user.id == request.user.id and new_role != user.role:
            return Response({'error': 'You cannot change your own role'}, status=status.HTTP_403_FORBIDDEN)
        
        user.role = new_role
        user.save()
        return Response({
            'message': f'User {user.username} role updated to {new_role}',
            'user': UserSerializer(user).data
        })
    
    @action(detail=True, methods=['patch'])
    def toggle_active(self, request, pk=None):
        """Activate/Deactivate user (Admin only)"""
        if request.user.role not in ['super_admin', 'fleet_admin']:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        user = self.get_object()
        
        # Prevent deactivating self
        if user.id == request.user.id:
            return Response({'error': 'You cannot deactivate your own account'}, status=status.HTTP_403_FORBIDDEN)
        
        user.is_active = not user.is_active
        user.save()
        
        status_text = 'activated' if user.is_active else 'deactivated'
        return Response({
            'message': f'User {user.username} has been {status_text}',
            'is_active': user.is_active
        })
    
    @action(detail=True, methods=['delete'])
    def delete_user(self, request, pk=None):
        """Delete user (Super Admin only)"""
        if request.user.role != 'super_admin':
            return Response({'error': 'Permission denied. Only Super Admin can delete users.'}, status=status.HTTP_403_FORBIDDEN)
        
        user = self.get_object()
        
        # Prevent deleting self
        if user.id == request.user.id:
            return Response({'error': 'You cannot delete your own account'}, status=status.HTTP_403_FORBIDDEN)
        
        username = user.username
        user.delete()
        return Response({'message': f'User {username} has been deleted successfully'})
    
    @action(detail=True, methods=['post'])
    def reset_password(self, request, pk=None):
        """Reset user password (Admin only)"""
        if request.user.role not in ['super_admin', 'fleet_admin']:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        user = self.get_object()
        new_password = request.data.get('new_password', 'TempPass123!')
        user.set_password(new_password)
        user.save()
        
        return Response({
            'message': f'Password reset for {user.username}',
            'new_password': new_password
        })
    
    @action(detail=True, methods=['post'])
    def promote_to_manager(self, request, pk=None):
        """Promote user to Manager (Admin only)"""
        if request.user.role not in ['super_admin', 'fleet_admin']:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        user = self.get_object()
        user.role = 'manager'
        user.save()
        return Response({
            'message': f'User {user.username} promoted to Manager',
            'user': UserSerializer(user).data
        })
    
    @action(detail=True, methods=['post'])
    def promote_to_fleet_admin(self, request, pk=None):
        """Promote user to Fleet Admin (Super Admin only)"""
        if request.user.role != 'super_admin':
            return Response({'error': 'Permission denied. Only Super Admin can promote to Fleet Admin.'}, status=status.HTTP_403_FORBIDDEN)
        
        user = self.get_object()
        user.role = 'fleet_admin'
        user.is_staff = True
        user.save()
        return Response({
            'message': f'User {user.username} promoted to Fleet Admin',
            'user': UserSerializer(user).data
        })
    
    @action(detail=False, methods=['get'])
    def user_stats(self, request):
        """Get user statistics (Admin only)"""
        if request.user.role not in ['super_admin', 'fleet_admin']:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        stats = {
            'total_users': User.objects.count(),
            'active_users': User.objects.filter(is_active=True).count(),
            'inactive_users': User.objects.filter(is_active=False).count(),
            'by_role': {
                'super_admin': User.objects.filter(role='super_admin').count(),
                'fleet_admin': User.objects.filter(role='fleet_admin').count(),
                'manager': User.objects.filter(role='manager').count(),
                'employee': User.objects.filter(role='employee').count(),
            }
        }
        return Response(stats)
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve user (Manager/Admin only)"""
        if request.user.role not in ['manager', 'fleet_admin', 'super_admin']:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        user = self.get_object()
        user.is_approved = True
        user.save()
        return Response({'message': f'User {user.username} approved successfully!'})
    
    @action(detail=False, methods=['get'])
    def employees(self, request):
        """Get all employees"""
        if request.user.role not in ['manager', 'fleet_admin', 'super_admin']:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        employees = User.objects.filter(role='employee')
        serializer = UserSerializer(employees, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def managers(self, request):
        """Get all managers"""
        if request.user.role not in ['fleet_admin', 'super_admin']:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        managers = User.objects.filter(role__in=['manager', 'fleet_admin'])
        serializer = UserSerializer(managers, many=True)
        return Response(serializer.data)