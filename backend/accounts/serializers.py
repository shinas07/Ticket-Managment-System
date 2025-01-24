from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model
from .models import User
from django.core.exceptions import ValidationError
from django.core.validators import validate_email

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'role','is_active')

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'email', 'role', 'is_staff', 'is_active']
        read_only_fields = ['email', 'role', 'is_staff', 'is_active']

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            # Normalize email to lowercase
            email = email.lower().strip()
            
            try:
                # Check if user exists and is active
                user = User.objects.get(email=email)
                if not user.is_active:
                    raise serializers.ValidationError('User account is disabled')
                
                # Check if user is blocked
                if hasattr(user, 'is_blocked') and user.is_blocked:
                    raise serializers.ValidationError('Your account has been blocked')
                
                # Try to authenticate
                authenticated_user = authenticate(
                    request=self.context.get('request'),
                    email=email,
                    password=password
                )
                
                if not authenticated_user:
                    raise serializers.ValidationError('Invalid email or password')
                
                attrs['user'] = authenticated_user
                return attrs
                
            except User.DoesNotExist:
                # Use a generic error message for security
                raise serializers.ValidationError('Invalid email or password')
                
        raise serializers.ValidationError('Must include "email" and "password"')
        
class UserCreatingSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'confirm_password', 'role']
        extra_kwargs = {
            'password': {'write_only': True},
            'role': {'required': True}
        }

    def validate_email(self, value):
        email = value.lower().strip()
        try:
            validate_email(email)
        except ValidationError:
            raise serializers.ValidationError("Enter a valid email address.")

        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return email

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        
        if not any(char.isupper() for char in value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter.")
            
        if not any(char.islower() for char in value):
            raise serializers.ValidationError("Password must contain at least one lowercase letter.")
            
        if not any(char.isdigit() for char in value):
            raise serializers.ValidationError("Password must contain at least one number.")
        
        return value

    def validate(self, data):
        if data.get('password') != data.get('confirm_password'):
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        
        # Validate role
        valid_roles = dict(User.role.field.choices)
        if data.get('role') not in valid_roles:
            raise serializers.ValidationError({"role": f"Role must be one of: {', '.join(valid_roles.keys())}"})
            
        return data

    def create(self, validated_data):
        # Remove confirm_password from validated_data
        validated_data.pop('confirm_password', None)
        
        try:
            # Use the custom manager to create the user
            user = User.objects.create_user(
                email=validated_data['email'],
                password=validated_data['password']
            )
            
            # Set additional fields
            user.role = validated_data.get('role', 'user')
            
            # Set permissions based on role
            if user.role == 'admin':
                user.is_staff = True
                user.is_superuser = True
            
            user.save()
            return user
            
        except Exception as e:
            raise serializers.ValidationError(f"Error creating user: {str(e)}")
    
# Admin User Block Serializer
class BlockUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['is_blocked']

    def update(self, instance, validated_data):
        instance.is_blocked = True
        instance.save()
        return instance