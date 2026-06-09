# Changelog

Tüm önemli değişiklikler bu dosyada belgelenir. Format [Keep a Changelog](https://keepachangelog.com/) esasına uyar.

## [Unreleased]

### Added — F1 ISO iskelet (in progress)

- `build/scripts/sync-image-assets.sh` — sync commands.json, kapitan-sh tree, distro overlay into live-build
- `build/live-build/config/hooks/normal/0100-kapitan.hook.chroot` — tr_TR locale + `/etc/shells` registration
- `build/scripts/qemu-smoke.sh` — QEMU boot harness + smoke report template
- `make sync-iso-assets`, `make dry-run-iso`, `make build-iso`, `make qemu-smoke`
- `.github/workflows/live-build-smoke.yml` — PR dry-run + manual full ISO build
- `KAPITAN_COMMANDS_JSON` in distro profile; kapitan-sh wrapper for image layout

### F1 exit criteria (pending)

- [ ] First `kapitan-v0.1.0-alpha-amd64.iso` built on Debian amd64
- [ ] QEMU boot + manual smoke checklist PASS

## [0.1.0-alpha] — 2026-06-09

### Added — F0 Foundation

- Kök **monorepo iskeleti**: `package.json` (npm workspaces: `website`, `packages/*`)
- `pnpm-workspace.yaml` — pnpm ile npm workspaces uyumluluğu
- Kök **Makefile**: `help`, `validate`, `test-shell`, `build-website`, `ci`
- Kök **npm scriptleri**: `validate:commands`, `test:shell`, `build:website`, `ci`
- `.gitignore` — `node_modules`, `dist`, build artifacts, live-build chroot
- `README.md` — proje özeti, monorepo düzeni, hızlı başlangıç
- `CHANGELOG.md` — bu giriş

### Shipped in F0 (completed)

- `packages/commands/` — `commands.json` + JSON Schema + validasyon (66/66)
- `packages/kapitan-sh/` — bash MVP + 21 bats tests
- `website/` — Vite + React migrasyonu
- `distro/` + `build/live-build/` — ISO iskelet hattı (F1 wiring devam ediyor)
- `.github/workflows/ci.yml` — CI kapıları

### Notes

- Mevcut kök `src/` ve `index.html` prototipi bu sürümde **dokunulmadan** bırakıldı.
- `husk.os` ve `site-os` kapsam dışıdır.

[0.1.0-alpha]: https://github.com/kapitan-os/kapitan-os/releases/tag/v0.1.0-alpha