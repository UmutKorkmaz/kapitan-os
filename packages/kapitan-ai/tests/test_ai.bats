#!/usr/bin/env bats
# test_ai.bats — kapitan-ai CLI: harness behaviour (confirm/argv-exec), sor stub,
# doctor, and the model-gated subcommands.

setup() {
  AI_ROOT="$(cd "$(dirname "$BATS_TEST_DIRNAME")" && pwd)"
  AI="${AI_ROOT}/kapitan-ai"
}

@test "doctor reports status" {
  run "$AI" doctor
  [ "$status" -eq 0 ]
  [[ "$output" == *"Güvenlik"* ]]
  [[ "$output" == *"Model"* ]]
}

@test "sınıf prints the tier (rm -rf / -> destructive)" {
  run "$AI" sınıf rm -rf /
  [ "$status" -eq 0 ]
  [[ "$output" == *"destructive"* ]]
}

@test "calistir --evet runs a safe command via argv" {
  run "$AI" --evet çalıştır echo merhaba
  [ "$status" -eq 0 ]
  [[ "$output" == *"merhaba"* ]]
  [[ "$output" == *"Risk"* ]]
}

@test "calistir without --evet and no TTY refuses (no silent exec)" {
  local marker="${BATS_TEST_TMPDIR}/ai_exec_marker"
  rm -f "$marker"
  run "$AI" çalıştır touch "$marker"
  [ "$status" -eq 1 ]
  [[ "$output" == *"onay gerekiyor"* ]]
  [ ! -f "$marker" ]   # the command was never executed
}

@test "destructive command refuses with --evet (needs typed ONAYLA)" {
  run "$AI" --evet çalıştır rm -rf /tmp/kapitan-nope
  [ "$status" -eq 1 ]
  [[ "$output" == *"ONAYLA"* ]]
}

@test "sınıf is computed by us, not the command's claim" {
  # even if the 'command' looks benign-named but is rm, it's destructive
  run "$AI" sınıf rm important.txt
  [[ "$output" == *"destructive"* ]]
}

@test "sor maps a simple Turkish intent and runs it with --evet" {
  run "$AI" --evet sor "dosyaları listele"
  [ "$status" -eq 0 ]
  [[ "$output" == *"Önerilen komut: ls -la"* ]]
}

@test "sor on an unknown intent points to the model, exit 1" {
  run "$AI" sor "kuantum dolanıklığını çöz"
  [ "$status" -eq 1 ]
  [[ "$output" == *"model"* ]]
}

@test "model kur finds the manifest and attempts download" {
  run "$AI" model kur
  # Manifest must be found (structural check); download may fail in test env.
  [[ "$output" != *"manifest bulunamadı"* ]]
  # Either already cached (0) or download attempted (0 or 1) — never exit 2.
  [ "$status" -ne 2 ]
}

@test "kodla requires the model (exit 1)" {
  run "$AI" kodla "bir web sunucusu"
  [ "$status" -eq 1 ]
  [[ "$output" == *"model"* ]]
}

@test "unknown subcommand exits 2" {
  run "$AI" floooop
  [ "$status" -eq 2 ]
}
