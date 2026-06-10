#!/usr/bin/env bash
# kapitan-ai — static risk classifier for proposed commands.
#
# CRITICAL: the risk tier is computed by KAPiTaN's OWN static analysis of the
# proposed argv — NEVER from the model's self-report. A prompt-injected or
# hallucinating model must not be able to label "rm -rf ~" as safe.
#
# Tiers:
#   safe        known read-only command            → simple onay (y/h)
#   caution     write / unknown command            → onay + açıklama
#   destructive denylist / recursive / system path → typed "ONAYLA" gerekir

if [[ -n "${KAPITAN_AI_RISK_LOADED:-}" ]]; then
  return 0 2>/dev/null || exit 0
fi
KAPITAN_AI_RISK_LOADED=1

KAPITAN_AI_READONLY="ls cat pwd echo find grep egrep fgrep head tail uname date whoami id stat file wc which type printenv df du free ps top uptime hostname dir vdir tree less more man help yardım"
KAPITAN_AI_WRITE="cp mv mkdir rmdir touch ln tee install rename"
KAPITAN_AI_DESTRUCTIVE="rm dd mkfs shred fdisk parted sgdisk wipefs mkswap shutdown reboot halt poweroff init telinit kill killall pkill"

# kapitan_ai_risk_tier <cmd> [args...] → echoes safe|caution|destructive
kapitan_ai_risk_tier() {
  local cmd="${1##*/}" ; shift 2>/dev/null || true
  local args=("$@") tok

  [[ -z "$cmd" ]] && { printf 'caution'; return 0; }

  # Privilege escalation is always top tier.
  case "$cmd" in
    sudo|su|doas|pkexec|runuser) printf 'destructive'; return 0 ;;
  esac

  # Destructive command names (incl. mkfs.ext4 etc.).
  case " $KAPITAN_AI_DESTRUCTIVE " in *" $cmd "*) printf 'destructive'; return 0 ;; esac
  case "$cmd" in mkfs.*) printf 'destructive'; return 0 ;; esac

  # rm always removes data → destructive regardless of flags.
  [[ "$cmd" == rm ]] && { printf 'destructive'; return 0; }

  # Read-only commands are safe regardless of which paths they read.
  case " $KAPITAN_AI_READONLY " in *" $cmd "*) printf 'safe'; return 0 ;; esac

  # Write/modify commands: recursive flags or system-path targets → destructive.
  local is_write=0
  case " $KAPITAN_AI_WRITE chmod chown chgrp " in *" $cmd "*) is_write=1 ;; esac
  if (( is_write )); then
    for tok in "${args[@]}"; do
      case "$tok" in
        -*[rR]*|--recursive) printf 'destructive'; return 0 ;;
      esac
      case "$tok" in
        /|/boot|/boot/*|/etc|/etc/*|/usr|/usr/*|/bin|/sbin|/lib*|/var|/var/*|/sys*|/proc*|/dev/sd*|/dev/nvme*|/dev/disk*|/dev/mapper/*)
          printf 'destructive'; return 0 ;;
      esac
    done
    printf 'caution'; return 0
  fi

  # Unknown command — cannot be classified safe.
  printf 'caution'
}

# Plain-Turkish, beginner-readable description of what the command does/touches.
kapitan_ai_explain() {
  local cmd="${1##*/}"; shift 2>/dev/null || true
  case "$cmd" in
    ls|dir) printf 'Dizindeki dosyaları listeler (değişiklik yapmaz).' ;;
    cat|less|more) printf 'Bir dosyanın içeriğini gösterir (değişiklik yapmaz).' ;;
    pwd) printf 'Bulunduğunuz dizini yazar.' ;;
    grep|egrep|fgrep) printf 'Metin içinde arama yapar (değişiklik yapmaz).' ;;
    find) printf 'Dosya arar (varsayılan olarak değişiklik yapmaz).' ;;
    df|du|free) printf 'Disk/bellek kullanımını gösterir.' ;;
    cp) printf 'Dosya KOPYALAR — hedef varsa üzerine yazabilir.' ;;
    mv) printf 'Dosya TAŞIR/yeniden adlandırır — hedef varsa üzerine yazabilir.' ;;
    mkdir) printf 'Yeni klasör oluşturur.' ;;
    touch) printf 'Boş dosya oluşturur ya da tarihini günceller.' ;;
    rm) printf 'Dosya SİLER — geri alınamaz.' ;;
    dd) printf 'Ham disk yazımı yapar — yanlış kullanım diski siler.' ;;
    sudo|su|doas|pkexec) printf 'Yönetici (root) yetkisiyle çalıştırır.' ;;
    *) printf 'Bu komutu KAPiTaN tanımıyor; ne yaptığından emin olun.' ;;
  esac
}
