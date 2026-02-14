# Handling Form Data

## GET vs POST Methods

### 1. GET Method
-   **Data Location**: Appended to the URL (e.g., `?q=search_term`).
-   **Use Case**: Fetching data, searching, filtering (idempotent actions).
-   **Security**: NOT secure for sensitive data (visible in history/URL).
-   **View Access**: `request.GET`

### 2. POST Method
-   **Data Location**: Sent in the HTTP request body.
-   **Use Case**: Creating, updating, or deleting data.
-   **Security**: More secure; requires **CSRF Token** in Django.
-   **View Access**: `request.POST`

## Handling Forms in Views

The standard pattern for handling a form in a view involves checking the request method.

```python
from django.shortcuts import render, redirect
from .forms import GeeksForm

def home_view(request):
    # Case 1: If request is POST, process the data
    if request.method == "POST":
        # Bind data to the form
        # request.FILES is needed if form has file/image uploads
        form = GeeksForm(request.POST, request.FILES)
        
        # Validate
        if form.is_valid():
            form.save() # Saves directly to DB (ModelForm only)
            return redirect('success_url')
            
    # Case 2: If request is GET, create an empty form
    else:
        form = GeeksForm()

    context = {'form': form}
    return render(request, "home.html", context)
```

## The CSRF Token
Cross-Site Request Forgery (CSRF) protection is mandatory for POST forms in Django.

```html
<form method="POST">
    {% csrf_token %}
    {{ form.as_p }}
    <button type="submit">Submit</button>
</form>
```
If you forget this tag, Django will return a **403 Forbidden** error.
