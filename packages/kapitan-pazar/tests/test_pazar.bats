#!/usr/bin/env bats
# test_pazar.bats — pazar stage-1 apt wrapper. Uses PATH-shimmed mocks for
# apt-get / apt-cache / dpkg-query / sudo (tests/mocks).

setup() {
  PAZAR_ROOT="$(cd "$(dirname "$BATS_TEST_DIRNAME")" && pwd)"
  PAZAR="${PAZAR_ROOT}/pazar"
  export PATH="${BATS_TEST_DIRNAME}/mocks:${PATH}"
}

# --- read-only commands ----------------------------------------------------

@test "tara searches and returns results" {
  run "$PAZAR" tara terminal
  [ "$status" -eq 0 ]
  [[ "$output" == *"xterm"* ]]
}

@test "tara with no match prints a Turkish notice, exit 0" {
  run "$PAZAR" tara zzznomatch
  [ "$status" -eq 0 ]
  [[ "$output" == *"sonuç yok"* ]]
}

@test "incele shows package details" {
  run "$PAZAR" incele bash
  [ "$status" -eq 0 ]
  [[ "$output" == *"Package: bash"* ]]
}

@test "kurulu lists installed packages" {
  run "$PAZAR" kurulu
  [ "$status" -eq 0 ]
  [[ "$output" == *"bash"* ]]
}

# --- mutating commands: plan / confirm / execute ---------------------------

@test "kur shows plan and installs with --evet" {
  run "$PAZAR" --evet kur vim
  [ "$status" -eq 0 ]
  [[ "$output" == *"pazar planı"* ]]
  [[ "$output" == *"Inst vim"* ]]
  [[ "$output" == *"Setting up vim"* ]]
}

@test "kur --plan shows plan but does NOT install" {
  run "$PAZAR" --plan kur vim
  [ "$status" -eq 0 ]
  [[ "$output" == *"Inst vim"* ]]
  [[ "$output" != *"Setting up vim"* ]]
}

@test "kur --json emits a machine-readable plan" {
  run "$PAZAR" --plan --json kur vim
  [ "$status" -eq 0 ]
  [[ "$output" == *'"op":"install"'* ]]
  [[ "$output" == *'"install":["vim"]'* ]]
}

@test "kur without --evet and no TTY refuses (no silent hang)" {
  run "$PAZAR" kur vim
  [ "$status" -eq 1 ]
  [[ "$output" == *"--evet"* ]]
}

@test "kur unknown package maps apt error to Turkish" {
  run "$PAZAR" --evet kur badpkg
  [ "$status" -ne 0 ]
  [[ "$output" == *"paket bulunamadı"* ]]
}

# --- ASCII folding & errors ------------------------------------------------

@test "ASCII folding: 'kaldir' resolves like 'kaldır'" {
  run "$PAZAR" --plan kaldir vim
  [ "$status" -eq 0 ]
  [[ "$output" == *"Remv vim"* ]]
}

@test "güncelle offline maps to a Turkish network error" {
  MOCK_OFFLINE=1 run "$PAZAR" guncelle
  [ "$status" -ne 0 ]
  [[ "$output" == *"ağ hatası"* ]]
}

@test "unknown subcommand exits 2 with Turkish message" {
  run "$PAZAR" floooop
  [ "$status" -eq 2 ]
  [[ "$output" == *"bilinmeyen komut"* ]]
}

@test "help lists the Turkish commands" {
  run "$PAZAR" --help
  [ "$status" -eq 0 ]
  [[ "$output" == *"Türkçe paket yöneticisi"* ]]
}
