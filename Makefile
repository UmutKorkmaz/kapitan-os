.PHONY: help validate test-shell build-website sync-iso-assets dry-run-iso build-iso qemu-smoke ci

help:
	@echo "KAPiTaN OS — available targets:"
	@echo ""
	@echo "  make validate         Validate commands.json against schema"
	@echo "  make test-shell       Run kapitan-sh bats tests"
	@echo "  make build-website    Build the public website (Vite)"
	@echo "  make sync-iso-assets  Sync kapitan-sh + overlay into live-build context"
	@echo "  make dry-run-iso      Check ISO build prerequisites (Debian amd64)"
	@echo "  make build-iso        Build alpha ISO via live-build (Debian amd64)"
	@echo "  make qemu-smoke       Boot ISO in QEMU + write smoke report template"
	@echo "  make ci               Run full CI pipeline (validate + test + build)"
	@echo ""

validate:
	npm run validate:commands

test-shell:
	npm run test:shell

build-website:
	npm run build:website

sync-iso-assets:
	npm run sync:iso-assets

dry-run-iso:
	npm run dry-run:iso

build-iso:
	npm run build:iso

qemu-smoke:
	npm run qemu:smoke

ci:
	npm run ci