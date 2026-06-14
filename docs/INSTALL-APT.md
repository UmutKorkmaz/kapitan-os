# KAPiTaN OS apt deposu — kurulum ve doğrulama · Install & verify

> **Durum: alpha.** Bu depo `amd64` içindir ve KAPiTaN OS paketlerini
> (`kapitan-sh`, `pazar`, `kapitan-ai`) sağlar. Beta'da depo
> `repo.kapitan-os.org` adresine taşınacaktır.

Bu rehber, KAPiTaN OS imza anahtarını **doğrulayarak** apt deposunu güvenli
şekilde eklemeyi anlatır. İmza anahtarını parmak iziyle doğrulamadan depo
**eklemeyin**.

---

## 1. İmza anahtarı parmak izi (out-of-band)

Anahtarı eklemeden önce, parmak izini bu **iki bağımsız kaynaktan** teyit edin:

1. Bu dosya / `SECURITY.md`
2. Web sitesi alt bilgisi (footer)

```
KAPiTaN OS signing subkey fingerprint:
8XXX XXXX XXXX XXXX XXXX  XXXX XXXX XXXX XXXX XXXX
(tam 40-hex: <FULL_40_HEX>)
```

İki kaynak aynı parmak izini göstermiyorsa **durun** ve durumu
`SECURITY.md`'deki kanaldan bildirin.

---

## 2. Hızlı kurulum (bootstrap betiği)

En kolay yol, açık anahtarı HTTPS üzerinden indirip pinlenmiş parmak izine göre
doğrulayan bootstrap betiğidir:

```bash
curl -fsSL https://umutkorkmaz.github.io/kapitan-apt/install-kapitan.sh | sh
```

> Betik: açık anahtarı indirir, **parmak izini doğrular**, `keyring`'i kurar ve
> apt kaynağını ekler. Boru hattına (`| sh`) güvenmek istemiyorsanız aşağıdaki
> manuel adımları izleyin.

---

## 3. Manuel kurulum (önerilen — adım adım doğrulama)

### 3.1 Açık anahtarı indir

```bash
curl -fsSL -o /tmp/kapitan-archive-keyring.asc \
  https://umutkorkmaz.github.io/kapitan-apt/kapitan-archive-keyring.asc
```

### 3.2 Parmak izini DOĞRULA (kritik adım)

```bash
gpg --show-keys --with-fingerprint /tmp/kapitan-archive-keyring.asc
```

Çıktıdaki parmak izi, yukarıdaki (bölüm 1) değerle **birebir** eşleşmelidir.
Eşleşmiyorsa devam **etmeyin**.

### 3.3 Anahtarı keyring'e kur

```bash
sudo install -d -m 0755 /etc/apt/keyrings
sudo gpg --dearmor \
  -o /etc/apt/keyrings/kapitan-archive-keyring.gpg \
  /tmp/kapitan-archive-keyring.asc
sudo chmod 0644 /etc/apt/keyrings/kapitan-archive-keyring.gpg
```

### 3.4 Apt kaynağını ekle (signed-by ile)

```bash
echo "deb [signed-by=/etc/apt/keyrings/kapitan-archive-keyring.gpg] https://umutkorkmaz.github.io/kapitan-apt alpha main" \
  | sudo tee /etc/apt/sources.list.d/kapitan.list
```

### 3.5 Güncelle ve kur

```bash
sudo apt-get update
sudo apt-get install kapitan-sh pazar kapitan-ai
```

---

## 4. Kurulumdan sonra doğrulama

### 4.1 Anahtarın yüklendiğini kontrol et

```bash
gpg --no-default-keyring \
  --keyring /etc/apt/keyrings/kapitan-archive-keyring.gpg \
  --list-keys --with-fingerprint
```

### 4.2 Bir paketin imzasını doğrula (GitHub Releases)

Her `.deb` için yayın sayfasında ayrık imza (`.deb.asc`) bulunur:

```bash
# Örnek: kapitan-sh
ver="0.1.0-alpha"
base="https://github.com/UmutKorkmaz/KAPiTaN-OS/releases/download/v${ver}"
curl -fsSL -O "${base}/kapitan-sh_${ver}_all.deb"
curl -fsSL -O "${base}/kapitan-sh_${ver}_all.deb.asc"
gpg --verify kapitan-sh_${ver}_all.deb.asc kapitan-sh_${ver}_all.deb
```

`Good signature` görmelisiniz (parmak izi bölüm 1 ile eşleşmeli).

### 4.3 SHA256SUMS doğrula

```bash
curl -fsSL -O "${base}/SHA256SUMS"
curl -fsSL -O "${base}/SHA256SUMS.asc"
gpg --verify SHA256SUMS.asc SHA256SUMS
sha256sum -c SHA256SUMS
```

---

## 5. Geçici hatalar (CDN)

`apt update` sırasında nadiren `Hash Sum mismatch` görebilirsiniz. Bu, GitHub
Pages CDN'inin `pool/` ve `dists/` için kısa bir önbellek penceresi (~10 dk)
yüzünden olur. **Çözüm:** birkaç dakika bekleyip tekrar deneyin:

```bash
sudo apt-get update
```

Beta'da depo Cloudflare'e (`dists/` üzerinde `no-cache`) taşındığında bu pencere
ortadan kalkacaktır.

---

## 6. Kaldırma

```bash
sudo rm -f /etc/apt/sources.list.d/kapitan.list
sudo rm -f /etc/apt/keyrings/kapitan-archive-keyring.gpg
sudo apt-get update
```
