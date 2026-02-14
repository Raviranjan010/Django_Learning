# Pinterest Clone - Views

## 1. Home Feed (`pins/views.py`)

Efficiently fetch pins with related user data.

```python
from django.shortcuts import render, redirect
from .models import Pin
from django.contrib.auth.decorators import login_required

def home(request):
    # select_related optimizes SQL by fetching User data in the same query
    pins = Pin.objects.select_related("user").all().order_by("-created_at")
    return render(request, "home.html", {"pins": pins})

@login_required
def create_pin(request):
    if request.method == "POST":
        title = request.POST.get("title")
        description = request.POST.get("description")
        image = request.FILES.get("image")

        Pin.objects.create(
            user=request.user,
            title=title,
            description=description,
            image=image
        )
        return redirect("home")

    return render(request, "create_pin.html")
```

## 2. Pin Detail & Comments (`pins/views.py`)

```python
from social.models import Comment

def pin_detail(request, id):
    pin = Pin.objects.get(id=id)
    comments = Comment.objects.filter(pin=pin)

    if request.method == "POST" and request.user.is_authenticated:
        Comment.objects.create(
            user=request.user,
            pin=pin,
            content=request.POST.get("comment")
        )

    return render(request, "pin_detail.html", {
        "pin": pin,
        "comments": comments
    })
```

## 3. Async Like Toggle (`social/views.py`)

Return JSON for AJAX calls.

```python
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import Like, Pin
from django.contrib.auth.decorators import login_required

@login_required
def toggle_like(request, pin_id):
    pin = get_object_or_404(Pin, id=pin_id)
    like, created = Like.objects.get_or_create(user=request.user, pin=pin)

    if not created:
        like.delete()
        liked = False
    else:
        liked = True

    return JsonResponse({"liked": liked})
```
