#!/bin/bash
# Command dispatcher

dispatch_command() {
  local cmd="$1"
  shift
  
  case "$cmd" in
    *)
      echo "kapitan-sh: komut yok: $cmd" >&2
      return 127
      ;;
  esac
}
