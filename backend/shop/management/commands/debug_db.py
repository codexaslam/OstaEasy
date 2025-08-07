from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from shop.models import Item
from django.db.models import Count

User = get_user_model()

class Command(BaseCommand):
    help = 'Debug database state'

    def handle(self, *args, **options):
        self.stdout.write('=== Database State ===')
        self.stdout.write(f'Total users: {User.objects.count()}')
        self.stdout.write(f'Total items: {Item.objects.count()}')

        self.stdout.write('\n=== First 5 Users ===')
        for user in User.objects.all()[:5]:
            self.stdout.write(f'User: {user.username} (ID: {user.id})')

        self.stdout.write('\n=== Category Distribution ===')
        category_counts = Item.objects.values('category').annotate(count=Count('category'))
        for cat in category_counts:
            self.stdout.write(f"{cat['category']}: {cat['count']} items")

        self.stdout.write('\n=== Recent Items ===')
        for item in Item.objects.all()[:5]:
            self.stdout.write(f'Item: {item.title[:50]}... (Category: {item.category}, Seller: {item.seller.username})')
