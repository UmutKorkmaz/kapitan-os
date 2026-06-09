import { useState, useEffect, useRef } from 'react';
import Link from './Link.jsx';
import GithubReleaseLink from './GithubReleaseLink.jsx';
import { MandalaBg, SectionOrnament, StarSeal } from './Ornaments.jsx';

export { default as Link } from './Link.jsx';
export { useHashRoute } from '../hooks/useHashRoute.js';
export { useReveal } from '../hooks/useReveal.js';

const NAV_LINKS = [
  { to: '/surumler', label: 'Sürümler' },
  { to: '/pazar', label: 'Pazar' },
  { to: '/komutlar', label: 'Komutlar' },
  { to: '/belgeler', label: 'Belgeler' },
  { to: '/topluluk', label: 'Topluluk' },
  { to: '/hakkinda', label: 'Hakkında' },
];

const THEME_KEY = 'kapitan-theme';

function readInitialTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch (_) { /* localStorage may be blocked */ }
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

function useTheme() {
  const [theme, setTheme] = useState(() => {
    const t = readInitialTheme();
    applyTheme(t);
    return t;
  });
  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (_) {}
  }, [theme]);
  return [theme, setTheme];
}

function ThemeToggle() {
  const [theme, setTheme] = useTheme();
  const isDark = theme === 'dark';
  const toggle = () => setTheme(isDark ? 'light' : 'dark');

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={isDark ? 'Aydınlık moda geç' : 'Karanlık moda geç'}
      title={isDark ? 'Aydınlık' : 'Karanlık'}
      aria-pressed={isDark}
    >
      <span className="theme-toggle__face" aria-hidden="true">
        <svg className="theme-icon theme-icon--sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M4.6 4.6l1.7 1.7M17.7 17.7l1.7 1.7M19.4 4.6l-1.7 1.7M6.3 17.7l-1.7 1.7" />
        </svg>
        <svg className="theme-icon theme-icon--moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.4 14.6A8.4 8.4 0 1 1 9.4 3.6a6.6 6.6 0 0 0 11 11Z" />
        </svg>
      </span>
      <span className="theme-toggle__label">{isDark ? 'Aydınlık' : 'Karanlık'}</span>
    </button>
  );
}

export function ScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      const pct = max <= 0 ? 0 : Math.min(100, Math.max(0, (window.scrollY / max) * 100));
      if (ref.current) ref.current.style.width = pct + '%';
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  return <div ref={ref} className="scroll-progress" />;
}

export function Nav({ activePath, onOpenCmdK }) {
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <Link to="/" className="nav-brand" aria-label="KAPiTaN OS">
          <StarSeal size={26} color="var(--crimson)" stroke={0.8} className="seal spin-slow" />
          <span>
            KAPiTaN <i>OS</i>
          </span>
          <b>0.1.0-alpha · TR</b>
        </Link>
        <nav className="nav-links">
          {NAV_LINKS.map((l) => (
            <Link key={l.to} to={l.to} className={activePath?.startsWith(l.to) ? 'active' : ''}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="nav-right">
          <button className="nav-cmd" onClick={onOpenCmdK} title="Komut paleti" type="button">
            <span>komut ara…</span>
            <kbd>⌘K</kbd>
          </button>
          <ThemeToggle />
          <GithubReleaseLink className="btn btn-crimson nav-cta">
            İndir →
          </GithubReleaseLink>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="seal-wash">
        <MandalaBg color="var(--crimson)" size={480} opacity={1} />
      </div>
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <StarSeal size={36} color="var(--crimson)" stroke={0.8} />
              <div style={{ fontFamily: 'var(--display)', fontSize: 40, lineHeight: 1, letterSpacing: '0.01em' }}>
                KAPiTaN <i style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--crimson)' }}>OS</i>
              </div>
            </div>
            <p className="body" style={{ marginTop: 24, maxWidth: '34ch' }}>
              Komutlarının dili Türkçe olan, üç sürümle gelen açık kaynak işletim sistemi.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 24, flexWrap: 'wrap' }}>
              <span className="pill">
                <span className="ldot" /> ALFA · 0.1.0-alpha
              </span>
              <span className="pill">
                <span className="ldot" style={{ background: 'var(--saffron)' }} /> 2026/06
              </span>
            </div>
          </div>
          <div>
            <h4>Sürümler</h4>
            <ul>
              <li>
                <Link to="/surumler/gelistirici">Geliştirici</Link>
              </li>
              <li>
                <Link to="/surumler/ofis">Ofis</Link>
              </li>
              <li>
                <Link to="/surumler/bar">Bar (minimal)</Link>
              </li>
              <li>
                <Link to="/surumler">Karşılaştır</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Kaynaklar</h4>
            <ul>
              <li>
                <Link to="/komutlar">Komut rehberi</Link>
              </li>
              <li>
                <Link to="/belgeler">Belgeler</Link>
              </li>
              <li>
                <Link to="/pazar">KAPiTaN Pazar</Link>
              </li>
              <li>
                <Link to="/topluluk">Forum</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Proje</h4>
            <ul>
              <li>
                <Link to="/hakkinda">Hakkında</Link>
              </li>
              <li>
                <Link to="/topluluk">Topluluk</Link>
              </li>
              <li>
                <GithubReleaseLink variant="repo">Kaynak kodu</GithubReleaseLink>
              </li>
              <li>
                <Link to="/hakkinda">İletişim</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 KAPiTaN OS · GPL-3.0</span>
          <span>İstanbul · Ankara · İzmir · Berlin</span>
          <span>Yapılan yer: dünya</span>
        </div>
      </div>
    </footer>
  );
}

export function PageHead({ crumbs, title, lede, children, ornamentColor = 'var(--crimson)' }) {
  return (
    <section className="page-head">
      <div className="ornament">
        <MandalaBg color={ornamentColor} size={460} opacity={1} />
      </div>
      <div className="wrap" style={{ position: 'relative', zIndex: 2 }}>
        <div className="crumb">
          {crumbs.map((c, i) => (
            <span key={i}>
              {c.to ? <Link to={c.to}>{c.label}</Link> : <span>{c.label}</span>}
              {i < crumbs.length - 1 && <span style={{ margin: '0 10px', opacity: 0.4 }}>·</span>}
            </span>
          ))}
        </div>
        <h1 className="reveal in">{title}</h1>
        {lede && <p className="lede reveal in">{lede}</p>}
        {children}
      </div>
    </section>
  );
}

export function SectionHead({ no, eyebrow, title, lede, align }) {
  return (
    <div
      className="section-head"
      style={{
        textAlign: align || 'left',
        maxWidth: align === 'center' ? 780 : 'none',
        marginInline: align === 'center' ? 'auto' : 0,
      }}
    >
      <div className="kicker">
        <span className="glyph" />
        {no && <span style={{ color: 'var(--crimson)' }}>{no}</span>}
        {no && <span style={{ color: 'var(--fg-faint)' }}>·</span>}
        <span>{eyebrow}</span>
      </div>
      <h2 className="h2" style={{ marginTop: 22, textWrap: 'balance' }}>{title}</h2>
      {lede && (
        <p className="lede" style={{ marginTop: 24, marginInline: align === 'center' ? 'auto' : 0 }}>
          {lede}
        </p>
      )}
    </div>
  );
}

export function Divider({ color = 'var(--crimson)' }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
      <SectionOrnament color={color} />
    </div>
  );
}

export function Term({ title, lines, height }) {
  return (
    <div className="term" style={height ? { minHeight: height } : undefined}>
      <div className="term-bar">
        <div className="dotgroup">
          <span />
          <span />
          <span />
        </div>
        <span>{title || 'kapitan ~ uçbirim'}</span>
      </div>
      <div className="term-body">
        {lines.map((ln, i) => {
          if (ln.type === 'cmd') return <div key={i}><span className="prompt">›</span> <span className="cmd">{ln.text}</span></div>;
          if (ln.type === 'out') return <div key={i}><span className="out">{ln.text}</span></div>;
          if (ln.type === 'ok') return <div key={i}><span className="ok">✓ {ln.text}</span></div>;
          if (ln.type === 'key') return <div key={i}><span className="key">{ln.text}</span></div>;
          if (ln.type === 'err') return <div key={i}><span className="err">✗ {ln.text}</span></div>;
          if (ln.type === 'blank') return <div key={i}>&nbsp;</div>;
          return <div key={i}>{ln.text}</div>;
        })}
        <div>
          <span className="prompt">›</span> <span className="caret" />
        </div>
      </div>
    </div>
  );
}