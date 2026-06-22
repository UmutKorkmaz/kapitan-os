#!/bin/bash
set -euo pipefail

EDITIONS="bar ofis gelistirici"
REPO_ROOT="/workspace"
ARTIFACTS="${REPO_ROOT}/build/artifacts"
VERSION="0.1.0-alpha"

mkdir -p "$ARTIFACTS"

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║   KAPiTaN OS — Building All Edition ISOs                     ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo

# Install npm deps for validate:commands
cd "$REPO_ROOT"
npm install --quiet 2>/dev/null || true

for edition in $EDITIONS; do
  echo "━━━ Building: $edition edition ━━━"
  export KAPITAN_EDITION="$edition"
  
  ISO_NAME="kapitan-${edition}-v${VERSION}-amd64.iso"
  
  cd "${REPO_ROOT}/build/live-build"
  
  # Clean previous build
  lb clean 2>/dev/null || true
  rm -rf .build/ chroot/ binary/ cache/
  
  # Sync assets
  bash "${REPO_ROOT}/build/scripts/sync-image-assets.sh"
  
  # Configure
  bash auto/config
  
  # Build
  echo "  Building ISO (this takes 10-30 minutes per edition)..."
  lb build 2>&1 | tail -3
  
  # Copy result
  if [ -f "live-image-amd64.hybrid.iso" ]; then
    mv "live-image-amd64.hybrid.iso" "${ARTIFACTS}/${ISO_NAME}"
    sha256sum "${ARTIFACTS}/${ISO_NAME}" > "${ARTIFACTS}/${ISO_NAME}.sha256"
    echo "  ✓ ${ISO_NAME} ($(du -h "${ARTIFACTS}/${ISO_NAME}" | cut -f1))"
  else
    echo "  ✗ Build failed for ${edition}"
  fi
  
  echo
done

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║   Build Complete                                             ║"
echo "╚══════════════════════════════════════════════════════════════╝"
ls -lh "${ARTIFACTS}"/*.iso 2>/dev/null || echo "No ISOs produced"
