# Working with Forms in Django

Forms are a critical component of most web applications. Django handles forms by managing HTML generation, validation, and data processing.

## 1. Defining Forms (`forms.py`)

Usually, we define our forms in a `forms.py` file within our app.

### A. Regular Forms (`forms.Form`)
When you need to define fields manually, similar to models. This is useful for search forms or contact forms not tied to a database.

```python
from django import forms

class ContactForm(forms.Form):
    subject = forms.CharField(max_length=100)
    message = forms.CharField(widget=forms.Textarea)
    email = forms.EmailField()
    cc_myself = forms.BooleanField(required=False)
```

### B. Model Forms (`forms.ModelForm`)
When you're building a form that maps directly to a Django model. This is incredibly powerful and saves a lot of code.

```python
from django import forms
from .models import Article

class ArticleForm(forms.ModelForm):
    class Meta:
        model = Article
        fields = ['title', 'content', 'pub_date']
        # Or fields = '__all__' (Not recommended for security)
```

---

## 2. Using Forms in Views

### The View Logic
The standard pattern for handling a form in a view:

```python
from django.shortcuts import render, redirect
from .forms import ContactForm

def contact(request):
    if request.method == 'POST':
        # Create a form instance and populate it with data from the request:
        form = ContactForm(request.POST)
        
        # Check whether it's valid:
        if form.is_valid():
            # Process the data in form.cleaned_data as required
            subject = form.cleaned_data['subject']
            message = form.cleaned_data['message']
            email = form.cleaned_data['email']
            
            # ... define logic here (send email, etc.)
            
            # Redirect to a new URL:
            return redirect('thanks')
            
    # If a GET (or any other method), create a blank form
    else:
        form = ContactForm()

    return render(request, 'contact.html', {'form': form})
```

---

## 3. Rendering Forms in Templates

Django provides several ways to render forms in your templates.

### A. Automatic Rendering
- `{{ form.as_p }}`: Render each field wrapped in `<p>` tags.
- `{{ form.as_table }}`: Render as table rows (`<tr>`).
- `{{ form.as_ul }}`: Render as list items (`<li>`).

### B. Manual Rendering (Looping)
```html
<form method="post">
    {% csrf_token %}
    {% for field in form %}
        <div class="fieldWrapper">
            {{ field.errors }}
            {{ field.label_tag }} {{ field }}
            {% if field.help_text %}
            <p class="help">{{ field.help_text|safe }}</p>
            {% endif %}
        </div>
    {% endfor %}
    <input type="submit" value="Submit">
</form>
```

### C. Manual Rendering (Individual Fields)
```html
<div class="fieldWrapper">
    {{ form.subject.errors }}
    <label for="{{ form.subject.id_for_label }}">Subject:</label>
    {{ form.subject }}
</div>
```

---

## 4. Form Validation

You can add custom validation to your forms.

### Validating a Specific Field
Define a method named `clean_<fieldname>()`.
```python
def clean_email(self):
    data = self.cleaned_data['email']
    if "gmail.com" not in data:
        raise forms.ValidationError("Only Gmail addresses are allowed.")
    return data
```

### Validating Fields That Depend on Each Other
Override the `clean()` method.
```python
def clean(self):
    cleaned_data = super().clean()
    password = cleaned_data.get("password")
    confirm_password = cleaned_data.get("confirm_password")

    if password and confirm_password:
        if password != confirm_password:
            raise forms.ValidationError("Passwords do not match.")
```
