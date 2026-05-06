from django.apps import AppConfig

class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'  # Just 'accounts', not 'car_management.apps.accounts'
    verbose_name = 'User Accounts'