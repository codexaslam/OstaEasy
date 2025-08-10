#!/usr/bin/env python3
import requests
import json

# API base URL
BASE_URL = "http://localhost:8000"

def test_my_items_api():
    """Test the my-items API endpoint"""
    
    # Use demo user credentials
    login_data = {
        "username": "testuser1",
        "password": "pass1"
    }
    
    login_response = requests.post(f"{BASE_URL}/api/users/token", json=login_data)
    
    if login_response.status_code != 200:
        print(f"Login failed: {login_response.status_code}")
        print(login_response.text)
        return
    
    # Get the token
    token_data = login_response.json()
    token = token_data.get('access')
    
    if not token:
        print("No access token received")
        return
    
    print(f"Login successful, token: {token[:20]}...")
    
    # Test the my-items endpoint
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    my_items_response = requests.get(f"{BASE_URL}/api/shop/my-items/", headers=headers)
    
    print(f"My Items API status: {my_items_response.status_code}")
    
    if my_items_response.status_code == 200:
        data = my_items_response.json()
        print("My Items API Response:")
        print(json.dumps(data, indent=2))
    else:
        print(f"Error response: {my_items_response.text}")

if __name__ == "__main__":
    test_my_items_api()
