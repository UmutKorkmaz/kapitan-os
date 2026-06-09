# KAPiTaN OS — Komut Planı (İyileştirilmiş)

> Hazırlayan: ShellArchitect  
> Tarih: 2026-05-21  
> Durum: Taslak — onay bekleniyor

---

## Değişiklik Özeti

| Alan | Eski | Yeni | Gerekçe |
|------|------|------|---------|
| `cd` alias | `git` | `gir` | `git` sürüm kontrol sistemiyle çakışıyor; `gir` "enter" anlamına gelir, çok daha doğal |
| `rmdir` alias | `klasörsil` | `sök` | Bileşik kelime, doğal Türkçe değil; `sök` (sökmek) "take apart/remove" anlamında gerçek fiil |
| `scp` alias | `uzakkopyala` | `aktar` | Çok uzun bileşik; `aktar` (aktarmak) = transfer/convey, tek kelime |
| `apt search` alias | `pazarara` | `tara` | Bileşik yapı; `tara` (taramak) = scan/search, çok doğal |
| `reboot` alias | `yeniden` | `yenile` | `yeniden` zarf (adverb), emir kipi değil; `yenile` = renew/restart, daha doğal komut |
| Yeni grup | — | **Metin** | `head`, `tail`, `sort`, `wc`, `diff`, `sed`, `cut`, `less` — metin işleme çok yaygın |
| Yeni grup | — | **Git** | Sürüm kontrolü her geliştirici için temel; ayrıca `cd/git` çakışmasını da çözer |

---

## Grup 1 — Dosya & Dizin

Format: `[POSIX]` / `[Turkish alias]` / `[short]` / `[Türkçe açıklama]`

| POSIX | KAPiTaN | Kısa | Açıklama |
|-------|---------|------|----------|
| `ls` | `listele` | `lst` | Dizindeki dosyaları listele |
| `cd` | `gir` | `gr` | Çalışma dizinini değiştir (**`git` yerine**) |
| `pwd` | `nerede` | `nr` | Şu anki dizini yazdır |
| `mkdir` | `klasör` | `kls` | Yeni klasör oluştur |
| `rmdir` | `sök` | `sk` | Boş klasörü kaldır (**`klasörsil` yerine**) |
| `cp` | `kopyala` | `kp` | Dosya ya da klasör kopyala |
| `mv` | `taşı` | `tş` | Dosya ya da klasör taşı |
| `rm` | `sil` | `sl` | Dosya ya da klasör sil |
| `touch` | `oluştur` | `olş` | Boş dosya oluştur ya da zaman damgasını güncelle |
| `cat` | `oku` | `ok` | Dosya içeriğini ekrana yazdır |
| `find` | `bul` | `bl` | Dosya sisteminde dosya ara |
| `ln` | `bağla` | `bğ` | Sembolik ya da sabit bağlantı oluştur |

> **Not:** `grep` metin işleme grubuna taşındı (aşağıda).

**Toplam: 12 komut** (grep taşındı, ln eklendi)

---

## Grup 2 — Sistem

| POSIX | KAPiTaN | Kısa | Açıklama |
|-------|---------|------|----------|
| `uname` | `sistem` | `sis` | İşletim sistemi bilgisini yazdır |
| `top` | `canlı` | `cnl` | Çalışan işlemleri canlı izle |
| `ps` | `işlemler` | `işl` | Anlık işlem listesini göster |
| `kill` | `durdur` | `drd` | Bir işlemi sonlandır |
| `df` | `disk` | `dsk` | Disk doluluğunu göster |
| `du` | `boyut` | `byt` | Klasör disk boyutunu hesapla |
| `free` | `bellek` | `blk` | RAM ve takas bellek kullanımını göster |
| `shutdown` | `kapat` | `kpt` | Sistemi kapat |
| `reboot` | `yenile` | `yn` | Sistemi yeniden başlat (**`yeniden` yerine**) |
| `date` | `tarih` | `trh` | Tarih ve saati göster |
| `whoami` | `benim` | `ben` | Aktif kullanıcı adını göster |
| `history` | `geçmiş` | `gcş` | Komut geçmişini listele |

**Toplam: 12 komut** (+3 eklendi: tarih, benim, geçmiş)

---

## Grup 3 — Ağ

| POSIX | KAPiTaN | Kısa | Açıklama |
|-------|---------|------|----------|
| `ping` | `dene` | `dn` | Bir sunucuya erişimi sına |
| `curl` | `iste` | `ist` | HTTP isteği gönder |
| `wget` | `indir` | `ind` | Bağlantıdan dosya indir |
| `ip a` | `ağ` | `ağ` | Ağ arayüzlerini listele |
| `ssh` | `bağlan` | `bğl` | Uzak sunucuya güvenli bağlan |
| `scp` | `aktar` | `akt` | Uzak sunucuya dosya aktar (**`uzakkopyala` yerine**) |
| `hostname` | `sunucu` | `snv` | Makine adını göster |
| `netstat` | `bağlantı` | `bnt` | Ağ bağlantılarını listele |

**Toplam: 8 komut** (+2 eklendi: sunucu, bağlantı)

---

## Grup 4 — Paket & Pazar

| POSIX | KAPiTaN | Kısa | Açıklama |
|-------|---------|------|----------|
| `apt install` | `kur` | `kr` | Pazardan yazılım kur |
| `apt remove` | `kaldır` | `kld` | Kurulu yazılımı kaldır |
| `apt update` | `güncelle` | `gnc` | Paket listesini güncelle |
| `apt upgrade` | `yükselt` | `yks` | Tüm yazılımları en son sürüme yükselt |
| `apt search` | `tara` | `tr` | Pazarda yazılım ara (**`pazarara` yerine**) |
| `apt list` | `kurulu` | `krl` | Kurulu yazılımları listele |
| `apt show` | `incele` | `inc` | Yazılım hakkında detay göster |

**Toplam: 7 komut** (+2 eklendi: yükselt, incele)

---

## Grup 5 — Metin (Yeni)

> Metin işleme komutları yaygın kullanımı nedeniyle ayrı grup hak ediyor.

| POSIX | KAPiTaN | Kısa | Açıklama |
|-------|---------|------|----------|
| `grep` | `ara` | `ar` | Dosya içeriğinde metin ara |
| `head` | `baş` | `bş` | Dosyanın ilk satırlarını göster |
| `tail` | `son` | `sn` | Dosyanın son satırlarını göster |
| `sort` | `sırala` | `srl` | Satırları alfabetik ya da sayısal sırala |
| `wc` | `say` | `sy` | Satır, kelime ve karakter sayısını göster |
| `diff` | `fark` | `frk` | İki dosya arasındaki farkı göster |
| `sed` | `değiştir` | `dğş` | Metin içinde bul-değiştir işlemi yap |
| `cut` | `kes` | `ks` | Satırdan belirli sütunları kes |
| `less` | `gez` | `gz` | Dosyayı sayfa sayfa görüntüle |
| `echo` | `yaz` | `yz` | Metni ekrana ya da dosyaya yazdır |

**Toplam: 10 komut**

---

## Grup 6 — Git (Yeni)

> Geliştiriciler için temel grup. Ayrıca `cd/git` alias çakışmasını kökten çözer.

| POSIX | KAPiTaN | Kısa | Açıklama |
|-------|---------|------|----------|
| `git status` | `durum` | `dur` | Çalışma ağacının durumunu göster |
| `git add` | `hazırla` | `hzr` | Değişiklikleri kayıt için hazırla |
| `git commit` | `kaydet` | `kyd` | Hazırlanan değişiklikleri kaydet |
| `git push` | `gönder` | `gnd` | Değişiklikleri uzak depoya gönder |
| `git pull` | `çek` | `çk` | Uzak depodan değişiklikleri çek |
| `git clone` | `klonla` | `kln` | Uzak depoyu yerel makineye kopyala |
| `git log` | `günlük` | `gnl` | Kayıt geçmişini listele |
| `git branch` | `dal` | `dl` | Dalları listele ya da yeni dal oluştur |
| `git checkout` | `geç` | `gç` | Dal ya da dosyaya geç |
| `git merge` | `birleştir` | `blş` | İki dalı birleştir |
| `git stash` | `raf` | `rf` | Değişiklikleri geçici olarak rafa kaldır |
| `git reset` | `sıfırla` | `sfr` | Hazırlama alanını ya da kayıtları sıfırla |

**Toplam: 12 komut**

---

## Grup 7 — Yapay Zekâ (Değişmedi)

| POSIX | KAPiTaN | Kısa | Açıklama |
|-------|---------|------|----------|
| `—` | `sor` | `sr` | AI'ya Türkçe ile soru sor |
| `—` | `kodla` | `kd` | Açıklamadan kod üret |
| `—` | `açıkla` | `ack` | Bir komutu ya da hatayı açıkla |
| `—` | `özet` | `öz` | Bir dosyayı ya da metni özetle |
| `—` | `çevir` | `çv` | 50+ dil arası çeviri yap |

**Toplam: 5 komut**

---

## Genel Toplam

| Grup | Komut Sayısı |
|------|-------------|
| Dosya & Dizin | 12 |
| Sistem | 12 |
| Ağ | 8 |
| Paket & Pazar | 7 |
| Metin | 10 |
| Git | 12 |
| Yapay Zekâ | 5 |
| **Toplam** | **66** |

---

## Belirsizlikler — Kullanıcı Onayı Gerekiyor

### 1. `rmdir` → `sök` / `sk`

`sök` (sökmek) doğal bir Türkçe fiil: "boştaki bir şeyi yerinden söküp almak". Boş dizin silme için uygun buldum.

Alternatifler:
- `kaldır` — ama `apt remove` için zaten kullanılıyor
- `çıkar` — "take out" ama `çık` (exit) ile karışabilir
- `boşalt` — "empty" ama rmdir dizini boşaltmıyor, zaten boş olanı siliyor

**Soru:** `sök` / `sk` onaylıyor musunuz, yoksa başka bir öneriniz var mı?

### 2. `grep` Grubu

Şu an `grep` → `ara` / `ar` dosya & dizin grubundaydı. Bunu **Metin** grubuna taşıdım.

**Soru:** `grep`'i metin grubunda mı, yoksa dosya grubunda mı bırakalım?

### 3. `git checkout` → `geç` / `gç`

`geç` (geçmek) = "pass over / switch to" anlamında. Doğal ama `gç` kısaltması biraz garip.

Alternatif: `değiştir` / `dğş` — ama bu `sed` için kullanılıyor.

**Soru:** `geç` / `gç` mi, yoksa başka bir öneriniz?

### 4. `ln` eklenmeli mi?

`ln` (link) → `bağla` / `bğ` önerdim. Sembolik bağlantı oluşturma oldukça yaygın, özellikle bir OS projesinde.

**Soru:** `ln` / `bağla` / `bğ` eklemeyi onaylıyor musunuz?

### 5. İzinler grubu

`chmod`, `chown`, `sudo`, `passwd`, `whoami` için ayrı bir **İzinler & Kullanıcı** grubu düşünülebilir. `whoami`'yi şimdilik Sistem grubuna koydum. Eğer izinler grubu istenirse:

- `chmod` / `izin` / `izn`
- `chown` / `sahip` / `shp`  
- `sudo` / `yönetici` / `ynt`
- `passwd` / `parola` / `prl`

**Soru:** Ayrı izinler grubu ekleyelim mi?

---

## Geliştirici Notu

`git` komutunun hem `cd`'nin eski Türkçe alias'ı hem de sürüm kontrol sistemi olması gerçekten kritik bir sorundu. Yeni `gir` alias'ı hem dilbilgisel açıdan daha doğru ("dizine gir" = "enter the directory") hem de developer tooling ile çakışmıyor. Bu değişikliği öncelikli olarak uygulamanızı tavsiye ederim.
