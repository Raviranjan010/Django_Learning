# Django Debug Toolbar

The **Django Debug Toolbar** is the best tool for identifying performance issues like the N+1 problem during development.

## Installation

1.  **Install**:
    ```bash
    pip install django-debug-toolbar
    ```

2.  **Add to `INSTALLED_APPS`**:
    ```python
    INSTALLED_APPS = [
        # ...
        'debug_toolbar',
    ]
    ```

3.  **Add URLs**:
    ```python
    from django.urls import include, path

    if settings.DEBUG:
        import debug_toolbar
        urlpatterns = [
            path('__debug__/', include(debug_toolbar.urls)),
        ] + urlpatterns
    ```

4.  **Add Middleware**:
    It mostly needs to be near the top.
    ```python
    MIDDLEWARE = [
        'debug_toolbar.middleware.DebugToolbarMiddleware',
        # ...
    ]
    ```

5.  **Internal IPs**:
    The toolbar only shows up for IPs listed here.
    ```python
    INTERNAL_IPS = [
        '127.0.0.1',
    ]
    ```

## Features
-   **SQL Panel**: Shows every query executed, duplicate queries, and execution time.
-   **Timer**: Total request time.
-   **Templates**: Which templates were rendered.
