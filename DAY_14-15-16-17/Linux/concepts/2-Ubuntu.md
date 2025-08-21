# Part II: Ubuntu for Backend/DevOps

Ubuntu's design philosophy centers on usability, predictability, and enterprise readiness. As a Debian derivative, it inherits robust package management while adding streamlined configuration, regular release cycles, and extensive cloud integration. This makes Ubuntu particularly well-suited for backend services and DevOps workflows where stability, automation, and consistent deployment patterns are crucial.

## 1. Ubuntu Releases and Lifecycle Management

### Understanding Release Cycles

Ubuntu follows a predictable release schedule that directly impacts production planning:

**Long Term Support (LTS) Releases:**
- Released every 2 years in April (20.04, 22.04, 24.04)
- 5 years of standard support, extendable to 10 years with Ubuntu Pro
- Recommended for production servers and enterprise environments
- Focus on stability over cutting-edge features

**Interim Releases:**
- Released every 6 months (April and October)
- 9 months of support only
- Include newer software versions and experimental features
- Suitable for development environments and early adopters

### Version Numbering and Support

Ubuntu versions use YY.MM format (year.month). Understanding the support lifecycle is crucial for maintenance planning:

```bash
# Check your Ubuntu version
lsb_release -a
cat /etc/os-release
hostnamectl

# Check support status
ubuntu-support-status
```

### Lab: Release Information Discovery

```bash
# Comprehensive system information
echo "=== Ubuntu Release Information ==="
lsb_release -d
echo "=== Kernel Version ==="
uname -r
echo "=== Architecture ==="
uname -m
echo "=== Uptime ==="
uptime
echo "=== Support Status ==="
ubuntu-support-status --show-unsupported 2>/dev/null || echo "ubuntu-support-status not available"
```

**Production Considerations:**
- Always use LTS releases for production workloads
- Plan upgrade cycles well before support expiration
- Test interim releases in development to prepare for next LTS

## 2. Package Management Ecosystem

### APT (Advanced Package Tool)

APT is Ubuntu's primary package management system, built on Debian's dpkg foundation:

```bash
# Update package lists
sudo apt update

# Upgrade installed packages
sudo apt upgrade -y

# Full system upgrade (handles dependencies)
sudo apt full-upgrade

# Install packages
sudo apt install nginx postgresql-client htop

# Remove packages
sudo apt remove package-name
sudo apt purge package-name  # Also removes config files

# Search for packages
apt search nginx
apt-cache search "web server"

# Show package information
apt show nginx
apt-cache policy nginx

# List installed packages
apt list --installed
dpkg -l | grep nginx

# Show package files
dpkg -L nginx
apt-file list nginx  # Requires apt-file package
```

### Advanced APT Usage

```bash
# Hold packages to prevent upgrades
sudo apt-mark hold linux-image-generic
sudo apt-mark unhold linux-image-generic

# Clean package cache
sudo apt autoremove
sudo apt autoclean
sudo apt clean

# Fix broken dependencies
sudo apt --fix-broken install
sudo dpkg --configure -a

# Simulate actions without making changes
apt list --upgradable
sudo apt upgrade --dry-run
```

### Personal Package Archives (PPAs)

PPAs provide third-party software repositories:

```bash
# Add PPA (example: Node.js)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-add-repository ppa:example/repository
sudo apt update

# List PPAs
ls /etc/apt/sources.list.d/
grep -r "ppa" /etc/apt/sources.list.d/

# Remove PPA
sudo add-apt-repository --remove ppa:example/repository
sudo ppa-purge ppa:example/repository  # Requires ppa-purge package
```

### Snap Packages

Snaps provide containerized applications with automatic updates:

```bash
# List installed snaps
snap list

# Install snap
sudo snap install code --classic
sudo snap install docker

# Update snaps
sudo snap refresh
sudo snap refresh specific-snap

# Remove snap
sudo snap remove snap-name

# Search snaps
snap find "text editor"

# Show snap information
snap info code

# Connect/disconnect interfaces
snap connections code
sudo snap connect code:removable-media

# Revert to previous version
sudo snap revert code
```

### Unattended Upgrades

Automated security updates are crucial for server maintenance:

```bash
# Install unattended-upgrades
sudo apt install unattended-upgrades

# Configure automatic updates
sudo dpkg-reconfigure -plow unattended-upgrades

# Edit configuration
sudo nano /etc/apt/apt.conf.d/50unattended-upgrades

# Test configuration
sudo unattended-upgrades --dry-run --debug

# Check logs
sudo journalctl -u unattended-upgrades
tail -f /var/log/unattended-upgrades/unattended-upgrades.log
```

**Sample Configuration for Production:**
```bash
# /etc/apt/apt.conf.d/50unattended-upgrades
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}-security";
    "${distro_id} ESMApps:${distro_codename}-apps-security";
};

Unattended-Upgrade::AutoFixInterruptedDpkg "true";
Unattended-Upgrade::MinimalSteps "true";
Unattended-Upgrade::Remove-Unused-Dependencies "false";
Unattended-Upgrade::Automatic-Reboot "false";
Unattended-Upgrade::Automatic-Reboot-Time "02:00";
```

## 3. systemd Services and Process Management

### Understanding systemd Architecture

systemd is Ubuntu's init system and service manager, organizing the system into units:

```bash
# Service management
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx
sudo systemctl reload nginx
sudo systemctl status nginx

# Enable/disable services
sudo systemctl enable nginx  # Start at boot
sudo systemctl disable nginx
sudo systemctl enable --now nginx  # Enable and start immediately

# List services
systemctl list-units --type=service
systemctl list-units --type=service --state=running
systemctl list-units --type=service --state=failed
```

### Working with systemd Targets

Targets are collections of units that represent system states:

```bash
# Show current target
systemctl get-default

# List all targets
systemctl list-units --type=target

# Change target
sudo systemctl isolate rescue.target
sudo systemctl isolate multi-user.target
sudo systemctl isolate graphical.target

# Set default target
sudo systemctl set-default multi-user.target
```

### Creating Custom Service Units

```bash
# Create service file
sudo nano /etc/systemd/system/myapp.service
```

**Example Service Unit:**
```ini
[Unit]
Description=My Backend Application
Documentation=https://docs.myapp.com
After=network.target postgresql.service
Wants=postgresql.service

[Service]
Type=simple
User=myapp
Group=myapp
WorkingDirectory=/opt/myapp
Environment=NODE_ENV=production
EnvironmentFile=/etc/myapp/environment
ExecStart=/usr/bin/node /opt/myapp/server.js
ExecReload=/bin/kill -HUP $MAINPID
KillMode=mixed
Restart=on-failure
RestartSec=5s
TimeoutStartSec=30s
TimeoutStopSec=30s

# Security
NoNewPrivileges=yes
ProtectSystem=strict
ProtectHome=yes
ReadWritePaths=/var/lib/myapp /var/log/myapp
PrivateTmp=yes
SystemCallArchitectures=native

# Resources
LimitNOFILE=65536
MemoryHigh=1G
MemoryMax=1.5G

[Install]
WantedBy=multi-user.target
```

```bash
# Reload systemd configuration
sudo systemctl daemon-reload

# Start and enable service
sudo systemctl enable --now myapp.service

# Monitor service
sudo systemctl status myapp.service
sudo journalctl -u myapp.service -f
```

### Advanced systemd Features

**Socket Activation:**
```bash
# Create socket unit
sudo nano /etc/systemd/system/myapp.socket
```

```ini
[Unit]
Description=My App Socket
PartOf=myapp.service

[Socket]
ListenStream=8080
Accept=false

[Install]
WantedBy=sockets.target
```

**Timer Units (systemd cron replacement):**
```bash
sudo nano /etc/systemd/system/backup.timer
```

```ini
[Unit]
Description=Daily Backup Timer
Requires=backup.service

[Timer]
OnCalendar=daily
RandomizedDelaySec=30min
Persistent=true

[Install]
WantedBy=timers.target
```

```bash
# Enable timer
sudo systemctl enable --now backup.timer

# List timers
systemctl list-timers
```
---

## 🔌 **Socket Activation**

Instead of keeping a service running all the time (even when no one is using it), **systemd can listen on a port for you and only start the service when a connection comes in**.

### Example:

* You create `myapp.socket` → systemd listens on port **8080**.
* When someone connects (e.g., `curl localhost:8080`), systemd automatically starts `myapp.service`.
* When idle, your app can stop, saving memory/CPU.

👉 **Use cases**:

* Lightweight web servers
* On-demand APIs
* Services that aren’t needed constantly (like FTP or custom daemons).

It’s kind of like **"lazy loading" for services**.

---

## ⏰ **Timer Units (systemd’s cron replacement)**

Timers replace the need for **cron jobs**, but with more power.
Instead of writing in `crontab`, you define a `.timer` that triggers a `.service`.

### Example: `backup.timer`

* Runs **daily** (OnCalendar=daily).
* Starts `backup.service` → your script to run backups.
* Has `RandomizedDelaySec=30min` → avoids "thundering herd" if many servers start backup at the same time.
* `Persistent=true` → if system was down at scheduled time, it runs immediately after boot.

👉 **Use cases**:

* Automated backups
* Log rotation / cleanup
* Scheduled sync tasks
* Replacing traditional `cron` with something that integrates better with systemd.

---

## ✅ **Why use these features?**

* **Efficiency** → socket activation saves resources.
* **Reliability** → timers survive reboots, can catch up missed runs, and are integrated with system logs (`journalctl`).
* **Unified management** → everything managed through `systemctl` instead of mixing `cron + custom scripts + init.d`.

---

⚡ So basically:

* **Socket units** = "start services only when needed"
* **Timer units** = "schedule services like cron, but smarter"

---

## 4. Logging with journald

systemd's journald provides centralized logging with structured data:

```bash
# View all logs
sudo journalctl

# Follow logs in real-time
sudo journalctl -f

# Filter by service
sudo journalctl -u nginx
sudo journalctl -u nginx -f

# Filter by time
sudo journalctl --since "2024-01-01 00:00:00"
sudo journalctl --since "1 hour ago"
sudo journalctl --since yesterday
sudo journalctl --until "2024-01-01 23:59:59"

# Filter by priority
sudo journalctl -p err  # error and above
sudo journalctl -p warning
sudo journalctl -p info

# Boot logs
sudo journalctl -b  # Current boot
sudo journalctl -b -1  # Previous boot
sudo journalctl --list-boots

# Kernel logs
sudo journalctl -k
sudo journalctl -k -b

# User logs
journalctl --user
journalctl _UID=1000

# Format output
sudo journalctl -o json-pretty
sudo journalctl -o cat
sudo journalctl -o short-iso
```

### Configuring journald

```bash
# Edit journald configuration
sudo nano /etc/systemd/journald.conf
```

**Production journald Configuration:**
```ini
[Journal]
Storage=persistent
Compress=yes
SyncIntervalSec=5m
RateLimitInterval=30s
RateLimitBurst=10000
SystemMaxUse=4G
SystemKeepFree=20%
SystemMaxFileSize=128M
MaxRetentionSec=2month
ForwardToSyslog=yes
```

```bash
# Restart journald
sudo systemctl restart systemd-journald

# Check journal disk usage
sudo journalctl --disk-usage

# Clean old logs
sudo journalctl --vacuum-time=2weeks
sudo journalctl --vacuum-size=1G
```

### Integration with rsyslog

```bash
# Install rsyslog (usually pre-installed)
sudo apt install rsyslog

# Configure rsyslog
sudo nano /etc/rsyslog.d/50-default.conf

# Restart rsyslog
sudo systemctl restart rsyslog

# Check traditional log files
ls -la /var/log/
tail -f /var/log/syslog
tail -f /var/log/auth.log
```

## 5. User and Group Management

### Creating and Managing Users

```bash
# Add user (interactive)
sudo adduser newuser

# Add user (non-interactive)
sudo useradd -m -s /bin/bash -c "Application User" appuser

# Add user to groups
sudo usermod -aG sudo,docker,www-data newuser

# Change user properties
sudo usermod -c "New Description" newuser
sudo usermod -s /bin/zsh newuser
sudo usermod -d /new/home newuser

# Lock/unlock accounts
sudo usermod -L username  # Lock
sudo usermod -U username  # Unlock
sudo passwd -l username   # Lock password
sudo passwd -u username   # Unlock password

# Delete user
sudo deluser newuser
sudo deluser --remove-home newuser
sudo userdel -r newuser  # Remove home directory
```

### Group Management

```bash
# Create group
sudo groupadd developers
sudo groupadd -r system-group  # System group

# Add user to group
sudo usermod -aG developers username
sudo gpasswd -a username developers

# Remove user from group
sudo gpasswd -d username developers

# List groups
cat /etc/group
getent group
groups username

# Delete group
sudo groupdel developers
```

### sudo Configuration

```bash
# Edit sudoers file (always use visudo)
sudo visudo

# Add sudoers file for specific users/groups
sudo visudo -f /etc/sudoers.d/developers
```

**Sample sudoers configurations:**
```bash
# Allow user to run all commands
username ALL=(ALL:ALL) ALL

# Allow group to run all commands without password
%developers ALL=(ALL:ALL) NOPASSWD:ALL

# Allow specific commands only
username ALL=(ALL) NOPASSWD: /bin/systemctl restart nginx, /bin/systemctl reload nginx

# Allow user to run commands as specific user
webadmin ALL=(www-data) NOPASSWD: ALL

# Restrict to specific hosts
username server1,server2=(ALL:ALL) ALL
```

### SSH Key Management and Hardening

```bash
# Generate SSH key pair
ssh-keygen -t ed25519 -C "your.email@example.com"
ssh-keygen -t rsa -b 4096 -C "your.email@example.com"

# Copy public key to server
ssh-copy-id user@server
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@server

# Manual key installation
mkdir -p ~/.ssh
echo "ssh-ed25519 AAAAC3NzaC... user@host" >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### SSH Server Hardening

```bash
# Edit SSH configuration
sudo nano /etc/ssh/sshd_config
```

**Hardened SSH Configuration:**
```bash
# Basic security
Protocol 2
Port 22  # Consider changing to non-standard port
PermitRootLogin no
PasswordAuthentication no
PermitEmptyPasswords no
ChallengeResponseAuthentication no
UsePAM yes

# Key-based authentication only
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys

# Limit access
AllowUsers user1 user2
AllowGroups ssh-users
DenyUsers baduser
MaxAuthTries 3
MaxSessions 5
MaxStartups 10:30:100

# Connection settings
ClientAliveInterval 300
ClientAliveCountMax 2
LoginGraceTime 60
TCPKeepAlive yes

# X11 and forwarding
X11Forwarding no
AllowTcpForwarding no
AllowStreamLocalForwarding no
GatewayPorts no
PermitTunnel no

# Logging
SyslogFacility AUTH
LogLevel VERBOSE

# Modern cryptography only
KexAlgorithms curve25519-sha256@libssh.org,diffie-hellman-group16-sha512
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com,aes128-gcm@openssh.com,aes256-ctr,aes192-ctr,aes128-ctr
MACs hmac-sha2-256-etm@openssh.com,hmac-sha2-512-etm@openssh.com,hmac-sha2-256,hmac-sha2-512
```

```bash
# Test SSH configuration
sudo sshd -t

# Restart SSH service
sudo systemctl restart sshd

# Monitor SSH connections
sudo journalctl -u ssh -f
sudo tail -f /var/log/auth.log

# Install and configure fail2ban
sudo apt install fail2ban
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local
```

**fail2ban SSH jail configuration:**
```ini
[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600
findtime = 600
```

## 6. Networking on Ubuntu

### Netplan Configuration

Ubuntu uses Netplan as a network configuration abstraction layer:

```bash
# View current network configuration
ip addr show
networkctl status
netplan status  # Ubuntu 22.04+

# Netplan configuration files
ls /etc/netplan/
```

**Static IP Configuration Example:**
```yaml
# /etc/netplan/01-network-config.yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    enp0s3:
      addresses:
        - 192.168.1.100/24
      gateway4: 192.168.1.1
      nameservers:
        addresses:
          - 8.8.8.8
          - 8.8.4.4
        search:
          - local.domain
      dhcp4: false
```

**DHCP Configuration:**
```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    enp0s3:
      dhcp4: true
      dhcp6: false
```

**VLAN Configuration:**
```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    enp0s3:
      dhcp4: false
  vlans:
    vlan100:
      id: 100
      link: enp0s3
      addresses:
        - 192.168.100.10/24
      gateway4: 192.168.100.1
```

**Bridge Configuration:**
```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    enp0s3:
      dhcp4: false
  bridges:
    br0:
      interfaces:
        - enp0s3
      dhcp4: true
      parameters:
        stp: true
        forward-delay: 4
```

```bash
# Apply netplan configuration
sudo netplan try    # Test for 120 seconds
sudo netplan apply  # Apply permanently

# Debug netplan
sudo netplan --debug apply
```

### systemd-networkd vs NetworkManager

**systemd-networkd (server preference):**
```bash
# Check networkd status
systemctl status systemd-networkd

# View networkd configuration
networkctl list
networkctl status enp0s3

# Monitor networkd logs
sudo journalctl -u systemd-networkd -f
```

**NetworkManager (desktop preference):**
```bash
# NetworkManager commands
nmcli device status
nmcli connection show
nmcli connection up "Wired connection 1"
nmcli connection down "Wired connection 1"

# Create connection
nmcli connection add type ethernet ifname enp0s3 con-name "Static IP" ip4 192.168.1.100/24 gw4 192.168.1.1

# WiFi management
nmcli device wifi list
nmcli device wifi connect "WiFi-SSID" password "password"
```

### DNS Resolution with systemd-resolved

```bash
# Check DNS resolution status
resolvectl status
systemd-resolve --status  # Older versions

# Query DNS
resolvectl query google.com
resolvectl query 8.8.8.8

# Flush DNS cache
resolvectl flush-caches

# Configure DNS
sudo nano /etc/systemd/resolved.conf
```

**systemd-resolved configuration:**
```ini
[Resolve]
DNS=8.8.8.8 8.8.4.4
FallbackDNS=1.1.1.1 1.0.0.1
Domains=local.domain
DNSSEC=yes
DNSOverTLS=yes
Cache=yes
DNSStubListener=yes
```

### Firewall Management with ufw

Ubuntu's Uncomplicated Firewall (ufw) provides a simple interface to netfilter:

```bash
# Enable/disable firewall
sudo ufw enable
sudo ufw disable

# Default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw default deny forward

# Allow services
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 'Apache Full'
sudo ufw allow 'OpenSSH'

# Allow specific ports
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3306/tcp
sudo ufw allow 8000:8100/tcp  # Port range

# Allow from specific IPs
sudo ufw allow from 192.168.1.100
sudo ufw allow from 192.168.1.0/24
sudo ufw allow from 192.168.1.100 to any port 3306

# Deny rules
sudo ufw deny 23/tcp  # Telnet
sudo ufw deny from 203.0.113.0/24

# Advanced rules
sudo ufw allow in on eth1 to any port 3306  # MySQL on specific interface
sudo ufw allow out 53/udp  # DNS queries

# View rules
sudo ufw status
sudo ufw status verbose
sudo ufw status numbered

# Delete rules
sudo ufw delete 2  # By number
sudo ufw delete allow ssh  # By specification

# Reset firewall
sudo ufw --force reset
```

### Advanced Networking Tools

```bash
# Network diagnostics
ping -c 4 google.com
traceroute google.com
mtr google.com  # My traceroute
nmap -sn 192.168.1.0/24  # Network scan

# Socket statistics
ss -tuln  # TCP and UDP listening ports
ss -tulpn  # Include process names
ss -s  # Summary
netstat -tuln  # Legacy command

# Bandwidth monitoring
iftop  # Interface top
nethogs  # Per-process network usage
vnstat  # Network statistics
sudo apt install vnstat && sudo systemctl enable vnstat

# Network configuration
ethtool enp0s3  # NIC settings
iwconfig  # Wireless settings
```

## 7. Package Building and Debian Packaging

### Understanding Debian Package Structure

```bash
# Extract and examine a .deb package
mkdir /tmp/package-analysis
cd /tmp/package-analysis
apt download nginx
ar -x nginx_*.deb
tar -xf control.tar.*
tar -xf data.tar.*

# View package control information
cat control
cat conffiles
cat postinst
cat prerm
```

### Building Simple Packages

**Directory Structure:**
```bash
mkdir -p myapp-1.0/DEBIAN
mkdir -p myapp-1.0/usr/bin
mkdir -p myapp-1.0/etc/myapp
mkdir -p myapp-1.0/var/lib/myapp
```

**Control File:**
```bash
# myapp-1.0/DEBIAN/control
Package: myapp
Version: 1.0-1
Architecture: amd64
Maintainer: Your Name <email@example.com>
Depends: nodejs (>= 16), nginx
Section: web
Priority: optional
Homepage: https://myapp.example.com
Description: My Backend Application
 This is a sample Node.js backend application
 that provides REST API services.
```

**Maintainer Scripts:**
```bash
#!/bin/bash
# myapp-1.0/DEBIAN/postinst
set -e

# Create user
if ! getent passwd myapp > /dev/null; then
    useradd -r -s /bin/false -d /var/lib/myapp myapp
fi

# Set permissions
chown -R myapp:myapp /var/lib/myapp
chmod 755 /usr/bin/myapp

# Enable service
systemctl daemon-reload
systemctl enable myapp.service

exit 0
```

```bash
# Build package
dpkg-deb --build myapp-1.0
dpkg-deb --info myapp-1.0.deb
dpkg-deb --contents myapp-1.0.deb

# Install package
sudo dpkg -i myapp-1.0.deb
sudo apt --fix-broken install  # Fix dependencies if needed
```

### Advanced Packaging with debhelper

```bash
# Install build tools
sudo apt install build-essential devscripts debhelper dh-make

# Create source package
mkdir myapp-1.0
cd myapp-1.0
dh_make --native --single --packagename myapp

# Edit debian/control
nano debian/control

# Edit debian/rules
nano debian/rules

# Build package
dpkg-buildpackage -us -uc
```

### Creating APT Repository

```bash
# Install repository tools
sudo apt install reprepro

# Create repository structure
mkdir -p /var/www/apt/conf
cd /var/www/apt

# Configure repository
cat > conf/distributions << EOF
Origin: YourCompany
Label: YourCompany
Codename: focal
Architectures: i386 amd64 source
Components: main
Description: YourCompany APT Repository
SignWith: your-gpg-key-id
EOF

# Add packages
reprepro includedeb focal /path/to/package.deb

# Generate repository metadata
reprepro export

# Add GPG key
gpg --armor --export your-key-id > public.key

# Client configuration
echo "deb [signed-by=/etc/apt/trusted.gpg.d/yourcompany.gpg] https://apt.yourcompany.com focal main" | sudo tee /etc/apt/sources.list.d/yourcompany.list
```

## 8. Cloud Integration and Ubuntu Pro

### Cloud Images and cloud-init

Ubuntu Cloud Images are optimized for cloud deployment:

```bash
# View cloud-init status
cloud-init status
sudo cloud-init status --long

# View cloud-init configuration
sudo cat /etc/cloud/cloud.cfg
ls /etc/cloud/cloud.cfg.d/

# Debug cloud-init
sudo cloud-init collect-logs
sudo journalctl -u cloud-init
```

**cloud-init user-data example:**
```yaml
#cloud-config
hostname: web-server-01
fqdn: web-server-01.example.com

users:
  - name: deploy
    groups: sudo
    shell: /bin/bash
    ssh_authorized_keys:
      - ssh-ed25519 AAAAC3NzaC... deploy@workstation

packages:
  - nginx
  - postgresql
  - nodejs
  - npm

runcmd:
  - systemctl enable nginx
  - systemctl start nginx
  - npm install -g pm2

write_files:
  - path: /etc/nginx/sites-available/myapp
    content: |
      server {
        listen 80;
        server_name _;
        location / {
          proxy_pass http://127.0.0.1:3000;
        }
      }
    permissions: '0644'

final_message: "Cloud-init setup complete"
```

### Ubuntu Pro Features

Ubuntu Pro provides extended security maintenance and compliance features:

```bash
# Check Ubuntu Pro status
pro status
ua status  # Legacy command

# Attach Pro subscription
sudo pro attach <token>

# Enable services
sudo pro enable esm-infra
sudo pro enable esm-apps
sudo pro enable livepatch
sudo pro enable fips  # FIPS compliance

# View available services
pro status --all

# Detach subscription
sudo pro detach
```

### Livepatch Service

Livepatch applies critical kernel security fixes without rebooting:

```bash
# Enable livepatch
sudo pro enable livepatch

# Check livepatch status
sudo canonical-livepatch status
sudo canonical-livepatch status --verbose

# View applied patches
sudo canonical-livepatch status --kernel

# Disable livepatch
sudo canonical-livepatch disable
```

### FIPS Compliance

Federal Information Processing Standard (FIPS) 140-2 compliance:

```bash
# Enable FIPS
sudo pro enable fips

# Check FIPS status
cat /proc/sys/crypto/fips_enabled

# Reboot required after enabling FIPS
sudo reboot

# Verify FIPS modules
sudo fips-mode-setup --check
```

## Lab: Complete Ubuntu Backend Setup

Let's create a comprehensive lab that demonstrates Ubuntu setup for a backend service:

```bash
#!/bin/bash
# Complete Backend Server Setup Script

echo "=== Ubuntu Backend Server Setup ==="

# 1. System Information
echo "--- System Information ---"
lsb_release -a
uname -a
free -h
df -h

# 2. Update System
echo "--- Updating System ---"
sudo apt update && sudo apt upgrade -y

# 3. Install Essential Packages
echo "--- Installing Essential Packages ---"
sudo apt install -y \
    curl wget git vim htop tree \
    nginx postgresql-client nodejs npm \
    fail2ban ufw unattended-upgrades

# 4. Configure Unattended Upgrades
echo "--- Configuring Unattended Upgrades ---"
sudo dpkg-reconfigure -plow unattended-upgrades

# 5. Setup Application User
echo "--- Creating Application User ---"
sudo useradd -m -s /bin/bash -c "Backend App User" backend
sudo usermod -aG www-data backend

# 6. Configure SSH Hardening
echo "--- Hardening SSH ---"
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup
cat << 'EOF' | sudo tee -a /etc/ssh/sshd_config.d/hardening.conf
PermitRootLogin no
PasswordAuthentication no
PermitEmptyPasswords no
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
EOF

sudo systemctl restart sshd

# 7. Configure Firewall
echo "--- Configuring Firewall ---"
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# 8. Configure fail2ban
echo "--- Configuring fail2ban ---"
cat << 'EOF' | sudo tee /etc/fail2ban/jail.local
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
EOF

sudo systemctl enable --now fail2ban

# 9. Setup Application Directory Structure
echo "--- Setting up Application Structure ---"
sudo mkdir -p /opt/backend/{bin,config,logs}
sudo mkdir -p /var/lib/backend
sudo mkdir -p /var/log/backend
sudo chown -R backend:backend /opt/backend /var/lib/backend /var/log/backend

# 10. Create systemd Service
echo "--- Creating systemd Service ---"
cat << 'EOF' | sudo tee /etc/systemd/system/backend.service
[Unit]
Description=Backend Application
Documentation=https://github.com/company/backend
After=network.target

[Service]
Type=simple
User=backend
Group=backend
WorkingDirectory=/opt/backend
Environment=NODE_ENV=production
ExecStart=/usr/bin/node /opt/backend/bin/server.js
Restart=on-failure
RestartSec=5
TimeoutStartSec=30
LimitNOFILE=65536

# Security
NoNewPrivileges=yes
ProtectSystem=strict
ProtectHome=yes
ReadWritePaths=/var/lib/backend /var/log/backend

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload

# 11. Setup Log Rotation
echo "--- Configuring Log Rotation ---"
cat << 'EOF' | sudo tee /etc/logrotate.d/backend
/var/log/backend/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    copytruncate
    su backend backend
}
EOF

# 12. Configure nginx
echo "--- Configuring nginx ---"
cat << 'EOF' | sudo tee /etc/nginx/sites-available/backend
server {
    listen 80;
    server_name _;
    
    access_log /var/log/nginx/backend.access.log;
    error_log /var/log/nginx/backend.error.log;
    
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/backend /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl enable --now nginx

# 13. Setup Monitoring
echo "--- Setting up Basic Monitoring ---"
cat << 'EOF' | sudo tee /usr/local/bin/system-health-check
#!/bin/bash
echo "=== System Health Check $(date) ==="
echo "Load Average: $(uptime | awk -F'load average:' '{print $2}')"
echo "Memory Usage: $(free | grep Mem | awk '{printf "%.2f%%", $3/$2 * 100.0}')"
echo "Disk Usage: $(df / | tail -1 | awk '{print $5}')"
echo "Active Services: nginx=$(systemctl is-active nginx), backend=$(systemctl is-active backend)"
echo "Recent Errors: $(sudo journalctl --since "1 hour ago" -p err --no-pager -q | wc -l) errors in last hour"
EOF

sudo chmod +x /usr/local/bin/system-health-check

# Create timer for health checks
cat << 'EOF' | sudo tee /etc/systemd/system/health-check.service
[Unit]
Description=System Health Check
After=multi-user.target

[Service]
Type=oneshot
ExecStart=/usr/local/bin/system-health-check
User=root
EOF

cat << 'EOF' | sudo tee /etc/systemd/system/health-check.timer
[Unit]
Description=Run System Health Check Every Hour
Requires=health-check.service

[Timer]
OnCalendar=hourly
Persistent=true

[Install]
WantedBy=timers.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now health-check.timer

echo "=== Setup Complete ==="
echo "Run 'sudo /usr/local/bin/system-health-check' to see system status"
echo "View timer status: 'systemctl list-timers health-check.timer'"
echo "Check services: 'systemctl status nginx backend'"
```

Save this script and run it to set up a complete Ubuntu backend environment.

---

## Terminology Glossary

### **LTS (Long Term Support)**
- Ubuntu release with extended support lifecycle (5 years standard, up to 10 with Pro)
- Released every 2 years in April (20.04, 22.04, 24.04)
- Recommended for production servers due to stability focus
- Receives security updates and critical bug fixes throughout support period

### **Interim Release**
- Ubuntu release between LTS versions with 9-month support lifecycle
- Released every 6 months (April and October)
- Contains newer software versions and experimental features
- Suitable for development environments and early adopters

### **APT (Advanced Package Tool)**
- High-level package management system for Debian-based distributions
- Frontend to dpkg that handles dependency resolution automatically
- Commands include `apt install`, `apt update`, `apt upgrade`, `apt search`
- Uses `/etc/apt/sources.list` and `/etc/apt/sources.list.d/` for repository configuration

### **dpkg (Debian Package)**
- Low-level package management tool for .deb packages
- Does not handle dependencies automatically (unlike APT)
- Commands include `dpkg -i` (install), `dpkg -r` (remove), `dpkg -l` (list)
- Foundation layer that APT builds upon

### **PPA (Personal Package Archive)**
- Third-party software repository hosted on Launchpad
- Allows developers to distribute packages outside official repositories
- Added with `add-apt-repository ppa:user/repository-name`
- Should be used cautiously as packages may not meet Ubuntu quality standards

### **Snap Packages**
- Universal packages that include dependencies and run in isolation
- Automatic updates managed by snapd daemon
- Installed in `/snap/` with confined permissions
- Commands include `snap install`, `snap list`, `snap refresh`

### **Unattended Upgrades**
- Automated system for installing security updates
- Configured via `/etc/apt/apt.conf.d/50unattended-upgrades`
- Can be set to automatically reboot if required for kernel updates
- Essential for maintaining security on production servers

### **systemd**
- Modern init system and service manager replacing SysV init
- PID 1 process responsible for starting and managing system services
- Organizes system into units (service, socket, timer, target, mount)
- Provides dependency management and parallel service startup

### **systemd Unit**
- Configuration object managed by systemd
- Types include service, socket, timer, target, mount, device
- Defined in `.service`, `.socket`, `.timer` files in `/etc/systemd/system/`
- Control system services, mount points, device activation, scheduled tasks

### **systemd Target**
- Collection of units representing a system state
- Similar to runlevels in SysV init but more flexible
- Examples: multi-user.target (command line), graphical.target (GUI)
- Changed with `systemctl isolate` or set as default with `systemctl set-default`

### **journald**
- systemd's logging service collecting logs from all system services
- Stores structured logs in binary format with metadata
- Accessed via `journalctl` command with powerful filtering options
- Can forward logs to traditional syslog for compatibility

### **rsyslog**
- Traditional system logging daemon processing text-based logs
- Receives logs from journald and other sources
- Writes logs to files in `/var/log/` directory
- Configurable for remote logging and log rotation

### **logrotate**
- System utility for automatic log file rotation and compression
- Prevents logs from consuming excessive disk space
- Configured via `/etc/logrotate.conf` and `/etc/logrotate.d/`
- Typically runs daily via cron or systemd timer

### **Netplan**
- Network configuration abstraction layer introduced in Ubuntu 17.10
- Uses YAML configuration files in `/etc/netplan/`
- Can drive either NetworkManager or systemd-networkd as backend
- Simplifies network configuration across different environments

### **systemd-networkd**
- systemd component for network configuration management
- Preferred for servers and systems without GUI
- Configured via `.network` files in `/etc/systemd/network/`
- Provides DHCP client, static IP configuration, and bridge/VLAN support

### **NetworkManager**
- Network management daemon with GUI and CLI interfaces
- Preferred for desktop environments and laptops
- Handles WiFi, mobile broadband, and complex network scenarios
- Controlled via `nmcli` command-line tool

### **systemd-resolved**
- systemd component providing DNS resolution services
- Replaces traditional `/etc/resolv.conf` with dynamic configuration
- Supports DNS-over-TLS, DNSSEC validation, and local caching
- Configured via `/etc/systemd/resolved.conf`

### **ufw (Uncomplicated Firewall)**
- Simplified frontend to netfilter/iptables firewall
- Provides easy-to-use commands for common firewall tasks
- Configuration stored in `/etc/ufw/` directory
- Status viewed with `ufw status` command

### **fail2ban**
- Intrusion prevention system that monitors log files
- Temporarily bans IP addresses showing malicious behavior
- Commonly used to protect SSH, HTTP, and mail services
- Configured via `/etc/fail2ban/jail.conf` and `/etc/fail2ban/jail.local`

### **SSH Key Authentication**
- Public-key cryptography method for secure authentication
- More secure than password authentication
- Private key stays on client, public key stored on server
- Generated with `ssh-keygen` and deployed with `ssh-copy-id`

### **cloud-init**
- Industry standard for cloud instance initialization
- Configures users, packages, files, and services on first boot
- Uses user-data (YAML) and meta-data from cloud providers
- Status checked with `cloud-init status` command

### **Ubuntu Pro**
- Canonical's enterprise subscription service for Ubuntu
- Provides Extended Security Maintenance (ESM) for older releases
- Includes Livepatch, FIPS compliance, and premium support
- Managed via `pro` command (formerly `ua` command)

### **Livepatch**
- Service that applies critical kernel security updates without rebooting
- Reduces downtime for security patching
- Requires Ubuntu Pro subscription for production use
- Status checked with `canonical-livepatch status`

### **ESM (Extended Security Maintenance)**
- Ubuntu Pro feature providing security updates beyond LTS lifecycle
- Covers both infrastructure packages (esm-infra) and applications (esm-apps)
- Extends security support for up to 10 years total
- Critical for maintaining older systems in production

### **FIPS (Federal Information Processing Standard)**
- US government security standards for cryptographic modules
- FIPS 140-2 compliance required for some government and financial systems
- Available through Ubuntu Pro subscription
- Verified with `fips-mode-setup --check` command

### **Debian Package Control File**
- Metadata file describing package information and dependencies
- Contains fields like Package, Version, Architecture, Depends, Description
- Located in `DEBIAN/control` directory of source packages
- Used by dpkg and APT for package management decisions

### **Maintainer Scripts**
- Shell scripts executed during package installation/removal
- Types: preinst, postinst, prerm, postrm
- Handle service configuration, user creation, and cleanup tasks
- Must be idempotent and handle errors gracefully

### **reprepro**
- Tool for creating and managing APT repositories
- Generates repository metadata and handles package signing
- Configured via `conf/distributions` file
- Commands include `includedeb`, `remove`, `export`

### **GPG (GNU Privacy Guard)**
- Open source implementation of OpenPGP standard
- Used for package signing and repository authentication
- Clients verify package integrity using repository public keys
- Managed via `gpg` command and `/etc/apt/trusted.gpg.d/`

---

## Summary

Ubuntu's design as a stable, predictable platform makes it ideal for backend and DevOps environments. Key takeaways from Part II:

- **Release Strategy**: Use LTS releases for production, enable unattended-upgrades for security
- **Package Management**: Master APT, use snaps for containerized apps, create PPAs for distribution
- **systemd**: Leverage units, targets, timers, and journald for robust service management
- **User Security**: Implement SSH key authentication, sudo restrictions, and fail2ban protection  
- **Network Management**: Use Netplan with systemd-networkd for servers, ufw for firewall simplicity
- **Cloud Integration**: Utilize cloud-init for automated provisioning, Ubuntu Pro for enterprise features
- **Packaging**: Understand Debian package structure for custom software distribution

These foundations enable reliable, automated, and secure Ubuntu deployments that scale from single servers to cloud environments.