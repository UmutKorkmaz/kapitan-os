# KAPiTaN OS — apt Repository Installation

The KAPiTaN OS v0.1.0-alpha release includes Debian packages available via an apt repository.

## Quick Start

### 1. Add the Repository Key

```bash
curl -fsSL https://umutkorkmaz.github.io/kapitan-apt/kapitan-archive-keyring.asc | sudo apt-key add -
```

### 2. Add the Repository

```bash
echo "deb https://umutkorkmaz.github.io/kapitan-apt alpha main" | sudo tee /etc/apt/sources.list.d/kapitan.list
```

### 3. Update and Install

```bash
sudo apt update
sudo apt install kapitan-sh kapitan-pazar kapitan-ai
```

## Available Packages

| Package | Description | Size |
|---------|-------------|------|
| **kapitan-sh** | Core shell command layer | 9.8 KB |
| **kapitan-pazar** | Package management utilities | 4.7 KB |
| **kapitan-ai** | AI-powered command assistant (Qwen3.5-4B) | 6.7 KB |

## Verification

All packages are signed with the KAPiTaN OS Release Signing Key. The repository's Release file is cryptographically signed and can be verified:

```bash
apt-key list | grep -i kapitan
```

## Manual Installation

If you prefer not to use the apt repository, packages can be downloaded directly:

```bash
# Download from GitHub Release
curl -L -o kapitan-sh_0.1.0~alpha1_all.deb \
  https://github.com/UmutKorkmaz/kapitan-os/releases/download/v0.1.0-alpha/kapitan-sh_0.1.0.alpha1_all.deb

# Install manually
sudo dpkg -i kapitan-sh_0.1.0~alpha1_all.deb
```

## Troubleshooting

### "Repository is not signed" error

Ensure the key is properly imported:
```bash
curl -fsSL https://umutkorkmaz.github.io/kapitan-apt/kapitan-archive-keyring.asc | gpg --show-keys
```

### No packages found

Make sure the repository line is correct:
```bash
grep kapitan /etc/apt/sources.list.d/kapitan.list
```

## Channel Information

- **Channel**: `alpha` (development/preview releases)
- **Architecture**: `amd64` (Intel/AMD 64-bit)
- **Components**: `main`
- **Signing Key**: `11E8DEEE8C014E7EEA1D8953DFF0439169E3553F`

## Release Notes

See https://github.com/UmutKorkmaz/kapitan-os/releases/tag/v0.1.0-alpha for detailed release information.
