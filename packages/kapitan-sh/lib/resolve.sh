#!/usr/bin/env bash
# kapitan-sh — alias → POSIX resolution from commands.json
# Compatible with bash 3.2+ (indexed-array maps, no namerefs).

if [[ -n "${KAPITAN_RESOLVE_LOADED:-}" ]]; then
  return 0 2>/dev/null || exit 0
fi
KAPITAN_RESOLVE_LOADED=1

# Parallel key/value stores (linear lookup, 66 entries).
KAPITAN_MAP_SHORT_KEYS=()
KAPITAN_MAP_SHORT_VALS=()
KAPITAN_MAP_KAPITAN_KEYS=()
KAPITAN_MAP_KAPITAN_VALS=()
KAPITAN_MAP_POSIX_KEYS=()
KAPITAN_MAP_POSIX_VALS=()
KAPITAN_MAP_IMPL_KEYS=()
KAPITAN_MAP_IMPL_VALS=()
KAPITAN_PATH_GUARD=()

KAPITAN_BUILTINS="cd pwd echo export unset source alias unalias type declare local read eval exec exit return shift set shopt history"

kapitan_map_set() {
  local ns="$1" key="$2" val="$3"
  case "$ns" in
    short)
      KAPITAN_MAP_SHORT_KEYS[${#KAPITAN_MAP_SHORT_KEYS[@]}]="$key"
      KAPITAN_MAP_SHORT_VALS[${#KAPITAN_MAP_SHORT_VALS[@]}]="$val"
      ;;
    kapitan)
      KAPITAN_MAP_KAPITAN_KEYS[${#KAPITAN_MAP_KAPITAN_KEYS[@]}]="$key"
      KAPITAN_MAP_KAPITAN_VALS[${#KAPITAN_MAP_KAPITAN_VALS[@]}]="$val"
      ;;
    posix)
      KAPITAN_MAP_POSIX_KEYS[${#KAPITAN_MAP_POSIX_KEYS[@]}]="$key"
      KAPITAN_MAP_POSIX_VALS[${#KAPITAN_MAP_POSIX_VALS[@]}]="$val"
      ;;
    impl)
      KAPITAN_MAP_IMPL_KEYS[${#KAPITAN_MAP_IMPL_KEYS[@]}]="$key"
      KAPITAN_MAP_IMPL_VALS[${#KAPITAN_MAP_IMPL_VALS[@]}]="$val"
      ;;
  esac
}

kapitan_map_get() {
  local ns="$1" key="$2"
  local i
  case "$ns" in
    short)
      for (( i=0; i<${#KAPITAN_MAP_SHORT_KEYS[@]}; i++ )); do
        if [[ "${KAPITAN_MAP_SHORT_KEYS[$i]}" == "$key" ]]; then
          printf '%s' "${KAPITAN_MAP_SHORT_VALS[$i]}"
          return 0
        fi
      done
      ;;
    kapitan)
      for (( i=0; i<${#KAPITAN_MAP_KAPITAN_KEYS[@]}; i++ )); do
        if [[ "${KAPITAN_MAP_KAPITAN_KEYS[$i]}" == "$key" ]]; then
          printf '%s' "${KAPITAN_MAP_KAPITAN_VALS[$i]}"
          return 0
        fi
      done
      ;;
    posix)
      for (( i=0; i<${#KAPITAN_MAP_POSIX_KEYS[@]}; i++ )); do
        if [[ "${KAPITAN_MAP_POSIX_KEYS[$i]}" == "$key" ]]; then
          printf '%s' "${KAPITAN_MAP_POSIX_VALS[$i]}"
          return 0
        fi
      done
      ;;
    impl)
      for (( i=0; i<${#KAPITAN_MAP_IMPL_KEYS[@]}; i++ )); do
        if [[ "${KAPITAN_MAP_IMPL_KEYS[$i]}" == "$key" ]]; then
          printf '%s' "${KAPITAN_MAP_IMPL_VALS[$i]}"
          return 0
        fi
      done
      ;;
  esac
  return 1
}

kapitan_error() {
  local code="$1"
  shift
  case "$code" in
    E001)
      printf 'kapitan-sh: komut bulunamadı: «%s»\n' "$1" >&2
      printf 'İpucu: yardım yazarak komut listesine bakın.\n' >&2
      ;;
    E003)
      printf 'kapitan-sh: Türkçe komut bu modda kapalı: «%s»\n' "$1" >&2
      printf 'İpucu: export KAPITAN_DIL=ikili\n' >&2
      ;;
    E004)
      printf 'kapitan-sh: komut henüz uygulanmadı: «%s» → %s\n' "$1" "$2" >&2
      ;;
    E005)
      printf 'kapitan-sh: jq gerekli; commands.json yüklenemedi.\n' >&2
      ;;
    *)
      printf 'kapitan-sh: %s\n' "$*" >&2
      ;;
  esac
}

kapitan_is_builtin() {
  local cmd="$1"
  case " ${KAPITAN_BUILTINS} " in
    *" ${cmd} "*) return 0 ;;
  esac
  return 1
}

kapitan_path_guarded() {
  local token="$1"
  local guard
  for guard in "${KAPITAN_PATH_GUARD[@]}"; do
    [[ "$token" == "$guard" ]] && return 0
  done
  return 1
}

kapitan_load_registry() {
  local json_file="${KAPITAN_COMMANDS_JSON:-${KAPITAN_SH_ROOT}/data/commands.json}"

  if [[ ! -f "$json_file" ]]; then
    printf 'kapitan-sh: commands.json bulunamadı: %s\n' "$json_file" >&2
    return 1
  fi

  if ! command -v jq >/dev/null 2>&1; then
    kapitan_error E005
    return 1
  fi

  KAPITAN_PATH_GUARD=()
  while IFS= read -r guard; do
    [[ -n "$guard" ]] && KAPITAN_PATH_GUARD[${#KAPITAN_PATH_GUARD[@]}]="$guard"
  done < <(jq -r '.path_guard[]?' "$json_file")

  local short kapitan posix implemented description group
  while IFS=$'\t' read -r short kapitan posix implemented description group; do
    [[ -z "$short" ]] && continue
    kapitan_map_set short "$short" "$posix"
    kapitan_map_set kapitan "$kapitan" "$posix"
    kapitan_map_set posix "$posix" "$posix"
    kapitan_map_set impl "$short" "$implemented"
    kapitan_map_set impl "$kapitan" "$implemented"
    kapitan_map_set impl "$posix" "$implemented"
  done < <(jq -r '.commands[] | [.short, .kapitan, .posix, (.implemented|tostring), .description, .group] | @tsv' "$json_file")

  return 0
}

kapitan_registry_lookup() {
  local token="$1"
  local mode="${KAPITAN_DIL:-ikili}"
  local posix=""

  posix="$(kapitan_map_get short "$token" 2>/dev/null)" && { printf '%s' "$posix"; return 0; }
  posix="$(kapitan_map_get kapitan "$token" 2>/dev/null)" && { printf '%s' "$posix"; return 0; }

  if [[ "$mode" == "ikili" ]]; then
    posix="$(kapitan_map_get posix "$token" 2>/dev/null)" && { printf '%s' "$posix"; return 0; }
  fi

  return 1
}

kapitan_registry_is_known_posix() {
  local token="$1"
  kapitan_map_get posix "$token" >/dev/null 2>&1
}

kapitan_is_implemented() {
  local token="$1"
  local val
  val="$(kapitan_map_get impl "$token" 2>/dev/null || printf 'false')"
  [[ "$val" == "true" ]]
}

kapitan_resolve_token() {
  local token="$1"
  local mode="${KAPITAN_DIL:-ikili}"
  local posix=""

  if kapitan_path_guarded "$token"; then
    printf '%s' "$token"
    return 0
  fi

  if [[ "$mode" == "posix" ]]; then
    # POSIX mode: no Turkish resolution; tokens pass through unchanged.
    printf '%s' "$token"
    return 0
  fi

  if posix="$(kapitan_registry_lookup "$token")"; then
    if ! kapitan_is_implemented "$token"; then
      kapitan_error E004 "$token" "$posix"
      return 127
    fi
    printf '%s' "$posix"
    return 0
  fi

  if [[ "$mode" == "turkce" ]] && kapitan_registry_is_known_posix "$token"; then
    local suggestion=""
    suggestion="$(jq -r --arg p "$token" '.commands[] | select(.posix == $p) | .kapitan' \
      "${KAPITAN_COMMANDS_JSON:-${KAPITAN_SH_ROOT}/data/commands.json}" 2>/dev/null | head -1)"
    printf 'kapitan-sh: «%s» yerine «%s» kullanın.\n' "$token" "${suggestion:-$token}" >&2
    return 127
  fi

  if [[ "$mode" == "ikili" ]]; then
    printf '%s' "$token"
    return 0
  fi

  kapitan_error E001 "$token"
  return 127
}

kapitan_resolve() {
  local token="$1"
  shift
  local args=("$@")

  if [[ -n "${_KAPITAN_RESOLVED:-}" ]]; then
    if kapitan_is_builtin "$token"; then
      builtin "$token" "${args[@]}"
    else
      command "$token" "${args[@]}"
    fi
    return $?
  fi

  local posix=""
  if ! posix="$(kapitan_resolve_token "$token")"; then
    return $?
  fi

  local posix_argv=()
  read -r -a posix_argv <<< "$posix"

  local cmd="${posix_argv[0]}"
  local cmd_args=()
  local i
  if ((${#posix_argv[@]} > 1)); then
    for (( i=1; i<${#posix_argv[@]}; i++ )); do
      cmd_args[${#cmd_args[@]}]="${posix_argv[$i]}"
    done
  fi
  if ((${#args[@]} > 0)); then
    for (( i=0; i<${#args[@]}; i++ )); do
      cmd_args[${#cmd_args[@]}]="${args[$i]}"
    done
  fi

  if kapitan_is_builtin "$cmd"; then
    builtin "$cmd" "${cmd_args[@]}"
    return $?
  fi

  _KAPITAN_RESOLVED=1 command "$cmd" "${cmd_args[@]}"
  return $?
}