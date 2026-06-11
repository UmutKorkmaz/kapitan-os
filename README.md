# KAPiTaN OS

**Türkçe komut katmanlı, açık kaynak Linux dağıtımı.**

KAPiTaN OS, terminal komutlarını doğal Türkçe ile kullanılabilir kılan bir işletim sistemidir. Geliştirici, Ofis ve Bar sürümleriyle Debian 12 tabanlı bir dağıtım hedeflenir.

**Sürüm:** `0.1.0-alpha` (F0 tamamlandı · F1 ISO iskelet devam ediyor)

## Monorepo yapısı

```
kapitan-os/
├── package.json              # npm workspaces kökü
├── pnpm-workspace.yaml       # pnpm uyumluluğu
├── Makefile                  # make validate | test-shell | ci
├── website/                  # Vite + React pazarlama sitesi
├── packages/
│   ├── commands/             # commands.json — tek doğruluk kaynağı (SSOT)
│   └── kapitan-sh/           # Türkçe komut kabuğu (bash MVP)
├── distro/                   # OS imajı overlay ve locale
├── build/                    # live-build ve ISO hattı
└── docs/
    ├── command-plan.md       # Komut kataloğu (insan-okunur kaynak)
    └── KAPiTaN OS BUILD PLAN.md
```

> **Not:** Kök `src/` ve `index.html` eski prototiptir; aktif site `website/` paketindedir (kaldırılacak).

## Hızlı başlangıç

```bash
# Bağımlılıkları yükle (npm veya pnpm)
npm install
# veya: pnpm install

# Komut kataloğunu doğrula
make validate
# veya: npm run validate:commands

# Kabuk testleri
make test-shell

# Site derlemesi
make build-website

# Tam CI hattı
make ci

# ISO iskelet (Debian 12 amd64 gerekir — macOS'ta VM veya GitHub Actions)
make sync-iso-assets   # kapitan-sh + overlay → live-build context
make dry-run-iso       # önkoşul kontrolü
make build-iso         # kapitan-v0.1.0-alpha-amd64.iso üret
make qemu-smoke        # ISO'yu QEMU'da aç (smoke raporu şablonu)
```

### Gereksinimler

- **Node.js** ≥ 20
- **npm** ≥ 10 veya **pnpm** ≥ 9
- **bats** (kabuk testleri için: `make test-shell`)

## Belgeler

| Belge | Açıklama |
|-------|----------|
| [KAPiTaN OS BUILD PLAN.md](docs/KAPiTaN%20OS%20BUILD%20PLAN.md) | Master inşa planı — fazlar, kabul kriterleri, mimari |
| [command-plan.md](docs/command-plan.md) | 66 komutluk Türkçe alias kataloğu (7 grup) |

F0 (Temel) fazı için ayrıntılı hedefler: **Bölüm 7 — Faz 1: Temel** (`docs/KAPiTaN OS BUILD PLAN.md`).

## Lisans

GPL-3.0-only — tam metin için bkz. [`LICENSE`](LICENSE).