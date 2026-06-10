# Katkı Rehberi · Contributing

KAPiTaN OS'a katkıda bulunduğunuz için teşekkürler. Bu proje GPL-3.0-only
lisanslıdır; katkılarınız da aynı lisansla dağıtılır.

## Geliştirme ortamı

- **Node.js** ≥ 20, **npm** ≥ 10
- **bats** (kabuk testleri): `brew install bats-core` ya da `apt-get install bats`
- **jq** (geliştirme sırasında komut kataloğunu yüklemek için)

```bash
npm install
npm run ci   # check:commands + validate:commands + test:shell + build:website
```

## Komut kataloğu — tek doğruluk kaynağı (SSOT)

Komut kataloğu **iki** dosyadan üretilir:

| Dosya | Sahiplik |
|-------|----------|
| `packages/commands/commands.json` | **Dil**: id'ler, Türkçe takma adlar, POSIX eşlemesi |
| `packages/commands/implemented-overlay.json` | **Durum**: hangi komutlar açık (`implemented`), `path_guard` |

`packages/kapitan-sh/data/commands.json` ve ISO kopyası **otomatik üretilir** —
elle düzenlemeyin. Bir komutu açmak için:

```bash
# 1) implemented-overlay.json içindeki "implemented" listesine id'yi ekleyin
# 2) yeniden üretin:
npm run generate:commands
# 3) üretilen dosyaları commit'leyin
```

CI'daki `check:commands` adımı, üretilen dosya SSOT + overlay ile uyumsuzsa
(drift) başarısız olur.

## Kabuk (kapitan-sh)

- `bash 3.2` uyumlu kalın (macOS varsayılan bash'i).
- Güvenlik: dağıtım katmanı varsayılan olarak `$(...)` / `` `...` `` reddeder
  (bkz. `packages/kapitan-sh/README.md` → "Güvenlik · kabuk modu"). Bu davranışı
  zayıflatan değişiklikler test ile gerekçelendirilmelidir.
- Her davranış değişikliği için **bats testi** ekleyin
  (`packages/kapitan-sh/tests/`). Yeni testler `tests/test_*.bats` desenini izler.

```bash
npm run test:shell        # tüm bats testleri
bats packages/kapitan-sh/tests/test_safety.bats   # tek dosya
```

## Commit ve PR

- **Conventional Commits**: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`,
  `chore:`, `ci:`, `perf:`.
- PR açmadan önce `npm run ci` yeşil olmalı.
- Pazarlama iddiaları **dürüst** olmalı: uygulanmamış bir özelliği bugünkü
  gerçekmiş gibi sunmayın — `Hedef:` / `planlanan` olarak etiketleyin ya da
  `SimulationBadge` kullanın.

## Davranış kuralları

Bu proje [Davranış Kuralları](CODE_OF_CONDUCT.md)'na tabidir.

## Güvenlik

Güvenlik açıklarını herkese açık issue olarak **açmayın** — bkz.
[SECURITY.md](SECURITY.md).
