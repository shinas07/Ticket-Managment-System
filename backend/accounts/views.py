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
from .serializers import UserSerializer,BlockUserSerializer,UserCreatingSerializer,UserProfileSerializer
from .models import User
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.permissions import IsAdminUser



User = get_user_model()

# Create your views here.

class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        user_type = request.data.get('user_type')  # Make sure this matches frontend

        try:
            serializer = LoginSerializer(
                data=request.data,
                context={'request': request}
            )
            
            if not serializer.is_valid():
                print("Validation errors:", serializer.errors)
                return Response(
                    {'errors': serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user = serializer.validated_data['user']
           
            # Convert roles to lowercase for comparison
            user_role = user.role.lower() if user.role else ''
            requested_type = user_type.lower() if user_type else ''

            # Check user type with proper role mapping
            if user_role != requested_type:
                return Response({
                    'error': f'Invalid user type. You are not authorized as {user_type}'
                }, status=status.HTTP_403_FORBIDDEN)

            if user.is_blocked:
                return Response(
                    {'error': 'You are blocked from logging in.'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            refresh = RefreshToken.for_user(user)
            
            response_data = {
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'role': user.role,  # Keep original role case
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

class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


# Adminstrations User management

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
            return Response(
                {'error': 'Refresh token not provided'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
            
        try:
            # Verify and create new tokens
            token = RefreshToken(refresh_token)
            data = {
                'access': str(token.access_token),
                'refresh': str(token)  # Include new refresh token
            }
            
            return Response(data, status=status.HTTP_200_OK)
            
        except TokenError as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            return Response(
                {'error': 'Invalid refresh token'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

        

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                # Get token object from refresh token
                token = RefreshToken(refresh_token)
                # Add refresh token to blacklist
                token.blacklist()
                
                return Response({
                    'message': 'Successfully logged out'
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'Refresh token is required'
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)