# Logging and Monitoring in Django

Proper logging is essential for debugging and monitoring your application in production.

## 1. Django Logging Configuration

Django uses Python’s built-in `logging` module.

### Hierarchy
- **Loggers**: The entry point for the logging system.
- **Handlers**: Determines where the log message goes (file, console, email).
- **Formatters**: Determines the format of the log message.
- **Filters**: Determines which log records to output.

### Basic Configuration (`settings.py`)

This configuration logs all INFO messages to the console and errors to a file.

```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': BASE_DIR / 'debug.log',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': True,
        },
        'myapp': {  # Your app name
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
            'propagate': False,
        },
    },
}
```

---

## 2. Using Loggers in Code

```python
import logging

# Get an instance of a logger
logger = logging.getLogger(__name__)

def my_view(request):
    try:
        result = 1 / 0
    except ZeroDivisionError:
        logger.error("Something went wrong!", exc_info=True)
    
    logger.info("View accessed successfully.")
```

---

## 3. Monitoring (Sentry)

Logs on a server are hard to read. Use **Sentry** for real-time error tracking.

1.  **Install**: `pip install sentry-sdk`
2.  **Configure (`settings.py`)**:

```python
import sentry_sdk

sentry_sdk.init(
    dsn="https://examplePublicKey@o0.ingest.sentry.io/0",
    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for performance monitoring.
    traces_sample_rate=1.0,
)
```

Sentry will now automatically capture unhandled exceptions and performance metrics.
