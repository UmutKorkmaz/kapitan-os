/* Sürümler — editions with quiz + comparison */

const editionsData = [
  { no:'01', name:'Geliştirici', acc:'var(--crimson)', accSoft:'rgba(200,16,46,0.08)',
    to:'/surumler/gelistirici',
    lede:'Yapay zekâ destekli IDE, 218 uçbirim komutu. Python, Rust, Go, Node önyüklü.',
    ram:'8 GB', disk:'50 GB', apps:'45+',
    cmd:'kur kapitan-gelistirici'
  },
  { no:'02', name:'Ofis', acc:'var(--saffron)', accSoft:'rgba(232,178,62,0.08)',
    to:'/surumler/ofis',
    lede:'Tam ofis paketi, akıllı e-posta, AI yazı asistanı. DOCX, XLSX, PPTX uyumlu.',
    ram:'4 GB', disk:'30 GB', apps:'30+',
    cmd:'kur kapitan-ofis'
  },
  { no:'03', name:'Bar', acc:'var(--jade)', accSoft:'rgba(63,142,99,0.08)',
    to:'/surumler/bar',
    lede:'Sadece sekiz uygulama. 15 saniyede açılır, eski donanımda bile rahat çalışır.',
    ram:'2 GB', disk:'15 GB', apps:'8',
    cmd:'kur kapitan-bar'
  },
];

const compareRows = [
  ['Hedef kullanıcı',          'Yazılımcılar, AI/ML',          'Ofis çalışanları, öğrenciler', 'Kiosk, ev, eski donanım'],
  ['Önyüklü uygulama',         '45+',                          '30+',                          '8'],
  ['Türkçe komut',             '218',                          '160',                          '84'],
  ['Yapay zekâ',               'Tam (kod + sohbet)',           'Kısmî (yazı asistanı)',        'Yok'],
  ['Ofis paketi',              'Yok',                          'Tam (KelimeIşlem, vb.)',       'Yok'],
  ['Uçbirim',                  'Gelişmiş, çoklu sekme',        'Temel',                        'Yok'],
  ['Minimum RAM',              '8 GB',                         '4 GB',                         '2 GB'],
  ['Açılış süresi',            '~22 sn',                       '~18 sn',                       '~15 sn'],
  ['Lisans',                   'GPL-3.0',                      'GPL-3.0',                      'GPL-3.0'],
  ['Fiyat',                    'Ücretsiz',                     'Ücretsiz',                     'Ücretsiz'],
];

/* ============================================================
   Edition Card
   ============================================================ */

function EditionCard({ e }) {
  return (
    <Link to={e.to} className="card" style={{display:'block', background:e.accSoft, position:'relative', overflow:'hidden'}}>
      <div style={{position:'absolute', top:-40, right:-40, opacity:0.10}}>
        <HexRosette size={200} color={e.acc} stroke={0.5}/>
      </div>
      <div style={{position:'relative', zIndex:2}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
          <span className="mono" style={{color:e.acc, fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase'}}>SÜRÜM № {e.no}</span>
          <span className="mono" style={{color:'var(--sand)', fontSize:11}}>{e.ram} · {e.disk}</span>
        </div>
        <h3 style={{fontFamily:'var(--display)', fontSize:'clamp(40px, 4.4vw, 56px)', lineHeight:1.04, marginTop:28, letterSpacing:'-0.005em'}}>
          <i style={{fontFamily:'var(--serif)', fontStyle:'italic', color:e.acc}}>{e.name}</i>{' '}sürümü
        </h3>
        <p className="body" style={{marginTop:20, minHeight:'5em'}}>{e.lede}</p>
        <div style={{
          marginTop:28, padding:'12px 14px',
          background:'var(--ink)', borderRadius:4,
          fontFamily:'var(--mono)', fontSize:12,
          border:'1px solid var(--ink-line)'
        }}>
          <span style={{color:'var(--crimson)', marginRight:8}}>›</span><span style={{color:'var(--ink)'}}>{e.cmd}</span>
        </div>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginTop:28}}>
          <span className="eyebrow">İncele</span>
          <span style={{fontFamily:'var(--serif)', fontStyle:'italic', fontSize:24, color:e.acc}}>→</span>
        </div>
      </div>
    </Link>
  );
}

/* ============================================================
   Version Picker Quiz
   ============================================================ */

const QUIZ_QUESTIONS = [
  { q: 'Bilgisayarınızı en çok ne için kullanıyorsunuz?',
    a: [
      { k:'kod',  l:'Kod yazmak, geliştirme',     w:{ gel:3, ofi:0, bar:0 }, icon:'›' },
      { k:'belge',l:'Belge, e-posta, sunum',       w:{ gel:0, ofi:3, bar:0 }, icon:'≡' },
      { k:'web',  l:'Tarayıcı, medya, basit işler',w:{ gel:0, ofi:1, bar:3 }, icon:'⌂' },
    ]
  },
  { q: 'Bilgisayarınızda ne kadar RAM var?',
    a: [
      { k:'2',  l:'2 GB veya daha az',  w:{ gel:0, ofi:0, bar:3 }, icon:'·' },
      { k:'4',  l:'4 GB',               w:{ gel:0, ofi:3, bar:2 }, icon:'··' },
      { k:'8',  l:'8 GB veya daha fazla', w:{ gel:3, ofi:2, bar:1 }, icon:'···' },
    ]
  },
  { q: 'Yapay zekâ özellikleri sizin için?',
    a: [
      { k:'cok', l:'Çok önemli — sürekli kullanırım', w:{ gel:3, ofi:2, bar:0 }, icon:'★★★' },
      { k:'orta', l:'Bazen kullanırım', w:{ gel:2, ofi:2, bar:0 }, icon:'★★' },
      { k:'az', l:'Önemsiz / istemiyorum', w:{ gel:1, ofi:1, bar:3 }, icon:'★' },
    ]
  },
  { q: 'Hangisi size daha yakın?',
    a: [
      { k:'cok-arac', l:'Çok araç, çok seçenek isterim',   w:{ gel:3, ofi:2, bar:0 }, icon:'+' },
      { k:'denge',     l:'Yeterli, ama gerekenlerle dolu',   w:{ gel:1, ofi:3, bar:1 }, icon:'=' },
      { k:'sade',      l:'Sadelik benim için her şey',        w:{ gel:0, ofi:0, bar:3 }, icon:'−' },
    ]
  },
];

function VersionQuiz() {
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState([]);

  const total = QUIZ_QUESTIONS.length;
  const done = step >= total;

  const choose = (a) => {
    const newPicks = [...picks, a];
    setPicks(newPicks);
    setStep(s => s + 1);
  };

  const reset = () => { setStep(0); setPicks([]); };

  // Calculate winner
  const scores = picks.reduce((acc, p) => ({
    gel: acc.gel + (p.w.gel || 0),
    ofi: acc.ofi + (p.w.ofi || 0),
    bar: acc.bar + (p.w.bar || 0),
  }), { gel: 0, ofi: 0, bar: 0 });

  const winner = scores.gel >= scores.ofi && scores.gel >= scores.bar ? 'gel'
              : scores.ofi >= scores.bar ? 'ofi' : 'bar';

  const winnerData = winner === 'gel' ? editionsData[0]
                  : winner === 'ofi' ? editionsData[1]
                  : editionsData[2];

  const maxScore = Math.max(scores.gel, scores.ofi, scores.bar);
  const meter = (n) => maxScore === 0 ? 0 : (n / maxScore) * 100;

  return (
    <div style={{
      border:'1px solid var(--ink-line)',
      background:'linear-gradient(180deg, var(--ink-2), var(--ink-1))',
      borderRadius:10,
      overflow:'hidden'
    }}>
      <div style={{
        padding:'14px 22px',
        borderBottom:'1px solid var(--ink-line)',
        display:'flex', justifyContent:'space-between', alignItems:'center',
        background:'var(--ink-3)'
      }}>
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <span style={{width:8, height:8, borderRadius:'50%', background:'var(--crimson)', boxShadow:'0 0 12px var(--crimson-glow)'}}/>
          <span style={{fontFamily:'var(--mono)', fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--sand)'}}>
            Sürüm seçici · {done ? 'sonuç' : `${step+1}/${total}`}
          </span>
        </div>
        <button onClick={reset} style={{
          fontFamily:'var(--mono)', fontSize:11, color:'var(--sand)',
          background:'transparent', border:0, cursor:'pointer'
        }}>↻ baştan</button>
      </div>

      <div style={{padding:'40px 32px'}}>
        {!done ? (
          <>
            {/* Progress */}
            <div style={{display:'flex', gap:6, marginBottom:32}}>
              {QUIZ_QUESTIONS.map((_, i) => (
                <div key={i} style={{
                  height:3, flex:1, borderRadius:2,
                  background: i < step ? 'var(--crimson)' : i === step ? 'var(--saffron)' : 'var(--ink-line)',
                  transition:'background 0.4s ease'
                }}/>
              ))}
            </div>
            <div className="kicker"><span className="glyph"/><span>Soru {step+1} / {total}</span></div>
            <h3 className="h3" style={{marginTop:18, fontFamily:'var(--display)'}}>
              {QUIZ_QUESTIONS[step].q}
            </h3>
            <div style={{display:'grid', gap:12, marginTop:28}}>
              {QUIZ_QUESTIONS[step].a.map(a => (
                <button key={a.k} onClick={() => choose(a)}
                  style={{
                    padding:'18px 20px',
                    display:'flex', alignItems:'center', gap:18,
                    background:'var(--ink-2)',
                    border:'1px solid var(--ink-line)',
                    borderRadius:6,
                    fontSize:15, color:'var(--fg)', textAlign:'left',
                    cursor:'pointer',
                    transition:'border-color 0.15s ease, background 0.15s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--crimson)'; e.currentTarget.style.background = 'var(--ink-3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--ink-line)'; e.currentTarget.style.background = 'var(--ink-2)'; }}>
                  <span style={{fontFamily:'var(--mono)', color:'var(--crimson)', minWidth:32}}>{a.icon}</span>
                  <span style={{flex:1}}>{a.l}</span>
                  <span style={{fontFamily:'var(--serif)', fontStyle:'italic', color:'var(--sand)'}}>→</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="kicker"><span className="glyph"/><span>Önerimiz</span></div>
            <h3 style={{fontFamily:'var(--display)', fontSize:'clamp(40px, 5vw, 64px)', lineHeight:1.0, marginTop:18}}>
              Size <i style={{fontFamily:'var(--serif)', fontStyle:'italic', color:winnerData.acc}}>{winnerData.name}</i> sürümü uygun.
            </h3>
            <p className="body" style={{marginTop:18, maxWidth:'50ch'}}>
              {winnerData.lede}
            </p>

            {/* Score bars */}
            <div style={{marginTop:36, display:'grid', gap:14}}>
              {[
                ['Geliştirici', scores.gel, 'var(--crimson)', '/surumler/gelistirici'],
                ['Ofis',        scores.ofi, 'var(--saffron)', '/surumler/ofis'],
                ['Bar',         scores.bar, 'var(--jade)',    '/surumler/bar'],
              ].map(([n, s, c, to]) => (
                <div key={n} style={{display:'grid', gridTemplateColumns:'120px 1fr 40px', gap:14, alignItems:'center'}}>
                  <span style={{fontFamily:'var(--mono)', fontSize:12, color:'var(--sand)', textTransform:'uppercase', letterSpacing:'0.12em'}}>{n}</span>
                  <div style={{height:6, background:'var(--ink-line)', borderRadius:3, position:'relative', overflow:'hidden'}}>
                    <div style={{
                      position:'absolute', left:0, top:0, bottom:0,
                      width: meter(s) + '%',
                      background: c,
                      borderRadius:3,
                      transition:'width 0.6s cubic-bezier(0.16,1,0.3,1)'
                    }}/>
                  </div>
                  <span style={{fontFamily:'var(--mono)', fontSize:13, color:'var(--ink)', textAlign:'right'}}>{s}</span>
                </div>
              ))}
            </div>

            <div style={{display:'flex', gap:12, marginTop:36, flexWrap:'wrap'}}>
              <Link to={winnerData.to} className="btn btn-crimson" style={{background:winnerData.acc, boxShadow:'none'}}>
                {winnerData.name} sürümünü incele →
              </Link>
              <Link to="/hakkinda" className="btn btn-line">İndir</Link>
              <button onClick={reset} className="btn btn-ghost">↻ Yeniden başla</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   Compare Table
   ============================================================ */

function CompareTable() {
  return (
    <div style={{border:'1px solid var(--ink-line)', borderRadius:8, overflow:'hidden', background:'var(--ink-2)'}}>
      <div style={{
        display:'grid', gridTemplateColumns:'1.6fr 1fr 1fr 1fr',
        padding:'20px 24px', background:'var(--ink-3)',
        fontFamily:'var(--mono)', fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase',
        color:'var(--sand)', borderBottom:'1px solid var(--ink-line)'
      }}>
        <span>Özellik</span>
        <span style={{color:'var(--crimson)'}}>Geliştirici</span>
        <span style={{color:'var(--saffron)'}}>Ofis</span>
        <span style={{color:'var(--jade)'}}>Bar</span>
      </div>
      {compareRows.map((r, i) => (
        <div key={r[0]} style={{
          display:'grid', gridTemplateColumns:'1.6fr 1fr 1fr 1fr',
          padding:'18px 24px', alignItems:'baseline',
          borderBottom: i < compareRows.length - 1 ? '1px solid var(--ink-line)' : 'none',
          background: i % 2 === 0 ? 'transparent' : 'var(--ink-wash)'
        }}>
          <span style={{fontSize:14, color:'var(--fg)', fontWeight:500}}>{r[0]}</span>
          <span style={{fontSize:14, color:'var(--fg-soft)'}}>{r[1]}</span>
          <span style={{fontSize:14, color:'var(--fg-soft)'}}>{r[2]}</span>
          <span style={{fontSize:14, color:'var(--fg-soft)'}}>{r[3]}</span>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   Page
   ============================================================ */

function Surumler() {
  return (
    <>
      <PageHead
        crumbs={[{label:'Ana sayfa', to:'/'}, {label:'Sürümler'}]}
        title={<>Üç farklı <em>sürüm</em>.</>}
        lede="Geliştiriciden ofis çalışanına, sade bir deneyim isteyene kadar — size uygun KAPiTaN OS sürümünü bulun. Aynı çekirdek, üç farklı kişilik."
        ornamentColor="var(--crimson)"
      >
        <div style={{display:'flex', gap:12, marginTop:36, flexWrap:'wrap'}}>
          <a href="#compare" className="btn btn-crimson">Karşılaştır →</a>
          <a href="#quiz" className="btn btn-line">Yardım ister misin?</a>
          <Link to="/hakkinda" className="btn btn-ghost">İndir</Link>
        </div>
      </PageHead>

      <section className="section">
        <div className="wrap">
          <div className="grid grid-3 reveal">
            {editionsData.map(e => <EditionCard key={e.no} e={e} />)}
          </div>
        </div>
      </section>

      {/* Quiz */}
      <section id="quiz" className="section" style={{background:'var(--ink-1)', borderTop:'1px solid var(--ink-line)', borderBottom:'1px solid var(--ink-line)', position:'relative', overflow:'hidden'}}>
        <div className="ornament-wrap" style={{right:'-180px', top:'10%'}}>
          <MandalaBg color="var(--saffron)" size={600} opacity={0.04}/>
        </div>
        <div className="wrap" style={{position:'relative', zIndex:2}}>
          <div className="reveal">
            <SectionHead no="01" eyebrow="Sürüm seçici"
              title={<>Hangi sürüm <em>size</em> uygun?</>}
              lede="Dört kısa soru. KAPiTaN OS sizin için en uygun sürümü önersin."
              align="center"
            />
          </div>
          <div className="reveal" style={{marginTop:56, maxWidth:780, margin:'56px auto 0'}}>
            <VersionQuiz />
          </div>
        </div>
      </section>

      {/* Compare table */}
      <section id="compare" className="section">
        <div className="wrap">
          <div className="reveal">
            <SectionHead no="02" eyebrow="Karşılaştırma"
              title={<>Yan yana, satır <em>satır</em>.</>}
            />
          </div>
          <div className="reveal" style={{marginTop:64}}>
            <CompareTable />
          </div>
        </div>
      </section>

      {/* Tile band */}
      <TileBand color="var(--crimson)" height={24}/>

      {/* CTA */}
      <section className="section" style={{position:'relative', overflow:'hidden'}}>
        <div className="ornament-wrap" style={{left:'50%', top:'50%', transform:'translate(-50%, -50%)', opacity:1}}>
          <MandalaBg color="var(--crimson)" size={600} opacity={0.05}/>
        </div>
        <div className="wrap" style={{textAlign:'center', position:'relative', zIndex:2}}>
          <div className="reveal" style={{display:'inline-flex', marginBottom:24}}>
            <SectionOrnament color="var(--crimson)"/>
          </div>
          <h2 className="h1 reveal">
            Hangisi olsa <em>ücretsiz</em>.
          </h2>
          <p className="lede reveal delay-1" style={{marginInline:'auto', marginTop:24}}>
            Sürümler arası geçiş her zaman ücretsiz, verileriniz korunur. Tek komut: <code style={{fontFamily:'var(--mono)', color:'var(--saffron)'}}>sürümdeğiştir</code>.
          </p>
          <div className="reveal delay-2" style={{display:'flex', gap:12, justifyContent:'center', marginTop:40, flexWrap:'wrap'}}>
            <Link to="/hakkinda" className="btn btn-crimson">Tümünü indir →</Link>
            <Link to="/komutlar" className="btn btn-line">Komut rehberini gör</Link>
          </div>
        </div>
      </section>
    </>
  );
}

window.Surumler = Surumler;
