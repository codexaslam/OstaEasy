#!/usr/bin/env python
import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from dashboard.views import populate_database
from rest_framework.test import APIRequestFactory

def test_populate():
    factory = APIRequestFactory()
    request = factory.post('/api/dashboard/populate-database/')

    try:
        response = populate_database(request)
        print('Response status:', response.status_code)
        print('Response data:', response.data)
        
        # Check actual database state
        from shop.models import Item
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        users_count = User.objects.count()
        items_count = Item.objects.count()
        print(f'Users in DB: {users_count}')
        print(f'Items in DB: {items_count}')
        
        if items_count > 0:
            categories = Item.objects.values_list('category', flat=True).distinct()
            print(f'Categories: {list(categories)}')
            for category in categories:
                count = Item.objects.filter(category=category).count()
                print(f'  {category}: {count} items')
        
    except Exception as e:
        print('Exception occurred:', e)
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_populate()
