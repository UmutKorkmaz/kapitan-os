# distro/

KAPiTaN OS image composition skeleton (F0 / Bölüm 7).

This directory holds **locale defaults**, **profile hooks**, and a **rootfs overlay** that the
`build/live-build/` pipeline will consume when producing the first bootable alpha artifact.
No ISO is built from here alone.

## Layout

```
distro/
├── README.md
├── config/                         # Build-time source templates
│   ├── locale/
│   │   └── default.conf            # LANG/LC_* defaults (tr_TR.UTF-8)
│   └── kapitan-sh.profile.d/
│       └── kapitan.sh              # Login hook template for kapitan-sh
├── overlay/                        # Files copied into the live-build chroot
│   └── etc/
│       ├── default/
│       │   └── locale
│       ├── profile.d/
│       │   └── kapitan.sh
│       └── os-release              # KAPiTaN OS identity template
└── hooks/
    └── post-build.sh               # Image finalize hook (placeholder)
```

## Responsibilities

| Path | Purpose |
|------|---------|
| `config/locale/default.conf` | Canonical locale settings; copied into `overlay/etc/default/locale` during build |
| `config/kapitan-sh.profile.d/kapitan.sh` | Source template for `/etc/profile.d/kapitan.sh` |
| `overlay/etc/` | Root filesystem overlay applied by `build/scripts/install-kapitan-sh.sh` |
| `hooks/post-build.sh` | Post-image steps (locale-gen verification, branding finalize, etc.) |

## Consumers

- `build/live-build/` — live-build config and chroot hooks
- `packages/kapitan-sh/` — shell binary installed alongside this overlay

## Locale

Turkish (`tr_TR.UTF-8`) is the default system locale. See `config/locale/default.conf` and
`overlay/etc/default/locale`.

## kapitan-sh login hook

The profile hook in `overlay/etc/profile.d/kapitan.sh` is **commented out by default** in the
alpha skeleton. Smoke tests should launch `kapitan-sh` manually. Set `KAPITAN_SH_DISABLE=1` to
skip the hook once it is enabled in a later phase.

## Status

F0 skeleton only — `build/` pipeline and ISO artifacts are not wired yet.