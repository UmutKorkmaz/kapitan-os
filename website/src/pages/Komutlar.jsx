import { useState } from 'react';
import LiveTerminal from '../components/LiveTerminal.jsx';
import { PageHead, SectionHead } from '../components/Shell.jsx';
import { MandalaBg } from '../components/Ornaments.jsx';
import useCommands, { searchCommands } from '../hooks/useCommands.js';

function CmdTable({ rows, showGroup, accent = 'var(--crimson)' }) {
  const cols = showGroup
    ? '120px 110px 1fr 90px 1.6fr'
    : '130px 1fr 110px 1.7fr';
  return (
    <div style={{ border: '1px solid var(--ink-line)', borderRadius: 8, overflow: 'hidden', background: 'var(--ink-2)' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: cols,
        padding: '18px 24px',
        background: 'var(--ink-3)',
        borderBottom: '1px solid var(--ink-line)',
        fontFamily: 'var(--mono)',
        fontSize: 11,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'var(--sand)',
      }}
      >
        {showGroup && <span>Grup</span>}
        <span>POSIX</span>
        <span style={{ color: accent }}>KAPiTaN</span>
        <span>Kısa</span>
        <span>Açıklama</span>
      </div>
      {rows.map((r, i) => (
        <div
          key={i}
          style={{
            display: 'grid',
            gridTemplateColumns: cols,
            padding: '16px 24px',
            alignItems: 'baseline',
            borderBottom: i < rows.length - 1 ? '1px solid var(--ink-line)' : 'none',
            background: i % 2 === 0 ? 'transparent' : 'var(--ink-wash)',
            transition: 'background 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--crimson-wash)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'var(--ink-wash)'; }}
        >
          {showGroup && <span className="mono" style={{ fontSize: 12, color: 'var(--sand)' }}>{r.group}</span>}
          <code style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--sand)' }}>{r[0]}</code>
          <code style={{ fontFamily: 'var(--mono)', fontSize: 14, color: accent, fontWeight: 500 }}>{r[1]}</code>
          <code style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--ink)', opacity: 0.85 }}>{r[2]}</code>
          <span style={{ fontSize: 14, color: 'var(--fg-soft)' }}>{r[3]}</span>
        </div>
      ))}
    </div>
  );
}

export default function Komutlar() {
  const { cmdGroups, totalCommands } = useCommands();
  const [active, setActive] = useState('dosya');
  const [q, setQ] = useState('');

  const currentGroup = cmdGroups.find((g) => g.key === active);
  const allRows = searchCommands(cmdGroups, q)?.map(({ row, group }) => {
    const hit = [...row];
    hit.group = group;
    return hit;
  });

  return (
    <>
      <PageHead
        crumbs={[{ label: 'Ana sayfa', to: '/' }, { label: 'Komutlar' }]}
        title={<>Komut <em>rehberi</em>.</>}
        lede={`${totalCommands} Türkçe uçbirim komutu, POSIX karşılığı ve kısa aliasıyla birlikte. Hem İngilizce komutlarınızı kullanabilir, hem Türkçe uzun adıyla, hem de iki-üç harflik kısa biçimiyle çağırabilirsiniz.`}
        ornamentColor="var(--crimson)"
      >
        <div style={{
          display: 'flex',
          gap: 14,
          alignItems: 'center',
          marginTop: 36,
          border: '1px solid var(--ink-line-2)',
          borderRadius: 999,
          padding: '8px 8px 8px 24px',
          background: 'var(--ink-2)',
          maxWidth: 520,
        }}
        >
          <span style={{ fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--crimson)' }}>›</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="komut ara — örneğin: kopyala, ls, sil, kp"
            style={{
              flex: 1,
              border: 0,
              background: 'transparent',
              outline: 'none',
              fontFamily: 'var(--mono)',
              fontSize: 14,
              padding: '8px 0',
              color: 'var(--ink)',
            }}
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ('')}
              className="mono"
              style={{ color: 'var(--sand)', fontSize: 12, paddingRight: 14 }}
            >
              Temizle ×
            </button>
          )}
        </div>
      </PageHead>

      {!q && (
        <section style={{ padding: '48px 0 0', background: 'var(--ink-1)', borderBottom: '1px solid var(--ink-line)' }}>
          <div className="wrap" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 32 }}>
            {cmdGroups.map((g) => (
              <button
                key={g.key}
                type="button"
                onClick={() => setActive(g.key)}
                style={{
                  padding: '14px 20px',
                  borderRadius: 6,
                  fontSize: 13,
                  fontFamily: 'var(--sans)',
                  background: active === g.key ? 'var(--crimson)' : 'var(--ink-2)',
                  color: active === g.key ? 'var(--pearl)' : 'var(--fg-soft)',
                  border: `1px solid ${active === g.key ? 'var(--crimson)' : 'var(--ink-line)'}`,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12,
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ fontFamily: 'var(--display)', fontSize: 16, opacity: 0.9 }}>{g.glyph}</span>
                {g.label}
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, opacity: 0.7 }}>{g.count}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <div className="wrap">
          {q ? (
            <>
              <SectionHead
                no="—"
                eyebrow="Arama sonuçları"
                title={<>«{q}» için <em>{allRows?.length ?? 0} sonuç</em></>}
              />
              <div style={{ marginTop: 48 }}>
                <CmdTable rows={allRows ?? []} showGroup />
              </div>
            </>
          ) : currentGroup && (
            <>
              <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
                <SectionHead
                  no={String(cmdGroups.findIndex((g) => g.key === active) + 1).padStart(2, '0')}
                  eyebrow={currentGroup.label}
                  title={<><em>{currentGroup.count}</em> komut bu grupta.</>}
                />
                <span className="mono" style={{ color: 'var(--sand)' }}>
                  {currentGroup.rows.length}
                  {' '}
                  listeleniyor
                </span>
              </div>
              <div className="reveal" style={{ marginTop: 56 }}>
                <CmdTable rows={currentGroup.rows} />
              </div>
            </>
          )}
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
        <div className="ornament-wrap" style={{ right: '-180px', top: '10%' }}>
          <MandalaBg color="var(--crimson)" size={600} opacity={0.05} />
        </div>
        <div className="wrap" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 64, alignItems: 'start' }} className="try-grid">
            <div className="reveal">
              <SectionHead
                no="—"
                eyebrow="Üç ad, tek komut"
                title={<>POSIX, uzun, kısa — <em>hepsi aynı</em>.</>}
                lede={(
                  <>
                    Aynı işi üç şekilde çağırabilirsiniz.
                    {' '}
                    <code style={{ fontFamily: 'var(--mono)', color: 'var(--saffron)' }}>ls</code>
                    ,
                    {' '}
                    <code style={{ fontFamily: 'var(--mono)', color: 'var(--saffron)' }}>listele</code>
                    {' '}
                    ve
                    {' '}
                    <code style={{ fontFamily: 'var(--mono)', color: 'var(--saffron)' }}>lst</code>
                    {' '}
                    aynı dizini gösterir. Hangisi alışkanlığınızdaysa onu kullanın.
                  </>
                )}
              />
              <div style={{ marginTop: 32, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <span className="pill"><span className="ldot" />{totalCommands} KOMUT</span>
                <span className="pill pill--saffron"><span className="ldot" />POSIX UYUMLU</span>
                <span className="pill pill--jade"><span className="ldot" />KISA ALIAS</span>
              </div>
            </div>
            <div className="reveal delay-1">
              <LiveTerminal title="kapitan@deneme ~ uçbirim" height={360} />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="reveal">
            <SectionHead
              no="—"
              eyebrow="Tüm gruplar"
              title={<>Toplam <em>{totalCommands}</em> komut, yedi grupta.</>}
            />
          </div>
          <div
            className="reveal"
            style={{
              marginTop: 56,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: 24,
            }}
          >
            {cmdGroups.map((g, i) => (
              <button
                key={g.key}
                type="button"
                onClick={() => { setActive(g.key); setQ(''); window.scrollTo({ top: 520, behavior: 'smooth' }); }}
                className="card"
                style={{
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'var(--display)', fontSize: 36, color: 'var(--crimson)', lineHeight: 1 }}>{g.glyph}</span>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--sand)' }}>{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h4 className="h4" style={{ marginTop: 24 }}>{g.label}</h4>
                <div className="eyebrow" style={{ marginTop: 8 }}>{g.count} komut</div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}