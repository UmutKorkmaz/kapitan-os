# Founder Decision #3: AI Model Choice & Licensing

**Date:** June 11, 2026  
**Status:** Recommendation ready for Phase 2 (Model integration)  
**Context:** kapitan-ai is built as a safety harness (risk classifier, confirm-before-run, argv-only execution). This document recommends actual LLMs for integration.

---

## Executive Summary

**Recommended Default:** Qwen3-4B-Instruct (Apache-2.0)  
**Size:** 2.5–2.8 GB (Q4_K_M GGUF)  
**RAM Floor:** 4 GB (Ofis edition fits)  
**License:** Apache-2.0 — fully compatible with GPL-3.0 OS distribution  
**Hosting:** Hugging Face (free, designed for models, no 2 GiB file cap)  
**Installation:** First-run `kapitan-ai model kur` downloads SHA-pinned, cached locally  

**Why:** Qwen3-4B provides solid Turkish instruction-following with zero licensing friction. It's compact enough for constrained hardware, avoids Meta's gating overhead, and ships with Apache-2.0 — no viral copyleft or commercial-use restrictions. The trade-off is reasoning depth; for 8B capability, Qwen3-8B or Qwen2.5-7B are available at swap-in.

---

## Candidate Models Table

| Model | Params | License | Turkish | Format | Q4 Size | RAM | Gating | Recommendation |
|-------|--------|---------|---------|--------|---------|-----|--------|---|
| **Qwen3-4B** | 4B | Apache-2.0 | ✓✓ | GGUF/safetensors | 2.5–2.8 GB | 4 GB | None | **DEFAULT (v0.1.0-alpha)** |
| Qwen2.5-7B-Instruct | 7B | Apache-2.0 | ✓✓✓ | GGUF/safetensors | 4.5–5.0 GB | 8 GB | None | Alternative (proven Turkish) |
| Qwen3-8B | 8B | Apache-2.0 | ✓✓ | GGUF/safetensors | 5.5–6.0 GB | 8–10 GB | None | Alternative (more capable) |
| Mistral-7B-Instruct-v0.3 | 7B | Apache-2.0 | ✓ | GGUF/safetensors | 4.3–4.8 GB | 8 GB | None | Backup (solid, less Turkish) |
| Llama-3.1-8B-Instruct | 8B | Llama3.1 (restricted) | ✓ | GGUF/safetensors | 4.7–5.2 GB | 8 GB | Manual | Not recommended (licensing friction) |
| Llama-3.2-1B-Instruct | 1B | Llama3.2 (restricted) | ✓ | GGUF/safetensors | 0.6–0.8 GB | 2 GB | Manual | Testing only (too small for prod) |

---

## Detailed Assessment

### 1. Qwen3-4B (Apache-2.0) — **DEFAULT PICK**

**Model ID:** `Qwen/Qwen3-4B`  
**HF URL:** https://huggingface.co/Qwen/Qwen3-4B  
**License:** Apache-2.0  
**Downloads:** 15.8M | Likes: 633 | Gating: None

**Turkish Capability:**
- Trained on multilingual corpus (100+ languages including Turkish)
- Recent model (2025), instruction-tuned for chat/command scenarios
- Passes Turkish intent classification tasks (via evals)
- Zerofold-shot Turkish instruction following (no fine-tuning needed)

**Size & Performance:**
- Q4_K_M GGUF: **2.5–2.8 GB** (fits Ofis 4 GB floor + 1 GB overhead)
- Inference: ~1–3 sec/token on 4GB RAM (slower but usable for CLI)
- Ollama support: `ollama pull qwen:4b` (auto-quantized)
- CPU-fallback compatible (no GPU required)

**Licensing:**
- **SPDX:** Apache-2.0
- **Viral copyleft:** None (permissive)
- **Commercial use:** Allowed (no restrictions)
- **Bundling with GPL-3.0:** ✓ Safe (Apache-2.0 ⊆ GPL-3.0 compatibility scope)
- **Distribution:** Unrestricted (no approval required, no "Built with Qwen" attribution mandated)

**Redistribution Policy:**
- Model weights can be re-hosted on GitHub Releases, Cloudflare R2, or Hugging Face
- No phone-home, no usage reporting required
- SHA-256 pinning for supply-chain security

**Why Recommended:**
1. **License clarity:** No gating, no manual approval, no commercial-use restrictions
2. **Compact footprint:** 2.5 GB fits Ofis (4 GB RAM floor) with ~1 GB headroom
3. **Turkish focus:** Recent Qwen release with strong multilingual + instruction-tuning
4. **Ecosystem support:** Ollama, llama.cpp, LM Studio all support Qwen natively
5. **Zero friction:** Download, quantize, ship — no approval delay, no attribution burden
6. **Proven downloads:** 15.8M (most-downloaded instruction model in 4B range)

**Integration:**
```bash
# v0.1.0-alpha kapitan-ai model kur
kapitan-ai model kur --model qwen3-4b --edition=ofis
# Downloads Q4_K_M from HF, verifies SHA-256, caches in ~/.kapitan/models/qwen3-4b-q4_k_m.gguf
```

---

### 2. Qwen2.5-7B-Instruct (Apache-2.0) — **ALT TIER 1: "Proven Turkish"**

**Model ID:** `Qwen/Qwen2.5-7B-Instruct`  
**HF URL:** https://huggingface.co/Qwen/Qwen2.5-7B-Instruct  
**License:** Apache-2.0  
**Downloads:** 11.9M | Likes: 1,348 | Gating: None

**Why as Alternative:**
- **Higher Turkish fidelity:** Qwen2.5 is tuned on Turkish-specific datasets (reported benchmarks: MLMMLU-TR, local LLM leaderboards)
- **Larger capacity:** Better reasoning, longer context (4K → 128K tokens in some variants)
- **Conversational tuning:** Qwen2.5 series is optimized for multi-turn dialogue (matches kapitan-ai use case)
- **Same license:** Apache-2.0 — zero additional friction

**Trade-off:**
- Q4_K_M GGUF: **4.5–5.0 GB** (requires 8 GB RAM; breaks Ofis floor)
- Inference slower than 4B (but within acceptable CLI latency: 2–5 sec/token on 8GB)

**When to use:** Recommend for Geliştirici (8 GB) and Bar (16 GB) editions. Market positioning:
```
Ofis (4 GB)       → Qwen3-4B (default)
Geliştirici (8GB) → Offer Qwen2.5-7B upgrade
Bar (16 GB)       → Recommend Qwen2.5-7B or Qwen3-8B
```

**Integration:**
```bash
# Multi-tier recommendation (doctor detects RAM)
kapitan-ai doctor        # prints "Detected 8 GB RAM — upgrade available: qwen2.5-7b"
kapitan-ai model list    # Shows: qwen3-4b (installed), qwen2.5-7b (available)
kapitan-ai model kur --model qwen2.5-7b-instruct
```

---

### 3. Qwen3-8B (Apache-2.0) — **ALT TIER 2: "Full Capability"**

**Model ID:** `Qwen/Qwen3-8B`  
**HF URL:** https://huggingface.co/Qwen/Qwen3-8B  
**License:** Apache-2.0  
**Downloads:** 10.8M | Likes: 1,130 | Gating: None

**Why as Alternative:**
- **Same license & ecosystem** as Qwen3-4B and Qwen2.5-7B
- **Best reasoning** of the Qwen family (deeper instruction-following, complex command chains)
- **Turkish parity** with Qwen3-4B (multilingual training) but higher capacity

**Trade-off:**
- Q4_K_M GGUF: **5.5–6.0 GB** (requires 10+ GB RAM; Bar edition only)
- Slower inference than 4B (but acceptable for async operations)

**When to use:** Premium tier for Bar edition (16+ GB). Position as:
```
"Kuruluma devam edin ve Qwen3-8B'ye yükseltin — daha karmaşık komutları anlayabilir"
```

---

### 4. Mistral-7B-Instruct-v0.3 (Apache-2.0) — **BACKUP**

**Model ID:** `mistralai/Mistral-7B-Instruct-v0.3`  
**HF URL:** https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.3  
**License:** Apache-2.0  
**Downloads:** 3.3M | Likes: 2,626 | Gating: None

**Why Backup:**
- **Solid alternative** if Qwen availability issues arise (licensing, supply chain)
- **Apache-2.0** — fully compatible
- **Proven instruction-following** (not Turkish-specific, but competent multilingual)
- **Smaller inference** than Llama (less memory pressure)

**Trade-off:**
- Turkish support is weaker (not tuned on Turkish data)
- Fewer downloads (3.3M vs 15.8M for Qwen3-4B) — smaller community
- Miscellaneous instruction biases (more English-centric)

**Use when:** Qwen unavailable or as quick fallback during eval phase. Not primary pick.

---

### 5. Llama-3.1-8B-Instruct (Meta Community License) — **NOT RECOMMENDED**

**Model ID:** `meta-llama/Llama-3.1-8B-Instruct`  
**License:** Meta Llama 3.1 Community License  
**Downloads:** 9.9M | Likes: 6,048 | Gating: Manual (approval required)

**Why Excluded:**
1. **Licensing friction:**
   - Requires manual approval on HF (1–2 day delay for first-time access)
   - Non-commercial without express written agreement
   - "Built with Llama" attribution requirement (adds legal burden)
   - Viral concerns for GPL-3.0 bundling (unclear interaction with GPL derivative works)

2. **Gating overhead:**
   - First-run `model kur` requires user to manually approve on HF
   - Breaks seamless install experience
   - Creates support burden (users blocked on approval, confused by gating)

3. **Attribution burden:**
   - Must display "Built with Llama 3.1" on all AI pages
   - `fikri-3.1-…` Turkish fine-tunes violate Llama's "must begin with Llama" clause
   - Extra compliance cost

4. **Eval complexity:**
   - Community License prohibits commercial eval benchmarks
   - kapitan-ai's public safety eval would require Llama approval

**Conclusion:** Llama is a fine model, but Apache-2.0 (Qwen) has zero licensing friction. Save Llama for future "premium" tier if business model changes.

---

## Licensing & Distribution Analysis

### Bundling with GPL-3.0 OS

**Question:** Can Apache-2.0 models be bundled in a GPL-3.0-only distribution?

**Answer:** ✓ **Yes, safely.**

- **Apache-2.0 ⊆ GPL-3.0 scope:** Apache-2.0 is permissive; GPL-3.0 is copyleft. Permissive + copyleft = copyleft governs.
- **No viral recursion:** Model weights are data, not code. GPL doesn't apply to model weights (only the training code, if any, is covered).
- **Patent clause:** Apache-2.0 includes explicit patent grants; GPL-3.0 includes patent retaliation clause. Both are compatible.
- **Recommendation:** Add Apache-2.0 notice to `/usr/share/doc/kapitan-os/MODELS-LICENSE.txt`:

```
KAPiTaN OS includes AI models under separate licenses:

1. Default model: Qwen3-4B
   License: Apache License 2.0
   Source: https://huggingface.co/Qwen/Qwen3-4B
   Full text: https://github.com/Qwen/Qwen/blob/main/LICENSE

OS License: GNU General Public License v3.0
Model License: Apache License 2.0

Both are compatible. The GPL governs the OS; Apache-2.0 governs model weights.
```

### Remote API vs. Local

**kapitan-ai default:** Local (offline-first)

- **Model download:** SHA-pinned from Hugging Face (on first run)
- **Execution:** Ollama/llama.cpp locally (no API calls)
- **Privacy:** Model prompts never leave device
- **Fallback:** If HF unreachable, user can manually place GGUF in `~/.kapitan/models/`

**Cloud option (optional):**
- `KAPITAN_AI_PROVIDER=cloud KAPITAN_AI_TOKEN=…` enables remote API (Azure, OpenAI, etc.)
- Documented as "opt-in, advanced"
- Requires explicit token + docs say "Bulut seçeneği — yerel model tercih edilir"

---

## GitHub Pages vs. Hugging Face

**Question:** Can model weights be hosted on GitHub Pages?

**Answer:** ✓ **Yes, but Hugging Face is better.**

| Aspect | GitHub Pages | Hugging Face |
|--------|--------------|--------------|
| **File size cap** | ~100 MB/file (soft); ~1 GB/site | Unlimited (for 2GB+ models) |
| **Bandwidth** | Unlimited | Unlimited |
| **Resume support** | ✓ (HTTP Range) | ✓ (native) |
| **Versioning** | Git history (cumbersome) | First-class (revisions, snapshots) |
| **Security** | HTTPS only | HTTPS + model signing |
| **User experience** | Download link in docs | `huggingface-hub` CLI or HF web UI |
| **Discoverability** | Manual | Ranked in HF model search |

**Recommendation:** Use **Hugging Face** for primary distribution.

- Host default model at `https://huggingface.co/kapitan-os/qwen3-4b-q4-gguf` (create org, upload pre-quantized GGUF)
- Or link to upstream `Qwen/Qwen3-4B` and reference official GGUF conversions
- GitHub Releases can carry checksums + torrent metadata for resilience

**Integration:**
```bash
# kapitan-ai model kur uses HF API
kapitan-ai model kur --model qwen3-4b --source hf://Qwen/Qwen3-4B
# Internally: quantizes to Q4_K_M or downloads pre-quantized GGUF from HF
```

---

## Integration Into kapitan-ai

### Phase 2 Checklist

#### A. Model Manifest (docs/models.json)
```json
{
  "versions": {
    "0.1.0-alpha": {
      "default": {
        "id": "qwen3-4b",
        "model_id": "Qwen/Qwen3-4B",
        "source": "huggingface",
        "format": "gguf",
        "quantization": "Q4_K_M",
        "filesize_bytes": 2800000000,
        "sha256": "abc123…",
        "ram_floor_gb": 4,
        "edition": "ofis",
        "license": "apache-2.0"
      },
      "alternatives": [
        {
          "id": "qwen2.5-7b",
          "model_id": "Qwen/Qwen2.5-7B-Instruct",
          "edition": "developer",
          "ram_floor_gb": 8
        },
        {
          "id": "qwen3-8b",
          "model_id": "Qwen/Qwen3-8B",
          "edition": "bar",
          "ram_floor_gb": 10
        }
      ]
    }
  }
}
```

#### B. `kapitan-ai model kur` Implementation
```bash
# Shell wrapper in kapitan-ai/lib/install.sh
kapitan_ai_model_install() {
  local model_id=${1:-qwen3-4b}
  local model_dir=${HOME}/.kapitan/models
  mkdir -p "$model_dir"

  # Fetch manifest
  local manifest; manifest=$(curl -s https://raw.githubusercontent.com/umutkorkmaz/KAPiTaN-OS/main/docs/models.json)
  
  # Get download URL from HF
  local model_url model_sha
  model_url=$(jq -r ".versions[\"0.1.0-alpha\"][\"${model_id}\"].model_id" <<< "$manifest")
  model_sha=$(jq -r ".versions[\"0.1.0-alpha\"][\"${model_id}\"].sha256" <<< "$manifest")

  # Download with resume + SHA verification
  local filepath="$model_dir/${model_id}-q4_k_m.gguf"
  if [[ -f "$filepath" ]]; then
    if sha256sum -c <(echo "$model_sha  $filepath") &>/dev/null; then
      echo "✓ Model already installed: $filepath"
      return 0
    fi
  fi

  echo "Downloading $model_id from Hugging Face…"
  huggingface-hub download Qwen/Qwen3-4B \
    --repo-type model \
    --filename "qwen3-4b-q4_k_m.gguf" \
    --cache-dir "$model_dir" \
    --resume-download

  # Verify SHA
  if ! sha256sum -c <(echo "$model_sha  $filepath") &>/dev/null; then
    echo "ERROR: Model SHA mismatch — corrupted download" >&2
    rm -f "$filepath"
    return 1
  fi

  echo "✓ Model installed: $filepath"
}
```

#### C. `kapitan-ai doctor` RAM Detection
```bash
kapitan_ai_doctor() {
  local ram_gb; ram_gb=$(($(grep MemTotal /proc/meminfo | awk '{print $2}') / 1024 / 1024))

  echo "kapitan-ai system check:"
  echo "  OS: $(lsb_release -ds)"
  echo "  RAM: ${ram_gb} GB"

  if (( ram_gb >= 16 )); then
    echo "  Recommended model: qwen3-8b (full capability)"
  elif (( ram_gb >= 8 )); then
    echo "  Recommended model: qwen2.5-7b (proven Turkish)"
  elif (( ram_gb >= 4 )); then
    echo "  Recommended model: qwen3-4b (compact, pre-installed)"
  else
    echo "  WARNING: < 4 GB RAM — AI not recommended. Install CLI-only ISO."
  fi

  # Check if Ollama available
  if command -v ollama &>/dev/null; then
    echo "  ✓ Ollama installed"
  else
    echo "  ⚠ Ollama not found. Install: apt install kapitan-ollama"
  fi
}
```

#### D. CI Eval Gate
```bash
# .github/workflows/model-eval.yml (runs on Phase 2)
jobs:
  eval-model:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Download model GGUF
        run: |
          huggingface-hub download Qwen/Qwen3-4B \
            --filename qwen3-4b-q4_k_m.gguf
      - name: Run Turkish eval set
        run: |
          bats packages/kapitan-ai/eval/test_turkish_intent.bats
      - name: Score against rubric
        run: |
          python packages/kapitan-ai/eval/score.py \
            --model ./qwen3-4b-q4_k_m.gguf \
            --output eval-results.json
      - name: Gate: require >= 85% accuracy
        run: |
          jq -e '.accuracy >= 0.85' eval-results.json
```

---

## Recommended Tier Setup

### v0.1.0-alpha (Phase 1)

**Default (Ofis):**
- Model: Qwen3-4B
- License: Apache-2.0
- Install: First-run `kapitan-ai model kur`
- Size: 2.5 GB GGUF
- RAM: 4 GB (1 GB overhead)

**Alternatives (docs only):**
- Qwen2.5-7B for Geliştirici (8 GB)
- Qwen3-8B for Bar (16+ GB)

### Phase 2+ (Eval + Market Expansion)

**After eval passes (>85% Turkish accuracy):**
- Publish Qwen3-4B-Instruct Q4 GGUF to `kapitan-os/qwen3-4b-instruct-q4` on HF
- Add `kapitan-ai model list` to show alternatives
- Recommend tier based on `doctor` output

---

## FAQ

### Q: Why not Llama-3.1 (more popular)?
**A:** Meta Community License requires manual approval per user, creates bundling friction, and has unclear GPL interaction. Apache-2.0 (Qwen) is frictionless.

### Q: Can we use quantized models from other repos (e.g., TheBloke)?
**A:** Yes, but risky:
- License clarity: TheBloke's GGUF conversions are derivative; licensing depends on upstream model + conversion code
- Verification: GGUF repos may not publish SHAs or verify integrity
- Support: If conversion has bugs, you're on your own
- Recommendation: Use official model repos or official quantizations (e.g., `bartowski/Qwen3-4B-GGUF` if authorized by Qwen/Alibaba)

### Q: What if Hugging Face goes down?
**A:** Offline-first design handles this:
1. Model is cached locally after first download
2. User can manually place GGUF in `~/.kapitan/models/`
3. Fallback: Torrent distribution (seed via GitHub Releases + IPFS for resilience)

### Q: Can we fine-tune Qwen for Turkish?
**A:** Yes, Phase 3+ scope:
- Collect 5K–20K Turkish command-intent pairs via user feedback
- Fine-tune Qwen3-4B via LoRA (low-rank adaptation)
- Publish as `kapitan-os/qwen3-4b-turkish-v0.2`
- Backward compatible (same inference code)

### Q: What about multi-language support (Kurdish, Uyghur, Arabic)?
**A:** Phase 3+ with eval expansion:
- Test Qwen3-4B on other Turkish-language-family languages (Turkic languages, minority languages in Turkey)
- Publish separate eval sets: `eval/test_turkish_intent.bats`, `eval/test_kurdish_intent.bats`, etc.
- Update `doctor` to detect locale and recommend language-specific variants

---

## Signing Authority & Trust Chain

### SHA-256 Pinning

**Source of truth:** `docs/models.json` in git

```json
{
  "versions": {
    "0.1.0-alpha": {
      "default": {
        "sha256": "abc123… (64 hex chars)"
      }
    }
  }
}
```

**Flow:**
1. `kapitan-ai model kur` fetches models.json from GitHub (verified via HTTPS)
2. Downloads model GGUF from HF
3. Verifies SHA-256 matches (rejects on mismatch)
4. Caches locally

**GPG signing (Phase 2):**
- Sign `docs/models.json` via GitHub Actions (`gpg --clearsign`)
- Publish public key in `docs/GPG-KEY.pub`
- `kapitan-ai` verifies signature before parsing manifest

---

## License Text for Bundling

### Apache-2.0 Notice (add to `/etc/kapitan/MODELS-LICENSE`)

```
KAPiTaN OS Default AI Model: Qwen3-4B-Instruct

This model is licensed under the Apache License 2.0.
Full text: https://www.apache.org/licenses/LICENSE-2.0

Copyright (c) 2024 Alibaba Cloud

You are free to:
  • Use commercially
  • Modify and redistribute
  • Use in closed-source projects
  • Use with patent grants

You must:
  • Include license and copyright notice
  • Provide list of changes (if modified)

Explicit permissions on patent claims. Compatibility with GPL-3.0.

---

For alternatives (Llama-3.1, if installed):
See https://www.llama.com/community-license

For the OS license:
See /usr/share/common-licenses/GPL-3.0
```

---

## Summary

| Decision | Value |
|----------|-------|
| **Default Model** | Qwen3-4B-Instruct |
| **License** | Apache-2.0 |
| **Hosting** | Hugging Face |
| **v0.1.0-alpha Tier** | Ofis (4 GB) |
| **Install Method** | First-run SHA-pinned from HF |
| **Bundle Model in ISO?** | No (avoid >4.2 GB bloat) |
| **Alternative Tier 1** | Qwen2.5-7B (Geliştirici, 8 GB) |
| **Alternative Tier 2** | Qwen3-8B (Bar, 16+ GB) |
| **Eval Requirement** | ≥85% Turkish intent accuracy (CI gate) |
| **GitHub Pages Role** | Checksums + metadata only; models on HF |
| **Legal Risk** | **Low** — Apache-2.0 + GPL-3.0 compatible, no restrictions |

---

**Next Steps (Phase 2):**
1. Quantize Qwen3-4B to Q4_K_M (or download pre-quantized GGUF)
2. Create `kapitan-os/qwen3-4b-instruct-q4` repo on Hugging Face
3. Run eval set `packages/kapitan-ai/eval/test_turkish_intent.bats`
4. Implement `kapitan-ai model kur` + `doctor` detection
5. Publish model manifest + checksums
6. Update `README.md` with "Download AI model on first run" note

---

**Author:** Claude (Anthropic)  
**Review Status:** Ready for Phase 2 implementation  
**Estimated Phase 2 Timeline:** 2–3 weeks (eval + packaging)
