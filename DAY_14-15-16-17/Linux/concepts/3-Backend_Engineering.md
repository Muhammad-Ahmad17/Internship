# Part III: Backend Engineering on Linux

Backend engineering on Linux requires understanding how to structure applications, manage runtimes, design resilient services, implement proper logging, profile performance, handle networking, and operate data services. This section provides comprehensive guidance for building and deploying production-ready backend systems on Ubuntu.

## 1. Project Layout and FHS-Aligned Deployments

### Understanding the Filesystem Hierarchy Standard (FHS)

The FHS provides a standard directory structure that ensures predictable file locations across Linux distributions. Following FHS principles makes your applications more maintainable and compatible with system administration tools.

**Key FHS Directories for Applications:**
```bash
# View FHS structure
ls -la /
tree -L 2 / 2>/dev/null | head -20

# Application-specific directories
echo "=== FHS Application Layout ==="
echo "/usr/local/bin    - Custom binaries"
echo "/usr/local/lib    - Custom libraries"
echo "/etc/APP         - Configuration files"
echo "/var/lib/APP     - Application data"
echo "/var/log/APP     - Application logs"
echo "/var/run/APP     - Runtime files (PID, sockets)"
echo "/opt/APP         - Self-contained applications"
echo "/srv/APP         - Service data"
```

### Production Application Layout

**Recommended Directory Structure:**
```bash
# Create FHS-compliant application structure
sudo mkdir -p /opt/myapp/{bin,lib,config,scripts}
sudo mkdir -p /etc/myapp/conf.d
sudo mkdir -p /var/lib/myapp/{data,uploads,cache}
sudo mkdir -p /var/log/myapp
sudo mkdir -p /var/run/myapp

# Set ownership and permissions
sudo useradd -r -s /bin/false -d /var/lib/myapp myapp
sudo chown -R myapp:myapp /var/lib/myapp /var/log/myapp /var/run/myapp
sudo chown -R root:myapp /opt/myapp /etc/myapp
sudo chmod -R 750 /etc/myapp
sudo chmod -R 755 /opt/myapp

# Create symbolic links for convenience
sudo ln -sf /opt/myapp/bin/myapp /usr/local/bin/myapp
```

**Example Application Structure:**
```
/opt/myapp/
├── bin/                # Application binaries
│   ├── myapp          # Main executable
│   └── migrate        # Database migration script
├── lib/               # Application libraries
│   ├── modules/       # Application modules
│   └── vendor/        # Third-party libraries
├── config/            # Default configuration templates
│   ├── default.conf
│   └── production.conf.example
└── scripts/           # Deployment and maintenance scripts
    ├── deploy.sh
    ├── backup.sh
    └── health-check.sh

/etc/myapp/
├── myapp.conf         # Main configuration
├── secrets.conf       # Sensitive configuration (restricted permissions)
└── conf.d/            # Modular configuration directory
    ├── database.conf
    ├── logging.conf
    └── cache.conf

/var/lib/myapp/
├── data/              # Persistent application data
├── uploads/           # User uploads
├── cache/             # Application cache
└── tmp/               # Temporary files

/var/log/myapp/
├── application.log    # Main application log
├── access.log         # Access logs
├── error.log          # Error logs
└── audit.log          # Audit trail

/var/run/myapp/
├── myapp.pid          # Process ID file
└── myapp.sock         # Unix domain socket (if used)
```

### Environment Management

**Configuration Hierarchy (least to most specific):**
```bash
# 1. Compiled defaults (in application)
# 2. System-wide configuration
cat > /etc/myapp/myapp.conf << 'EOF'
# System-wide defaults
listen_port=3000
log_level=info
max_connections=1000
EOF

# 3. Environment-specific configuration
cat > /etc/myapp/conf.d/production.conf << 'EOF'
# Production overrides
log_level=warn
max_connections=5000
enable_metrics=true
EOF

# 4. Environment variables (highest priority)
cat > /etc/myapp/environment << 'EOF'
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@localhost/myapp
REDIS_URL=redis://localhost:6379
LOG_LEVEL=info
EOF

# Secure environment file
sudo chmod 640 /etc/myapp/environment
sudo chown root:myapp /etc/myapp/environment
```

### Deployment Best Practices

**Deployment Script Example:**
```bash
#!/bin/bash
# /opt/myapp/scripts/deploy.sh
set -euo pipefail

APP_NAME="myapp"
APP_DIR="/opt/$APP_NAME"
SERVICE_NAME="$APP_NAME.service"
BACKUP_DIR="/var/backups/$APP_NAME"
LOG_FILE="/var/log/$APP_NAME/deploy.log"

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $*" | tee -a "$LOG_FILE"
}

# Create backup
create_backup() {
    log "Creating backup..."
    sudo mkdir -p "$BACKUP_DIR"
    local backup_name="$APP_NAME-$(date +%Y%m%d-%H%M%S).tar.gz"
    sudo tar -czf "$BACKUP_DIR/$backup_name" -C "$APP_DIR" .
    log "Backup created: $backup_name"
}

# Health check
health_check() {
    log "Performing health check..."
    if curl -sf http://localhost:3000/health > /dev/null; then
        log "Health check passed"
        return 0
    else
        log "Health check failed"
        return 1
    fi
}

# Rollback function
rollback() {
    log "Rolling back..."
    local latest_backup=$(ls -t "$BACKUP_DIR"/*.tar.gz | head -1)
    if [[ -n "$latest_backup" ]]; then
        sudo systemctl stop "$SERVICE_NAME"
        sudo rm -rf "$APP_DIR"/*
        sudo tar -xzf "$latest_backup" -C "$APP_DIR"
        sudo systemctl start "$SERVICE_NAME"
        log "Rollback completed"
    fi
}

# Main deployment
main() {
    log "Starting deployment..."
    
    create_backup
    
    # Stop service
    sudo systemctl stop "$SERVICE_NAME" || true
    
    # Deploy new version
    log "Deploying new version..."
    # ... deployment logic here ...
    
    # Start service
    sudo systemctl start "$SERVICE_NAME"
    
    # Wait for startup
    sleep 10
    
    # Health check
    if health_check; then
        log "Deployment successful"
        sudo systemctl enable "$SERVICE_NAME"
    else
        log "Deployment failed, rolling back..."
        rollback
        exit 1
    fi
}

# Trap errors for rollback
trap 'log "Deployment failed, rolling back..."; rollback; exit 1' ERR

main "$@"
```

### Configuration Management Patterns

**Layered Configuration Loading:**
```javascript
// Node.js example: config/index.js
const path = require('path');
const fs = require('fs');

class Config {
    constructor() {
        this.config = {};
        this.loadDefaults();
        this.loadFiles();
        this.loadEnvironment();
    }
    
    loadDefaults() {
        // Compiled defaults
        this.config = {
            port: 3000,
            logLevel: 'info',
            maxConnections: 1000
        };
    }
    
    loadFiles() {
        // Load system configuration
        const configPaths = [
            '/etc/myapp/myapp.conf',
            '/etc/myapp/conf.d'
        ];
        
        configPaths.forEach(configPath => {
            if (fs.existsSync(configPath)) {
                // Load configuration files...
            }
        });
    }
    
    loadEnvironment() {
        // Environment variables take precedence
        if (process.env.PORT) this.config.port = parseInt(process.env.PORT);
        if (process.env.LOG_LEVEL) this.config.logLevel = process.env.LOG_LEVEL;
        if (process.env.MAX_CONNECTIONS) this.config.maxConnections = parseInt(process.env.MAX_CONNECTIONS);
    }
    
    get(key) {
        return this.config[key];
    }
}

module.exports = new Config();
```

## 2. Language Runtimes on Ubuntu

### Node.js Runtime Management

**Installation Methods:**
```bash
# Method 1: NodeSource Repository (Recommended for servers)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version

# Method 2: Snap (Simple but less flexible)
sudo snap install node --classic

# Method 3: nvm (Development environments)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts
```

**Production Node.js Setup:**
```bash
# Create Node.js application user
sudo useradd -r -s /bin/false -d /var/lib/nodeapp nodeapp

# Install global production tools
sudo npm install -g pm2 npm-check-updates

# Set npm cache and prefix for system-wide installs
sudo mkdir -p /usr/local/lib/npm-global
sudo chown -R root:staff /usr/local/lib/npm-global
echo 'prefix=/usr/local/lib/npm-global' | sudo tee /etc/npmrc
echo 'cache=/tmp/npm-cache' | sudo tee -a /etc/npmrc
```

**PM2 Process Manager:**
```bash
# Install and configure PM2
sudo npm install -g pm2

# Create ecosystem file
cat > /opt/myapp/ecosystem.config.js << 'EOF'
module.exports = {
    apps: [{
        name: 'myapp',
        script: '/opt/myapp/bin/server.js',
        cwd: '/opt/myapp',
        user: 'nodeapp',
        instances: 'max',
        exec_mode: 'cluster',
        env: {
            NODE_ENV: 'production',
            PORT: 3000
        },
        log_file: '/var/log/myapp/combined.log',
        out_file: '/var/log/myapp/out.log',
        error_file: '/var/log/myapp/error.log',
        time: true,
        max_memory_restart: '1G',
        node_args: '--max-old-space-size=1024'
    }]
};
EOF

# Start application with PM2
sudo -u nodeapp pm2 start /opt/myapp/ecosystem.config.js
sudo -u nodeapp pm2 save
sudo -u nodeapp pm2 startup
```

### Python Runtime Management

**Python Installation and Virtual Environments:**
```bash
# Install Python and tools
sudo apt update
sudo apt install -y python3 python3-pip python3-venv python3-dev

# Install pyenv for version management
curl https://pyenv.run | bash
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
echo 'command -v pyenv >/dev/null || export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(pyenv init -)"' >> ~/.bashrc

# Install specific Python versions
pyenv install 3.11.0
pyenv global 3.11.0

# Create virtual environment for application
python3 -m venv /opt/myapp/venv
source /opt/myapp/venv/bin/activate
pip install --upgrade pip setuptools wheel
```

**Production Python Setup:**
```bash
# Create Python application user
sudo useradd -r -s /bin/false -d /var/lib/pyapp pyapp

# Create application virtual environment
sudo python3 -m venv /opt/pyapp/venv
sudo chown -R pyapp:pyapp /opt/pyapp/venv

# Install application dependencies
sudo -u pyapp /opt/pyapp/venv/bin/pip install -r requirements.txt

# Install WSGI server (Gunicorn)
sudo -u pyapp /opt/pyapp/venv/bin/pip install gunicorn uvicorn[standard]
```

**Gunicorn Configuration:**
```bash
# Create Gunicorn configuration
cat > /etc/pyapp/gunicorn.conf.py << 'EOF'
import multiprocessing

# Server socket
bind = "127.0.0.1:8000"
backlog = 2048

# Worker processes
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "uvicorn.workers.UvicornWorker"
worker_connections = 1000
timeout = 30
keepalive = 2

# Restart workers after this many requests
max_requests = 1000
max_requests_jitter = 50

# Logging
accesslog = "/var/log/pyapp/access.log"
errorlog = "/var/log/pyapp/error.log"
loglevel = "info"
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"'

# Process naming
proc_name = "pyapp"

# User and group
user = "pyapp"
group = "pyapp"

# Preload application
preload_app = True

# Security
limit_request_line = 4094
limit_request_fields = 100
limit_request_field_size = 8190
EOF
```

## 3. Service Design with systemd

### Advanced systemd Unit Files

**Comprehensive Service Unit:**
```bash
cat > /etc/systemd/system/myapp.service << 'EOF'
[Unit]
Description=My Backend Application
Documentation=https://docs.example.com/myapp
After=network-online.target postgresql.service redis.service
Wants=network-online.target
Requires=postgresql.service

[Service]
Type=notify
User=myapp
Group=myapp
WorkingDirectory=/opt/myapp

# Environment
Environment=NODE_ENV=production
Environment=PORT=3000
EnvironmentFile=-/etc/myapp/environment
EnvironmentFile=-/etc/myapp/secrets

# Execution
ExecStartPre=/opt/myapp/scripts/pre-start.sh
ExecStart=/usr/bin/node /opt/myapp/bin/server.js
ExecStartPost=/opt/myapp/scripts/post-start.sh
ExecReload=/bin/kill -HUP $MAINPID
ExecStop=/opt/myapp/scripts/graceful-stop.sh
TimeoutStartSec=60s
TimeoutStopSec=30s

# Restart policy
Restart=on-failure
RestartSec=10s
StartLimitInterval=300s
StartLimitBurst=3

# Watchdog
WatchdogSec=30s
NotifyAccess=main

# Process management
KillMode=mixed
KillSignal=SIGTERM

# Resource limits
LimitNOFILE=65536
LimitNPROC=32768
MemoryHigh=1G
MemoryMax=1.5G
CPUQuota=200%

# Security
NoNewPrivileges=yes
ProtectSystem=strict
ProtectHome=yes
ReadWritePaths=/var/lib/myapp /var/log/myapp /var/run/myapp
PrivateTmp=yes
PrivateDevices=yes
ProtectHostname=yes
ProtectClock=yes
ProtectKernelTunables=yes
ProtectKernelModules=yes
ProtectControlGroups=yes
RestrictAddressFamilies=AF_UNIX AF_INET AF_INET6
RestrictNamespaces=yes
LockPersonality=yes
MemoryDenyWriteExecute=yes
RestrictRealtime=yes
RestrictSUIDSGID=yes
RemoveIPC=yes

# System calls
SystemCallFilter=@system-service
SystemCallErrorNumber=EPERM

# Capabilities
CapabilityBoundingSet=CAP_NET_BIND_SERVICE
AmbientCapabilities=CAP_NET_BIND_SERVICE

[Install]
WantedBy=multi-user.target
EOF
```

### Socket Activation

**Socket Unit for On-Demand Activation:**
```bash
# Create socket unit
cat > /etc/systemd/system/myapp.socket << 'EOF'
[Unit]
Description=My App Socket
PartOf=myapp.service

[Socket]
ListenStream=3000
ListenStream=[::]:3000
Accept=false
SocketUser=myapp
SocketGroup=myapp
SocketMode=0660

# Buffer sizes
ReceiveBuffer=8M
SendBuffer=8M

# Connection limits
MaxConnections=1000
MaxConnectionsPerSource=10

[Install]
WantedBy=sockets.target
EOF

# Modify service to use socket activation
cat > /etc/systemd/system/myapp.service << 'EOF'
[Unit]
Description=My Backend Application
Requires=myapp.socket
After=myapp.socket

[Service]
Type=notify
User=myapp
Group=myapp
ExecStart=/usr/bin/node /opt/myapp/bin/server.js
StandardInput=socket

# ... other options ...
EOF

# Enable socket activation
sudo systemctl enable myapp.socket
sudo systemctl start myapp.socket
```

### Watchdog Implementation

**Application-side Watchdog (Node.js):**
```javascript
// watchdog.js
const sd = require('systemd-daemon');

class WatchdogService {
    constructor(interval = 15000) {
        this.interval = interval;
        this.checks = [];
        this.timer = null;
    }
    
    addCheck(name, checkFunction) {
        this.checks.push({ name, check: checkFunction });
    }
    
    start() {
        if (!sd.watchdog.enabled) {
            console.log('Watchdog not enabled');
            return;
        }
        
        this.timer = setInterval(async () => {
            try {
                // Run all health checks
                const results = await Promise.all(
                    this.checks.map(async ({ name, check }) => {
                        try {
                            await check();
                            return { name, status: 'ok' };
                        } catch (error) {
                            return { name, status: 'error', error: error.message };
                        }
                    })
                );
                
                const failed = results.filter(r => r.status === 'error');
                
                if (failed.length === 0) {
                    sd.watchdog.ping();
                    console.log('Watchdog ping sent - all checks passed');
                } else {
                    console.error('Health checks failed:', failed);
                    // Don't ping watchdog - systemd will restart service
                }
                
            } catch (error) {
                console.error('Watchdog error:', error);
            }
        }, this.interval);
    }
    
    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
}

module.exports = WatchdogService;

// Usage in main application
const WatchdogService = require('./watchdog');
const watchdog = new WatchdogService();

// Add health checks
watchdog.addCheck('database', async () => {
    // Check database connection
    await db.raw('SELECT 1');
});

watchdog.addCheck('redis', async () => {
    // Check Redis connection
    await redis.ping();
});

watchdog.addCheck('memory', async () => {
    const usage = process.memoryUsage();
    if (usage.heapUsed > 1024 * 1024 * 1024) { // 1GB
        throw new Error('Memory usage too high');
    }
});

// Start watchdog
process.on('SIGTERM', () => watchdog.stop());
process.on('SIGINT', () => watchdog.stop());
watchdog.start();

// Notify systemd that service is ready
sd.notify.ready();
```

### Service Templates

**Template Unit for Multiple Instances:**
```bash
cat > /etc/systemd/system/worker@.service << 'EOF'
[Unit]
Description=Worker Process %i
After=network.target

[Service]
Type=simple
User=worker
Group=worker
WorkingDirectory=/opt/myapp
Environment=WORKER_ID=%i
ExecStart=/opt/myapp/bin/worker.js --id=%i
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# Start multiple worker instances
sudo systemctl enable worker@{1..4}.service
sudo systemctl start worker@{1..4}.service

# Check status
systemctl status 'worker@*.service'
```

## 4. Logging Strategy

### journald Integration

**Structured Logging with journald:**
```javascript
// Node.js structured logging
const winston = require('winston');

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: {
        service: 'myapp',
        version: process.env.APP_VERSION || '1.0.0',
        environment: process.env.NODE_ENV || 'development'
    },
    transports: [
        // Log to stdout - systemd will capture
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        // Also log to file for local debugging
        new winston.transports.File({
            filename: '/var/log/myapp/application.log',
            format: winston.format.json()
        })
    ]
});

// Request logging middleware
const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info('Request completed', {
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration,
            userAgent: req.get('User-Agent'),
            remoteAddr: req.ip,
            requestId: req.get('X-Request-ID')
        });
    });
    
    next();
};

module.exports = { logger, requestLogger };
```

**Python Structured Logging:**
```python
# Python structured logging
import logging
import json
import sys
from datetime import datetime

class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_entry = {
            'timestamp': datetime.utcnow().isoformat() + 'Z',
            'level': record.levelname,
            'message': record.getMessage(),
            'module': record.module,
            'function': record.funcName,
            'line': record.lineno,
            'service': 'myapp',
            'environment': os.environ.get('ENVIRONMENT', 'development')
        }
        
        if hasattr(record, 'extra'):
            log_entry.update(record.extra)
            
        if record.exc_info:
            log_entry['exception'] = self.formatException(record.exc_info)
            
        return json.dumps(log_entry)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

# Set custom formatter
for handler in logging.getLogger().handlers:
    handler.setFormatter(JSONFormatter())

logger = logging.getLogger(__name__)

# Usage
logger.info("User login", extra={
    'user_id': 12345,
    'action': 'login',
    'ip_address': '192.168.1.100'
})
```

### Advanced journald Configuration

**Custom journald Configuration:**
```bash
# Create application-specific journald configuration
sudo mkdir -p /etc/systemd/journald.conf.d
cat > /etc/systemd/journald.conf.d/myapp.conf << 'EOF'
[Journal]
# Increase rate limits for high-volume applications
RateLimitInterval=10s
RateLimitBurst=10000

# Storage settings
SystemMaxUse=2G
SystemKeepFree=1G
SystemMaxFileSize=100M
MaxRetentionSec=1month

# Forward to rsyslog for external processing
ForwardToSyslog=yes
ForwardToKMsg=no
ForwardToConsole=no
EOF

sudo systemctl restart systemd-journald
```

**Advanced journalctl Queries:**
```bash
# Application-specific logging queries
sudo journalctl -u myapp.service --since "1 hour ago" -f

# Filter by log level
sudo journalctl -u myapp.service -p err

# JSON output for processing
sudo journalctl -u myapp.service -o json | jq '.MESSAGE' | grep -i error

# Custom field filtering (for structured logs)
sudo journalctl -u myapp.service SYSLOG_IDENTIFIER=myapp

# Performance monitoring
sudo journalctl -u myapp.service --since "1 hour ago" | grep -E "(duration|response_time)" | tail -100

# Export logs for analysis
sudo journalctl -u myapp.service --since "2024-01-01" --until "2024-01-02" -o json > /tmp/myapp-logs.json
```

### rsyslog Integration

**rsyslog Configuration for Application Logs:**
```bash
# Create rsyslog configuration for application
cat > /etc/rsyslog.d/30-myapp.conf << 'EOF'
# Application-specific logging
if $programname == 'myapp' then {
    # All logs to application log file
    /var/log/myapp/application.log
    
    # Errors to separate file
    if $syslogseverity <= 3 then /var/log/myapp/error.log
    
    # Access logs (based on message content)
    if $msg contains 'Request completed' then /var/log/myapp/access.log
    
    # Audit logs
    if $msg contains 'audit' then /var/log/myapp/audit.log
    
    # Remote logging (optional)
    @@log.example.com:514
    
    # Stop processing after matching
    stop
}

# Rate limiting for application logs
$SystemLogRateLimitInterval 2
$SystemLogRateLimitBurst 500
EOF

# Restart rsyslog
sudo systemctl restart rsyslog
```

### Log Rotation Strategy

**Advanced logrotate Configuration:**
```bash
cat > /etc/logrotate.d/myapp << 'EOF'
/var/log/myapp/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 0644 myapp myapp
    
    # Use date as suffix
    dateext
    dateformat -%Y%m%d-%s
    
    # Copy and truncate for applications that keep file handles open
    copytruncate
    
    # Size-based rotation as fallback
    size 100M
    
    # Post-rotation script
    postrotate
        # Reload application if needed
        if systemctl is-active myapp.service > /dev/null; then
            systemctl reload myapp.service
        fi
        
        # Compress older logs immediately
        find /var/log/myapp -name "*.log-*" -mtime +1 -not -name "*.gz" -exec gzip {} \;
    endscript
    
    # Separate configuration for different log types
}

# Access logs - keep longer
/var/log/myapp/access.log {
    daily
    rotate 90
    compress
    delaycompress
    missingok
    notifempty
    create 0644 myapp myapp
    copytruncate
    
    # Archive monthly
    monthly
    dateext
    
    postrotate
        # Process access logs for analytics
        /opt/myapp/scripts/process-access-logs.sh /var/log/myapp/access.log.1 &
    endscript
}

# Error logs - immediate attention
/var/log/myapp/error.log {
    hourly
    rotate 168  # 1 week of hourly logs
    compress
    delaycompress
    missingok
    notifempty
    create 0644 myapp myapp
    copytruncate
    
    postrotate
        # Alert on errors
        if [ -s /var/log/myapp/error.log.1 ]; then
            /opt/myapp/scripts/alert-on-errors.sh
        fi
    endscript
}
EOF

# Test logrotate configuration
sudo logrotate -d /etc/logrotate.d/myapp
sudo logrotate -f /etc/logrotate.d/myapp
```

### Centralized Logging Setup

**ELK Stack Integration:**
```bash
# Install Filebeat
curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-8.5.0-amd64.deb
sudo dpkg -i filebeat-8.5.0-amd64.deb

# Configure Filebeat
cat > /etc/filebeat/filebeat.yml << 'EOF'
filebeat.inputs:
- type: journald
  id: myapp-journal
  include_matches:
    - "_SYSTEMD_UNIT=myapp.service"
  
- type: log
  enabled: true
  paths:
    - /var/log/myapp/*.log
  fields:
    service: myapp
    environment: production
  fields_under_root: true
  
  # JSON parsing
  json.keys_under_root: true
  json.add_error_key: true
  json.message_key: message

processors:
- add_host_metadata:
    when.not.contains.tags: forwarded
    
- add_docker_metadata: ~

- add_kubernetes_metadata: ~

output.elasticsearch:
  hosts: ["elasticsearch:9200"]
  index: "myapp-logs-%{+yyyy.MM.dd}"
  
output.logstash:
  hosts: ["logstash:5044"]

logging.level: info
logging.to_files: true
logging.files:
  path: /var/log/filebeat
  name: filebeat
  keepfiles: 7
  permissions: 0644
EOF

sudo systemctl enable --now filebeat
```

## 5. Performance Profiling and Monitoring

### System-Level Profiling Tools

**Basic Performance Monitoring:**
```bash
# Install performance tools
sudo apt install -y htop iotop nethogs sysstat perf-tools

# CPU monitoring
htop -p $(pgrep -f myapp)
top -p $(pgrep -f myapp)

# Detailed process information
ps aux | grep myapp
ps -eo pid,ppid,cmd,%mem,%cpu --sort=-%mem | grep myapp

# Memory analysis
pmap -d $(pgrep -f myapp)
smem -p | grep myapp

# I/O monitoring
iotop -p $(pgrep -f myapp)
sudo iotop -a -o -d 1

# Network monitoring
nethogs -p
ss -tulpn | grep :3000
```

**System Statistics with sysstat:**
```bash
# Enable sysstat
sudo systemctl enable sysstat
sudo systemctl start sysstat

# CPU utilization
sar -u 1 10  # Every 1 second for 10 times
sar -u -f /var/log/sysstat/saXX  # Historical data

# Memory utilization
sar -r 1 10
sar -S 1 10  # Swap usage

# I/O statistics
sar -d 1 10
iostat -x 1 10

# Network statistics
sar -n DEV 1 10  # Network interfaces
sar -n TCP 1 10  # TCP statistics

# Load average
sar -q 1 10

# Generate daily report
sar -A -f /var/log/sysstat/sa$(date +%d)
```

### Advanced Profiling with perf

**CPU Profiling:**
```bash
# Install perf
sudo apt install -y linux-tools-generic

# Record CPU profile
sudo perf record -g -p $(pgrep -f myapp) -- sleep 30

# Analyze results
sudo perf report
sudo perf report --stdio

# Real-time monitoring
sudo perf top -p $(pgrep -f myapp)

# System-wide profiling
sudo perf record -g -- sleep 60
sudo perf report

# Generate flame graph
git clone https://github.com/brendangregg/FlameGraph
sudo perf record -g -p $(pgrep -f myapp) -- sleep 30
sudo perf script | ./FlameGraph/stackcollapse-perf.pl | ./FlameGraph/flamegraph.pl > profile.svg
```

**Memory Profiling:**
```bash
# Memory leak detection with valgrind
sudo apt install -y valgrind

# For Node.js applications
valgrind --tool=memcheck --leak-check=full --show-leak-kinds=all node /opt/myapp/bin/server.js

# For compiled applications
valgrind --tool=memcheck --leak-check=full ./myapp

# Heap profiling
valgrind --tool=massif ./myapp
ms_print massif.out.xxxx
```

### Application-Specific Profiling

**Node.js Profiling:**
```javascript
// Built-in profiler
const v8 = require('v8');
const fs = require('fs');

// Heap snapshot
function takeHeapSnapshot() {
    const snapshot = v8.writeHeapSnapshot();
    console.log(`Heap snapshot written to ${snapshot}`);
}

// CPU profiling
const inspector = require('inspector');

function startProfiling() {
    const session = new inspector.Session();
    session.connect();
    
    session.post('Profiler.enable');
    session.post('Profiler.start');
    
    return session;
}

function stopProfiling(session) {
    return new Promise((resolve) => {
        session.post('Profiler.stop', (err, { profile }) => {
            fs.writeFileSync('profile.cpuprofile', JSON.stringify(profile));
            session.disconnect();
            resolve();
        });
    });
}

// Performance monitoring middleware
const performanceMonitor = (req, res, next) => {
    const start = process.hrtime.bigint();
    
    res.on('finish', () => {
        const duration = Number(process.hrtime.bigint() - start) / 1e6; // Convert to milliseconds
        
        if (duration > 1000) { // Log slow requests
            console.warn('Slow request detected', {
                method: req.method,
                url: req.url,
                duration: `${duration}ms`,
                memory: process.memoryUsage()
            });
        }
    });
    
    next();
};

// Memory monitoring
setInterval(() => {
    const usage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    console.log('Resource usage:', {
        memory: {
            rss: Math.round(usage.rss / 1024 / 1024) + 'MB',
            heapUsed: Math.round(usage.heapUsed / 1024 / 1024) + 'MB',
            heapTotal: Math.round(usage.heapTotal / 1024 / 1024) + 'MB'
        },
        cpu: {
            user: cpuUsage.user,
            system: cpuUsage.system
        }
    });
}, 30000);
```

**Python Profiling:**
```python
# cProfile for CPU profiling
import cProfile
import pstats
from functools import wraps

def profile_function(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        profiler = cProfile.Profile()
        result = profiler.runcall(func, *args, **kwargs)
        
        stats = pstats.Stats(profiler)
        stats.sort_stats('cumulative')
        stats.print_stats(20)  # Top 20 functions
        
        return result
    return wrapper

# Memory profiling with memory_profiler
from memory_profiler import profile

@profile
def memory_intensive_function():
    # Function to profile
    pass

# Line profiler
@profile  # Requires kernprof
def line_by_line_profiling():
    # Profile line by line
    pass

# Application monitoring
import psutil
import os

def log_system_stats():
    process = psutil.Process(os.getpid())
    
    return {
        'cpu_percent': process.cpu_percent(),
        'memory_info': process.memory_info(),
        'memory_percent': process.memory_percent(),
        'num_threads': process.num_threads(),
        'connections': len(process.connections()),
        'open_files': len(process.open_files())
    }
```

### eBPF for Advanced Tracing

**Install BCC Tools:**
```bash
# Install BCC
sudo apt update
sudo apt install -y bpfcc-tools linux-headers-$(uname -r)

# System call tracing
sudo execsnoop  # Monitor process execution
sudo opensnoop  # Monitor file opens
sudo tcpconnect  # Monitor TCP connections
sudo biolatency  # Block I/O latency

# Application-specific tracing
sudo trace -p $(pgrep -f myapp) 'r::malloc'  # Trace malloc calls
sudo funccount -p $(pgrep -f myapp) 'c:*'  # Count function calls

# Custom eBPF script for Node.js
cat > nodejs-trace.py << 'EOF'
#!/usr/bin/env python3
from bcc import BPF

program = r"""
#include <uapi/linux/ptrace.h>
#include <linux/sched.h>

BPF_HASH(start, u32);

int trace_start(struct pt_regs *ctx) {
    u32 pid = bpf_get_current_pid_tgid();
    u64 ts = bpf_ktime_get_ns();
    start.update(&pid, &ts);
    return 0;
}

int trace_return(struct pt_regs *ctx) {
    u32 pid = bpf_get_current_pid_tgid();
    u64 *tsp, delta;
    
    tsp = start.lookup(&pid);
    if (tsp == 0) return 0;
    
    delta = bpf_ktime_get_ns() - *tsp;
    bpf_trace_printk("Function took %llu ns\\n", delta);
    start.delete(&pid);
    
    return 0;
}
"""

b = BPF(text=program)
b.attach_uprobe(name="node", sym_re=".*_start", fn_name="trace_start")
b.attach_uretprobe(name="node", sym_re=".*_start", fn_name="trace_return")

print("Tracing Node.js... Press Ctrl+C to stop")
b.trace_print()
EOF

sudo python3 nodejs-trace.py
```

## 6. Networking for Backend Services

### Port Management and Service Discovery

**Port Allocation Strategy:**
```bash
# Standard port assignments
echo "=== Standard Port Assignments ==="
echo "80     - HTTP"
echo "443    - HTTPS"
echo "22     - SSH"
echo "3000   - Node.js development"
echo "8000   - Python development"
echo "8080   - Java development"
echo "5432   - PostgreSQL"
echo "6379   - Redis"
echo "27017  - MongoDB"

# Check port availability
netstat -tuln | grep :3000
ss -tuln | grep :3000
lsof -i :3000

# Reserve ports for applications
echo 'net.ipv4.ip_local_reserved_ports = 3000,3001,3002' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

**Service Discovery Setup:**
```bash
# Using systemd-resolved for local service discovery
cat > /etc/systemd/resolved.conf.d/local-services.conf << 'EOF'
[Resolve]
DNS=127.0.0.1#5353
Domains=~local
EOF

# Install and configure Consul for service discovery
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install consul

# Consul configuration
cat > /etc/consul.d/server.json << 'EOF'
{
  "datacenter": "dc1",
  "data_dir": "/var/lib/consul",
  "log_level": "INFO",
  "server": true,
  "bootstrap_expect": 1,
  "bind_addr": "127.0.0.1",
  "client_addr": "127.0.0.1",
  "ui_config": {
    "enabled": true
  },
  "connect": {
    "enabled": true
  }
}
EOF

sudo systemctl enable --now consul
```

### Reverse Proxy Configuration

**nginx as Reverse Proxy:**
```bash
# Install nginx
sudo apt install -y nginx

# Main nginx configuration
cat > /etc/nginx/nginx.conf << 'EOF'
user www-data;
worker_processes auto;
worker_rlimit_nofile 65535;
pid /run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    # Basic Settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    keepalive_requests 100;
    types_hash_max_size 2048;
    server_tokens off;
    
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                   '$status $body_bytes_sent "$http_referer" '
                   '"$http_user_agent" "$http_x_forwarded_for" '
                   'rt=$request_time uct="$upstream_connect_time" '
                   'uht="$upstream_header_time" urt="$upstream_response_time"';
    
    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log;
    
    # Gzip Settings
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
    
    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_conn_zone $binary_remote_addr zone=conn_limit_per_ip:10m;
    
    # Upstream
    upstream backend {
        least_conn;
        server 127.0.0.1:3000 max_fails=3 fail_timeout=30s;
        server 127.0.0.1:3001 max_fails=3 fail_timeout=30s backup;
        keepalive 32;
    }
    
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
EOF

# Application-specific configuration
cat > /etc/nginx/sites-available/myapp << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name myapp.local _;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy strict-origin-when-cross-origin;
    
    # Rate limiting
    limit_req zone=api burst=20 nodelay;
    limit_conn conn_limit_per_ip 20;
    
    # Static files
    location /static/ {
        alias /var/www/myapp/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # API endpoints
    location /api/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Buffering
        proxy_buffering on;
        proxy_buffer_size 128k;
        proxy_buffers 4 256k;
        proxy_busy_buffers_size 256k;
        
        # Timeouts
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
        
        # Cache
        proxy_cache_bypass $http_upgrade;
    }
    
    # WebSocket support
    location /ws/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
    }
    
    # Default location
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

**HAProxy Configuration:**
```bash
# Install HAProxy
sudo apt install -y haproxy

# HAProxy configuration
cat > /etc/haproxy/haproxy.cfg << 'EOF'
global
    log 127.0.0.1:514 local0
    chroot /var/lib/haproxy
    stats socket /run/haproxy/admin.sock mode 660 level admin
    stats timeout 30s
    user haproxy
    group haproxy
    daemon
    
    # SSL/TLS configuration
    ssl-default-bind-ciphers ECDHE+AESGCM:ECDHE+CHACHA20:RSA+AESGCM:RSA+AES:!aNULL:!MD5:!DSS
    ssl-default-bind-options ssl-min-ver TLSv1.2 no-tls-tickets

defaults
    mode http
    log global
    option httplog
    option dontlognull
    option log-health-checks
    option forwardfor
    option http-server-close
    timeout connect 5000
    timeout client 50000
    timeout server 50000
    errorfile 400 /etc/haproxy/errors/400.http
    errorfile 403 /etc/haproxy/errors/403.http
    errorfile 408 /etc/haproxy/errors/408.http
    errorfile 500 /etc/haproxy/errors/500.http
    errorfile 502 /etc/haproxy/errors/502.http
    errorfile 503 /etc/haproxy/errors/503.http
    errorfile 504 /etc/haproxy/errors/504.http

# Statistics
frontend stats
    bind *:8404
    stats enable
    stats uri /stats
    stats refresh 10s
    stats admin if TRUE

# Frontend
frontend web_frontend
    bind *:80
    bind *:443 ssl crt /etc/ssl/private/myapp.pem
    
    # Redirect HTTP to HTTPS
    redirect scheme https if !{ ssl_fc }
    
    # Rate limiting
    stick-table type ip size 100k expire 30s store http_req_rate(10s)
    http-request track-sc0 src
    http-request deny if { sc_http_req_rate(0) gt 20 }
    
    # Health check
    acl health_check path /health
    use_backend backend_servers if health_check
    
    # API routing
    acl api_request path_beg /api/
    use_backend api_servers if api_request
    
    default_backend backend_servers

# Backend
backend backend_servers
    balance roundrobin
    option httpchk GET /health
    http-check expect status 200
    
    server web1 127.0.0.1:3000 check inter 5s rise 2 fall 3
    server web2 127.0.0.1:3001 check inter 5s rise 2 fall 3 backup

backend api_servers
    balance leastconn
    option httpchk GET /api/health
    http-check expect status 200
    
    server api1 127.0.0.1:3100 check inter 5s rise 2 fall 3
    server api2 127.0.0.1:3101 check inter 5s rise 2 fall 3
EOF

sudo systemctl enable --now haproxy
```

### SSL/TLS Configuration

**Let's Encrypt with Certbot:**
```bash
# Install certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d myapp.example.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet

# Manual certificate management
sudo certbot certificates
sudo certbot revoke --cert-path /etc/letsencrypt/live/myapp.example.com/cert.pem
```

**nginx SSL Configuration:**
```bash
cat > /etc/nginx/sites-available/myapp-ssl << 'EOF'
server {
    listen 80;
    server_name myapp.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name myapp.example.com;
    
    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/myapp.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/myapp.example.com/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/myapp.example.com/chain.pem;
    
    # SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;
    
    # OCSP stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 8.8.8.8 8.8.4.4 valid=300s;
    resolver_timeout 5s;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
    
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF
```

## 7. Data Services Management

### PostgreSQL Installation and Tuning

**PostgreSQL Setup:**
```bash
# Install PostgreSQL
sudo apt update
sudo apt install -y postgresql postgresql-contrib postgresql-client

# Start and enable service
sudo systemctl enable --now postgresql

# Create application database and user
sudo -u postgres createuser --interactive myapp
sudo -u postgres createdb myapp_production -O myapp

# Set password for user
sudo -u postgres psql -c "ALTER USER myapp PASSWORD 'secure_password';"

# Create application schema
sudo -u postgres psql -d myapp_production -c "
    CREATE SCHEMA IF NOT EXISTS myapp;
    GRANT ALL PRIVILEGES ON SCHEMA myapp TO myapp;
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA myapp TO myapp;
    GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA myapp TO myapp;
    ALTER DEFAULT PRIVILEGES IN SCHEMA myapp GRANT ALL ON TABLES TO myapp;
    ALTER DEFAULT PRIVILEGES IN SCHEMA myapp GRANT ALL ON SEQUENCES TO myapp;
"
```

**PostgreSQL Performance Tuning:**
```bash
# Generate optimized configuration
sudo -u postgres postgres -D /var/lib/postgresql/14/main --describe-config > /tmp/postgres-config.txt

# Edit main configuration
sudo -u postgres cp /etc/postgresql/14/main/postgresql.conf /etc/postgresql/14/main/postgresql.conf.backup

cat >> /etc/postgresql/14/main/postgresql.conf << 'EOF'
# Performance Tuning for Production

# Memory settings (adjust based on available RAM)
shared_buffers = 1GB                    # 25% of RAM
effective_cache_size = 3GB              # 75% of RAM
work_mem = 64MB                         # Per-operation memory
maintenance_work_mem = 256MB            # Maintenance operations

# WAL settings
wal_buffers = 16MB
checkpoint_completion_target = 0.7
checkpoint_timeout = 10min
max_wal_size = 2GB
min_wal_size = 512MB

# Connection settings
max_connections = 200
superuser_reserved_connections = 3

# Query planner
random_page_cost = 1.1                  # SSD optimized
effective_io_concurrency = 200          # SSD concurrent I/O

# Logging
log_destination = 'csvlog'
logging_collector = on
log_directory = '/var/log/postgresql'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
log_rotation_age = 1d
log_rotation_size = 100MB
log_min_duration_statement = 1000       # Log slow queries
log_checkpoints = on
log_lock_waits = on
log_temp_files = 10MB

# Monitoring
track_activities = on
track_counts = on
track_io_timing = on
track_functions = all
stats_temp_directory = '/var/run/postgresql/14-main.pg_stat_tmp'

# Autovacuum tuning
autovacuum = on
autovacuum_max_workers = 3
autovacuum_naptime = 20s
autovacuum_vacuum_threshold = 50
autovacuum_analyze_threshold = 50
EOF

# Restart PostgreSQL
sudo systemctl restart postgresql
```

**Connection Pooling with PgBouncer:**
```bash
# Install PgBouncer
sudo apt install -y pgbouncer

# Configure PgBouncer
cat > /etc/pgbouncer/pgbouncer.ini << 'EOF'
[databases]
myapp_production = host=localhost port=5432 dbname=myapp_production user=myapp

[pgbouncer]
listen_addr = 127.0.0.1
listen_port = 6432
auth_type = md5
auth_file = /etc/pgbouncer/userlist.txt
admin_users = postgres
pool_mode = transaction
server_reset_query = DISCARD ALL
max_client_conn = 1000
default_pool_size = 50
reserve_pool_size = 5
reserve_pool_timeout = 5
server_lifetime = 3600
server_idle_timeout = 600
log_connections = 1
log_disconnections = 1
log_pooler_errors = 1
EOF

# Create user list
echo '"myapp" "md5hashed_password"' > /etc/pgbouncer/userlist.txt
sudo chown postgres:postgres /etc/pgbouncer/userlist.txt
sudo chmod 640 /etc/pgbouncer/userlist.txt

sudo systemctl enable --now pgbouncer
```

### MongoDB Installation and Configuration

**MongoDB Setup:**
```bash
# Import MongoDB GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt update
sudo apt install -y mongodb-org

# Start and enable service
sudo systemctl enable --now mongod

# Secure installation
sudo mongo admin --eval 'db.createUser({user:"admin",pwd:"secure_admin_password",roles:["userAdminAnyDatabase","dbAdminAnyDatabase","readWriteAnyDatabase"]})'

# Enable authentication
sudo sed -i 's/#security:/security:\n  authorization: enabled/' /etc/mongod.conf
sudo systemctl restart mongod
```

**MongoDB Performance Tuning:**
```bash
# Edit MongoDB configuration
cat > /etc/mongod.conf << 'EOF'
# Network interfaces
net:
  port: 27017
  bindIp: 127.0.0.1

# Security
security:
  authorization: enabled

# Storage engine
storage:
  dbPath: /var/lib/mongodb
  journal:
    enabled: true
  wiredTiger:
    engineConfig:
      cacheSizeGB: 2
      journalCompressor: snappy
      directoryForIndexes: false
    collectionConfig:
      blockCompressor: snappy
    indexConfig:
      prefixCompression: true

# Logging
systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log

# Process management
processManagement:
  fork: true
  pidFilePath: /var/lib/mongodb/mongod.lock
  timeZoneInfo: /usr/share/zoneinfo

# Replication (for replica sets)
#replication:
#  replSetName: "rs0"

# Sharding (for sharded clusters)
#sharding:
#  clusterRole: shardsvr
EOF

sudo systemctl restart mongod
```

**MongoDB Backup Strategy:**
```bash
# Create backup script
cat > /opt/scripts/mongodb-backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="mongodb_backup_$DATE"

mkdir -p "$BACKUP_DIR"

# Full database backup
mongodump --host localhost:27017 -u admin -p secure_admin_password --authenticationDatabase admin --out "$BACKUP_DIR/$BACKUP_NAME"

# Compress backup
tar -czf "$BACKUP_DIR/$BACKUP_NAME.tar.gz" -C "$BACKUP_DIR" "$BACKUP_NAME"
rm -rf "$BACKUP_DIR/$BACKUP_NAME"

# Keep only last 7 days of backups
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete

echo "MongoDB backup completed: $BACKUP_NAME.tar.gz"
EOF

chmod +x /opt/scripts/mongodb-backup.sh

# Schedule backup
sudo crontab -e
# Add: 0 2 * * * /opt/scripts/mongodb-backup.sh
```

### Redis Installation and Configuration

**Redis Setup:**
```bash
# Install Redis
sudo apt update
sudo apt install -y redis-server

# Configure Redis
cat > /etc/redis/redis.conf << 'EOF'
# Network
bind 127.0.0.1 ::1
port 6379
protected-mode yes

# General
daemonize yes
pidfile /var/run/redis/redis-server.pid
loglevel notice
logfile /var/log/redis/redis-server.log

# Persistence
save 900 1
save 300 10
save 60 10000
dbfilename dump.rdb
dir /var/lib/redis

# Memory
maxmemory 1gb
maxmemory-policy allkeys-lru

# Security
requirepass secure_redis_password

# Performance
tcp-keepalive 300
timeout 0
tcp-backlog 511
EOF

sudo systemctl restart redis-server
sudo systemctl enable redis-server
```

---

## Terminology Glossary

### **FHS (Filesystem Hierarchy Standard)**
- Standard defining directory structure and contents in Linux systems
- Ensures consistent file locations across distributions
- Key directories: `/etc` (config), `/var` (variable data), `/opt` (optional software)
- Compliance improves system maintainability and admin tool compatibility

### **systemd Unit File**
- Configuration file defining systemd services, sockets, timers, and targets
- Located in `/etc/systemd/system/` or `/usr/lib/systemd/system/`
- Sections include `[Unit]`, `[Service]`, `[Install]`
- Controls service behavior, dependencies, and resource limits

### **Socket Activation**
- systemd feature allowing services to start on-demand when connections arrive
- Improves boot time and resource usage
- Uses separate `.socket` unit files paired with `.service` units
- Common for web servers and network services

### **Watchdog**
- Mechanism for monitoring service health and automatic restart
- Application must periodically signal to systemd that it's healthy
- Configured with `WatchdogSec=` in service unit
- Prevents hanging processes from appearing healthy

### **PM2**
- Production process manager for Node.js applications
- Features: clustering, monitoring, log management, auto-restart
- Ecosystem files define application configuration
- Alternative to systemd for Node.js-specific process management

### **Gunicorn**
- Python WSGI HTTP server for running Python web applications
- Pre-fork worker model for handling multiple requests
- Configuration includes worker count, timeouts, logging
- Industry standard for serving Python web applications

### **Virtual Environment (venv)**
- Isolated Python environment with its own packages and dependencies
- Prevents conflicts between different applications' requirements
- Created with `python3 -m venv` command
- Essential for Python application deployment

### **Maven**
- Build automation and project management tool for Java
- Uses `pom.xml` file to define project structure and dependencies
- Handles compilation, testing, packaging, and deployment
- Standard build tool in Java ecosystem

### **JVM Tuning**
- Process of optimizing Java Virtual Machine parameters for performance
- Key parameters: heap size (`-Xms`, `-Xmx`), garbage collector settings
- Environment-specific tuning for memory, CPU, and workload characteristics
- Critical for Java application performance

### **Reverse Proxy**
- Server that forwards client requests to backend servers
- Benefits: load balancing, SSL termination, caching, security
- nginx and HAProxy are popular reverse proxy solutions
- Essential component in modern web architecture

### **Load Balancing**
- Distributing incoming requests across multiple backend servers
- Algorithms: round-robin, least connections, weighted distribution
- Improves availability, scalability, and fault tolerance
- Configured in reverse proxy servers

### **SSL/TLS Termination**
- Process of decrypting SSL/TLS traffic at the proxy level
- Reduces CPU load on backend servers
- Centralizes certificate management
- Common pattern in web application architecture

### **Let's Encrypt**
- Free, automated certificate authority providing SSL/TLS certificates
- ACME protocol for automatic certificate issuance and renewal
- Certbot is the official client tool
- Industry standard for SSL certificate management

### **Connection Pooling**
- Technique of maintaining persistent database connections
- Reduces connection overhead and improves performance
- PgBouncer for PostgreSQL, connection pools for application frameworks
- Essential for high-traffic database applications

### **Database Tuning**
- Process of optimizing database configuration for performance
- Key areas: memory allocation, query optimization, indexing
- Database-specific parameters and monitoring
- Critical for backend application performance

### **Structured Logging**
- Logging format using structured data (typically JSON)
- Enables better log parsing, searching, and analysis
- Includes metadata like timestamps, request IDs, user context
- Essential for modern observability practices

### **Log Rotation**
- Automatic management of log file size and retention
- Prevents disk space exhaustion from growing log files
- logrotate utility handles compression, archival, and cleanup
- Configurable based on size, time, or custom criteria

### **journalctl**
- Command-line tool for querying systemd journal logs
- Powerful filtering by service, time, priority, and custom fields
- Supports JSON output for programmatic processing
- Primary tool for systemd-based log management

### **Performance Profiling**
- Process of analyzing application performance characteristics
- Tools: perf, htop, strace, language-specific profilers
- Identifies bottlenecks in CPU, memory, I/O, and network
- Essential for optimizing backend application performance

### **Flame Graphs**
- Visualization technique for CPU profiling data
- Shows call stack frequency and duration in hierarchical format
- Helps identify performance hotspots and optimization opportunities
- Generated from perf data using Brendan Gregg's tools

### **eBPF (Extended Berkeley Packet Filter)**
- Linux kernel technology for safe, efficient program execution
- Enables runtime tracing, monitoring, and security without kernel modifications
- Tools: BCC (BPF Compiler Collection) for system observability
- Advanced technique for deep system analysis

### **Service Discovery**
- Mechanism for services to find and communicate with each other
- Solutions: DNS, Consul, etcd, Kubernetes services
- Important for microservices and distributed architectures
- Enables dynamic service registration and health checking

### **Rate Limiting**
- Technique to control the rate of requests to prevent abuse
- Implemented at proxy level (nginx, HAProxy) or application level
- Protects against DDoS attacks and ensures fair resource usage
- Configurable based on IP, user, or custom criteria

### **Health Checks**
- Automated tests to verify service availability and functionality
- Used by load balancers to route traffic only to healthy instances
- Can check database connectivity, external dependencies
- Essential for high-availability service architectures

### **Backup Strategy**
- Comprehensive plan for data protection and disaster recovery
- Components: full backups, incremental backups, point-in-time recovery
- Considerations: RPO (Recovery Point Objective), RTO (Recovery Time Objective)
- Regular testing of backup restoration procedures

### **Monitoring and Alerting**
- Continuous observation of system and application metrics
- Tools: Prometheus, Grafana, ELK stack, custom dashboards
- Proactive identification of issues before they impact users
- Essential for production system reliability

---

## Summary

Part III provides comprehensive guidance for backend engineering on Linux systems:

- **Project Structure**: Follow FHS standards for maintainable, predictable deployments
- **Runtime Management**: Master Node.js, Python, and Java deployment patterns with proper isolation
- **Service Design**: Leverage systemd's advanced features for robust, secure service management
- **Logging Strategy**: Implement structured logging with journald integration and centralized collection
- **Performance**: Use profiling tools and monitoring to optimize application performance
- **Networking**: Configure reverse proxies, load balancing, and SSL/TLS for production traffic
- **Data Services**: Install, tune, and maintain PostgreSQL, MongoDB, and Redis for optimal performance

These practices enable reliable, scalable, and maintainable backend systems that can handle production workloads effectively.