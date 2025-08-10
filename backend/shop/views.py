from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView, DetailView, CreateView, UpdateView
from django.http import JsonResponse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status, generics, filters
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from decimal import Decimal
import stripe
import json
from .models import Item, CartItem, Purchase
from .serializers import ItemSerializer, ItemCreateSerializer, PurchaseSerializer, CartItemSerializer

# Configure Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY


class ItemPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 100


class ItemListCreateAPIView(generics.ListCreateAPIView):
    queryset = Item.objects.filter(status='on_sale').order_by('-date_added')
    serializer_class = ItemSerializer
    permission_classes = [AllowAny]
    pagination_class = ItemPagination
    filter_backends = [filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = ['date_added', 'price', 'title']
    ordering = ['-date_added']
    search_fields = ['title', 'description']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ItemCreateSerializer
        return ItemSerializer
    
    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)
    
    def get_queryset(self):
        queryset = Item.objects.filter(status='on_sale')
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        return queryset.order_by('-date_added')


class ItemDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [AllowAny]
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAuthenticated()]
        return [AllowAny()]


class MyItemsAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # Items user is selling (on sale)
        on_sale_items = Item.objects.filter(
            seller=user, 
            status='on_sale'
        ).order_by('-date_added')
        
        # Items user has sold
        sold_items = Item.objects.filter(
            seller=user, 
            status='sold'
        ).order_by('-date_added')
        
        # Items user has purchased
        purchased_items = Purchase.objects.filter(
            buyer=user
        ).select_related('item').order_by('-purchase_date')
        
        # Serialize the data
        on_sale_serializer = ItemSerializer(on_sale_items, many=True)
        sold_serializer = ItemSerializer(sold_items, many=True)
        purchased_serializer = PurchaseSerializer(purchased_items, many=True)
        
        return Response({
            'on_sale': on_sale_serializer.data,
            'sold': sold_serializer.data,
            'purchased': purchased_serializer.data
        })


class PurchaseHistoryAPIView(generics.ListAPIView):
    serializer_class = PurchaseSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = ItemPagination
    
    def get_queryset(self):
        return Purchase.objects.filter(buyer=self.request.user).order_by('-purchase_date')


class CartAPIView(generics.ListAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)


class ItemListView(ListView):
    model = Item
    template_name = 'shop/item_list.html'
    context_object_name = 'items'
    paginate_by = 12
    
    def get_queryset(self):
        return Item.objects.filter(status='on_sale').order_by('-date_added')


class ItemDetailView(DetailView):
    model = Item
    template_name = 'shop/item_detail.html'
    context_object_name = 'item'


class ItemCreateView(LoginRequiredMixin, CreateView):
    model = Item
    template_name = 'shop/item_form.html'
    fields = ['title', 'description', 'price', 'category', 'image_url']
    
    def form_valid(self, form):
        form.instance.seller = self.request.user
        return super().form_valid(form)


class ItemUpdateView(LoginRequiredMixin, UpdateView):
    model = Item
    template_name = 'shop/item_form.html'
    fields = ['title', 'description', 'price', 'category', 'image_url', 'status']
    
    def get_queryset(self):
        return Item.objects.filter(seller=self.request.user)


class MyItemsView(LoginRequiredMixin, ListView):
    model = Item
    template_name = 'shop/my_items.html'
    context_object_name = 'items'
    
    def get_queryset(self):
        return Item.objects.filter(seller=self.request.user).order_by('-date_added')


class PurchaseHistoryView(LoginRequiredMixin, ListView):
    model = Purchase
    template_name = 'shop/purchase_history.html'
    context_object_name = 'purchases'
    
    def get_queryset(self):
        return Purchase.objects.filter(buyer=self.request.user).order_by('-purchase_date')


class CartView(LoginRequiredMixin, ListView):
    model = CartItem
    template_name = 'shop/cart.html'
    context_object_name = 'cart_items'
    
    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request, item_id):
    """Add an item to the user's cart"""
    try:
        item = get_object_or_404(Item, id=item_id, status='on_sale')
        cart_item, created = CartItem.objects.get_or_create(user=request.user, item=item)
        
        if created:
            return Response({'message': 'Item added to cart'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'Item already in cart'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request, item_id):
    """Remove an item from the user's cart"""
    try:
        cart_item = get_object_or_404(CartItem, user=request.user, item_id=item_id)
        cart_item.delete()
        return Response({'message': 'Item removed from cart'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment_intent(request):
    """Create a Stripe payment intent for cart items"""
    try:
        cart_items = CartItem.objects.filter(user=request.user)
        if not cart_items.exists():
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
        
        total_amount = sum(item.item.price for item in cart_items)
        amount_in_cents = int(total_amount * 100)
        
        intent = stripe.PaymentIntent.create(
            amount=amount_in_cents,
            currency='eur',
            metadata={'user_id': request.user.id}
        )
        
        return Response({
            'client_secret': intent.client_secret,
            'amount': total_amount
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def pay_cart(request):
    """Process payment and complete purchase"""
    try:
        data = json.loads(request.body)
        payment_intent_id = data.get('payment_intent_id')
        
        if not payment_intent_id:
            return Response({'error': 'Payment intent ID required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Verify payment with Stripe
        intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        if intent.status != 'succeeded':
            return Response({'error': 'Payment not completed'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Process cart items
        cart_items = CartItem.objects.filter(user=request.user)
        purchases = []
        
        for cart_item in cart_items:
            item = cart_item.item
            purchase = Purchase.objects.create(
                buyer=request.user,
                item=item,
                purchase_price=item.price,
                payment_intent_id=payment_intent_id
            )
            purchases.append(purchase)
            
            # Mark item as sold
            item.buyer = request.user
            item.status = 'sold'
            item.save()
        
        # Clear cart
        cart_items.delete()
        
        return Response({'message': 'Payment successful'}, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)