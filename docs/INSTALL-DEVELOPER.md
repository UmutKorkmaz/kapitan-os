# KAPiTaN OS Installation — Geliştirici (Developer) Guide

## For Developers: Complete Setup with AI Features

### Prerequisites
- Debian/Ubuntu 22.04 LTS or later
- 8+ GB RAM (recommended for AI model)
- NVIDIA/AMD GPU (optional but recommended)
- Terminal access and basic Linux knowledge

### Step 1: Add apt Repository
```bash
# Import GPG key
curl -fsSL https://umutkorkmaz.github.io/kapitan-apt/kapitan-archive-keyring.asc | sudo apt-key add -

# Add repository
echo "deb https://umutkorkmaz.github.io/kapitan-apt alpha main" | sudo tee /etc/apt/sources.list.d/kapitan.list

# Update package list
sudo apt update
```

### Step 2: Install KAPiTaN Packages
```bash
# Core packages
sudo apt install kapitan-sh kapitan-pazar kapitan-ai
```

### Step 3: Install Ollama (for AI features)
```bash
# Download and install Ollama
curl https://ollama.ai/install.sh | sh

# Download Qwen3.5-4B model
ollama pull qwen:3.5-instruct

# Start Ollama service
ollama serve &
```

### Step 4: Verify Installation
```bash
# Check packages
dpkg -l | grep kapitan

# Test kapitan-ai
kapitan-ai doctor

# Test Turkish commands
sor "Merhaba, nasıl yardımcı olabilirim?"
```

### Development Tools
```bash
# Shell scripting
kapitan-sh --help

# Package management
kapitan-pazar --help

# AI assistant
kapitan-ai --help
```

### Uninstall
```bash
sudo apt remove kapitan-sh kapitan-pazar kapitan-ai
sudo rm /etc/apt/sources.list.d/kapitan.list
```
