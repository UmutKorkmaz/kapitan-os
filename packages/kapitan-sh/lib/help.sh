#!/usr/bin/env bash
# kapitan-sh — yardım command listing

if [[ -n "${KAPITAN_HELP_LOADED:-}" ]]; then
  return 0 2>/dev/null || exit 0
fi
KAPITAN_HELP_LOADED=1

kapitan_yardim() {
  local filter="${1:-}"
  local json_file="${KAPITAN_COMMANDS_JSON:-${KAPITAN_SH_ROOT}/data/commands.json}"
  local mode="${KAPITAN_DIL:-ikili}"

  printf 'KAPiTaN OS Kabuk — Komut Yardımı\n'
  printf 'Mod: %s  |  Dil: %s\n' "${KAPITAN_DIL:-ikili}" "${LANG:-tr_TR.UTF-8}"
  printf '%s\n' '────────────────────────────────────────────────────────'

  if ! command -v jq >/dev/null 2>&1; then
    printf 'jq bulunamadı; yardım listesi yüklenemedi.\n' >&2
    return 1
  fi

  if [[ -n "$filter" ]]; then
    _kapitan_yardim_detail "$filter" "$json_file"
    return $?
  fi

  local group_key group_label
  while IFS=$'\t' read -r group_key group_label; do
    [[ -z "$group_key" ]] && continue
    printf '\n▸ %s\n' "$group_label"

    jq -r --arg g "$group_key" --arg m "$mode" '
      .commands[]
      | select(.group == $g)
      | select(
          .implemented == true
          or ($m == "posix" and .posix != null)
        )
      | if .implemented then
          "  \(.kapitan) (\(.short)) · \(.posix) — \(.description)"
        else
          "  \(.kapitan) (\(.short)) · \(.posix) — \(.description) [yakında]"
        end
    ' "$json_file" | while IFS= read -r line; do
      [[ -n "$line" ]] && printf '%s\n' "$line"
    done
  done < <(jq -r '.groups | sort_by(.order) | .[] | [.key, .label] | @tsv' "$json_file")

  printf '\n%s\n' '────────────────────────────────────────────────────────'
  printf 'Detay: yardım <komut>   |   Modlar: posix · turkce · ikili\n'
  printf 'Örnek: gir ~   listele -la   kur vim   güncelle\n'
}

_kapitan_yardim_detail() {
  local token="$1"
  local json_file="$2"

  local detail
  detail="$(jq -r --arg t "$token" '
    .commands[]
    | select(.kapitan == $t or .short == $t or .posix == $t or .id == $t)
    | "Komut: \(.kapitan) (\(.short))\nPOSIX: \(.posix)\nGrup: \(.group)\nDurum: \(if .implemented then "uygulandı" else "yakında" end)\nAçıklama: \(.description)"
  ' "$json_file")"

  if [[ -z "$detail" ]]; then
    printf 'kapitan-sh: yardım: «%s» bulunamadı.\n' "$token" >&2
    return 1
  fi

  printf '%s\n' "$detail"
}