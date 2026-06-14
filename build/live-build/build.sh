#!/usr/bin/env bash
# KAPiTaN OS — live-build wrapper
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
ARTIFACTS_DIR="${REPO_ROOT}/build/artifacts"
VERSION="0.1.0-alpha"

DRY_RUN=0

usage() {
  cat <<'EOF'
KAPiTaN OS live-build wrapper

Usage:
  bash build/live-build/build.sh [OPTIONS]

Options:
  --edition <name>   Edition to build: bar, ofis, or gelistirici (default: bar)
  --dry-run          Validate prerequisites and sync steps only; skip lb build
  -h, --help         Show this help

Environment:
  KAPITAN_EDITION    Edition name (overridden by --edition flag)
  KAPITAN_MIRROR     Debian mirror (passed to auto/config)

Output:
  build/artifacts/kapitan-<edition>-v0.1.0-alpha-amd64.iso

Prerequisites:
  Debian/Ubuntu amd64 host, live-build, jq, sudo, ~15 GB disk
  See build/README.md
EOF
}

log() {
  printf '[kapitan-build] %s\n' "$*"
}

die() {
  printf '[kapitan-build] ERROR: %s\n' "$*" >&2
  exit 1
}

require_command() {
  local cmd="$1"
  local hint="$2"
  if ! command -v "${cmd}" >/dev/null 2>&1; then
    die "${cmd} not found. ${hint}"
  fi
}

lb_sudo() {
  if [[ "${EUID}" -eq 0 ]]; then
    "$@"
  elif command -v sudo >/dev/null 2>&1; then
    sudo -E "$@"
  else
    die "lb requires root privileges (install sudo or run as root)"
  fi
}

parse_args() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --edition)
        [[ $# -ge 2 ]] || die "--edition requires an argument"
        export KAPITAN_EDITION="$2"
        shift 2
        ;;
      --dry-run)
        DRY_RUN=1
        shift
        ;;
      -h|--help)
        usage
        exit 0
        ;;
      *)
        die "Unknown option: $1 (try --help)"
        ;;
    esac
  done
}

validate_commands() {
  require_command npm "Install Node.js/npm"
  log "Running npm run validate:commands"
  (cd "${REPO_ROOT}" && npm run validate:commands)
}

verify_layout() {
  local base="${SCRIPT_DIR}/config"
  local includes="${base}/includes.chroot"
  local edition="${KAPITAN_EDITION:-bar}"
  local base_list="${base}/package-lists/kapitan-base.list.chroot"
  local edition_list="${base}/package-lists/${edition}.list.chroot"
  local hook="${base}/hooks/normal/0100-kapitan.hook.chroot"

  [[ -f "${base_list}" ]] || die "Missing ${base_list} — run sync-image-assets"
  [[ -f "${edition_list}" ]] || die "Missing ${edition_list} — run sync-image-assets or check edition name"
  [[ -x "${hook}" || -f "${hook}" ]] || die "Missing chroot hook ${hook}"
  [[ -f "${includes}/usr/share/kapitan/commands.json" ]] || die "Missing synced commands.json"
  [[ -x "${includes}/usr/local/bin/kapitan-sh" ]] || die "Missing kapitan-sh wrapper in includes.chroot"
  jq -e '.path_guard | length > 0' "${includes}/usr/share/kapitan/commands.json" >/dev/null \
    || die "ISO commands.json missing path_guard"
}

main() {
  parse_args "$@"

  # Resolve edition (export so auto/config inherits it)
  export KAPITAN_EDITION="${KAPITAN_EDITION:-bar}"
  local ISO_NAME="kapitan-${KAPITAN_EDITION}-v${VERSION}-amd64.iso"
  local ISO_SRC="live-image-amd64.hybrid.iso"

  require_command lb "Install live-build: sudo apt install live-build"
  require_command bash "bash is required"
  require_command jq "Install jq: sudo apt install jq"

  log "Repo root:  ${REPO_ROOT}"
  log "Edition:    ${KAPITAN_EDITION}"
  log "ISO name:   ${ISO_NAME}"

  validate_commands
  bash "${REPO_ROOT}/build/scripts/sync-image-assets.sh"

  local hook="${SCRIPT_DIR}/config/hooks/normal/0100-kapitan.hook.chroot"
  if [[ -f "${hook}" ]]; then
    chmod +x "${hook}"
    log "Chroot hook ready: ${hook}"
  fi

  verify_layout
  mkdir -p "${ARTIFACTS_DIR}"

  if [[ "${DRY_RUN}" -eq 1 ]]; then
    log "Dry-run: prerequisites OK"
    log "Would run in ${SCRIPT_DIR}: sudo lb clean && sudo lb config && sudo lb build"
    log "Would copy ${ISO_SRC} → ${ARTIFACTS_DIR}/${ISO_NAME}"
    exit 0
  fi

  cd "${SCRIPT_DIR}"

  log "Running lb clean (sudo)"
  lb_sudo lb clean

  log "Running lb config (sudo)"
  lb_sudo lb config

  log "Running lb build (sudo; may take 30–90 min)"
  lb_sudo lb build

  if [[ ! -f "${ISO_SRC}" ]]; then
    die "Expected ISO not found after lb build: ${SCRIPT_DIR}/${ISO_SRC}"
  fi

  cp "${ISO_SRC}" "${ARTIFACTS_DIR}/${ISO_NAME}"
  sha256sum "${ARTIFACTS_DIR}/${ISO_NAME}" > "${ARTIFACTS_DIR}/${ISO_NAME}.sha256"

  if [[ -n "${SUDO_USER:-}" ]]; then
    chown -R "${SUDO_USER}:${SUDO_USER}" "${ARTIFACTS_DIR}"
  fi

  log "ISO written to: ${ARTIFACTS_DIR}/${ISO_NAME}"
  log "SHA256: ${ARTIFACTS_DIR}/${ISO_NAME}.sha256"
}

main "$@"
