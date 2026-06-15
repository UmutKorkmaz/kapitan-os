#!/usr/bin/env bats
# test_model.bats — Qwen3-4B manifest validation and cache logic.
#
# These tests are intentionally offline: they validate the manifest structure
# and the cache-directory / already-cached short-circuit, but do NOT download
# the 2.5 GB model. Network download is exercised in a separate CI stage.

setup() {
  AI_ROOT="$(cd "$(dirname "$BATS_TEST_DIRNAME")" && pwd)"
  # Override HOME so all cache paths go to the temp dir.
  export HOME="$BATS_TEST_TMPDIR"
  # Source risk.sh so KAPITAN_AI_MODEL_PATH / CACHE vars are available.
  source "${AI_ROOT}/lib/risk.sh"
  MODEL_CACHE="${HOME}/.cache/kapitan-ai/models"
}

# ── manifest structure ────────────────────────────────────────────────────────

@test "manifest file exists and is readable" {
  local manifest="${AI_ROOT}/models/qwen3-4b.manifest.json"
  [ -f "$manifest" ]
  [ -r "$manifest" ]
}

@test "manifest id is qwen3-4b" {
  local manifest="${AI_ROOT}/models/qwen3-4b.manifest.json"
  grep -q '"id": "qwen3-4b"' "$manifest"
}

@test "manifest license is Apache-2.0" {
  local manifest="${AI_ROOT}/models/qwen3-4b.manifest.json"
  grep -q '"license": "Apache-2.0"' "$manifest"
}

@test "manifest contains Turkish language support" {
  local manifest="${AI_ROOT}/models/qwen3-4b.manifest.json"
  grep -q '"tr"' "$manifest"
}

@test "manifest contains minimum RAM requirement of 4 GB" {
  local manifest="${AI_ROOT}/models/qwen3-4b.manifest.json"
  grep -q '"min_ram_gb": 4' "$manifest"
}

@test "manifest download_url points to HuggingFace" {
  local manifest="${AI_ROOT}/models/qwen3-4b.manifest.json"
  grep -q '"download_url": "https://huggingface.co/' "$manifest"
}

@test "manifest filename ends with .gguf" {
  local manifest="${AI_ROOT}/models/qwen3-4b.manifest.json"
  grep -q '"filename": ".*\.gguf"' "$manifest"
}

# ── cache directory logic ─────────────────────────────────────────────────────

@test "cache directory can be created under HOME" {
  mkdir -p "$MODEL_CACHE"
  [ -d "$MODEL_CACHE" ]
}

@test "KAPITAN_AI_MODEL_CACHE resolves under HOME" {
  [[ "$KAPITAN_AI_MODEL_CACHE" == "${HOME}/.cache/kapitan-ai/models" ]]
}

@test "KAPITAN_AI_MODEL_PATH resolves to the expected filename" {
  [[ "$KAPITAN_AI_MODEL_PATH" == "${HOME}/.cache/kapitan-ai/models/qwen3-4b-q4_k_m.gguf" ]]
}

# ── already-cached short-circuit ─────────────────────────────────────────────

@test "model kur returns 0 immediately when model already cached" {
  local AI="${AI_ROOT}/kapitan-ai"
  # Plant a fake model file in the temp cache directory.
  mkdir -p "$MODEL_CACHE"
  touch "${MODEL_CACHE}/Qwen3.5-4B-Revised-q4_k_m.gguf"

  run "$AI" model kur
  [ "$status" -eq 0 ]
  [[ "$output" == *"zaten önbellekte"* ]]
}

# ── manifest absence guard ────────────────────────────────────────────────────

@test "model kur fails gracefully when manifest is missing" {
  local fake_root="${BATS_TEST_TMPDIR}/fake_ai"
  local fake_lib="${fake_root}/lib"
  mkdir -p "$fake_lib"
  # Copy script + lib but deliberately omit models/ directory.
  cp "${AI_ROOT}/kapitan-ai" "${fake_root}/kapitan-ai"
  cp "${AI_ROOT}/lib/risk.sh" "${fake_lib}/risk.sh"
  chmod +x "${fake_root}/kapitan-ai"

  run "${fake_root}/kapitan-ai" model kur
  [ "$status" -eq 1 ]
  [[ "$output" == *"manifest bulunamadı"* ]]
}
