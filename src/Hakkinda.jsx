/* Hakkinda — ceremonial download moment */

const downloadOpts = [
  { name:'Geliştirici',  size:'4.2 GB', ram:'8 GB',  acc:'var(--crimson)', sha:'b6a3e9…2c41', to:'/surumler/gelistirici' },
  { name:'Ofis',         size:'3.1 GB', ram:'4 GB',  acc:'var(--saffron)', sha:'d8f124…8e02', to:'/surumler/ofis' },
  { name:'Bar',          size:'1.4 GB', ram:'2 GB',  acc:'var(--jade)',    sha:'a09b41…6f78', to:'/surumler/bar' },
];

const timeline = [
  ['2021', 'Fikir',       'İTÜ\'de bir bilgisayar mühendisliği doktora çalışması olarak başladı.'],
  ['2022', 'İlk sürüm',   '0.1 sürümü 14 katkıda bulunan, 80 Türkçe komutla yayımlandı.'],
  ['2023', 'Topluluk',    'Forum açıldı, 1 000+ kullanıcıya ulaşıldı. İlk düzenli konferans.'],
  ['2024', 'Üç sürüm',    'Geliştirici, Ofis ve Bar olarak ayrıştı. Pazar yayında.'],
  ['2025', 'AI',          'KAPiTaN AI v1 yayımlandı; doğal Türkçe komut sistemi.'],
  ['2026', '3.2',         '52 000 aktif kullanıcı, 218 komut, 1 200+ Pazar yazılımı.'],
];

const faqs = [
  ['KAPiTaN OS ücretsiz mi?',
   'Evet, tamamen ücretsizdir ve GPL-3.0 lisansı altında dağıtılır. Ticari kullanım da serbesttir.'],
  ['Mevcut Linux yazılımları çalışır mı?',
   'Evet, KAPiTaN OS POSIX uyumlu bir çekirdek üzerine kurulmuştur. Mevcut Linux uygulamalarınız ve betikleriniz değişiklik gerektirmeden çalışır.'],
  ['Yapay zekâ özelliği bulutta mı çalışıyor?',
   'Hayır, KAPiTaN AI varsayılan olarak cihazınızda yerel çalışır. Bulut modu isteğe bağlıdır ve istediğiniz zaman kapatabilirsiniz.'],
  ['Sürümler arası geçiş yapabilir miyim?',
   'Evet, sürümler arası geçiş her zaman ücretsizdir ve verileriniz korunur. Tek bir komutla istediğiniz sürüme geçebilirsiniz.'],
  ['Türkçe karakterler her yerde destekleniyor mu?',
   'Evet, ı/İ ayrımı dâhil tüm Türkçe karakterler komutlarda, dosya adlarında ve uçbirimde tam olarak desteklenir.'],
  ['Hangi donanım gereksinimleri var?',
   'Bar sürümü 2 GB RAM ile, Ofis sürümü 4 GB ile, Geliştirici sürümü 8 GB ile çalışır. Detaylar sürüm sayfalarındadır.'],
];

/* ============================================================
   Ceremonial download — animated counter
   ============================================================ */

function CeremonialDownload() {
  const [stage, setStage] = useState(0); // 0 idle, 1 prep, 2 ready, 3 downloading, 4 done
  const [progress, setProgress] = useState(0);
  const [chosen, setChosen] = useState(0); // 0..2 edition index

  const start = () => {
    setStage(1);
    setProgress(0);
    setTimeout(() => setStage(2), 900);
    setTimeout(() => setStage(3), 1700);
  };

  useEffect(() => {
    if (stage !== 3) return;
    let v = 0;
    const id = setInterval(() => {
      v += 1.6 + Math.random() * 2;
      if (v >= 100) {
        v = 100; clearInterval(id);
        setStage(4);
      }
      setProgress(v);
    }, 100);
    return () => clearInterval(id);
  }, [stage]);

  const opt = downloadOpts[chosen];

  return (
    <div style={{
      border:'1px solid var(--ink-line)',
      background:'linear-gradient(180deg, var(--ink-2), var(--ink-1))',
      borderRadius:12,
      overflow:'hidden',
      position:'relative'
    }}>
      <div style={{position:'absolute', right:-100, top:-100, opacity:0.06, pointerEvents:'none'}}>
        <MandalaBg color={opt.acc} size={400} opacity={1} className={stage === 3 ? 'spin-slow' : ''}/>
      </div>

      <div style={{padding:'40px 40px 32px', position:'relative', zIndex:2}}>
        {/* Edition tabs */}
        <div style={{display:'flex', gap:8, marginBottom:32}}>
          {downloadOpts.map((d, i) => (
            <button key={d.name} onClick={() => stage === 0 && setChosen(i)}
              disabled={stage !== 0}
              style={{
                padding:'10px 18px',
                borderRadius:999,
                fontSize:13,
                background: chosen === i ? d.acc : 'var(--ink-2)',
                color: chosen === i ? 'var(--pearl)' : 'var(--sand)',
                border:'1px solid ' + (chosen === i ? d.acc : 'var(--ink-line)'),
                cursor: stage === 0 ? 'pointer' : 'not-allowed',
                opacity: stage === 0 ? 1 : (chosen === i ? 1 : 0.4)
              }}>
              {d.name}
            </button>
          ))}
        </div>

        <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', flexWrap:'wrap', gap:24}}>
          <div>
            <span className="mono" style={{fontSize:11, letterSpacing:'0.18em', color:'var(--sand)', textTransform:'uppercase'}}>kapitan.iso</span>
            <h3 style={{fontFamily:'var(--display)', fontSize:'clamp(48px, 5vw, 72px)', lineHeight:1, marginTop:14}}>
              KAPiTaN OS v3.2 <i style={{fontFamily:'var(--serif)', fontStyle:'italic', color:opt.acc}}>{opt.name}</i>
            </h3>
          </div>
          <div className="mono" style={{fontSize:11, color:'var(--sand)', letterSpacing:'0.14em', textAlign:'right'}}>
            <div>SHA-256 · {opt.sha}</div>
            <div style={{marginTop:4}}>Min RAM: {opt.ram} · Boyut: {opt.size}</div>
          </div>
        </div>

        {/* Stage UI */}
        <div style={{marginTop:48}}>
          {stage === 0 && (
            <div>
              <p className="body" style={{maxWidth:'60ch'}}>
                Aşağıdaki düğmeye tıklayarak ISO indirme işlemini başlatın. Doğrulama, indirme ve sonraki kurulum adımları için kısa rehberi takip edebilirsiniz.
              </p>
              <button onClick={start} className="btn btn-crimson" style={{
                marginTop:24, padding:'18px 32px', fontSize:16,
                background: opt.acc, boxShadow: `0 16px 40px -12px ${opt.acc}`
              }}>
                İndirmeyi başlat ({opt.size}) →
              </button>
            </div>
          )}

          {stage === 1 && (
            <div style={{padding:'16px 0'}}>
              <div className="mono" style={{color:'var(--sand)', fontSize:13, marginBottom:14}}>
                <span style={{color:'var(--crimson)'}}>›</span> indir kapitan başlatılıyor…
              </div>
              <div className="mono" style={{color:'var(--sand)'}}>
                ✓ Ayna sunucu seçildi: cdn.kapitan.org.tr<br/>
                ✓ Bağlantı kontrol edildi: 145 Mbps<br/>
                <span className="caret"/>
              </div>
            </div>
          )}

          {(stage === 2 || stage === 3) && (
            <div>
              <div style={{
                display:'flex', justifyContent:'space-between',
                fontFamily:'var(--mono)', fontSize:12, color:'var(--sand)',
                marginBottom:14
              }}>
                <span>{stage === 2 ? 'Hazırlanıyor…' : 'İndiriliyor'}</span>
                <span>{Math.floor(progress)}% · ~{Math.max(1, Math.floor((100-progress)/8))} sn</span>
              </div>
              <div style={{height:6, background:'var(--ink-line)', borderRadius:3, overflow:'hidden'}}>
                <div style={{
                  height:'100%', width:progress+'%',
                  background:opt.acc,
                  boxShadow:`0 0 18px ${opt.acc}`,
                  transition:'width 0.1s linear'
                }}/>
              </div>
              <div style={{
                marginTop:24, fontFamily:'var(--mono)', fontSize:13, color:'var(--sand)',
                display:'grid', gap:6
              }}>
                {stage >= 2 && <div className="fadein">✓ Ayna sunucu: cdn.kapitan.org.tr (İstanbul)</div>}
                {stage >= 3 && progress > 10 && <div className="fadein">✓ İmza doğrulanıyor</div>}
                {stage >= 3 && progress > 40 && <div className="fadein">✓ İndirilen: {(opt.size.replace(' GB','') * progress/100).toFixed(2)} GB</div>}
                {stage >= 3 && progress > 70 && <div className="fadein">✓ Toplam tahmini bitiş: <span style={{color:'var(--saffron)'}}>{Math.max(1, Math.floor((100-progress)/8))} sn</span></div>}
              </div>
            </div>
          )}

          {stage === 4 && (
            <div className="fadein">
              <div style={{display:'inline-flex', marginBottom:20}}>
                <SectionOrnament color={opt.acc} width={200}/>
              </div>
              <h3 style={{fontFamily:'var(--display)', fontSize:'clamp(40px, 5vw, 64px)', lineHeight:1}}>
                İndirme <i style={{fontFamily:'var(--serif)', color:'var(--jade)'}}>tamamlandı</i>.
              </h3>
              <p className="lede" style={{marginTop:18}}>
                Sırada doğrulama, USB belleğe yazma ve kuruluma başlama. Her adım için
                Türkçe rehberimiz mevcut.
              </p>
              <div style={{
                marginTop:24, padding:'18px 22px',
                background:'var(--ink)', border:'1px solid var(--ink-line)', borderRadius:6,
                fontFamily:'var(--mono)', fontSize:13, color:'var(--ink)'
              }}>
                <span style={{color:'var(--crimson)'}}>›</span> doğrula iso ./{opt.name.toLowerCase()}-3.2.iso<br/>
                <span style={{color:'var(--jade)'}}>✓ İmza eşleşti · SHA-256 doğru</span>
              </div>
              <div style={{display:'flex', gap:12, marginTop:24, flexWrap:'wrap'}}>
                <Link to={opt.to} className="btn btn-crimson" style={{background:opt.acc, boxShadow:'none'}}>
                  Kurulum rehberini aç →
                </Link>
                <button onClick={() => setStage(0)} className="btn btn-line">↻ Başka sürüm indir</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Page
   ============================================================ */

function Hakkinda() {
  const [openFaq, setOpenFaq] = useState(0);
  return (
    <>
      <PageHead
        crumbs={[{label:'Ana sayfa',to:'/'},{label:'Hakkında & indir'}]}
        title={<>İndir, kur, <em>başla</em>.</>}
        lede="KAPiTaN OS ücretsiz, açık kaynak ve tamamen Türkçedir. Üç sürümden istediğinizi indirin; sonradan istediğiniz zaman geçiş yapabilirsiniz."
        ornamentColor="var(--crimson)"
      />

      {/* Ceremonial download */}
      <section className="section" style={{position:'relative', overflow:'hidden'}}>
        <div className="wrap" style={{maxWidth:920, margin:'0 auto'}}>
          <div className="reveal">
            <SectionHead no="01" eyebrow="ISO indir"
              title={<>Hangi sürümü <em>seçeceksiniz</em>?</>}
              align="center"
            />
          </div>
          <div className="reveal" style={{marginTop:64}}>
            <CeremonialDownload />
          </div>
        </div>
      </section>

      {/* Quick options grid */}
      <section className="section" style={{background:'var(--ink-1)', borderTop:'1px solid var(--ink-line)', borderBottom:'1px solid var(--ink-line)'}}>
        <div className="wrap">
          <div className="reveal">
            <SectionHead no="02" eyebrow="Doğrudan ISO"
              title={<>İmza ve <em>kontrol</em>.</>}
            />
          </div>
          <div className="grid grid-3 reveal" style={{marginTop:64}}>
            {downloadOpts.map((d, i) => (
              <div key={d.name} className="card" style={{padding:'32px', display:'flex', flexDirection:'column'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
                  <span className="mono" style={{color:d.acc, letterSpacing:'0.18em', textTransform:'uppercase'}}>SÜRÜM № 0{i+1}</span>
                  <span className="mono" style={{color:'var(--sand)'}}>{d.size}</span>
                </div>
                <h3 style={{fontFamily:'var(--display)', fontSize:48, lineHeight:1.04, marginTop:24}}>
                  <i style={{fontFamily:'var(--serif)', fontStyle:'italic', color:d.acc}}>{d.name}</i>
                </h3>
                <div style={{
                  marginTop:24, padding:'14px 16px',
                  background:'var(--ink)', borderRadius:4,
                  border:'1px solid var(--ink-line)',
                  display:'flex', flexDirection:'column', gap:10
                }}>
                  <div style={{display:'flex', justifyContent:'space-between'}}>
                    <span className="eyebrow">Min RAM</span>
                    <span style={{fontSize:13, fontFamily:'var(--mono)', color:'var(--ink)'}}>{d.ram}</span>
                  </div>
                  <div style={{display:'flex', justifyContent:'space-between'}}>
                    <span className="eyebrow">Mimari</span>
                    <span style={{fontSize:13, fontFamily:'var(--mono)', color:'var(--ink)'}}>x86_64 · arm64</span>
                  </div>
                  <div style={{display:'flex', justifyContent:'space-between'}}>
                    <span className="eyebrow">SHA-256</span>
                    <span style={{fontSize:13, fontFamily:'var(--mono)', color:'var(--ink)'}}>{d.sha}</span>
                  </div>
                </div>
                <div style={{marginTop:'auto', paddingTop:24, display:'grid', gap:8}}>
                  <button className="btn btn-crimson" style={{justifyContent:'center', background:d.acc, boxShadow:'none'}}>ISO indir ({d.size}) →</button>
                  <Link to={d.to} className="btn btn-ghost" style={{justifyContent:'center', fontSize:13}}>Sürüm sayfasına git</Link>
                </div>
              </div>
            ))}
          </div>

          <div style={{marginTop:36, padding:'18px 22px', border:'1px solid var(--ink-line)', borderRadius:6, background:'var(--ink-2)', display:'flex', alignItems:'baseline', gap:14, flexWrap:'wrap'}}>
            <span className="mono" style={{color:'var(--crimson)'}}>!</span>
            <span style={{fontSize:14, color:'var(--fg-soft)', flex:1, minWidth:280}}>
              İndirdikten sonra mutlaka SHA-256 imzayı doğrulayın. Komut:
            </span>
            <code style={{fontFamily:'var(--mono)', fontSize:12, color:'var(--saffron)'}}>doğrula iso ./kapitan-3.2.iso</code>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section" style={{position:'relative', overflow:'hidden'}}>
        <div className="ornament-wrap" style={{left:'-200px', top:'10%'}}>
          <MandalaBg color="var(--saffron)" size={500} opacity={0.05}/>
        </div>
        <div className="wrap" style={{position:'relative', zIndex:2}}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1.6fr', gap:64, alignItems:'start'}} className="story-grid">
            <div className="reveal">
              <SectionHead no="03" eyebrow="Kısa hikâye"
                title={<>2021'den <em>bugüne</em>.</>}
                lede="İstanbul'da başlayan bir doktora çalışması, beş yıl içinde 52 000 kullanıcının kullandığı, 1 247 katkıda bulunanın geliştirdiği bağımsız bir projeye dönüştü."
              />
              <div style={{marginTop:36, display:'flex', gap:10, flexWrap:'wrap'}}>
                <span className="pill"><span className="ldot"/>GPL-3.0</span>
                <span className="pill pill--saffron"><span className="ldot"/>VAKIF · İSTANBUL</span>
              </div>
            </div>

            <div className="reveal" style={{borderLeft:'1px solid var(--ink-line)'}}>
              {timeline.map(([y, t, b], i) => (
                <div key={y} style={{
                  padding:'32px 0 32px 40px',
                  position:'relative',
                  borderBottom: i < timeline.length - 1 ? '1px solid var(--ink-line)' : 'none'
                }}>
                  <span style={{
                    position:'absolute', left:-7, top:38,
                    width:13, height:13, borderRadius:'50%',
                    background: i === timeline.length - 1 ? 'var(--crimson)' : 'var(--ink-2)',
                    border: '1px solid ' + (i === timeline.length - 1 ? 'var(--crimson)' : 'var(--ink-line-2)'),
                    boxShadow: i === timeline.length - 1 ? '0 0 16px var(--crimson-glow)' : 'none'
                  }}/>
                  <div style={{display:'flex', alignItems:'baseline', gap:18}}>
                    <span style={{fontFamily:'var(--display)', fontSize:40, color:'var(--ink)'}}>{y}</span>
                    <span className="mono" style={{fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--crimson)'}}>{t}</span>
                  </div>
                  <p className="body" style={{marginTop:10, maxWidth:'60ch'}}>{b}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{background:'var(--ink-1)', borderTop:'1px solid var(--ink-line)', borderBottom:'1px solid var(--ink-line)'}}>
        <div className="wrap">
          <div className="reveal">
            <SectionHead no="04" eyebrow="Sıkça sorulan sorular"
              title={<>Önceki <em>kullanıcılara</em> sorulanlar.</>}
            />
          </div>
          <div className="reveal" style={{
            marginTop:64,
            border:'1px solid var(--ink-line)',
            borderRadius:8,
            background:'var(--ink-2)',
            overflow:'hidden'
          }}>
            {faqs.map(([q, a], i) => {
              const open = openFaq === i;
              return (
                <div key={q} style={{borderBottom: i < faqs.length - 1 ? '1px solid var(--ink-line)' : 'none'}}>
                  <button onClick={() => setOpenFaq(open ? -1 : i)} style={{
                    width:'100%', textAlign:'left',
                    padding:'28px 32px',
                    display:'grid', gridTemplateColumns:'48px 1fr 40px', gap:18,
                    alignItems:'baseline',
                    cursor:'pointer',
                    background: open ? 'var(--ink-3)' : 'transparent'
                  }}>
                    <span className="mono" style={{color:'var(--crimson)'}}>{String(i+1).padStart(2,'0')}</span>
                    <span style={{fontFamily:'var(--display)', fontSize:24, color:'var(--ink)'}}>{q}</span>
                    <span style={{fontFamily:'var(--serif)', fontStyle:'italic', fontSize:28, color:'var(--crimson)', textAlign:'right', transform: open ? 'rotate(45deg)' : 'none', transition:'transform 0.2s ease', display:'inline-block', lineHeight:1}}>+</span>
                  </button>
                  {open && (
                    <div style={{padding:'0 32px 32px 98px'}}>
                      <p className="body" style={{maxWidth:'66ch'}}>{a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <TileBand color="var(--crimson)" height={24}/>
      <section className="section" style={{position:'relative', overflow:'hidden'}}>
        <div className="ornament-wrap" style={{left:'50%', top:'50%', transform:'translate(-50%, -50%)', opacity:1}}>
          <MandalaBg color="var(--crimson)" size={600} opacity={0.05}/>
        </div>
        <div className="wrap" style={{textAlign:'center', maxWidth:720, margin:'0 auto', position:'relative', zIndex:2}}>
          <div className="reveal kicker" style={{justifyContent:'center'}}>
            <span className="glyph"/><span style={{color:'var(--crimson)'}}>05</span>
            <span style={{color:'var(--fg-faint)'}}>·</span><span>Bülten</span>
          </div>
          <h2 className="h1 reveal" style={{marginTop:22}}>
            Yeni sürümler için <em>haber alın</em>.
          </h2>
          <p className="lede reveal delay-1" style={{marginInline:'auto', marginTop:24}}>
            Ayda bir, fazla değil. Yeni sürümler, etkinlikler, topluluk haberleri.
          </p>

          <form onSubmit={e => e.preventDefault()} className="reveal delay-2" style={{
            marginTop:40, display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap',
            maxWidth:540, marginInline:'auto'
          }}>
            <input type="email" placeholder="e-posta@adresi.tr" style={{
              flex:1, minWidth:260,
              background:'var(--ink-2)', border:'1px solid var(--ink-line)',
              color:'var(--ink)', padding:'14px 22px', borderRadius:999,
              fontFamily:'var(--sans)', fontSize:14, outline:'none'
            }}/>
            <button className="btn btn-crimson" type="submit">Abone ol →</button>
          </form>
          <div className="eyebrow reveal delay-3" style={{marginTop:20}}>İstenmeyen posta yok. Tek tıkla çıkış.</div>
        </div>
      </section>
    </>
  );
}

window.Hakkinda = Hakkinda;
