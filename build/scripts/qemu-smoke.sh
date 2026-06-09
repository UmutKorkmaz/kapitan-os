#!/usr/bin/env bash
# KAPiTaN OS — QEMU smoke test harness (F1)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
ISO="${REPO_ROOT}/build/artifacts/kapitan-v0.1.0-alpha-amd64.iso"
LOG_DIR="${REPO_ROOT}/build/artifacts"
REPORT="${LOG_DIR}/SMOKE-v0.1.0-alpha.md"
LOG_FILE="${LOG_DIR}/qemu-smoke.log"
TIMEOUT_SEC="${KAPITAN_SMOKE_TIMEOUT:-120}"
INTERACTIVE=0
DRY_RUN=0

usage() {
  cat <<'EOF'
KAPiTaN OS QEMU smoke test

Usage:
  bash build/scripts/qemu-smoke.sh [OPTIONS]

Options:
  --dry-run       Verify ISO exists and print QEMU command
  --interactive   Show QEMU window for manual login/testing
  -h, --help      Show help

Environment:
  KAPITAN_SMOKE_TIMEOUT   Seconds before QEMU is killed (default: 120)

Requires:
  qemu-system-x86_64, ISO at build/artifacts/kapitan-v0.1.0-alpha-amd64.iso
EOF
}

log() { printf '[qemu-smoke] %s\n' "$*"; }
die() { printf '[qemu-smoke] ERROR: %s\n' "$*" >&2; exit 1; }

parse_args() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --dry-run) DRY_RUN=1; shift ;;
      --interactive) INTERACTIVE=1; shift ;;
      -h|--help) usage; exit 0 ;;
      *) die "Unknown option: $1" ;;
    esac
  done
}

write_report() {
  local qemu_status="${1:-PENDING}"
  local boot_status="${2:-PENDING}"
  mkdir -p "${LOG_DIR}"
  cat > "${REPORT}" <<EOF
# KAPiTaN OS Smoke Test — v0.1.0-alpha

| Field | Value |
|-------|-------|
| Date | $(date -u +%Y-%m-%dT%H:%MZ) |
| ISO | \`${ISO}\` |
| Host | $(uname -srm 2>/dev/null || echo unknown) |
| Mode | $([[ "${INTERACTIVE}" -eq 1 ]] && echo interactive || echo headless) |

## Automated (QEMU boot)

| Check | Status |
|-------|--------|
| ISO file exists | PASS |
| QEMU launched | ${qemu_status} |
| Kernel/init reached | ${boot_status} |

## Manual (in live session)

| # | Check | Command | Expected | Status |
|---|-------|---------|----------|--------|
| 1 | Locale | \`locale\` | LANG=tr_TR.UTF-8 | PENDING |
| 2 | Shell | \`kapitan-sh -c listele\` | file listing | PENDING |
| 3 | cd alias | \`kapitan-sh -c 'gir /tmp && pwd'\` | /tmp | PENDING |
| 4 | sistem | \`kapitan-sh -c sistem\` | uname output | PENDING |
| 5 | git guard | \`kapitan-sh -c 'git --version'\` | real git | PENDING |
| 6 | VERSION | \`cat /etc/kapitan/VERSION\` | v0.1.0-alpha | PENDING |
| 7 | SSOT | \`jq '.commands|length' /usr/share/kapitan/commands.json\` | 66 | PENDING |

## Notes

Complete manual rows after boot. For interactive testing:
\`npm run qemu:smoke -- --interactive\`
EOF
  log "Report: ${REPORT}"
}

detect_boot() {
  local log_path="$1"
  if [[ ! -f "${log_path}" ]]; then
    return 1
  fi
  grep -qiE 'Linux version|Debian GNU/Linux|live-config|systemd\[1\]:|Welcome to' "${log_path}"
}

main() {
  parse_args "$@"

  if [[ ! -f "${ISO}" ]]; then
    die "ISO not found: ${ISO}. Run: npm run build:iso (on Debian amd64)"
  fi

  local qemu_cmd=(
    qemu-system-x86_64
    -machine pc
    -m 4096
    -smp 2
    -cdrom "${ISO}"
    -boot d
    -no-reboot
  )

  if [[ "${INTERACTIVE}" -eq 1 ]]; then
    qemu_cmd+=(-display default)
  else
    qemu_cmd+=(-display none -serial mon:stdio)
  fi

  log "ISO: ${ISO} ($(du -h "${ISO}" | awk '{print $1}'))"

  if [[ "${DRY_RUN}" -eq 1 ]]; then
    log "Dry-run — would execute: ${qemu_cmd[*]}"
    log "Timeout: ${TIMEOUT_SEC}s"
    exit 0
  fi

  if ! command -v qemu-system-x86_64 >/dev/null 2>&1; then
    die "qemu-system-x86_64 not found. Install qemu-system-x86 (Debian/Ubuntu)."
  fi

  : > "${LOG_FILE}"
  log "Booting ISO (${TIMEOUT_SEC}s timeout)…"

  local timeout_cmd=""
  if command -v timeout >/dev/null 2>&1; then
    timeout_cmd="timeout"
  elif command -v gtimeout >/dev/null 2>&1; then
    timeout_cmd="gtimeout"
  elif [[ "${INTERACTIVE}" -eq 1 ]]; then
    log "No timeout binary — running interactive QEMU until you close it"
  else
    die "Neither timeout nor gtimeout found (macOS: brew install coreutils)"
  fi

  local rc=0
  set +e
  if [[ "${INTERACTIVE}" -eq 1 && -z "${timeout_cmd}" ]]; then
    "${qemu_cmd[@]}" 2>&1 | tee "${LOG_FILE}"
    rc=$?
  elif [[ -n "${timeout_cmd}" ]]; then
    "${timeout_cmd}" "${TIMEOUT_SEC}" "${qemu_cmd[@]}" 2>&1 | tee "${LOG_FILE}"
    rc=$?
  fi
  set -e

  local qemu_status="PASS"
  local boot_status="FAIL"
  if [[ "${rc}" -ne 0 && "${rc}" -ne 124 ]]; then
    qemu_status="FAIL"
    die "QEMU exited with code ${rc} — see ${LOG_FILE}"
  fi

  if detect_boot "${LOG_FILE}"; then
    boot_status="PASS"
    log "Boot indicators found in serial log"
  elif [[ "${rc}" -eq 124 ]]; then
    log "Timeout reached without clear boot markers — check ${LOG_FILE} manually"
  fi

  write_report "${qemu_status}" "${boot_status}"

  if [[ "${boot_status}" != "PASS" && "${INTERACTIVE}" -eq 0 ]]; then
    die "Smoke boot check failed — no kernel/init markers in ${LOG_FILE}"
  fi

  log "Smoke harness complete. Finish manual checklist in: ${REPORT}"
}

main "$@"