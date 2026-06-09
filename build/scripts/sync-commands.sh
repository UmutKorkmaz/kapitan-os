#!/usr/bin/env bash
# Back-compat wrapper — prefer sync-image-assets.sh (F1).
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec bash "${SCRIPT_DIR}/sync-image-assets.sh" "$@"