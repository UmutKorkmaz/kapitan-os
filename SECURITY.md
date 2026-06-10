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

## Paket imzalama

İmzalı bir apt deposu ve ISO imzaları **planlanmıştır** (bkz.
`docs/ULTIMATE-BUILD-PLAN.md`). İmza anahtarı parmak izi, yayınlandığında burada
ve web sitesi alt bilgisinde duyurulacaktır:

```
KAPiTaN OS imza anahtarı parmak izi: (henüz oluşturulmadı — alpha)
```
