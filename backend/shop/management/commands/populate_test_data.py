# Django Management Command for Quick Database Population
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from shop.models import Item
import random
from decimal import Decimal

User = get_user_model()

class Command(BaseCommand):
    help = 'Quickly populate database with sample data for testing'

    def add_arguments(self, parser):
        parser.add_argument(
            '--count',
            type=int,
            default=10,
            help='Number of items to create (default: 10)'
        )
        parser.add_argument(
            '--users',
            type=int,
            default=3,
            help='Number of users to create (default: 3)'
        )

    def handle(self, *args, **options):
        count = options['count']
        user_count = options['users']
        
        self.stdout.write(f'Creating {user_count} users and {count} items...')
        
        # Create users
        users = []
        for i in range(user_count):
            username = f'testuser{i+1}'
            email = f'user{i+1}@example.com'
            user, created = User.objects.get_or_create(
                username=username,
                defaults={'email': email}
            )
            if created:
                user.set_password('testpass123')
                user.save()
            users.append(user)
        
        # Sample data
        sample_items = [
            ('Gaming Laptop', 'High-performance gaming laptop with RTX graphics', 1299.99),
            ('Wireless Headphones', 'Premium noise-cancelling wireless headphones', 299.99),
            ('Smart Watch', 'Fitness tracking smartwatch with GPS', 199.99),
            ('Coffee Machine', 'Professional espresso coffee machine', 599.99),
            ('Desk Chair', 'Ergonomic office chair with lumbar support', 349.99),
            ('Monitor 27"', '4K Ultra HD monitor for productivity', 449.99),
            ('Keyboard', 'Mechanical RGB gaming keyboard', 129.99),
            ('Mouse', 'Wireless gaming mouse with precision sensor', 79.99),
            ('Webcam', 'HD webcam for video conferencing', 89.99),
            ('Speakers', 'Bluetooth desktop speakers', 149.99),
        ]
        
        categories = ['Electronics', 'Computing', 'Gaming', 'Office', 'Home']
        
        # Create items
        items_to_create = []
        for i in range(count):
            item_data = sample_items[i % len(sample_items)]
            name, description, base_price = item_data
            
            # Add variation to make items unique
            variation = f" - Model {chr(65 + i // len(sample_items))}" if count > len(sample_items) else ""
            price_variation = random.uniform(0.8, 1.2)
            
            item = Item(
                name=f"{name}{variation}",
                description=description,
                price=Decimal(str(round(base_price * price_variation, 2))),
                currency='EUR',
                category=random.choice(categories),
                seller=random.choice(users),
                available=True
            )
            items_to_create.append(item)
        
        # Bulk create for performance
        Item.objects.bulk_create(items_to_create, ignore_conflicts=True)
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {user_count} users and {count} items!')
        )
        self.stdout.write(f'Users created: {", ".join([u.username for u in users])}')
        self.stdout.write('Sample credentials: username/testpass123')
