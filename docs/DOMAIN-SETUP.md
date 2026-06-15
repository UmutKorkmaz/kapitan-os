# Domain & DNS Setup Guide

## Recommended Domains

- **kapitan-os.org** — Primary domain (currently available)
- **kapitan.dev** — Developer-focused short domain
- **apt.kapitan-os.org** — Subdomain for apt repository

## Step 1: Purchase Domain

1. Register at domain registrar (Namecheap, Cloudflare, etc.)
2. Point nameservers to GitHub's servers or Cloudflare

## Step 2: Configure GitHub Pages Custom Domain

### Option A: GitHub Nameservers
```bash
# In repo settings:
# Settings → Pages → Custom Domain
# Enter: kapitan-os.org

# In domain registrar, point nameservers to:
# dns1.github.io
# dns2.github.io
```

### Option B: Cloudflare (Recommended)
1. Add domain to Cloudflare
2. Update nameservers in domain registrar
3. In Cloudflare DNS, create:
   - `kapitan-os.org` → GitHub Pages IP
   - `apt.kapitan-os.org` → CNAME → `umutkorkmaz.github.io`

## Step 3: Update GitHub Pages Settings
```yaml
# Repository Settings → Pages
- Source: GitHub Actions
- Custom domain: kapitan-os.org
- Enforce HTTPS: ✅ Enabled
```

## Step 4: Update Documentation URLs
Replace all instances of `umutkorkmaz.github.io/kapitan-os` with `kapitan-os.org`

## Expected Timeline
- Domain registration: 10 minutes
- DNS propagation: 24-48 hours
- HTTPS certificate: Automatic

## Cost Estimate
- .org domain: $8-15/year
- Cloudflare: Free (or Pro $20/month for advanced features)
