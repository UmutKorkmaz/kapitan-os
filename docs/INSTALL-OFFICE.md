# KAPiTaN OS Installation — Ofis (Office) Guide

## Desktop/Office User Installation

### Prerequisites
- Desktop Linux (Ubuntu GNOME, KDE Plasma, etc.)
- 8+ GB RAM
- 10+ GB disk space
- Internet connection (for initial setup)

### Step 1: Add Repository (GUI Method)
```bash
# Open Terminal and run:
curl -fsSL https://umutkorkmaz.github.io/kapitan-apt/kapitan-archive-keyring.asc | sudo apt-key add -
echo "deb https://umutkorkmaz.github.io/kapitan-apt alpha main" | sudo tee /etc/apt/sources.list.d/kapitan.list
sudo apt update
```

### Step 2: Install via Software Center
1. Open "Software" application
2. Search for "kapitan"
3. Install all three packages:
   - kapitan-sh
   - kapitan-pazar
   - kapitan-ai

Or via terminal:
```bash
sudo apt install kapitan-sh kapitan-pazar kapitan-ai
```

### Step 3: Set Up Turkish Locale (Optional)
```bash
# System Settings → Region & Language → Turkish
# Or set environment:
export LANG=tr_TR.UTF-8
```

### Using Turkish Commands
```bash
# Open Terminal
# Try Turkish AI assistant
sor "Merhaba! Bugün neler yapabilirim?"

# Package management
kapitan-pazar ara "ofis yazılımı"
```

### Keyboard Shortcuts
- `Ctrl+Alt+T` — Open Terminal
- Turkish keyboard layout available in Settings

### Uninstall
1. Open Software application
2. Search "kapitan"
3. Click "Remove" on each package

Or via terminal:
```bash
sudo apt remove kapitan-*
```
