# GitHub Release Environment Setup Guide

## Overview

The `github-release-env-setup.sh` script automates the configuration of GitHub release infrastructure for KAPiTaN OS after completing Section 1 of the founder setup process.

## Prerequisites

1. **Section 1 Complete**: You must have completed FOUNDER-SETUP.md Section 1:
   - Generated offline primary key (Curve521)
   - Created CI signing subkey (EdDSA, 1-year expiry)
   - Exported public key to `kapitan-archive-keyring.asc`
   - Securely backed up to offline storage
   - Have your **40-hex primary key fingerprint** saved

2. **GitHub CLI (gh)** installed and authenticated:
   ```bash
   gh auth login
   gh auth status  # Verify authentication
   ```

3. **Git** installed locally

4. **jq** (optional, for enhanced JSON validation)

## What This Script Does

### 1. **Validates Section 1 Completion**
   - Prompts you to confirm Section 1 is complete
   - Asks for your primary key fingerprint (40-hex)
   - Validates fingerprint format

### 2. **Creates Release Environment in KAPiTaN-OS**
   - Creates `release` environment via GitHub API
   - Adds deployment branch policy pattern: `v*` (matches `v0.1.0`, `v0.2.0-rc1`, etc.)
   - Environment URL: `https://github.com/UmutKorkmaz/kapitan-os/settings/environments/release`

### 3. **Collects Secrets from Founder**
   - **KAPITAN_SIGNING_KEY** — Your CI signing subkey (from Section 1, step 1.6)
   - **KAPITAN_GPG_PASSPHRASE** — Your primary key passphrase
   - **APT_DISPATCH_TOKEN** — GitHub Personal Access Token (create at https://github.com/settings/tokens/new)

### 4. **Sets Secrets in Both Repos**
   - Stores all 3 secrets in KAPiTaN-OS repository
   - Creates `kapitan-apt` repository (if not exists)
   - Stores all 3 secrets in kapitan-apt repository

### 5. **Copies apt-repo Scaffold**
   - Clones newly created `kapitan-apt` repo
   - Copies scaffold files:
     - `conf/` — reprepro configuration
     - `.github/workflows/` — publish workflow
     - `incoming/` — incoming packages directory
     - `kapitan-archive-keyring.asc` — public key
     - `README.md` — repository documentation
   - Commits and pushes to origin

### 6. **Creates Release Environment in kapitan-apt**
   - Creates `release` environment in the new repo
   - Adds deployment branch policy pattern: `v*`

### 7. **Validates Setup**
   - Verifies both release environments exist
   - Checks all secrets are set in both repos
   - Provides summary with URLs and next steps

## Usage

### Basic Execution

```bash
cd /path/to/KAPiTaN-OS
./scripts/github-release-env-setup.sh
```

### Step-by-Step Walkthrough

#### 1. Prerequisites Check
The script verifies:
- GitHub CLI installed
- GitHub authentication active
- Git available

```
[INFO] Checking Prerequisites
[✓] GitHub CLI installed
[✓] GitHub authenticated
[✓] Git installed
[✓] jq installed
```

#### 2. Section 1 Validation
You'll be asked to confirm:
```
Has Section 1 been completed? [y/N]: y
```

Then provide your primary key fingerprint:
```
Enter your PRIMARY key fingerprint (40-hex): AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
```

#### 3. Secret Collection
The script will prompt for three secrets:

**Secret 1: KAPITAN_SIGNING_KEY**
```
Secret 1: KAPITAN_SIGNING_KEY
[INFO] This is your CI signing subkey (from FOUNDER-SETUP.md, step 1.6)
[INFO] File: ~/kapitan-ci-subkey.asc (or from offline backup)
Use ~/kapitan-ci-subkey.asc? [y/N]: y
```

**Secret 2: KAPITAN_GPG_PASSPHRASE**
```
Secret 2: KAPITAN_GPG_PASSPHRASE
[INFO] This is the passphrase from Section 1, step 1.1
Enter KAPITAN_GPG_PASSPHRASE: ••••••••••••••••••••••••••••••••
```

**Secret 3: APT_DISPATCH_TOKEN**
```
Secret 3: APT_DISPATCH_TOKEN
[INFO] This is your GitHub Personal Access Token (PAT)
[INFO] Create at: https://github.com/settings/tokens/new
Enter APT_DISPATCH_TOKEN: ghp_••••••••••••••••••••••••••••••••••
```

#### 4. Automatic Setup
The script will then:
- Create environments in both repos
- Set secrets in both repos
- Create and populate `kapitan-apt` repository
- Validate all components

#### 5. Summary & Validation
```
[INFO] Validating setup...

[INFO] KAPiTaN-OS Release Environment:
[✓] Release environment exists
  URL: https://github.com/UmutKorkmaz/kapitan-os/settings/environments/release

[INFO] KAPiTaN-OS Secrets:
[✓] KAPITAN_SIGNING_KEY is set
[✓] KAPITAN_GPG_PASSPHRASE is set
[✓] APT_DISPATCH_TOKEN is set

[INFO] kapitan-apt Repository:
[✓] Repository exists
  URL: https://github.com/UmutKorkmaz/kapitan-apt
[WARN] Repository is still private (change in settings if needed)

[INFO] kapitan-apt Release Environment:
[✓] Release environment exists
  URL: https://github.com/UmutKorkmaz/kapitan-apt/settings/environments/release

[INFO] kapitan-apt Secrets:
[✓] KAPITAN_SIGNING_KEY is set
[✓] KAPITAN_GPG_PASSPHRASE is set
[✓] APT_DISPATCH_TOKEN is set

[✓] Setup completed successfully!
```

## Post-Setup Configuration

After the script completes, perform these manual steps:

### 1. Enable GitHub Pages for kapitan-apt
Visit: https://github.com/UmutKorkmaz/kapitan-apt/settings/pages

- **Source:** Deploy from a branch
- **Branch:** `main` or `root`
- Custom domain: (leave blank — will use `umutkorkmaz.github.io/kapitan-apt/`)

This makes your APT packages publicly accessible at:
```
https://umutkorkmaz.github.io/kapitan-apt/
```

### 2. Change kapitan-apt Visibility to Public
Visit: https://github.com/UmutKorkmaz/kapitan-apt/settings

Under **Danger zone**, change:
- **Repository visibility** → **Public**

This allows users to fetch packages and verify signatures.

### 3. Verify Release Workflows
Visit: https://github.com/UmutKorkmaz/kapitan-os/actions

Ensure workflow files exist and are ready for package publishing.

## Idempotency

The script is fully idempotent:

- **Release environments**: If they already exist, the script skips creation
- **Repositories**: If `kapitan-apt` exists, the script reuses it
- **Secrets**: Updated (not duplicated) if already set
- **Files**: Scaffold files overwrite existing ones

This means you can safely re-run the script if:
- A step fails midway
- You need to update secrets
- You want to verify the setup is complete

## Troubleshooting

### `GitHub CLI (gh) not found`
Install GitHub CLI:
```bash
# macOS (Homebrew)
brew install gh

# Ubuntu/Debian
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update && sudo apt install gh
```

### `Not authenticated with GitHub`
Authenticate:
```bash
gh auth login
gh auth status  # Verify
```

### `Invalid fingerprint format`
The fingerprint must be exactly 40 hexadecimal characters (0-9, a-f):
```bash
# Valid:
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
aabbccdd1234567890aabbccdd1234567890aabb

# Invalid:
AAAAAAAAAAAAAAAAAAAAA  # Too short
gghhiijj...           # Invalid characters (g, h, i, j)
```

### `Repository already exists`
If `kapitan-apt` already exists:
- The script will reuse it (idempotent)
- Scaffold files will be updated
- Secrets will be refreshed

To verify, check:
```bash
gh repo view UmutKorkmaz/kapitan-apt
```

### `Secret setting fails`
If a secret fails to set:
```bash
# Check existing secrets
gh secret list --repo UmutKorkmaz/kapitan-os
gh secret list --repo UmutKorkmaz/kapitan-apt

# Manually set a secret
gh secret set SECRET_NAME --repo UmutKorkmaz/kapitan-os --body "secret_value"
```

### `Scaffold copy fails`
If the apt-repo scaffold doesn't copy:
1. Verify `apt-repo/` exists in the project root:
   ```bash
   ls -la apt-repo/
   ```
2. Check git permissions in `kapitan-apt`
3. Re-run the script (it will retry)

## Security Considerations

### Secret Management

1. **KAPITAN_SIGNING_KEY** (Secret)
   - Contains your private CI subkey
   - Rotates automatically in 1 year
   - GitHub Actions uses it to sign packages

2. **KAPITAN_GPG_PASSPHRASE** (Secret)
   - Protects your offline primary key
   - Never leaves GitHub Actions
   - Use a strong passphrase (32+ characters, mixed case, numbers, symbols)

3. **APT_DISPATCH_TOKEN** (Secret)
   - Personal Access Token (90-day expiration)
   - Only needs `repo` and `workflow` scopes
   - Rotate every 3 months:
     ```bash
     # Create new token at: https://github.com/settings/tokens/new
     gh secret set APT_DISPATCH_TOKEN --repo UmutKorkmaz/kapitan-os --body "new_token"
     ```

### Best Practices

- ✅ **Do**: Store passwords offline for critical secrets
- ✅ **Do**: Rotate tokens every 90 days
- ✅ **Do**: Use environment-specific secrets
- ❌ **Don't**: Share secrets with contributors
- ❌ **Don't**: Log or print secrets (script redacts them)
- ❌ **Don't**: Version control secret files

## Related Documentation

- **FOUNDER-SETUP.md** — Complete GPG key setup process (prerequisite)
- **CONTRIBUTING.md** — Publishing releases after setup
- **apt-repo/README.md** — APT repository structure and publishing
- **GitHub Environments** — https://docs.github.com/en/actions/deployment/targeting-different-environments

## Support

If you encounter issues:

1. **Verify prerequisites**: `gh auth status`, `git --version`
2. **Check GitHub permissions**: Ensure you have admin access to both repos
3. **Review logs**: The script outputs detailed status messages
4. **Re-run safely**: The script is idempotent — re-run to verify or fix issues
5. **Manual steps**: Any step can be redone manually via GitHub web UI or `gh` CLI

For detailed help:
```bash
gh api --help          # GitHub API help
gh secret --help       # Secret management help
gh repo --help         # Repository management help
```
