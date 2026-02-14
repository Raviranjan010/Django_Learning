# Django ModelForm

A **ModelForm** is a helper class that allows you to create a Form class from an existing Django Model.

## Why use ModelForm?
-   **Don't Repeat Yourself (DRY)**: If your form fields match your database fields, why define them twice?
-   **Automatic Field mapping**: Automatically chooses the correct HTML input type (e.g., `DateField` -> Date Picker).
-   **Built-in Validation**: Inherits validation rules from the model (e.g., `max_length`, `unique`).

## 1. Creating a ModelForm

**Step 1: Define the Model (`models.py`)**
```python
from django.db import models

class GeeksModel(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    last_modified = models.DateTimeField(auto_now_add=True)
    img = models.ImageField(upload_to="images/")
```

**Step 2: Define the ModelForm (`forms.py`)**
```python
from django import forms
from .models import GeeksModel

class GeeksForm(forms.ModelForm):
    class Meta:
        model = GeeksModel
        fields = "__all__"  # Includes all fields
```

### Limiting Fields
For security, explicitly list fields instead of using `__all__`.

```python
class GeeksForm(forms.ModelForm):
    class Meta:
        model = GeeksModel
        fields = ['title', 'description']
        # OR
        exclude = ['last_modified']
```

## 2. Field Mappings

| Model Field | Form Field |
| :--- | :--- |
| `CharField` | `forms.CharField` |
| `TextField` | `forms.CharField(widget=forms.Textarea)` |
| `BooleanField` | `forms.BooleanField` |
| `DateTimeField` | `forms.DateTimeField` |
| `ImageField` | `forms.ImageField` |
| `ForeignKey` | `forms.ModelChoiceField` (Dropdown) |

## 3. Customizing Widgets

You can override the default appearance (HTML widget) using the `widgets` dictionary in the `Meta` class.

```python
class GeeksForm(forms.ModelForm):
    class Meta:
        model = GeeksModel
        fields = "__all__"
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter Title'}),
            'description': forms.Textarea(attrs={'rows': 4, 'cols': 40}),
        }
```
In this example, we added CSS classes and placeholders without changing the underlying field logic.
