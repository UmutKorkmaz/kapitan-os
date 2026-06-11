import Link from '../components/Link.jsx';
import { PageHead, SectionHead } from '../components/Shell.jsx';
import { MandalaBg, SectionOrnament } from '../components/Ornaments.jsx';
import { getSsotCommandCount, getAspirationalTargets } from '../lib/siteConfig.js';

const SSOT_COUNT = getSsotCommandCount();
const TARGETS = getAspirationalTargets();

const tpEvents = [
  { d: '24', m: 'MAY', t: 'KAPiTaN Konf 2026', l: 'İTÜ Maçka · İstanbul', tag: 'KONFERANS', spots: 180, total: 200, acc: 'var(--crimson)' },
  { d: '07', m: 'HAZ', t: 'Türkçe Komut Atölyesi', l: 'Çevrimiçi · Zoom', tag: 'ATÖLYE', spots: 42, total: 100, acc: 'var(--saffron)' },
  { d: '19', m: 'HAZ', t: 'AI Kod Sprint', l: 'METU Teknokent · Ankara', tag: 'HACKATHON', spots: 58, total: 80, acc: 'var(--turquoise)' },
  { d: '02', m: 'TEM', t: 'İzmir Buluşması', l: 'Tarihî Havagazı · İzmir', tag: 'MEETUP', spots: 31, total: 60, acc: 'var(--jade)' },
];

const tpContributors = [
  ['Aslı Demir', 'İstanbul', 'Çekirdek', 142, 'AD'],
  ['Mert Kaya', 'Berlin', 'Uçbirim', 118, 'MK'],
  ['Zeynep Öztürk', 'Ankara', 'Belgeler', 96, 'ZÖ'],
  ['Cem Yıldız', 'İzmir', 'KAPiTaN AI', 84, 'CY'],
  ['Ayşe Şahin', 'Antalya', 'Ofis paketi', 71, 'AŞ'],
  ['Emre Çelik', 'Bursa', 'Pazar altyapısı', 63, 'EÇ'],
];

const tpStats = [
  [String(SSOT_COUNT), 'SSOT komut (onaylı taslak)'],
  [String(TARGETS.gelistirici), 'Komut hedefi · aspirational'],
  ['3', 'Planlanan sürüm'],
  ['α', 'Alpha kanalı'],
];

const contribPaths = [
  ['Kod', 'Çekirdek, masaüstü, uygulamalar', 'GitHub üzerinden PR açın. Türkçe veya İngilizce kabul edilir.', '›'],
  ['Çeviri', 'Belgeler ve arayüz dizgileri', 'Weblate üzerinden çevrim içi. Tek satır bile değerli.', 'Α'],
  ['Belgeleme', 'Kılavuzlar ve eğitim', 'Yeni başlayanlar için Türkçe örnekler yazın.', '¶'],
  ['Tasarım', 'Arayüz, ikon, görsel kimlik', 'Figma kütüphanemiz açık; tasarım önerileri tartışılır.', '◇'],
  ['Test', 'Hata raporu ve geri bildirim', 'Gece sürümlerini deneyin, bulduklarınızı raporlayın.', '⏚'],
  ['Topluluk', 'Forum, mentörlük, etkinlikler', 'Yeni kullanıcılara yardım edin, atölye düzenleyin.', '◉'],
];

export default function Topluluk() {
  return (
    <>
      <PageHead
        crumbs={[{ label: 'Ana sayfa', to: '/' }, { label: 'Topluluk' }]}
        title={
          <>
            Türkçe yazılım <em>topluluğu</em>.
          </>
        }
        lede="KAPiTaN OS bir şirket değil; açık kaynak bir projedir. Forum, etkinlikler ve katkı yolları aşağıda. Alpha öncesi metrikler hedef veya taslak olarak işaretlenmiştir."
        ornamentColor="var(--saffron)"
      >
        <div style={{ display: 'flex', gap: 12, marginTop: 36, flexWrap: 'wrap' }}>
          <a href="#join" className="btn btn-crimson">
            Topluluğa katıl →
          </a>
          <a href="#contrib" className="btn btn-line">
            Katkıda bulun
          </a>
        </div>
      </PageHead>

      <section className="section" style={{ paddingBlock: 88 }}>
        <div className="wrap">
          <div
            className="reveal tp-stats"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 0,
              borderTop: '1px solid var(--ink-line)',
              borderBottom: '1px solid var(--ink-line)',
            }}
          >
            {tpStats.map(([n, l], i) => (
              <div
                key={l}
                style={{
                  padding: '48px 28px',
                  borderRight: i < 3 ? '1px solid var(--ink-line)' : 'none',
                }}
              >
                <div style={{ fontFamily: 'var(--display)', fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1, color: 'var(--ink)' }}>{n}</div>
                <div className="eyebrow" style={{ marginTop: 16, color: 'var(--saffron)' }}>
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="section"
        style={{
          background: 'var(--ink-1)',
          borderTop: '1px solid var(--ink-line)',
          borderBottom: '1px solid var(--ink-line)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="ornament-wrap" style={{ right: '-200px', top: '-100px' }}>
          <MandalaBg color="var(--saffron)" size={600} opacity={0.05} />
        </div>
        <div className="wrap" style={{ position: 'relative', zIndex: 2 }}>
          <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
            <SectionHead
              no="01"
              eyebrow="Yaklaşan etkinlikler"
              title={
                <>
                  Yan yana, <em>yüz yüze</em>.
                </>
              }
            />
            <span className="eyebrow">Planlanan · hedef takvim</span>
          </div>

          <div
            className="reveal"
            style={{ marginTop: 64, border: '1px solid var(--ink-line)', borderRadius: 8, overflow: 'hidden', background: 'var(--ink-2)' }}
          >
            {tpEvents.map((ev, i) => {
              const pct = (ev.spots / ev.total) * 100;
              return (
                <a
                  key={ev.t}
                  href="#"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '120px 1.6fr 1.2fr 140px 140px',
                    padding: '28px 32px',
                    alignItems: 'center',
                    borderBottom: i < tpEvents.length - 1 ? '1px solid var(--ink-line)' : 'none',
                    transition: 'background 0.15s ease',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--ink-3)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: ev.acc }} />
                  <div>
                    <div style={{ fontFamily: 'var(--display)', fontSize: 48, lineHeight: 1, color: 'var(--ink)' }}>{ev.d}</div>
                    <div className="mono" style={{ fontSize: 11, letterSpacing: '0.18em', color: ev.acc, marginTop: 6 }}>
                      {ev.m} 2026
                    </div>
                  </div>
                  <div>
                    <span className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', color: 'var(--sand)', textTransform: 'uppercase' }}>
                      {ev.tag}
                    </span>
                    <h3 style={{ fontFamily: 'var(--display)', fontSize: 30, lineHeight: 1.1, marginTop: 8 }}>{ev.t}</h3>
                  </div>
                  <div className="body" style={{ fontSize: 14 }}>
                    {ev.l}
                  </div>
                  <div>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--sand)', marginBottom: 6 }}>
                      {ev.spots}/{ev.total} doldu (hedef)
                    </div>
                    <div style={{ height: 3, background: 'var(--ink-line)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: pct + '%', background: ev.acc }} />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 20, color: ev.acc }}>Katıl →</span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section id="contrib" className="section">
        <div className="wrap">
          <div className="reveal">
            <SectionHead
              no="02"
              eyebrow="Nasıl katkıda bulunulur?"
              title={
                <>
                  Her yetenek için bir <em>yol</em>.
                </>
              }
              lede="Yazılımcı olmanız gerekmiyor; çeviri, belgeleme, tasarım ve test gibi pek çok alana katkıda bulunabilirsiniz."
            />
          </div>
          <div className="grid grid-3 reveal" style={{ marginTop: 64 }}>
            {contribPaths.map(([t, sub, b, glyph], i) => (
              <div key={t} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span
                    style={{
                      width: 42,
                      height: 42,
                      display: 'grid',
                      placeItems: 'center',
                      fontFamily: 'var(--display)',
                      fontSize: 22,
                      color: 'var(--crimson)',
                      border: '1px solid rgba(200,16,46,0.30)',
                      borderRadius: 6,
                    }}
                  >
                    {glyph}
                  </span>
                  <span className="mono" style={{ color: 'var(--crimson)', fontSize: 11 }}>
                    № 0{i + 1}
                  </span>
                </div>
                <h3 className="h3" style={{ marginTop: 22 }}>
                  {t}
                </h3>
                <div className="eyebrow" style={{ marginTop: 6 }}>
                  {sub}
                </div>
                <p className="body" style={{ marginTop: 16 }}>
                  {b}
                </p>
                <div style={{ marginTop: 26 }}>
                  <a href="#" className="tlink" style={{ fontSize: 13 }}>
                    Başla →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--ink-1)', borderTop: '1px solid var(--ink-line)', borderBottom: '1px solid var(--ink-line)' }}>
        <div className="wrap">
          <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
            <SectionHead
              no="03"
              eyebrow="Bu ay öne çıkanlar"
              title={
                <>
                  En çok <em>katkıda</em> bulunanlar.
                </>
              }
            />
            <span className="mono" style={{ color: 'var(--sand)' }}>
              Örnek veri · alpha öncesi
            </span>
          </div>

          <div
            className="reveal"
            style={{ marginTop: 64, border: '1px solid var(--ink-line)', borderRadius: 8, overflow: 'hidden', background: 'var(--ink-2)' }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 60px 1.4fr 1fr 1.2fr 120px',
                padding: '16px 24px',
                fontFamily: 'var(--mono)',
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--sand)',
                borderBottom: '1px solid var(--ink-line)',
                background: 'var(--ink-3)',
              }}
            >
              <span>№</span>
              <span />
              <span>İsim</span>
              <span>Şehir</span>
              <span>Alan</span>
              <span style={{ textAlign: 'right' }}>Katkı</span>
            </div>
            {tpContributors.map((c, i) => (
              <div
                key={c[0]}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '60px 60px 1.4fr 1fr 1.2fr 120px',
                  padding: '20px 24px',
                  alignItems: 'center',
                  borderBottom: i < tpContributors.length - 1 ? '1px solid var(--ink-line)' : 'none',
                }}
              >
                <span className="mono" style={{ color: 'var(--crimson)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--crimson), var(--burgundy))',
                    display: 'grid',
                    placeItems: 'center',
                    fontFamily: 'var(--display)',
                    fontSize: 13,
                    color: 'var(--ink)',
                  }}
                >
                  {c[4]}
                </span>
                <span style={{ fontFamily: 'var(--display)', fontSize: 22, color: 'var(--ink)' }}>{c[0]}</span>
                <span style={{ fontSize: 14, color: 'var(--sand)' }}>{c[1]}</span>
                <span style={{ fontSize: 14, color: 'var(--sand)' }}>{c[2]}</span>
                <span className="mono" style={{ textAlign: 'right', color: 'var(--ink)' }}>
                  {c[3]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section--loose section" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="ornament-wrap" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', opacity: 1 }}>
          <MandalaBg color="var(--crimson)" size={800} opacity={0.04} />
        </div>
        <div className="wrap" style={{ maxWidth: 920, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div className="reveal" style={{ display: 'inline-flex', marginBottom: 36 }}>
            <SectionOrnament color="var(--crimson)" width={200} />
          </div>
          <blockquote
            className="reveal"
            style={{
              fontFamily: 'var(--display)',
              fontSize: 'clamp(28px, 4vw, 52px)',
              lineHeight: 1.2,
              color: 'var(--ink)',
              margin: 0,
              textWrap: 'balance',
            }}
          >
            "Annem 64 yaşında, ilk defa kendi başına bilgisayar kullanıyor.{' '}
            <i style={{ fontFamily: 'var(--serif)', color: 'var(--crimson)' }}>Çünkü artık ekrandakini anlıyor.</i>"
          </blockquote>
          <div className="reveal delay-1" style={{ marginTop: 36 }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--sand)' }}>
              — Aslı Demir · Çekirdek geliştiricisi · İstanbul
            </span>
          </div>
        </div>
      </section>

      <section id="join" className="section" style={{ background: 'var(--ink-1)', borderTop: '1px solid var(--ink-line)' }}>
        <div className="wrap" style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto' }}>
          <div className="reveal kicker" style={{ justifyContent: 'center' }}>
            <span className="glyph" />
            <span style={{ color: 'var(--crimson)' }}>04</span>
            <span style={{ color: 'var(--fg-faint)' }}>·</span>
            <span>Forum</span>
          </div>
          <h2 className="h1 reveal" style={{ marginTop: 22 }}>
            Sorunuzu <em>sorun</em>.
          </h2>
          <p className="lede reveal delay-1" style={{ marginInline: 'auto', marginTop: 24 }}>
            Türkçe sorulara Türkçe yanıtlar. Özel forum bir hedef; şimdilik geri bildirim ve sorular GitHub üzerinden alınıyor.
          </p>
          <div className="reveal delay-2" style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 40, flexWrap: 'wrap' }}>
            <a href="https://github.com/UmutKorkmaz/kapitan-os/issues" target="_blank" rel="noopener noreferrer" className="btn btn-crimson">
              GitHub Issues →
            </a>
            <a href="https://github.com/UmutKorkmaz/kapitan-os/discussions" target="_blank" rel="noopener noreferrer" className="btn btn-line">
              GitHub Discussions
            </a>
          </div>
        </div>
      </section>
    </>
  );
}