# KAPiTaN OS v0.1.0-alpha Release Notes

**Release Date:** June 15, 2026  
**Version:** 0.1.0-alpha  
**Status:** Public Release

## Overview

KAPiTaN OS v0.1.0-alpha is the first public release of the Turkish command-layer Linux distribution. This alpha release includes:

- **Multi-edition ISO images** (Geliştirici, Bar, Ofis)
- **Three Debian packages** for apt repository installation
- **GPG-signed apt repository** for secure package management
- **AI-powered command assistant** (Qwen3.5-4B-Instruct)
- **Turkish language support** throughout the system

## What's New

### 🎯 Core Features
- ✅ 218+ Turkish command implementations
- ✅ Qwen3.5-4B LLM integration for intelligent command suggestions
- ✅ Multi-edition builds (Geliştirici, Bar, Ofis)
- ✅ Signed apt repository with GPG authentication
- ✅ UEFI and BIOS dual-boot support

### 📦 Available Packages
1. **kapitan-sh** (9.8 KB) — Core shell command layer
2. **kapitan-pazar** (4.7 KB) — Package management utilities  
3. **kapitan-ai** (6.7 KB) — AI command assistant with Qwen3.5-4B model

### 🔐 Security
- GPG-signed Release files
- Cryptographic verification of all packages
- Fingerprint: `11E8DEEE8C014E7EEA1D8953DFF0439169E3553F`

## Installation

### Via apt Repository
```bash
curl -fsSL https://umutkorkmaz.github.io/kapitan-apt/kapitan-archive-keyring.asc | sudo apt-key add -
echo "deb https://umutkorkmaz.github.io/kapitan-apt alpha main" | sudo tee /etc/apt/sources.list.d/kapitan.list
sudo apt update
sudo apt install kapitan-sh kapitan-pazar kapitan-ai
```

### Direct Download
Download ISO or .deb packages from the [GitHub Release](https://github.com/UmutKorkmaz/kapitan-os/releases/tag/v0.1.0-alpha).

## Edition Information

| Edition | Size | Target | Features |
|---------|------|--------|----------|
| **Geliştirici** | ~780 MB | Developers | 218 Turkish commands, AI assistant, dev tools |
| **Bar** | ~650 MB | Server | Minimal, lightweight, headless |
| **Ofis** | ~700 MB | Office | Office suite, multimedia, desktop |

## Known Limitations

- Alpha release (not production-ready)
- Limited ecosystem (many packages not yet Turkish-localized)
- AI model requires 4-8 GB RAM
- UEFI Secure Boot not yet supported

## Roadmap

### v0.1.0-beta (Q3 2026)
- [ ] Secure Boot support
- [ ] Additional Turkish language packs
- [ ] Extended package ecosystem
- [ ] Performance optimizations

### v0.2.0 (Q4 2026)
- [ ] Desktop environment enhancements
- [ ] Mobile device support
- [ ] Cloud deployment templates

## Bug Reports

Report issues on GitHub: https://github.com/UmutKorkmaz/kapitan-os/issues

## Credits

Built by Umut Korkmaz with support from the open-source community.

---

**Download now:** https://github.com/UmutKorkmaz/kapitan-os/releases/tag/v0.1.0-alpha
