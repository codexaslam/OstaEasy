#!/usr/bin/env python
import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

import requests
import json

def test_populate_endpoint():
    print("Testing populate database endpoint...")
    
    try:
        # First check current database state
        from shop.models import Item
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        print(f"Before: Users={User.objects.count()}, Items={Item.objects.count()}")
        
        # Call the populate endpoint
        response = requests.post('http://localhost:8000/api/dashboard/populate-database/', 
                               headers={'Content-Type': 'application/json'})
        
        print(f"Response Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {data}")
        else:
            print(f"Error Response: {response.text}")
        
        # Check database state after
        print(f"After: Users={User.objects.count()}, Items={Item.objects.count()}")
        
        # Check categories
        if Item.objects.count() > 0:
            categories = Item.objects.values_list('category', flat=True).distinct()
            print(f'Categories: {list(categories)}')
            for category in categories:
                count = Item.objects.filter(category=category).count()
                print(f'  {category}: {count} items')
                
                # Show a sample item from each category
                sample_item = Item.objects.filter(category=category).first()
                if sample_item:
                    print(f'    Sample: {sample_item.title} - ${sample_item.price}')
        
    except Exception as e:
        print(f'Error: {e}')
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_populate_endpoint()
