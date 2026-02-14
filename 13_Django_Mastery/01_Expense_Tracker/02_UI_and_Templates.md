# Expense Tracker - UI & Templates

## 1. Static Files Configuration

We need to configure Django to serve CSS and images.

### Create Directories
Create the following structure in your root project folder:
```
public/
    static/
        css/
```

### Update `settings.py`
```python
import os

STATIC_URL = '/static/'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "public/static")
]
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'public/static')
```

### Update `urls.py`
To serve static files during development:
```python
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns = [
    # ... your patterns ...
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += staticfiles_urlpatterns()
```

## 2. Integrating the UI

### CSS (`public/static/css/main.css`)
Copy the CSS provided in the project resources (or from the CodePen link: `codeopen.io/solygambas/pen/Ojbqyro`) into this file. It defines the look and feel, including colors (`var(--main-color)`), card layouts, and transaction list styles.

### Template (`tracker/templates/index.html`)

Create `tracker/templates/index.html`.

**Key Structure:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Expense Tracker</title>
    <link rel="stylesheet" href="/media/css/main.css">
</head>
<body>
    <h1>Expense Tracker</h1>
    <div class="container">
        <!-- Balance Section -->
        <div class="header">
            <img src="https://i.ibb.co/jfScDTC/budget.png" alt="Expense Tracker" />
            <div class="balance-container">
                <h2>Your Balance</h2>
                <h2 id="balance" class="balance">${{current_balance.current_balance}}</h2>
            </div>
        </div>

        <!-- Income/Expense Summary -->
        <div class="inc-exp-container">
            <div>
                <h4>Income</h4>
                <p class="money plus">+${{income}}</p>
            </div>
            <div>
                <h4>Expenses</h4>
                <p class="money minus">-${{expense}}</p>
            </div>
        </div>

        <!-- Transaction List -->
        <h3>History</h3>
        <ul id="list" class="list">
             {% for transaction in transactions %}
            <li class="{% if transaction.expense_type == 'DEBIT' %} minus {% else %} plus {% endif %}">
                {{transaction.description}} <span> {{transaction.amount}} </span>
                <a class="delete-btn" href="{% url 'delete_transaction' transaction.id %}">
                  <i class="fas fa-trash-alt"></i></a>
            </li>
            {% endfor %}
        </ul>

        <!-- Add Transaction Form -->
        <h3>Add new transaction</h3>
        <form method="POST">
            {% csrf_token %}
            <div class="form-control">
                <label for="text">Description</label>
                <input type="text" name="description" placeholder="Enter description..." required />
            </div>
            <div class="form-control">
                <label for="amount">Amount <br /> <small>(-100 = expense, 100 = income)</small></label>
                <input type="number" name="amount" placeholder="Enter amount..." required />
            </div>
            <button class="btn">Add transaction</button>
        </form>
    </div>
</body>
</html>
```
