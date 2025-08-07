from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.conf import settings
from rest_framework import generics, permissions, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db import transaction
import stripe
from .models import Item, CartItem, Purchase
from .serializers import ItemSerializer, ItemCreateSerializer, CartItemSerializer, PurchaseSerializer

User = get_user_model()

# Configure Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY


class ItemListView(generics.ListAPIView):
    """List all items for sale"""
    serializer_class = ItemSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = ['price', 'title', 'date_added']
    ordering = ['-date_added']  # Default ordering
    search_fields = ['title', 'description']
    
    def get_queryset(self):
        queryset = Item.objects.filter(status='on_sale')
        category = self.request.query_params.get('category', None)
        section = self.request.query_params.get('section', None)
        
        if category:
            queryset = queryset.filter(category=category)
            
        # Handle different sections for home page
        if section == 'featured':
            # Featured items - newest items
            queryset = queryset.order_by('-date_added')
        elif section == 'bestsellers':
            # Best sellers - could be by purchase count, for now use price descending
            queryset = queryset.order_by('-price')
            
        return queryset


class ItemCreateView(generics.CreateAPIView):
    """Create a new item"""
    serializer_class = ItemCreateSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)


class ItemUpdateView(generics.UpdateAPIView):
    """Update an item (only price for now)"""
    serializer_class = ItemCreateSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Item.objects.filter(seller=self.request.user, status='on_sale')


class MyItemsView(generics.ListAPIView):
    """List user's items categorized by status"""
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Item.objects.filter(seller=self.request.user)
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        on_sale = queryset.filter(status='on_sale')
        sold = queryset.filter(status='sold')
        
        # Get purchased items
        purchased = Item.objects.filter(buyer=request.user)
        
        return Response({
            'on_sale': ItemSerializer(on_sale, many=True).data,
            'sold': ItemSerializer(sold, many=True).data,
            'purchased': ItemSerializer(purchased, many=True).data
        })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request, item_id):
    """Add item to cart"""
    try:
        item = Item.objects.get(id=item_id, status='on_sale')
        
        # Check if user is trying to add their own item
        if item.seller == request.user:
            return Response({
                'error': 'You cannot add your own item to cart'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if item is already in cart
        cart_item, created = CartItem.objects.get_or_create(
            user=request.user,
            item=item
        )
        
        if not created:
            return Response({
                'error': 'Item already in cart'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            'message': 'Item added to cart successfully'
        })
        
    except Item.DoesNotExist:
        return Response({
            'error': 'Item not found or no longer available'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request, item_id):
    """Remove item from cart"""
    try:
        cart_item = CartItem.objects.get(user=request.user, item_id=item_id)
        cart_item.delete()
        return Response({
            'message': 'Item removed from cart'
        })
    except CartItem.DoesNotExist:
        return Response({
            'error': 'Item not in cart'
        }, status=status.HTTP_404_NOT_FOUND)


class CartView(generics.ListAPIView):
    """View cart items"""
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment_intent(request):
    """Create a Stripe payment intent"""
    try:
        amount = request.data.get('amount')  # amount in cents
        currency = request.data.get('currency', 'usd')
        
        if not amount:
            return Response({
                'error': 'Amount is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # TODO: Replace with real Stripe keys when ready for production
        # For now, return a mock response to test cart functionality
        if settings.STRIPE_SECRET_KEY == "sk_test_demo_key":
            # Mock payment intent for demo purposes
            return Response({
                'client_secret': 'pi_mock_client_secret_for_testing',
                'payment_intent_id': 'pi_mock_payment_intent_id',
                'message': 'Mock payment - replace with real Stripe keys for production'
            })
        
        # Create payment intent with real Stripe
        intent = stripe.PaymentIntent.create(
            amount=int(amount),
            currency=currency,
            metadata={
                'user_id': request.user.id,
                'user_email': request.user.email
            }
        )
        
        return Response({
            'client_secret': intent.client_secret,
            'payment_intent_id': intent.id
        })
        
    except stripe.error.StripeError as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def pay_cart(request):
    """Process cart payment with Stripe"""
    try:
        with transaction.atomic():
            payment_intent_id = request.data.get('payment_intent_id')
            
            if not payment_intent_id:
                return Response({
                    'error': 'Payment intent ID is required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Verify payment intent with Stripe
            try:
                # Handle mock payments for development
                if payment_intent_id.startswith('pi_mock_') or payment_intent_id == 'mock_payment_intent_id':
                    # Mock payment - skip Stripe verification for development
                    print(f"Processing mock payment: {payment_intent_id}")
                else:
                    # Real Stripe payment verification
                    intent = stripe.PaymentIntent.retrieve(payment_intent_id)
                    if intent.status != 'succeeded':
                        return Response({
                            'error': 'Payment not completed'
                        }, status=status.HTTP_400_BAD_REQUEST)
            except stripe.error.StripeError as e:
                return Response({
                    'error': f'Payment verification failed: {str(e)}'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            cart_items = CartItem.objects.filter(user=request.user).select_for_update()
            
            if not cart_items.exists():
                return Response({
                    'error': 'Cart is empty'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check for price changes and availability
            issues = []
            valid_items = []
            
            for cart_item in cart_items:
                item = Item.objects.select_for_update().get(id=cart_item.item.id)
                
                # Check if item is still available
                if item.status != 'on_sale':
                    issues.append({
                        'item_id': item.id,
                        'title': item.title,
                        'issue': 'no_longer_available'
                    })
                    continue
                
                # Check if price has changed
                if item.price != cart_item.item.price:
                    issues.append({
                        'item_id': item.id,
                        'title': item.title,
                        'issue': 'price_changed',
                        'old_price': str(cart_item.item.price),
                        'new_price': str(item.price)
                    })
                    continue
                
                valid_items.append((cart_item, item))
            
            if issues:
                return Response({
                    'success': False,
                    'issues': issues
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Process purchase for valid items
            purchases = []
            for cart_item, item in valid_items:
                item.status = 'sold'
                item.buyer = request.user
                item.date_sold = timezone.now()
                item.save()
                
                # Create purchase record
                purchase = Purchase.objects.create(
                    buyer=request.user,
                    item=item,
                    purchase_price=item.price,
                    payment_intent_id=payment_intent_id
                )
                purchases.append(purchase)
                
                cart_item.delete()
            
            return Response({
                'success': True,
                'message': f'Successfully purchased {len(valid_items)} items',
                'items_purchased': len(valid_items),
                'purchase_ids': [p.id for p in purchases]
            })
            
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PurchaseHistoryView(generics.ListAPIView):
    """List user's purchase history"""
    serializer_class = PurchaseSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Purchase.objects.filter(buyer=self.request.user)


class ItemDetailView(generics.RetrieveAPIView):
    """Get a single item's details"""
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [AllowAny]
