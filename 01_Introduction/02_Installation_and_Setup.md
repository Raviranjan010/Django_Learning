# Django Installation and Setup

Installing and setting up Django is a straightforward process. Below are the step-by-step instructions to install Django and set up a new Django project on your system.

**Prerequisite**: Before installing Django, make sure you have **Python** installed on your system.

## Step 1: Install Pip
Pip is the package installer for Python. Open your command prompt or terminal and ensure it's up to date:
```bash
python -m pip install -U pip
```

## Step 2: Set Up a Virtual Environment
Setting up a virtual environment allows you to manage dependencies for your project separately from your system-level packages. This prevents version conflicts.

### Create the Virtual Environment
Navigate to the directory where you want your project to reside.
```bash
# Create a virtual environment named 'env_site'
python -m venv env_site
```

### Activate the Virtual Environment
You need to activate the environment to use it.

**For Windows:**
```powershell
.\env_site\Scripts\activate.ps1
```

**For macOS/Linux:**
```bash
source env_site/bin/activate
```

*Once activated, you should see `(env_site)` in your terminal prompt.*

## Step 3: Install Django
With the virtual environment activated, install Django using pip:
```bash
pip install django
```

## Step 4: Verify Installation
To verify that Django has been installed correctly, you can check its version:
```bash
python -m django --version
```

## Step 5: Start a New Project (Preview)
Once installed, you can create a new project. (Detailed structure explanation in the next chapter).
```bash
django-admin startproject geeks_site
```

### Run the Server
Navigate into the project folder and start the development server:
```bash
cd geeks_site
python manage.py runserver
```

Open your web browser and go to `http://127.0.0.1:8000/`. You should see the Django welcome page.
