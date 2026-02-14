# Environment Configuration

Never hardcode sensitive data (Secret Keys, DB Passwords) in your code. Use **Environment Variables**.

## 1. Using `django-environ`

1.  **Install**:
    ```bash
    pip install django-environ
    ```

2.  **Create `.env` file**:
    Create this file in the root (same level as `manage.py`). **Add it to `.gitignore`**.

    ```ini
    DEBUG=on
    SECRET_KEY=your-secret-random-key
    DATABASE_URL=postgres://user:password@localhost:5432/dbname
    ```

3.  **Update `settings.py`**:

    ```python
    import environ
    import os

    env = environ.Env(
        # set casting, default value
        DEBUG=(bool, False)
    )

    # Read .env file
    environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

    DEBUG = env('DEBUG')
    SECRET_KEY = env('SECRET_KEY')

    # Auto-parsing database URL
    DATABASES = {
        'default': env.db(),
    }
    ```

## Benefits
-   **Security**: Secrets aren't in Git.
-   **Portability**: Same code runs in Dev, Stage, and Prod just by changing the `.env` file.

## Alternative: Split Settings
Instead of one `settings.py`, you can split them into multiple files.

1.  **`settings/base.py`**: Common settings.
2.  **`settings/dev.py`**: `from .base import *`, then output `DEBUG = True`.
3.  **`settings/prod.py`**: `from .base import *`, then `DEBUG = False`.

Run with:
```bash
python manage.py runserver --settings=myproject.settings.dev
```
