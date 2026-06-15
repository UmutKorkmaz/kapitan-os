#!/bin/bash

################################################################################
# KAPiTaN OS GitHub Release Environment Setup
# ============================================
#
# This script validates Section 1 completion and sets up:
# 1. GitHub release environment in KAPiTaN-OS repo
# 2. kapitan-apt repository (if not exists)
# 3. Secrets in both repos
# 4. apt-repo scaffold in kapitan-apt
#
# Usage: ./scripts/github-release-env-setup.sh
#
################################################################################

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
FOUNDER_GITHUB_USER="UmutKorkmaz"
KAPITAN_OS_REPO="${FOUNDER_GITHUB_USER}/kapitan-os"
KAPITAN_APT_REPO="${FOUNDER_GITHUB_USER}/kapitan-apt"
RELEASE_ENV_NAME="release"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
APT_REPO_SCAFFOLD="${PROJECT_ROOT}/apt-repo"

################################################################################
# Helper Functions
################################################################################

log_info() {
  echo -e "${BLUE}[INFO]${NC} $*"
}

log_success() {
  echo -e "${GREEN}[✓]${NC} $*"
}

log_warn() {
  echo -e "${YELLOW}[WARN]${NC} $*"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $*" >&2
}

log_section() {
  echo ""
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}  $*${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
}

################################################################################
# Validation & Prerequisite Checks
################################################################################

check_prerequisites() {
  log_section "Checking Prerequisites"

  # Check gh CLI
  if ! command -v gh &> /dev/null; then
    log_error "GitHub CLI (gh) not found. Please install it:"
    log_error "  https://cli.github.com"
    return 1
  fi
  log_success "GitHub CLI installed"

  # Check gh authentication
  if ! gh auth status &> /dev/null; then
    log_error "Not authenticated with GitHub. Run: gh auth login"
    return 1
  fi
  log_success "GitHub authenticated"

  # Check git
  if ! command -v git &> /dev/null; then
    log_error "Git not found"
    return 1
  fi
  log_success "Git installed"

  # Check jq for JSON parsing
  if ! command -v jq &> /dev/null; then
    log_warn "jq not found. Some validation features will be limited."
  else
    log_success "jq installed"
  fi

  return 0
}

validate_section_1_completion() {
  log_section "Validating Section 1 Completion"

  log_info "Section 1 includes:"
  log_info "  • Offline primary key generation (Curve521)"
  log_info "  • CI signing subkey creation (EdDSA, 1-year expiry)"
  log_info "  • Public key export"
  log_info "  • Secure offline backup"
  echo ""

  read -p "$(echo -e ${YELLOW}Has Section 1 been completed? [y/N]:${NC} )" -n 1 -r section_1_done
  echo
  if [[ ! $section_1_done =~ ^[Yy]$ ]]; then
    log_error "Section 1 must be completed before proceeding."
    log_info "Follow the steps in FOUNDER-SETUP.md, Section 1"
    return 1
  fi
  log_success "Section 1 completion confirmed"

  # Prompt for GPG fingerprint
  echo ""
  log_info "From Section 1, step 1.2, you extracted the primary key fingerprint."
  read -p "$(echo -e "${YELLOW}Enter your PRIMARY key fingerprint (40-hex):${NC}")" PRIMARY_FINGERPRINT

  # Validate fingerprint format (40 hex characters)
  if ! [[ $PRIMARY_FINGERPRINT =~ ^[A-Fa-f0-9]{40}$ ]]; then
    log_error "Invalid fingerprint format. Must be 40 hexadecimal characters."
    return 1
  fi

  log_success "Primary fingerprint validated: ${PRIMARY_FINGERPRINT:0:8}..."

  export PRIMARY_FINGERPRINT
  return 0
}

################################################################################
# Step 1: Create Release Environment in KAPiTaN-OS
################################################################################

create_release_environment() {
  log_section "Step 1: Creating Release Environment"

  log_info "Checking if release environment exists..."

  if gh api "repos/${KAPITAN_OS_REPO}/environments/${RELEASE_ENV_NAME}" &> /dev/null; then
    log_warn "Release environment already exists. Skipping creation (idempotent)."
    return 0
  fi

  log_info "Creating release environment via GitHub API..."

  # Create environment with deployment branch policy (pattern: v*)
  gh api repos/"${KAPITAN_OS_REPO}"/environments \
    --input - <<EOF
{
  "name": "${RELEASE_ENV_NAME}",
  "deployment_branch_policy": {
    "protected_branches": false,
    "custom_branch_policies": true
  }
}
EOF

  log_success "Release environment created"

  # Add deployment branch policy pattern
  log_info "Adding deployment branch pattern (v*)..."
  gh api repos/"${KAPITAN_OS_REPO}"/environments/"${RELEASE_ENV_NAME}"/deployment-branch-policies \
    --method POST \
    --input - <<EOF
{
  "type": "branch",
  "name": "v*"
}
EOF

  log_success "Deployment branch pattern added (v*)"

  # Set reviewers if possible (optional enhancement)
  log_info "Release environment URL:"
  log_info "  https://github.com/${KAPITAN_OS_REPO}/settings/environments/${RELEASE_ENV_NAME}"

  return 0
}

################################################################################
# Step 2: Collect Secrets from User
################################################################################

collect_secrets() {
  log_section "Step 2: Collecting Secrets"

  log_warn "The following secrets are required from Section 1:"
  echo ""

  # Secret 1: KAPITAN_SIGNING_KEY
  echo -e "${YELLOW}Secret 1: KAPITAN_SIGNING_KEY${NC}"
  log_info "This is your CI signing subkey (from FOUNDER-SETUP.md, step 1.6)"
  log_info "File: ~/kapitan-ci-subkey.asc (or from offline backup)"
  log_info "Format: Starts with '-----BEGIN PGP PRIVATE KEY BLOCK-----'"
  echo ""

  # Try to read from file if it exists
  if [[ -f "${HOME}/kapitan-ci-subkey.asc" ]]; then
    read -p "$(echo -e ${YELLOW}Use ${HOME}/kapitan-ci-subkey.asc? [y/N]:${NC} )" -n 1 -r use_file
    echo
    if [[ $use_file =~ ^[Yy]$ ]]; then
      KAPITAN_SIGNING_KEY=$(<"${HOME}/kapitan-ci-subkey.asc")
    else
      read -p "$(echo -e ${YELLOW}Paste KAPITAN_SIGNING_KEY (multiline, Ctrl+D to finish):${NC} )" -r -d '' KAPITAN_SIGNING_KEY || true
    fi
  else
    log_info "Paste the entire content of kapitan-ci-subkey.asc"
    log_info "(Multiline input: press Ctrl+D to finish)"
    KAPITAN_SIGNING_KEY=$(cat)
  fi

  if [[ -z "$KAPITAN_SIGNING_KEY" ]]; then
    log_error "KAPITAN_SIGNING_KEY not provided"
    return 1
  fi
  log_success "KAPITAN_SIGNING_KEY collected"
  export KAPITAN_SIGNING_KEY

  echo ""

  # Secret 2: KAPITAN_GPG_PASSPHRASE
  echo -e "${YELLOW}Secret 2: KAPITAN_GPG_PASSPHRASE${NC}"
  log_info "This is the passphrase from Section 1, step 1.1"
  log_info "The strong passphrase (32+ chars) that protects your primary key"
  echo ""

  read -s -p "$(echo -e ${YELLOW}Enter KAPITAN_GPG_PASSPHRASE:${NC} )" KAPITAN_GPG_PASSPHRASE
  echo
  if [[ -z "$KAPITAN_GPG_PASSPHRASE" ]]; then
    log_error "KAPITAN_GPG_PASSPHRASE not provided"
    return 1
  fi
  log_success "KAPITAN_GPG_PASSPHRASE collected"
  export KAPITAN_GPG_PASSPHRASE

  echo ""

  # Secret 3: APT_DISPATCH_TOKEN
  echo -e "${YELLOW}Secret 3: APT_DISPATCH_TOKEN${NC}"
  log_info "This is your GitHub Personal Access Token (PAT)"
  log_info "Create at: https://github.com/settings/tokens/new"
  log_info "Required scopes: repo, workflow"
  echo ""

  read -s -p "$(echo -e "${YELLOW}Enter APT_DISPATCH_TOKEN (GitHub PAT):${NC}")" APT_DISPATCH_TOKEN
  echo
  if [[ -z "$APT_DISPATCH_TOKEN" ]]; then
    log_error "APT_DISPATCH_TOKEN not provided"
    return 1
  fi
  log_success "APT_DISPATCH_TOKEN collected"
  export APT_DISPATCH_TOKEN

  return 0
}

################################################################################
# Step 3: Set Secrets in KAPiTaN-OS Repo
################################################################################

set_secrets_kapitan_os() {
  log_section "Step 3: Setting Secrets in KAPiTaN-OS Repository"

  log_info "Setting KAPITAN_SIGNING_KEY..."
  gh secret set KAPITAN_SIGNING_KEY \
    --repo "${KAPITAN_OS_REPO}" \
    --body "$KAPITAN_SIGNING_KEY" 2>&1 | grep -v "^$" || true
  log_success "KAPITAN_SIGNING_KEY set"

  log_info "Setting KAPITAN_GPG_PASSPHRASE..."
  gh secret set KAPITAN_GPG_PASSPHRASE \
    --repo "${KAPITAN_OS_REPO}" \
    --body "$KAPITAN_GPG_PASSPHRASE" 2>&1 | grep -v "^$" || true
  log_success "KAPITAN_GPG_PASSPHRASE set"

  log_info "Setting APT_DISPATCH_TOKEN..."
  gh secret set APT_DISPATCH_TOKEN \
    --repo "${KAPITAN_OS_REPO}" \
    --body "$APT_DISPATCH_TOKEN" 2>&1 | grep -v "^$" || true
  log_success "APT_DISPATCH_TOKEN set"

  return 0
}

################################################################################
# Step 4: Create kapitan-apt Repository
################################################################################

create_kapitan_apt_repo() {
  log_section "Step 4: Creating kapitan-apt Repository"

  log_info "Checking if ${KAPITAN_APT_REPO} exists..."

  if gh repo view "${KAPITAN_APT_REPO}" &> /dev/null; then
    log_warn "Repository already exists (idempotent)"
    return 0
  fi

  log_info "Creating ${KAPITAN_APT_REPO}..."

  # Create private repo first (founder can change to public after adding keyring)
  gh repo create "${KAPITAN_APT_REPO}" \
    --private \
    --description "KAPiTaN OS APT Repository (Package Signatures & Releases)" \
    --source=/dev/null \
    --remote=origin \
    --push

  log_success "Repository created (private)"
  log_warn "Remember to:"
  log_warn "  1. Add the public keyring to the repo"
  log_warn "  2. Change visibility to public in repo settings"
  log_warn "  3. Enable GitHub Pages (Settings → Pages, deploy from main/root)"

  return 0
}

################################################################################
# Step 5: Copy apt-repo Scaffold to kapitan-apt
################################################################################

copy_apt_scaffold() {
  log_section "Step 5: Copying apt-repo Scaffold"

  if [[ ! -d "$APT_REPO_SCAFFOLD" ]]; then
    log_error "apt-repo scaffold not found at: $APT_REPO_SCAFFOLD"
    return 1
  fi

  log_info "Cloning ${KAPITAN_APT_REPO}..."
  local temp_dir
  temp_dir=$(mktemp -d)
  trap "rm -rf $temp_dir" EXIT

  gh repo clone "${KAPITAN_APT_REPO}" "$temp_dir"

  log_info "Copying scaffold files..."

  # Copy directories: conf, .github, incoming
  for dir in conf .github incoming; do
    if [[ -d "${APT_REPO_SCAFFOLD}/${dir}" ]]; then
      log_info "  Copying ${dir}/"
      rm -rf "${temp_dir}/${dir}"
      cp -r "${APT_REPO_SCAFFOLD}/${dir}" "${temp_dir}/"
    fi
  done

  # Copy files: kapitan-archive-keyring.asc, README.md
  for file in kapitan-archive-keyring.asc README.md; do
    if [[ -f "${APT_REPO_SCAFFOLD}/${file}" ]]; then
      log_info "  Copying ${file}"
      cp "${APT_REPO_SCAFFOLD}/${file}" "${temp_dir}/"
    fi
  done

  # Create .gitkeep in incoming if directory is empty
  mkdir -p "${temp_dir}/incoming"
  if [[ -z "$(ls -A ${temp_dir}/incoming 2>/dev/null)" ]]; then
    touch "${temp_dir}/incoming/.gitkeep"
  fi

  log_info "Committing and pushing to ${KAPITAN_APT_REPO}..."
  cd "$temp_dir"
  git add -A
  git config user.email "umutkorkmaz.32@gmail.com"
  git config user.name "Umut Korkmaz"
  git commit -m "chore: initialize apt repository scaffold from kapitan-os" || true
  git push origin main 2>&1 | grep -v "^$" || true

  log_success "apt-repo scaffold copied and pushed"

  return 0
}

################################################################################
# Step 6: Set Secrets in kapitan-apt Repo
################################################################################

set_secrets_kapitan_apt() {
  log_section "Step 6: Setting Secrets in kapitan-apt Repository"

  log_info "Setting KAPITAN_SIGNING_KEY..."
  gh secret set KAPITAN_SIGNING_KEY \
    --repo "${KAPITAN_APT_REPO}" \
    --body "$KAPITAN_SIGNING_KEY" 2>&1 | grep -v "^$" || true
  log_success "KAPITAN_SIGNING_KEY set"

  log_info "Setting KAPITAN_GPG_PASSPHRASE..."
  gh secret set KAPITAN_GPG_PASSPHRASE \
    --repo "${KAPITAN_APT_REPO}" \
    --body "$KAPITAN_GPG_PASSPHRASE" 2>&1 | grep -v "^$" || true
  log_success "KAPITAN_GPG_PASSPHRASE set"

  log_info "Setting APT_DISPATCH_TOKEN..."
  gh secret set APT_DISPATCH_TOKEN \
    --repo "${KAPITAN_APT_REPO}" \
    --body "$APT_DISPATCH_TOKEN" 2>&1 | grep -v "^$" || true
  log_success "APT_DISPATCH_TOKEN set"

  return 0
}

################################################################################
# Step 7: Create Release Environment in kapitan-apt
################################################################################

create_release_environment_apt() {
  log_section "Step 7: Creating Release Environment in kapitan-apt"

  log_info "Creating release environment in ${KAPITAN_APT_REPO}..."

  if gh api "repos/${KAPITAN_APT_REPO}/environments/${RELEASE_ENV_NAME}" &> /dev/null; then
    log_warn "Release environment already exists (idempotent)"
    return 0
  fi

  gh api repos/"${KAPITAN_APT_REPO}"/environments \
    --input - <<EOF
{
  "name": "${RELEASE_ENV_NAME}",
  "deployment_branch_policy": {
    "protected_branches": false,
    "custom_branch_policies": true
  }
}
EOF

  log_success "Release environment created in ${KAPITAN_APT_REPO}"

  # Add deployment branch policy pattern
  gh api repos/"${KAPITAN_APT_REPO}"/environments/"${RELEASE_ENV_NAME}"/deployment-branch-policies \
    --method POST \
    --input - <<EOF
{
  "type": "branch",
  "name": "v*"
}
EOF

  log_success "Deployment branch pattern added (v*)"

  return 0
}

################################################################################
# Step 8: Validation & Summary
################################################################################

validate_setup() {
  log_section "Validation & Summary"

  log_info "Verifying setup..."
  echo ""

  # Check KAPiTaN-OS release environment
  log_info "KAPiTaN-OS Release Environment:"
  if gh api "repos/${KAPITAN_OS_REPO}/environments/${RELEASE_ENV_NAME}" &> /dev/null; then
    log_success "Release environment exists"
    echo "  URL: https://github.com/${KAPITAN_OS_REPO}/settings/environments/${RELEASE_ENV_NAME}"
  else
    log_error "Release environment not found"
  fi

  # Check KAPiTaN-OS secrets
  log_info "KAPiTaN-OS Secrets:"
  for secret in KAPITAN_SIGNING_KEY KAPITAN_GPG_PASSPHRASE APT_DISPATCH_TOKEN; do
    if gh secret list --repo "${KAPITAN_OS_REPO}" | grep -q "$secret"; then
      log_success "$secret is set"
    else
      log_warn "$secret not found"
    fi
  done

  echo ""

  # Check kapitan-apt repository
  log_info "kapitan-apt Repository:"
  if gh repo view "${KAPITAN_APT_REPO}" &> /dev/null; then
    log_success "Repository exists"
    local repo_url
    repo_url=$(gh repo view "${KAPITAN_APT_REPO}" --json url -q .url)
    echo "  URL: ${repo_url}"

    # Check if it's public
    if gh repo view "${KAPITAN_APT_REPO}" --json isPrivate -q .isPrivate | grep -q "false"; then
      log_success "Repository is public"
    else
      log_warn "Repository is still private (change in settings if needed)"
    fi
  else
    log_error "Repository not found"
  fi

  # Check kapitan-apt release environment
  log_info "kapitan-apt Release Environment:"
  if gh api "repos/${KAPITAN_APT_REPO}/environments/${RELEASE_ENV_NAME}" &> /dev/null; then
    log_success "Release environment exists"
    echo "  URL: https://github.com/${KAPITAN_APT_REPO}/settings/environments/${RELEASE_ENV_NAME}"
  else
    log_warn "Release environment not found"
  fi

  # Check kapitan-apt secrets
  log_info "kapitan-apt Secrets:"
  for secret in KAPITAN_SIGNING_KEY KAPITAN_GPG_PASSPHRASE APT_DISPATCH_TOKEN; do
    if gh secret list --repo "${KAPITAN_APT_REPO}" | grep -q "$secret"; then
      log_success "$secret is set"
    else
      log_warn "$secret not found"
    fi
  done

  echo ""
  log_success "Setup completed successfully!"

  return 0
}

################################################################################
# Main Execution
################################################################################

main() {
  log_info "KAPiTaN OS GitHub Release Environment Setup"
  log_info "============================================"
  echo ""

  # Step 0: Prerequisites
  check_prerequisites || exit 1

  # Step 1: Validate Section 1
  validate_section_1_completion || exit 1

  # Step 2: Create release environment in KAPiTaN-OS
  create_release_environment || exit 1

  # Step 3: Collect secrets from user
  collect_secrets || exit 1

  # Step 4: Set secrets in KAPiTaN-OS
  set_secrets_kapitan_os || exit 1

  # Step 5: Create kapitan-apt repo
  create_kapitan_apt_repo || exit 1

  # Step 6: Copy apt scaffold
  copy_apt_scaffold || exit 1

  # Step 7: Set secrets in kapitan-apt
  set_secrets_kapitan_apt || exit 1

  # Step 8: Create release environment in kapitan-apt
  create_release_environment_apt || exit 1

  # Step 9: Validate and display summary
  validate_setup || exit 1

  echo ""
  log_section "Next Steps"
  echo ""
  log_info "1. Visit kapitan-apt settings to configure GitHub Pages:"
  log_info "   https://github.com/${KAPITAN_APT_REPO}/settings/pages"
  log_info "   - Set source to: Deploy from a branch"
  log_info "   - Select branch: main / root"
  echo ""
  log_info "2. Change kapitan-apt visibility to public (if not already):"
  log_info "   https://github.com/${KAPITAN_APT_REPO}/settings"
  echo ""
  log_info "3. Verify the release workflow in kapitan-os can dispatch to kapitan-apt:"
  log_info "   https://github.com/${KAPITAN_OS_REPO}/actions"
  echo ""
  log_info "Setup complete! You can now publish releases."
  echo ""
}

# Run main function
main "$@"
