#!/usr/bin/env bash
# Shared setup for kapitan-sh bats tests.

_KAPITAN_SH_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

setup() {
  export KAPITAN_COMMANDS_JSON="${BATS_TEST_DIRNAME}/fixtures/commands.min.json"
  export KAPITAN_DIL="ikili"
  export KAPITAN_SH_ROOT="${_KAPITAN_SH_ROOT}"

  # shellcheck disable=SC1091
  source "${_KAPITAN_SH_ROOT}/lib/resolve.sh"
  kapitan_load_registry

  # Export functions so `run` subshells can invoke them
  export -f kapitan_map_set kapitan_map_get kapitan_error kapitan_is_builtin
  export -f kapitan_path_guarded kapitan_load_registry kapitan_registry_lookup
  export -f kapitan_registry_is_known_posix kapitan_is_implemented
  export -f kapitan_resolve_token kapitan_resolve
}