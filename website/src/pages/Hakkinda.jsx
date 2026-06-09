import { useState } from 'react';
import Link from '../components/Link.jsx';
import GithubReleaseLink from '../components/GithubReleaseLink.jsx';
import { PageHead, SectionHead } from '../components/Shell.jsx';
import { MandalaBg, TileBand } from '../components/Ornaments.jsx';
import { getGithubRepoUrl, getVersion } from '../lib/siteConfig.js';

const VERSION = getVersion();

const editionRoadmap = [
  { name: 'Geliştirici', ram: '8 GB', acc: 'var(--crimson)', to: '/surumler/gelistirici' },
  { name: 'Ofis', ram: '4 GB', acc: 'var(--saffron)', to: '/surumler/ofis' },
  { name: 'Bar', ram: '2 GB', acc: 'var(--jade)', to: '/surumler/bar' },
];

const timeline = [
  ['2021', 'Fikir', "İTÜ'de bir bilgisayar mühendisliği doktora çalışması olarak başladı."],
  ['2022', 'İlk prototip', 'İlk prototip ve komut planı oluşturuldu.'],
  ['2023', 'Topluluk', 'Forum ve topluluk altyapısı planlandı.'],
  ['2024', 'Üç sürüm', 'Geliştirici, Ofis ve Bar olarak ayrıştırma tasarımı.'],
  ['2025', 'AI', 'KAPiTaN AI komut katmanı tasarlandı.'],
  ['2026', '0.1-alpha', '0.1-alpha web sitesi, komut sözlüğü ve GitHub sürümü.'],
];

const faqs = [
  [
    'Sürümü nereden indirebilirim?',
    'GitHub Releases üzerinden. En güncel ISO, SHA-256 özeti ve sürüm notları orada yayınlanır.',
  ],
  [
    'KAPiTaN OS ücretsiz mi?',
    'Evet, tamamen ücretsizdir ve GPL-3.0 lisansı altında dağıtılır. Ticari kullanım da serbesttir.',
  ],
  [
    'Mevcut Linux yazılımları çalışır mı?',
    'Evet, KAPiTaN OS POSIX uyumlu bir çekirdek üzerine kurulmuştur. Mevcut Linux uygulamalarınız ve betikleriniz değişiklik gerektirmeden çalışır.',
  ],
  [
    'Geliştirici, Ofis ve Bar ISO\'ları ayrı mı?',
    '0.1-alpha şimdilik tek bir amd64 canlı ISO olarak yayınlanır. Üç sürüm ayrımı yol haritasında; ayrı imajlar sonraki fazlarda gelecek.',
  ],
  [
    'Yapay zekâ özelliği bulutta mı çalışıyor?',
    'Hayır, KAPiTaN AI varsayılan olarak cihazınızda yerel çalışır. Bulut modu isteğe bağlıdır ve istediğiniz zaman kapatabilirsiniz.',
  ],
  [
    'Türkçe karakterler her yerde destekleniyor mu?',
    'Evet, ı/İ ayrımı dâhil tüm Türkçe karakterler komutlarda, dosya adlarında ve uçbirimde tam olarak desteklenir.',
  ],
];

function GithubDownloadPanel() {
  return (
    <div
      style={{
        border: '1px solid var(--ink-line)',
        background: 'linear-gradient(180deg, var(--ink-2), var(--ink-1))',
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div style={{ position: 'absolute', right: -100, top: -100, opacity: 0.06, pointerEvents: 'none' }}>
        <MandalaBg color="var(--crimson)" size={400} opacity={1} />
      </div>

      <div style={{ padding: '40px 40px 32px', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <span className="mono" style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--sand)', textTransform: 'uppercase' }}>
              github releases
            </span>
            <h3 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(48px, 5vw, 72px)', lineHeight: 1, marginTop: 14 }}>
              KAPiTaN OS {VERSION}
            </h3>
          </div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--sand)', letterSpacing: '0.14em', textAlign: 'right' }}>
            <div>Dosya · kapitan-v0.1.0-alpha-amd64.iso</div>
            <div style={{ marginTop: 4 }}>Mimari · x86_64 · canlı ISO</div>
          </div>
        </div>

        <div style={{ marginTop: 48 }}>
          <p className="body" style={{ maxWidth: '60ch' }}>
            Açık kaynak sürüm GitHub üzerinde yayınlanır. ISO dosyasını indirin; SHA-256 özeti ve kurulum notları sürüm
            sayfasında yer alır.
          </p>

          <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
            <GithubReleaseLink className="btn btn-crimson" style={{ boxShadow: '0 16px 40px -12px var(--crimson)' }}>
              GitHub'da indir →
            </GithubReleaseLink>
            <GithubReleaseLink variant="repo" className="btn btn-line">
              Kaynak kodu
            </GithubReleaseLink>
            <Link to="/belgeler" className="btn btn-ghost">
              Kurulum belgesi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hakkinda() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <>
      <PageHead
        crumbs={[{ label: 'Ana sayfa', to: '/' }, { label: 'Hakkında & indir' }]}
        title={
          <>
            İndir, kur, <em>başla</em>.
          </>
        }
        lede="KAPiTaN OS ücretsiz, açık kaynak ve tamamen Türkçedir. Güncel sürüm GitHub Releases üzerinden indirilir."
        ornamentColor="var(--crimson)"
      />

      <section className="section" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="wrap" style={{ maxWidth: 920, margin: '0 auto' }}>
          <div className="reveal">
            <SectionHead
              no="01"
              eyebrow="ISO indir"
              title={
                <>
                  GitHub'dan <em>indirin</em>.
                </>
              }
              align="center"
            />
          </div>
          <div className="reveal" style={{ marginTop: 64 }}>
            <GithubDownloadPanel />
          </div>
        </div>
      </section>

      <section
        className="section"
        style={{ background: 'var(--ink-1)', borderTop: '1px solid var(--ink-line)', borderBottom: '1px solid var(--ink-line)' }}
      >
        <div className="wrap">
          <div className="reveal">
            <SectionHead
              no="02"
              eyebrow="Sürüm yol haritası"
              title={
                <>
                  Üç kişilik, <em>tek çekirdek</em>.
                </>
              }
              lede="0.1-alpha şimdilik birleşik canlı ISO olarak gelir. Geliştirici, Ofis ve Bar ayrı imajları sonraki fazlarda."
            />
          </div>
          <div className="grid grid-3 reveal" style={{ marginTop: 64 }}>
            {editionRoadmap.map((d, i) => (
              <div key={d.name} className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span className="mono" style={{ color: d.acc, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                    SÜRÜM № 0{i + 1}
                  </span>
                  <span className="mono" style={{ color: 'var(--sand)' }}>Yol haritası</span>
                </div>
                <h3 style={{ fontFamily: 'var(--display)', fontSize: 48, lineHeight: 1.04, marginTop: 24 }}>
                  <i style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: d.acc }}>{d.name}</i>
                </h3>
                <div
                  className="terminal-panel"
                  style={{
                    marginTop: 24,
                    padding: '14px 16px',
                    borderRadius: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="eyebrow" style={{ color: 'var(--terminal-fg-muted)' }}>Hedef RAM</span>
                    <span className="terminal-panel__value">{d.ram}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="eyebrow" style={{ color: 'var(--terminal-fg-muted)' }}>Şimdiki alpha</span>
                    <span className="terminal-panel__value">Birleşik ISO</span>
                  </div>
                </div>
                <div style={{ marginTop: 'auto', paddingTop: 24, display: 'grid', gap: 8 }}>
                  <GithubReleaseLink
                    className="btn btn-crimson"
                    style={{ justifyContent: 'center', background: d.acc, boxShadow: 'none' }}
                  >
                    GitHub'da indir →
                  </GithubReleaseLink>
                  <Link to={d.to} className="btn btn-ghost" style={{ justifyContent: 'center', fontSize: 13 }}>
                    Sürüm sayfasına git
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 36,
              padding: '18px 22px',
              border: '1px solid var(--ink-line)',
              borderRadius: 6,
              background: 'var(--ink-2)',
              display: 'flex',
              alignItems: 'baseline',
              gap: 14,
              flexWrap: 'wrap',
            }}
          >
            <span className="mono" style={{ color: 'var(--crimson)' }}>!</span>
            <span style={{ fontSize: 14, color: 'var(--fg-soft)', flex: 1, minWidth: 280 }}>
              İndirdikten sonra SHA-256 özetini GitHub sürüm notlarından doğrulayın.
            </span>
            <GithubReleaseLink style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--saffron)' }}>
              {getGithubRepoUrl()}/releases
            </GithubReleaseLink>
          </div>
        </div>
      </section>

      <section className="section" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="ornament-wrap" style={{ left: '-200px', top: '10%' }}>
          <MandalaBg color="var(--saffron)" size={500} opacity={0.05} />
        </div>
        <div className="wrap" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 64, alignItems: 'start' }} className="story-grid">
            <div className="reveal">
              <SectionHead
                no="03"
                eyebrow="Kısa hikâye"
                title={
                  <>
                    2021'den <em>bugüne</em>.
                  </>
                }
                lede="İstanbul'da başlayan bir doktora çalışması, açık kaynak bir işletim sistemi projesine dönüştü."
              />
              <div style={{ marginTop: 36, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <span className="pill">
                  <span className="ldot" />
                  GPL-3.0
                </span>
                <span className="pill pill--saffron">
                  <span className="ldot" />
                  VAKIF · İSTANBUL
                </span>
              </div>
            </div>

            <div className="reveal" style={{ borderLeft: '1px solid var(--ink-line)' }}>
              {timeline.map(([y, t, b], i) => (
                <div
                  key={y}
                  style={{
                    padding: '32px 0 32px 40px',
                    position: 'relative',
                    borderBottom: i < timeline.length - 1 ? '1px solid var(--ink-line)' : 'none',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: -7,
                      top: 38,
                      width: 13,
                      height: 13,
                      borderRadius: '50%',
                      background: i === timeline.length - 1 ? 'var(--crimson)' : 'var(--ink-2)',
                      border: '1px solid ' + (i === timeline.length - 1 ? 'var(--crimson)' : 'var(--ink-line-2)'),
                      boxShadow: i === timeline.length - 1 ? '0 0 16px var(--crimson-glow)' : 'none',
                    }}
                  />
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
                    <span style={{ fontFamily: 'var(--display)', fontSize: 40, color: 'var(--ink)' }}>{y}</span>
                    <span className="mono" style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--crimson)' }}>
                      {t}
                    </span>
                  </div>
                  <p className="body" style={{ marginTop: 10, maxWidth: '60ch' }}>
                    {b}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="section"
        style={{ background: 'var(--ink-1)', borderTop: '1px solid var(--ink-line)', borderBottom: '1px solid var(--ink-line)' }}
      >
        <div className="wrap">
          <div className="reveal">
            <SectionHead
              no="04"
              eyebrow="Sıkça sorulan sorular"
              title={
                <>
                  Önceki <em>kullanıcılara</em> sorulanlar.
                </>
              }
            />
          </div>
          <div
            className="reveal"
            style={{
              marginTop: 64,
              border: '1px solid var(--ink-line)',
              borderRadius: 8,
              background: 'var(--ink-2)',
              overflow: 'hidden',
            }}
          >
            {faqs.map(([q, a], i) => {
              const open = openFaq === i;
              return (
                <div key={q} style={{ borderBottom: i < faqs.length - 1 ? '1px solid var(--ink-line)' : 'none' }}>
                  <button
                    onClick={() => setOpenFaq(open ? -1 : i)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '28px 32px',
                      display: 'grid',
                      gridTemplateColumns: '48px 1fr 40px',
                      gap: 18,
                      alignItems: 'baseline',
                      cursor: 'pointer',
                      background: open ? 'var(--ink-3)' : 'transparent',
                    }}
                  >
                    <span className="mono" style={{ color: 'var(--crimson)' }}>{String(i + 1).padStart(2, '0')}</span>
                    <span style={{ fontFamily: 'var(--display)', fontSize: 24, color: 'var(--ink)' }}>{q}</span>
                    <span
                      style={{
                        fontFamily: 'var(--serif)',
                        fontStyle: 'italic',
                        fontSize: 28,
                        color: 'var(--crimson)',
                        textAlign: 'right',
                        transform: open ? 'rotate(45deg)' : 'none',
                        transition: 'transform 0.2s ease',
                        display: 'inline-block',
                        lineHeight: 1,
                      }}
                    >
                      +
                    </span>
                  </button>
                  {open && (
                    <div style={{ padding: '0 32px 32px 98px' }}>
                      <p className="body" style={{ maxWidth: '66ch' }}>
                        {a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <TileBand color="var(--crimson)" height={24} />
      <section className="section" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="ornament-wrap" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', opacity: 1 }}>
          <MandalaBg color="var(--crimson)" size={600} opacity={0.05} />
        </div>
        <div className="wrap" style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <h2 className="h1 reveal" style={{ marginTop: 22 }}>
            Hazır mısınız? <em>İndirin</em>.
          </h2>
          <p className="lede reveal delay-1" style={{ marginInline: 'auto', marginTop: 24 }}>
            Güncel sürüm, kaynak kodu ve sürüm notları GitHub'da. Sorun bildirmek için Issues kullanın.
          </p>
          <div className="reveal delay-2" style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 40, flexWrap: 'wrap' }}>
            <GithubReleaseLink className="btn btn-crimson">GitHub'da indir →</GithubReleaseLink>
            <GithubReleaseLink variant="repo" className="btn btn-line">Depoyu aç</GithubReleaseLink>
          </div>
        </div>
      </section>
    </>
  );
}