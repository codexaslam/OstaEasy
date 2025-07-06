from django.urls import path
from . import views

urlpatterns = [
    path('', views.landing_page, name='landing'),
    path('api/populate/', views.populate_database, name='populate_database'),
]
