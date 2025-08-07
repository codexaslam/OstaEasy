from django.urls import path
from . import views

app_name = 'shop'

urlpatterns = [
    path('items/', views.ItemListView.as_view(), name='item_list'),
    path('items/<int:pk>/', views.ItemDetailView.as_view(), name='item_detail'),
    path('items/create/', views.ItemCreateView.as_view(), name='item_create'),
    path('items/<int:pk>/update/', views.ItemUpdateView.as_view(), name='item_update'),
    path('my-items/', views.MyItemsView.as_view(), name='my_items'),
    path('purchases/', views.PurchaseHistoryView.as_view(), name='purchase_history'),
    path('cart/', views.CartView.as_view(), name='cart'),
    path('cart/add/<int:item_id>/', views.add_to_cart, name='add_to_cart'),
    path('cart/remove/<int:item_id>/', views.remove_from_cart, name='remove_from_cart'),
    path('cart/pay/', views.pay_cart, name='pay_cart'),
    path('create-payment-intent/', views.create_payment_intent, name='create_payment_intent'),
]
