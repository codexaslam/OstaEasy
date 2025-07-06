from django.contrib import admin
from .models import Item, CartItem, Purchase

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ['title', 'price', 'seller', 'status', 'date_added', 'image_url']
    list_filter = ['status', 'date_added']
    search_fields = ['title', 'description']
    readonly_fields = ['date_added', 'date_sold']

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['user', 'item', 'date_added']
    list_filter = ['date_added']

@admin.register(Purchase)
class PurchaseAdmin(admin.ModelAdmin):
    list_display = ['buyer', 'item', 'purchase_price', 'purchase_date']
    list_filter = ['purchase_date']
    readonly_fields = ['purchase_date']
