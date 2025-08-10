from django.urls import path
from . import views

app_name = 'shop'

urlpatterns = [
    # API endpoints
    path('items/', views.ItemListCreateAPIView.as_view(), name='api_item_list'),
    path('items/<int:pk>/', views.ItemDetailAPIView.as_view(), name='api_item_detail'),
    path('items/create/', views.ItemListCreateAPIView.as_view(), name='api_item_create'),
    path('items/<int:pk>/update/', views.ItemDetailAPIView.as_view(), name='api_item_update'),
    path('my-items/', views.MyItemsAPIView.as_view(), name='api_my_items'),
    path('purchases/', views.PurchaseHistoryAPIView.as_view(), name='api_purchase_history'),
    path('cart/', views.CartAPIView.as_view(), name='api_cart'),
    
    # Existing API endpoints
    path('cart/add/<int:item_id>/', views.add_to_cart, name='add_to_cart'),
    path('cart/remove/<int:item_id>/', views.remove_from_cart, name='remove_from_cart'),
    path('cart/pay/', views.pay_cart, name='pay_cart'),
    path('create-payment-intent/', views.create_payment_intent, name='create_payment_intent'),
    
    # Legacy HTML views (for backward compatibility)
    path('html/items/', views.ItemListView.as_view(), name='item_list'),
    path('html/items/<int:pk>/', views.ItemDetailView.as_view(), name='item_detail'),
    path('html/items/create/', views.ItemCreateView.as_view(), name='item_create'),
    path('html/items/<int:pk>/update/', views.ItemUpdateView.as_view(), name='item_update'),
    path('html/my-items/', views.MyItemsView.as_view(), name='my_items'),
    path('html/purchases/', views.PurchaseHistoryView.as_view(), name='purchase_history'),
    path('html/cart/', views.CartView.as_view(), name='cart'),
]
