#!/bin/bash
# Help system for Turkish commands

show_help() {
  cat << 'HELP'
KAPiTaN Türkçe Komut Katmanı

Kullanım: kapitan-sh [seçenek] [komut] [argümanlar]

Seçenekler:
  -h, --yardım         Bu mesajı göster
  -v, --sürüm          Sürüm bilgisini göster
  -d, --hata-ayıkla    Hata ayıklama modu

Daha fazla bilgi için: kapitan-sh --yardım
HELP
}
