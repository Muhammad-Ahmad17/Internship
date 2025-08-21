
# Part IV: DevOps/SRE on Linux - Beginner's Guide

This section teaches you DevOps (Development + Operations) and SRE (Site Reliability Engineering) concepts step by step. Think of DevOps as automating how software gets built and deployed, while SRE focuses on keeping systems running reliably.

## What is DevOps?
- **Development + Operations**: Combining coding with system management
- **Automation**: Making computers do repetitive tasks instead of humans
- **Reliability**: Ensuring your applications work consistently

## 1. CI/CD - Automatic Code Building and Deployment

### What is CI/CD?
- **CI (Continuous Integration)**: Automatically testing your code when you make changes
- **CD (Continuous Deployment)**: Automatically putting your tested code live
- Think of it like an assembly line for software

### Your First GitHub Action (Simple Example)

Let's create a simple workflow that runs when you push code:

```yaml
# Create this file: .github/workflows/my-first-workflow.yml
name: My First Workflow

# When should this run?
on:
  push:    # Every time you push code
    branches: [ main ]  # Only on the main branch

# What should happen?
jobs:
  say-hello:
    runs-on: ubuntu-latest  # Use an Ubuntu computer in the cloud
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4  # Download your code
      
    - name: Say hello
      run: echo "Hello, World! The code is working!"
      
    - name: List files
      run: ls -la  # Show what files we have
      
    - name: Show system info
      run: |
        echo "Who am I: $(whoami)"
        echo "Where am I: $(pwd)"
        echo "What Ubuntu version: $(lsb_release -a)"
```

**What happens here?**
1. When you push code to GitHub
2. GitHub gives you a free Ubuntu computer
3. It downloads your code
4. Runs the commands you specified
5. Shows you the results

### Practice Lab: Create Your First Action
```bash
# 1. Create a new repository on GitHub
# 2. Clone it to your computer
git clone https://github.com/yourusername/your-repo.git
cd your-repo

# 3. Create the workflow directory
mkdir -p .github/workflows

# 4. Create the workflow file
cat > .github/workflows/hello.yml << 'EOF'
name: Hello World

on: [push]

jobs:
  greet:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Greet
      run: echo "Hello from $(whoami) on $(date)"
EOF

# 5. Push to GitHub
git add .
git commit -m "Add my first workflow"
git push
```

## 2. Containers - Packaging Your Applications

### What are Containers?
- Think of containers like shipping containers for software
- They package your app with everything it needs to run
- Your app runs the same way everywhere (your laptop, servers, cloud)

### Docker Basics - Step by Step

**Installing Docker on Ubuntu:**
```bash
# 1. Update your system
sudo apt update

# 2. Install Docker
sudo apt install -y docker.io

# 3. Add yourself to the docker group (so you don't need sudo)
sudo usermod -aG docker $USER

# 4. Log out and back in, then test
docker --version
```

**Your First Container:**
```bash
# 1. Run a simple container
docker run hello-world
# This downloads and runs a tiny program that says hello

# 2. Run an interactive Ubuntu container
docker run -it ubuntu:22.04 /bin/bash
# Now you're inside a container! Try some commands:
whoami
ls
exit  # This leaves the container

# 3. Run a web server container
docker run -d -p 8080:80 nginx
# -d means "run in background"
# -p 8080:80 means "connect port 8080 on your computer to port 80 in container"

# 4. Check if it's working
curl http://localhost:8080
# You should see nginx welcome page

# 5. See what containers are running
docker ps

# 6. Stop the container
docker stop [container-id]
```

### Creating Your Own Container

**Step 1: Create a Simple Web App**
```bash
# Create a directory for your project
mkdir my-web-app
cd my-web-app

# Create a simple HTML file
cat > index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>My First Container App</title>
</head>
<body>
    <h1>Hello from my container!</h1>
    <p>This is running inside Docker</p>
    <p>Current time: <span id="time"></span></p>
    <script>
        document.getElementById('time').textContent = new Date().toLocaleString();
    </script>
</body>
</html>
EOF
```

**Step 2: Create a Dockerfile**
```dockerfile
# This file tells Docker how to build your container
# Save this as "Dockerfile" (no extension)

# Start with a base image that has a web server
FROM nginx:alpine

# Copy your HTML file to the web server directory
COPY index.html /usr/share/nginx/html/

# The container will listen on port 80
EXPOSE 80

# nginx starts automatically in this image
```

**Step 3: Build and Run Your Container**
```bash
# Build your container image
docker build -t my-web-app .
# -t means "tag" (give it a name)
# . means "look for Dockerfile in current directory"

# Run your container
docker run -d -p 3000:80 my-web-app

# Test it
curl http://localhost:3000
# or open http://localhost:3000 in your browser
```

## 3. Basic Server Management

### Understanding Linux Services

**What are Services?**
- Programs that run in the background
- They start when the computer boots
- Examples: web servers, databases, monitoring tools

**Managing Services with systemd:**
```bash
# See all services
systemctl list-units --type=service

# Check if a service is running
systemctl status nginx

# Start a service
sudo systemctl start nginx

# Stop a service
sudo systemctl stop nginx

# Make a service start at boot
sudo systemctl enable nginx

# Restart a service
sudo systemctl restart nginx

# See service logs
journalctl -u nginx -f  # -f means "follow" (live updates)
```

### Creating Your Own Service

Let's create a simple web service:

**Step 1: Create the Application**
```bash
# Create a simple Python web server
mkdir ~/my-service
cd ~/my-service

cat > app.py << 'EOF'
#!/usr/bin/env python3
import http.server
import socketserver
import datetime

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        
        html = f"""
        <html>
        <body>
            <h1>My Custom Service</h1>
            <p>Current time: {datetime.datetime.now()}</p>
            <p>This service is running!</p>
        </body>
        </html>
        """
        self.wfile.write(html.encode())

PORT = 8000
with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
    print(f"Server running at http://localhost:{PORT}")
    httpd.serve_forever()
EOF

chmod +x app.py
```

**Step 2: Create a systemd Service**
```bash
# Create the service file
sudo cat > /etc/systemd/system/my-service.service << 'EOF'
[Unit]
Description=My Custom Web Service
After=network.target

[Service]
Type=simple
User=ubuntu  # Change this to your username
WorkingDirectory=/home/ubuntu/my-service  # Change path to match yours
ExecStart=/home/ubuntu/my-service/app.py
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

# Tell systemd about the new service
sudo systemctl daemon-reload

# Start the service
sudo systemctl start my-service

# Check if it's working
curl http://localhost:8000

# Make it start at boot
sudo systemctl enable my-service
```

## 4. Basic Monitoring - Watching Your Systems

### Why Monitor?
- Know when something breaks before users complain
- Understand how your system performs
- Plan for growth

### Simple Monitoring with Basic Tools

**Check System Resources:**
```bash
# See CPU and memory usage
top
# Press 'q' to quit

# See disk usage
df -h

# See memory usage
free -h

# See network connections
ss -tulpn
```

**Monitor Your Service:**
```bash
# Watch your service logs in real-time
journalctl -u my-service -f

# Check if your service is responding
curl -I http://localhost:8000  # -I means "just show headers"

# Simple monitoring script
cat > monitor.sh << 'EOF'
#!/bin/bash

while true; do
    echo "=== $(date) ==="
    
    # Check if service is running
    if systemctl is-active --quiet my-service; then
        echo "✅ Service is running"
    else
        echo "❌ Service is down!"
    fi
    
    # Check if it responds to HTTP
    if curl -s http://localhost:8000 > /dev/null; then
        echo "✅ HTTP is working"
    else
        echo "❌ HTTP not responding!"
    fi
    
    echo "Memory usage: $(free -m | grep Mem: | awk '{printf "%.1f%%", $3/$2*100}')"
    echo "Disk usage: $(df -h / | tail -1 | awk '{print $5}')"
    echo "Load average: $(uptime | awk -F'load average:' '{print $2}')"
    echo ""
    
    sleep 30  # Check every 30 seconds
done
EOF

chmod +x monitor.sh
./monitor.sh
```

## 5. Basic Automation with Scripts

### Automating Common Tasks

**Backup Script:**
```bash
cat > backup.sh << 'EOF'
#!/bin/bash

# Simple backup script
BACKUP_DIR="/home/$(whoami)/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "Starting backup at $(date)"

# Backup your home directory (excluding some big folders)
tar -czf "$BACKUP_DIR/home_backup_$DATE.tar.gz" \
    --exclude="*.log" \
    --exclude="node_modules" \
    --exclude=".cache" \
    "$HOME"

echo "Backup completed: $BACKUP_DIR/home_backup_$DATE.tar.gz"

# Keep only last 5 backups
cd "$BACKUP_DIR"
ls -t home_backup_*.tar.gz | tail -n +6 | xargs -r rm

echo "Cleanup completed. Kept 5 most recent backups."
EOF

chmod +x backup.sh
./backup.sh
```

**Update Script:**
```bash
cat > update-system.sh << 'EOF'
#!/bin/bash

echo "🔄 Starting system update..."

# Update package lists
sudo apt update

echo "📦 Available updates:"
apt list --upgradable

read -p "Do you want to proceed with updates? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Install updates
    sudo apt upgrade -y
    
    # Clean up
    sudo apt autoremove -y
    sudo apt autoclean
    
    echo "✅ System updated successfully!"
    
    # Check if reboot is needed
    if [ -f /var/run/reboot-required ]; then
        echo "⚠️  Reboot required to complete updates"
        read -p "Reboot now? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            sudo reboot
        fi
    fi
else
    echo "❌ Update cancelled"
fi
EOF

chmod +x update-system.sh
```

### Scheduling Tasks with Cron

**What is Cron?**
- Cron runs commands automatically at scheduled times
- Like setting alarms for your computer to do tasks

**Basic Cron Usage:**
```bash
# Edit your cron jobs
crontab -e

# Add these lines to run tasks automatically:
# Run backup every day at 2 AM
0 2 * * * /home/yourusername/backup.sh

# Check if service is running every 5 minutes
*/5 * * * * systemctl is-active --quiet my-service || echo "Service down at $(date)" >> /home/yourusername/service-check.log

# Update system every Sunday at 3 AM
0 3 * * 0 /home/yourusername/update-system.sh

# See your scheduled jobs
crontab -l
```

**Cron Schedule Format:**
```
* * * * * command
│ │ │ │ │
│ │ │ │ └─ Day of week (0-7, Sunday = 0 or 7)
│ │ │ └─── Month (1-12)
│ │ └───── Day of month (1-31)
│ └─────── Hour (0-23)
└───────── Minute (0-59)

Examples:
0 8 * * *     # Every day at 8 AM
30 18 * * 5   # Every Friday at 6:30 PM
0 0 1 * *     # First day of every month at midnight
*/15 * * * *  # Every 15 minutes
```

## 6. Basic Security

### Why Security Matters
- Protect your data and systems
- Prevent unauthorized access
- Keep your services running

### Simple Security Steps

**1. Keep Your System Updated**
```bash
# Check for updates weekly
sudo apt update && sudo apt list --upgradable

# Install security updates
sudo unattended-upgrades  # or sudo apt upgrade
```

**2. Basic Firewall Setup**
```bash
# Ubuntu comes with ufw (Uncomplicated Firewall)
sudo ufw status

# Allow SSH (so you don't lock yourself out)
sudo ufw allow ssh

# Allow your web service
sudo ufw allow 8000

# Allow HTTP and HTTPS
sudo ufw allow http
sudo ufw allow https

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status verbose
```

**3. Check Who's Logged In**
```bash
# See who's currently logged in
who

# See login history
last

# Check failed login attempts
sudo grep "Failed password" /var/log/auth.log | tail -10
```

**4. Secure Your SSH**
```bash
# Edit SSH configuration
sudo nano /etc/ssh/sshd_config

# Make these changes:
# Port 22                    # Consider changing to different port
# PermitRootLogin no         # Don't allow root to login directly
# PasswordAuthentication no  # Use SSH keys instead of passwords
# MaxAuthTries 3            # Limit login attempts

# After changes, restart SSH
sudo systemctl restart ssh
```

### Simple Log Monitoring

**Check Important Logs:**
```bash
# System messages
sudo tail -f /var/log/syslog

# Authentication logs
sudo tail -f /var/log/auth.log

# Service-specific logs
journalctl -u my-service -f

# Simple security check script
cat > security-check.sh << 'EOF'
#!/bin/bash

echo "=== Security Check $(date) ==="

# Check for failed login attempts in last 24 hours
echo "❌ Failed login attempts:"
sudo grep "Failed password" /var/log/auth.log | grep $(date +%Y-%m-%d) | wc -l

# Check open ports
echo "🔌 Open ports:"
ss -tulpn | grep LISTEN

# Check running services
echo "🔄 Active services:"
systemctl list-units --type=service --state=active | wc -l

# Check disk usage
echo "💾 Disk usage:"
df -h / | tail -1 | awk '{print $5}'

# Check system load
echo "⚡ System load:"
uptime

echo "✅ Security check complete"
EOF

chmod +x security-check.sh
./security-check.sh
```

## 7. Putting It All Together - A Complete Example

Let's create a complete setup with monitoring:

**Step 1: Enhanced Web Service**
```bash
mkdir ~/complete-service
cd ~/complete-service

cat > app.py << 'EOF'
#!/usr/bin/env python3
import http.server
import socketserver
import json
import datetime
import psutil  # pip3 install psutil

class HealthHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.serve_homepage()
        elif self.path == '/health':
            self.serve_health()
        elif self.path == '/metrics':
            self.serve_metrics()
        else:
            self.send_error(404)
    
    def serve_homepage(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        
        html = f"""
        <html>
        <head><title>My Service</title></head>
        <body>
            <h1>My Complete Service</h1>
            <p>Status: Running ✅</p>
            <p>Time: {datetime.datetime.now()}</p>
            <p><a href="/health">Health Check</a></p>
            <p><a href="/metrics">Metrics</a></p>
        </body>
        </html>
        """
        self.wfile.write(html.encode())
    
    def serve_health(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        health = {
            "status": "healthy",
            "timestamp": datetime.datetime.now().isoformat(),
            "uptime_seconds": int(datetime.datetime.now().timestamp())
        }
        self.wfile.write(json.dumps(health).encode())
    
    def serve_metrics(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()
        
        # Simple metrics in Prometheus format
        metrics = f"""# HELP cpu_usage CPU usage percentage
# TYPE cpu_usage gauge
cpu_usage {psutil.cpu_percent()}

# HELP memory_usage Memory usage percentage  
# TYPE memory_usage gauge
memory_usage {psutil.virtual_memory().percent}

# HELP disk_usage Disk usage percentage
# TYPE disk_usage gauge
disk_usage {psutil.disk_usage('/').percent}
"""
        self.wfile.write(metrics.encode())

PORT = 8000
with socketserver.TCPServer(("", PORT), HealthHandler) as httpd:
    print(f"Server running at http://localhost:{PORT}")
    httpd.serve_forever()
EOF

# Install required Python package
pip3 install psutil
```

**Step 2: Monitoring Script**
```bash
cat > monitor-service.sh << 'EOF'
#!/bin/bash

LOG_FILE="$HOME/service-monitor.log"

log_message() {
    echo "$(date): $1" | tee -a "$LOG_FILE"
}

check_service() {
    if systemctl is-active --quiet my-complete-service; then
        log_message "✅ Service is running"
        
        # Check HTTP response
        if curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/health | grep -q "200"; then
            log_message "✅ Health check passed"
        else
            log_message "❌ Health check failed"
        fi
    else
        log_message "❌ Service is down"
        # Try to restart it
        sudo systemctl start my-complete-service
        log_message "🔄 Attempted to restart service"
    fi
}

# Run the check
check_service

# If running with --loop, keep checking
if [ "$1" = "--loop" ]; then
    while true; do
        sleep 60  # Check every minute
        check_service
    done
fi
EOF

chmod +x monitor-service.sh
```

**Step 3: Create the Service**
```bash
sudo cat > /etc/systemd/system/my-complete-service.service << EOF
[Unit]
Description=My Complete Web Service
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$HOME/complete-service
ExecStart=$HOME/complete-service/app.py
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# Start the service
sudo systemctl daemon-reload
sudo systemctl enable --now my-complete-service
```

**Step 4: Set Up Automated Monitoring**
```bash
# Add monitoring to cron
(crontab -l 2>/dev/null; echo "*/5 * * * * $HOME/complete-service/monitor-service.sh") | crontab -

# Test everything
curl http://localhost:8000
curl http://localhost:8000/health
curl http://localhost:8000/metrics
```

## Practice Labs Summary

### Lab 1: Basic CI/CD
1. Create a GitHub repository
2. Add a simple workflow
3. Watch it run when you push code

### Lab 2: Container Basics  
1. Install Docker
2. Run some containers
3. Build your own container

### Lab 3: Service Management
1. Create a simple service
2. Make it start automatically
3. Monitor its logs

### Lab 4: Basic Monitoring
1. Write monitoring scripts
2. Set up automated checks
3. Create alerts for problems

### Lab 5: Automation
1. Create backup scripts
2. Schedule tasks with cron
3. Automate system updates

## What You've Learned

By completing this section, you now understand:

- **CI/CD**: How to automatically build and deploy code
- **Containers**: How to package applications for consistent deployment
- **Services**: How to run applications as background services
- **Monitoring**: How to watch your systems and detect problems
- **Automation**: How to make computers do repetitive tasks
- **Security**: Basic steps to protect your systems

## Next Steps

1. Practice these concepts with your own projects
2. Explore more advanced tools as you get comfortable
3. Join communities (Reddit r/DevOps, Discord servers)
4. Read documentation for tools you use
5. Start small and gradually add complexity

Remember: DevOps is about making life easier through automation. Start with simple scripts and gradually build more sophisticated systems as you learn!

---

## Simple Glossary

**Automation**: Making computers do tasks automatically instead of manually

**CI/CD**: Continuous Integration/Continuous Deployment - automatically testing and deploying code

**Container**: A package containing your app and everything it needs to run

**Docker**: Popular tool for creating and running containers

**Service**: A program that runs in the background on your computer

**systemd**: Linux system for managing services

**Cron**: Linux scheduler for running tasks at specific times

**Monitoring**: Watching your systems to make sure they're working properly

**Logs**: Text files that record what programs are doing

**Firewall**: Software that controls network access to your computer

**SSH**: Secure way to connect to other computers over the network

**API**: Application Programming Interface - how programs talk to each other

**JSON**: A format for storing and sending data between programs

**HTTP**: The protocol used by web browsers and web servers

**Port**: A number that identifies which service to connect to on a computer

**Process**: A running program on your computer

**Root**: The administrator account on Linux systems

**sudo**: Command that lets you run things as administrator

**Repository**: A place where code is stored (like GitHub)

**Workflow**: A series of automated steps in CI/CD

**Image**: A template for creating containers

**Dockerfile**: Instructions for building a container image

**Registry**: A place where container images are stored

**Load**: How busy your computer is

**Uptime**: How long your computer has been running without restart