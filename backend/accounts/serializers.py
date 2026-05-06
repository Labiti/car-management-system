from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.validators import validate_email
from .models import User

class UserSerializer(serializers.ModelSerializer):
    """Basic user serializer for list views"""
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 
                 'role', 'department', 'employee_id', 'phone_number', 
                 'driver_license', 'is_active', 'date_joined', 'is_approved')
        read_only_fields = ('id', 'date_joined', 'last_login')

class UserDetailSerializer(serializers.ModelSerializer):
    """Detailed user serializer for profile views"""
    full_name = serializers.SerializerMethodField()
    role_display = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'full_name',
                 'role', 'role_display', 'department', 'employee_id', 'phone_number', 
                 'driver_license', 'address', 'emergency_contact', 'emergency_phone', 
                 'is_active', 'is_approved', 'date_joined', 'created_at', 'updated_at')
    
    def get_full_name(self, obj):
        return obj.get_full_name()
    
    def get_role_display(self, obj):
        return obj.get_role_display()

class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration with all required fields"""
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name', 
                 'role', 'employee_id', 'phone_number', 'driver_license')
        extra_kwargs = {
            'first_name': {'required': False, 'allow_blank': True},
            'last_name': {'required': False, 'allow_blank': True},
            'role': {'required': False},
            'employee_id': {'required': True},
            'phone_number': {'required': True},
            'driver_license': {'required': True},
        }
    
    def validate(self, attrs):
        """Validate registration data"""
        # Check if passwords match
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        # Check if username already exists
        if User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({"username": "Username already exists."})
        
        # Check if email already exists
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "Email already exists."})
        
        # Check if employee_id already exists
        if 'employee_id' in attrs and attrs['employee_id']:
            if User.objects.filter(employee_id=attrs['employee_id']).exists():
                raise serializers.ValidationError({"employee_id": "Employee ID already exists."})
        
        # Validate email format
        try:
            validate_email(attrs['email'])
        except:
            raise serializers.ValidationError({"email": "Enter a valid email address."})
        
        # Validate phone number (basic validation)
        if 'phone_number' in attrs and attrs['phone_number']:
            phone = attrs['phone_number']
            if len(phone) < 10:
                raise serializers.ValidationError({"phone_number": "Enter a valid phone number."})
        
        # Validate driver license
        if 'driver_license' in attrs and attrs['driver_license']:
            license = attrs['driver_license']
            if len(license) < 5:
                raise serializers.ValidationError({"driver_license": "Enter a valid driver license number."})
        
        return attrs
    
    def create(self, validated_data):
        """Create and return a new user"""
        # Remove password2 from validated_data
        validated_data.pop('password2')
        
        # Set default role if not provided
        if 'role' not in validated_data or not validated_data['role']:
            validated_data['role'] = 'employee'
        
        # Create user
        user = User.objects.create_user(**validated_data)
        return user

class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for password change"""
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    confirm_password = serializers.CharField(required=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords don't match."})
        return attrs

class UpdateProfileSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile"""
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'phone_number', 
                 'address', 'department', 'driver_license', 'emergency_contact', 'emergency_phone')
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exclude(id=self.instance.id).exists():
            raise serializers.ValidationError("Email already exists.")
        return value
    
    def validate_phone_number(self, value):
        if value and len(value) < 10:
            raise serializers.ValidationError("Enter a valid phone number.")
        return value

class AdminUserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for admin to update user role and status"""
    class Meta:
        model = User
        fields = ('role', 'department', 'employee_id', 'is_active', 'is_approved')
    
    def validate_role(self, value):
        valid_roles = ['employee', 'manager', 'fleet_admin', 'super_admin']
        if value not in valid_roles:
            raise serializers.ValidationError(f"Role must be one of: {', '.join(valid_roles)}")
        return value