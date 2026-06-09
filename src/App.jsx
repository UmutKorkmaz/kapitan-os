/* App — routing root */

function NotFound() {
  return (
    <section className="section" style={{minHeight:'70vh', display:'grid', placeItems:'center', position:'relative', overflow:'hidden'}}>
      <div className="ornament-wrap" style={{top:'50%', left:'50%', transform:'translate(-50%, -50%)'}}>
        <MandalaBg color="var(--crimson)" size={600} opacity={0.05} />
      </div>
      <div className="wrap" style={{textAlign:'center', position:'relative', zIndex:2}}>
        <div className="kicker" style={{justifyContent:'center'}}><span className="glyph"/>404</div>
        <h1 className="h1" style={{marginTop:20}}>Bu sayfa <em>bulunamadı</em>.</h1>
        <p className="lede" style={{marginInline:'auto', marginTop:24}}>
          Aradığınız sayfa kaldırılmış ya da hiç var olmamış olabilir.
        </p>
        <div style={{marginTop:36}}>
          <Link to="/" className="btn btn-crimson">Ana sayfaya dön →</Link>
        </div>
      </div>
    </section>
  );
}

function App() {
  const path = useHashRoute();
  const [cmdkOpen, setCmdkOpen] = useCmdK();
  useReveal();

  const route = (() => {
    if (path === '/' || path === '') return { Page: Home, key: '/' };
    if (path === '/surumler')             return { Page: Surumler, key: '/surumler' };
    if (path === '/surumler/gelistirici') return { Page: Gelistirici, key: '/surumler' };
    if (path === '/surumler/ofis')        return { Page: Ofis, key: '/surumler' };
    if (path === '/surumler/bar')         return { Page: Bar, key: '/surumler' };
    if (path === '/pazar')                return { Page: Pazar, key: '/pazar' };
    if (path === '/komutlar')             return { Page: Komutlar, key: '/komutlar' };
    if (path === '/belgeler')             return { Page: Belgeler, key: '/belgeler' };
    if (path === '/topluluk')             return { Page: Topluluk, key: '/topluluk' };
    if (path === '/hakkinda')             return { Page: Hakkinda, key: '/hakkinda' };
    return { Page: NotFound, key: '' };
  })();

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

ReactDOM.createRoot(document.getElementById('app')).render(<App />);
