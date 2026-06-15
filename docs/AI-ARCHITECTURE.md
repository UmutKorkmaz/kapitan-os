# KAPiTaN AI — Yerel Yapay Zekâ Mimarisi

## Genel Bakış (Overview)

**KAPiTaN AI** — yerel bir model (Ollama) ile çalışan, veri gizliliğine öncelik veren yapay zeka sistemi.

### Hedef (Objectives)
- 🔒 **Veri Gizliliği** — Verinin cihazda kalması (data stays on device)
- ☁️ **Bulut İsteğe Bağlı** — Cloud yalnızca opsiyonel (cloud is optional)
- 🚀 **Hızlı Yanıt** — Çevrimdışı yerel işleme (offline local processing)
- 🎯 **Türkçe Desteği** — Qwen3.5-4B Türkçe model desteği

## Mimari (Architecture)

```
┌─────────────────────────────────────────┐
│     KAPiTaN OS (Kullanıcı Sistemi)     │
├─────────────────────────────────────────┤
│  kapitan-ai (CLI Interface)             │
│  └── Türkçe komut çevirisi              │
├─────────────────────────────────────────┤
│  Ollama (Local LLM Runtime)             │
│  └── Qwen3.5-4B-Instruct Model         │
├─────────────────────────────────────────┤
│  Lokal Sistem Kaynakları (GPU/CPU)      │
│  └── 4-8 GB RAM (minimum)               │
└─────────────────────────────────────────┘
        ↕️ (Optional - Cloud Integration)
       ☁️ Cloud Services (İsteğe Bağlı)
```

## Model Özellikleri

### Qwen3.5-4B-Instruct
- **Boyut**: 2.71 GB (Q4_K_M GGUF)
- **Dil**: Türkçe, İngilizce, Çince, Arapça
- **Yetenekler**: Instruction-following, text-generation, coding
- **Gereksinim**: Minimum 4 GB RAM, önerilen 8 GB+

### Veri İşleme Akışı
```
Kullanıcı Komutu (Türkçe)
        ↓
kapitan-ai (İşleme)
        ↓
Ollama Runtime
        ↓
Qwen3.5-4B Model
        ↓
Yanıt (Türkçe)
        ↓
Kullanıcı Bilgisayarı
```

## Geliştirme Durumu

🚧 **Şu Anda Geliştirme Aşamasında** — Development Phase

### v0.1.0-alpha Status
- ✅ Model integration (Qwen3.5-4B)
- ✅ Turkish language support
- ✅ Command-line interface
- ⏳ Full feature completion (pending)
- ⏳ Production optimization

### v0.1.0-beta Planı
- [ ] Ollama integration improvements
- [ ] GPU acceleration support
- [ ] Extended Turkish NLP features
- [ ] Offline knowledge base
- [ ] Local caching and context

### v0.2.0 Hedefleri
- [ ] Multi-model support
- [ ] Fine-tuning capabilities
- [ ] Federated learning
- [ ] Privacy-first cloud sync

## Kurulum ve Kullanım

### Ön Koşullar
```bash
# Ollama yükleme
curl https://ollama.ai/install.sh | sh

# Qwen3.5-4B modelini indir
ollama pull qwen:3.5-instruct
```

### KAPiTaN AI Kurulumu
```bash
sudo apt install kapitan-ai
```

### Temel Kullanım
```bash
# Ollama servisi çalıştırılmalı
ollama serve

# Diğer terminalde kapitan-ai komutlarını kullanın
sor "Merhaba, ne yapabilirim?" 
```

## Veri Gizliliği

✅ **Tüm işleme yerel cihazda gerçekleşir**
- Hiçbir kişisel veri internet üzerinden gönderilmez
- Model güncellemeleri isteğe bağlı
- Cloud hizmetleri (opsiyonel) kullanıcı kontrolünde

## Performans

### Sistem Gereksinimleri
| Özellik | Minimum | Önerilen |
|---------|---------|----------|
| RAM | 4 GB | 8 GB+ |
| Storage | 3 GB | 10 GB+ |
| CPU | 2 cores | 4+ cores |
| GPU | Opsiyonel | Önerilen (NVIDIA/AMD) |

### Tahmini Yanıt Süresi
- GPU desteği: ~2-5 saniye
- CPU modu: ~5-15 saniye
- Modele bağlı olarak değişebilir

## Yapılandırma

Çevresel değişkenler:
```bash
OLLAMA_HOST=localhost:11434
KAPITAN_AI_MODEL=qwen:3.5-instruct
KAPITAN_AI_TIMEOUT=30
KAPITAN_AI_CACHE=/home/user/.cache/kapitan-ai
```

## Gelecek Yol Haritası

- 📅 Q3 2026: Ollama native integration
- 📅 Q4 2026: Multi-model support
- 📅 2027+: Advanced NLP features

## İletişim ve Destek

- **GitHub Issues**: https://github.com/UmutKorkmaz/kapitan-os/issues
- **Discussions**: Coming soon
- **Discord Community**: Coming soon

---

**KAPiTaN AI** — Sizin veriniz, sizin kontrolünüzde. Your data, your control.
