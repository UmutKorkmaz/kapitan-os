#!/usr/bin/env bash
# Sync repo assets into live-build config/includes.chroot before lb config/build.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
INCLUDES="${REPO_ROOT}/build/live-build/config/includes.chroot"
LB_DIR="${REPO_ROOT}/build/live-build"

log() {
  printf '[sync-image-assets] %s\n' "$*"
}

die() {
  printf '[sync-image-assets] ERROR: %s\n' "$*" >&2
  exit 1
}

sync_package_list() {
  local src="${LB_DIR}/auto/package-lists/kapitan.list.chroot"
  local dest_dir="${LB_DIR}/config/package-lists"
  local dest="${dest_dir}/kapitan.list.chroot"
  if [[ ! -f "${src}" ]]; then
    die "Missing ${src}"
  fi
  mkdir -p "${dest_dir}"
  cp "${src}" "${dest}"
  log "package list → ${dest}"
}

sync_commands() {
  local ssot="${REPO_ROOT}/packages/commands/commands.json"
  local runtime="${REPO_ROOT}/packages/kapitan-sh/data/commands.json"
  local dest_dir="${INCLUDES}/usr/share/kapitan"
  local dest="${dest_dir}/commands.json"

  if [[ ! -f "${ssot}" ]]; then
    die "Missing ${ssot}"
  fi
  if [[ ! -f "${runtime}" ]]; then
    die "Missing ${runtime}"
  fi
  if ! command -v jq >/dev/null 2>&1; then
    die "jq required to merge ISO commands.json (install jq on build host)"
  fi

  mkdir -p "${dest_dir}"
  jq -s '
    .[0] as $ssot | .[1] as $rt |
    ($rt.commands | map({(.id): .implemented}) | add) as $impl |
    $ssot
    | .path_guard = ($rt.path_guard // ["git"])
    | .commands |= map(. + {implemented: ($impl[.id] // false)})
  ' "${ssot}" "${runtime}" > "${dest}"
  log "commands.json (SSOT + runtime path_guard/implemented) → ${dest}"
}

sync_kapitan_sh() {
  local pkg="${REPO_ROOT}/packages/kapitan-sh"
  local dest_root="${INCLUDES}/usr/share/kapitan/kapitan-sh"
  local wrapper="${INCLUDES}/usr/local/bin/kapitan-sh"

  if [[ ! -f "${pkg}/kapitan-sh" ]]; then
    die "Missing ${pkg}/kapitan-sh"
  fi

  mkdir -p "${dest_root}/lib"
  install -m 0755 "${pkg}/kapitan-sh" "${dest_root}/kapitan-sh"
  cp -a "${pkg}/lib/." "${dest_root}/lib/"
  log "kapitan-sh tree → ${dest_root}/"

  mkdir -p "$(dirname "${wrapper}")"
  cat > "${wrapper}" <<'EOF'
#!/usr/bin/env bash
export KAPITAN_COMMANDS_JSON="${KAPITAN_COMMANDS_JSON:-/usr/share/kapitan/commands.json}"
exec /usr/share/kapitan/kapitan-sh/kapitan-sh "$@"
EOF
  chmod 0755 "${wrapper}"
  log "kapitan-sh wrapper → ${wrapper}"
}

sync_overlay() {
  local src="${REPO_ROOT}/distro/overlay"
  if [[ ! -d "${src}" ]]; then
    die "Missing ${src}"
  fi
  mkdir -p "${INCLUDES}"
  cp -a "${src}/." "${INCLUDES}/"
  log "distro overlay → ${INCLUDES}/"
}

write_version_stamp() {
  local dest_dir="${INCLUDES}/etc/kapitan"
  mkdir -p "${dest_dir}"
  printf '%s\n' "v0.1.0-alpha" > "${dest_dir}/VERSION"
  log "VERSION stamp → ${dest_dir}/VERSION"
}

main() {
  sync_package_list
  sync_commands
  sync_kapitan_sh
  sync_overlay
  write_version_stamp
  log "Image asset sync complete"
}

main "$@"