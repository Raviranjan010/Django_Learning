# Custom User Models

Every Django project should use a custom user model from the start.

## 1. Using `AbstractUser`
**Best for**: Keeping default fields (username, first_name, etc.) but adding extra fields (e.g., phone_number).

### Model
```python
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Add custom fields
    phone_number = models.CharField(max_length=15, unique=True)
    
    # You can change the login field
    USERNAME_FIELD = 'username' # default
```

### Settings
```python
AUTH_USER_MODEL = 'myapp.User'
```

### Admin
You need to extend `UserAdmin` to see formatting correctly.
```python
from django.contrib.auth.admin import UserAdmin
admin.site.register(User, UserAdmin)
```

## 2. Using `AbstractBaseUser`
**Best for**: Complete overhaul. e.g., using Email instead of Username, or removing First/Last name.

Requires more work: defining the Manager and common fields manually.

### Model
```python
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email: raise ValueError("Email required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False) # Access to Admin
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email' # Login with Email
    REQUIRED_FIELDS = [] # For createsuperuser prompt

    def __str__(self):
        return self.email
```

## Comparision
| AbstractUser | AbstractBaseUser |
| :--- | :--- |
| Extends default User | Minimal base class |
| Easy setup | Requires custom Manager |
| Has Username, Name fields | You define every field |
| Good for slight mods | Good for total control |
