# Expense Tracker - Views & Logic

In `views.py`, we handle the logic to calculate the total balance, separate income/expenses, and process the form submission.

## 1. The Main View (`index`)

```python
from django.shortcuts import render, redirect
from .models import CurrentBalance, TrackingHistory
from django.contrib import messages

def index(request):
    # handle form submission
    if request.method == "POST":
        description = request.POST.get('description')
        amount = request.POST.get('amount')

        if not amount or float(amount) == 0:
            messages.error(request, "Amount cannot be zero or empty")
            return redirect('/')

        # Get or Create the single balance record (Assuming single user for now)
        current_balance, _ = CurrentBalance.objects.get_or_create(id=1)

        # Determine type
        amount_float = float(amount)
        expense_type = "CREDIT" if amount_float >= 0 else "DEBIT"

        # Create Record
        track = TrackingHistory.objects.create(
            amount=amount_float,
            expense_type=expense_type,
            current_balance=current_balance,
            description=description
        )

        # Update Main Balance
        current_balance.current_balance += amount_float
        current_balance.save()

        return redirect('/')

    # --- GET Request Logic ---
    
    # Ensure balance record exists
    current_balance, _ = CurrentBalance.objects.get_or_create(id=1)
    
    income = 0
    expense = 0
    transactions = TrackingHistory.objects.all().order_by('-created_at')

    # Calculate Totals
    for t in transactions:
        if t.expense_type == "CREDIT":
            income += t.amount
        else:
            expense += t.amount # This adds negative numbers, decreasing the sum? 
            # Note: In UI, expense is usually shown as positive number.
            # If stored as -100, we might want to display 100 in the 'Expense' box.
            
    context = {
        'income': income,
        'expense': expense,
        'transactions': transactions,
        'current_balance': current_balance
    }
    
    return render(request, 'index.html', context)
```

## 2. Deleting Transactions

We need a dedicated view to handle deletion and adjust the balance back.

```python
def delete_transaction(request, id):
    if TrackingHistory.objects.filter(id=id).exists():
        record = TrackingHistory.objects.get(id=id)
        
        # Adjust Balance (Reverse the transaction)
        current_balance = record.current_balance
        current_balance.current_balance -= record.amount
        current_balance.save()
        
        # Delete record
        record.delete()
        
    return redirect('/')
```

## 3. URL Configuration (`urls.py`)

```python
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('delete-transaction/<id>/', views.delete_transaction, name="delete_transaction"),
]
```
