import { useState } from 'react';
import Link from '../components/Link.jsx';
import SimulationBadge from '../components/SimulationBadge.jsx';
import { PageHead, SectionHead } from '../components/Shell.jsx';
import { MandalaBg, SectionOrnament, TileBand } from '../components/Ornaments.jsx';
import siteConfig, { getVersion } from '../lib/siteConfig.js';

const VERSION = getVersion();

const downloadOpts = [
  { name: 'Geliştirici', size: '4.2 GB', ram: '8 GB', acc: 'var(--crimson)', to: '/surumler/gelistirici' },
  { name: 'Ofis', size: '3.1 GB', ram: '4 GB', acc: 'var(--saffron)', to: '/surumler/ofis' },
  { name: 'Bar', size: '1.4 GB', ram: '2 GB', acc: 'var(--jade)', to: '/surumler/bar' },
];

const timeline = [
  ['2021', 'Fikir', "İTÜ'de bir bilgisayar mühendisliği doktora çalışması olarak başladı."],
  ['2022', 'İlk prototip', 'İlk prototip ve komut planı oluşturuldu.'],
  ['2023', 'Topluluk', 'Forum ve topluluk altyapısı planlandı.'],
  ['2024', 'Üç sürüm', 'Geliştirici, Ofis ve Bar olarak ayrıştırma tasarımı.'],
  ['2025', 'AI', 'KAPiTaN AI komut katmanı tasarlandı.'],
  ['2026', '0.1-alpha', '0.1-alpha web sitesi ve komut sözlüğü hizalandı.'],
];

const faqs = [
  [
    'Alpha sürümü indirebilir miyim?',
    'Henüz hayır. 0.1-alpha ISO build\'i tamamlandığında bu sayfada gerçek SHA-256 imzasıyla yayınlanacak. Şimdilik duyuru listesine katılabilirsiniz.',
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
    'Yapay zekâ özelliği bulutta mı çalışıyor?',
    'Hayır, KAPiTaN AI varsayılan olarak cihazınızda yerel çalışır. Bulut modu isteğe bağlıdır ve istediğiniz zaman kapatabilirsiniz.',
  ],
  [
    'Sürümler arası geçiş yapabilir miyim?',
    'Evet, sürümler arası geçiş her zaman ücretsizdir ve verileriniz korunur. Tek bir komutla istediğiniz sürüme geçebilirsiniz.',
  ],
  [
    'Türkçe karakterler her yerde destekleniyor mu?',
    'Evet, ı/İ ayrımı dâhil tüm Türkçe karakterler komutlarda, dosya adlarında ve uçbirimde tam olarak desteklenir.',
  ],
  [
    'Hangi donanım gereksinimleri var?',
    'Bar sürümü 2 GB RAM ile, Ofis sürümü 4 GB ile, Geliştirici sürümü 8 GB ile çalışır. Detaylar sürüm sayfalarındadır.',
  ],
];

function AlphaDownloadPanel() {
  const [chosen, setChosen] = useState(0);
  const opt = downloadOpts[chosen];
  const isoAvailable = siteConfig.features.isoDownload;

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
      {!isoAvailable && (
        <div
          className="sim-banner"
          style={{
            padding: '12px 16px',
            background: 'var(--ink-3)',
            borderBottom: '1px solid var(--ink-line)',
            fontSize: 13,
            color: 'var(--fg-soft)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexWrap: 'wrap',
          }}
        >
          <SimulationBadge variant="banner" />
          <span>Alpha ISO henüz yayınlanmadı. SHA-256 imzası yayın sonrası burada görünecek.</span>
        </div>
      )}

      <div style={{ position: 'absolute', right: -100, top: -100, opacity: 0.06, pointerEvents: 'none' }}>
        <MandalaBg color={opt.acc} size={400} opacity={1} />
      </div>

      <div style={{ padding: '40px 40px 32px', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          {downloadOpts.map((d, i) => (
            <button
              key={d.name}
              onClick={() => setChosen(i)}
              style={{
                padding: '10px 18px',
                borderRadius: 999,
                fontSize: 13,
                background: chosen === i ? d.acc : 'var(--ink-2)',
                color: chosen === i ? 'var(--pearl)' : 'var(--sand)',
                border: '1px solid ' + (chosen === i ? d.acc : 'var(--ink-line)'),
                cursor: 'pointer',
              }}
            >
              {d.name}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <span className="mono" style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--sand)', textTransform: 'uppercase' }}>
              kapitan.iso
            </span>
            <h3 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(48px, 5vw, 72px)', lineHeight: 1, marginTop: 14 }}>
              KAPiTaN OS {VERSION}{' '}
              <i style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: opt.acc }}>{opt.name}</i>
            </h3>
          </div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--sand)', letterSpacing: '0.14em', textAlign: 'right' }}>
            <div>SHA-256 · {isoAvailable ? '—' : '— (yayın sonrası)'}</div>
            <div style={{ marginTop: 4 }}>
              Min RAM: {opt.ram} · Boyut: {isoAvailable ? opt.size : 'Yakında'}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 48 }}>
          <p className="body" style={{ maxWidth: '60ch' }}>
            {isoAvailable
              ? 'Aşağıdaki düğmeye tıklayarak ISO indirme işlemini başlatın. İndirdikten sonra SHA-256 imzasını doğrulayın.'
              : '0.1-alpha ISO henüz yayınlanmadı. Yayınlandığında bu sayfada gerçek SHA-256 imzası ve indirme bağlantısı görünecek.'}
          </p>

          <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
            {isoAvailable ? (
              <button className="btn btn-crimson" style={{ background: opt.acc, boxShadow: `0 16px 40px -12px ${opt.acc}` }}>
                ISO indir ({opt.size}) →
              </button>
            ) : (
              <button className="btn btn-crimson" style={{ background: opt.acc, boxShadow: `0 16px 40px -12px ${opt.acc}` }}>
                Duyuru listesine yazıl →
              </button>
            )}
            <Link to={opt.to} className="btn btn-line">
              Sürüm sayfasına git
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hakkinda() {
  const [openFaq, setOpenFaq] = useState(0);
  const isoAvailable = siteConfig.features.isoDownload;

  return (
    <>
      <PageHead
        crumbs={[{ label: 'Ana sayfa', to: '/' }, { label: 'Hakkında & indir' }]}
        title={
          <>
            İndir, kur, <em>başla</em>.
          </>
        }
        lede="KAPiTaN OS ücretsiz, açık kaynak ve tamamen Türkçedir. Alpha sürümü geliştiriliyor; ISO yayınlandığında buradan indirebileceksiniz."
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
                  Hangi sürümü <em>seçeceksiniz</em>?
                </>
              }
              align="center"
            />
          </div>
          <div className="reveal" style={{ marginTop: 64 }}>
            <AlphaDownloadPanel />
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
              eyebrow="Doğrudan ISO"
              title={
                <>
                  İmza ve <em>kontrol</em>.
                </>
              }
            />
          </div>
          <div className="grid grid-3 reveal" style={{ marginTop: 64 }}>
            {downloadOpts.map((d, i) => (
              <div key={d.name} className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span className="mono" style={{ color: d.acc, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                    SÜRÜM № 0{i + 1}
                  </span>
                  <span className="mono" style={{ color: 'var(--sand)' }}>{isoAvailable ? d.size : 'Yakında'}</span>
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
                    <span className="eyebrow" style={{ color: 'var(--terminal-fg-muted)' }}>Min RAM</span>
                    <span className="terminal-panel__value">{d.ram}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="eyebrow" style={{ color: 'var(--terminal-fg-muted)' }}>Mimari</span>
                    <span className="terminal-panel__value">x86_64 · arm64</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="eyebrow" style={{ color: 'var(--terminal-fg-muted)' }}>SHA-256</span>
                    <span className="terminal-panel__value">
                      {isoAvailable ? '—' : '— (yayın sonrası)'}
                    </span>
                  </div>
                </div>
                <div style={{ marginTop: 'auto', paddingTop: 24, display: 'grid', gap: 8 }}>
                  <button
                    className="btn btn-crimson"
                    style={{ justifyContent: 'center', background: d.acc, boxShadow: 'none' }}
                    disabled={!isoAvailable}
                  >
                    {isoAvailable ? `ISO indir (${d.size}) →` : 'Yakında'}
                  </button>
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
              {isoAvailable
                ? 'İndirdikten sonra mutlaka SHA-256 imzayı doğrulayın. Komut:'
                : 'Alpha ISO yayınlandığında SHA-256 doğrulama komutu burada güncellenecek.'}
            </span>
            {isoAvailable && (
              <code style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--saffron)' }}>
                doğrula iso ./kapitan-{VERSION}.iso
              </code>
            )}
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
                lede="İstanbul'da başlayan bir doktora çalışması, açık kaynak bir işletim sistemi projesine dönüştü. 0.1-alpha ile web sitesi ve komut sözlüğü hizalanıyor."
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
          <div className="reveal kicker" style={{ justifyContent: 'center' }}>
            <span className="glyph" />
            <span style={{ color: 'var(--crimson)' }}>05</span>
            <span style={{ color: 'var(--fg-faint)' }}>·</span>
            <span>Bülten</span>
          </div>
          <h2 className="h1 reveal" style={{ marginTop: 22 }}>
            Yeni sürümler için <em>haber alın</em>.
          </h2>
          <p className="lede reveal delay-1" style={{ marginInline: 'auto', marginTop: 24 }}>
            Ayda bir, fazla değil. Alpha ISO yayınlandığında ilk siz haberdar olun.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="reveal delay-2"
            style={{
              marginTop: 40,
              display: 'flex',
              gap: 10,
              justifyContent: 'center',
              flexWrap: 'wrap',
              maxWidth: 540,
              marginInline: 'auto',
            }}
          >
            <input
              type="email"
              placeholder="e-posta@adresi.tr"
              style={{
                flex: 1,
                minWidth: 260,
                background: 'var(--ink-2)',
                border: '1px solid var(--ink-line)',
                color: 'var(--ink)',
                padding: '14px 22px',
                borderRadius: 999,
                fontFamily: 'var(--sans)',
                fontSize: 14,
                outline: 'none',
              }}
            />
            <button className="btn btn-crimson" type="submit">
              Abone ol →
            </button>
          </form>
          <div className="eyebrow reveal delay-3" style={{ marginTop: 20 }}>
            İstenmeyen posta yok. Tek tıkla çıkış.
          </div>
        </div>
      </section>
    </>
  );
}