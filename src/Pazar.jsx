/* Pazar — marketplace with live install demo */

const pazarCats = [
  ['all','Tümü', '#'],
  ['gel','Geliştirici', '›'],
  ['ai','Yapay zekâ', 'K'],
  ['ofis','Ofis', '¶'],
  ['sis','Sistem', '◎'],
  ['tas','Tasarım', '◇'],
  ['guv','Güvenlik', '⏚'],
  ['ile','İletişim', '@'],
  ['egi','Eğitim', 'Α'],
  ['oyu','Oyunlar', '◆'],
  ['med','Medya', '♪'],
];

const pazarApps = [
  { id:1, name:'KodDüzenleyici Pro', cat:'gel', catLabel:'Geliştirici', rating:4.9, dev:'KAPiTaN Team',  desc:'Gelişmiş kod düzenleyici, AI tamamlama, hata ayıklama. 50+ tema.', dl:'12K', verified:true,  cmd:'kod', color:'var(--crimson)', glyph:'K', size:'48 MB' },
  { id:2, name:'YapayZekâ Asistanı', cat:'ai',  catLabel:'Yapay zekâ',   rating:4.8, dev:'KAPiTaN AI',    desc:'Yerleşik AI yardımcısı. Kod, belge, çeviri.',                       dl:'8K',  verified:true,  cmd:'yapayzeka', color:'var(--ember)', glyph:'Y', size:'124 MB' },
  { id:3, name:'OfisPaketi Pro',     cat:'ofis',catLabel:'Ofis',         rating:4.7, dev:'TürkçeSoft',    desc:'Tam ofis paketi. Kelime işlem, hesap tablosu, sunum.',              dl:'15K', verified:false, cmd:'ofis', color:'var(--saffron)', glyph:'O', size:'380 MB' },
  { id:4, name:'GüvenlikDuvarı',     cat:'guv', catLabel:'Güvenlik',     rating:4.8, dev:'KalkanTech',    desc:'Gelişmiş güvenlik duvarı, ağ izleme, oltalama koruması.',           dl:'9K',  verified:true,  cmd:'guvenlik', color:'var(--turquoise)', glyph:'G', size:'62 MB' },
  { id:5, name:'MedyaOynatıcı',      cat:'med', catLabel:'Medya',        rating:4.6, dev:'SeslerTeam',    desc:'Her formatta medya oynatıcı, Türkçe altyazı destekli.',             dl:'6K',  verified:false, cmd:'medya', color:'var(--jade)', glyph:'M', size:'28 MB' },
  { id:6, name:'ÇizimTaslağım',      cat:'tas', catLabel:'Tasarım',      rating:4.5, dev:'PixelArt TR',   desc:'Vektör çizim aracı, 200+ Türkçe şablon ve renk paleti.',            dl:'4K',  verified:false, cmd:'cizim', color:'#A555BB', glyph:'Ç', size:'92 MB' },
  { id:7, name:'EpostaYöneticisi',   cat:'ile', catLabel:'İletişim',     rating:4.7, dev:'MailTR',        desc:'Çoklu hesap, akıllı kategorilendirme, Türkçe imla.',                dl:'7K',  verified:false, cmd:'eposta', color:'#D87935', glyph:'E', size:'42 MB' },
  { id:8, name:'OyunMerkezi',        cat:'oyu', catLabel:'Oyunlar',      rating:4.4, dev:'TürkOyun',      desc:'Türk yapımı oyunlar için topluluk merkezi.',                        dl:'11K', verified:false, cmd:'oyun', color:'#E04A56', glyph:'◆', size:'140 MB' },
  { id:9, name:'VeritabanıYönetici', cat:'gel', catLabel:'Geliştirici',  rating:4.6, dev:'DBMaster',      desc:'PostgreSQL, MySQL, SQLite görsel yönetim aracı.',                   dl:'5K',  verified:false, cmd:'veritabani', color:'var(--crimson)', glyph:'V', size:'88 MB' },
  { id:10,name:'PDFDüzenleyici',     cat:'ofis',catLabel:'Ofis',         rating:4.5, dev:'DocuTR',        desc:'PDF düzenleme, imza, form alanı, OCR destekli.',                    dl:'8K',  verified:true,  cmd:'pdf', color:'var(--saffron)', glyph:'P', size:'54 MB' },
  { id:11,name:'Sözlük Pro',         cat:'egi', catLabel:'Eğitim',       rating:4.8, dev:'DilBilim',      desc:'TDK sözlük, 12 dil arası çeviri, eş anlamlılar.',                   dl:'10K', verified:false, cmd:'sozluk', color:'#5077A6', glyph:'Α', size:'22 MB' },
  { id:12,name:'ŞifreYöneticisi',    cat:'guv', catLabel:'Güvenlik',     rating:4.7, dev:'KasaTech',      desc:'Güvenli şifre yöneticisi, biyometrik kilit, eşitleme.',             dl:'7K',  verified:true,  cmd:'sifre', color:'var(--turquoise)', glyph:'Ş', size:'18 MB' },
];

/* ============================================================
   Install Modal — live progress
   ============================================================ */

function InstallModal({ app, onClose }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const steps = [
    'Pazar dizini sorgulanıyor…',
    `${app.name} v${app.id}.2 indiriliyor (${app.size})…`,
    'Bağımlılıklar çözümleniyor (12 paket)',
    'İmza doğrulanıyor · SHA-256',
    'Kurulum betikleri çalıştırılıyor',
    'Masaüstüne kısayol eklendi',
  ];

  useEffect(() => {
    if (step < steps.length) {
      const t = setTimeout(() => setStep(s => s + 1), 600 + Math.random() * 500);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setDone(true), 400);
      return () => clearTimeout(t);
    }
  }, [step]);

  const progress = (step / steps.length) * 100;

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:150,
      background:'rgba(40,28,14,0.30)', backdropFilter:'blur(10px)',
      display:'grid', placeItems:'center', padding:24,
      animation:'fadein 0.2s ease'
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width:'min(560px, 96vw)',
        background:'var(--ink-2)',
        border:'1px solid var(--ink-line-2)',
        borderRadius:10,
        boxShadow:'0 60px 100px -20px rgba(60,40,18,0.34)',
        overflow:'hidden',
        animation:'cmdk-in 0.3s cubic-bezier(0.16,1,0.3,1)'
      }}>
        <div style={{padding:'16px 20px', borderBottom:'1px solid var(--ink-line)', background:'var(--ink-3)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <span style={{fontFamily:'var(--mono)', fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--sand)'}}>
            kur {app.cmd}
          </span>
          <button onClick={onClose} style={{
            background:'transparent', border:0,
            color:'var(--sand)', cursor:'pointer',
            fontFamily:'var(--mono)', fontSize:13
          }}>esc ×</button>
        </div>

        <div style={{padding:'32px'}}>
          <div style={{display:'flex', alignItems:'flex-start', gap:18}}>
            <div style={{
              width:64, height:64, borderRadius:10,
              background: `linear-gradient(135deg, ${app.color}, transparent)`,
              border: '1px solid ' + app.color,
              display:'grid', placeItems:'center',
              fontFamily:'var(--display)', fontSize:32, color:'var(--ink)'
            }}>{app.glyph}</div>
            <div style={{flex:1}}>
              <h3 className="h3">{app.name}</h3>
              <div className="eyebrow" style={{marginTop:6}}>{app.catLabel} · {app.dev}</div>
            </div>
          </div>

          {!done ? (
            <>
              <div style={{marginTop:32, height:4, background:'var(--ink-line)', borderRadius:2, overflow:'hidden'}}>
                <div style={{
                  height:'100%', width: progress + '%',
                  background:'var(--crimson)',
                  transition:'width 0.5s cubic-bezier(0.16,1,0.3,1)',
                  boxShadow:'0 0 12px var(--crimson-glow)'
                }}/>
              </div>
              <div style={{marginTop:24, fontFamily:'var(--mono)', fontSize:13, lineHeight:1.9}}>
                {steps.slice(0, step+1).map((s, i) => (
                  <div key={i} style={{
                    color: i < step ? 'var(--jade)' : 'var(--pearl)',
                    opacity: i === step ? 1 : 0.7
                  }}>
                    {i < step ? '✓' : i === step ? <span>›</span> : '·'} {s}
                    {i === step && <span className="caret" style={{marginLeft:4}}/>}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div style={{marginTop:32, padding:'16px 18px', background:'rgba(63,142,99,0.10)', border:'1px solid rgba(63,142,99,0.3)', borderRadius:6, display:'flex', alignItems:'center', gap:14}}>
                <span style={{
                  width:32, height:32, borderRadius:'50%',
                  background:'var(--jade)', color:'var(--ink)',
                  display:'grid', placeItems:'center', fontWeight:700,
                  fontSize:16
                }}>✓</span>
                <div>
                  <div style={{fontWeight:500, color:'var(--ink)'}}>{app.name} kuruldu.</div>
                  <div style={{fontSize:13, color:'var(--sand)'}}>Süre: {(1.2 + Math.random()).toFixed(1)} sn · Disk: {app.size}</div>
                </div>
              </div>
              <div style={{display:'flex', gap:10, marginTop:24, flexWrap:'wrap'}}>
                <button className="btn btn-crimson" onClick={onClose}>Uygulamayı aç →</button>
                <button className="btn btn-line" onClick={onClose}>Kapat</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Pazar Page
   ============================================================ */

function PazarHeader({ search, setSearch }) {
  return (
    <section style={{paddingTop:120, paddingBottom:80, borderBottom:'1px solid var(--ink-line)', position:'relative', overflow:'hidden'}}>
      <div className="ornament-wrap" style={{right:'-180px', top:'-100px'}}>
        <MandalaBg color="var(--crimson)" size={700} opacity={0.06}/>
      </div>
      <div className="wrap" style={{position:'relative', zIndex:2}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
          <div className="crumb">
            <Link to="/">Ana sayfa</Link>
            <span style={{margin:'0 10px', opacity:0.4}}>·</span>
            <span>Pazar</span>
          </div>
          <span className="mono" style={{fontSize:11, color:'var(--sand)', letterSpacing:'0.18em', textTransform:'uppercase'}}>1 247 yazılım · onayli %18</span>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:48, marginTop:36, alignItems:'end'}} className="pazar-head-grid">
          <h1 style={{fontFamily:'var(--display)', fontSize:'clamp(56px, 9vw, 132px)', lineHeight:1.0, letterSpacing:'-0.005em'}}>
            KAPiTaN <i style={{fontFamily:'var(--serif)', fontStyle:'italic', color:'var(--crimson)'}}>Pazar</i>.
          </h1>
          <p className="lede">
            Yüzlerce Türkçe uygulama, tek tıkla kurulum. Geliştirici araçları, ofis
            programları, oyunlar, daha fazlası.
          </p>
        </div>

        {/* Search */}
        <div style={{marginTop:64, display:'flex', alignItems:'center', gap:14, border:'1px solid var(--ink-line-2)', borderRadius:999, padding:'8px 8px 8px 24px', background:'var(--ink-2)'}}>
          <span style={{fontFamily:'var(--mono)', fontSize:14, color:'var(--crimson)'}}>›</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="pazarara — uygulama ya da kategori"
            style={{
              flex:1, border:0, background:'transparent', outline:'none',
              fontFamily:'var(--mono)', fontSize:15, color:'var(--ink)',
              padding:'10px 0'
            }}
          />
          <button className="btn btn-crimson" style={{padding:'12px 22px', fontSize:13}}>Ara</button>
        </div>
      </div>
    </section>
  );
}

function AppCard({ app, onInstall, installed }) {
  return (
    <div className="card" style={{display:'flex', flexDirection:'column', position:'relative', overflow:'hidden'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12}}>
        <div style={{
          width:52, height:52, borderRadius:8,
          background: `linear-gradient(135deg, ${app.color}40, transparent)`,
          border:'1px solid ' + app.color,
          display:'grid', placeItems:'center',
          fontFamily:'var(--display)', fontSize:24, color:'var(--ink)'
        }}>{app.glyph}</div>
        {app.verified && <span className="mono" style={{
          fontSize:10, letterSpacing:'0.16em', color:'var(--saffron)',
          border:'1px solid var(--saffron)', padding:'2px 7px', borderRadius:2
        }}>ONAYLI</span>}
      </div>
      <h4 className="h4" style={{marginTop:18}}>{app.name}</h4>
      <div className="eyebrow" style={{marginTop:4}}>{app.catLabel}</div>
      <p className="body body--small" style={{marginTop:14, flex:1}}>{app.desc}</p>
      <div style={{marginTop:18, display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
        <span className="mono" style={{fontSize:11, color:'var(--sand)'}}>★ {app.rating} · {app.dl}</span>
        <span className="mono" style={{fontSize:11, color:'var(--sand)'}}>{app.size}</span>
      </div>
      <button
        onClick={() => !installed && onInstall(app)}
        className={installed ? 'btn btn-line' : 'btn btn-line'}
        style={{
          marginTop:18, fontSize:12, padding:'10px 14px', justifyContent:'center',
          ...(installed ? { background:'rgba(63,142,99,0.10)', borderColor:'var(--jade)', color:'var(--jade)' } : {})
        }}>
        {installed ? '✓ Kuruldu' : 'Kur'}
      </button>
    </div>
  );
}

function Pazar() {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('all');
  const [installed, setInstalled] = useState(new Set());
  const [modalApp, setModalApp] = useState(null);

  const filtered = pazarApps.filter(a => {
    const matchSearch = !search ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.desc.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCat === 'all' || a.cat === activeCat;
    return matchSearch && matchCat;
  });

  const onInstall = (a) => {
    setModalApp(a);
    setTimeout(() => setInstalled(prev => new Set([...prev, a.id])), 4500);
  };

  return (
    <>
      <PazarHeader search={search} setSearch={setSearch} />

      {/* Category bar */}
      <div style={{position:'sticky', top:64, zIndex:30, background:'color-mix(in srgb, var(--paper) 85%, transparent)', backdropFilter:'blur(12px)', borderBottom:'1px solid var(--ink-line)'}}>
        <div className="wrap" style={{padding:'16px 32px', overflowX:'auto'}}>
          <div style={{display:'flex', gap:8, minWidth:'max-content', alignItems:'center'}}>
            {pazarCats.map(([k, l, g]) => (
              <button key={k} onClick={() => setActiveCat(k)} style={{
                padding:'8px 16px',
                borderRadius:999,
                fontSize:13,
                fontFamily:'var(--sans)',
                whiteSpace:'nowrap',
                border: '1px solid ' + (activeCat === k ? 'var(--crimson)' : 'var(--ink-line)'),
                background: activeCat === k ? 'var(--crimson)' : 'var(--ink-2)',
                color: activeCat === k ? 'var(--pearl)' : 'var(--fg-soft)',
                cursor:'pointer',
                display:'inline-flex', alignItems:'center', gap:8
              }}>
                <span style={{fontFamily:'var(--mono)', fontSize:11, opacity:0.7}}>{g}</span>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured row */}
      <section className="section" style={{paddingTop:80}}>
        <div className="wrap">
          <div className="reveal" style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:24}}>
            <SectionHead no="01" eyebrow="Öne çıkanlar"
              title={<>Bu hafta <em>öne çıkanlar</em>.</>}
            />
            <span className="eyebrow">Hafta № 20 / 2026</span>
          </div>

          <div className="grid grid-3 reveal" style={{marginTop:56}}>
            {pazarApps.slice(0, 3).map((a, i) => (
              <div key={a.id} className="card" style={{padding:0, overflow:'hidden', display:'flex', flexDirection:'column'}}>
                <div style={{
                  aspectRatio:'5/3',
                  background: `linear-gradient(135deg, ${a.color}, var(--ink))`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  position:'relative', overflow:'hidden'
                }}>
                  <div style={{position:'absolute', inset:0, opacity:0.15}}>
                    <HexRosette size={300} color="var(--pearl)" stroke={0.4}/>
                  </div>
                  <span style={{
                    fontFamily:'var(--display)', fontSize:150,
                    color:'var(--ink)', lineHeight:1,
                    position:'relative', zIndex:2
                  }}>{a.glyph}</span>
                  <span className="mono" style={{position:'absolute', top:18, left:18, color:'var(--ink)', fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase', zIndex:2, opacity:0.9}}>№ {String(i+1).padStart(2,'0')}</span>
                </div>
                <div style={{padding:'28px', flex:1, display:'flex', flexDirection:'column'}}>
                  <div className="eyebrow" style={{color:a.color}}>{a.catLabel}</div>
                  <h3 className="h3" style={{marginTop:8}}>{a.name}</h3>
                  <p className="body" style={{marginTop:12, flex:1}}>{a.desc}</p>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:24}}>
                    <span className="mono" style={{color:'var(--sand)', fontSize:12}}>★ {a.rating} · {a.dl} kurulum</span>
                    <button
                      className={installed.has(a.id) ? 'btn btn-line' : 'btn btn-crimson'}
                      onClick={() => !installed.has(a.id) && onInstall(a)}
                      style={{padding:'9px 16px', fontSize:12}}>
                      {installed.has(a.id) ? '✓ Kuruldu' : 'Kur'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full grid */}
      <section className="section" style={{background:'var(--ink-1)', borderTop:'1px solid var(--ink-line)'}}>
        <div className="wrap">
          <div className="reveal" style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:16}}>
            <SectionHead no="02" eyebrow="Katalog"
              title={<>Tüm <em>yazılımlar</em>.</>}
            />
            <span className="mono" style={{color:'var(--sand)'}}>{filtered.length} sonuç</span>
          </div>

          {filtered.length === 0 ? (
            <div style={{marginTop:64, padding:80, textAlign:'center', border:'1px dashed var(--ink-line)', borderRadius:6}}>
              <span className="mono" style={{color:'var(--sand)'}}>Sonuç bulunamadı. Başka bir arama deneyin.</span>
            </div>
          ) : (
            <div className="grid grid-4 reveal" style={{marginTop:56}}>
              {filtered.map(a => (
                <AppCard key={a.id} app={a} onInstall={onInstall} installed={installed.has(a.id)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Terminal install */}
      <section className="section">
        <div className="wrap">
          <div style={{display:'grid', gridTemplateColumns:'1fr 1.3fr', gap:64, alignItems:'center'}} className="term-grid">
            <div className="reveal">
              <SectionHead no="03" eyebrow="Uçbirimden kurulum"
                title={<>Tek komutla <em>her şey</em>.</>}
                lede={<>Pazar'a uçbirimden de erişebilirsiniz. <code style={{fontFamily:'var(--mono)', color:'var(--saffron)'}}>pazarara</code>, <code style={{fontFamily:'var(--mono)', color:'var(--saffron)'}}>kur</code>, <code style={{fontFamily:'var(--mono)', color:'var(--saffron)'}}>güncelle</code> — tüm yönetim Türkçe komutlarla.</>}
              />
            </div>
            <div className="reveal delay-1">
              <Term
                title="kapitan@pazar ~ uçbirim"
                lines={[
                  { type:'cmd', text:'pazarara "kod düzenleyici"' },
                  { type:'out', text:'2 sonuç bulundu:' },
                  { type:'out', text:'  1. KodDüzenleyici Pro (★4.9) — KAPiTaN Team' },
                  { type:'out', text:'  2. KodDüzenleyici Lite (★4.3) — OpenTR' },
                  { type:'blank' },
                  { type:'cmd', text:'kur kod-duzenleyici-pro' },
                  { type:'ok',  text:'Bağımlılıklar kontrol ediliyor (12)' },
                  { type:'ok',  text:'İndiriliyor (48 MB)' },
                  { type:'ok',  text:'İmza doğrulandı · SHA-256' },
                  { type:'ok',  text:'Kurulum tamamlandı: 1.2 sn' },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Dev CTA */}
      <TileBand color="var(--crimson)" height={24}/>
      <section className="section" style={{position:'relative', overflow:'hidden'}}>
        <div className="ornament-wrap" style={{left:'50%', top:'50%', transform:'translate(-50%, -50%)', opacity:1}}>
          <MandalaBg color="var(--crimson)" size={600} opacity={0.05}/>
        </div>
        <div className="wrap" style={{textAlign:'center', maxWidth:720, margin:'0 auto', position:'relative', zIndex:2}}>
          <span className="kicker reveal" style={{justifyContent:'center'}}><span className="glyph"/><span style={{color:'var(--crimson)'}}>04</span><span style={{color:'var(--fg-faint)'}}>·</span><span>Geliştiriciler için</span></span>
          <h2 className="h1 reveal" style={{marginTop:22}}>
            <em>Geliştirici</em> misiniz?
          </h2>
          <p className="lede reveal delay-1" style={{marginInline:'auto', marginTop:24}}>
            Kendi uygulamanızı KAPiTaN Pazar'a yükleyin, binlerce kullanıcıya ulaşın.
            Başvuru ücretsiz. Türkçe arayüz zorunlu, açık kaynak tercih edilir.
          </p>
          <div className="reveal delay-2" style={{marginTop:36}}>
            <button className="btn btn-crimson">Geliştirici başvurusu →</button>
          </div>
        </div>
      </section>

      {modalApp && <InstallModal app={modalApp} onClose={() => setModalApp(null)} />}
    </>
  );
}

window.Pazar = Pazar;
