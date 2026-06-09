#!/usr/bin/env bats
# test_resolve.bats — kapitan-sh alias resolution tests
# Covers: gir≡gr≡cd, listele≡lst≡ls, git not shadowed (ADR-004), posix mode bypass.

load test_helper

# ---------------------------------------------------------------------------
# gir ≡ gr ≡ cd
# ---------------------------------------------------------------------------

@test "gir resolves to cd" {
  run kapitan_resolve_token gir
  [ "$status" -eq 0 ]
  [ "$output" = "cd" ]
}

@test "gr resolves to cd" {
  run kapitan_resolve_token gr
  [ "$status" -eq 0 ]
  [ "$output" = "cd" ]
}

@test "cd passes through as cd" {
  run kapitan_resolve_token cd
  [ "$status" -eq 0 ]
  [ "$output" = "cd" ]
}

@test "gir, gr, and cd are equivalent aliases" {
  local gir_out gr_out cd_out
  gir_out="$(kapitan_resolve_token gir)"
  gr_out="$(kapitan_resolve_token gr)"
  cd_out="$(kapitan_resolve_token cd)"
  [ "$gir_out" = "cd" ]
  [ "$gr_out" = "cd" ]
  [ "$cd_out" = "cd" ]
  [ "$gir_out" = "$gr_out" ]
  [ "$gr_out" = "$cd_out" ]
}

@test "gir changes directory same as cd" {
  local tmp
  tmp="$(mktemp -d)"
  local before after_gir after_gr after_cd
  before="$(pwd)"

  kapitan_resolve gir "$tmp"
  after_gir="$(pwd)"
  [ "$after_gir" = "$tmp" ]

  cd "$before"
  kapitan_resolve gr "$tmp"
  after_gr="$(pwd)"
  [ "$after_gr" = "$tmp" ]

  cd "$before"
  kapitan_resolve cd "$tmp"
  after_cd="$(pwd)"
  [ "$after_cd" = "$tmp" ]

  cd "$before"
  rmdir "$tmp"
}

# ---------------------------------------------------------------------------
# listele ≡ lst ≡ ls
# ---------------------------------------------------------------------------

@test "listele resolves to ls" {
  run kapitan_resolve_token listele
  [ "$status" -eq 0 ]
  [ "$output" = "ls" ]
}

@test "lst resolves to ls" {
  run kapitan_resolve_token lst
  [ "$status" -eq 0 ]
  [ "$output" = "ls" ]
}

@test "ls passes through as ls" {
  run kapitan_resolve_token ls
  [ "$status" -eq 0 ]
  [ "$output" = "ls" ]
}

@test "listele, lst, and ls are equivalent aliases" {
  local listele_out lst_out ls_out
  listele_out="$(kapitan_resolve_token listele)"
  lst_out="$(kapitan_resolve_token lst)"
  ls_out="$(kapitan_resolve_token ls)"
  [ "$listele_out" = "ls" ]
  [ "$lst_out" = "ls" ]
  [ "$ls_out" = "ls" ]
  [ "$listele_out" = "$lst_out" ]
  [ "$lst_out" = "$ls_out" ]
}

@test "listele lists files same as ls" {
  local tmp
  tmp="$(mktemp -d)"
  touch "$tmp/alpha.txt" "$tmp/beta.txt"

  local ls_out listele_out lst_out
  ls_out="$(cd "$tmp" && ls)"
  listele_out="$(cd "$tmp" && kapitan_resolve listele)"
  lst_out="$(cd "$tmp" && kapitan_resolve lst)"

  [ "$ls_out" = "$listele_out" ]
  [ "$listele_out" = "$lst_out" ]

  rm -f "$tmp/alpha.txt" "$tmp/beta.txt"
  rmdir "$tmp"
}

# ---------------------------------------------------------------------------
# ADR-004: git must NOT be shadowed by gir
# ---------------------------------------------------------------------------

@test "git resolves to git, not cd (ADR-004)" {
  run kapitan_resolve_token git
  [ "$status" -eq 0 ]
  [ "$output" = "git" ]
  [ "$output" != "cd" ]
}

@test "git is PATH-guarded and never aliased to cd" {
  run kapitan_path_guarded git
  [ "$status" -eq 0 ]

  local resolved
  resolved="$(kapitan_resolve_token git)"
  [ "$resolved" = "git" ]
  [ "$resolved" != "cd" ]
}

@test "git command invokes real git binary" {
  # Verify gir→cd does not intercept git invocations
  run kapitan_resolve git --version
  [ "$status" -eq 0 ]
  [[ "$output" == git\ version* ]]
}

@test "gir and git resolve to different POSIX targets" {
  local gir_out git_out
  gir_out="$(kapitan_resolve_token gir)"
  git_out="$(kapitan_resolve_token git)"
  [ "$gir_out" = "cd" ]
  [ "$git_out" = "git" ]
  [ "$gir_out" != "$git_out" ]
}

# ---------------------------------------------------------------------------
# POSIX mode ignores Turkish aliases
# ---------------------------------------------------------------------------

@test "posix mode: gir does not resolve to cd" {
  KAPITAN_DIL=posix
  run kapitan_resolve_token gir
  [ "$status" -eq 0 ]
  [ "$output" = "gir" ]
  [ "$output" != "cd" ]
}

@test "posix mode: gr does not resolve to cd" {
  KAPITAN_DIL=posix
  run kapitan_resolve_token gr
  [ "$status" -eq 0 ]
  [ "$output" = "gr" ]
  [ "$output" != "cd" ]
}

@test "posix mode: listele does not resolve to ls" {
  KAPITAN_DIL=posix
  run kapitan_resolve_token listele
  [ "$status" -eq 0 ]
  [ "$output" = "listele" ]
  [ "$output" != "ls" ]
}

@test "posix mode: lst does not resolve to ls" {
  KAPITAN_DIL=posix
  run kapitan_resolve_token lst
  [ "$status" -eq 0 ]
  [ "$output" = "lst" ]
  [ "$output" != "ls" ]
}

@test "posix mode: ls still passes through as ls" {
  KAPITAN_DIL=posix
  run kapitan_resolve_token ls
  [ "$status" -eq 0 ]
  [ "$output" = "ls" ]
}

@test "posix mode: git still passes through as git" {
  KAPITAN_DIL=posix
  run kapitan_resolve_token git
  [ "$status" -eq 0 ]
  [ "$output" = "git" ]
}

@test "posix mode ignores all turkish aliases uniformly" {
  KAPITAN_DIL=posix
  local token expected
  for token in gir gr listele lst; do
    expected="$(kapitan_resolve_token "$token")"
    [ "$expected" = "$token" ]
  done
}