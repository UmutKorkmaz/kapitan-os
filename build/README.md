# KAPiTaN OS — Build

Image build orchestration for KAPiTaN OS. **F1 (ISO iskelet)** wires the live-build skeleton to produce a minimal bootable Debian 12 amd64 ISO with kapitan-sh and `tr_TR.UTF-8`.

## Pipeline overview

```
commands.json → kapitan-sh → distro/ overlay → build/live-build/ → build/artifacts/*.iso
```

| Path | Purpose |
|------|---------|
| `live-build/` | `lb` configuration, package lists, build wrapper |
| `scripts/` | Helper scripts (sync commands, install kapitan-sh into chroot) |
| `artifacts/` | ISO output directory (contents gitignored except `.gitkeep`) |

## Prerequisites

Build host requirements (see BUILD PLAN §3.5.2):

- **OS:** Debian 12 or Ubuntu 22.04+ (amd64). macOS and Windows are **not** supported for building — use a Debian VM, GitHub Actions, or remote Linux box.
- **Packages:** `live-build`, `debootstrap`, `squashfs-tools`, `xorriso`, `isolinux`, `syslinux`, `jq`, `nodejs`, `npm`
- **Privileges:** `sudo` (or root) for `lb build`
- **Disk:** ~15 GB free for chroot and binary stages
- **Network:** Access to Debian mirrors during bootstrap

### OVMF firmware (for UEFI boot testing)

```bash
# Debian/Ubuntu:
sudo apt-get install ovmf
# Fedora:
sudo dnf install edk2-ovmf
```

The smoke test auto-detects OVMF paths. Set the `OVMF_CODE` env var if installed to a non-standard location.

> **Secure Boot:** OUT OF SCOPE for v0.1.0-alpha. The dual-boot smoke test runs with SB disabled in firmware (the default for QEMU/OVMF). SB enforcement (shim-signed, UEFI Secure Boot keys) is Phase 2 work.


### Install live-build (Debian/Ubuntu)

```bash
sudo apt update
sudo apt install -y live-build debootstrap squashfs-tools xorriso \
  isolinux syslinux-common grub-pc-bin jq nodejs npm bats \
  qemu-system-x86
```

### Optional: tmpfs cache (faster builds)

```bash
sudo mount -t tmpfs -o size=16G tmpfs /var/cache/live-build
```

## Quick start

From the monorepo root:

```bash
npm run validate:commands
npm run sync:iso-assets
npm run dry-run:iso      # prerequisites only
npm run build:iso        # full ISO (Debian amd64 + sudo)
```

Or via Makefile from repo root: `make sync-iso-assets`, `make dry-run-iso`, `make build-iso`.

## Output

Successful builds copy the hybrid ISO to:

```
build/artifacts/kapitan-v0.1.0-alpha-amd64.iso
```

## Smoke test

```bash
npm run qemu:smoke
npm run qemu:smoke -- --dry-run        # verify ISO exists, print QEMU cmd
npm run qemu:smoke -- --interactive    # graphical QEMU for hands-on testing
```

Writes `build/artifacts/SMOKE-v0.1.0-alpha.md` and boots the ISO headlessly (120s default). Use `--interactive` to log in and run the manual checklist.

## Run and test the OS (after ISO is built)

### Option A — Debian/Ubuntu build host (recommended)

```bash
cd "/path/to/KAPiTaN OS"
npm ci
npm run validate:commands
npm run test:shell
npm run sync:iso-assets
npm run dry-run:iso
sudo -E bash build/live-build/build.sh

# Headless boot smoke (serial log)
KAPITAN_SMOKE_TIMEOUT=120 npm run qemu:smoke

# Interactive desktop test
npm run qemu:smoke -- --interactive
```

Inside the live session, run the checklist in `build/artifacts/SMOKE-v0.1.0-alpha.md`:

```bash
locale
kapitan-sh -c listele
kapitan-sh -c 'gir /tmp && pwd'
kapitan-sh -c sistem
kapitan-sh -c 'git --version'
cat /etc/kapitan/VERSION
jq '.commands|length' /usr/share/kapitan/commands.json
```

### Option B — GitHub Actions (no local Linux)

1. Push this repo to GitHub
2. Actions → **live-build-smoke** → **Run workflow** (manual dispatch)
3. Download artifact `kapitan-v0.1.0-alpha-amd64.iso`
4. Test with UTM/QEMU on your Mac:

```bash
# Copy ISO from Downloads, then:
qemu-system-x86_64 -machine pc -m 4096 -cdrom ~/Downloads/kapitan-v0.1.0-alpha-amd64.iso -boot d
```

Or open the ISO in **UTM** → New VM → Emulate → Linux → boot from ISO.

### Option C — macOS with UTM only (test pre-built ISO)

You cannot build the ISO on macOS, but you can test a downloaded ISO in [UTM](https://mac.getutm.app/):

1. Create VM: x86_64, 4 GB RAM, boot ISO
2. Boot and complete the manual checklist above

## Scripts

| Script | Role |
|--------|------|
| `live-build/build.sh` | Main wrapper: validate → sync → `lb clean/config/build` → copy ISO |
| `scripts/sync-image-assets.sh` | Sync commands.json, kapitan-sh tree, overlay → `includes.chroot` |
| `scripts/sync-commands.sh` | Back-compat wrapper → `sync-image-assets.sh` |
| `scripts/install-kapitan-sh.sh` | Manual chroot install / debug (primary path: sync + hook) |
| `scripts/qemu-smoke.sh` | QEMU boot harness + smoke report template |
| `config/hooks/normal/0100-kapitan.hook.chroot` | locale-gen, `/etc/shells`, VERSION in chroot |

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `KAPITAN_MIRROR` | `http://deb.debian.org/debian` | Debian mirror for bootstrap/chroot |

## F1 status (ISO iskelet)

- [x] `auto/config` — Debian 12 amd64 + `locales=tr_TR.UTF-8` boot args
- [x] `kapitan.list.chroot` — locales, bash, git, live-boot
- [x] `sync-image-assets.sh` — commands.json + kapitan-sh tree + overlay → `includes.chroot`
- [x] `0100-kapitan.hook.chroot` — locale-gen, `/etc/shells`, VERSION
- [x] `build.sh` — sync assets + `lb build` wrapper
- [x] `qemu-smoke.sh` — boot harness + `SMOKE-v0.1.0-alpha.md` template
- [x] `.github/workflows/live-build-smoke.yml` — PR dry-run + manual ISO build
- [ ] First successful ISO artifact on Debian amd64 host
- [ ] Manual smoke checklist PASS
- [ ] Docker builder image (optional, Week 4+)

## References

- `docs/KAPiTaN OS BUILD PLAN.md` — §3.1 (file tree), §3.5 (live-build skeleton)
- `distro/` — locale defaults and overlay (consumed at install time)
- `packages/kapitan-sh/` — shell MVP installed into the image