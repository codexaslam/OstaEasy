# Django Management Command for Environment Check
from django.core.management.base import BaseCommand
from django.conf import settings
import os

class Command(BaseCommand):
    help = 'Check current environment configuration'

    def handle(self, *args, **options):
        self.stdout.write('🔍 Environment Configuration Check')
        self.stdout.write('=' * 40)
        
        # Environment detection
        env = getattr(settings, 'ENVIRONMENT', 'unknown')
        self.stdout.write(f'Environment: {env}')
        
        # Debug mode
        debug = settings.DEBUG
        self.stdout.write(f'Debug Mode: {debug}')
        
        # Database
        db_config = settings.DATABASES['default']
        self.stdout.write(f'Database Engine: {db_config["ENGINE"]}')
        if 'NAME' in db_config:
            self.stdout.write(f'Database Name: {db_config["NAME"]}')
        if 'HOST' in db_config and db_config['HOST']:
            self.stdout.write(f'Database Host: {db_config["HOST"]}')
        
        # Secret key (partial)
        secret_key = settings.SECRET_KEY
        self.stdout.write(f'Secret Key: {secret_key[:10]}...')
        
        # CORS settings
        if hasattr(settings, 'CORS_ALLOWED_ORIGINS'):
            self.stdout.write(f'CORS Allowed Origins: {len(settings.CORS_ALLOWED_ORIGINS)} configured')
        
        # Environment variables check
        self.stdout.write('\n📋 Environment Variables:')
        env_vars = [
            'DATABASE_URL',
            'SECRET_KEY',
            'DEBUG',
            'STRIPE_PUBLISHABLE_KEY',
            'STRIPE_SECRET_KEY',
            'FRONTEND_URL'
        ]
        
        for var in env_vars:
            value = os.environ.get(var)
            if value:
                # Mask sensitive values
                if 'KEY' in var or 'SECRET' in var:
                    display_value = f"{value[:8]}..." if len(value) > 8 else "***"
                else:
                    display_value = value
                self.stdout.write(f'  ✅ {var}: {display_value}')
            else:
                self.stdout.write(f'  ❌ {var}: Not set')
        
        self.stdout.write('\n🚀 Ready to run!')
        
        if env == 'local':
            self.stdout.write('\n💡 Local Development Tips:')
            self.stdout.write('  - Use: python manage.py populate_test_data --count 10')
            self.stdout.write('  - Access admin: http://localhost:8000/admin/')
            self.stdout.write('  - API docs: http://localhost:8000/api/items/')
