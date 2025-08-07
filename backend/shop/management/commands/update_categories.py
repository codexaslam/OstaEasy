from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from shop.models import Item
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Update existing items with proper categories'

    def handle(self, *args, **options):
        categories = ['clothing', 'accessories', 'bags', 'shoes', 'sunglasses']
        
        # Get all items
        items = Item.objects.all()
        
        self.stdout.write(f"Updating {items.count()} items with categories...")
        
        updated_count = 0
        for item in items:
            # Assign a random category based on the title
            old_category = item.category
            
            # Smart category assignment based on title keywords
            title_lower = item.title.lower()
            if any(word in title_lower for word in ['shirt', 'dress', 'jeans', 'top', 'jacket', 'coat', 'sweater', 'pants', 'skirt', 'clothing']):
                item.category = 'clothing'
            elif any(word in title_lower for word in ['bag', 'purse', 'backpack', 'handbag', 'tote', 'wallet']):
                item.category = 'bags'
            elif any(word in title_lower for word in ['shoe', 'sneaker', 'boot', 'sandal', 'heel', 'loafer']):
                item.category = 'shoes'
            elif any(word in title_lower for word in ['sunglasses', 'glasses', 'eyewear']):
                item.category = 'sunglasses'
            elif any(word in title_lower for word in ['watch', 'necklace', 'bracelet', 'ring', 'earring', 'jewelry', 'accessory']):
                item.category = 'accessories'
            else:
                # Random assignment for items that don't match keywords
                item.category = random.choice(categories)
            
            if item.category != old_category:
                item.save()
                updated_count += 1
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully updated {updated_count} items with new categories')
        )
