#!/usr/bin/env bats
# test_risk.bats — static risk classifier. The tier must come from KAPiTaN's
# analysis of the argv, never a caller's claim.

setup() {
  AI_ROOT="$(cd "$(dirname "$BATS_TEST_DIRNAME")" && pwd)"
  source "${AI_ROOT}/lib/risk.sh"
}

# --- safe (read-only) ---
@test "ls is safe" { [ "$(kapitan_ai_risk_tier ls -la)" = safe ]; }
@test "cat of a system file is still safe (read-only)" { [ "$(kapitan_ai_risk_tier cat /etc/hostname)" = safe ]; }
@test "grep is safe" { [ "$(kapitan_ai_risk_tier grep foo bar.txt)" = safe ]; }
@test "df is safe" { [ "$(kapitan_ai_risk_tier df -h)" = safe ]; }

# --- caution (write / unknown) ---
@test "cp to a relative path is caution" { [ "$(kapitan_ai_risk_tier cp a.txt b.txt)" = caution ]; }
@test "mkdir is caution" { [ "$(kapitan_ai_risk_tier mkdir newdir)" = caution ]; }
@test "unknown command is caution (never silently safe)" { [ "$(kapitan_ai_risk_tier htop)" = caution ]; }

# --- destructive ---
@test "rm is always destructive" { [ "$(kapitan_ai_risk_tier rm file)" = destructive ]; }
@test "rm -rf / is destructive" { [ "$(kapitan_ai_risk_tier rm -rf /)" = destructive ]; }
@test "sudo anything is destructive" { [ "$(kapitan_ai_risk_tier sudo ls)" = destructive ]; }
@test "dd is destructive" { [ "$(kapitan_ai_risk_tier dd if=/dev/zero of=/dev/sda)" = destructive ]; }
@test "mkfs.ext4 is destructive" { [ "$(kapitan_ai_risk_tier mkfs.ext4 /dev/sda1)" = destructive ]; }
@test "chmod -R is destructive" { [ "$(kapitan_ai_risk_tier chmod -R 777 .)" = destructive ]; }
@test "cp targeting a system path is destructive" { [ "$(kapitan_ai_risk_tier cp evil /etc/passwd)" = destructive ]; }
@test "absolute /bin/rm still classified by basename" { [ "$(kapitan_ai_risk_tier /bin/rm x)" = destructive ]; }
@test "shutdown is destructive" { [ "$(kapitan_ai_risk_tier shutdown -h now)" = destructive ]; }
