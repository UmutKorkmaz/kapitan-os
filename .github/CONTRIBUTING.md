# KAPiTaN OS'ye Katkıda Bulunma (Contributing)

## Başlamadan Önce (Before You Start)

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/açıklayıcı-ad`
3. Make your changes
4. Commit with conventional commits: `feat:`, `fix:`, `docs:`
5. Push to your fork
6. Open a Pull Request

## Türkçe Komutlar için Katkı (Turkish Commands)

### Yeni Komut Eklemek
1. Edit `packages/kapitan-sh/lib/commands.conf`
2. Add Turkish command mapping
3. Add tests in `packages/kapitan-sh/tests/`

### Örnek Format
```bash
# commands.conf
komut_adı="command_name"
açıklama="Komutun açıklaması"
kategori="sistem|dosya|ağ|yönetim"
```

## Test Etme (Testing)

```bash
# Run all tests
cd packages/kapitan-sh && bats tests/

# Run specific test
bats tests/test_command.bats
```

## Kod Stilü

- Bash scripts: shellcheck compliant
- Documentation: Markdown
- Turkish comments encouraged
- Commit messages: English or Turkish

## Pull Request Süreci

1. Title: `feat(package): brief description`
2. Description: Explain the change and why
3. Testing: Include test results
4. Turkish translation: If documentation

## İletişim

- GitHub Issues: Bugs and features
- Discussions: Ideas and questions
- Email: umutkorkmaz.32@gmail.com

## Kod Davranış Kuralları (Code of Conduct)

Tüm katılımcılar saygılı ve kapsayıcı olacağız.

---

**Teşekkürler katkılarınız için!** — Thank you for contributing!
