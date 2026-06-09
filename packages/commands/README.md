# `@kapitan/commands` — Komut Kayıt Defteri

`packages/commands/commands.json` KAPiTaN OS Türkçe kabuk alias'larının **tek doğruluk kaynağıdır** (SSOT). İnsan tarafından okunabilir kaynak: [`docs/command-plan.md`](../../docs/command-plan.md).

Bu paket şunları tüketir:

| Tüketici | Dosya | Amaç |
|----------|-------|------|
| **kapitan-sh** | `packages/kapitan-sh/generated/aliases.sh` | Çalışma zamanı alias çözümleme |
| **Komutlar.jsx** | `commands.json` | `/komutlar` referans tablosu |
| **CI** | `scripts/validate.mjs` | Şema, çakışma, `gir≠git` regresyonu |
| **Belgeler** | `docs/command-plan-sync.md` | JSON ↔ plan senkron görünümü |

## Dizin yapısı

```
packages/commands/
├── commands.json              # SSOT (66 komut, 7 grup)
├── schema.json                # JSON Schema (CI)
├── README.md
└── scripts/
    ├── generate-md.mjs        # → docs/command-plan-sync.md
    ├── generate-aliases.mjs   # → packages/kapitan-sh/generated/aliases.sh
    ├── validate.mjs           # CI doğrulama
    └── lib/
        ├── paths.mjs
        └── registry.mjs
```

## Hızlı başlangıç

```bash
# 1. Kayıt defterini doğrula (commands.json mevcut olduğunda)
node packages/commands/scripts/validate.mjs

# 2. Markdown senkron dosyası üret
node packages/commands/scripts/generate-md.mjs

# 3. kapitan-sh alias dosyası üret
node packages/commands/scripts/generate-aliases.mjs

# 4. CI senkron kontrolü (değişiklik yoksa exit 0)
node packages/commands/scripts/generate-md.mjs --check
node packages/commands/scripts/generate-aliases.mjs --check
node packages/commands/scripts/generate-md.mjs --compare-plan
```

## Doğrulama (`validate.mjs`)

CI ve yerel geliştirmede çalıştırın:

```bash
node packages/commands/scripts/validate.mjs
```

Beklenen kontroller (BUILD PLAN Bölüm 9):

- Tam **66** komut, **7** grup
- `turkish` / `short` / `id` benzersizliği
- **`cd` → `gir` / `gr`** — `git` alias'ı **yasak**
- Her komutta `description` ≥ 10 karakter
- `group` anahtarları `groups[]` ile eşleşir

Kritik regresyon:

```json
{ "posix": "cd", "turkish": "gir", "short": "gr" }
```

## Üretim komutları

### `generate-md.mjs`

`commands.json` içeriğinden `docs/command-plan-sync.md` üretir. Bu dosya **elle düzenlenmez**; PR'da JSON değişikliği ile birlikte yeniden üretilir.

```bash
node packages/commands/scripts/generate-md.mjs
node packages/commands/scripts/generate-md.mjs --check
node packages/commands/scripts/generate-md.mjs --compare-plan
```

| Bayrak | Davranış |
|--------|----------|
| `--check` | Mevcut `command-plan-sync.md` ile diff; fark varsa exit 1 |
| `--compare-plan` | `docs/command-plan.md` tabloları ile satır satır drift kontrolü |

### `generate-aliases.mjs`

`kapitan-sh` için bash alias kayıt dosyası üretir:

**Çıktı:** `packages/kapitan-sh/generated/aliases.sh`

```bash
node packages/commands/scripts/generate-aliases.mjs
node packages/commands/scripts/generate-aliases.mjs --check
```

`kapitan-sh` bu dosyayı `source` eder:

```bash
source /usr/lib/kapitan-sh/generated/aliases.sh
kapitan_registry_lookup gir   # → builtin cd
```

## Tüketim

### Website (Vite)

```ts
// vite.config.ts
resolve: {
  alias: {
    '@kapitan/commands': path.resolve(__dirname, '../packages/commands/commands.json'),
  },
},
```

```jsx
import registry from '@kapitan/commands';
```

### kapitan-sh

```bash
# build / install öncesi
node packages/commands/scripts/generate-aliases.mjs
```

Üretilen dosya hem `KAPITAN_ALIAS_MAP` (associative array) hem de interaktif `alias` satırları içerir.

### Kurulu OS

```
/usr/share/kapitan/commands.json
/usr/lib/kapitan-sh/generated/aliases.sh
```

## Onay bekleyen plan varsayılanları

`docs/command-plan.md` § Belirsizlikler onaylanana kadar F0 varsayılanları:

| Soru | Varsayılan |
|------|------------|
| `rmdir` → `sök` / `sk` | **Evet** |
| `grep` grubu | **Metin** |
| `git checkout` → `geç` / `gç` | **Evet** |
| `ln` / `bağla` / `bğ` | **Evet** |
| İzinler grubu | **Ertelendi** (Faz 2) |

## `cd → gir` örnek çıktısı

`generate-aliases.mjs` `dosya.cd` kaydı için şunu üretir:

```bash
# dosya.cd | posix: cd | turkish: gir | short: gr
# replaces legacy alias: git
KAPITAN_ALIAS_MAP[gir]='builtin cd'
KAPITAN_ALIAS_ID[gir]='dosya.cd'
KAPITAN_ALIAS_MAP[gr]='builtin cd'
KAPITAN_ALIAS_ID[gr]='dosya.cd'
alias gir='builtin cd'
alias gr='builtin cd'
```

`git` komutu alias'lanmaz; PATH'teki gerçek `git` ikilisi korunur.

## Katkı akışı

1. `docs/command-plan.md` güncelle (insan okunur spec)
2. `packages/commands/commands.json` düzenle
3. `node packages/commands/scripts/validate.mjs`
4. `node packages/commands/scripts/generate-md.mjs`
5. `node packages/commands/scripts/generate-aliases.mjs`
6. PR: JSON + üretilmiş dosyalar birlikte

## Referanslar

- BUILD PLAN: **Bölüm 9 — commands.json — Tek Doğruluk Kaynağı**
- İnsan spec: [`docs/command-plan.md`](../../docs/command-plan.md)
- Alias mimarisi: BUILD PLAN **Bölüm 8 — kapitan-sh**