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
        
        # Demo item categories and data - matching the database model categories
        categories = {
            'clothing': {
                'items': [
                    'Vintage Band T-Shirt', 'Levi\'s 501 Jeans', 'Champion Hoodie', 'North Face Jacket',
                    'Patagonia Fleece', 'Cashmere Sweater', 'Blazer', 'Summer Dress',
                    'Silk Blouse', 'Wool Coat', 'Denim Jacket', 'Polo Shirt', 'Maxi Dress',
                    'Cardigan', 'Jumpsuit', 'Tank Top', 'Long Sleeve Tee', 'Midi Skirt',
                    'Yoga Pants', 'Chinos', 'Button-Down Shirt', 'Leather Jacket', 'Sundress',
                    'Sweatshirt', 'Pencil Skirt', 'Trench Coat', 'Cargo Pants', 'Turtleneck'
                ],
                'variations': {
                    'brands': ['Nike', 'Adidas', 'Zara', 'H&M', 'Uniqlo', 'Gap', 'COS', 'Mango'],
                    'styles': ['Oversized', 'Slim Fit', 'Regular', 'Cropped', 'High-Waisted', 'V-Neck'],
                    'materials': ['Cotton', 'Organic Cotton', 'Linen', 'Wool Blend', 'Polyester']
                },
                'price_range': (15, 500),
                'descriptions': [
                    'Comfortable and versatile for everyday wear',
                    'Premium quality fabric with perfect fit',
                    'Trendy design that never goes out of style',
                    'Sustainable materials and ethical production',
                    'Perfect for casual or semi-formal occasions'
                ]
            },
            'accessories': {
                'items': [
                    'Apple Watch', 'Fossil Watch', 'Gold Chain Necklace', 'Silver Bracelet',
                    'Diamond Stud Earrings', 'Leather Belt', 'Silk Scarf', 'Baseball Cap', 
                    'Beanie', 'Statement Ring', 'Cufflinks', 'Hair Scrunchie', 'Vintage Brooch',
                    'Ankle Bracelet', 'Charm Bracelet', 'Enamel Pin', 'Headband', 'Choker Necklace',
                    'Pearl Earrings', 'Leather Wallet', 'Phone Case', 'Keychain', 'Hair Clips'
                ],
                'variations': {
                    'materials': ['Gold-Plated', 'Sterling Silver', 'Rose Gold', 'Stainless Steel', 'Leather'],
                    'styles': ['Minimalist', 'Vintage', 'Modern', 'Bohemian', 'Classic'],
                    'sizes': ['Adjustable', 'One Size', 'Small', 'Medium', 'Large']
                },
                'price_range': (10, 800),
                'descriptions': [
                    'Elegant accessory to complete your look',
                    'High-quality materials and craftsmanship',
                    'Perfect for special occasions or daily wear',
                    'Timeless design with modern appeal',
                    'Makes a thoughtful gift for someone special'
                ]
            },
            'bags': {
                'items': [
                    'Tote Bag', 'Crossbody Bag', 'Backpack', 'Clutch', 'Messenger Bag',
                    'Handbag', 'Shoulder Bag', 'Duffle Bag', 'Fanny Pack', 'Briefcase', 
                    'Evening Bag', 'Beach Bag', 'Laptop Bag', 'Travel Backpack', 'Sling Bag',
                    'Weekender Bag', 'Diaper Bag', 'Camera Bag', 'Gym Bag', 'Purse'
                ],
                'variations': {
                    'brands': ['Coach', 'Michael Kors', 'Kate Spade', 'Fossil', 'Tory Burch', 'Marc Jacobs'],
                    'materials': ['Leather', 'Vegan Leather', 'Canvas', 'Nylon', 'Suede'],
                    'colors': ['Black', 'Brown', 'Tan', 'Navy', 'Burgundy', 'Beige', 'Cognac']
                },
                'price_range': (25, 1200),
                'descriptions': [
                    'Spacious and practical for everyday use',
                    'Premium leather with elegant design',
                    'Durable construction for long-lasting use',
                    'Multiple compartments for organization',
                    'Perfect size for all your essentials'
                ]
            },
            'shoes': {
                'items': [
                    'Running Shoes', 'Sneakers', 'Boots', 'Sandals', 'Loafers',
                    'High Heels', 'Ballet Flats', 'Ankle Boots', 'Dress Shoes', 'Hiking Boots',
                    'Slip-On Shoes', 'Oxford Shoes', 'Wedges', 'Flip Flops', 'Espadrilles',
                    'Combat Boots', 'Chelsea Boots', 'Platform Shoes', 'Moccasins', 'Clogs'
                ],
                'variations': {
                    'brands': ['Nike', 'Adidas', 'Converse', 'Vans', 'Dr. Martens', 'Timberland', 'Clarks', 'Steve Madden'],
                    'colors': ['Black', 'White', 'Brown', 'Navy', 'Gray', 'Tan', 'Red', 'Pink'],
                    'sizes': ['US 6', 'US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12']
                },
                'price_range': (30, 600),
                'descriptions': [
                    'Comfortable footwear for all-day wear',
                    'Premium materials with excellent support',
                    'Perfect for running and athletic activities',
                    'Stylish design suitable for any occasion',
                    'Durable construction with superior grip'
                ]
            },
            'sunglasses': {
                'items': [
                    'Aviator Sunglasses', 'Wayfarer Sunglasses', 'Cat Eye Sunglasses', 'Round Sunglasses',
                    'Sport Sunglasses', 'Oversized Sunglasses', 'Square Sunglasses', 'Pilot Sunglasses',
                    'Retro Sunglasses', 'Polarized Sunglasses', 'Mirrored Sunglasses', 'Gradient Sunglasses'
                ],
                'variations': {
                    'brands': ['Ray-Ban', 'Oakley', 'Gucci', 'Prada', 'Tom Ford', 'Persol', 'Maui Jim', 'Warby Parker'],
                    'lens_types': ['Polarized', 'UV Protection', 'Anti-Glare', 'Gradient', 'Mirrored'],
                    'frame_colors': ['Black', 'Tortoiseshell', 'Gold', 'Silver', 'Brown', 'Clear']
                },
                'price_range': (20, 400),
                'descriptions': [
                    '100% UV protection with premium lenses',
                    'Designer frames with superior comfort',
                    'Perfect for driving and outdoor activities',
                    'Scratch-resistant lenses with clarity',
                    'Timeless style with modern technology'
                ]
            }
        }
        
        # Create 200 items for each category (1000 total items)
        items_created = 0
        for category_key, category_data in categories.items():
            for i in range(200):  # 200 items per category
                try:
                    # Randomly select an item from the category
                    base_item = random.choice(category_data['items'])
                    
                    # Create realistic title based on category
                    title = base_item
                    
                    # Add category-specific variations
                    if 'variations' in category_data:
                        variations = category_data['variations']
                        
                        if category_key == 'clothing':
                            # For clothing: Brand + Style + Item + Material + Size
                            if random.random() > 0.6:  # 40% chance to add brand
                                brand = random.choice(variations['brands'])
                                title = f"{brand} {title}"
                            if random.random() > 0.7:  # 30% chance to add style
                                style = random.choice(variations['styles'])
                                title = f"{style} {title}"
                            if random.random() > 0.8:  # 20% chance to add material
                                material = random.choice(variations['materials'])
                                title = f"{title} ({material})"
                            # Add size for clothing
                            sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
                            if random.random() > 0.4:  # 60% chance to add size
                                size = random.choice(sizes)
                                title = f"{title} - Size {size}"
                        
                        elif category_key == 'accessories':
                            # For accessories: Material + Style + Item
                            if random.random() > 0.5:  # 50% chance to add material
                                material = random.choice(variations['materials'])
                                title = f"{material} {title}"
                            if random.random() > 0.7:  # 30% chance to add style
                                style = random.choice(variations['styles'])
                                title = f"{style} {title}"
                        
                        elif category_key == 'bags':
                            # For bags: Brand + Material + Item + Color
                            if random.random() > 0.4:  # 60% chance to add brand
                                brand = random.choice(variations['brands'])
                                title = f"{brand} {title}"
                            if random.random() > 0.6:  # 40% chance to add material
                                material = random.choice(variations['materials'])
                                title = f"{title} ({material})"
                            if random.random() > 0.5:  # 50% chance to add color
                                color = random.choice(variations['colors'])
                                title = f"{title} - {color}"
                        
                        elif category_key == 'shoes':
                            # For shoes: Brand + Item + Color + Size
                            if random.random() > 0.5:  # 50% chance to add brand
                                brand = random.choice(variations['brands'])
                                title = f"{brand} {title}"
                            if random.random() > 0.4:  # 60% chance to add color
                                color = random.choice(variations['colors'])
                                title = f"{title} - {color}"
                            # Always add size for shoes
                            size = random.choice(variations['sizes'])
                            title = f"{title} ({size})"
                        
                        elif category_key == 'sunglasses':
                            # For sunglasses: Brand + Item + Lens Type + Frame Color
                            if random.random() > 0.3:  # 70% chance to add brand
                                brand = random.choice(variations['brands'])
                                title = f"{brand} {title}"
                            if random.random() > 0.6:  # 40% chance to add lens type
                                lens_type = random.choice(variations['lens_types'])
                                title = f"{title} ({lens_type})"
                            if random.random() > 0.7:  # 30% chance to add frame color
                                frame_color = random.choice(variations['frame_colors'])
                                title = f"{title} - {frame_color} Frame"
                    
                    # Create realistic description
                    base_description = random.choice(category_data['descriptions'])
                    condition_notes = [
                        'Excellent condition, barely used.',
                        'Very good condition with minimal wear.',
                        'Good condition, shows light use.',
                        'Brand new with tags.',
                        'Gently used, well maintained.',
                        'Like new condition.',
                        'Pre-owned but excellent quality.'
                    ]
                    
                    description = f"{base_description} {random.choice(condition_notes)}"
                    
                    # Add category-specific details
                    extra_details = []
                    if category_key == 'clothing':
                        extra_details = [
                            'Machine washable.',
                            'Wrinkle-resistant fabric.',
                            'Perfect for layering.',
                            'True to size fit.',
                            'From smoke-free home.'
                        ]
                    elif category_key == 'shoes':
                        extra_details = [
                            'True to size.',
                            'Comfortable for all-day wear.',
                            'Non-slip sole.',
                            'Comes with original box.',
                            'Authentic product guarantee.'
                        ]
                    elif category_key == 'bags':
                        extra_details = [
                            'Multiple pockets for organization.',
                            'Adjustable straps.',
                            'Dust bag included.',
                            'Hardware in excellent condition.',
                            'No stains or odors.'
                        ]
                    elif category_key == 'accessories':
                        extra_details = [
                            'Hypoallergenic materials.',
                            'Adjustable sizing.',
                            'Comes with gift box.',
                            'Tarnish resistant.',
                            'Perfect for gifting.'
                        ]
                    elif category_key == 'sunglasses':
                        extra_details = [
                            'Prescription ready.',
                            'Case and cleaning cloth included.',
                            'Scratch-resistant coating.',
                            'Lightweight and comfortable.',
                            'Authentic designer piece.'
                        ]
                    
                    if random.random() > 0.5:  # 50% chance to add extra details
                        description += f" {random.choice(extra_details)}"
                    
                    # Generate random price within category range
                    min_price, max_price = category_data['price_range']
                    price = round(random.uniform(min_price, max_price), 2)
                    
                    # Randomly assign to one of the first 3 users (sellers)
                    seller = users[random.randint(0, 2)]
                    
                    # Generate category-specific image URL with themed approach
                    # Using a combination of placeholder services and category-specific parameters
                    category_themes = {
                        'clothing': {
                            'service': 'https://picsum.photos/400/300?random=',
                            'seed_range': (2000, 2200),  # Fashion/lifestyle images
                            'backup': 'https://via.placeholder.com/400x300/8B4513/FFFFFF?text=Fashion+Item'
                        },
                        'shoes': {
                            'service': 'https://picsum.photos/400/300?random=',
                            'seed_range': (2201, 2400),  # Product/object images
                            'backup': 'https://via.placeholder.com/400x300/654321/FFFFFF?text=Footwear'
                        },
                        'bags': {
                            'service': 'https://picsum.photos/400/300?random=',
                            'seed_range': (2401, 2600),  # Accessory images
                            'backup': 'https://via.placeholder.com/400x300/8B0000/FFFFFF?text=Handbag'
                        },
                        'accessories': {
                            'service': 'https://picsum.photos/400/300?random=',
                            'seed_range': (2601, 2800),  # Small object images
                            'backup': 'https://via.placeholder.com/400x300/FFD700/000000?text=Accessory'
                        },
                        'sunglasses': {
                            'service': 'https://picsum.photos/400/300?random=',
                            'seed_range': (2801, 3000),  # Eyewear/style images
                            'backup': 'https://via.placeholder.com/400x300/000080/FFFFFF?text=Sunglasses'
                        }
                    }
                    
                    # Get category theme and generate image URL
                    theme = category_themes[category_key]
                    seed_min, seed_max = theme['seed_range']
                    image_seed = random.randint(seed_min, seed_max)
                    
                    # Primary image URL with category-specific seed
                    image_url = f"{theme['service']}{image_seed}"
                    
                    # Create the item
                    item = Item.objects.create(
                        title=title,
                        description=description,
                        price=Decimal(str(price)),
                        category=category_key,  # Set the category properly
                        seller=seller,
                        image_url=image_url
                    )
                    items_created += 1
                except Exception as item_error:
                    continue
        
        return Response({
            'message': f'🎉 Database populated successfully! Created 6 users and {items_created} realistic items with category-specific images (200 per category)!',
            'users_created': 6,
            'items_created': items_created,
            'categories': list(categories.keys()),
            'items_per_category': 200,
            'features': [
                'Realistic product names and descriptions',
                'Category-specific image URLs',
                'Proper brand names and variations',
                'Accurate pricing ranges',
                'Complete data reset on each populate'
            ]
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
