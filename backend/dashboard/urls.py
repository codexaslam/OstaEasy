from django.urls import path
from . import views

urlpatterns = [
    path('', views.landing_page, name='landing'),
    path('api/populate/', views.populate_database, name='populate_database'),
    path('api/analytics/overview/', views.analytics_overview, name='analytics_overview'),
    path('api/analytics/sales/', views.sales_analytics, name='sales_analytics'),
    path('api/analytics/users/', views.user_analytics, name='user_analytics'),
]
