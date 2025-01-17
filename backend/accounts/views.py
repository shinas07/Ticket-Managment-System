from django.shortcuts import render
from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import LoginSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework import generics, permissions
from .serializers import UserSerializer,BlockUserSerializer,UserCreatingSerializer
from .models import User

User = get_user_model()

# Create your views here.

class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        # Print received data for debugging
        print("Received login data:", request.data)
        

        try:
            # Initialize serializer with request context
            serializer = LoginSerializer(
                data=request.data,
                context={'request': request}
            )
            
            # Validate the data
            if not serializer.is_valid():
                print("Validation errors:", serializer.errors)
                return Response(
                    {'errors': serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Get the authenticated user
            user = serializer.validated_data['user']

                 # Check if the user is blocked
            if user.is_blocked:
                return Response(
                    {'error': 'You are blocked from logging in.'},
                    status=status.HTTP_403_FORBIDDEN  # Forbidden status
                )
            
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            
            # Prepare response data
            response_data = {
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'role': user.role,
                    'is_superuser': user.is_superuser,
                    'is_staff': user.is_staff
                },
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh)
                }
            }
            
            print("Login successful for user:", user.email)
            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            print("Login error:", str(e))
            return Response(
                {'error': 'Login failed', 'detail': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


# Adminstrations User management
from rest_framework.permissions import IsAdminUser


class UserCreateView(generics.CreateAPIView):
    serializer_class = UserCreatingSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            try:
                user = serializer.save()
                response_data = {
                    'message': 'User created successfully',
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'role': user.role,
                        'is_active': user.is_active
                    }
                }
                return Response(response_data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(
            {'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

class UserListView(generics.ListAPIView):
    queryset = User.objects.filter(is_blocked=False,is_active=True,is_superuser=False)
    serializer_class = UserSerializer
    # permission_classes = [permissions.isAuthenticated]


class BlockUserView(APIView):
    permission_classes = [IsAuthenticated,IsAdminUser]  # Only allow admin users to block users

    def post(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = BlockUserSerializer(user, data={'is_blocked': True}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'detail': 'User blocked successfully.'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class RefreshTokenView(APIView):
    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            print('not refresh token')
            return Response({'error': 'Refresh token not found'}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            return Response({'access': access_token}, status=status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            return Response({'error': 'Invalid refresh token'}, status=status.HTTP_401_UNAUTHORIZED)