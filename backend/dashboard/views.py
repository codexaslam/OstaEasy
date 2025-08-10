from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.db.models import Count, Sum, Avg, Q
from datetime import datetime, timedelta
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db import transaction
from shop.models import Item, CartItem, Purchase

User = get_user_model()


def landing_page(request):
    """Landing page that serves HTML"""
    return render(request, 'dashboard/landing.html')


@api_view(['POST'])
@permission_classes([AllowAny])
def populate_database(request):
    """Populate database with test data"""
    try:
        import random
        from decimal import Decimal
        
        # Check if we have required imports
        from shop.models import Item, CartItem, Purchase
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        with transaction.atomic():
            # Clear ALL existing data thoroughly
            # Clear all test users and their related data
            test_users = User.objects.filter(username__startswith='testuser')
            test_user_count = test_users.count()
            test_users.delete()
            
            # Clear all items and their related data
            item_count = Item.objects.count()
            Item.objects.all().delete()
            
            # Clear all cart items
            cart_count = CartItem.objects.count()
            CartItem.objects.all().delete()
            
            # Clear all purchases
            purchase_count = Purchase.objects.count()
            Purchase.objects.all().delete()
            
            # Create 6 fresh test users
            users = []
            for i in range(1, 7):
                user = User.objects.create_user(
                    username=f'testuser{i}',
                    password=f'pass{i}',
                    email=f'testuser{i}@shop.aa'
                )
                users.append(user)
            
            # Simplified demo item categories and data - reduced for performance
            categories = {
                'clothing': {
                    'items': [
                        'Vintage Band T-Shirt', 'Levi\'s 501 Jeans', 'Champion Hoodie', 'North Face Jacket',
                        'Patagonia Fleece', 'Cashmere Sweater', 'Blazer', 'Summer Dress',
                        'Silk Blouse', 'Wool Coat', 'Denim Jacket', 'Polo Shirt'
                    ],
                    'price_range': (15, 200),
                    'descriptions': [
                        'Comfortable and versatile for everyday wear',
                        'Premium quality fabric with perfect fit',
                        'Trendy design that never goes out of style'
                    ]
                },
                'accessories': {
                    'items': [
                        'Apple Watch', 'Fossil Watch', 'Gold Chain Necklace', 'Silver Bracelet',
                        'Diamond Stud Earrings', 'Leather Belt', 'Silk Scarf', 'Baseball Cap'
                    ],
                    'price_range': (10, 300),
                    'descriptions': [
                        'Elegant accessory to complete your look',
                        'High-quality materials and craftsmanship',
                        'Perfect for special occasions or daily wear'
                    ]
                },
                'bags': {
                    'items': [
                        'Tote Bag', 'Crossbody Bag', 'Backpack', 'Clutch', 'Messenger Bag',
                        'Handbag', 'Shoulder Bag', 'Duffle Bag'
                    ],
                    'price_range': (25, 400),
                    'descriptions': [
                        'Spacious and practical for everyday use',
                        'Premium leather with elegant design',
                        'Durable construction for long-lasting use'
                    ]
                },
                'shoes': {
                    'items': [
                        'Running Shoes', 'Sneakers', 'Boots', 'Sandals', 'Loafers',
                        'High Heels', 'Ballet Flats', 'Ankle Boots'
                    ],
                    'price_range': (30, 250),
                    'descriptions': [
                        'Comfortable footwear for all-day wear',
                        'Premium materials with excellent support',
                        'Stylish design suitable for any occasion'
                    ]
                },
                'sunglasses': {
                    'items': [
                        'Aviator Sunglasses', 'Wayfarer Sunglasses', 'Cat Eye Sunglasses', 'Round Sunglasses',
                        'Sport Sunglasses', 'Oversized Sunglasses'
                    ],
                    'price_range': (20, 150),
                    'descriptions': [
                        '100% UV protection with premium lenses',
                        'Designer frames with superior comfort',
                        'Perfect for driving and outdoor activities'
                    ]
                }
            }
            
            # Create 50 items for each category (250 total items) using bulk_create for performance
            items_to_create = []
            items_created = 0
            
            for category_key, category_data in categories.items():
                for i in range(50):  # Reduced from 200 to 50 items per category
                    try:
                        # Randomly select an item from the category
                        base_item = random.choice(category_data['items'])
                        
                        # Create simple title with variation
                        title = f"{base_item} #{i + 1}"
                        
                        # Create simple description
                        description = random.choice(category_data['descriptions'])
                        condition_notes = [
                            'Excellent condition, barely used.',
                            'Very good condition with minimal wear.',
                            'Good condition, shows light use.',
                            'Brand new with tags.'
                        ]
                        description += f" {random.choice(condition_notes)}"
                        
                        # Generate random price within category range
                        min_price, max_price = category_data['price_range']
                        price = round(random.uniform(min_price, max_price), 2)
                        
                        # Randomly assign to one of the users (sellers)
                        seller = random.choice(users)
                        
                        # Simple image URL
                        image_url = f"https://picsum.photos/400/300?random={2000 + items_created}"
                        
                        # Create the item object (don't save yet)
                        item = Item(
                            title=title,
                            description=description,
                            price=Decimal(str(price)),
                            category=category_key,
                            seller=seller,
                            image_url=image_url
                        )
                        items_to_create.append(item)
                        items_created += 1
                        
                    except Exception as item_error:
                        continue
                
                # Bulk create items for this category
                if items_to_create:
                    Item.objects.bulk_create(items_to_create, batch_size=100)
                    items_to_create = []  # Reset for next category
            
            # Create any remaining items
            if items_to_create:
                Item.objects.bulk_create(items_to_create, batch_size=100)
        
        # Create response message
        success_message = f'🎉 Database populated successfully! Created 6 users and {items_created} items'
            
        response_data = {
            'message': success_message,
            'users_created': 6,
            'items_created': items_created,
            'categories': list(categories.keys()),
            'items_per_category': 50,
            'optimizations': [
                'Used bulk_create for better performance',
                'Reduced item count for faster processing',
                'Transaction-wrapped for data consistency',
                'Simplified data generation'
            ]
        }
        
        return Response(response_data)
        
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def populate_sample_data(request):
    """Populate database with minimal sample data for quick testing"""
    try:
        import random
        from decimal import Decimal
        
        # Check if we have required imports
        from shop.models import Item, CartItem, Purchase
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        with transaction.atomic():
            # Clear test data only
            test_users = User.objects.filter(username__startswith='testuser')
            test_users.delete()
            
            # Create 3 test users
            users = []
            for i in range(1, 4):
                user = User.objects.create_user(
                    username=f'testuser{i}',
                    password=f'pass{i}',
                    email=f'testuser{i}@shop.aa'
                )
                users.append(user)
            
            # Simple items data
            sample_items = [
                {'title': 'Vintage T-Shirt', 'price': 25.99, 'category': 'clothing'},
                {'title': 'Running Shoes', 'price': 89.99, 'category': 'shoes'},
                {'title': 'Leather Backpack', 'price': 149.99, 'category': 'bags'},
                {'title': 'Gold Watch', 'price': 299.99, 'category': 'accessories'},
                {'title': 'Aviator Sunglasses', 'price': 79.99, 'category': 'sunglasses'},
                {'title': 'Blue Jeans', 'price': 59.99, 'category': 'clothing'},
                {'title': 'Canvas Sneakers', 'price': 49.99, 'category': 'shoes'},
                {'title': 'Messenger Bag', 'price': 89.99, 'category': 'bags'},
                {'title': 'Silver Bracelet', 'price': 39.99, 'category': 'accessories'},
                {'title': 'Round Sunglasses', 'price': 69.99, 'category': 'sunglasses'},
            ]
            
            # Create items using bulk_create
            items_to_create = []
            for i, item_data in enumerate(sample_items):
                item = Item(
                    title=item_data['title'],
                    description=f"High quality {item_data['title'].lower()} in excellent condition.",
                    price=Decimal(str(item_data['price'])),
                    category=item_data['category'],
                    seller=random.choice(users),
                    image_url=f"https://picsum.photos/400/300?random={3000 + i}"
                )
                items_to_create.append(item)
            
            Item.objects.bulk_create(items_to_create)
        
        return Response({
            'message': 'Sample data created successfully!',
            'users_created': 3,
            'items_created': len(sample_items),
            'note': 'This is minimal test data for quick setup'
        })
        
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analytics_overview(request):
    """Get overall analytics data for the dashboard"""
    try:
        # Total counts
        total_items = Item.objects.count()
        total_users = User.objects.count()
        total_purchases = Purchase.objects.count()
        active_listings = Item.objects.filter(buyer__isnull=True).count()
        
        # Revenue data
        total_revenue = Purchase.objects.aggregate(
            total=Sum('price')
        )['total'] or 0
        
        # Recent activity (last 30 days)
        thirty_days_ago = timezone.now() - timedelta(days=30)
        recent_users = User.objects.filter(date_joined__gte=thirty_days_ago).count()
        recent_purchases = Purchase.objects.filter(purchase_date__gte=thirty_days_ago).count()
        recent_listings = Item.objects.filter(date_added__gte=thirty_days_ago).count()
        
        # Category breakdown
        category_stats = Item.objects.values('category').annotate(
            count=Count('id'),
            sold=Count('id', filter=Q(buyer__isnull=False))
        ).order_by('-count')
        
        # Top sellers
        top_sellers = User.objects.annotate(
            items_sold=Count('item_seller', filter=Q(item_seller__buyer__isnull=False)),
            revenue=Sum('item_seller__purchase__price')
        ).filter(items_sold__gt=0).order_by('-revenue')[:5]
        
        return Response({
            'overview': {
                'total_items': total_items,
                'total_users': total_users,
                'total_purchases': total_purchases,
                'active_listings': active_listings,
                'total_revenue': float(total_revenue),
                'recent_users': recent_users,
                'recent_purchases': recent_purchases,
                'recent_listings': recent_listings
            },
            'categories': list(category_stats),
            'top_sellers': [
                {
                    'username': seller.username,
                    'items_sold': seller.items_sold,
                    'revenue': float(seller.revenue or 0)
                }
                for seller in top_sellers
            ]
        })
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def sales_analytics(request):
    """Get sales analytics for charts and graphs"""
    try:
        # Sales over time (last 30 days)
        thirty_days_ago = timezone.now() - timedelta(days=30)
        daily_sales = []
        
        for i in range(30):
            date = thirty_days_ago + timedelta(days=i)
            sales_count = Purchase.objects.filter(
                purchase_date__date=date.date()
            ).count()
            revenue = Purchase.objects.filter(
                purchase_date__date=date.date()
            ).aggregate(total=Sum('price'))['total'] or 0
            
            daily_sales.append({
                'date': date.strftime('%Y-%m-%d'),
                'sales': sales_count,
                'revenue': float(revenue)
            })
        
        # Price range distribution
        price_ranges = [
            {'label': '$0-$50', 'min': 0, 'max': 50},
            {'label': '$50-$100', 'min': 50, 'max': 100},
            {'label': '$100-$250', 'min': 100, 'max': 250},
            {'label': '$250-$500', 'min': 250, 'max': 500},
            {'label': '$500+', 'min': 500, 'max': None}
        ]
        
        price_distribution = []
        for range_data in price_ranges:
            if range_data['max']:
                count = Item.objects.filter(
                    price__gte=range_data['min'],
                    price__lt=range_data['max']
                ).count()
            else:
                count = Item.objects.filter(price__gte=range_data['min']).count()
            
            price_distribution.append({
                'label': range_data['label'],
                'count': count
            })
        
        return Response({
            'daily_sales': daily_sales,
            'price_distribution': price_distribution
        })
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_analytics(request):
    """Get user analytics and activity data"""
    try:
        # User registration over time (last 30 days)
        thirty_days_ago = timezone.now() - timedelta(days=30)
        daily_registrations = []
        
        for i in range(30):
            date = thirty_days_ago + timedelta(days=i)
            count = User.objects.filter(date_joined__date=date.date()).count()
            daily_registrations.append({
                'date': date.strftime('%Y-%m-%d'),
                'registrations': count
            })
        
        # User activity breakdown
        total_users = User.objects.count()
        users_with_items = User.objects.filter(item_seller__isnull=False).distinct().count()
        users_with_purchases = User.objects.filter(purchase_buyer__isnull=False).distinct().count()
        
        # Most active users
        active_users = User.objects.annotate(
            total_activity=Count('item_seller') + Count('purchase_buyer')
        ).filter(total_activity__gt=0).order_by('-total_activity')[:10]
        
        return Response({
            'daily_registrations': daily_registrations,
            'user_stats': {
                'total_users': total_users,
                'users_with_items': users_with_items,
                'users_with_purchases': users_with_purchases,
                'inactive_users': total_users - users_with_items - users_with_purchases
            },
            'active_users': [
                {
                    'username': user.username,
                    'activity_score': user.total_activity,
                    'date_joined': user.date_joined.strftime('%Y-%m-%d')
                }
                for user in active_users
            ]
        })
    except Exception as e:
        return Response({'error': str(e)}, status=500)
