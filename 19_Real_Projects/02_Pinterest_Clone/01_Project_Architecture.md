# Pinterest Clone - Project Architecture

We are building a clean, scalable Pinterest Clone with authentication, masonry layout, and social features.

## 1. Directory Structure

```text
pinterest_clone/
│
├── config/                 # Main Django project settings/urls
│
├── accounts/               # Custom User & Profile management
├── pins/                   # Core functionality (Pin creation, listing)
├── boards/                 # Collections of Pins
├── social/                 # Likes and Comments logic
│
├── templates/              # HTML files
├── static/                 # CSS/JS
└── manage.py
```

## 2. Environment Setup

```bash
# 1. Create Environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# 2. Install Dependencies
pip install django pillow

# 3. Create Project
django-admin startproject config .

# 4. Create Apps
python manage.py startapp accounts
python manage.py startapp pins
python manage.py startapp boards
python manage.py startapp social
```

## 3. Register Apps

In `config/settings.py`:
```python
INSTALLED_APPS = [
    # ... django apps ...
    'accounts',
    'pins',
    'boards',
    'social',
]

# Media Handling
import os
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
```
