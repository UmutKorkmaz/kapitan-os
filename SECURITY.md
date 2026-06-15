# Güvenlik Politikası · Security Policy

## Desteklenen sürümler

KAPiTaN OS şu anda **alpha** aşamasındadır. Yalnızca en son sürüm desteklenir;
üretim ortamlarında kullanılması önerilmez.

| Sürüm | Destek |
|-------|--------|
| `0.1.x-alpha` | ✅ (en son alpha) |
| < `0.1.0` | ❌ |

## Açık bildirimi · Reporting a vulnerability

Bir güvenlik açığı bulduysanız **herkese açık GitHub issue açmayın**. Bunun yerine:

- GitHub **Security Advisories** üzerinden özel bildirim açın:
  <https://github.com/UmutKorkmaz/kapitan-os/security/advisories/new>, veya
- depo sahibine özel olarak ulaşın.

Lütfen şunları ekleyin: etkilenen bileşen (kapitan-sh, ISO, web sitesi, paket
deposu), yeniden üretme adımları, etki ve mümkünse bir düzeltme önerisi.

**En iyi çaba (best-effort) yanıt süresi** (solo, açık kaynak proje):
ilk yanıt ~7 gün, düzeltme aciliyete göre. Bu bir taahhüt değil, hedeftir.

## Bilinen güvenlik duruşu

- **kapitan-sh** varsayılan olarak **güvenli modda** çalışır: komut/işlem yerine
  koyma (`$(...)`, `` `...` ``, `<(...)`) reddedilir; tam kabuk yalnızca açık
  izinle (`KAPITAN_ALLOW_SHELL=1`). Ayrıntı: `packages/kapitan-sh/README.md`.
- **Temel işletim sistemi** Debian 12'dir; çekirdek güvenlik güncellemeleri
  yukarı akış Debian'dan gelir. KAPiTaN özel bir çekirdek **dağıtmaz**.
- **Yapay zekâ** (planlanan) yerel bir model ile çalışacak ve üretilen komutlar
  "çalıştırmadan önce onay" akışından geçecektir.

## Paket imzalama · Package signing

KAPiTaN OS paketleri (`kapitan-sh`, `pazar`, `kapitan-ai`) ve apt deposu
**GPG ile imzalanır**. Güven modeli:

- **Çevrimdışı birincil anahtar (offline primary key):** Asıl güven kökü. CI'a
  hiçbir zaman girmez; mühürlü yedeği ve iptal sertifikası (revocation cert)
  çevrimdışı saklanır.
- **CI imza alt anahtarı (signing subkey):** Yalnızca sürüm yayını için kullanılır.
  Korumalı bir GitHub **Environment** (`release`) içinde tutulur — yalnızca
  korumalı `v*` etiketlerinde ve isteğe bağlı kurucu onayıyla erişilebilir.
- **1 yıllık alt anahtar geçerliliği** + rotasyon runbook'u: yeni alt anahtar,
  süre bitiminden **en az 1 ay önce** `kapitan-archive-keyring` ile dağıtılır.

İmza anahtarı parmak izi (fingerprint) **out-of-band** olarak burada ve web
sitesi alt bilgisinde duyurulur. Kullanıcılar, deposu eklemeden önce indirdikleri
açık anahtarın parmak izini bu değerle doğrulamalıdır (bkz.
`docs/INSTALL-APT.md`).

```
KAPiTaN OS imza alt anahtarı parmak izi · signing subkey fingerprint:
6EEE 93BB B501 E039 346E  7794 D5EA F68D 8F12 7BCF
(tam 40-hex: 11E8DEEE8C014E7EEA1D8953DFF0439169E3553F)
```

Apt deposu ayrı bir depoda barındırılır: <https://github.com/UmutKorkmaz/kapitan-apt>
(GitHub Pages: <https://umutkorkmaz.github.io/kapitan-apt/>). Yayın akışı,
her `.deb` için ayrık imza (`.deb.asc`) ve imzalı bir `SHA256SUMS` üretir;
`reprepro` `Release` dosyasını alt anahtarla imzalar.
