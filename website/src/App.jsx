import { Link, Nav, Footer, ScrollProgress, useHashRoute, useReveal } from './components/Shell';
import { MandalaBg } from './components/Ornaments';
import { CommandPalette, useCmdK } from './components/Interactive';

import Home from './pages/Home';
import Surumler from './pages/Surumler';
import Gelistirici from './pages/Gelistirici';
import Ofis from './pages/Ofis';
import Bar from './pages/Bar';
import Pazar from './pages/Pazar';
import Komutlar from './pages/Komutlar';
import Belgeler from './pages/Belgeler';
import Topluluk from './pages/Topluluk';
import Hakkinda from './pages/Hakkinda';

function NotFound() {
  return (
    <section className="section" style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', position: 'relative', overflow: 'hidden' }}>
      <div className="ornament-wrap" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <MandalaBg color="var(--crimson)" size={600} opacity={0.05} />
      </div>
      <div className="wrap" style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <div className="kicker" style={{ justifyContent: 'center' }}>
          <span className="glyph" />
          404
        </div>
        <h1 className="h1" style={{ marginTop: 20 }}>
          Bu sayfa <em>bulunamadı</em>.
        </h1>
        <p className="lede" style={{ marginInline: 'auto', marginTop: 24 }}>
          Aradığınız sayfa kaldırılmış ya da hiç var olmamış olabilir.
        </p>
        <div style={{ marginTop: 36 }}>
          <Link to="/" className="btn btn-crimson">
            Ana sayfaya dön →
          </Link>
        </div>
      </div>
    </section>
  );
}

const ROUTES = {
  '/': { Page: Home, key: '/' },
  '/surumler': { Page: Surumler, key: '/surumler' },
  '/surumler/gelistirici': { Page: Gelistirici, key: '/surumler' },
  '/surumler/ofis': { Page: Ofis, key: '/surumler' },
  '/surumler/bar': { Page: Bar, key: '/surumler' },
  '/pazar': { Page: Pazar, key: '/pazar' },
  '/komutlar': { Page: Komutlar, key: '/komutlar' },
  '/belgeler': { Page: Belgeler, key: '/belgeler' },
  '/topluluk': { Page: Topluluk, key: '/topluluk' },
  '/hakkinda': { Page: Hakkinda, key: '/hakkinda' },
};

export default function App() {
  const path = useHashRoute();
  const [cmdkOpen, setCmdkOpen] = useCmdK();
  useReveal();

  const route = ROUTES[path] ?? { Page: NotFound, key: '' };

  return (
    <>
      <ScrollProgress />
      <Nav activePath={route.key} onOpenCmdK={() => setCmdkOpen(true)} />
      <main data-screen-label={'page' + route.key}>
        <route.Page />
      </main>
      <Footer />
      <CommandPalette open={cmdkOpen} onClose={() => setCmdkOpen(false)} />
    </>
  );
}