from . import views
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import UserSignupView, UserProfileView, ChangePasswordView

urlpatterns = [
    # JWT authentication
    path('', views.home, name='home'),
    path('token', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User endpoints
    path('signup', UserSignupView.as_view(), name='signup'),
    path('profile', UserProfileView.as_view(), name='profile'),
    path('change-password', ChangePasswordView.as_view(), name='change_password'),
]