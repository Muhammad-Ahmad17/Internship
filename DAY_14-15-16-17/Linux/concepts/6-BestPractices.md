# Part VI: Best Practices and Ops Playbooks

This section covers essential operational knowledge for managing Linux systems effectively. We'll explore file system organization, system maintenance, resource management, automation, troubleshooting, and standardized procedures to ensure reliable and secure operations.

## 1. Filesystem Hierarchy and Permissions

### Understanding the Linux Filesystem Hierarchy

The Linux filesystem has a standardized directory structure with specific purposes:

```
/                 # Root directory
├── bin/          # Essential command binaries for all users
├── boot/         # Boot loader files and kernel
├── dev/          # Device files
├── etc/          # System-wide configuration files
├── home/         # User home directories
├── lib/ & /lib64/# Shared libraries needed by programs
├── media/        # Mount points for removable media
├── mnt/          # Mount point for temporary filesystems
├── opt/          # Optional application software packages
├── proc/         # Virtual filesystem for process and kernel info
├── root/         # Home directory for root user
├── run/          # Run-time variable data
├── sbin/         # System binaries
├── srv/          # Data for services provided by the system
├── sys/          # Virtual filesystem for system information
├── tmp/          # Temporary files
├── usr/          # Secondary hierarchy (user programs, data)
└── var/          # Variable data (logs, databases, websites)
```

**Best Practices for Directory Usage:**

```bash
# Application binaries (choose one approach)
/usr/local/bin/myapp                # For locally compiled applications
/opt/myapp/bin/myapp                # For self-contained applications
/usr/bin/myapp                      # For package-managed applications

# Application configuration
/etc/myapp/                         # System-wide configuration

# Variable application data
/var/lib/myapp/                     # Application data
/var/log/myapp/                     # Log files
/var/cache/myapp/                   # Cache files
/var/run/myapp/ or /run/myapp/      # Runtime data (PID files, sockets)

# User configuration
$HOME/.config/myapp/                # User-specific configuration
```

### File Permissions and Ownership

**Basic Permissions:**

```bash
# View permissions
ls -l /path/to/file

# Format explanation:
# -rw-r--r--  1 user group  4096 Jan  1 12:00 file.txt
# |[-][-][-]  | |    |      |    |          |
# | |  |  |   | |    |      |    |          +-> filename
# | |  |  |   | |    |      |    +-> modification time
# | |  |  |   | |    |      +-> size
# | |  |  |   | |    +-> group owner
# | |  |  |   | +-> user owner
# | |  |  |   +-> number of links
# | |  |  +-> permissions for others (r: read)
# | |  +-> permissions for group (r: read)
# | +-> permissions for user (rw: read, write)
# +-> file type (- regular, d directory, l link)

# Change file permissions
chmod 755 file.sh             # rwxr-xr-x (executable script)
chmod 644 file.txt            # rw-r--r-- (readable text file)
chmod 600 private_key         # rw------- (private key)
chmod 700 script.sh           # rwx------ (private executable)
chmod +x script.sh            # Make executable
chmod -R 755 directory/       # Recursively change directory

# Change file ownership
chown user:group file.txt
chown -R user:group directory/
```

**Understanding Permission Numbers:**

```
7 = rwx = 4+2+1 = read+write+execute
6 = rw- = 4+2+0 = read+write
5 = r-x = 4+0+1 = read+execute
4 = r-- = 4+0+0 = read only
3 = -wx = 0+2+1 = write+execute
2 = -w- = 0+2+0 = write only
1 = --x = 0+0+1 = execute only
0 = --- = 0+0+0 = no permissions
```

### umask - Setting Default Permissions

**Understanding umask:**

```bash
# Check current umask
umask

# Common umask values:
# 022 - Default for most systems (dirs: 755, files: 644)
# 002 - Group writable (dirs: 775, files: 664)
# 077 - Private (dirs: 700, files: 600)

# Set umask for current session
umask 022

# Calculate permissions:
# For directories: 777 - umask = resulting permission
# For files: 666 - umask = resulting permission
#
# Example with umask 022:
# Directories: 777 - 022 = 755 (rwxr-xr-x)
# Files: 666 - 022 = 644 (rw-r--r--)
```

**Setting Default umask:**

```bash
# For all users, add to /etc/profile or /etc/bash.bashrc:
umask 022

# For a specific user, add to ~/.bashrc:
umask 022
```

### ACLs - Advanced Permission Control

**Working with Access Control Lists:**

```bash
# Install ACL utilities
sudo apt install acl

# Check if filesystem supports ACLs
sudo tune2fs -l /dev/sda1 | grep "Default mount options"
# Should include "acl" in the output

# View ACLs for a file
getfacl filename

# Set ACL for a user
setfacl -m u:username:rwx filename  # Give user rwx permissions

# Set ACL for a group
setfacl -m g:groupname:rx filename   # Give group rx permissions

# Remove specific ACL
setfacl -x u:username filename       # Remove user ACL

# Set default ACLs for a directory (inherited by new files)
setfacl -d -m u:username:rwx directory/

# Recursive ACL application
setfacl -R -m u:username:rwx directory/
```

**Example Use Case:**

```bash
# Create a shared project directory
sudo mkdir -p /opt/project

# Set base permissions
sudo chmod 770 /opt/project
sudo chown root:project /opt/project

# Add ACLs for specific users
sudo setfacl -m u:alice:rwx /opt/project
sudo setfacl -m u:bob:rx /opt/project

# Set default ACLs for new files
sudo setfacl -d -m u::rwx,g::rwx,o::- /opt/project
sudo setfacl -d -m u:alice:rwx /opt/project
sudo setfacl -d -m u:bob:rx /opt/project

# View resulting ACLs
getfacl /opt/project
```

## 2. System Updates and Maintenance

### System Updates

**Updating Package Repositories:**

```bash
# Debian/Ubuntu
sudo apt update

# Red Hat/CentOS/Fedora
sudo dnf check-update   # CentOS 8+/Fedora
sudo yum check-update   # CentOS 7
```

**Installing Updates:**

```bash
# Debian/Ubuntu
sudo apt upgrade         # Update all packages
sudo apt dist-upgrade    # Update with package changes/removals

# Red Hat/CentOS/Fedora
sudo dnf upgrade         # CentOS 8+/Fedora
sudo yum update          # CentOS 7
```

**Automatic Updates Setup:**

```bash
# On Ubuntu/Debian:
sudo apt install unattended-upgrades apt-listchanges

# Configure automatic updates
sudo nano /etc/apt/apt.conf.d/50unattended-upgrades

# Enable automatic updates
sudo nano /etc/apt/apt.conf.d/20auto-upgrades
# Add these lines:
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::Download-Upgradeable-Packages "1";
APT::Periodic::AutocleanInterval "7";

# Test the configuration
sudo unattended-upgrades --dry-run

# Check logs
cat /var/log/unattended-upgrades/unattended-upgrades.log
```

### Kernel Updates

**Checking Kernel Version:**

```bash
# Check current kernel version
uname -r

# List all installed kernels
dpkg --list | grep linux-image  # Debian/Ubuntu
rpm -q kernel                  # Red Hat/CentOS/Fedora
```

**Updating Kernel:**

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install --install-recommends linux-generic

# Red Hat/CentOS/Fedora
sudo dnf update kernel         # CentOS 8+/Fedora
sudo yum update kernel         # CentOS 7

# After kernel update, reboot is required
sudo reboot
```

**Live Kernel Patching (Ubuntu):**

```bash
# Ubuntu 18.04+
sudo apt install canonical-livepatch
sudo canonical-livepatch enable YOUR_TOKEN_HERE

# Check status
canonical-livepatch status
```

### Reboot Strategy

**Checking if Reboot is Needed:**

```bash
# Debian/Ubuntu
[ -f /var/run/reboot-required ] && cat /var/run/reboot-required

# Red Hat/CentOS/Fedora
needs-restarting -r  # Returns 0 if reboot needed
```

**Planning Reboots:**

```bash
# Schedule a reboot
sudo shutdown -r +60 "System will reboot in 60 minutes for maintenance"

# Cancel scheduled reboot
sudo shutdown -c

# Check for users before rebooting
who
w

# Notify users about upcoming reboot
wall "System will reboot in 30 minutes for maintenance. Please save your work."
```

**Minimizing Downtime:**

```bash
# Check uptime before reboot
uptime

# Check services that will be affected
systemctl list-units --type=service --state=running

# Set up automatic service restart
sudo systemctl enable nginx mysql

# Create a reboot checklist script
cat > ~/reboot-checklist.sh << 'EOF'
#!/bin/bash
# Pre-reboot checks
echo "=== Pre-reboot Checklist ==="
echo "1. Current uptime: $(uptime)"
echo "2. Logged in users:"
who
echo "3. Critical services status:"
systemctl status nginx mysql | grep Active
echo "4. Load average: $(cat /proc/loadavg)"

# Wait for user confirmation
read -p "Proceed with reboot? (y/n): " confirm
if [[ $confirm == [yY] ]]; then
  sudo shutdown -r now "Scheduled reboot"
fi
EOF

chmod +x ~/reboot-checklist.sh
```

## 3. Resource Management

### System Resource Limits

**Viewing Current Limits:**

```bash
# View limits for current shell
ulimit -a

# View specific limits
ulimit -n  # Number of open files
ulimit -u  # Max user processes
ulimit -v  # Virtual memory
```

**Setting User Limits:**

```bash
# Edit system-wide limits
sudo nano /etc/security/limits.conf

# Add these lines for a specific user:
username soft nofile 4096
username hard nofile 65536
username soft nproc 2048
username hard nproc 4096

# Add these lines for all users:
* soft nofile 4096
* hard nofile 65536

# For a specific group:
@groupname soft nofile 4096
@groupname hard nofile 65536
```

**Setting Temporary Limits for a Process:**

```bash
# Run a command with specific limits
ulimit -n 4096 && mycommand

# Or for a specific application
sudo -u username bash -c "ulimit -n 4096 && myapplication"
```

### Kernel Parameter Tuning with sysctl

**Viewing Current Kernel Parameters:**

```bash
# View all parameters
sudo sysctl -a

# View specific parameter
sudo sysctl net.ipv4.tcp_keepalive_time

# View from /proc
cat /proc/sys/net/ipv4/tcp_keepalive_time
```

**Modifying Parameters Temporarily:**

```bash
# Set parameter until next reboot
sudo sysctl -w net.ipv4.tcp_keepalive_time=600

# Or directly via proc
echo 600 | sudo tee /proc/sys/net/ipv4/tcp_keepalive_time
```

**Making Changes Permanent:**

```bash
# Create a configuration file
sudo nano /etc/sysctl.d/99-custom.conf

# Add parameters
net.ipv4.tcp_keepalive_time = 600
net.ipv4.tcp_max_syn_backlog = 4096
net.core.somaxconn = 4096
vm.swappiness = 10
fs.file-max = 2097152

# Apply changes
sudo sysctl -p /etc/sysctl.d/99-custom.conf
```

**Common Performance Tuning Parameters:**

```bash
# Network performance
net.core.somaxconn = 4096                   # Connection queue size
net.core.netdev_max_backlog = 10000         # Network buffer queue
net.ipv4.tcp_max_syn_backlog = 4096         # SYN request queue size
net.ipv4.tcp_fin_timeout = 30               # Time to keep sockets in FIN-WAIT-2
net.ipv4.tcp_keepalive_time = 600           # Keepalive time
net.ipv4.tcp_tw_reuse = 1                   # Reuse TIME-WAIT sockets

# File system and I/O
fs.file-max = 2097152                      # Max number of file handles
vm.dirty_ratio = 10                        # % of memory before write to disk
vm.dirty_background_ratio = 5              # % of memory before background write

# Memory management
vm.swappiness = 10                         # Reduce swap usage (0-100)
vm.min_free_kbytes = 65536                 # Min free memory
```

### Control Groups (cgroups)

**Understanding cgroups:**

Cgroups allow you to limit, prioritize, and isolate resource usage for process groups.

**cgroups v1 (Traditional):**

```bash
# Check available controllers
ls /sys/fs/cgroup/

# Create a new group for memory control
sudo mkdir /sys/fs/cgroup/memory/mygroup

# Set memory limit (100MB)
echo 104857600 | sudo tee /sys/fs/cgroup/memory/mygroup/memory.limit_in_bytes

# Add a process to the group
echo $PID | sudo tee /sys/fs/cgroup/memory/mygroup/cgroup.procs

# View stats
cat /sys/fs/cgroup/memory/mygroup/memory.usage_in_bytes
```

**cgroups v2 (Modern):**

```bash
# Check if using cgroups v2
ls /sys/fs/cgroup/cgroup.controllers

# Create a new group
sudo mkdir /sys/fs/cgroup/mygroup

# Enable controllers
echo "+memory +cpu" | sudo tee /sys/fs/cgroup/mygroup/cgroup.subtree_control

# Set memory limit (100MB)
echo 104857600 | sudo tee /sys/fs/cgroup/mygroup/memory.max

# Set CPU limit (25% of one CPU)
echo 25000 | sudo tee /sys/fs/cgroup/mygroup/cpu.max

# Add a process to the group
echo $PID | sudo tee /sys/fs/cgroup/mygroup/cgroup.procs
```

**Using Systemd Resource Controls:**

```bash
# Create a systemd service with resource limits
sudo nano /etc/systemd/system/myapp.service

[Unit]
Description=My Application
After=network.target

[Service]
ExecStart=/usr/local/bin/myapp
User=myapp
Group=myapp

# Memory limits
MemoryLimit=100M
MemoryAccounting=true

# CPU limits
CPUQuota=25%
CPUAccounting=true

# I/O limits
IOWeight=500
IOAccounting=true

[Install]
WantedBy=multi-user.target
```

**Monitoring Resource Usage:**

```bash
# Check memory usage
systemctl status myapp | grep Memory

# Detailed resource usage
systemd-cgtop

# Service specific usage
systemctl show myapp -p MemoryCurrent
```

## 4. Service Management and Automation

### Startup Scripts and Service Management

**Creating a Simple Systemd Service:**

```bash
# Create service file
sudo nano /etc/systemd/system/myapp.service

[Unit]
Description=My Application Service
After=network.target

[Service]
Type=simple
User=myapp
WorkingDirectory=/opt/myapp
ExecStart=/opt/myapp/bin/myapp --config /etc/myapp/config.yml
Restart=on-failure
RestartSec=5s
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

**Handling Service Dependencies:**

```bash
# Service that depends on others
sudo nano /etc/systemd/system/webapp.service

[Unit]
Description=Web Application
After=network.target postgresql.service redis.service
Requires=postgresql.service
Wants=redis.service

[Service]
ExecStart=/opt/webapp/bin/webapp
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

**Managing Services:**

```bash
# Enable service to start at boot
sudo systemctl enable myapp

# Start service now
sudo systemctl start myapp

# Check status
sudo systemctl status myapp

# Stop service
sudo systemctl stop myapp

# Restart service
sudo systemctl restart myapp

# Reload configuration (if supported)
sudo systemctl reload myapp

# View service logs
journalctl -u myapp
```

### Systemd Templates

Systemd templates let you create multiple instances of a service from one template file.

**Creating a Template Service:**

```bash
# Create template file
sudo nano /etc/systemd/system/worker@.service

[Unit]
Description=Worker Service Instance %i
After=network.target

[Service]
Type=simple
User=worker
ExecStart=/opt/worker/bin/worker --instance %i --config /etc/worker/worker-%i.conf
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

**Using Template Instances:**

```bash
# Enable and start instances
sudo systemctl enable worker@1
sudo systemctl enable worker@2
sudo systemctl enable worker@3

sudo systemctl start worker@1
sudo systemctl start worker@2
sudo systemctl start worker@3

# Check status of all instances
systemctl status 'worker@*'

# Restart all instances
sudo systemctl restart 'worker@*'
```

### Systemd Timers (Cron Alternative)

**Creating a Simple Timer:**

```bash
# Create service file for the task
sudo nano /etc/systemd/system/backup.service

[Unit]
Description=Daily Backup Task

[Service]
Type=oneshot
ExecStart=/opt/scripts/backup.sh
User=backup
```

```bash
# Create timer file
sudo nano /etc/systemd/system/backup.timer

[Unit]
Description=Run backup daily at 2am

[Timer]
OnCalendar=*-*-* 02:00:00
Persistent=true
AccuracySec=1s

[Install]
WantedBy=timers.target
```

**Managing Timers:**

```bash
# Enable and start timer
sudo systemctl enable backup.timer
sudo systemctl start backup.timer

# List all timers
systemctl list-timers

# Run service manually (without waiting for timer)
sudo systemctl start backup.service
```

**Advanced Timer Examples:**

```bash
# Run every 15 minutes
OnCalendar=*:0/15

# Run every hour
OnCalendar=hourly

# Run weekly on Monday at 3am
OnCalendar=Mon 03:00:00

# Run on the first day of each month
OnCalendar=*-*-01 00:00:00

# Run 10 minutes after boot
OnBootSec=10min
```

### Automating Routine Tasks

**Simple Backup Script:**

```bash
#!/bin/bash
# /opt/scripts/backup.sh

set -e

# Configuration
BACKUP_DIR="/var/backups/daily"
SOURCE_DIRS=("/etc" "/var/www" "/home")
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
RETENTION_DAYS=7
LOG_FILE="/var/log/backup.log"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "$(date): Starting backup" | tee -a "$LOG_FILE"

# Create backup archives
for dir in "${SOURCE_DIRS[@]}"; do
    base_dir=$(basename "$dir")
    backup_file="$BACKUP_DIR/${base_dir}-${TIMESTAMP}.tar.gz"
    echo "Backing up $dir to $backup_file" | tee -a "$LOG_FILE"
    tar czf "$backup_file" "$dir" 2>> "$LOG_FILE"
done

# Clean up old backups
echo "Removing backups older than $RETENTION_DAYS days" | tee -a "$LOG_FILE"
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo "$(date): Backup completed" | tee -a "$LOG_FILE"
```

**Monitoring Script for Systemd Service:**

```bash
#!/bin/bash
# /opt/scripts/monitor-services.sh

SERVICES=("nginx" "postgresql" "redis-server" "myapp")
NOTIFY_EMAIL="admin@example.com"
LOG_FILE="/var/log/service-monitor.log"

check_service() {
    local service=$1
    if ! systemctl is-active --quiet "$service"; then
        message="Service $service is down on $(hostname) at $(date)"
        echo "$message" | tee -a "$LOG_FILE"
        
        # Try to restart
        echo "Attempting to restart $service" | tee -a "$LOG_FILE"
        systemctl restart "$service"
        
        # Check if restart was successful
        if systemctl is-active --quiet "$service"; then
            message="Service $service was restarted successfully"
        else
            message="CRITICAL: Failed to restart $service"
            # Send email alert
            echo "$message" | mail -s "Service Down: $service on $(hostname)" "$NOTIFY_EMAIL"
        fi
        echo "$message" | tee -a "$LOG_FILE"
    else
        echo "$(date): Service $service is running" >> "$LOG_FILE"
    fi
}

# Check all services
for service in "${SERVICES[@]}"; do
    check_service "$service"
done
```

## 5. Incident Response and Troubleshooting

### Log Collection and Analysis

**Important Log Files:**

```bash
# System logs
/var/log/syslog        # General system logs
/var/log/messages      # General messages (RHEL/CentOS)
/var/log/dmesg         # Kernel ring buffer
/var/log/auth.log      # Authentication logs (Ubuntu/Debian)
/var/log/secure        # Authentication logs (RHEL/CentOS)
/var/log/kern.log      # Kernel logs
/var/log/cron          # Cron job logs

# Application logs
/var/log/nginx/        # Nginx web server logs
/var/log/apache2/      # Apache web server logs
/var/log/mysql/        # MySQL database logs
/var/log/postgresql/   # PostgreSQL database logs

# Journal logs (systemd)
journalctl            # All logs
```

**Log Analysis Tools:**

```bash
# Basic log viewing
less /var/log/syslog
tail -f /var/log/syslog

# Grep for specific errors
grep "error" /var/log/syslog
grep -i "failed" /var/log/auth.log

# View systemd journal logs
journalctl -u nginx --since "1 hour ago"
journalctl -p err..emerg  # Show only errors and above
journalctl -f             # Follow new entries

# Using custom filters
journalctl PRIORITY=3 _SYSTEMD_UNIT=sshd.service

# Install and use lnav (log navigator)
sudo apt install lnav
lnav /var/log/syslog /var/log/auth.log
```

**Creating a Log Analysis Script:**

```bash
#!/bin/bash
# /opt/scripts/log-analyzer.sh

LOG_FILES=(/var/log/syslog /var/log/auth.log /var/log/nginx/error.log)
SEARCH_PATTERNS=("error" "critical" "fail" "denied" "segfault" "fatal")
REPORT_FILE="/var/log/analysis-$(date +%Y%m%d).txt"

echo "Log Analysis Report - $(date)" > "$REPORT_FILE"
echo "============================" >> "$REPORT_FILE"

for log_file in "${LOG_FILES[@]}"; do
    if [ -f "$log_file" ]; then
        echo -e "\nAnalyzing $log_file:" >> "$REPORT_FILE"
        echo "------------------" >> "$REPORT_FILE"
        
        # Get general stats
        echo "Total lines: $(wc -l < "$log_file")" >> "$REPORT_FILE"
        
        # Search for error patterns
        for pattern in "${SEARCH_PATTERNS[@]}"; do
            count=$(grep -i "$pattern" "$log_file" | wc -l)
            echo "\"$pattern\" occurrences: $count" >> "$REPORT_FILE"
            
            if [ "$count" -gt 0 ]; then
                echo -e "\nLatest \"$pattern\" entries:" >> "$REPORT_FILE"
                grep -i "$pattern" "$log_file" | tail -5 >> "$REPORT_FILE"
                echo "" >> "$REPORT_FILE"
            fi
        done
    else
        echo "File $log_file does not exist" >> "$REPORT_FILE"
    fi
done

echo "Analysis complete. Report saved to $REPORT_FILE"
```

### Network Troubleshooting and Packet Capture

**Network Diagnostic Tools:**

```bash
# Check connectivity
ping -c 4 google.com

# Trace route to a host
traceroute google.com

# DNS lookup
dig google.com
nslookup google.com

# Check listening ports
sudo netstat -tunapl
sudo ss -tunapl

# Check specific port
sudo lsof -i :80
sudo ss -tln | grep :80

# Check network interfaces
ip addr show
ifconfig
```

**Packet Capture with tcpdump:**

```bash
# List available interfaces
ip addr show

# Basic capture on an interface
sudo tcpdump -i eth0

# Capture specific protocols
sudo tcpdump -i eth0 tcp

# Capture specific port
sudo tcpdump -i eth0 port 80

# Capture traffic from/to specific IP
sudo tcpdump -i eth0 host 192.168.1.1

# Save capture to file
sudo tcpdump -i eth0 -w capture.pcap

# Read from capture file
sudo tcpdump -r capture.pcap

# Filter HTTP traffic
sudo tcpdump -i eth0 port 80 -A | grep "GET\|POST"

# Filter specific hosts and ports
sudo tcpdump -i eth0 'host 192.168.1.10 and (port 80 or port 443)'
```

**Advanced Packet Analysis:**

```bash
# Install Wireshark for CLI analysis
sudo apt install tshark

# Capture with TShark
sudo tshark -i eth0 -f "port 80"

# Analyze specific protocols
sudo tshark -i eth0 -Y "http"
sudo tshark -i eth0 -Y "tcp.port == 443"

# Extract HTTP requests
sudo tshark -i eth0 -Y "http.request" -T fields -e http.host -e http.request.uri

# Analyze captured files
sudo tshark -r capture.pcap -Y "http"
```

### Process and Performance Tracing

**Process Monitoring:**

```bash
# View running processes
ps aux
ps -ef

# Find processes by name
pgrep nginx
ps aux | grep nginx

# View process tree
pstree
pstree -p  # Show PIDs

# Monitor processes in real-time
top
htop  # More user-friendly alternative

# Process details
ps -p 1234 -f
ls -l /proc/1234/
cat /proc/1234/status
```

**System Performance Monitoring:**

```bash
# CPU and memory overview
free -h
vmstat 1
mpstat -P ALL 1

# Disk I/O
iostat -x 1
iotop

# Overall system performance
dstat
```

**Process Tracing:**

```bash
# Install strace
sudo apt install strace

# Trace system calls of a process
strace -p 1234

# Trace new process
strace ls -l

# Trace with timestamps
strace -tt ls -l

# Trace specific calls
strace -e trace=open,read,write ls -l

# Trace with output to file
strace -o strace.log ls -l
```

### Bisecting Problems

**Binary Search Strategy:**

1. Start with a working and a non-working state
2. Check the midpoint between them
3. Based on whether it works, narrow down to half the range
4. Repeat until you find the exact change that caused the issue

**Example with Git:**

```bash
# Start bisect process
git bisect start

# Mark current state as bad
git bisect bad

# Mark a known good commit
git bisect good v1.0

# Git will checkout a commit halfway in between
# Test the application and mark as good or bad
git bisect good  # If working
# or
git bisect bad   # If not working

# Continue until git identifies the commit that introduced the issue
# When complete:
git bisect reset
```

**Manual Bisect for Configuration:**

```bash
#!/bin/bash
# bisect-config.sh

# Make a backup of original config
cp /etc/myapp/config.conf /etc/myapp/config.conf.backup

# Test function
test_config() {
    systemctl restart myapp
    sleep 2
    if systemctl is-active --quiet myapp; then
        return 0  # Success
    else
        return 1  # Failure
    fi
}

# Bisect settings in config file
bisect_setting() {
    local param=$1
    local current=$(grep "^$param" /etc/myapp/config.conf | cut -d= -f2)
    
    echo "Testing parameter: $param (current value: $current)"
    
    # Try setting to default
    sed -i "s/^$param=.*/$param=default/" /etc/myapp/config.conf
    
    if test_config; then
        echo "✓ Default value works"
        return 0
    else
        echo "✗ Default value fails"
        
        # Restore original value
        sed -i "s/^$param=.*/$param=$current/" /etc/myapp/config.conf
        return 1
    fi
}

# List of settings to check
settings=(
    "network.timeout"
    "db.connections"
    "memory.limit"
    "logging.level"
)

# Test each setting
for setting in "${settings[@]}"; do
    bisect_setting "$setting"
done

# Restore backup when done
cp /etc/myapp/config.conf.backup /etc/myapp/config.conf
```

## 6. Standardized Procedures and Checklists

### New Host Hardening Checklist

```bash
#!/bin/bash
# server-hardening.sh
# Run this script on new servers to implement basic hardening

echo "============================================"
echo "      Server Hardening Script"
echo "============================================"

# Update system packages
echo "[1/9] Updating system packages"
apt update && apt upgrade -y

# Create a non-root user with sudo privileges
echo "[2/9] Setting up non-root sudo user"
if ! id "sysadmin" &>/dev/null; then
    useradd -m -s /bin/bash sysadmin
    usermod -aG sudo sysadmin
    echo "sysadmin ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/sysadmin
    chmod 0440 /etc/sudoers.d/sysadmin
    echo "User sysadmin created with sudo access"
else
    echo "User sysadmin already exists"
fi

# Secure SSH
echo "[3/9] Securing SSH configuration"
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak
sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/#X11Forwarding yes/X11Forwarding no/' /etc/ssh/sshd_config

# Configure firewall
echo "[4/9] Configuring firewall"
apt install -y ufw
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow http
ufw allow https
echo "y" | ufw enable

# Set up automatic security updates
echo "[5/9] Setting up automatic security updates"
apt install -y unattended-upgrades apt-listchanges
cat > /etc/apt/apt.conf.d/20auto-upgrades << EOF
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::Download-Upgradeable-Packages "1";
APT::Periodic::AutocleanInterval "7";
EOF

# Configure fail2ban
echo "[6/9] Installing and configuring fail2ban"
apt install -y fail2ban
cat > /etc/fail2ban/jail.local << EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
EOF
systemctl enable fail2ban
systemctl restart fail2ban

# Disable unused services
echo "[7/9] Disabling unused services"
systemctl disable bluetooth.service avahi-daemon.service cups.service
systemctl stop bluetooth.service avahi-daemon.service cups.service

# Set secure system-wide umask
echo "[8/9] Setting secure umask"
echo "umask 027" > /etc/profile.d/umask.sh
chmod +x /etc/profile.d/umask.sh

# Harden kernel parameters
echo "[9/9] Hardening kernel parameters"
cat > /etc/sysctl.d/99-security.conf << EOF
# IP Spoofing protection
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1

# Ignore ICMP broadcast requests
net.ipv4.icmp_echo_ignore_broadcasts = 1

# Disable source packet routing
net.ipv4.conf.all.accept_source_route = 0
net.ipv6.conf.all.accept_source_route = 0 
net.ipv4.conf.default.accept_source_route = 0
net.ipv6.conf.default.accept_source_route = 0

# Ignore send redirects
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.default.send_redirects = 0

# Block SYN attacks
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_max_syn_backlog = 2048
net.ipv4.tcp_synack_retries = 2
net.ipv4.tcp_syn_retries = 5

# Log Martians
net.ipv4.conf.all.log_martians = 1
net.ipv4.conf.default.log_martians = 1

# Disable IPv6 if not needed
net.ipv6.conf.all.disable_ipv6 = 1
net.ipv6.conf.default.disable_ipv6 = 1
EOF

sysctl -p /etc/sysctl.d/99-security.conf

echo "============================================"
echo "      Hardening Complete"
echo "============================================"
echo "Please review the changes and reboot the system."
```

### Application Deployment Checklist

```bash
#!/bin/bash
# app-deployment-checklist.sh
# Pre-deployment checklist for applications

APP_NAME="myapp"
APP_USER="appuser"
APP_VERSION="1.2.3"
DEPLOY_DIR="/opt/$APP_NAME"
BACKUP_DIR="/var/backups/$APP_NAME"
CONFIG_DIR="/etc/$APP_NAME"
LOG_DIR="/var/log/$APP_NAME"
ARTIFACT="$APP_NAME-$APP_VERSION.tar.gz"
ARTIFACT_URL="https://artifacts.example.com/$ARTIFACT"

echo "===================================================="
echo "      Deployment Checklist for $APP_NAME v$APP_VERSION"
echo "===================================================="

# 1. Pre-deployment checks
echo "[1/10] Running pre-deployment checks"
echo "  • Checking disk space"
FREE_SPACE=$(df -h / | awk 'NR==2 {print $4}')
echo "    Available space: $FREE_SPACE"

echo "  • Checking memory"
FREE_MEM=$(free -h | awk '/^Mem:/ {print $4}')
echo "    Available memory: $FREE_MEM"

echo "  • Checking user and permissions"
if ! id "$APP_USER" &>/dev/null; then
    echo "    ✗ User $APP_USER does not exist. Creating..."
    useradd -r -s /bin/false "$APP_USER"
else
    echo "    ✓ User $APP_USER exists"
fi

# 2. Create required directories
echo "[2/10] Setting up directories"
for DIR in "$DEPLOY_DIR" "$BACKUP_DIR" "$CONFIG_DIR" "$LOG_DIR"; do
    if [ ! -d "$DIR" ]; then
        echo "  • Creating $DIR"
        mkdir -p "$DIR"
    else
        echo "  • Directory $DIR already exists"
    fi
done

echo "  • Setting permissions"
chown -R "$APP_USER":"$APP_USER" "$DEPLOY_DIR" "$LOG_DIR"
chown -R root:"$APP_USER" "$CONFIG_DIR"
chmod 750 "$CONFIG_DIR"
chmod -R 770 "$LOG_DIR"

# 3. Backup current version
echo "[3/10] Creating backup of current version"
if [ -d "$DEPLOY_DIR/current" ]; then
    TIMESTAMP=$(date +%Y%m%d-%H%M%S)
    BACKUP_PATH="$BACKUP_DIR/$APP_NAME-$TIMESTAMP.tar.gz"
    echo "  • Backing up to $BACKUP_PATH"
    tar czf "$BACKUP_PATH" -C "$DEPLOY_DIR" current
    echo "  • Backup complete"
else
    echo "  • No current version found, skipping backup"
fi

# 4. Download and verify new version
echo "[4/10] Downloading application package"
echo "  • From $ARTIFACT_URL"
wget -q -O "/tmp/$ARTIFACT" "$ARTIFACT_URL"

echo "  • Verifying checksum"
# This would be replaced with actual checksum verification
sleep 1
echo "  • Checksum verified"

# 5. Deploy new version
echo "[5/10] Deploying new version"
echo "  • Extracting package"
mkdir -p "$DEPLOY_DIR/releases/$APP_VERSION"
tar xzf "/tmp/$ARTIFACT" -C "$DEPLOY_DIR/releases/$APP_VERSION"

echo "  • Setting up symlink"
ln -sfn "$DEPLOY_DIR/releases/$APP_VERSION" "$DEPLOY_DIR/current"

echo "  • Setting permissions"
chown -R "$APP_USER":"$APP_USER" "$DEPLOY_DIR/releases/$APP_VERSION"
chmod -R 755 "$DEPLOY_DIR/releases/$APP_VERSION"

# 6. Update configuration
echo "[6/10] Updating configuration"
echo "  • Copying default configuration"
if [ ! -f "$CONFIG_DIR/config.yml" ]; then
    cp "$DEPLOY_DIR/current/config/default.yml" "$CONFIG_DIR/config.yml"
    echo "  • Created new configuration from template"
else
    echo "  • Using existing configuration"
fi

# 7. Set up services
echo "[7/10] Setting up service"
cat > /etc/systemd/system/$APP_NAME.service << EOF
[Unit]
Description=$APP_NAME Service
After=network.target

[Service]
Type=simple
User=$APP_USER
Group=$APP_USER
WorkingDirectory=$DEPLOY_DIR/current
ExecStart=$DEPLOY_DIR/current/bin/$APP_NAME --config $CONFIG_DIR/config.yml
Restart=on-failure
StandardOutput=append:$LOG_DIR/$APP_NAME.log
StandardError=append:$LOG_DIR/$APP_NAME.error.log

[Install]
WantedBy=multi-user.target
EOF

echo "  • Reloading systemd"
systemctl daemon-reload

# 8. Start service
echo "[8/10] Starting service"
systemctl restart $APP_NAME
sleep 2
if systemctl is-active --quiet $APP_NAME; then
    echo "  • ✓ Service started successfully"
else
    echo "  • ✗ Service failed to start. Check logs."
    exit 1
fi

# 9. Healthcheck
echo "[9/10] Running healthcheck"
echo "  • Waiting for application to initialize"
sleep 5
if curl -s http://localhost:8080/health | grep -q "ok"; then
    echo "  • ✓ Application is healthy"
else
    echo "  • ✗ Health check failed"
    exit 1
fi

# 10. Clean up
echo "[10/10] Cleaning up"
echo "  • Removing temporary files"
rm "/tmp/$ARTIFACT"

echo "  • Removing old releases (keeping last 3)"
cd "$DEPLOY_DIR/releases" && ls -1t | tail -n +4 | xargs rm -rf

echo "===================================================="
echo "      Deployment Complete"
echo "===================================================="
echo "Application $APP_NAME v$APP_VERSION successfully deployed!"
echo "Check logs at $LOG_DIR/$APP_NAME.log"
```

### Rollback Procedure

```bash
#!/bin/bash
# rollback.sh
# Roll back to previous application version

APP_NAME="myapp"
DEPLOY_DIR="/opt/$APP_NAME"
CONFIG_DIR="/etc/$APP_NAME"
LOG_DIR="/var/log/$APP_NAME"

# Get current version
CURRENT_VERSION=$(readlink "$DEPLOY_DIR/current" | xargs basename)
echo "Current version: $CURRENT_VERSION"

# List available versions
echo "Available versions:"
ls -1t "$DEPLOY_DIR/releases/" | nl

# Ask which version to roll back to
read -p "Enter version number to roll back to (or 'latest' for previous): " CHOICE

if [ "$CHOICE" = "latest" ]; then
    PREVIOUS_VERSION=$(ls -1t "$DEPLOY_DIR/releases/" | sed -n '2p')
    if [ -z "$PREVIOUS_VERSION" ]; then
        echo "No previous version found."
        exit 1
    fi
    echo "Rolling back to previous version: $PREVIOUS_VERSION"
else
    # Get selected version from numbered list
    SELECTED_VERSION=$(ls -1t "$DEPLOY_DIR/releases/" | sed -n "${CHOICE}p")
    if [ -z "$SELECTED_VERSION" ]; then
        echo "Invalid selection."
        exit 1
    fi
    PREVIOUS_VERSION=$SELECTED_VERSION
    echo "Rolling back to version: $PREVIOUS_VERSION"
fi

# 1. Stop current service
echo "[1/5] Stopping service"
systemctl stop $APP_NAME

# 2. Switch symlink
echo "[2/5] Switching to previous version"
ln -sfn "$DEPLOY_DIR/releases/$PREVIOUS_VERSION" "$DEPLOY_DIR/current"
echo "Symlink updated"

# 3. Check configuration compatibility
echo "[3/5] Checking configuration compatibility"
if [ -f "$DEPLOY_DIR/releases/$PREVIOUS_VERSION/config/version.txt" ]; then
    CONFIG_VERSION=$(cat "$DEPLOY_DIR/releases/$PREVIOUS_VERSION/config/version.txt")
    echo "Config version required: $CONFIG_VERSION"
    
    # Here you could add logic to switch to a compatible config version if needed
else
    echo "No version requirement found, using current config"
fi

# 4. Start service
echo "[4/5] Starting service with previous version"
systemctl start $APP_NAME
sleep 2
if systemctl is-active --quiet $APP_NAME; then
    echo "Service started successfully"
else
    echo "Service failed to start. Check logs."
    exit 1
fi

# 5. Verify rollback
echo "[5/5] Verifying rollback"
# Here you would add verification steps appropriate for your application
# For example, check health endpoint, verify logs, etc.

echo "Checking application log for startup messages"
if grep -q "Started successfully" "$LOG_DIR/$APP_NAME.log"; then
    echo "Application log shows successful start"
else
    echo "No startup confirmation in logs"
fi

echo "======================================================"
echo "      Rollback Complete"
echo "======================================================"
echo "Application $APP_NAME rolled back to version $PREVIOUS_VERSION"
echo "Monitoring is recommended to ensure stability."
```

### Post-Mortem Template

```markdown
# Incident Post-Mortem: [Brief Description]

## Incident Summary
- **Date/Time**: [Start time] - [End time]
- **Duration**: [Total outage/degradation time]
- **Severity**: [Critical/Major/Minor]
- **Services Affected**: [List affected services]
- **Impact**: [Description of user impact]

## Timeline
- **[Time]**: Incident detected via [alert/customer report/etc.]
- **[Time]**: Response team engaged
- **[Time]**: Initial investigation started
- **[Time]**: Root cause identified
- **[Time]**: Mitigation applied
- **[Time]**: Service restored
- **[Time]**: Incident resolved

## Root Cause
[Detailed description of what caused the incident]

## Detection
- **How was the issue detected?** [Monitoring alert, customer report, etc.]
- **Detection delay**: [Time between start and detection]
- **Could we have detected it sooner?** [Yes/No] [If yes, how?]

## Resolution
- **Actions taken**: [Steps taken to resolve the issue]
- **Resolution time**: [Time from detection to resolution]
- **Verification**: [How was resolution verified?]

## Impact
- **Users affected**: [Estimated number/percentage]
- **Business impact**: [Revenue loss, SLA violations, etc.]
- **Operations impact**: [Team hours spent, other projects delayed]

## What Went Well
- [List of things that went according to plan]

## What Went Wrong
- [List of things that could have been handled better]

## Action Items
1. **Prevention**: [Actions to prevent similar incidents]
   - Owner: [Name]
   - Due: [Date]
   - Priority: [High/Medium/Low]

2. **Detection**: [Improvements to monitoring/alerting]
   - Owner: [Name]
   - Due: [Date]
   - Priority: [High/Medium/Low]

3. **Response**: [Improvements to response procedures]
   - Owner: [Name]
   - Due: [Date]
   - Priority: [High/Medium/Low]

4. **Process**: [Improvements to general processes]
   - Owner: [Name]
   - Due: [Date]
   - Priority: [High/Medium/Low]

## Lessons Learned
[Key takeaways and learnings from the incident]

## Appendix
- [Links to relevant metrics, graphs, logs]
- [Links to related incidents]
- [Technical deep dive details]
```

## Terminology Glossary

### **Filesystem Hierarchy Standard (FHS)**
- Defines the directory structure and contents in Linux systems
- Ensures consistency across distributions
- Specifies where specific types of files should be located

### **umask**
- Controls default permissions for newly created files and directories
- Value is subtracted from maximum permissions (777 for dirs, 666 for files)
- Common values: 022 (files: 644, dirs: 755), 027 (files: 640, dirs: 750)

### **Access Control Lists (ACLs)**
- Extend traditional Unix permissions
- Allow setting permissions for multiple users and groups
- Provide more granular control than basic permissions

### **Live Kernel Patching**
- Technology to apply kernel updates without rebooting
- Patches running kernel code in memory
- Available in Ubuntu (Livepatch), RHEL (Kpatch), and SUSE (kGraft)

### **sysctl**
- Interface for examining and changing kernel parameters at runtime
- Controls system settings like network behavior, memory management
- Changes can be made persistent in /etc/sysctl.conf or /etc/sysctl.d/

### **Control Groups (cgroups)**
- Linux kernel feature to limit and isolate resource usage
- Manages CPU, memory, disk I/O, and network bandwidth
- Fundamental component of container technologies

### **systemd**
- System and service manager for Linux
- Manages system startup and services
- Replaces traditional init systems with parallel startup process

### **systemd Unit**
- Configuration file that describes a system resource
- Common types: service, timer, socket, mount, target
- Found in /etc/systemd/system/ or /usr/lib/systemd/system/

### **systemd Timer**
- Alternative to cron for scheduling tasks
- Offers finer control over job scheduling
- Integrates with systemd logging and dependencies

### **tcpdump**
- Command-line packet analyzer
- Captures and analyzes network traffic
- Can filter packets by protocol, port, host, etc.

### **strace**
- Diagnostic tool to trace system calls and signals
- Helps debug application issues at the system call level
- Shows interaction between processes and the kernel

### **Git Bisect**
- Binary search through commit history
- Helps find which change introduced a bug
- Automates the process of testing commits

### **Server Hardening**
- Process of securing a server by reducing its vulnerability surface
- Includes disabling unnecessary services, restrictive permissions
- Follows principle of least privilege

### **Rollback**
- Procedure to revert to a previous working state
- Essential part of deployment strategy
- Requires maintaining multiple versions of applications

### **Post-Mortem**
- Analysis conducted after an incident
- Documents timeline, impact, and root cause
- Identifies action items to prevent recurrence

## Summary

Part VI equips you with essential operational knowledge and practices for Linux system administration:

1. **Filesystem Management**
   - Understanding Linux filesystem hierarchy
   - Properly managing permissions and access controls
   - Setting appropriate umask values

2. **System Maintenance**
   - Implementing effective update strategies
   - Managing kernel updates safely
   - Planning for minimal-downtime reboots

3. **Resource Control**
   - Tuning system limits for applications
   - Optimizing kernel parameters
   - Using cgroups to control resource allocation

4. **Service Management**
   - Creating robust systemd service configurations
   - Leveraging templates for multiple service instances
   - Using systemd timers for scheduled tasks

5. **Incident Response**
   - Collecting and analyzing logs effectively
   - Capturing network traffic for troubleshooting
   - Methodically bisecting problems to find root causes

6. **Standardized Procedures**
   - Implementing server hardening for new hosts
   - Following deployment checklists for applications
   - Creating effective rollback procedures
   - Conducting thorough post-mortems after incidents

These practices help create reliable, maintainable, and secure Linux systems while providing structured approaches to solving problems when they arise.
