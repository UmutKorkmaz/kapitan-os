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

## Sürüm ortamı · Release environment (kurucu kurulumu)

İmzalı `.deb` paketleri ve apt deposu, korumalı bir GitHub **Environment**
(`release`) üzerinden yayınlanır. İmza alt anahtarı yalnızca bu ortamda,
yalnızca `v*` etiketlerinde kullanılabilir. Aşağıdaki adımlar **kurucu**
tarafından (GitHub web arayüzünden) bir kez yapılır.

### 1. `release` ortamını oluştur

**Settings → Environments → New environment** → ad: `release`.

Bunu hem `KAPiTaN-OS` hem `kapitan-apt` depolarında oluşturun (her iki yayın
akışı da `environment: release` kullanır).

### 2. Secret'ları ekle

`release` ortamı içinde **Add secret**:

| Secret | İçerik | Kullanan |
|--------|--------|----------|
| `KAPITAN_SIGNING_KEY` | ASCII-armored CI imza **alt anahtarı** (özel). Yalnızca alt anahtar; **birincil anahtarı asla ekleme.** `gpg --armor --export-secret-subkeys <SUBKEY_ID>!` | `publish-release.yml`, `kapitan-apt/publish.yml` |
| `KAPITAN_GPG_PASSPHRASE` | Alt anahtarın parolası. | aynı |
| `APT_DISPATCH_TOKEN` (yalnızca `KAPiTaN-OS`) | `kapitan-apt` deposunda `repo` kapsamlı PAT. Çapraz depo `repository_dispatch` için gerekir. | `publish-release.yml` |

> Secret'ları **siz** (kurucu) GitHub arayüzünden yapıştırırsınız; bunlar koda
> veya `git`'e asla girmez.

### 3. Dal/etiket koruması · Deployment branches and tags

`release` ortamında **Deployment branches and tags → Selected branches and tags**:

- `main` (kural türü: Branch)
- `v*` (kural türü: Tag)

Böylece imza alt anahtarına yalnızca korumalı dal/etiketlerden erişilebilir;
fork'lardan veya rastgele dallardan açılan PR'lar secret'ları **göremez**.

### 4. (İsteğe bağlı) Kurucu onayı · Required reviewers

Manuel bir kapı için: `release` ortamında **Required reviewers** → kendinizi
(kurucu) ekleyin. Artık her sürüm yayını, secret'lar serbest bırakılmadan önce
sizin onayınızı bekler — alt anahtarın istemeden kullanılmasına karşı son bir
güvenlik katmanı.

### 5. Parmak izi yer tutucularını doldur

Anahtar oluşturulduktan sonra `8XXX...` / `<FULL_40_HEX>` yer tutucularını
gerçek değerlerle değiştirin:

- `SECURITY.md` → "Paket imzalama"
- `docs/INSTALL-APT.md` → bölüm 1
- `kapitan-apt/conf/distributions` → `SignWith`
- `kapitan-apt/kapitan-archive-keyring.asc` → gerçek açık anahtar export'u

## Davranış kuralları

Bu proje [Davranış Kuralları](CODE_OF_CONDUCT.md)'na tabidir.

## Güvenlik

Güvenlik açıklarını herkese açık issue olarak **açmayın** — bkz.
[SECURITY.md](SECURITY.md).
