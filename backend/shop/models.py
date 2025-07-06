from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Item(models.Model):
    STATUS_CHOICES = [
        ('on_sale', 'On Sale'),
        ('sold', 'Sold'),
    ]
    
    CATEGORY_CHOICES = [
        ('clothing', 'Clothing'),
        ('accessories', 'Accessories'),
        ('bags', 'Bags'),
        ('shoes', 'Shoes'),
        ('sunglasses', 'Sunglasses'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='clothing')
    image_url = models.URLField(max_length=500, null=True, blank=True, help_text="URL of item image")
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='items_for_sale')
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='purchased_items', null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='on_sale')
    date_added = models.DateTimeField(auto_now_add=True)
    date_sold = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-date_added']


class Purchase(models.Model):
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='purchases')
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='purchase_record')
    purchase_date = models.DateTimeField(auto_now_add=True)
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2)
    payment_intent_id = models.CharField(max_length=255, null=True, blank=True, help_text="Stripe payment intent ID")
    
    def __str__(self):
        return f"{self.buyer.username} purchased {self.item.title}"
    
    class Meta:
        ordering = ['-purchase_date']


class CartItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cart_items')
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    date_added = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'item']
    
    def __str__(self):
        return f"{self.user.username} - {self.item.title}"
