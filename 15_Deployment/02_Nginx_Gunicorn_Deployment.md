# Deploying with Nginx & Gunicorn

This guide assumes an Ubuntu VPS (like DigitalOcean).

## 1. Setup
Install dependencies:
```bash
sudo apt update
sudo apt install python3-venv python3-dev nginx curl
```

## 2. Gunicorn (Application Server)
Gunicorn translates HTTP requests into Python calls.

**Install**:
```bash
pip install gunicorn
```

**Systemd Service (`/etc/systemd/system/gunicorn.service`)**:
Configures Gunicorn to run as a background service.

```ini
[Unit]
Description=gunicorn daemon
Requires=gunicorn.socket
After=network.target

[Service]
User=root
Group=www-data
WorkingDirectory=/root/myprojectdir
ExecStart=/root/myprojectdir/venv/bin/gunicorn \
          --access-logfile - \
          --workers 3 \
          --bind unix:/run/gunicorn.sock \
          config.wsgi:application

[Install]
WantedBy=multi-user.target
```

**Start Service**:
```bash
sudo systemctl start gunicorn.socket
sudo systemctl enable gunicorn.socket
```

## 3. Nginx (Web Server / Reverse Proxy)
Nginx handles static files and proxies dynamic requests to Gunicorn.

**Config (`/etc/nginx/sites-available/myproject`)**:

```nginx
server {
    listen 80;
    server_name your_domain_or_IP;

    location = /favicon.ico { access_log off; log_not_found off; }
    
    # Serve Static Files
    location /static/ {
        root /root/myprojectdir;
    }

    # Proxy to Gunicorn
    location / {
        include proxy_params;
        proxy_pass http://unix:/run/gunicorn.sock;
    }
}
```

**Enable Site**:
```bash
sudo ln -s /etc/nginx/sites-available/myproject /etc/nginx/sites-enabled
sudo systemctl restart nginx
```
