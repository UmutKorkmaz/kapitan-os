#!/usr/bin/env bash
# kapitan-sh — exec handoff, pipeline-safe dispatch

if [[ -n "${KAPITAN_DISPATCH_LOADED:-}" ]]; then
  return 0 2>/dev/null || exit 0
fi
KAPITAN_DISPATCH_LOADED=1

KAPITAN_COMPOUND_PARTS=()
KAPITAN_COMPOUND_OPS=()

# Full-shell mode is opt-in. Default "safe" mode refuses command/process
# substitution so a Turkish alias (or an AI-proposed command) cannot smuggle
# hidden command execution into an argument.
kapitan_shell_allowed() {
  [[ "${KAPITAN_ALLOW_SHELL:-0}" == "1" || "${KAPITAN_SHELL_MODE:-safe}" == "full" ]]
}

# Quote-aware scan for command/process substitution ($(...), `...`, <(...),
# >(...)) outside single quotes (single quotes make them inert). Returns 0 if
# any active substitution is present.
kapitan_has_command_substitution() {
  local s="$1"
  local n=${#s} i=0 ch nx in_single=0
  while (( i < n )); do
    ch="${s:i:1}"
    if (( in_single )); then
      [[ "$ch" == "'" ]] && in_single=0
      ((i++)); continue
    fi
    case "$ch" in
      "'") in_single=1 ;;
      '`') return 0 ;;
      '$') nx="${s:i+1:1}"; [[ "$nx" == "(" ]] && return 0 ;;
      '<') nx="${s:i+1:1}"; [[ "$nx" == "(" ]] && return 0 ;;
      '>') nx="${s:i+1:1}"; [[ "$nx" == "(" ]] && return 0 ;;
    esac
    ((i++))
  done
  return 1
}

kapitan_is_meta_command() {
  case "$1" in
    yardım|yardim|help) return 0 ;;
    *) return 1 ;;
  esac
}

kapitan_transform_segment() {
  local segment="$1"
  local trimmed="${segment#"${segment%%[![:space:]]*}"}"

  if [[ -z "$trimmed" ]]; then
    printf '%s' "$segment"
    return 0
  fi

  local first="" rest="" posix="" lead=""
  local i=0 len=${#trimmed}
  local in_single=0 in_double=0 escaped=0
  local ch token_start=-1

  while (( i < len )); do
    ch="${trimmed:i:1}"
    [[ "$ch" != $' \t' ]] && break
    lead+="$ch"
    ((i++))
  done

  token_start=$i

  while (( i < len )); do
    ch="${trimmed:i:1}"

    if (( escaped )); then
      escaped=0
      ((i++))
      continue
    fi

    if [[ "$ch" == '\\' ]]; then
      escaped=1
      ((i++))
      continue
    fi

    if (( in_single )); then
      [[ "$ch" == "'" ]] && in_single=0
      ((i++))
      continue
    fi

    if (( in_double )); then
      [[ "$ch" == '"' ]] && in_double=0
      ((i++))
      continue
    fi

    case "$ch" in
      "'") in_single=1; ((i++)); continue ;;
      '"') in_double=1; ((i++)); continue ;;
      [[:space:]]|'='|'('|')') break ;;
    esac

    ((i++))
  done

  first="${trimmed:token_start:i-token_start}"
  rest="${trimmed:i}"

  if [[ -z "$first" ]]; then
    printf '%s' "$segment"
    return 0
  fi

  if kapitan_is_meta_command "$first"; then
    printf '%s' "$segment"
    return 0
  fi

  if [[ "$first" == *'='* ]]; then
    printf '%s' "$segment"
    return 0
  fi

  posix="$(kapitan_resolve_token "$first")"
  local _rc=$?
  if (( _rc != 0 )); then
    return "$_rc"
  fi

  printf '%s%s%s' "$lead" "$posix" "$rest"
}

kapitan_tokenize_compound() {
  local line="$1"

  KAPITAN_COMPOUND_PARTS=()
  KAPITAN_COMPOUND_OPS=()

  local trimmed="${line#"${line%%[![:space:]]*}"}"
  trimmed="${trimmed%"${trimmed##*[![:space:]]}"}"
  [[ -z "$trimmed" ]] && return 0

  local current=""
  local i=0 len=${#trimmed}
  local in_single=0 in_double=0 escaped=0
  local ch

  while (( i < len )); do
    ch="${trimmed:i:1}"

    if (( escaped )); then
      current+="$ch"
      escaped=0
      ((i++))
      continue
    fi

    if [[ "$ch" == '\\' ]]; then
      current+="$ch"
      escaped=1
      ((i++))
      continue
    fi

    if (( in_single )); then
      current+="$ch"
      [[ "$ch" == "'" ]] && in_single=0
      ((i++))
      continue
    fi

    if (( in_double )); then
      current+="$ch"
      [[ "$ch" == '"' ]] && in_double=0
      ((i++))
      continue
    fi

    case "$ch" in
      "'") in_single=1; current+="$ch"; ((i++)); continue ;;
      '"') in_double=1; current+="$ch"; ((i++)); continue ;;
    esac

    if [[ "$ch" == '|' ]]; then
      KAPITAN_COMPOUND_PARTS[${#KAPITAN_COMPOUND_PARTS[@]}]="$current"
      KAPITAN_COMPOUND_OPS[${#KAPITAN_COMPOUND_OPS[@]}]='|'
      current=""
      ((i++))
      continue
    fi

    if [[ "$ch" == '&' && $((i + 1)) -lt $len && "${trimmed:i+1:1}" == '&' ]]; then
      KAPITAN_COMPOUND_PARTS[${#KAPITAN_COMPOUND_PARTS[@]}]="$current"
      KAPITAN_COMPOUND_OPS[${#KAPITAN_COMPOUND_OPS[@]}]='&&'
      current=""
      ((i += 2))
      continue
    fi

    if [[ "$ch" == ';' ]]; then
      KAPITAN_COMPOUND_PARTS[${#KAPITAN_COMPOUND_PARTS[@]}]="$current"
      KAPITAN_COMPOUND_OPS[${#KAPITAN_COMPOUND_OPS[@]}]=';'
      current=""
      ((i++))
      continue
    fi

    current+="$ch"
    ((i++))
  done

  KAPITAN_COMPOUND_PARTS[${#KAPITAN_COMPOUND_PARTS[@]}]="$current"
}

kapitan_transform_line() {
  local line="$1"
  local transformed="" full="" part op i

  kapitan_tokenize_compound "$line"

  if ((${#KAPITAN_COMPOUND_PARTS[@]} == 0)); then
    return 0
  fi

  for (( i=0; i<${#KAPITAN_COMPOUND_PARTS[@]}; i++ )); do
    part="${KAPITAN_COMPOUND_PARTS[$i]}"
    if [[ -n "${part//[[:space:]]/}" ]]; then
      transformed="$(kapitan_transform_segment "$part")"
      local _rc=$?
      if (( _rc != 0 )); then
        return "$_rc"
      fi
      full+="$transformed"
    fi
    if [[ $i -lt ${#KAPITAN_COMPOUND_OPS[@]} ]]; then
      full+="${KAPITAN_COMPOUND_OPS[$i]}"
    fi
  done

  printf '%s' "$full"
}

kapitan_dispatch_line() {
  local line="$1"
  local transformed=""
  local trimmed="${line#"${line%%[![:space:]]*}"}"
  trimmed="${trimmed%"${trimmed##*[![:space:]]}"}"
  local first=""

  if [[ -z "${trimmed//[[:space:]]/}" ]]; then
    return 0
  fi

  read -r first _ <<< "$trimmed"
  if kapitan_is_meta_command "$first"; then
    kapitan_yardim "${trimmed#"$first"}"
    return $?
  fi

  # Safety: command/process substitution can hide arbitrary execution inside an
  # argument (e.g. `listele $(rm -rf ~)`), bypassing the resolver and path_guard.
  # Refuse it unless the user explicitly opts into full-shell mode.
  if ! kapitan_shell_allowed && kapitan_has_command_substitution "$line"; then
    printf 'kapitan-sh: güvenlik — komut, güvenli modda kapalı bir kabuk özelliği içeriyor («$(...)», «`...`» veya «<(...)»).\n' >&2
    printf 'İzin vermek için (tam kabuk, korumasız): KAPITAN_ALLOW_SHELL=1\n' >&2
    return 2
  fi

  transformed="$(kapitan_transform_line "$line")"
  local _rc=$?
  if (( _rc != 0 )); then
    return "$_rc"
  fi

  eval "$transformed"
  return $?
}

kapitan_dispatch_argv() {
  local argv=("$@")

  if ((${#argv[@]} == 0)); then
    return 0
  fi

  local cmd="${argv[0]}"

  if kapitan_is_meta_command "$cmd"; then
    kapitan_yardim "${argv[@]:1}"
    return $?
  fi

  kapitan_resolve "$cmd" "${argv[@]:1}"
  return $?
}