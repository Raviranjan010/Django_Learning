# Expense Tracker - Database Models

Efficient data modeling is essential. We need to track the user's current balance and the history of all transactions.

## 1. `models.py`

```python
from django.db import models

class CurrentBalance(models.Model):
    current_balance = models.FloatField(default=0)

    def __str__(self):
        return str(self.current_balance)

class TrackingHistory(models.Model):
    # Link every transaction to the balance record
    current_balance = models.ForeignKey(CurrentBalance, on_delete=models.CASCADE)
    
    amount = models.FloatField()
    expense_type = models.CharField(choices=(('CREDIT', 'CREDIT'), ('DEBIT', 'DEBIT')), max_length=200)
    description = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.description} ({self.expense_type}): {self.amount}"

class RequestLogs(models.Model):
    """Optional: To store logs of HTTP requests"""
    request_info = models.TextField()
    request_type = models.CharField(max_length=100)
    request_method = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
```

## 2. Apply Migrations

Once models are defined, create the tables.

```bash
python manage.py makemigrations
python manage.py migrate
```

## 3. Admin Configuration (Optional)

To view data in the admin panel, register them in `admin.py`.

```python
from django.contrib import admin
from .models import CurrentBalance, TrackingHistory, RequestLogs

admin.site.register(CurrentBalance)
admin.site.register(TrackingHistory)
admin.site.register(RequestLogs)
```
