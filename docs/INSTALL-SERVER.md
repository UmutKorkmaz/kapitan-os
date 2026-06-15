# KAPiTaN OS Installation — Sunucu (Server) Guide

## Minimal Server Setup

### Prerequisites
- Debian 12 (Bookworm) Minimal
- 4+ GB RAM
- 5+ GB disk space
- Root/sudo access

### Step 1: Configure apt Repository
```bash
# As root or with sudo
curl -fsSL https://umutkorkmaz.github.io/kapitan-apt/kapitan-archive-keyring.asc | apt-key add -
echo "deb https://umutkorkmaz.github.io/kapitan-apt alpha main" > /etc/apt/sources.list.d/kapitan.list
apt update
```

### Step 2: Install Core Package
```bash
# Minimal installation (shell layer only)
apt install kapitan-sh

# Or with package management
apt install kapitan-sh kapitan-pazar
```

### Step 3: System Configuration
```bash
# Set locale to Turkish (optional)
export LANG=tr_TR.UTF-8

# Verify installation
kapitan-sh --version
```

### Automation Examples
```bash
# Create admin script in Turkish
cat > /usr/local/bin/sunucu-yapı << 'SCRIPT'
#!/bin/bash
# Server configuration script
echo "Sunucu ayarlanıyor..."
# Your configuration here
SCRIPT

chmod +x /usr/local/bin/sunucu-yapı
```

### Uninstall
```bash
apt remove kapitan-sh kapitan-pazar
apt remove --purge kapitan-sh
```
