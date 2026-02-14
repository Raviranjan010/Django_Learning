# Connecting Databases to Django

Django uses SQLite as the default database for development. For production, **PostgreSQL** or **MySQL** are recommended.

## 1. Connecting MySQL

### Step 1: Install MySQL
- **Windows**: Download MySQL Installer from [dev.mysql.com](https://dev.mysql.com/downloads/installer/).
- **macOS**: Use Homebrew: `brew install mysql`.

### Step 2: Install Connector
Install `mysqlclient`, the database driver for Django.
```bash
pip install mysqlclient
```

### Step 3: Create Database
Log in to MySQL and create a database:
```sql
CREATE DATABASE mydb;
```

### Step 4: Configure `settings.py`
Replace the default SQLite configuration:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'mydb',
        'USER': 'root',
        'PASSWORD': 'your_mysql_password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

## 2. Connecting PostgreSQL

PostgreSQL is often considered the best database for Django.

### Step 1: Install PostgreSQL
- Download and set up PostgreSQL from the official website.
- Create a database (e.g., `gfg`).

### Step 2: Install Driver
Install `psycopg2` (or `psycopg2-binary` for dev):
```bash
pip install psycopg2
```

### Step 3: Configure `settings.py`
```python
DATABASES = {
   'default': {
       'ENGINE': 'django.db.backends.postgresql',
       'NAME': 'gfg',
       'USER': 'your_postgres_username',
       'PASSWORD': 'your_password',
       'HOST': 'localhost',
       'PORT': '5432',
   }
}
```

## 3. General Steps After Switching Database
Whenever you change `DATABASES` settings, you must run:

1.  **Make Migrations**: `python manage.py makemigrations`
2.  **Migrate**: `python manage.py migrate`
3.  **Create Superuser**: `python manage.py createsuperuser`
4.  **Run Server**: `python manage.py runserver`
