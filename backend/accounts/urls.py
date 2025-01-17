from django.urls import path
from .views import LoginView, UserListView,UserCreateView,BlockUserView,RefreshTokenView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('users/create/',UserCreateView.as_view(),name='user-create'),
    path('users/list/', UserListView.as_view(), name='user-list'),
    path('users/<int:user_id>/block/', BlockUserView.as_view(), name='block-user'),
    path('refresh/', RefreshTokenView.as_view(), name='token_refresh'), 
]
