# Sending Custom Signals

You can define your own signals to decouple logic within your own applications.

## 1. Defining a Signal

```python
# signals.py
from django.dispatch import Signal

# Define signal
# providing_args is deprecated in newer Django but serves as documentation
new_order_placed = Signal() 
```

## 2. Sending the Signal

Use `send()` or `send_robust()`.

```python
# views.py
from .signals import new_order_placed

def checkout(request):
    # ... logic ...
    order = Order.create(...)
    
    # Fire the signal
    new_order_placed.send(sender=Order, order_id=order.id, customer=request.user)
```

## 3. Receiving the Custom Signal

```python
# handlers.py
from django.dispatch import receiver
from .signals import new_order_placed

@receiver(new_order_placed)
def notify_warehouse(sender, order_id, **kwargs):
    print(f"Prepare order {order_id}!")
```

## `send()` vs `send_robust()`
-   **`send()`**: If any receiver raises an Exception, the process stops, and the error propagates up.
-   **`send_robust()`**: Catches exceptions from receivers and ensures *all* receivers are called. It returns a list of specific errors if any occurred.
