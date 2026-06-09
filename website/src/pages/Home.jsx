/* Home — cinematic, Ottoman-modern */

import { useState, useEffect } from 'react';
import { Link, SectionHead } from '../components/Shell';
import GithubReleaseLink from '../components/GithubReleaseLink.jsx';
import { MandalaBg, StarSeal, HexRosette, Tugra, CornerOrnament } from '../components/Ornaments';
import { DraggableWindow, AIPrompt, LiveTerminal } from '../components/Interactive';
import SimulationBadge from '../components/SimulationBadge';
import siteConfig from '../config/site.json';
import { totalCommands, aspirationalTarget } from '../data/commands';

const { version, versionShort, simulation } = siteConfig;

/* ============================================================
   Hero — boot sequence + display headline + faux desktop preview
   ============================================================ */

function BootLine({ children, delay }) {
  return (
    <div className="fadein" style={{ animationDelay: delay + 'ms', opacity: 0 }}>
      <span className="prompt">›</span>{' '}
      <span style={{ color: 'var(--fg-soft)' }}>{children}</span>
    </div>
  );
}

function HomeHero() {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 2200);
    return () => clearTimeout(t1);
  }, []);

  return (
    <section style={{ position: 'relative', overflow: 'hidden', paddingTop: 60, paddingBottom: 100 }}>
      <div
        className="ornament-wrap"
        style={{
          right: '-220px',
          top: '-100px',
          opacity: stage ? 0.08 : 0.02,
          transition: 'opacity 1.4s ease',
        }}
      >
        <MandalaBg color="var(--crimson)" size={900} opacity={1} className="spin-slow" />
      </div>

      <div className="wrap" style={{ position: 'relative', zIndex: 2 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 48,
            paddingTop: 32,
          }}
        >
          <span className="eyebrow">№ 001 — Açılış sayısı</span>
          <span className="eyebrow">İstanbul · 17 Mayıs 2026 · {version}</span>
        </div>

        {stage === 0 && (
          <div
            style={{
              maxWidth: 520,
              margin: '0 0 32px',
              fontFamily: 'var(--mono)',
              fontSize: 13,
              lineHeight: 1.8,
              color: 'var(--sand)',
            }}
          >
            <BootLine delay={0}>kapitan-init {version} başlatılıyor…</BootLine>
            <BootLine delay={350}>çekirdek yüklendi · 6.8.0-kapitan</BootLine>
            <BootLine delay={650}>
              türkçe komut katmanı:{' '}
              <span style={{ color: 'var(--saffron)' }}>derleniyor ({totalCommands})</span>
            </BootLine>
            <BootLine delay={950}>
              kapitan-ai: <span style={{ color: 'var(--jade)' }}>planlanan · alpha</span>
            </BootLine>
            <BootLine delay={1300}>masaüstü oturumu açılıyor…</BootLine>
          </div>
        )}

        <h1 className={'display fadeup'} style={{ textWrap: 'balance', maxWidth: '14ch' }}>
          Komutları <span className="sub">Türkçe</span>
          <br />
          olan bir <i>işletim</i>
          <br />
          sistemi.
        </h1>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.3fr 1fr',
            gap: 64,
            marginTop: 64,
            alignItems: 'end',
          }}
          className="hero-foot"
        >
          <div className="fadeup delay-2">
            <p className="lede">
              Yapay zekâ destekli geliştirici araçlarından ofis çalışanlarına, sade bir deneyim arayanlara
              kadar — herkes için bir sürüm. Tüm uçbirim komutları, arayüz ve belgeler Türkçedir.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 36, flexWrap: 'wrap' }}>
              <GithubReleaseLink className="btn btn-crimson">
                GitHub'da indir <span className="arrow">→</span>
              </GithubReleaseLink>
              <Link to="/surumler" className="btn btn-line">
                Sürümleri karşılaştır
              </Link>
              <a href="#desktop-demo" className="btn btn-ghost">
                Masaüstünü dene →
              </a>
            </div>
          </div>
          <div className="colrule fadeup delay-3">
            <div className="eyebrow" style={{ marginBottom: 14 }}>
              Bu sürümde
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10, fontSize: 14 }}>
              {[
                [versionShort, 'KAPiTaN AI (planlanan)'],
                [String(totalCommands), 'Türkçe komut (alpha kapsamı)'],
                ['6.8', 'Linux çekirdek'],
                ['•', 'Wayland · Pipewire'],
              ].map(([n, t]) => (
                <li
                  key={t}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '56px 1fr',
                    gap: 14,
                    paddingBottom: 8,
                    borderBottom: '1px solid var(--ink-line)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 11,
                      color: 'var(--crimson)',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {n}
                  </span>
                  <span style={{ color: 'var(--fg-soft)' }}>{t}</span>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 24 }}>
              <button
                onClick={() =>
                  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
                }
                className="nav-cmd"
                style={{ padding: '8px 14px', width: '100%', justifyContent: 'space-between' }}
              >
                <span style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>komut paleti</span>
                <kbd>⌘K</kbd>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Ticker
   ============================================================ */

function HomeTicker() {
  const items = [
    'Bilgisayar kullanmak için İngilizce bilmek zorunda değilsiniz',
    'GPL-3.0 lisansı altında, tamamen açık kaynak',
    'Alpha sürümü — geri bildirim bekliyoruz',
    `${totalCommands} Türkçe komut (alpha kapsamı)`,
    'Yapay zekâ modeli cihazınızda çalışacak (planlanan)',
    'İstanbul, Ankara, İzmir ve Berlin ekipleri',
  ];
  const all = [...items, ...items, ...items];
  return (
    <div className="ticker">
      <div className="ticker-track">
        {all.map((it, i) => (
          <span key={i} className="item">
            <span className="star" />
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   Faux Desktop demo — Section
   ============================================================ */

function FauxDesktop() {
  const [active, setActive] = useState('term');

  const apps = [
    { id: 'term', label: 'Uçbirim', glyph: '›' },
    { id: 'mail', label: 'EpostaYöneticisi', glyph: '@' },
    { id: 'files', label: 'Dosyalar', glyph: '⎘' },
    { id: 'ai', label: 'KAPiTaN AI', glyph: 'K' },
    { id: 'pazar', label: 'Pazar', glyph: '⌂' },
  ];

  return (
    <section id="desktop-demo" className="section" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="ornament-wrap" style={{ left: '-200px', top: '10%' }}>
        <MandalaBg color="var(--saffron)" size={700} opacity={0.04} />
      </div>
      <div className="wrap" style={{ position: 'relative', zIndex: 2 }}>
        <div
          className="reveal"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: 24,
          }}
        >
          <SectionHead
            no="01"
            eyebrow="Masaüstüne göz atın"
            title={
              <>
                KAPiTaN OS <em>masaüstü</em>.
              </>
            }
            lede="Aşağıdaki masaüstü bir simülasyondur — gerçek KAPiTaN OS değildir. Uygulamalara tıklayın, pencereleri taşıyın, uçbirimi deneyin."
          />
          <div style={{ display: 'flex', gap: 10 }}>
            <SimulationBadge />
          </div>
        </div>

        <div className="reveal faux-desktop__shell">
          <div className="sim-banner" role="note">
            {simulation.disclaimer}
          </div>

          <div className="faux-desktop__titlebar">
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
              <StarSeal size={14} color="var(--crimson)" stroke={1} /> KAPiTaN
              <SimulationBadge variant="inline" />
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 18, whiteSpace: 'nowrap' }}>
              <span style={{ whiteSpace: 'nowrap' }}>Salı 17 Mayıs · 09:14</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
                <span
                  style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--jade)' }}
                />
                wlan · 145 mbps
              </span>
              <span>%82</span>
            </span>
          </div>

          <div className="faux-desktop__workspace">
            <div
              style={{ position: 'absolute', right: '8%', top: '10%', opacity: 0.08, pointerEvents: 'none' }}
            >
              <HexRosette size={300} color="var(--saffron)" stroke={0.4} />
            </div>

            <DraggableWindow
              title="uçbirim"
              x={36}
              y={28}
              width={400}
              z={active === 'term' ? 4 : 1}
              accent="var(--crimson)"
              onFocus={() => setActive('term')}
            >
              <div style={{ fontFamily: 'var(--mono)', fontSize: 13, lineHeight: 1.7 }}>
                <div>
                  <span className="prompt" style={{ color: 'var(--crimson)' }}>
                    ›
                  </span>{' '}
                  <span style={{ color: 'var(--ink)' }}>sistem</span>{' '}
                  <span style={{ color: 'var(--ink-faint)' }}># kısa: sis</span>
                </div>
                <div style={{ color: 'var(--ink-mute)' }}>
                  KAPiTaN OS {version} — önizleme
                </div>
                <div style={{ color: 'var(--ink-mute)' }}>Çekirdek: 6.8.0-kapitan</div>
                <div style={{ color: 'var(--ink-mute)' }}>Bellek: 14.2/16 GB · CPU: %23</div>
                <div>&nbsp;</div>
                <div>
                  <span className="prompt" style={{ color: 'var(--crimson)' }}>
                    ›
                  </span>{' '}
                  <span style={{ color: 'var(--ink)' }}>listele ~/projeler</span>{' '}
                  <span style={{ color: 'var(--ink-faint)' }}># kısa: lis</span>
                </div>
                <div style={{ color: 'var(--ink-mute)' }}>
                  kapitan-ai/ rapor.docx pazar-katki/ notlar.md
                </div>
                <div>&nbsp;</div>
                <div>
                  <span className="prompt" style={{ color: 'var(--crimson)' }}>
                    ›
                  </span>{' '}
                  <span className="caret" />
                </div>
              </div>
            </DraggableWindow>

            <DraggableWindow
              title="EpostaYöneticisi"
              x={470}
              y={28}
              width={380}
              z={active === 'mail' ? 4 : 2}
              accent="var(--saffron)"
              onFocus={() => setActive('mail')}
            >
              <div style={{ display: 'grid', gap: 12, fontSize: 13 }}>
                {[
                  ['Ahmet Y.', 'Proje güncellemesi', '09:14', 'ÖNEMLİ'],
                  ['KAPiTaN AI', 'Toplantı özeti hazır', '08:42', 'AI'],
                  ['Zeynep K.', 'Rapor değerlendirmesi', 'dün', null],
                  ['Pazar', '2 güncelleme bekliyor', 'dün', null],
                ].map((m, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      padding: '8px 0',
                      borderBottom: i < 3 ? '1px solid var(--ink-line)' : 'none',
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                        <span style={{ fontWeight: 500, color: 'var(--ink)' }}>{m[0]}</span>
                        {m[3] && (
                          <span
                            className="mono"
                            style={{
                              fontSize: 9,
                              padding: '1px 6px',
                              border:
                                '1px solid ' + (m[3] === 'AI' ? 'var(--crimson)' : 'var(--saffron)'),
                              color: m[3] === 'AI' ? 'var(--crimson)' : 'var(--saffron)',
                              borderRadius: 2,
                              letterSpacing: '0.16em',
                            }}
                          >
                            {m[3]}
                          </span>
                        )}
                      </div>
                      <div style={{ color: 'var(--sand)', fontSize: 12, marginTop: 2 }}>{m[1]}</div>
                    </div>
                    <span className="mono" style={{ fontSize: 11, color: 'var(--fg-faint)' }}>
                      {m[2]}
                    </span>
                  </div>
                ))}
              </div>
            </DraggableWindow>

            <DraggableWindow
              title="Dosyalar — ~/projeler"
              x={36}
              y={360}
              width={400}
              z={active === 'files' ? 4 : 1}
              accent="var(--turquoise)"
              onFocus={() => setActive('files')}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
                {[
                  ['📁', 'kapitan-ai'],
                  ['📁', 'pazar-katki'],
                  ['📄', 'rapor.docx'],
                  ['📄', 'notlar.md'],
                  ['📁', 'tasarım'],
                  ['📁', 'docs'],
                  ['🎨', 'logo.svg'],
                  ['🎬', 'demo.mp4'],
                ].map(([g, n]) => (
                  <div
                    key={n}
                    style={{
                      display: 'grid',
                      placeItems: 'center',
                      textAlign: 'center',
                      gap: 6,
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontSize: 28, lineHeight: 1 }}>{g}</div>
                    <div style={{ fontSize: 11, color: 'var(--fg-soft)' }}>{n}</div>
                  </div>
                ))}
              </div>
            </DraggableWindow>

            <DraggableWindow
              title="KAPiTaN AI · sor"
              x={470}
              y={360}
              width={380}
              z={active === 'ai' ? 4 : 1}
              accent="var(--jade)"
              onFocus={() => setActive('ai')}
            >
              <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
                <div
                  style={{
                    padding: '8px 12px',
                    background: 'var(--paper-2)',
                    border: '1px solid var(--paper-line)',
                    borderRadius: '10px 10px 4px 10px',
                    maxWidth: '80%',
                    marginLeft: 'auto',
                    marginBottom: 10,
                    color: 'var(--ink)',
                  }}
                >
                  Bir hata mesajı var, ne yapmalıyım?
                </div>
                <div
                  style={{
                    padding: '10px 12px',
                    background: 'rgba(42,111,74,0.08)',
                    border: '1px solid rgba(42,111,74,0.28)',
                    borderRadius: '10px 10px 10px 4px',
                    maxWidth: '88%',
                    color: 'var(--ink)',
                  }}
                >
                  <span style={{ color: 'var(--jade)', fontWeight: 600 }}>KAPiTaN AI:</span> Çözümlüyorum.{' '}
                  <code style={{ fontFamily: 'var(--mono)', color: 'var(--saffron-deep)' }}>
                    ayıkla --son
                  </code>{' '}
                  komutunu çalıştırırsanız son hatayı Türkçe açıklayabilirim.
                </div>
              </div>
            </DraggableWindow>

            <DraggableWindow
              title="KAPiTaN Pazar"
              x={260}
              y={200}
              width={360}
              z={active === 'pazar' ? 4 : 1}
              accent="var(--saffron)"
              onFocus={() => setActive('pazar')}
            >
              <div style={{ display: 'grid', gap: 10, fontSize: 13 }}>
                {[
                  ['KodDüzenleyici', 'Geliştirici', '★ 4.9'],
                  ['OfisPaketi', 'Ofis', '★ 4.7'],
                  ['GüvenlikDuvarı', 'Güvenlik', '★ 4.8'],
                ].map(([name, cat, rating]) => (
                  <div
                    key={name}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 12px',
                      background: 'var(--paper-2)',
                      border: '1px solid var(--paper-line)',
                      borderRadius: 6,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 500, color: 'var(--ink)' }}>{name}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 2 }}>{cat}</div>
                    </div>
                    <span className="mono" style={{ fontSize: 11, color: 'var(--saffron)' }}>
                      {rating}
                    </span>
                  </div>
                ))}
                <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--ink-faint)' }}>
                  Simüle pazar önizlemesi — gerçek kurulum yoktur.
                </p>
              </div>
            </DraggableWindow>
          </div>

          <div className="faux-desktop__dock" role="toolbar" aria-label="Masaüstü uygulamaları">
            {apps.map((a) => (
              <button
                key={a.id}
                type="button"
                className={'faux-desktop__dock-btn' + (active === a.id ? ' is-active' : '')}
                onClick={() => setActive(a.id)}
                title={a.label}
                aria-label={a.label}
                aria-pressed={active === a.id}
              >
                {a.glyph}
              </button>
            ))}
          </div>
        </div>

        <p
          className="mono reveal"
          style={{
            marginTop: 18,
            color: 'var(--sand)',
            textAlign: 'center',
            fontSize: 12,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          Şekil 01 — Simüle masaüstü önizlemesi. Pencereleri sürüklenebilir.
        </p>
      </div>
    </section>
  );
}

/* ============================================================
   Editions
   ============================================================ */

function HomeEditions() {
  const cards = [
    {
      tag: 'Sürüm 01',
      name: 'Geliştirici',
      acc: 'var(--crimson)',
      accSoft: 'rgba(200,16,46,0.10)',
      lede: `Yapay zekâ destekli IDE, ${totalCommands} komut (alpha) · ${aspirationalTarget} hedef, Python · Rust · Go önyüklü.`,
      to: '/surumler/gelistirici',
      cmd: 'kod',
      size: '4.2 GB',
    },
    {
      tag: 'Sürüm 02',
      name: 'Ofis',
      acc: 'var(--saffron)',
      accSoft: 'rgba(232,178,62,0.10)',
      lede: 'Türkçe ofis paketi, akıllı e-posta, AI yazı asistanı. DOCX, XLSX, PPTX uyumlu.',
      to: '/surumler/ofis',
      cmd: 'belge',
      size: '3.1 GB',
    },
    {
      tag: 'Sürüm 03',
      name: 'Bar',
      acc: 'var(--jade)',
      accSoft: 'rgba(63,142,99,0.10)',
      lede: 'Sadece sekiz uygulama. 15 saniyede açılır. Eski donanım, kiosk, ev kullanımı için.',
      to: '/surumler/bar',
      cmd: 'tarayici',
      size: '1.4 GB',
    },
  ];
  return (
    <section className="section" style={{ position: 'relative' }}>
      <div className="wrap">
        <div className="reveal">
          <SectionHead
            no="02"
            eyebrow="Üç sürüm — bir çekirdek"
            title={
              <>
                Her kullanıcı için ayrı bir <em>sürüm</em>.
              </>
            }
            lede="Aynı çekirdek, aynı dil, üç farklı kişilik. Sürümler arası geçiş her zaman ücretsiz."
          />
        </div>
        <div className="grid grid-3 reveal" style={{ marginTop: 64 }}>
          {cards.map((c) => (
            <Link
              key={c.name}
              to={c.to}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: c.accSoft,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', top: -30, right: -30, opacity: 0.1 }}>
                <HexRosette size={180} color={c.acc} stroke={0.5} />
              </div>
              <div
                style={{
                  position: 'relative',
                  zIndex: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span
                    className="mono"
                    style={{ color: c.acc, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase' }}
                  >
                    {c.tag}
                  </span>
                  <span className="mono" style={{ color: 'var(--sand)', fontSize: 11 }}>
                    {c.size}
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--display)',
                    fontSize: 54,
                    lineHeight: 1.02,
                    marginTop: 24,
                    letterSpacing: '-0.005em',
                  }}
                >
                  <i style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: c.acc }}>{c.name}</i> sürümü
                </h3>
                <p className="body" style={{ marginTop: 18, minHeight: '6.6em' }}>
                  {c.lede}
                </p>
                <div className="cmd-strip">
                  <span className="cmd-strip__prompt">›</span>
                  <span>{c.cmd}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginTop: 'auto',
                    paddingTop: 28,
                  }}
                >
                  <span className="eyebrow">İncele</span>
                  <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 22, color: c.acc }}>
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Manifesto with AI prompt
   ============================================================ */

function HomeManifesto() {
  return (
    <section
      className="section--loose section"
      style={{ background: 'var(--ink-1)', position: 'relative', overflow: 'hidden' }}
    >
      <div className="ornament-wrap" style={{ right: '-180px', bottom: '-220px' }}>
        <MandalaBg color="var(--crimson)" size={780} opacity={0.05} className="spin-slow" />
      </div>
      <div className="wrap" style={{ position: 'relative', zIndex: 2 }}>
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 80, alignItems: 'start' }}
          className="man-grid"
        >
          <div className="reveal">
            <div className="kicker">
              <span className="glyph" />
              <span style={{ color: 'var(--crimson)' }}>03</span>
              <span style={{ color: 'var(--fg-faint)' }}>·</span>
              <span>Manifesto</span>
            </div>
            <h2 className="h1" style={{ marginTop: 22 }}>
              Teknolojiyi <i>ana dilinizde</i> yaşayın.
            </h2>
            <p className="lede" style={{ marginTop: 32, maxWidth: '40ch' }}>
              Bilgisayar kullanmak için İngilizce bilmek zorunda değilsiniz. KAPiTaN OS'ta tüm komutlar, tüm
              arayüzler ve tüm belgeler Türkçedir — çevirilerle değil, ana dil olarak tasarlandı.
            </p>
            <div style={{ marginTop: 48 }}>
              <div style={{ display: 'grid', gap: 0 }}>
                {[
                  [String(totalCommands), 'Türkçe uçbirim komutu (alpha kapsamı)'],
                  [String(aspirationalTarget), 'Komut hedefi (aspirasyonel)'],
                  ['12', 'Yerleşik ofis uygulaması (planlanan)'],
                  ['1.2K+', 'Pazar yazılımı (hedef)'],
                ].map(([n, l], i) => (
                  <div
                    key={l}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '140px 1fr',
                      padding: '20px 0',
                      alignItems: 'baseline',
                      borderTop: i === 0 ? '1px solid var(--ink-line)' : 'none',
                      borderBottom: '1px solid var(--ink-line)',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--display)',
                        fontSize: 'clamp(28px, 3vw, 40px)',
                        color: 'var(--ink)',
                      }}
                    >
                      {n}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--mono)',
                        fontSize: 11,
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color: 'var(--sand)',
                      }}
                    >
                      {l}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="reveal delay-2">
            <AIPrompt
              placeholder="örnek: bana bir dosya silme komutu öner"
              presets={['Neden Türkçe?', 'Dosya kopyalama nasıl yapılır?', 'Bana bir hoşgeldin metni yaz']}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 18,
                fontFamily: 'var(--mono)',
                fontSize: 11,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--sand)',
              }}
            >
              <span>Şekil 02 — KAPiTaN AI · simülasyon</span>
              <span>planlanan</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Try Terminal
   ============================================================ */

function HomeTerminal() {
  return (
    <section className="section">
      <div className="wrap">
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 64, alignItems: 'start' }}
          className="cmd-grid"
        >
          <div className="reveal">
            <SectionHead
              no="04"
              eyebrow="Şimdi siz deneyin"
              title={
                <>
                  Bir <em>komut</em> yazın.
                </>
              }
              lede={
                <>
                  Aşağıdaki uçbirim bir simülasyondur. Türkçe komutlar yazıp çıktıyı görebilirsiniz.{' '}
                  <code style={{ fontFamily: 'var(--mono)', color: 'var(--saffron)' }}>yardım</code> yazarak
                  başlayın.
                </>
              }
            />
            <div style={{ marginTop: 32, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link to="/komutlar" className="btn btn-line">
                Tam rehber →
              </Link>
              <span className="pill">
                <span className="ldot" />
                {totalCommands} KOMUT
              </span>
              <SimulationBadge />
            </div>
          </div>
          <div className="reveal delay-1">
            <LiveTerminal title="kapitan@deneme ~ uçbirim" height={360} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Pazar preview
   ============================================================ */

function HomePazar() {
  const apps = [
    { name: 'KodDüzenleyici', cat: 'Geliştirici', rating: 4.9, color: 'var(--crimson)', glyph: 'K' },
    { name: 'YapayZekâ', cat: 'Yapay zekâ', rating: 4.8, color: 'var(--ember)', glyph: 'Y' },
    { name: 'OfisPaketi', cat: 'Ofis', rating: 4.7, color: 'var(--saffron)', glyph: 'O' },
    { name: 'GüvenlikDuvarı', cat: 'Güvenlik', rating: 4.8, color: 'var(--turquoise)', glyph: 'G' },
    { name: 'MedyaOynatıcı', cat: 'Medya', rating: 4.6, color: 'var(--jade)', glyph: 'M' },
    { name: 'ÇizimTaslağım', cat: 'Tasarım', rating: 4.5, color: '#A555BB', glyph: 'Ç' },
  ];
  return (
    <section
      className="section"
      style={{
        background: 'var(--ink-1)',
        borderTop: '1px solid var(--ink-line)',
        borderBottom: '1px solid var(--ink-line)',
      }}
    >
      <div className="wrap">
        <div
          className="reveal"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: 32,
            flexWrap: 'wrap',
          }}
        >
          <SectionHead
            no="05"
            eyebrow="KAPiTaN Pazar"
            title={
              <>
                İhtiyacınız olan <em>her şey</em>, tek tıkla.
              </>
            }
            lede="1 200+ Türkçe arayüzlü yazılım (hedef)."
          />
          <Link to="/pazar" className="tlink">
            Tüm yazılımları gör →
          </Link>
        </div>

        <div className="grid grid-3 reveal" style={{ marginTop: 56 }}>
          {apps.map((a) => (
            <div key={a.name} className="card" style={{ background: 'var(--ink-2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 8,
                    background: `linear-gradient(135deg, ${a.color}, transparent)`,
                    border: '1px solid ' + a.color,
                    display: 'grid',
                    placeItems: 'center',
                    fontFamily: 'var(--display)',
                    fontSize: 24,
                    color: 'var(--ink)',
                  }}
                >
                  {a.glyph}
                </div>
                <span className="mono" style={{ color: 'var(--saffron)' }}>
                  ★ {a.rating}
                </span>
              </div>
              <h4 className="h4" style={{ marginTop: 18 }}>
                {a.name}
              </h4>
              <div className="eyebrow" style={{ marginTop: 4 }}>
                {a.cat}
              </div>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 22 }}
              >
                <code style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--sand)' }}>
                  kur {a.name.toLowerCase()}
                </code>
                <button className="btn btn-line" style={{ padding: '7px 14px', fontSize: 11 }}>
                  Kur
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Why grid
   ============================================================ */

function HomeWhy() {
  const reasons = [
    {
      n: '01',
      t: 'Ana dilde kontrol',
      b: 'Her komut, her menü, her hata mesajı Türkçe — çevirilerle değil, ana dil olarak tasarlandı.',
    },
    {
      n: '02',
      t: 'Yerel yapay zekâ',
      b: 'KAPiTaN AI bilgisayarınızda çalışır. Veriniz cihazdan çıkmaz, bulut zorunluluğu yoktur.',
    },
    {
      n: '03',
      t: 'Bilinçli sadelik',
      b: 'Üç ayrı sürüm; kullanıcı ihtiyaçlarına göre derlenmiş, her şey yüklü gelmez.',
    },
    {
      n: '04',
      t: 'POSIX uyumlu',
      b: 'Mevcut Linux araç ve betikleriniz çalışmaya devam eder; Türkçe katman üstüne eklenir.',
    },
  ];
  return (
    <section className="section">
      <div className="wrap">
        <div className="reveal">
          <SectionHead
            no="06"
            eyebrow="Neden KAPiTaN?"
            title={
              <>
                Bir <em>tercih</em>, dört nedene yaslanır.
              </>
            }
          />
        </div>
        <div className="grid grid-2 reveal" style={{ marginTop: 64, gap: 0, borderTop: '1px solid var(--ink-line)' }}>
          {reasons.map((r, i) => (
            <div
              key={r.n}
              style={{
                padding: '48px 40px',
                borderBottom: '1px solid var(--ink-line)',
                borderRight: i % 2 === 0 ? '1px solid var(--ink-line)' : 'none',
                position: 'relative',
              }}
            >
              {i === 0 && <CornerOrnament size={28} color="var(--crimson)" />}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span className="mono" style={{ color: 'var(--crimson)' }}>
                  № {r.n}
                </span>
                <span className="mono" style={{ color: 'var(--sand)' }}>
                  {String(i + 1).padStart(2, '0')} / 04
                </span>
              </div>
              <h3 className="h3" style={{ marginTop: 20 }}>
                {r.t}
              </h3>
              <p className="body" style={{ marginTop: 16, maxWidth: '44ch' }}>
                {r.b}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Final CTA
   ============================================================ */

function HomeFinal() {
  return (
    <section className="section--loose section" style={{ position: 'relative', overflow: 'hidden' }}>
      <div
        className="ornament-wrap"
        style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', opacity: 1 }}
      >
        <MandalaBg color="var(--crimson)" size={900} opacity={0.07} className="spin-slow" />
      </div>
      <div className="wrap" style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <div className="reveal" style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: 32 }}>
          <Tugra width={260} height={90} color="var(--crimson)" />
        </div>
        <h2 className="display reveal" style={{ fontSize: 'clamp(56px, 9vw, 144px)', textWrap: 'balance' }}>
          KAPiTaN'ı bugün <i>indirin</i>.
        </h2>
        <p className="lede reveal delay-1" style={{ marginInline: 'auto', marginTop: 36 }}>
          Ücretsiz, açık kaynak, tamamen Türkçe. Güncel sürüm GitHub Releases üzerinden indirilir.
        </p>
        <div
          className="reveal delay-2"
          style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 44, flexWrap: 'wrap' }}
        >
          <GithubReleaseLink className="btn btn-crimson" style={{ padding: '16px 28px', fontSize: 15 }}>
            GitHub'da indir →
          </GithubReleaseLink>
          <Link to="/surumler" className="btn btn-line" style={{ padding: '16px 24px' }}>
            Sürümleri karşılaştır
          </Link>
        </div>
        <div
          className="reveal delay-3"
          style={{ display: 'flex', gap: 80, justifyContent: 'center', marginTop: 80, flexWrap: 'wrap' }}
        >
          {[
            [versionShort, 'Alpha sürümü'],
            [String(totalCommands), 'Komut (SSOT)'],
            [String(aspirationalTarget), 'Komut hedefi (aspirasyonel)'],
          ].map(([n, l]) => (
            <div key={l}>
              <div
                style={{
                  fontFamily: 'var(--display)',
                  fontSize: 'clamp(48px, 5vw, 76px)',
                  lineHeight: 1,
                  color: 'var(--ink)',
                }}
              >
                {n}
              </div>
              <div className="eyebrow" style={{ marginTop: 14 }}>
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <HomeHero />
      <HomeTicker />
      <FauxDesktop />
      <HomeEditions />
      <HomeManifesto />
      <HomeTerminal />
      <HomePazar />
      <HomeWhy />
      <HomeFinal />
    </>
  );
}