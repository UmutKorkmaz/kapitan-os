# KAPiTaN OS — Ultimate Build Plan

> **How this document was produced:** an independent draft by **Codex** (gpt-5.5),
> validated and corrected by a **Fable** multi-agent review (8 domain validators +
> a completeness critic) against the real repository, live web research, and Debian/
> Ollama best practice. Every correction below was verified by reading files or running
> commands. Status markers: **MUST** / **NICE** · **HONEST-NOW** / **ASPIRATIONAL** ·
> effort **S/M/L/XL**.

> **Re-baselined against HEAD.** Phase-0 LICENSE work is already done (commit `a04add4`:
> full GPL-3.0 `LICENSE`, `kapitan-sh` → `GPL-3.0-only`, root SPDX normalized). Re-verify
> each item against HEAD before starting it.

---

## 0. Current reality (verified, not aspirational)

**What is real today (`0.1.0-alpha`):**
- 66-command Turkish→POSIX catalog with JSON Schema + 320-line validator; strong alias
  design (`cd`→`gir` to dodge the `git` namespace collision).
- `kapitan-sh` (~592 LOC bash, bash-3.2 safe): REPL + `-c` + login flags; resolve/dispatch;
  **26 of 66** commands are wired (`implemented:true` in the runtime fork — see drift below).
- A real bootable Debian-12 **amd64 live ISO** (727 MiB) on the `v0.1.0-alpha` release.
- `website/` (Vite+React, tr_TR) on GitHub Pages; honest `hedef` labels on Home/Pazar only.

**What is false-as-shipped (advertised as fact, no implementation):** custom kernel
`Linux 6.8.0-kapitan`; `pazar-cli` + `5 000+ paket`; `KAPiTaN AI v2.1 (yerel + bulut)`;
three differentiated editions at 4.2/3.1/1.4 GB (**one ISO reused for all three**); `~22 sn`
boot; 45+/30+/8 preinstalled apps (the ISO has **no desktop and no apps** — package list is
`locales bash coreutils jq git sudo curl` + live-boot); dev-edition `KodDüzenleyici Pro`,
`NVIDIA CUDA · AMD ROCm`, toolchain versions (Python 3.12/Rust 1.75/Go 1.21/Node 20/PG 16/Git 2.43),
`arm64` support, and an **installer + dual-boot wizard + first-run welcome** (promised on
`Belgeler.jsx:214/240`).

**Verified technical defects:** three divergent `commands.json` (SSOT/runtime/ISO-merge) with
drift invisible to CI; `dispatch.sh:232 eval "$transformed"` runs arbitrary shell from user input
(injection confirmed); unimplemented command returns `rc=0` and breaks `&&`/`;` compounds;
BIOS-only (`grub-pc`) + serial-only console; `--security false`; no ISO signing; the AI demo
calls cloud `window.claude.complete` (undefined on Pages → throws) while Home promises local/private.

**Strategic frame:** Pardus 25 "Bilge" (TÜBİTAK, Debian-13) owns "Turkish Linux." KAPiTaN's only
defensible wedge is the **Turkish natural-language command layer + real local AI**, shipped as an
**apt-installable layer on any Debian/Ubuntu/Pardus — distro second**, aimed at
**beginners / students / education / accessibility**.

---

## A. Load-bearing corrected decisions (read these first)

These are the decisions where Codex's draft was wrong or where validation changed the answer.

| # | Decision | Rationale |
|---|----------|-----------|
| A1 | **Stock Debian kernel — NO custom kernel.** Secure Boot is then *free* via `shim-signed` + `grub-efi-amd64-signed` + Debian-signed kernel, with `lb config --uefi-secure-boot enable`. | A custom kernel forces MOK enrollment (blue MokManager screen, 2048-bit key limit) and breaks SB. Drop `6.8.0-kapitan`. Secure Boot is **MUST/Phase-2**, not "later". |
| A2 | **`grub-efi-amd64-signed`, not `grub-efi-amd64-bin`.** Use `--bootloaders syslinux,grub-efi` (NOT `grub-pc,grub-efi`). | `…-bin` is unsigned → shim refuses it. The isohybrid MBR (USB boot) only attaches when the BIOS bootloader is **syslinux**; `grub-pc` gives optical-only boot, so dd'd USB sticks won't boot. |
| A3 | **reprepro for alpha** (not aptly). aptly migration is a Phase-4 item when alpha/beta/stable + rollback matter. | aptly's stateful DB/snapshots add week-1 complexity for zero alpha benefit; reprepro signs on `includedeb` and is a ~10-line Action. reprepro's one-version-per-suite is fine for alpha. |
| A4 | **Host the apt repo in a SEPARATE repo/Pages site** (e.g. `umutkorkmaz/kapitan-apt` → `…github.io/kapitan-apt`). | `deploy-pages.yml` uploads `website/dist` as the *entire* Pages artifact; a second publish to `/apt` on the same site is atomically wiped on the next website deploy (and vice versa). **CRITICAL** — would break `apt update` for every user. |
| A5 | **Do NOT bundle the model in the ISO.** Default model = **~3–4B Q4, Apache-2.0** (e.g. Qwen3-4B-Instruct). 8B Turkish (Fikri/Turkish-Llama) = opt-in for ≥16 GB. | 8B Q4 ≈ 4.9 GB > the entire advertised 4.2 GB ISO; needs ~6 GB RAM (breaks Ofis 4 GB / Geliştirici 8 GB floors). `model kur` downloads from **Hugging Face** (SHA-pinned) on first run — also fixes GitHub's 2 GiB/file cap. |
| A6 | **Ollama is NOT in Debian** — must be vendored as `kapitan-ollama` .deb (upstream MIT tarball, own systemd unit bound to `127.0.0.1`), or use `llama.cpp`/`llama-server` (tens of MB, single fixed model). | `kapitan-ai`'s `Depends: ollama` is otherwise unsatisfiable and breaks the Ofis/Geliştirici **ISO builds**, not just the feature. |
| A7 | **Deb versions use the tilde convention:** git tag `v0.2.0-alpha.1` → deb `0.2.0~alpha.1-1`. | `0.2.0-alpha.1` sorts *higher* than `0.2.0` in dpkg → alpha users never upgrade to final. Only `~` sorts before empty. |
| A8 | **One live-build config tree**, parameterized by `KAPITAN_EDITION` (base list + per-edition `edition.list.chroot`). Not three full config trees. | Three trees recreate the divergence disease (there's already a dead `auto/package-lists/` duplicate). Delete the stray duplicate. |
| A9 | **`kapitan-ai` is `Recommends` (or a v0 stub) for Phase-2 editions**, not a hard `Depends`. | A hard `Depends: kapitan-ai` makes Phase-2 ISOs unbuildable until Phase-3 ships — the dependency graph is otherwise mis-ordered. |
| A10 | **Bar/XFCE first.** Build & boot-test ONE edition end-to-end before Ofis/Geliştirici. | Smallest, fastest CI loop; matches Bar's "old hardware" story; three DEs at once triples QA for a solo author. |

---

## 1. Command layer (`kapitan-sh`) — MUST, Phase 0–1

| Item | Status | Eff | Deliverable / correction | Exit criteria |
|---|---|---|---|---|
| Single generated SSOT | MUST | M | Keep `packages/commands/commands.json` as language SSOT; add `implemented-overlay.json` (keyed by **canonical** ids); generate `dist/commands.runtime.json` + `kapitan-sh/generated/registry.bash`. **Delete the runtime fork** `packages/kapitan-sh/data/commands.json` as an authority. **Replace `build/scripts/sync-image-assets.sh`'s jq merge** (the source of the disjoint-AI-id silent-false bug) with a copy of the generated runtime file. | CI fails on any drift; runtime/website/ISO all read generated output; ISO `commands.json` byte-identical to the generated artifact |
| Unify AI ids | MUST | S | Canonical ids `ai-sor/ai-kodla/ai-acikla/ai-ozet/ai-cevir`; overlay maps handlers; **no `ai-ask` ids anywhere** | id-set parity asserted in CI (canonical = overlay = generated) |
| Schema expansion | MUST | S | Declare top-level `path_guard`, `implemented`, `handler`, `risk_tier`, `edition_availability`, `posix_argv`. **Relax ALL freezes:** `commands` min/maxItems:66, `meta.totalCommands` const:66, `groups` min/maxItems:7, `group.key` enum, `group.order` max:7, `command.group` enum — or drive group keys from one shared extensible enum | `validate:commands` passes for 66 today and the new groups/counts |
| Eval-safety | MUST | M | Route bare-verb + simple-arg segments through the **existing-but-dead** `kapitan_dispatch_argv` (in-process, so `gir`→`cd` persists). **Correction:** the split is NOT compound-vs-noncompound — the tokenizer ignores **redirects (`>`,`>>`,`2>&1`) and globs (`*.txt`)**, so detect those metacharacters too and route them to an explicit `--shell`/`KAPITAN_ALLOW_SHELL=1` path documented as a full shell (no sandbox). | bats proves `$(touch pwn)`, backticks, `; touch pwn` do **not** execute in safe mode; `gir /tmp && nerede` shows `/tmp` (cd persists, never a subshell) |
| Exit codes | MUST | S | Return **127** for unknown/unimplemented in standalone + compound; stop `kapitan_transform_line` appending the operator when a segment fails (kills the `&&touch…` / `pwd &&&&` syntax errors) | `kapitan-sh -c sor` → 127; `false && sor` preserves shell semantics |
| Drop jq runtime | MUST | M | Generate `registry.bash` (forward maps) **plus a reverse posix→kapitan suggestion map** and a **fully-resolved `help` dataset** (per-mode flags precomputed); reimplement `help.sh` filtering in pure bash. jq is used in `resolve.sh` (load + turkce suggestion) **and** `help.sh` (group list, mode/implemented filter, detail). | clean Debian container with **no jq**: `.deb` installs, `kapitan-sh -c listele` **and** `yardım` both work |
| Validate generated artifacts | MUST | S | Extend `validate:commands` to schema-check `dist/commands.runtime.json` + overlay, not just canonical | malformed generator output fails CI (hash-drift check alone is insufficient) |
| Tab completion | MUST | S | `completions/kapitan-sh.bash` → `/usr/share/bash-completion/completions/`; built from generated registry; Turkish-i aware | `kapitan-sh -c <TAB>` suggests Turkish aliases |
| Package as `.deb` | MUST | M | `packages/kapitan-sh/debian/`; install `/usr/bin/kapitan-sh`, `/usr/lib/kapitan-sh`, `/usr/share/kapitan/commands.json`; `Architecture: all`, `Section: shells`, `debhelper-compat (=13)`; **drop `bash`/`coreutils` from Depends** (Essential), `bash-completion` → Recommends; **DEP-5 `debian/copyright`**; `postinst` registers the shell via `debianutils` shells.d (not raw `/etc/shells` edits) | `dpkg-buildpackage`, `lintian`, `piuparts` clean; installs on Debian/Ubuntu/**Pardus** |
| `/usr/local` transition | MUST | S | The current ISO ships `kapitan-sh` at `/usr/local/bin` (dpkg-unmanaged). `postinst`/`kapitan-base` must remove the stale copy (checksum-guarded) so `/usr/bin` wins PATH; document that `/usr/local` can't use dpkg Conflicts/Replaces | upgraded alpha-ISO systems run the packaged binary, no dangling `/etc/shells` entry |
| Catalog scale 84/160/218 | MUST-beta | L | Add `archive/permissions/env/manual/service/desktop` groups + commands via `edition_availability`. **Sequence AFTER** `pazar`/`kapitan-ai` handlers exist (else mass `implemented:false` recreates drift). | edition-filtered counts in website + `yardım` |

---

## 2. APT repository + packaging — MUST, Phase 1 (backbone)

- **Tool:** reprepro (A3). `conf/distributions` with `Origin: KAPiTaN, Label: KAPiTaN, Codename: alpha, SignWith: <subkey>`. Ship `/etc/apt/preferences.d/kapitan` (pin `o=KAPiTaN` priority 500; >1000 only for `kapitan-*`) via `kapitan-base`, mirrored as a live-build `.pref.chroot`.
- **Hosting:** separate `kapitan-apt` repo/Pages site (A4). **Publish `pool/` before `dists/`** (CDN cache ~10 min, no Acquire-By-Hash → hash-mismatch window); document the transient-error retry; plan move to `repo.kapitan-os.org` (Cloudflare, `no-cache` on `dists/`) at beta.
- **Package set (define ALL):** `kapitan-sh`, `kapitan-base` *(was missing — every metapackage Depends on it; home for `/etc/kapitan`, `os-release`, sources.list.d, preferences, firmware Recommends, `/etc/shells`)*, `kapitan-ai`, `kapitan-ollama` (A6), `kapitan-pazar`, `kapitan-branding`, `kapitan-archive-keyring`, `kapitan-live-config` (live-ISO only), and metapackages `kapitan-gelistirici/ofis/bar`.
- **Signing:** offline primary key; CI signing **subkey in a protected GitHub Environment** (required reviewers, restricted to protected tags); **1-year subkey expiry** + rotation runbook shipping the new subkey via `kapitan-archive-keyring` ≥1 month before expiry; offline revocation cert with the primary; publish fingerprint out-of-band (website footer + `SECURITY.md`).
- **live-build integration (corrected):** use `config/archives/kapitan.list.chroot` + `kapitan.list.binary` (one-line `deb [signed-by=…] URL alpha main`) + `kapitan.key.chroot/.binary` (ASCII-armored). **deb822 `.sources.chroot` is silently ignored by live-build 20230502** (the pinned version) — deb822 `/etc/apt/sources.list.d/kapitan.sources` is fine only for **installed** systems. Add `--debootstrap-options '--include=ca-certificates'` (HTTPS Pages fails chroot `apt update` otherwise).
- **First-build escape hatch:** drop locally-built `.debs` into `config/packages.chroot` for first/PR builds; gate "build strictly from published snapshot" to tagged releases. Publish all packages atomically in one `includedeb` batch before the first repo-backed ISO.
- **Bootstrap trust:** ship `scripts/install-kapitan.sh` — HTTPS-download `kapitan-archive-keyring.deb` from GitHub Releases, verify against pinned fingerprint/SHA, `dpkg -i`, then add the source. Test on a clean container in CI.
- **DEP-5 + source:** each `debian/` gets a `copyright`; publish source packages (`includedsc`) or document the git tag as corresponding source (GPL §6).
- **arch:** `kapitan-*` are `Architecture: all` → free arm64 in the repo (only the ISO is amd64-bound). Either advertise that honestly or strike `arm64` from `editions.json`.

---

## 3. KAPiTaN AI engine (the moat) — MUST, Phase 3 skeleton in P1

- **`kapitan-ai` CLI:** `/usr/bin/kapitan-ai` with `sor/kodla/acikla/ozet/cevir/doctor/model kur/model listele`; config `/etc/kapitan/ai.toml`.
- **Model tiers (A5):** default **3–4B Q4 Apache-2.0** (e.g. Qwen3-4B-Instruct, ~2.5 GB, solid Turkish); upgrade **Fikri/Turkish-Llama 8B Q4** opt-in for ≥16 GB. `doctor` recommends a tier from detected RAM. **No ISO bundling** → install-on-first-run from **Hugging Face** (pinned revision + SHA256, resume support).
- **Runtime (A6):** `kapitan-ollama` vendored .deb (or `llama-server`), systemd unit `OLLAMA_HOST=127.0.0.1`, dedicated unprivileged user, `ProtectSystem`/`PrivateTmp`; **not enabled by default on Ofis** (4 GB floor). Upstream-update/CVE cadence job in CI.
- **Confirm-before-run (hardened):** risk tier computed by **KAPiTaN static analysis of the proposed argv** (registry match + destructive denylist: `rm -rf`, `dd`, `mkfs`, `chmod -R`, `curl|sh`, `sudo`, `shutdown`) — **never** from the model's own JSON (prompt-injection). Non-registry commands = highest tier. Proposals execute **only via the argv path**, never `eval`/`bash -c`. Confirm prompt shows a **plain-Turkish explanation** (beginners can't read shell — y/n on opaque commands is consent theater); destructive tier needs typed `ONAYLA`, no `--yes` bypass; never auto-`sudo`; `ozet/acikla` output can never enter execution.
- **Eval quality gate (the actual moat):** `packages/kapitan-ai/eval/` with ~100–200 Turkish-prompt→expected-argv pairs incl. adversarial/injection prompts that must be refused; run in CI against each candidate GGUF; a model enters the default manifest only with a published score.
- **Live-session behavior:** overlay is RAM-backed → `model kur` would OOM. `doctor` detects live-boot; `sor` prints "Canlı oturumda AI kullanılamaz — kuruluma devam edin". AI is an **installed-system** feature.
- **Privacy honesty:** no prompt logging by default; cloud disabled unless `KAPITAN_AI_PROVIDER=cloud` + token. Docs say "yerel model kuruluysa cihazda çalışır; bulut opsiyoneldir."
- **Llama license (if 8B used):** ship Llama Community License + NOTICE in the artifact; "Built with Llama" attribution on AI pages; models live in a **non-free `kapitan-modeller`** component, never `main`; note the `fikri-3.1-…` name violates Llama's "must begin with Llama" clause. *Defaulting to Apache-2.0 (A5) avoids all of this.*

---

## 4. `pazar` package manager — MUST (stage 1), Phase 1

- **Stage 1 = honest apt wrapper** over `apt-get`/`apt-cache` (the **stable** script interfaces; never the `apt` porcelain). Plan via `apt-get -s install` (unprivileged sim), render in Turkish, then on `ONAY` re-exec `sudo apt-get install -y --`. No sudo → Turkish hint + exit 77.
- **Subcommand names must match the SSOT** (corrections): search = **`tara`** (not `ara` — `ara` is grep); details = **`incele`** (not `bilgi`). Add `temizle`/`kaynaklar` to `commands.json` first (read-only `kaynaklar` in stage 1). **Generate pazar's subcommand table from the SSOT generator** + extend the CI drift gate (don't hand-maintain a second name list).
- **ASCII folding:** accept both `kaldır|kaldir`, `güncelle|guncelle`, `yükselt|yukselt`; generated registry gains ASCII-fallback keys; bats asserts both resolve.
- **Non-interactive:** `-e/--evet`; refuse mutating ops when stdin isn't a TTY and `--evet` absent; `--plan --json` for `kapitan-ai` to render.
- **Errors in Turkish:** dpkg lock contention (vs `unattended-upgrades`), `apt-get` exit 100, offline `guncelle`, unknown-package near-matches — each with a bats test (PATH-shim mock).
- **Turkish search reality:** Debian's `Translation-tr` is ~5.6 KB (≈ empty) → stage-1 `tara` finds nothing for Turkish terms. Ship a small static TR-keyword→package map (`tarayıcı`→`firefox-esr`, ~50 entries) as a stage-1.5 bridge; print a notice on zero Turkish hits. Curated `apps.yaml` is the NICE stage-2; **AppStream/DEP-11 → LATER** (GUI only).
- **Layer-first:** works on plain Debian/Ubuntu/Pardus with no kapitan source configured.

---

## 5. ISO build + edition differentiation — MUST, Phase 2

- **UEFI+BIOS+Secure Boot (A1/A2):** `--uefi-secure-boot enable` (fail loudly if signed parts missing); `--bootloaders syslinux,grub-efi`; packages `shim-signed` + `grub-efi-amd64-signed` (handled by live-build's binary stage, not package lists). The CI already installs `isolinux`/`syslinux-common` (isohdpfx.bin).
- **Console fix:** `console=tty0 console=ttyS0,115200n8` (+`splash` for Plymouth).
- **Security posture:** remove `--security false`; wire `--mirror-chroot-security`/`--mirror-binary-security` (the workflow already exports `KAPITAN_SECURITY_MIRROR` but `auto/config` ignores it); consider `--updates true`. **Disable the `unattended-upgrades` timer in the live image**; put `unattended-upgrades` as a metapackage Recommends for installed systems (don't conflate live vs installed).
- **One config tree (A8):** parameterize `auto/config` with `KAPITAN_EDITION` (iso-volume/application + `edition.list.chroot`); CI matrix passes `KAPITAN_EDITION`; **delete the dead `auto/package-lists/` duplicate**.
- **Firmware (was entirely missing — fatal for Bar):** `firmware-linux firmware-iwlwifi firmware-realtek firmware-atheros firmware-brcm80211 firmware-sof-signed intel-microcode amd64-microcode` (non-free-firmware already enabled).
- **Live identity/OOBE:** `--bootappend-live "… username=kapitan hostname=kapitan-<edition>"`; per-DM autologin smoke; minimal `kapitan-welcome` first-run app (backlog).
- **Signing & repro:** `SHA256SUMS` + `.asc` + detached `.sig`; reproducibility (`SOURCE_DATE_EPOCH`, `snapshot.debian.org`, `reprotest`/`diffoscope`) is **MUST-beta**, not alpha.
- **CI matrix:** `iso.yml` `{gelistirici,ofis,bar}` → `kapitan-<edition>-<version>-amd64.iso`; raise disk-free/timeout for the heavier editions.
- **Installer (A-critic):** **Calamares** (`calamares` + `calamares-settings-debian`, Turkish defaults, dual-boot via os-prober) is required because the website *already* advertises installation/dual-boot — either pull it into Phase 2 **or** descope Phase 2 to one live-demo ISO and label the installer/wizard `hedef` in §9. Live-config persistence is the stopgap. Preseed `keyboard-configuration` (tr-Q **and tr-F**) for installed systems.
- **CUDA/ROCm × Secure Boot:** no DKMS packages in metapackages for now (SB rejects unsigned modules); add `NVIDIA CUDA · AMD ROCm` to §9's removal/`hedef` list or document a MOK/dkms path (LATER).

---

## 6. Desktop + apps — MUST, Phase 2 (corrected package sets)

> live-build installs **Recommends by default** — verify every metapackage's transitive pull.

- **Bar — XFCE + LightDM:** `xfce4` (core, not the full task), `lightdm`, `lightdm-gtk-greeter`, `thunar`, `xfce4-terminal`, `mousepad`, `firefox-esr` + **`firefox-esr-l10n-tr`**, `parole` + **`gstreamer1.0-plugins-bad/ugly`** (Bar claims "tüm formatlar"), `ristretto`, `atril`, `galculator`, `network-manager-gnome`. *Reconcile `editions.json`: Bar advertises `terminal:false`/`packageManager:false` but ships `kapitan-sh`/`kapitan-pazar` — flip to `basic`.*
- **Ofis — KDE Plasma + SDDM:** `kde-plasma-desktop`, `sddm`, `plasma-nm` (only Recommended otherwise), `dolphin`, `konsole`, `firefox-esr`+`-l10n-tr`, `libreoffice` + `libreoffice-l10n-tr` + `libreoffice-help-tr` + **`libreoffice-kf5`** + **`fonts-crosextra-carlito`/`-caladea`** (Calibri/Cambria metric-compat — the #1 "LibreOffice is broken" complaint), `hunspell-tr`, `thunderbird`+`-l10n-tr`, `okular`, `simple-scan`, `cups`, `system-config-printer`, `fonts-noto`. AI = **Recommends**, ≤4B default, unit off by default; add "AI için 8 GB RAM önerilir".
- **Geliştirici — GNOME + GDM:** **`gnome-core`** (NOT `task-gnome-desktop`, which pulls the whole office suite + games and blows the budget), plus explicit: `gnome-terminal`, `git`, `build-essential`, `python3`+**`python3-venv`+`pipx`** (PEP-668), **`golang-go`** (not `golang`), `nodejs`/`npm`, `rustc`, `cargo`, `openjdk-17-jdk`, `cmake`, `ninja-build`, `meson`, `podman` **xor** `docker.io` (pick one), `sqlite3`, `postgresql-client`, `redis-tools`, `ripgrep`, `fd-find`, `curl`, `wget`, `openssh-client`, `shellcheck`, `bats`, `devscripts`, `lintian`. Add **`orca`** (gnome-core drops it). Decide `gnome-software`/`synaptic` coexistence vs `pazar`.
- **Shared:** one audio stack — pin **`pipewire-audio` + `pavucontrol`** in all editions (don't rely on two layers of Recommends → PulseAudio/PipeWire split). Font baseline `fonts-noto-core` everywhere. **`firefox-esr-l10n-tr` + `manpages-tr`** in all editions (the localization wedge).
- **Acceptance:** each ISO boots to desktop; `/etc/kapitan/EDITION` matches; `apt-mark showmanual` includes the metapackage; **Bar has no ollama/kapitan-ai**; editions' dpkg manifests differ.

---

## 7. Honest branding — MUST, Phase 2

- **`kapitan-branding` .deb** — **`Depends: plymouth, plymouth-themes`** (Codex shipped a Plymouth theme with nothing installing plymouth, and no `splash` in bootappend); `postinst` runs `plymouth-set-default-theme kapitan -R`.
- **GRUB theme split:** ISO menu via `build/live-build/.../config/bootloaders/grub-pc/` (build-tree); installed-system theme `/boot/grub/themes/kapitan` + `/etc/default/grub.d` drop-in + `update-grub` in postinst (guarded).
- **os-release (corrected):** owned by `kapitan-base` via `dpkg-divert` of base-files' file (the Pardus approach), **not** a raw `includes.chroot` file (diverges on every base-files update, and doesn't exist for apt-layer installs). Fix defects: `HOME_URL` uses fake TLD `kapitan.os` → real domain; add `VERSION_CODENAME=bookworm` + `BUG_REPORT_URL`; keep `ID=kapitan`, `ID_LIKE=debian`.
- **No fake kernel** (A1): `uname -r` shows the real Debian kernel.

---

## 8. Release + update infrastructure — MUST, Phase 1–2

- **Versioning (A7):** semver tags → tilde deb versions; `dpkg --compare-versions` test in CI.
- **Immutable releases:** drop `--clobber`; new artifacts require a new tag; publish only from a tag-triggered `release.yml`. (Today `live-build-smoke.yml` clobbers the fixed `v0.1.0-alpha` tag → signed checksums silently rot.)
- **Distribution ceilings (cross-cutting):** GitHub Releases caps **2 GiB/file**, Pages ~1 GB/site → desktop ISOs >2 GiB and model blobs need **object storage/CDN (Cloudflare R2 / SourceForge) + torrents + checksums**; models on **Hugging Face**. Decide before any model-bundled artifact.
- **Release manifest SSOT:** define schema `{edition, version, channel, filename, sizeBytes, sha256, sigUrl, sbomUrl, isoUrl@tag (not /latest), keyFingerprint, publishedAt}`; **generate `build/editions.json`'s `iso` block FROM `release/manifest.json`** (two release-truth files = same SSOT disease); validate with JSON Schema.
- **Installed-system updates:** `/etc/apt/sources.list.d/kapitan.sources` + keyring; `pazar guncelle/yukselt`.
- **GPL corresponding source:** per release, capture the chroot dpkg manifest, pin to `snapshot.debian.org`, publish `SOURCES.md`.
- **SBOM:** per-`.deb` via `syft` (CycloneDX-JSON); ISO BoM = chroot `dpkg-query` + syft scan; attach to release; optional `actions/attest-build-provenance`.
- **Rollback** (NICE, post-aptly-migration).

---

## 9. Website honesty — MUST, Phase 0 (extend Codex's list)

Exact edits (Codex's list **plus** the gaps validation found):
- `build/editions.json`: `hedef`-label app counts/boot times; `iso.available:false` per edition until real distinct ISOs exist; remove `Linux 6.8.0-kapitan`, `pazar-cli`, `KAPiTaN AI v2.1`; **also** the toolchain versions (Python 3.12/Rust 1.75/Go 1.21/Node 20/PG 16/Git 2.43 — bookworm can't satisfy these), `KodDüzenleyici Pro (VS Code tabanlı)`, `NVIDIA CUDA · AMD ROCm`, and **`arch:["x86_64","arm64"]`** (lines 21,107).
- **`website/src/pages/Home.jsx:549/559/569`** — the **hardcoded** `4.2/3.1/1.4 GB` figures (Codex's editions.json-only edit missed these); replace with measured values or remove until real.
- `Home.jsx:928` — replace "Veriniz cihazdan çıkmaz" with "Yerel model kuruluysa cihazda çalışır; bulut opsiyoneldir."
- `Gelistirici.jsx`/`Ofis.jsx`/`Bar.jsx` — add `SimulationBadge`; CTAs "ISO indir" → "CLI alfa ISO" until edition ISOs exist.
- `Interactive.jsx` — guard `window.claude.complete` (`typeof …==='function'`), labeled "önizleme · bulut demosu" fallback, never throw.
- **`Belgeler.jsx:214,240`** — label the dual-boot wizard + welcome wizard `hedef` (or ship them).
- **`Topluluk.jsx:359,363`** — dead `forum.kapitan.org.tr`; switch to GitHub Discussions (honest) or label planned.
- `site.json` feature flags: `ai_live:false, pazar_live:false, editions_live:false, custom_kernel:false, installer_live:false`.
- Delete dead root prototype (`src/`, `index.html`, `v1.html`, `styles.css`) after confirming deploy uses `website/`.
- **Static honesty scan** (blocking CI, zero-browser): grep `website/dist` for forbidden present-tense phrases (`6.8.0-kapitan`, `KAPiTaN AI v2.1`, `5 000+ paket`, `~22 sn`, `pazar-cli`) gated on `site.json` flags. Playwright reserved for the AI-box guard.

---

## 10. Governance & supply chain — MUST, Phase 0

- **License:** ✅ `LICENSE` + alignment done (`a04add4`). Remaining: license fields in `packages/commands/package.json` + `website/package.json` (none today); per-`.deb` DEP-5 `debian/copyright`; SPDX source headers.
- **Mark internal packages `"private": true`** (`kapitan-sh`/`commands` have `bin`/`files` but no `private` → one `npm publish` from leaking).
- **Docs:** `CONTRIBUTING.md`, `SECURITY.md` (incl. key fingerprint + disclosure), `CODE_OF_CONDUCT.md`, `.github/ISSUE_TEMPLATE/*`, `pull_request_template.md`, `CODEOWNERS`.
- **CI hardening (corrected):** `deploy-pages.yml` is already least-privilege. The offenders: `live-build-smoke.yml` top-level `contents: write` (move `gh release` into a tag-triggered `release.yml`); `ci.yml` has **no** `permissions` block (add `contents: read`). Add shellcheck/shfmt, CodeQL, SHA-pinned actions, Dependabot.
- **Package hardening:** `lintian`, `piuparts`, `sbuild`, `syft`.
- **Delete dead code:** root prototype; the dead codegen path (`generate-aliases.mjs` → nonexistent `generated/`).
- **Legal (critic):** Turkpatent + WIPO + GitHub/npm/PyPI search for "KAPiTaN" (note `kapicorp/kapitan`, 1.9k★, same dev-tooling space; Pardus's historical first-run wizard was named **"Kaptan"**); register domains before printing them; Debian trademark compliance note; model-license review **before** bundling. `docs/legal.md`.
- **Privacy/KVKK:** `PRIVACY.md` — no OS telemetry, no website analytics (currently true — codify it), enumerate every network call (apt, model download, optional cloud AI), KVKK contact; CI check that privacy claims link to it.
- **Sustainability:** `SUSTAINABILITY.md` — solo-author bus factor, key escrow + revocation, best-effort security SLA, base-OS updates come from Debian, funding (GitHub Sponsors).

---

## 11. QA / testing — MUST, every phase

- **bats:** dispatch/security/exit-code/completion suites; **Turkish-i (ı/İ) casefolding + tr_TR collation** cases (`LISTELE`, `SİL`, locale-sensitive `[[ ]]`, `sort`/`grep -i`) — core to a string-matching shell.
- **APT install matrix (the strategic test):** `qa/repo/install-matrix.sh` in CI — `debian:12`, **`debian:13`**, `ubuntu:24.04`, **a real Pardus 25 image**: add signed source, `apt update`, `apt install kapitan-sh kapitan-pazar`, run bats. (Would have caught the Pages collision.)
- **Upgrade tests:** from release #2 — previous snapshot → new, assert version + **zero dpkg conffile prompts**.
- **Model-install tests:** tiny dummy GGUF fixture — wrong-SHA rejection, resume-after-kill, low-disk Turkish error, `doctor` states.
- **ISO content assertions (no boot):** unsquashfs + `dpkg -l` manifest; assert per-edition required/forbidden packages; **fail if two editions' manifests are identical** (enforces "3 editions ≠ 1 ISO").
- **VM boot smoke (corrected):** `qemu-smoke.sh` → 3×2 matrix `{bios, uefi, uefi-secureboot (OVMF secboot + MS certs, q35+smm)} × {-cdrom, -drive format=raw (USB)}`; assert `Reached target Graphical Interface` + `/etc/kapitan/EDITION` via an autologin sentinel to ttyS0; `-enable-kvm` (available on runners); per-edition RAM/timeout (Bar `-m 2048`); parameterize ISO path/version. Wire into `iso.yml` as a **required** step (today it's wired into nothing).
- **Website E2E:** add `@playwright/test` + config + CI job (only `playwright` lib exists today); static honesty scan is the blocking check.
- **Repo health monitor:** scheduled `curl InRelease` + `gpgv` + container `apt update` after each Pages deploy.
- **Real-hardware checklist** (`qa/checklists/hardware-matrix.md`, release-blocking): 1 SecureBoot-UEFI laptop, 1 pre-2012 BIOS machine, USB write (dd/Ventoy), tr-Q **and tr-F** keyboard, Wi-Fi on a real old laptop (Bar), a11y (orca + Turkish speech).

---

## R. Realistic roadmap (re-scoped — the 4-week milestone was ~2–3× over)

**Dependency spine:** `schema/overlay → generated registry → kapitan-sh.deb → reprepro repo → kapitan-base + metapackages → live-build (KAPITAN_EDITION) → Bar ISO → VM/SecureBoot QA → release`. `website honesty`, `governance`, `CI hardening`, `pazar stage-1` run **immediately in parallel**. `kapitan-ai` skeleton (doctor + SHA model install, no bundling) parallel to metapackages; only the model installer is late.

| Phase | Goal | Key items |
|---|---|---|
| **P0 — Truth + safety** (wk 1, mostly done/parallel) | Nothing ships a contradiction | ✅ LICENSE · website honesty (full §9 list incl. Home.jsx sizes, Belgeler/Topluluk, arm64, toolchains) · schema+overlay+generated SSOT · eval-safe argv dispatch + 127 · jq removal · bats security/i18n · CI permissions + shellcheck · delete dead prototype · naming/domain clearance |
| **P1 — Package backbone** (wk 2–4) | Installable on any Debian/Ubuntu/Pardus | `kapitan-sh`/`kapitan-base`/`kapitan-pazar`/`kapitan-archive-keyring` `.deb`s (lintian/piuparts clean) · **reprepro** signed repo in **separate Pages repo** · GPG key ceremony (founder) · `install-kapitan.sh` bootstrap · **install matrix incl. Pardus/trixie** · `kapitan-ai` skeleton |
| **P2 — One real edition** (wk 4–8) | **Bar/XFCE** boots & installs | one config tree + `KAPITAN_EDITION` · syslinux+grub-efi-signed UEFI/BIOS/**SecureBoot** · console+firmware+security mirror · `kapitan-bar` metapackage · Calamares (or descope to live-demo + label installer `hedef`) · signed ISO · 3×2 boot smoke + ISO-manifest distinctness |
| **P3 — AI moat** (wk 6–12) | Real Turkish intent→command | `kapitan-ollama` vendored · default 3–4B Apache model via HF · hardened confirm-before-run (static risk tiers, argv-only) · **Turkish eval set in CI** · Ofis/Geliştirici ISOs |
| **P4 — Beta hardening** | Trustworthy public beta | aptly migration + channels/rollback · reprotest/diffoscope · openQA · release automation + SBOM + immutable tags · update/upgrade tests · trixie decision |

**Honest 4-week milestone (one author):** all of P0 (minus done LICENSE) + P1 complete with a reprepro-signed repo and install tests on Debian 12/13 + Ubuntu + Pardus + **one Bar/XFCE ISO** (UEFI+BIOS, security mirror, firmware, signed checksums) that installs via metapackage + the full §9 honesty pass + `kapitan-ai` as a packaged skeleton (doctor + SHA model install, **no bundling**). **Ofis/Geliştirici ISOs, the full confirm-flow, and any model-in-ISO decision → weeks 5–12.**

---

## F. Founder decisions (with recommended defaults)

| # | Decision | Recommended default |
|---|----------|---------------------|
| F1 | Debian base: bookworm vs trixie | **bookworm** for alpha speed; **plan trixie before beta** (Pardus 25 = trixie; closes the toolchain-version honesty gap) |
| F2 | Default AI model + license + hosting | **Qwen3-4B-Instruct Q4 (Apache-2.0)** default on **Hugging Face**, SHA-pinned; 8B Turkish opt-in. Avoids Llama obligations |
| F3 | Cloud AI fallback | **Opt-in only**, off by default |
| F4 | DE split | **Start Bar/XFCE only**; add KDE/GNOME after Bar ships. Reconsider 3-DE maintenance load |
| F5 | apt repo hosting | **Separate `kapitan-apt` Pages repo** now; `repo.kapitan-os.org` (Cloudflare) at beta |
| F6 | GPG key custody | Offline primary (sealed backup + revocation cert); CI **subkey** in a protected Environment, 1-yr expiry |
| F7 | Kernel | **Stock Debian** (free Secure Boot). No custom kernel |
| F8 | Domains + name | Register `kapitan-os.org`/`.tr` before printing; Turkpatent/WIPO + npm/PyPI clearance vs `kapicorp/kapitan` and Pardus "Kaptan" |
| F9 | Catalog governance | Approve Turkish names; flip `meta.status` from `draft-awaiting-approval` to `approved` before next public release |
| F10 | Distribution for >2 GiB artifacts | Object storage/CDN (R2/SourceForge) + torrents + checksums; models on HF |

---

*Generated by Codex (draft) + Fable multi-agent validation. Every correction is repo-verified.
Re-baseline each item against `git HEAD` before execution.*
