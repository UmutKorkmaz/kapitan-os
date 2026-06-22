#!/usr/bin/env bats
# test_safety.bats — dispatch safety: command-substitution injection guard,
# exit-code propagation, and compound-command correctness.
#
# These run the real kapitan-sh binary in -c mode against the minimal fixture,
# so they exercise tokenize -> transform -> dispatch end to end.

setup() {
  KSH_ROOT="$(cd "$(dirname "${BATS_TEST_DIRNAME}")" && pwd)"
  KSH="${KSH_ROOT}/kapitan-sh"
  export KAPITAN_COMMANDS_JSON="${BATS_TEST_DIRNAME}/fixtures/commands.min.json"
  export KAPITAN_DIL="ikili"
  unset KAPITAN_ALLOW_SHELL KAPITAN_SHELL_MODE
  PWN="${BATS_TEST_TMPDIR}/pwn"
  rm -f "$PWN"
}

# --- exit codes ------------------------------------------------------------

@test "implemented command exits 0" {
  run "$KSH" -c "listele ${BATS_TEST_TMPDIR}"
  [ "$status" -eq 0 ]
}

@test "command mapping to missing binary exits non-zero" {
  run "$KSH" -c "sor test"
  [ "$status" -ne 0 ]
}

# --- compound correctness --------------------------------------------------

@test "compound of implemented commands runs and exits 0 (cd persists)" {
  mkdir -p "${BATS_TEST_TMPDIR}/kapdir"
  run "$KSH" -c "gir ${BATS_TEST_TMPDIR}/kapdir && nerede"
  [ "$status" -eq 0 ]
  [[ "$output" == *"kapdir"* ]]
}

@test "compound with missing-binary command fails cleanly, no eval syntax error" {
  run "$KSH" -c "nerede && sor test && listele ${BATS_TEST_TMPDIR}"
  [ "$status" -ne 0 ]
  [[ "$output" != *"syntax error"* ]]
  [[ "$output" != *"&&&&"* ]]
}

# --- command-substitution injection guard (safe mode = default) ------------

@test "dollar-paren command substitution is blocked by default" {
  run "$KSH" -c "listele \$(touch ${PWN}) ${BATS_TEST_TMPDIR}"
  [ "$status" -ne 0 ]
  [ ! -f "$PWN" ]
  [[ "$output" == *"KAPITAN_ALLOW_SHELL"* ]]
}

@test "backtick command substitution is blocked by default" {
  run "$KSH" -c "listele \`touch ${PWN}\` ${BATS_TEST_TMPDIR}"
  [ "$status" -ne 0 ]
  [ ! -f "$PWN" ]
}

@test "path-guarded binary cannot smuggle command substitution" {
  run "$KSH" -c "git \$(touch ${PWN})"
  [ "$status" -ne 0 ]
  [ ! -f "$PWN" ]
}

@test "single-quoted dollar-paren is literal, not flagged as injection" {
  run "$KSH" -c "listele '\$(touch ${PWN})' ${BATS_TEST_TMPDIR}"
  [ ! -f "$PWN" ]
  [[ "$output" != *"KAPITAN_ALLOW_SHELL"* ]]
}

# --- explicit full-shell opt-in --------------------------------------------

@test "command substitution runs when KAPITAN_ALLOW_SHELL=1" {
  KAPITAN_ALLOW_SHELL=1 run "$KSH" -c "listele \$(touch ${PWN}) ${BATS_TEST_TMPDIR}"
  [ -f "$PWN" ]
}
