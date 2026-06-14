# AI Models Quick Reference

## One-Page Summary

### Default Tier (v0.1.0-alpha, Ofis)

| Attribute | Value |
|-----------|-------|
| **Model Name** | Qwen3-4B-Instruct |
| **Model ID** | `Qwen/Qwen3-4B` |
| **License** | Apache-2.0 ✓ |
| **Parameter Count** | 4 billion |
| **GGUF Q4_K_M Size** | 2.5–2.8 GB |
| **RAM Floor** | 4 GB (minimal headroom) |
| **Turkish Support** | ✓✓ (multilingual, instruction-tuned) |
| **Installation** | `kapitan-ai model kur` (first-run, HF download) |
| **GPU Required** | No (CPU-fallback compatible) |
| **Inference Speed** | ~1–3 sec/token on 4GB RAM |
| **Bundled in ISO?** | No (keeps ISO <4.2 GB) |
| **Licensing Friction** | None (no gating, no approval, permissive) |
| **Redistribution** | Fully allowed (Apache-2.0) |
| **HuggingFace Downloads** | 15.8M (most popular 4B instruction model) |

---

## Alternative Tiers

### Tier 1: Proven Turkish (Geliştirici, 8 GB RAM)

| Attribute | Value |
|-----------|-------|
| **Model Name** | Qwen2.5-7B-Instruct |
| **Model ID** | `Qwen/Qwen2.5-7B-Instruct` |
| **License** | Apache-2.0 ✓ |
| **GGUF Q4_K_M Size** | 4.5–5.0 GB |
| **RAM Floor** | 8 GB |
| **Turkish Support** | ✓✓✓ (tuned on Turkish benchmarks) |
| **Inference Speed** | ~2–5 sec/token on 8GB RAM |
| **HuggingFace Downloads** | 11.9M |
| **Why Choose** | Better Turkish accuracy than 4B; Geliştirici is target tier |

---

### Tier 2: Full Capability (Bar, 16+ GB RAM)

| Attribute | Value |
|-----------|-------|
| **Model Name** | Qwen3-8B |
| **Model ID** | `Qwen/Qwen3-8B` |
| **License** | Apache-2.0 ✓ |
| **GGUF Q4_K_M Size** | 5.5–6.0 GB |
| **RAM Floor** | 10 GB (8 GB minimum) |
| **Turkish Support** | ✓✓ (same as Qwen3-4B, more capacity) |
| **Inference Speed** | ~2–4 sec/token on 10GB RAM |
| **HuggingFace Downloads** | 10.8M |
| **Why Choose** | Best reasoning + Turkish; premium tier for Bar |

---

## Quick Decision Tree

```
Detected RAM?
├─ 2 GB   → Llama-3.2-1B (testing only, manual gating)
├─ 4 GB   → Qwen3-4B ✓ (DEFAULT, Apache-2.0)
├─ 8 GB   → Qwen2.5-7B (recommend upgrade, better Turkish)
└─ 16 GB  → Qwen3-8B (offer full-capability variant)
```

---

## Installation Command

```bash
# First-run (automatic during OS setup)
kapitan-ai model kur

# Manual (if needed)
kapitan-ai model kur --model qwen3-4b --force

# Check what's installed
kapitan-ai model list

# See system recommendations
kapitan-ai doctor
```

---

## Licensing

| Model | License | Gating | Commercial OK? | Bundling OK? | Notes |
|-------|---------|--------|---|---|---|
| Qwen3-4B | Apache-2.0 | None | ✓ | ✓ | **PREFERRED** |
| Qwen2.5-7B | Apache-2.0 | None | ✓ | ✓ | Tier 1 |
| Qwen3-8B | Apache-2.0 | None | ✓ | ✓ | Tier 2 |
| Mistral-7B | Apache-2.0 | None | ✓ | ✓ | Backup only |
| Llama-3.1-8B | Meta Community | Manual | ✗ (requires agreement) | ✗ (friction) | Not recommended |
| Llama-3.2-1B | Meta Community | Manual | ✗ (requires agreement) | ✗ (friction) | Testing only |

---

## File Hosting

**Primary:** Hugging Face (`huggingface.co/Qwen/Qwen3-4B`)
- Unlimited file size
- Resume-enabled downloads
- Free, designed for models

**Fallback Distribution:**
- GitHub Releases (checksums + torrent metadata)
- Cloudflare R2 (CDN for resilience)
- IPFS (peer-to-peer backup)

**NOT:** GitHub Pages (100 MB file cap too small for 2.5–6 GB models)

---

## SHA-256 Checksums

**Source of truth:** `docs/models.json` (Git-tracked, signed in Phase 2)

Example:
```json
{
  "versions": {
    "0.1.0-alpha": {
      "default": {
        "id": "qwen3-4b",
        "sha256": "abc123def456…" (64 hex chars)
      }
    }
  }
}
```

**Verification:**
```bash
sha256sum -c <(echo "abc123def456…  qwen3-4b-q4_k_m.gguf")
```

---

## FAQ

**Q: Why Apache-2.0 and not MIT?**  
A: The Qwen team chose Apache-2.0 (explicit patent grants, better for commercial use). We use their choice.

**Q: Can we use quantizations from other repos (e.g., TheBloke)?**  
A: Yes, but use official sources first (Qwen → HF official → authorized quantizers). Document licensing carefully.

**Q: Why no model bundling in ISO?**  
A: Qwen3-4B Q4 is 2.5 GB; ISO advertised as 4.2 GB max. Bundling breaks Ofis/Geliştirici editions. Download on first-run is frictionless.

**Q: What if Hugging Face goes down?**  
A: Model is cached locally after first download. Users can manually place GGUF in `~/.kapitan/models/`. Fallback: torrent distribution.

**Q: Can we fine-tune the model?**  
A: Yes, Phase 3+. Apache-2.0 permits fine-tuning and redistribution. LoRA fine-tuning on Turkish command-intent pairs is a natural next step.

**Q: Multi-language support (Kurdish, etc.)?**  
A: Phase 3+ with separate eval sets. Qwen3-4B's multilingual training should cover Turkic language families reasonably.

---

## Integration Checklist (Phase 2)

- [ ] Quantize Qwen3-4B to Q4_K_M GGUF (or download pre-quantized)
- [ ] Upload to Hugging Face (`kapitan-os/qwen3-4b-instruct-q4`)
- [ ] Generate SHA-256 checksums, publish in `docs/models.json`
- [ ] Implement `kapitan-ai model kur` + SHA verification
- [ ] Implement `kapitan-ai doctor` RAM detection + tier recommendation
- [ ] Write Turkish eval set (100–200 intent→command pairs)
- [ ] Run CI eval gate (require ≥85% accuracy)
- [ ] Update README with "Model downloads on first run"
- [ ] Test install flow on Ofis/Geliştirici/Bar editions
- [ ] Sign `docs/models.json` via GPG (optional Phase 2, mandatory Phase 3)

---

## Links

- **Qwen3-4B Official:** https://huggingface.co/Qwen/Qwen3-4B
- **Qwen2.5-7B Official:** https://huggingface.co/Qwen/Qwen2.5-7B-Instruct
- **Qwen3-8B Official:** https://huggingface.co/Qwen/Qwen3-8B
- **Apache-2.0 License:** https://www.apache.org/licenses/LICENSE-2.0
- **GPL-3.0 Compatibility (FSF):** https://www.gnu.org/licenses/gpl-faq.en.html#GPLCompatibility
- **Ollama (model runner):** https://ollama.ai
- **llama.cpp (alternative runner):** https://github.com/ggerganov/llama.cpp
