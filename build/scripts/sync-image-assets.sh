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

verify_package_lists() {
  local edition="${KAPITAN_EDITION:-bar}"
  local pkg_dir="${LB_DIR}/config/package-lists"
  local base_list="${pkg_dir}/kapitan-base.list.chroot"
  local edition_list="${pkg_dir}/${edition}.list.chroot"

  [[ -f "${base_list}" ]] || die "Missing base package list: ${base_list}"
  [[ -f "${edition_list}" ]] || die "Missing edition package list: ${edition_list} — check KAPITAN_EDITION=${edition}"

  log "base package list:    ${base_list}"
  log "edition package list: ${edition_list} (${edition})"
}

sync_commands() {
  # The runtime registry is generated from the canonical commands.json + the
  # implemented-overlay by `npm run generate:commands` (CI fails on drift), so
  # the ISO ships a byte-identical copy — no merge. The old jq merge keyed by
  # .id silently dropped AI implemented flags because the runtime and SSOT used
  # disjoint AI ids (ai-ask vs ai-sor); generating both from one source fixes it.
  local runtime="${REPO_ROOT}/packages/kapitan-sh/data/commands.json"
  local dest_dir="${INCLUDES}/usr/share/kapitan"
  local dest="${dest_dir}/commands.json"

  if [[ ! -f "${runtime}" ]]; then
    die "Missing ${runtime} (run: npm run generate:commands)"
  fi

  mkdir -p "${dest_dir}"
  cp "${runtime}" "${dest}"
  log "commands.json (generated runtime) → ${dest}"
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
  verify_package_lists
  sync_commands
  sync_kapitan_sh
  sync_overlay
  write_version_stamp
  log "Image asset sync complete"
}

main "$@"
