#!/usr/bin/env python
import os
import sys
import django

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from shop.models import Item

User = get_user_model()

print('=== Database State ===')
print(f'Total users: {User.objects.count()}')
print(f'Total items: {Item.objects.count()}')

print('\n=== First 5 Users ===')
for user in User.objects.all()[:5]:
    print(f'User: {user.username} (ID: {user.id})')

print('\n=== Category Distribution ===')
from django.db.models import Count
category_counts = Item.objects.values('category').annotate(count=Count('category'))
for cat in category_counts:
    print(f"{cat['category']}: {cat['count']} items")

print('\n=== Recent Items ===')
for item in Item.objects.all()[:5]:
    print(f'Item: {item.title[:50]}... (Category: {item.category}, Seller: {item.seller.username})')
