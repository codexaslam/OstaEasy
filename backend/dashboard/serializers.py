from rest_framework import serializers
from .models import Item, CartItem
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class ItemSerializer(serializers.ModelSerializer):
    seller = UserSerializer(read_only=True)
    buyer = UserSerializer(read_only=True)
    
    class Meta:
        model = Item
        fields = ['id', 'title', 'description', 'price', 'seller', 'buyer', 'status', 'date_added', 'date_sold']
        read_only_fields = ['seller', 'buyer', 'date_added', 'date_sold']


class ItemCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['title', 'description', 'price']


class CartItemSerializer(serializers.ModelSerializer):
    item = ItemSerializer(read_only=True)
    
    class Meta:
        model = CartItem
        fields = ['id', 'item', 'date_added']
