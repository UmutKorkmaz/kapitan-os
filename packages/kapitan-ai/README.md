# kapitan-ai — KAPiTaN OS Türkçe komut asistanı (iskelet)

Bu paket **henüz bir dil modeli içermez** — model kaynağı, lisansı ve barındırma
adresi (`docs/ULTIMATE-BUILD-PLAN.md §F`) belirlendiğinde etkinleşecektir. Hazır
olan ve asıl değer taşıyan kısım **güvenlik zırhıdır**.

## Güvenlik zırhı (hazır)

Önerilen her komut şu adımlardan geçer:

1. **Statik risk analizi** — risk düzeyi modelin iddiasından değil, KAPiTaN'ın
   önerilen `argv`'yi incelemesinden çıkar (prompt-injection / halüsinasyona karşı):
   - `safe` — bilinen salt-okunur komut (ls, cat, grep…)
   - `caution` — yazan ya da bilinmeyen komut
   - `destructive` — kara liste (`rm`, `dd`, `mkfs`, `sudo`, `shutdown`…),
     `-R`/`-rf`, ya da sistem yoluna (`/etc`, `/usr`, `/dev/sd*`…) yazım
2. **Sade Türkçe açıklama** — komutun ne yaptığı (yeni başlayanlar için).
3. **Onay** — `caution`/`safe` için `e/h`; `destructive` için büyük harf **ONAYLA**.
4. **Çalıştırma yalnız `argv` ile** — asla `eval`/`bash -c`, asla otomatik `sudo`.

## Komutlar

```bash
kapitan-ai sor "dosyaları listele"   # niyet → komut → güvenli onayla çalıştır
kapitan-ai çalıştır ls -la           # bir komutu zırhtan geçirerek çalıştır
kapitan-ai sınıf rm -rf /            # → destructive
kapitan-ai doctor                    # model/çalıştırıcı/güvenlik durumu
kapitan-ai model kur                 # (yakında)
```

`sor`, model gelene kadar küçük bir çevrimdışı niyet eşlemesi kullanır (listele,
nerede, tarih, disk, bellek, işlemler…); tanımadığı isteklerde modele yönlendirir.
`kodla`/`açıkla`/`özet`/`çevir` modeli gerektirir.

## Test

```bash
bats tests/test_risk.bats   # statik sınıflandırıcı (16)
bats tests/test_ai.bats     # CLI / onay akışı (11)
```
