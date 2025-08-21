# Part V: Protocols and Practical Networking - Beginner's Guide

This section will help you understand the basic networking protocols and tools that keep the internet running. We'll explore them in a beginner-friendly way with practical examples.

## What are Protocols?

Think of protocols as "languages" or "rule books" that computers use to talk to each other:
- They define exactly how data should be formatted
- They specify how computers should respond to each other
- They create standards so different systems can work together

## 1. Understanding HTTP - How the Web Works

### What is HTTP?
- **HTTP** (HyperText Transfer Protocol) is how web browsers and servers communicate
- When you visit a website, your browser sends HTTP requests to servers
- The server sends back HTTP responses with the content
- Think of it like ordering food at a restaurant - you make a request, and get a response!

### HTTP Versions Explained Simply

**HTTP/1.1** - The Classic Version:
- One request at a time (like a single-lane road)
- Each request needs a new connection
- Still widely used

**HTTP/2** - The Improved Version:
- Multiple requests at once (like a multi-lane highway)
- Much faster loading of websites
- Uses the same connection for multiple requests

**HTTP/3** - The Newest Version:
- Even faster and more reliable
- Works better on mobile networks
- Based on a protocol called QUIC instead of TCP

### See HTTP in Action

```bash
# Install curl to make HTTP requests
sudo apt update
sudo apt install -y curl

# Make a simple HTTP request
curl -v http://example.com
# The -v flag shows you all the details of the request and response

# Try with HTTP/2 (needs HTTPS)
curl -v --http2 https://www.google.com
```

What you'll see:
- The HTTP headers (like information tags attached to the request)
- The response code (200 means success, 404 means not found)
- The actual content (usually HTML for websites)

### Testing Different HTTP Versions

```bash
# Install httpie (a more user-friendly alternative to curl)
sudo apt install -y httpie

# Try HTTP/1.1
http --print=HhBb http://example.com

# Try HTTP/2 (requires HTTPS)
http --print=HhBb --http2 https://www.google.com
```

### Setting Up a Basic Web Server

```bash
# Install nginx (pronounced "engine-x")
sudo apt install -y nginx

# Start nginx
sudo systemctl start nginx

# Check if it's running
sudo systemctl status nginx

# Now open a browser and go to http://localhost or run:
curl http://localhost
```

You should see a welcome page! This is your own web server running.

## 2. Securing the Web with TLS

### What is TLS?
- **TLS** (Transport Layer Security) makes web connections secure
- It's what puts the "S" in HTTPS
- It encrypts data between your browser and the server
- It prevents hackers from reading your information
- Think of it like sending a letter in a locked box instead of a postcard

### Let's Create a Self-Signed Certificate

```bash
# Make a directory for our certificate
mkdir -p ~/certificates
cd ~/certificates

# Generate a private key and certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout my-site.key -out my-site.crt \
  -subj "/CN=localhost"

# Look at your certificate
openssl x509 -in my-site.crt -text -noout
```

### Set Up HTTPS on Your Web Server

```bash
# Configure nginx for HTTPS
sudo mkdir -p /etc/nginx/ssl
sudo cp ~/certificates/my-site.key /etc/nginx/ssl/
sudo cp ~/certificates/my-site.crt /etc/nginx/ssl/

# Create a configuration file
sudo nano /etc/nginx/sites-available/my-secure-site
```

Paste this configuration:

```nginx
server {
    listen 443 ssl;
    server_name localhost;
    
    ssl_certificate /etc/nginx/ssl/my-site.crt;
    ssl_certificate_key /etc/nginx/ssl/my-site.key;
    
    location / {
        root /var/www/html;
        index index.html;
    }
}
```

Save and activate the configuration:

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/my-secure-site /etc/nginx/sites-enabled/

# Test the configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx

# Try accessing your secure site
curl -k https://localhost
```

The `-k` flag tells curl to accept self-signed certificates.

### Let's Encrypt with Certbot

In real life, you'd use Let's Encrypt to get free trusted certificates:

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get a certificate (for a real domain you own)
# sudo certbot --nginx -d yourdomain.com
```

(Note: This requires a real domain name pointing to your server, so we can't fully demo it here)

### Understanding mTLS (Mutual TLS)

**What is mTLS?**
- Regular TLS: only the server proves its identity to the client
- mTLS: both server AND client prove their identities to each other
- Used in high-security environments where both sides need verification

```bash
# Create client certificate for mTLS demo
mkdir -p ~/mtls-demo
cd ~/mtls-demo

# Create Certificate Authority (CA)
openssl genrsa -out ca.key 4096
openssl req -new -x509 -key ca.key -sha256 -subj "/C=US/ST=CA/O=MyOrg/CN=MyCA" -days 3650 -out ca.crt

# Create server certificate
openssl genrsa -out server.key 4096
openssl req -new -key server.key -out server.csr -subj "/C=US/ST=CA/O=MyOrg/CN=localhost"
openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -out server.crt -days 365 -sha256 -CAcreateserial

# Create client certificate
openssl genrsa -out client.key 4096
openssl req -new -key client.key -out client.csr -subj "/C=US/ST=CA/O=MyOrg/CN=client"
openssl x509 -req -in client.csr -CA ca.crt -CAkey ca.key -out client.crt -days 365 -sha256

echo "mTLS certificates created! Check the ~/mtls-demo directory"
```

### OCSP Stapling Configuration

**What is OCSP Stapling?**
- OCSP (Online Certificate Status Protocol) checks if certificates are still valid
- Stapling means the server checks certificate status and includes the response
- This makes HTTPS connections faster and more private

```bash
# Configure nginx with OCSP stapling
sudo cat > /etc/nginx/sites-available/ocsp-example << 'EOF'
server {
    listen 443 ssl http2;
    server_name localhost;

    ssl_certificate /etc/nginx/ssl/my-site.crt;
    ssl_certificate_key /etc/nginx/ssl/my-site.key;
    
    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_trusted_certificate /etc/nginx/ssl/my-site.crt;
    resolver 8.8.8.8 8.8.4.4 valid=300s;
    resolver_timeout 5s;

    location / {
        root /var/www/html;
        index index.html;
    }
}
EOF

# Test OCSP stapling (this works better with real certificates)
openssl s_client -connect localhost:443 -status
```

## 3. Remote Access and File Transfer

### SSH - Secure Shell

**What is SSH?**
- Secure way to connect to other computers
- Like having a remote control for another computer
- Encrypted, so your commands and passwords are secure

```bash
# Install SSH server
sudo apt install -y openssh-server

# Check status
sudo systemctl status ssh

# Connect to your own computer (localhost)
ssh localhost
# Type 'exit' to disconnect

# Generate SSH keys (more secure than passwords)
ssh-keygen -t ed25519 -C "your_email@example.com"
# Press Enter for default location and optional passphrase

# See your new key
cat ~/.ssh/id_ed25519.pub

# Copy your key to another computer (if you have one)
# ssh-copy-id username@remote-server-ip
```

### Advanced SSH Configuration

```bash
# Create SSH config file
cat > ~/.ssh/config << 'EOF'
Host myserver
    HostName 192.168.1.100
    User myusername
    Port 22
    IdentityFile ~/.ssh/id_ed25519
    
Host jumpbox
    HostName jumpserver.example.com
    User admin
    Port 2222
    
# Use jumpbox to connect to internal server
Host internal
    HostName 10.0.1.50
    User developer
    ProxyJump jumpbox
EOF

chmod 600 ~/.ssh/config

# Now you can connect with simple names:
# ssh myserver
# ssh internal  # This will jump through jumpbox
```

### File Transfer with SCP and SFTP

**SCP** (Secure Copy):
```bash
# Create a test file
echo "This is a test file" > testfile.txt

# Copy to another location
scp testfile.txt localhost:~/received-file.txt

# Copy from remote server (if you have one)
# scp username@remote-server:path/to/file local-file

# Copy entire directory
# scp -r directory/ username@remote-server:~/backup/

# Copy with specific SSH key
# scp -i ~/.ssh/my_key file.txt user@server:~/
```

**SFTP** (SSH File Transfer Protocol):
```bash
# Connect with SFTP
sftp localhost

# Try some commands (after connecting)
pwd           # See current directory
ls            # List files
put testfile.txt    # Upload a file
get received-file.txt   # Download a file
mkdir new-folder      # Create directory
cd new-folder        # Change directory
bye           # Exit
```

### Syncing Files with rsync

**What is rsync?**
- Efficiently synchronizes files between locations
- Only transfers the parts of files that changed
- Great for backups or keeping folders in sync

```bash
# Install rsync
sudo apt install -y rsync

# Create test directories
mkdir -p ~/source-folder
mkdir -p ~/destination-folder

# Create some test files
echo "File 1" > ~/source-folder/file1.txt
echo "File 2" > ~/source-folder/file2.txt

# Sync the folders
rsync -av ~/source-folder/ ~/destination-folder/

# Change a file and sync again
echo "Updated content" > ~/source-folder/file1.txt
rsync -av --progress ~/source-folder/ ~/destination-folder/

# Sync over SSH
# rsync -av ~/source-folder/ user@remote-server:~/backup/

# Exclude certain files
rsync -av --exclude="*.log" --exclude="node_modules/" ~/source-folder/ ~/destination-folder/
```

### File Sharing with NFS and SMB

**NFS** (Network File System - for Linux/Unix):

```bash
# Install NFS server
sudo apt install -y nfs-kernel-server

# Create a shared directory
sudo mkdir -p /nfs_share
sudo chown nobody:nogroup /nfs_share
sudo chmod 777 /nfs_share

# Configure NFS exports
echo '/nfs_share *(rw,sync,no_subtree_check)' | sudo tee -a /etc/exports

# Apply the configuration
sudo exportfs -a
sudo systemctl restart nfs-kernel-server

# Install NFS client
sudo apt install -y nfs-common

# Create mount point
mkdir -p ~/nfs_mount

# Mount the share
sudo mount localhost:/nfs_share ~/nfs_mount

# Test it
echo "NFS test file" > ~/nfs_mount/nfs-test.txt
cat ~/nfs_mount/nfs-test.txt

# Make permanent mount
echo 'localhost:/nfs_share /home/username/nfs_mount nfs defaults 0 0' | sudo tee -a /etc/fstab
```

**SMB/CIFS** (for Windows compatibility):

```bash
# Install Samba
sudo apt install -y samba

# Create a shared directory
sudo mkdir -p /samba_share
sudo chmod 777 /samba_share

# Configure Samba
sudo cp /etc/samba/smb.conf /etc/samba/smb.conf.backup
sudo bash -c 'cat > /etc/samba/smb.conf << EOF
[global]
   workgroup = WORKGROUP
   server string = Samba Server
   server role = standalone server
   log file = /var/log/samba/log.%m
   max log size = 50
   security = user

[share]
   path = /samba_share
   browseable = yes
   read only = no
   guest ok = yes
EOF'

# Restart Samba
sudo systemctl restart smbd

# Create a Samba user (optional)
sudo smbpasswd -a $USER

# Install SMB client
sudo apt install -y smbclient cifs-utils

# Access the share
smbclient //localhost/share -U $USER
# Enter your Samba password if prompted

# Mount SMB share
mkdir -p ~/smb_mount
sudo mount -t cifs //localhost/share ~/smb_mount -o username=$USER
```

## 4. Service Discovery and Health Checks

### DNS - The Internet's Phone Book

**What is DNS?**
- DNS (Domain Name System) translates domain names to IP addresses
- Like looking up phone numbers in a contacts app
- Without it, you'd have to remember IP addresses like 142.250.185.78 instead of google.com

```bash
# Install DNS tools
sudo apt install -y dnsutils

# Look up an IP address
dig google.com

# Look up the mail servers
dig google.com MX

# Look up specific record types
dig google.com A      # IPv4 address
dig google.com AAAA   # IPv6 address
dig google.com NS     # Name servers
dig google.com TXT    # Text records

# Reverse lookup (IP to name)
dig -x 8.8.8.8

# Use different DNS servers
dig @8.8.8.8 google.com
dig @1.1.1.1 google.com

# Short output format
dig +short google.com
```

### Setting Up Your Own DNS Server

```bash
# Install BIND9
sudo apt install -y bind9 bind9utils bind9-doc

# Configure BIND
sudo cp /etc/bind/named.conf.local /etc/bind/named.conf.local.backup

sudo cat > /etc/bind/named.conf.local << 'EOF'
zone "mylocal.com" {
    type master;
    file "/etc/bind/db.mylocal.com";
};
EOF

# Create zone file
sudo cat > /etc/bind/db.mylocal.com << 'EOF'
$TTL    604800
@       IN      SOA     mylocal.com. admin.mylocal.com. (
                     2023010101     ; Serial
                     604800         ; Refresh
                     86400          ; Retry
                     2419200        ; Expire
                     604800 )       ; Negative Cache TTL

@       IN      NS      ns.mylocal.com.
@       IN      A       127.0.0.1
ns      IN      A       127.0.0.1
www     IN      A       127.0.0.1
api     IN      A       127.0.0.1
EOF

# Test configuration
sudo named-checkconf
sudo named-checkzone mylocal.com /etc/bind/db.mylocal.com

# Restart BIND
sudo systemctl restart bind9

# Test your DNS server
dig @localhost mylocal.com
```

### SRV Records for Service Discovery

**What are SRV Records?**
- SRV records specify the location of services
- They include hostname, port, priority, and weight
- Used by many applications for automatic service discovery

```bash
# Add SRV records to your zone file
sudo cat >> /etc/bind/db.mylocal.com << 'EOF'

; SRV Records (Service, Protocol, Name, TTL, Class, Priority, Weight, Port, Target)
_http._tcp.mylocal.com.    IN    SRV    10    5    80    www.mylocal.com.
_https._tcp.mylocal.com.   IN    SRV    10    5    443   www.mylocal.com.
_ssh._tcp.mylocal.com.     IN    SRV    10    5    22    ns.mylocal.com.
EOF

# Reload BIND
sudo systemctl reload bind9

# Query SRV records
dig _http._tcp.mylocal.com SRV
```

### Simple Health Checks

**Create a basic health check script:**

```bash
# Create the script
cat > healthcheck.sh << 'EOF'
#!/bin/bash

LOG_FILE="$HOME/health_check.log"

log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S'): $1" | tee -a "$LOG_FILE"
}

check_website() {
    local url=$1
    local name=$2
    
    log_message "Checking $name ($url)..."
    
    # Check if site responds
    if response=$(curl -s -w "HTTP_CODE:%{http_code};TIME:%{time_total}" -o /dev/null -m 10 "$url" 2>/dev/null); then
        http_code=$(echo "$response" | grep -o 'HTTP_CODE:[0-9]*' | cut -d: -f2)
        time_total=$(echo "$response" | grep -o 'TIME:[0-9.]*' | cut -d: -f2)
        
        if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 400 ]; then
            log_message "✅ $name is UP (Status: $http_code, Time: ${time_total}s)"
            return 0
        else
            log_message "❌ $name is DOWN (Status: $http_code)"
            return 1
        fi
    else
        log_message "❌ $name is UNREACHABLE"
        return 1
    fi
}

check_port() {
    local host=$1
    local port=$2
    local name=$3
    
    if nc -z -w5 "$host" "$port" 2>/dev/null; then
        log_message "✅ $name ($host:$port) is OPEN"
        return 0
    else
        log_message "❌ $name ($host:$port) is CLOSED"
        return 1
    fi
}

check_service() {
    local service=$1
    
    if systemctl is-active --quiet "$service"; then
        log_message "✅ Service $service is RUNNING"
        return 0
    else
        log_message "❌ Service $service is NOT RUNNING"
        return 1
    fi
}

# Main health check routine
main() {
    log_message "=== Starting Health Check ==="
    
    # Check websites
    check_website "https://www.google.com" "Google"
    check_website "https://www.github.com" "GitHub"
    check_website "http://localhost" "Local Web Server"
    
    # Check ports
    check_port "localhost" "22" "SSH"
    check_port "localhost" "80" "HTTP"
    check_port "localhost" "443" "HTTPS"
    
    # Check services
    check_service "ssh"
    check_service "nginx"
    
    log_message "=== Health Check Complete ==="
    echo ""
}

# Run the checks
main

EOF

# Make executable and run
chmod +x healthcheck.sh
./healthcheck.sh

# Check the log
cat ~/health_check.log
```

### Setting Up Consul for Service Discovery

**What is Consul?**
- Tool for service discovery and health checking
- Helps services find and talk to each other
- Acts as a central registry for your services

```bash
# Install Consul
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update
sudo apt install -y consul

# Create Consul configuration
sudo mkdir -p /etc/consul.d
sudo cat > /etc/consul.d/server.json << 'EOF'
{
  "datacenter": "dc1",
  "data_dir": "/opt/consul",
  "log_level": "INFO",
  "server": true,
  "bootstrap": true,
  "bind_addr": "127.0.0.1",
  "client_addr": "127.0.0.1",
  "ui_config": {
    "enabled": true
  }
}
EOF

# Create data directory
sudo mkdir -p /opt/consul
sudo chown consul:consul /opt/consul

# Start Consul
sudo systemctl enable --now consul

# Wait a moment for startup
sleep 5

# Check status
consul members
```

Open another terminal for the following commands:

```bash
# Register a service
cat > web-service.json << 'EOF'
{
  "ID": "web1",
  "Name": "web",
  "Tags": ["primary"],
  "Address": "127.0.0.1",
  "Port": 80,
  "Check": {
    "HTTP": "http://localhost:80",
    "Interval": "10s"
  }
}
EOF

consul services register web-service.json

# Register another service
cat > ssh-service.json << 'EOF'
{
  "ID": "ssh1",
  "Name": "ssh",
  "Tags": ["secure"],
  "Address": "127.0.0.1",
  "Port": 22,
  "Check": {
    "TCP": "localhost:22",
    "Interval": "10s"
  }
}
EOF

consul services register ssh-service.json

# List services
consul catalog services

# Get information about a service
consul catalog service web

# See health checks
consul health checks web

# Query service with DNS
dig @localhost -p 8600 web.service.consul
dig @localhost -p 8600 ssh.service.consul SRV
```

You can also access the Consul UI at http://localhost:8500

## 5. Practical Networking Tools

### Network Troubleshooting

**Install essential tools:**
```bash
sudo apt install -y net-tools iputils-ping traceroute tcpdump netcat nmap
```

**Check your network interfaces:**
```bash
# Show interfaces with modern tools
ip addr show
ip link show

# Show with legacy tools
ifconfig

# Show routing table
ip route show
route -n

# Show network statistics
ss -tuln    # Show listening ports
ss -tuap    # Show all connections with process info
netstat -tuln  # Legacy version
```

**Test connectivity:**
```bash
# Ping a website
ping -c 4 google.com

# Ping IPv6
ping6 -c 4 google.com

# Trace the route to a website
traceroute google.com
mtr google.com  # Better visual traceroute

# Test specific ports
nc -zv google.com 80
nc -zv google.com 443

# Scan ports with nmap
nmap -p 80,443,22 google.com
nmap -sS -O localhost  # Scan your own system

# Listen on a port
nc -l 8080

# Connect to the port (in another terminal)
echo "Hello, world!" | nc localhost 8080
```

**Monitor network traffic:**
```bash
# Capture packets on interface
sudo tcpdump -i any -c 10 port 80

# Capture and save to file
sudo tcpdump -i any -w capture.pcap port 80

# Read from file
sudo tcpdump -r capture.pcap

# More specific filters
sudo tcpdump -i any host google.com
sudo tcpdump -i any dst port 443
sudo tcpdump -i any src net 192.168.1.0/24

# Monitor bandwidth usage
sudo iftop
sudo nethogs  # Per-process network usage
```

### Network Configuration

**Temporary network changes:**
```bash
# Add IP address to interface
sudo ip addr add 192.168.1.100/24 dev eth0

# Remove IP address
sudo ip addr del 192.168.1.100/24 dev eth0

# Bring interface up/down
sudo ip link set eth0 up
sudo ip link set eth0 down

# Add route
sudo ip route add 192.168.2.0/24 via 192.168.1.1

# Delete route
sudo ip route del 192.168.2.0/24
```

**Permanent configuration with Netplan:**
```bash
# Show current configuration
ls /etc/netplan/

# Backup current configuration
sudo cp /etc/netplan/*.yaml ~/netplan-backup/

# Example static IP configuration
sudo cat > /etc/netplan/01-static.yaml << 'EOF'
network:
  version: 2
  renderer: networkd
  ethernets:
    enp0s3:  # Replace with your interface name
      dhcp4: no
      addresses:
        - 192.168.1.100/24
      gateway4: 192.168.1.1
      nameservers:
        addresses:
          - 8.8.8.8
          - 8.8.4.4
        search:
          - local.domain
EOF

# Test configuration (don't apply if errors)
sudo netplan try

# Apply configuration permanently
# sudo netplan apply
```

### Firewall Configuration

**Basic UFW (Uncomplicated Firewall):**
```bash
# Check status
sudo ufw status verbose

# Enable UFW
sudo ufw enable

# Default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow specific services
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw allow 8080

# Allow from specific IP
sudo ufw allow from 192.168.1.0/24

# Allow specific port from specific IP
sudo ufw allow from 192.168.1.100 to any port 22

# Block specific IP
sudo ufw deny from 192.168.1.50

# Delete rules
sudo ufw delete allow 8080
sudo ufw --numbered delete 5

# Reset all rules
# sudo ufw --force reset
```

**Advanced iptables:**
```bash
# View current rules
sudo iptables -L -n -v

# Basic rules setup
sudo iptables -P INPUT DROP
sudo iptables -P FORWARD DROP
sudo iptables -P OUTPUT ACCEPT

# Allow loopback
sudo iptables -I INPUT 1 -i lo -j ACCEPT

# Allow established connections
sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# Allow SSH
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Allow HTTP/HTTPS
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Save rules (Ubuntu)
sudo iptables-save > /etc/iptables/rules.v4

# Restore rules
sudo iptables-restore < /etc/iptables/rules.v4
```

## Practice Labs

### Lab 1: Set Up a Complete Web Stack
1. Install nginx with HTTPS
2. Configure PHP-FPM
3. Set up a database
4. Test the full stack

```bash
# Install LAMP stack
sudo apt update
sudo apt install -y nginx php-fpm php-mysql mysql-server

# Start services
sudo systemctl enable --now nginx php7.4-fpm mysql

# Secure MySQL
sudo mysql_secure_installation

# Configure nginx for PHP
sudo cat > /etc/nginx/sites-available/php-site << 'EOF'
server {
    listen 80;
    server_name localhost;
    root /var/www/html;
    index index.php index.html;

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/php-site /etc/nginx/sites-enabled/
sudo systemctl reload nginx

# Create test PHP file
echo '<?php phpinfo(); ?>' | sudo tee /var/www/html/info.php

# Test
curl http://localhost/info.php
```

### Lab 2: Set Up Secure Remote Access
1. Configure SSH with key authentication
2. Set up SSH tunneling
3. Configure fail2ban for security

```bash
# Install fail2ban
sudo apt install -y fail2ban

# Configure fail2ban for SSH
sudo cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 600
findtime = 600
maxretry = 5

[ssh]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
EOF

sudo systemctl enable --now fail2ban

# Configure SSH more securely
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup
sudo sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
echo 'AllowUsers your-username' | sudo tee -a /etc/ssh/sshd_config

sudo systemctl restart ssh

# Test SSH tunnel
# ssh -L 8080:localhost:80 username@remote-server
```

### Lab 3: Network Monitoring Dashboard
1. Set up network monitoring tools
2. Create monitoring scripts
3. Set up alerts

```bash
# Install monitoring tools
sudo apt install -y iftop nethogs vnstat

# Set up vnstat for interface monitoring
sudo vnstat -u -i eth0
sudo systemctl enable --now vnstat

# Create network monitoring script
cat > ~/network_monitor.sh << 'EOF'
#!/bin/bash

LOGFILE=~/network_monitor.log
INTERFACE="eth0"  # Change to your interface

log_stats() {
    echo "=== $(date) ===" >> $LOGFILE
    echo "Interface: $INTERFACE" >> $LOGFILE
    
    # Get interface statistics
    RX_BYTES=$(cat /sys/class/net/$INTERFACE/statistics/rx_bytes)
    TX_BYTES=$(cat /sys/class/net/$INTERFACE/statistics/tx_bytes)
    
    echo "RX Bytes: $RX_BYTES" >> $LOGFILE
    echo "TX Bytes: $TX_BYTES" >> $LOGFILE
    
    # Get connection counts
    ESTABLISHED=$(ss -t state established | wc -l)
    LISTENING=$(ss -tl | wc -l)
    
    echo "Established connections: $ESTABLISHED" >> $LOGFILE
    echo "Listening ports: $LISTENING" >> $LOGFILE
    
    # Check for high connection counts
    if [ $ESTABLISHED -gt 100 ]; then
        echo "WARNING: High number of connections ($ESTABLISHED)" >> $LOGFILE
        # Send alert (configure mail or notification)
        echo "High connections on $(hostname): $ESTABLISHED" | wall
    fi
    
    echo "" >> $LOGFILE
}

# Run monitoring
log_stats

# If called with --loop, run continuously
if [ "$1" = "--loop" ]; then
    while true; do
        sleep 60
        log_stats
    done
fi
EOF

chmod +x ~/network_monitor.sh

# Schedule monitoring
(crontab -l 2>/dev/null; echo "*/5 * * * * ~/network_monitor.sh") | crontab -
```

### Lab 4: Service Discovery with DNS and Consul
1. Set up local DNS server
2. Configure service discovery
3. Test automatic failover

```bash
# This builds on previous Consul setup
# Add multiple instances of a service

# Register web service instance 1
cat > web-1.json << 'EOF'
{
  "ID": "web-1",
  "Name": "web",
  "Tags": ["primary", "datacenter-1"],
  "Address": "127.0.0.1",
  "Port": 80,
  "Check": {
    "HTTP": "http://localhost:80",
    "Interval": "10s"
  }
}
EOF

# Register web service instance 2 (simulated)
cat > web-2.json << 'EOF'
{
  "ID": "web-2", 
  "Name": "web",
  "Tags": ["secondary", "datacenter-2"],
  "Address": "127.0.0.1",
  "Port": 8080,
  "Check": {
    "HTTP": "http://localhost:8080",
    "Interval": "10s"
  }
}
EOF

consul services register web-1.json
consul services register web-2.json

# Test service discovery
dig @localhost -p 8600 web.service.consul
consul catalog service web

# Test health monitoring
consul health service web
consul health service web --filter='Status=="passing"'
```

### Lab 5: Complete Network Security Setup
1. Configure comprehensive firewall rules
2. Set up intrusion detection
3. Implement network monitoring

```bash
# Install intrusion detection
sudo apt install -y aide rkhunter chkrootkit

# Initialize AIDE database
sudo aide --init
sudo mv /var/lib/aide/aide.db.new /var/lib/aide/aide.db

# Create security monitoring script
cat > ~/security_monitor.sh << 'EOF'
#!/bin/bash

LOGFILE=~/security_monitor.log
DATE=$(date)

echo "=== Security Check: $DATE ===" >> $LOGFILE

# Check for failed login attempts
FAILED_LOGINS=$(sudo grep "Failed password" /var/log/auth.log | grep "$(date +%Y-%m-%d)" | wc -l)
echo "Failed login attempts today: $FAILED_LOGINS" >> $LOGFILE

# Check for active connections
ACTIVE_CONNECTIONS=$(ss -t state established | wc -l)
echo "Active connections: $ACTIVE_CONNECTIONS" >> $LOGFILE

# Check for listening ports
echo "Listening ports:" >> $LOGFILE
ss -tln >> $LOGFILE

# Check for unusual processes
echo "Top CPU processes:" >> $LOGFILE
ps aux --sort=-%cpu | head -10 >> $LOGFILE

# Check disk usage
echo "Disk usage:" >> $LOGFILE
df -h >> $LOGFILE

# Check for rootkits (quick scan)
echo "Rootkit scan:" >> $LOGFILE
sudo rkhunter --check --skip-keypress --report-warnings-only >> $LOGFILE 2>&1

echo "=== Security Check Complete ===" >> $LOGFILE
echo "" >> $LOGFILE
EOF

chmod +x ~/security_monitor.sh

# Schedule daily security checks
(crontab -l 2>/dev/null; echo "0 2 * * * ~/security_monitor.sh") | crontab -

# Run once to test
~/security_monitor.sh
```

## What You've Learned

After completing this section, you should understand:

1. **HTTP Protocols**
   - How web browsers and servers communicate
   - The differences between HTTP/1.1, HTTP/2, and HTTP/3
   - Setting up and configuring web servers

2. **TLS Security**
   - Why encryption is important for web traffic
   - How to create and manage certificates
   - Configuring HTTPS, mTLS, and OCSP stapling

3. **Remote Access and File Transfer**
   - Using SSH for secure remote connections
   - Transferring files with SCP, SFTP, and rsync
   - Sharing files with NFS and SMB/CIFS

4. **Service Discovery**
   - How DNS translates names to addresses
   - Setting up your own DNS server
   - Using SRV records for service location
   - Implementing service discovery with Consul

5. **Network Tools and Troubleshooting**
   - Diagnosing network connectivity issues
   - Monitoring network traffic and performance
   - Configuring firewalls for security
   - Setting up comprehensive monitoring

6. **Security and Monitoring**
   - Implementing network security best practices
   - Setting up intrusion detection systems
   - Creating automated monitoring and alerting

## Terminology Glossary

### **HTTP (HyperText Transfer Protocol)**
- Protocol used by web browsers and servers to communicate
- Defines how requests and responses are formatted
- Foundation of data communication on the World Wide Web

### **HTTPS (HTTP Secure)**
- HTTP over TLS/SSL encryption
- Protects data in transit between client and server
- Indicated by padlock icon in web browsers

### **TLS (Transport Layer Security)**
- Cryptographic protocol for secure communication
- Successor to SSL (Secure Sockets Layer)
- Provides authentication, integrity, and confidentiality

### **Certificate**
- Digital document that proves the identity of a website or service
- Contains public key and identifying information
- Signed by a Certificate Authority (CA) to establish trust

### **mTLS (Mutual TLS)**
- Both client and server authenticate each other using certificates
- Provides stronger security than one-way TLS
- Commonly used in microservices and API communications

### **OCSP Stapling**
- Online Certificate Status Protocol stapling
- Server includes certificate revocation status in TLS handshake
- Improves performance and privacy of certificate validation

### **SSH (Secure Shell)**
- Encrypted protocol for secure remote access to computers
- Provides secure command-line access and file transfer
- Uses public-key cryptography for authentication

### **SCP (Secure Copy Protocol)**
- File transfer protocol that uses SSH for security
- Simple command-line tool for copying files
- Syntax similar to traditional cp command

### **SFTP (SSH File Transfer Protocol)**
- Interactive file transfer protocol over SSH
- Provides secure file system access
- More features than SCP, including directory browsing

### **rsync**
- File synchronization and transfer tool
- Only transfers changed portions of files (delta sync)
- Excellent for backups and keeping directories synchronized

### **NFS (Network File System)**
- Distributed file system protocol for Unix/Linux
- Allows mounting remote directories as local file systems
- Transparent file access across network

### **SMB (Server Message Block)**
- Network file sharing protocol, primarily used by Windows
- Also known as CIFS (Common Internet File System)
- Enables file and printer sharing across networks

### **DNS (Domain Name System)**
- Hierarchical system that translates domain names to IP addresses
- Distributed database maintained by DNS servers worldwide
- Essential infrastructure service for the internet

### **SRV Record**
- DNS record type that specifies location of services
- Contains priority, weight, port, and target information
- Used for automatic service discovery

### **Service Discovery**
- Process of automatically locating network services
- Enables dynamic configuration and load balancing
- Critical for microservices architectures

### **Consul**
- Tool for service discovery, configuration, and orchestration
- Provides service mesh capabilities and health checking
- Developed by HashiCorp for cloud-native environments

### **Health Check**
- Automated test to verify service availability and functionality
- Can check HTTP responses, TCP connections, or custom scripts
- Essential for load balancing and failover systems

### **Load Balancer**
- System that distributes incoming requests across multiple servers
- Improves availability and performance of applications
- Can operate at different network layers (L4, L7)

### **Reverse Proxy**
- Server that sits between clients and backend servers
- Forwards client requests to appropriate backend servers
- Provides load balancing, SSL termination, and caching

### **TCP (Transmission Control Protocol)**
- Reliable, connection-oriented transport protocol
- Guarantees ordered delivery of data packets
- Foundation for many application protocols (HTTP, SSH, etc.)

### **UDP (User Datagram Protocol)**
- Connectionless, unreliable transport protocol
- Lower overhead than TCP, suitable for real-time applications
- Used by DNS, DHCP, and streaming media

### **QUIC (Quick UDP Internet Connections)**
- Transport protocol developed by Google
- Combines features of TCP and UDP with built-in encryption
- Foundation for HTTP/3 protocol

### **Port**
- Numerical identifier for specific services on a computer
- Allows multiple services to run on same IP address
- Well-known ports: 22 (SSH), 80 (HTTP), 443 (HTTPS)

### **Firewall**
- Network security system that controls traffic based on rules
- Can operate at different network layers
- Essential for protecting servers from unauthorized access

### **VPN (Virtual Private Network)**
- Secure tunnel between networks over public internet
- Encrypts traffic and masks IP addresses
- Enables secure remote access to private networks

### **NAT (Network Address Translation)**
- Technique for remapping IP addresses in network packets
- Allows multiple devices to share single public IP address
- Commonly implemented in home routers and firewalls

### **DHCP (Dynamic Host Configuration Protocol)**
- Network service that automatically assigns IP addresses
- Also provides default gateway, DNS servers, and other settings
- Simplifies network configuration for client devices

### **Subnet**
- Logical subdivision of an IP network
- Uses subnet mask to determine network and host portions
- Enables efficient use of IP address space

## Next Steps for Learning

1. **Set up a home lab** with multiple virtual machines to practice networking
2. **Learn about container networking** (Docker, Kubernetes networking)
3. **Explore cloud networking** (AWS VPC, Azure Virtual Networks, GCP VPC)
4. **Study network security** in more depth (VPNs, IDS/IPS, network segmentation)
5. **Learn about modern networking** (SDN, NFV, service mesh technologies)
6. **Practice with network automation** (Ansible for network configuration, Python networking)

Remember: Networking is a vast field that requires hands-on practice. Start with the basics and gradually build more complex network topologies as you gain confidence. The key is to understand both the theory and practical implementation of networking protocols and tools.
