#!/usr/bin/env bash
# KAPiTaN OS — QEMU smoke test harness (dual-boot: BIOS + UEFI)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
ISO="${REPO_ROOT}/build/artifacts/kapitan-v0.1.0-alpha-amd64.iso"
LOG_DIR="${REPO_ROOT}/build/smoke-logs"
VERSION="0.1.0-alpha"
TIMEOUT_SEC="${KAPITAN_SMOKE_TIMEOUT:-120}"
INTERACTIVE=0
DRY_RUN=0
MODE="both"

usage() {
  cat <<'EOF'
KAPiTaN OS QEMU smoke test (BIOS + UEFI dual-boot)

Usage:
  bash build/scripts/qemu-smoke.sh [OPTIONS]

Options:
  --mode bios|uefi|both   Firmware mode to test (default: both)
  --dry-run               Verify ISO exists and print QEMU commands
  --interactive           Show QEMU window for manual login/testing
                          (requires --mode bios or --mode uefi, not both)
  -h, --help              Show help

Environment:
  KAPITAN_SMOKE_TIMEOUT   Seconds before QEMU is killed per mode (default: 120)
  OVMF_CODE               Path to OVMF_CODE.fd (auto-detected if unset)
  OVMF_VARS               Path to OVMF_VARS.fd template (auto-detected if unset)

Requires:
  qemu-system-x86_64, ISO at build/artifacts/kapitan-v0.1.0-alpha-amd64.iso
  ovmf package for UEFI mode (Debian/Ubuntu: apt-get install ovmf)
EOF
}

log() { printf '[qemu-smoke] %s\n' "$*"; }
die() { printf '[qemu-smoke] ERROR: %s\n' "$*" >&2; exit 1; }

find_ovmf_code() {
  # Try env var first, then standard Debian paths
  if [[ -n "${OVMF_CODE:-}" ]]; then
    if [[ -f "$OVMF_CODE" ]]; then echo "$OVMF_CODE"; return 0; fi
    echo "qemu-smoke: OVMF_CODE env var set but file not found: $OVMF_CODE" >&2
    return 1
  fi
  # Debian/Ubuntu paths
  for path in /usr/share/OVMF/OVMF_CODE.fd /usr/share/edk2-ovmf/OVMF_CODE.fd; do
    if [[ -f "$path" ]]; then echo "$path"; return 0; fi
  done
  echo "qemu-smoke: OVMF not found. Install 'ovmf' package (Debian/Ubuntu) or 'edk2-ovmf' (Fedora)" >&2
  return 1
}

find_ovmf_vars() {
  # Read-only template for QEMU
  if [[ -n "${OVMF_VARS:-}" ]]; then
    if [[ -f "$OVMF_VARS" ]]; then echo "$OVMF_VARS"; return 0; fi
  fi
  for path in /usr/share/OVMF/OVMF_VARS.fd /usr/share/edk2-ovmf/OVMF_VARS.fd; do
    if [[ -f "$path" ]]; then echo "$path"; return 0; fi
  done
  echo "qemu-smoke: OVMF_VARS template not found" >&2
  return 1
}

parse_args() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --mode)
        MODE="$2"
        if [[ ! "$MODE" =~ ^(bios|uefi|both)$ ]]; then
          echo "qemu-smoke: --mode must be bios, uefi, or both" >&2
          exit 2
        fi
        shift 2
        ;;
      --interactive) INTERACTIVE=1; shift ;;
      --dry-run) DRY_RUN=1; shift ;;
      -h|--help) usage; exit 0 ;;
      *) die "Unknown option: $1" ;;
    esac
  done

  if [[ "$INTERACTIVE" == 1 && "$MODE" == "both" ]]; then
    echo "qemu-smoke: --interactive mode requires --mode bios or --mode uefi (not both)" >&2
    exit 2
  fi
}

detect_boot() {
  local log_path="$1"
  if [[ ! -f "${log_path}" ]]; then
    return 1
  fi
  grep -qiE 'Linux version|Debian GNU/Linux|live-config|systemd\[1\]:|Welcome to' "${log_path}"
}

run_qemu_mode() {
  local mode="$1"
  local log_file="${LOG_DIR}/qemu-smoke-${mode}.log"

  local qemu_cmd=(
    qemu-system-x86_64
    -m 4096
    -smp 2
    -cdrom "${ISO}"
    -boot d
    -no-reboot
  )

  if [[ "$mode" == "bios" ]]; then
    qemu_cmd+=(-machine pc)
  elif [[ "$mode" == "uefi" ]]; then
    local ovmf_code ovmf_vars ovmf_vars_copy
    ovmf_code="$(find_ovmf_code)" || return 1
    ovmf_vars="$(find_ovmf_vars)" || return 1
    ovmf_vars_copy="${LOG_DIR}/ovmf-vars-${mode}.fd"
    cp "$ovmf_vars" "$ovmf_vars_copy" || return 1

    qemu_cmd+=(
      -machine q35
      -drive if=pflash,format=raw,readonly=on,file="${ovmf_code}"
      -drive if=pflash,format=raw,file="${ovmf_vars_copy}"
    )
  fi

  if [[ "${INTERACTIVE}" -eq 1 ]]; then
    qemu_cmd+=(-display default)
  else
    qemu_cmd+=(-display none -serial mon:stdio)
  fi

  if [[ "${DRY_RUN}" -eq 1 ]]; then
    printf '[DRY RUN %s] %s\n' "$mode" "${qemu_cmd[*]}" >&2
    return 0
  fi

  if ! command -v qemu-system-x86_64 >/dev/null 2>&1; then
    die "qemu-system-x86_64 not found. Install qemu-system-x86 (Debian/Ubuntu)."
  fi

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

  : > "${log_file}"
  log "Booting ISO in ${mode} mode (${TIMEOUT_SEC}s timeout)..."

  local rc=0
  set +e
  if [[ "${INTERACTIVE}" -eq 1 && -z "${timeout_cmd}" ]]; then
    "${qemu_cmd[@]}" 2>&1 | tee "${log_file}"
    rc=$?
  elif [[ -n "${timeout_cmd}" ]]; then
    "${timeout_cmd}" "${TIMEOUT_SEC}" "${qemu_cmd[@]}" 2>&1 | tee "${log_file}"
    rc=$?
  fi
  set -e

  if [[ "${rc}" -ne 0 && "${rc}" -ne 124 ]]; then
    log "QEMU (${mode}) exited with code ${rc} — see ${log_file}"
    return 1
  fi

  if detect_boot "${log_file}"; then
    log "Boot indicators found in ${mode} serial log"
    return 0
  elif [[ "${rc}" -eq 124 ]]; then
    log "Timeout reached without clear boot markers in ${mode} — check ${log_file} manually"
    return 1
  fi

  return 1
}

write_report() {
  local bios_qemu_status="${1:-N/A}"
  local bios_boot_status="${2:-N/A}"
  local uefi_qemu_status="${3:-N/A}"
  local uefi_boot_status="${4:-N/A}"

  local report_file="${LOG_DIR}/SMOKE-v${VERSION}.md"

  cat > "$report_file" <<EOF
# KAPiTaN OS Boot Smoke Test Report — v${VERSION}

**Generated:** $(date -u +'%Y-%m-%d %H:%M:%S UTC')
**ISO:** ${ISO##*/}
**Timeout:** ${TIMEOUT_SEC}s per mode
**Secure Boot:** OUT OF SCOPE (Phase 2)

## Automated Boot Checks

| Firmware | QEMU Exit | Boot Signal | Status |
|----------|-----------|-------------|--------|
| BIOS     | ${bios_qemu_status} | ${bios_boot_status} | $([ "${bios_boot_status}" = "PASS" ] && echo "PASS" || echo "FAIL") |
| UEFI     | ${uefi_qemu_status} | ${uefi_boot_status} | $([ "${uefi_boot_status}" = "PASS" ] && echo "PASS" || echo "FAIL") |

## Test Log Locations

- BIOS: \`${LOG_DIR}/qemu-smoke-bios.log\`
- UEFI: \`${LOG_DIR}/qemu-smoke-uefi.log\`

## Manual Checklist (run inside live session)

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

Complete manual rows after boot. For interactive BIOS testing:
\`npm run qemu:smoke -- --mode bios --interactive\`

For interactive UEFI testing:
\`npm run qemu:smoke -- --mode uefi --interactive\`
EOF

  echo "$report_file"
}

main() {
  parse_args "$@"

  if [[ ! -f "${ISO}" ]]; then
    die "ISO not found: ${ISO}. Run: npm run build:iso (on Debian amd64)"
  fi

  mkdir -p "${LOG_DIR}"

  log "ISO: ${ISO} ($(du -h "${ISO}" | awk '{print $1}'))"
  log "Mode: ${MODE}"

  if [[ "${DRY_RUN}" -eq 1 ]]; then
    log "Timeout: ${TIMEOUT_SEC}s"
    if [[ "$MODE" == "bios" || "$MODE" == "both" ]]; then
      run_qemu_mode bios
    fi
    if [[ "$MODE" == "uefi" || "$MODE" == "both" ]]; then
      run_qemu_mode uefi
    fi
    exit 0
  fi

  local bios_qemu_status="N/A"
  local bios_boot_status="N/A"
  local uefi_qemu_status="N/A"
  local uefi_boot_status="N/A"

  if [[ "$MODE" == "bios" || "$MODE" == "both" ]]; then
    if run_qemu_mode bios; then
      bios_qemu_status="PASS"
      bios_boot_status="PASS"
    else
      bios_qemu_status="FAIL"
      bios_boot_status="FAIL"
    fi
  fi

  if [[ "$MODE" == "uefi" || "$MODE" == "both" ]]; then
    if run_qemu_mode uefi; then
      uefi_qemu_status="PASS"
      uefi_boot_status="PASS"
    else
      uefi_qemu_status="FAIL"
      uefi_boot_status="FAIL"
    fi
  fi

  local report_file
  report_file="$(write_report "$bios_qemu_status" "$bios_boot_status" "$uefi_qemu_status" "$uefi_boot_status")"
  log "Report: ${report_file}"

  local any_fail=0
  if [[ "$MODE" == "bios" || "$MODE" == "both" ]]; then
    if [[ "$bios_boot_status" != "PASS" && "${INTERACTIVE}" -eq 0 ]]; then
      log "BIOS smoke boot check FAILED — no kernel/init markers in ${LOG_DIR}/qemu-smoke-bios.log"
      any_fail=1
    fi
  fi
  if [[ "$MODE" == "uefi" || "$MODE" == "both" ]]; then
    if [[ "$uefi_boot_status" != "PASS" && "${INTERACTIVE}" -eq 0 ]]; then
      log "UEFI smoke boot check FAILED — no kernel/init markers in ${LOG_DIR}/qemu-smoke-uefi.log"
      any_fail=1
    fi
  fi

  if [[ "$any_fail" -eq 1 ]]; then
    die "One or more smoke boot checks failed — see report: ${report_file}"
  fi

  log "Smoke harness complete. Finish manual checklist in: ${report_file}"
}

main "$@"
