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
        
        # Clear existing data
        User.objects.filter(username__startswith='testuser').delete()
        Item.objects.all().delete()
        CartItem.objects.all().delete()
        
        # Create 6 test users
        users = []
        for i in range(1, 7):
            user = User.objects.create_user(
                username=f'testuser{i}',
                password=f'pass{i}',
                email=f'testuser{i}@shop.aa'
            )
            users.append(user)
        
        # Demo item categories and data
        categories = {
            'Electronics': {
                'items': [
                    'iPhone 15 Pro', 'Samsung Galaxy S24', 'MacBook Pro M3', 'Dell XPS 13', 
                    'iPad Air', 'Apple Watch Series 9', 'AirPods Pro', 'Sony WH-1000XM5',
                    'Nintendo Switch', 'PlayStation 5', 'Xbox Series X', 'Steam Deck',
                    'GoPro Hero 12', 'Canon EOS R5', 'Sony A7 IV', 'DJI Air 3'
                ],
                'price_range': (50, 3000),
                'descriptions': [
                    'Latest technology with premium features',
                    'Brand new, factory sealed with warranty',
                    'Perfect condition, barely used',
                    'High-end specifications for professionals',
                    'Great for gaming and entertainment'
                ]
            },
            'Clothing': {
                'items': [
                    'Nike Air Jordan 1', 'Adidas Ultra Boost', 'Levi\'s 501 Jeans', 'Champion Hoodie',
                    'North Face Jacket', 'Patagonia Fleece', 'Ray-Ban Sunglasses', 'Rolex Submariner',
                    'Gucci Belt', 'Louis Vuitton Bag', 'Vintage Band T-Shirt', 'Converse All Stars'
                ],
                'price_range': (15, 500),
                'descriptions': [
                    'Designer quality with authentic materials',
                    'Comfortable fit, perfect for daily wear',
                    'Trendy style that never goes out of fashion',
                    'Premium brand with excellent craftsmanship',
                    'Limited edition, collector\'s item'
                ]
            },
            'Home & Garden': {
                'items': [
                    'KitchenAid Stand Mixer', 'Dyson V15 Vacuum', 'Instant Pot Duo', 'Ninja Blender',
                    'Weber Gas Grill', 'Outdoor Patio Set', 'Garden Tool Set', 'Smart Thermostat',
                    'LED Floor Lamp', 'Memory Foam Mattress', 'Coffee Table', 'Bookshelf'
                ],
                'price_range': (25, 800),
                'descriptions': [
                    'Essential for modern home living',
                    'Durable construction, built to last',
                    'Stylish design that complements any decor',
                    'Energy efficient and eco-friendly',
                    'Perfect for upgrading your living space'
                ]
            },
            'Sports & Outdoors': {
                'items': [
                    'Mountain Bike', 'Yoga Mat', 'Dumbbells Set', 'Treadmill', 'Camping Tent',
                    'Hiking Backpack', 'Fishing Rod', 'Golf Clubs Set', 'Soccer Ball',
                    'Basketball Hoop', 'Skateboard', 'Surfboard'
                ],
                'price_range': (20, 1200),
                'descriptions': [
                    'Professional grade equipment for serious athletes',
                    'Perfect for outdoor adventures and fitness',
                    'High-quality materials for durability',
                    'Great for beginners and experienced users',
                    'Excellent condition, ready for action'
                ]
            },
            'Books & Media': {
                'items': [
                    'The Great Gatsby', 'To Kill a Mockingbird', 'Harry Potter Collection',
                    'Vinyl Records Collection', 'Marvel Comics Set', 'Cooking Masterclass',
                    'Photography Guide', 'Programming Books', 'Art History Book', 'Travel Guide'
                ],
                'price_range': (5, 150),
                'descriptions': [
                    'Classic literature in excellent condition',
                    'Educational and entertaining content',
                    'Rare collector\'s edition',
                    'Perfect for students and enthusiasts',
                    'Great addition to any library'
                ]
            },
            'Toys & Games': {
                'items': [
                    'LEGO Creator Set', 'Board Game Collection', 'Action Figures', 'Puzzle 1000pc',
                    'Remote Control Car', 'Drone with Camera', 'Chess Set', 'Playing Cards',
                    'Stuffed Animals', 'Model Train Set', 'Art Supplies Kit', 'Science Kit'
                ],
                'price_range': (10, 300),
                'descriptions': [
                    'Fun for the whole family',
                    'Educational and entertaining',
                    'Perfect gift for kids and collectors',
                    'Hours of creative entertainment',
                    'High-quality materials, safe for children'
                ]
            }
        }
        
        # Create 1000 demo items
        items_created = 0
        for i in range(1000):
            # Randomly select a category
            category_name = random.choice(list(categories.keys()))
            category_data = categories[category_name]
            
            # Randomly select an item from the category
            base_item = random.choice(category_data['items'])
            
            # Add some variation to make items unique
            variations = ['', ' Pro', ' Deluxe', ' Premium', ' Classic', ' Limited Edition', ' V2', ' Plus']
            colors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Silver', 'Gold', 'Pink']
            sizes = ['Small', 'Medium', 'Large', 'XL', 'One Size']
            
            # Create unique title
            variation = random.choice(variations)
            if random.random() > 0.7:  # 30% chance to add color
                color = random.choice(colors)
                title = f"{base_item}{variation} - {color}"
            else:
                title = f"{base_item}{variation}"
            
            # Add size for clothing items
            if category_name == 'Clothing' and random.random() > 0.5:
                size = random.choice(sizes)
                title += f" ({size})"
            
            # Create description
            base_description = random.choice(category_data['descriptions'])
            condition_notes = [
                'Excellent condition, like new.',
                'Very good condition with minor wear.',
                'Good condition, shows some use.',
                'Brand new, never used.',
                'Gently used, well maintained.'
            ]
            
            description = f"{base_description} {random.choice(condition_notes)}"
            
            # Add some extra details
            extra_details = [
                'Fast shipping available!',
                'Comes with original packaging.',
                'No returns, final sale.',
                'Includes all accessories.',
                'Perfect for gifting.',
                'Smoke-free home.',
                'Pet-free environment.',
                'Serious buyers only.'
            ]
            
            if random.random() > 0.6:  # 40% chance to add extra details
                description += f" {random.choice(extra_details)}"
            
            # Generate random price within category range
            min_price, max_price = category_data['price_range']
            price = round(random.uniform(min_price, max_price), 2)
            
            # Randomly assign to one of the first 3 users (sellers)
            seller = users[random.randint(0, 2)]
            
            # Generate demo image URL - using different image IDs for variety
            image_id = random.randint(100, 999)
            image_url = f"https://picsum.photos/400/300?random={image_id}"
            
            Item.objects.create(
                title=title,
                description=description,
                price=Decimal(str(price)),
                seller=seller,
                image_url=image_url
            )
            items_created += 1
        
        return Response({
            'message': f'Database populated successfully with 6 users and {items_created} items!',
            'users_created': 6,
            'items_created': items_created,
            'categories': list(categories.keys())
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
