#!/usr/bin/env bash
# Install kapitan-sh and distro overlay into a live-build chroot.
# Primary path: sync-image-assets.sh + 0100-kapitan.hook.chroot during lb build.
# This script remains for manual chroot post-install / debugging.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

CHROOT="${1:-}"
KAPITAN_VERSION="v0.1.0-alpha"

KAPITAN_PKG="${REPO_ROOT}/packages/kapitan-sh"
OVERLAY_SRC="${REPO_ROOT}/distro/overlay"
COMMANDS_SRC="${REPO_ROOT}/packages/commands/commands.json"

log() {
  printf '[install-kapitan-sh] %s\n' "$*"
}

usage() {
  cat <<EOF
Usage: bash build/scripts/install-kapitan-sh.sh <chroot-path>

Example:
  bash build/scripts/install-kapitan-sh.sh build/live-build/chroot
EOF
}

die() {
  printf '[install-kapitan-sh] ERROR: %s\n' "$*" >&2
  exit 1
}

if [[ -z "${CHROOT}" ]]; then
  die "chroot path required"
  usage
  exit 1
fi

if [[ ! -d "${CHROOT}" ]]; then
  die "chroot directory not found: ${CHROOT}"
fi

# Step 1: kapitan-sh package tree + wrapper
if [[ -f "${KAPITAN_PKG}/kapitan-sh" ]]; then
  mkdir -p "${CHROOT}/usr/share/kapitan/kapitan-sh/lib" "${CHROOT}/usr/local/bin"
  install -m 0755 "${KAPITAN_PKG}/kapitan-sh" "${CHROOT}/usr/share/kapitan/kapitan-sh/kapitan-sh"
  cp -a "${KAPITAN_PKG}/lib/." "${CHROOT}/usr/share/kapitan/kapitan-sh/lib/"
  cat > "${CHROOT}/usr/local/bin/kapitan-sh" <<'EOF'
#!/usr/bin/env bash
export KAPITAN_COMMANDS_JSON="${KAPITAN_COMMANDS_JSON:-/usr/share/kapitan/commands.json}"
exec /usr/share/kapitan/kapitan-sh/kapitan-sh "$@"
EOF
  chmod 0755 "${CHROOT}/usr/local/bin/kapitan-sh"
  log "Installed kapitan-sh → ${CHROOT}/usr/share/kapitan/kapitan-sh/"
else
  log "${KAPITAN_PKG}/kapitan-sh not found — kapitan-sh install skipped"
fi

# Step 2: commands.json SSOT
if [[ -f "${COMMANDS_SRC}" ]]; then
  mkdir -p "${CHROOT}/usr/share/kapitan"
  cp "${COMMANDS_SRC}" "${CHROOT}/usr/share/kapitan/commands.json"
  log "Installed commands.json → ${CHROOT}/usr/share/kapitan/commands.json"
fi

# Step 3: distro overlay
if [[ -d "${OVERLAY_SRC}" ]]; then
  cp -a "${OVERLAY_SRC}/." "${CHROOT}/"
  log "Copied overlay → ${CHROOT}/"
else
  log "${OVERLAY_SRC} not found — overlay copy skipped"
fi

# Step 3: Generate tr_TR.UTF-8 locale inside chroot
if [[ -x "${CHROOT}/usr/sbin/locale-gen" ]] || [[ -x "${CHROOT}/usr/bin/locale-gen" ]]; then
  if ! grep -q '^tr_TR.UTF-8 UTF-8' "${CHROOT}/etc/locale.gen" 2>/dev/null; then
    echo 'tr_TR.UTF-8 UTF-8' >> "${CHROOT}/etc/locale.gen"
  fi
  chroot "${CHROOT}" locale-gen tr_TR.UTF-8
  chroot "${CHROOT}" update-locale LANG=tr_TR.UTF-8 LC_ALL=tr_TR.UTF-8 2>/dev/null || true
  log "Generated tr_TR.UTF-8 locale inside chroot"
else
  log "locale-gen not available in chroot (locales package missing?)"
fi

# Step 3b: Register kapitan-sh in /etc/shells
if [[ -x "${CHROOT}/usr/local/bin/kapitan-sh" ]]; then
  if ! grep -q '^/usr/local/bin/kapitan-sh$' "${CHROOT}/etc/shells" 2>/dev/null; then
    echo '/usr/local/bin/kapitan-sh' >> "${CHROOT}/etc/shells"
  fi
  log "Registered kapitan-sh in ${CHROOT}/etc/shells"
fi

# Step 4: Write /etc/kapitan/VERSION
mkdir -p "${CHROOT}/etc/kapitan"
printf '%s\n' "${KAPITAN_VERSION}" > "${CHROOT}/etc/kapitan/VERSION"
log "Wrote ${CHROOT}/etc/kapitan/VERSION (${KAPITAN_VERSION})"