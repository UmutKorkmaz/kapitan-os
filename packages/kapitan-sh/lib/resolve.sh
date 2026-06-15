#!/bin/bash
# Command resolution and validation

resolve_command() {
  local cmd="$1"
  which "$cmd" > /dev/null 2>&1 && echo "$cmd" || return 1
}

load_command_registry() {
  # Load Turkish command mappings
  source /etc/kapitan-sh/commands.conf 2>/dev/null || true
}
