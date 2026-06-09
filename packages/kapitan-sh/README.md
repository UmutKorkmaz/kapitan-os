# kapitan-sh

KAPiTaN OS Türkçe komut katmanı — bash MVP.

`kapitan-sh`, POSIX uyumlu bir kabuk sarmalayıcısıdır. Türkçe fiil tabanlı komut adlarını (`listele`, `gir`, `kur`) ve kısa alias'ları (`lst`, `gr`, `kr`) alttaki POSIX ikililerine çözümler.

## Kurulum

```bash
chmod +x kapitan-sh
export PATH="/path/to/packages/kapitan-sh:$PATH"
# veya
sudo cp kapitan-sh /usr/local/bin/
sudo cp -r lib data /usr/local/lib/kapitan-sh/
```

Gereksinimler: **bash 3.2+**, **jq**.

## Kullanım

```bash
# Etkileşimli kabuk
kapitan-sh

# Tek komut
kapitan-sh -c "listele -la"
kapitan-sh -c "gir /tmp && nerede"

# Dil modu
KAPITAN_DIL=turkce kapitan-sh -c "nerede"
KAPITAN_DIL=posix   kapitan-sh -c "ls -la"
KAPITAN_DIL=ikili   kapitan-sh -c "listele"   # varsayılan
```

## KAPITAN_DIL Modları

| Mod | Değer | Davranış |
|-----|-------|----------|
| POSIX | `posix` | Yalnızca POSIX adlar; Türkçe token reddedilir |
| Türkçe | `turkce` | Türkçe + kısa alias; POSIX adlar öneriyle reddedilir |
| İkili | `ikili` | Türkçe, kısa ve POSIX adların tamamı kabul edilir (varsayılan) |

Kalıcı mod: `~/.kapitan/dil` dosyasına `ikili`, `turkce` veya `posix` yazın.

## Kritik: gir ≠ git

`cd` komutu **asla** `git` ile alias'lanmaz:

```bash
gir /tmp          # → cd /tmp (builtin)
git status        # → gerçek git VCS
```

Bu, `docs/command-plan.md` değişikliğinin temel garantisidir.

## Mimari

```
kapitan-sh          # giriş noktası, etkileşimli döngü
lib/
  resolve.sh        # commands.json → POSIX çözümleme
  dispatch.sh       # exec handoff, boru güvenli
  help.sh           # yardım komut listesi
data/
  commands.json     # 66 komut SSOT (bu pakette gömülü)
```

## Uygulanan Komutlar (MVP)

26 komut `implemented: true` olarak işaretlenmiştir:

**Dosya & Dizin:** listele, gir, nerede, klasör, sök, kopyala, taşı, sil, oluştur, oku, bul, bağla

**Sistem:** sistem, tarih, benim

**Paket:** kur, kaldır, güncelle, yükselt, tara, kurulu, incele

**Metin:** ara, baş, son, yaz

## Test

```bash
npm test          # sözdizimi kontrolü
npm run smoke     # temel smoke testleri
```

Manuel regresyon:

```bash
./kapitan-sh -c "gir /tmp && nerede"    # /tmp
./kapitan-sh -c "listele"               # ls çıktısı
./kapitan-sh -c "git --version"         # git VCS (cd değil!)
```

## Lisans

MIT