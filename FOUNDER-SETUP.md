# KAPiTaN OS Founder Setup
## GPG Key Generation & Release Infrastructure

This document provides step-by-step instructions for setting up the GPG signing infrastructure for KAPiTaN OS package releases. **Only the project founder should follow this guide.** This process establishes cryptographic trust for all future releases.

---

## Adım 1 · Section 1: Çevrimdışı Birincil Anahtar Oluşturma / Offline Primary Key Generation

The offline primary key is the root of trust for KAPiTaN OS. It **never enters CI/CD** and is stored in a secure, air-gapped environment with backups and a revocation certificate.

### Prerequisites

- **Air-gapped machine or highly secure environment** (ideally offline, or a fresh VM with network disabled)
- GPG 2.4+ (`gpg --version`)
- ~30 minutes of uninterrupted time
- A USB drive or external disk for backup (encrypted, LUKS recommended)

### 1.1 · Çevrimdışı Ortamda Birincil Anahtar Oluştur / Generate Offline Primary Key

Open a terminal on the secure machine and run:

```bash
export GNUPGHOME=$(mktemp -d)  # Temporary GPG home for this session
gpg --full-generate-key
```

When prompted:

```
Please select what kind of key you want:
  (1) RSA and RSA
  (2) DSA and Elgamal
  (3) DSA (sign only)
  (4) RSA (sign only)
  (9) ECC and ECC
 (10) ECC (sign only)
 (11) ECC (set your own capabilities)
 (13) Existing key
 (14) Existing key from card
 (15) ECC (sign only) with Curve25519 + Curve25519

Your selection? 11
```

Select option **11** (ECC with custom capabilities):

```
Possible actions for this ECC key: Sign Certify Encrypt Authenticate
Current allowed actions: Sign Certify

  (S) Toggle the sign capability
  (C) Toggle the certify capability
  (E) Toggle the encrypt capability
  (A) Toggle the authenticate capability
  (Q) Finished

Your selection? C
```

Toggle **Certify on** (this is primary key, must certify subkeys):

```
Possible actions for this ECC key: Sign Certify Encrypt Authenticate
Current allowed actions: Sign Certify

  (S) Toggle the sign capability
  (C) Toggle the certify capability
  (E) Toggle the encrypt capability
  (A) Toggle the authenticate capability
  (Q) Finished

Your selection? S
```

Toggle **Sign off** (primary key only certifies, does not sign directly):

```
Possible actions for this ECC key: Sign Certify Encrypt Authenticate
Current allowed actions: Certify

  (S) Toggle the sign capability
  (C) Toggle the certify capability
  (E) Toggle the encrypt capability
  (A) Toggle the authenticate capability
  (Q) Finished

Your selection? Q
```

Confirm and proceed:

```
What keysize do you want for this ECC key? (256) 521
```

Enter **521** (Ed521 / Curve521 — highest security):

```
Please specify how long the key should be valid.
  0 = key does not expire
  <n>  = key expires in n days
  <n>w = key expires in n weeks
  <n>m = key expires in n months
  <n>y = key expires in n years

Key is valid for? (0) 0
```

Enter **0** (primary key never expires):

```
Is this correct? (y/N) y
```

Confirm **yes**.

Now you will be prompted for key metadata:

```
GnuPG needs to construct a user ID to identify your key.

Real name: Umut Korkmaz
Email address: umutkorkmaz.32@gmail.com
Comment: KAPiTaN OS Founder - Primary Key (Offline)
```

Enter exactly:
- **Real name:** `Umut Korkmaz`
- **Email:** `umutkorkmaz.32@gmail.com`
- **Comment:** `KAPiTaN OS Founder - Primary Key (Offline)`

```
Change (N)ame, (C)omment, (E)mail or (O)kay/(Q)uit? O
```

Confirm **O** (okay).

You will be prompted for a passphrase:

```
Please enter the passphrase to protect your new key
```

**Enter a strong passphrase** (minimum 32 characters, mix of uppercase, lowercase, numbers, symbols). Write it down and store it **offline** (physical safe, encrypted USB, password manager disconnected from internet).

GPG will now generate the key. This may take **30-60 seconds** depending on system entropy.

### 1.2 · Birincil Anahtarın Parmak İzini Bul / Discover Primary Key Fingerprint

Once generation completes, run:

```bash
gpg --list-keys --with-colons | grep -E '^fpr' | head -1
```

This outputs:
```
fpr:::::::::AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA::
```

**Extract the 40-hex fingerprint** (the long hex string). Save this as:

```bash
export PRIMARY_FP="AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
echo "Primary Key Fingerprint: $PRIMARY_FP"
```

Write this fingerprint down **offline**. You will need it below.

### 1.3 · İptal Sertifikası Oluştur / Generate Revocation Certificate

Create an offline revocation certificate (use only if primary key is compromised):

```bash
gpg --gen-revoke $PRIMARY_FP > ~/kapitan-primary-revocation.asc
```

When prompted:

```
Create a revocation certificate for this key? (y/N) y
```

Enter **y**. When prompted for reason:

```
Please select the reason for the revocation:
  0 = No reason specified
  1 = Key has been compromised
  2 = Key is superseded
  3 = Key is no longer used
  Q = Cancel

(Probably you want to select 1 here)

Your selection? 0
```

Select **0** (no reason in certificate, add reason offline if needed).

**Backup this file securely:**
```bash
# On encrypted USB
cp ~/kapitan-primary-revocation.asc /media/secure-usb/kapitan-primary-revocation.asc
# Then shred from temp location
shred -vfz ~/kapitan-primary-revocation.asc
```

### 1.4 · CI İmzalama Alt Anahtarı Oluştur / Generate CI Signing Subkey

Now create a **1-year signing subkey** for CI/CD (this enters GitHub as a secret):

```bash
gpg --edit-key $PRIMARY_FP
```

At the `gpg>` prompt:

```
gpg> addkey
```

When prompted for key type:

```
Please select what kind of key you want:
  (3) DSA (sign only)
  (4) RSA (sign only)
  (6) ECC (sign only)
  (7) ECDSA (sign only)
  (8) EdDSA (sign only)
  (9) existing key
 (10) authentication key
 (12) key from card

Your selection? 8
```

Select **8** (EdDSA — fastest, most secure for signing):

```
Please specify how long the key should be valid.
  0 = key does not expire
  <n>  = key expires in n days
  <n>w = key expires in n weeks
  <n>m = key expires in n months
  <n>y = key expires in n years

Key is valid for? (0) 1y
```

Enter **1y** (1 year — this forces rotation in 12 months):

```
Is this correct? (y/N) y
```

Confirm **yes**.

At the `gpg>` prompt:

```
gpg> save
```

GPG will generate the subkey (takes ~15-30 seconds).

### 1.5 · CI 부요소(Subkey) 확인 / Verify CI Subkey

List both keys:

```bash
gpg --list-keys --with-subkey-fingerprint $PRIMARY_FP
```

Output example:
```
pub   ed25519/XXXXXXXXXXXXXXXX 2026-06-15 [C] [expires: 0000-00-00]
      AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
uid                 [ultimate] Umut Korkmaz <umutkorkmaz.32@gmail.com>
sub   ed25519/BBBBBBBBBBBBBBBB 2026-06-15 [S] [expires: 2027-06-15]
      CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC
```

The second line (starting with `sub` and ending after `[expires: 2027-06-15]`) is your **CI signing subkey**.

**Extract its full fingerprint:**

```bash
gpg --list-keys --with-colons $PRIMARY_FP | grep -E '^fpr' | tail -1 | cut -d: -f10
```

Save this as:

```bash
export SUBKEY_FP="CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC"
echo "CI Signing Subkey Fingerprint: $SUBKEY_FP"
```

### 1.6 · Açık Anahtarı Dışa Aktar / Export Public Key

Export your public key (to be distributed to users):

```bash
gpg --armor --export $PRIMARY_FP > ~/kapitan-archive-keyring.asc
cat ~/kapitan-archive-keyring.asc  # Verify it starts with "-----BEGIN PGP PUBLIC KEY BLOCK-----"
```

Export **only the CI subkey** (for GitHub Actions to import):

```bash
gpg --armor --export-options export-minimal --export-secret-subkeys $SUBKEY_FP > ~/kapitan-ci-subkey.asc
```

Verify this is **secret** (contains `-----BEGIN PGP PRIVATE KEY BLOCK-----`):

```bash
head -1 ~/kapitan-ci-subkey.asc
```

### 1.7 · Çevrimdışı Depolamaya Yedekle / Back Up to Offline Storage

On your encrypted USB or external drive:

```bash
# Mount encrypted USB (example)
mkdir -p /media/secure-usb
sudo mount /dev/sdX1 /media/secure-usb  # Replace sdX1 with your USB device

# Copy backups
cp ~/kapitan-archive-keyring.asc /media/secure-usb/
cp ~/kapitan-ci-subkey.asc /media/secure-usb/
# (revocation cert already backed up in 1.3)

# Unmount and remove from temp storage
sudo umount /media/secure-usb
shred -vfz ~/kapitan-ci-subkey.asc ~/kapitan-archive-keyring.asc
```

---

## Adım 2 · Section 2: GitHub Secrets ve Release Environment Kurulumu / GitHub Secrets & Release Environment Setup

### 2.1 · kapitan-apt Deposu Oluştur / Create kapitan-apt Repository

Go to [github.com/new](https://github.com/new):

1. **Repository name:** `kapitan-apt`
2. **Description:** `KAPiTaN OS APT Repository (Package Signatures & Releases)`
3. **Visibility:** Public
4. **Initialize with README:** Yes
5. Create repository

Once created, visit the repository settings:

```
https://github.com/UmutKorkmaz/kapitan-apt/settings
```

### 2.2 · Branch Protection ve Release Environment Oluştur / Set Up Branch Protection & Release Environment

#### Enable GitHub Pages

Go to **Settings** → **Pages**:
- **Source:** Deploy from a branch
- **Branch:** `main` / `root`
- **Custom domain:** (leave blank for now; `umutkorkmaz.github.io/kapitan-apt/` will be used)

This enables the apt repository to be served at `https://umutkorkmaz.github.io/kapitan-apt/`.

#### Create Release Environment

Go to **Settings** → **Environments**:

1. Click **New environment**
2. Name: `release`
3. Click **Configure environment**

Configure deployment branches:
- **Deployment branches:** Selected branches
- Add rule: Pattern = `v*` (matches `v0.1.0`, `v0.2.0-rc1`, etc.)

### 2.3 · GitHub Secrets Ekle / Add GitHub Secrets

In **kapitan-apt** repository, go to **Settings** → **Secrets and variables** → **Actions**:

Click **New repository secret** for each:

#### Secret 1: KAPITAN_SIGNING_KEY

Paste the **CI signing subkey** (the file `~/kapitan-ci-subkey.asc` from step 1.6):

```
Name: KAPITAN_SIGNING_KEY
Secret: (paste the entire content of kapitan-ci-subkey.asc)
```

Example content:
```
-----BEGIN PGP PRIVATE KEY BLOCK-----

wsDcBGXXXXXXXX...
...
-----END PGP PRIVATE KEY BLOCK-----
```

#### Secret 2: KAPITAN_GPG_PASSPHRASE

Paste the **passphrase** you created in step 1.1:

```
Name: KAPITAN_GPG_PASSPHRASE
Secret: (your strong passphrase from step 1.1)
```

#### Secret 3: APT_DISPATCH_TOKEN

Create a Personal Access Token (PAT) in GitHub:

Go to [github.com/settings/tokens/new](https://github.com/settings/tokens/new):

1. **Token name:** `kapitan-apt-dispatch`
2. **Expiration:** 90 days (rotate every 3 months)
3. **Scopes:** Check the following:
   - `repo` (full repo access) — allows publishing to `kapitan-apt`
   - `workflow` — allows triggering workflows in other repos
4. Click **Generate token**
5. **Copy the token** (you won't see it again)

Paste into the secret:

```
Name: APT_DISPATCH_TOKEN
Secret: (paste the PAT token)
```

### 2.4 · Ana Depoda Secrets Oluştur / Add Secrets to Main Repository

Go to the **main KAPiTaN OS repository** at `https://github.com/UmutKorkmaz/kapitan-os/settings/secrets/actions`:

Add the **same three secrets** here:

1. **KAPITAN_SIGNING_KEY** — same as above
2. **KAPITAN_GPG_PASSPHRASE** — same as above
3. **APT_DISPATCH_TOKEN** — same as above

This allows the main repo's publish workflow to sign packages and dispatch to `kapitan-apt`.

---

## Adım 3 · Section 3: Yer Tutucuları Doldir / Backfill Placeholders

Now populate the fingerprints and checksums into the files that reference them.

### 3.1 · apt-repo/conf/distributions Güncelle / Update apt-repo/conf/distributions

In the **main KAPiTaN OS repository**, open `/apt-repo/conf/distributions`:

Replace `<FULL_40_HEX>` with your **CI signing subkey fingerprint** (from step 1.5):

```diff
- SignWith: <FULL_40_HEX>
+ SignWith: CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC
```

Example:
```
SignWith: 1234567890ABCDEF1234567890ABCDEF12345678
```

### 3.2 · SECURITY.md Güncelle / Update SECURITY.md

In `/SECURITY.md`, find the placeholder around line 58:

```diff
- (tam 40-hex: <FULL_40_HEX> — kurucu tarafından doldurulacak)
+ (tam 40-hex: CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC)
```

Also fill the fingerprint display (line 58):

```diff
- 8XXX XXXX XXXX XXXX XXXX  XXXX XXXX XXXX XXXX XXXX
+ (split your 40-hex fingerprint into 5 groups of 8)
```

Example:
```
12345678 ABCDEF01 23456789 ABCDEF01 23456789
```

**Full update in SECURITY.md:**

```diff
 KAPiTaN OS imza alt anahtarı parmak izi · signing subkey fingerprint:
-8XXX XXXX XXXX XXXX XXXX  XXXX XXXX XXXX XXXX XXXX
-(tam 40-hex: <FULL_40_HEX> — kurucu tarafından doldurulacak)
+1234 5678 ABCD EF01 2345  6789 ABCD EF01 2345 6789
+(tam 40-hex: 1234567890ABCDEF1234567890ABCDEF12345678)
```

### 3.3 · qwen3-4b.manifest.json SHA-256 Doldur / Fill HuggingFace Model Checksum

In `/packages/kapitan-ai/models/qwen3-4b.manifest.json`, you need the SHA-256 checksum from HuggingFace.

#### Fetch the checksum from HuggingFace

Visit the model repo: [huggingface.co/Qwen/Qwen3-4B-Instruct-GGUF](https://huggingface.co/Qwen/Qwen3-4B-Instruct-GGUF)

Look for the file `qwen3-4b-q4_k_m.gguf` in the **Files** section. Click the file or the **info** icon next to it to reveal metadata including **SHA-256**.

Alternatively, using `huggingface_hub` CLI:

```bash
pip install huggingface-hub
huggingface-hub list-repo-files Qwen/Qwen3-4B-Instruct-GGUF --repo-type model
```

Or fetch via Python:

```python
from huggingface_hub import hf_hub_download
import hashlib

# Get the file info
from huggingface_hub import get_repo_info, hf_hub_url

repo_info = get_repo_info("Qwen/Qwen3-4B-Instruct-GGUF")
# Find the file in repo_info['siblings'] and note its 'blob_id' (which is the SHA-256)
```

Once you have the SHA-256 (64-hex string), update the manifest:

```json
{
  ...
  "sha256": "abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234",
  ...
}
```

Example with actual SHA-256:

```diff
- "sha256": "(checksum from HF repo — fill in after verification)",
+ "sha256": "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
```

---

## Adım 4 · Section 4: Doğrulama / Validation

After completing all steps, verify the setup:

### 4.1 · GitHub Secrets Doğrula / Verify GitHub Secrets

In both repositories (`kapitan-os` and `kapitan-apt`), go to **Settings** → **Secrets and variables** → **Actions**:

Verify all three secrets are present:
- ✅ `KAPITAN_SIGNING_KEY`
- ✅ `KAPITAN_GPG_PASSPHRASE`
- ✅ `APT_DISPATCH_TOKEN`

### 4.2 · GPG Anahtarı GitHub'da Doğrula / Verify GPG Key in GitHub

Go to [github.com/settings/keys](https://github.com/settings/keys):

1. Click **New GPG key**
2. Paste the **public key** (from step 1.6: `~/kapitan-archive-keyring.asc`)
3. Click **Add GPG key**

GitHub will display your key with fingerprint confirmation. Verify it matches your **primary key fingerprint** from step 1.2 (starts with `AAAAAAA...`).

### 4.3 · İmza Testi / Test Signing

On your local machine (with the offline environment's keys backed up and restored):

```bash
# Create a test file
echo "KAPiTaN OS Release Test" > test.txt

# Sign it using your CI subkey fingerprint
gpg --local-user $SUBKEY_FP --clearsign test.txt
```

Output:
```
test.txt.asc
```

Verify the signature:

```bash
gpg --verify test.txt.asc
```

Expected output:
```
gpg: Signature made [date/time]
gpg: using EdDSA key BBBBBBBBBBBBBBBB
gpg: Good signature from "Umut Korkmaz <umutkorkmaz.32@gmail.com>"
```

### 4.4 · CI Depodan İmzalama Testi / Test Signing from kapitan-apt Secrets

In the `kapitan-apt` repository, create a GitHub Actions workflow to test signing:

Create `.github/workflows/test-signing.yml`:

```yaml
name: Test GPG Signing

on:
  workflow_dispatch:

jobs:
  test-sign:
    runs-on: ubuntu-latest
    environment: release
    steps:
      - name: Import GPG key
        run: |
          echo "${{ secrets.KAPITAN_SIGNING_KEY }}" | gpg --import --batch --yes

      - name: Test sign
        env:
          GPG_PASSPHRASE: ${{ secrets.KAPITAN_GPG_PASSPHRASE }}
        run: |
          echo "KAPiTaN Release Test" > test.txt
          gpg --batch --yes --pinentry-mode loopback \
              --passphrase "$GPG_PASSPHRASE" \
              --clearsign test.txt
          gpg --verify test.txt.asc

      - name: Print verification
        run: echo "✅ GPG signing test passed"
```

Push this workflow and manually trigger it via **Actions** → **Test GPG Signing** → **Run workflow**.

It should succeed with output:
```
✅ GPG signing test passed
```

### 4.5 · Dosyaları Kontrol Et / Verify Files Updated

In the **main KAPiTaN OS repository**, confirm:

1. **apt-repo/conf/distributions** — `SignWith:` line contains your 40-hex fingerprint (not `<FULL_40_HEX>`)
2. **SECURITY.md** — Signing subkey fingerprint is displayed and the full 40-hex is filled in (not `<FULL_40_HEX>`)
3. **packages/kapitan-ai/models/qwen3-4b.manifest.json** — `sha256` field contains a 64-hex string (not the placeholder)

Run:

```bash
# In the kapitan-os repo root
grep -n "FULL_40_HEX\|<FULL_40_HEX>\|checksum from HF" \
  apt-repo/conf/distributions SECURITY.md packages/kapitan-ai/models/qwen3-4b.manifest.json
```

If there are no matches, all placeholders are filled. If there are matches, continue filling them.

---

## Next Steps

Once validation passes:

1. **Commit and push** the updated files (apt-repo/conf/distributions, SECURITY.md, qwen3-4b.manifest.json):

   ```bash
   git add apt-repo/conf/distributions SECURITY.md packages/kapitan-ai/models/qwen3-4b.manifest.json
   git commit -m "chore(security): populate GPG fingerprint and model checksums"
   git push
   ```

2. **Create your first release** using the publish workflow:
   - Tag a commit: `git tag -s -m "Release 0.1.0-alpha" v0.1.0-alpha`
   - Push the tag: `git push origin v0.1.0-alpha`
   - This triggers the publish workflow in GitHub Actions

3. **Announce the public key** on the website and in release notes:
   - Instruct users to verify the public key fingerprint before trusting the apt repository
   - Host `kapitan-archive-keyring.asc` on the main website or GitHub Pages

---

## Şifre Yönetimi · Passphrase Management

**Keep the GPG passphrase offline and highly secure:**

- Write it down in a **physical safe** or vault
- Store a backup in an **encrypted password manager** (Bitwarden offline vault, 1Password offline storage)
- **Never** add it to environment files, scripts, or version control
- When CI needs it, inject only via GitHub Secrets (encrypted in transit)
- Rotate the passphrase annually or if there is any sign of compromise

---

## Güvenlik Uyarıları · Security Warnings

⚠️ **Critical:**

1. **Primary key must remain offline.** Never upload it to CI, GitHub, or any connected system.
2. **CI subkey expires in 1 year.** Create a rotation runbook before expiration. Generate a new subkey 1 month before the old one expires and distribute it via `kapitan-archive-keyring`.
3. **PAT (APT_DISPATCH_TOKEN) rotates every 90 days.** Set a reminder to regenerate and update secrets.
4. **Revocation certificate is your emergency tool.** If the primary key is ever compromised, immediately publish the revocation certificate to all key servers and notify users.
5. **Backup encrypted storage regularly.** Ensure your offline USB or external drive is backed up to another secure location (a second USB, safe deposit box, etc.).

---

## Referanslar · References

- [GnuPG Handbook — Key Management](https://www.gnupg.org/gph/en/manual/c235.html)
- [GitHub Docs — Managing GPG Keys](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key)
- [reprepro Documentation](https://manpages.debian.org/reprepro.1)
- [Debian Package Signing Guide](https://wiki.debian.org/SecureApt)

---

**Document Version:** 1.0  
**Last Updated:** 2026-06-15  
**Owner:** Umut Korkmaz, KAPiTaN OS Founder  
**Status:** DRAFT (awaiting fingerprint population)
