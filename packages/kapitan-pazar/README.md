# pazar — KAPiTaN OS Türkçe paket yöneticisi

**Stage 1: dürüst apt sarmalayıcı.** `pazar`, Debian/KAPiTaN apt depoları
üzerine Türkçe bir kabuktur — yeni bir paket evreni değil. Kararlı arayüzleri
(`apt-get`, `apt-cache`, `dpkg-query`) sarar; `apt` porcelain'ini script içinde
kullanmaz.

## Komutlar

| Komut | Karşılık | Açıklama |
|-------|----------|----------|
| `pazar kur <paket>` | `apt-get install` | Paket kur |
| `pazar kaldır <paket>` | `apt-get remove` | Paketi kaldır |
| `pazar güncelle` | `apt-get update` | Depo listesini yenile |
| `pazar yükselt` | `apt-get upgrade` | Paketleri yükselt |
| `pazar tara <terim>` | `apt-cache search` | Paket ara |
| `pazar incele <paket>` | `apt-cache show` | Ayrıntı göster |
| `pazar kurulu [paket]` | `dpkg-query` | Kurulu paketler |
| `pazar temizle` | `apt-get autoremove` | Gereksizleri kaldır |
| `pazar kaynaklar` | (salt-okunur) | Apt kaynaklarını göster |

Komut adları `commands.json` SSOT ile uyumludur (`tara`=ara değil; `incele`).
ASCII yazım da kabul edilir: `kaldir`, `guncelle`, `yukselt`.

## Akış (değiştiren komutlar)

1. **Plan** — ayrıcalıksız `apt-get -s` ile ne olacağı hesaplanır,
2. Türkçe gösterilir (ya da `--json` ile makine-okunur),
3. **onay** istenir (`--evet` ile atlanır; TTY yoksa ve `--evet` yoksa reddedilir),
4. `sudo apt-get … -y` ile uygulanır. `sudo` yoksa Türkçe uyarı + çıkış 77.

```bash
pazar kur vim                 # plan → onay → kur
pazar --evet kur vim          # onaysız
pazar --plan --json kur vim   # {"op":"install","install":["vim"],"remove":[]}
```

## Hata mesajları

Kilit çakışması, ağ hatası ve "paket bulunamadı" durumları ham İngilizce apt
çıktısı yerine Türkçe ipuçlarına çevrilir.

## Bilinen sınır (Stage 1)

Debian paket açıklamalarının Türkçe kapsamı çok düşüktür; bu yüzden `tara`
Türkçe terimlerde az sonuç verebilir. Stage 1.5'te küçük bir Türkçe-anahtar →
paket köprüsü (`data/`) planlanmaktadır.

## Test

```bash
bats tests        # PATH-shimmed apt-get/apt-cache/dpkg-query/sudo mock'ları ile
```
