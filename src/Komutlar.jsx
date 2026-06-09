/* Komutlar — beautiful Turkish command reference */

const cmdGroups = [
  { key:'dosya', label:'Dosya & Dizin', count:12, glyph:'⎘',
    rows:[
      ['ls',      'listele',   'lst', 'Dizindeki dosyaları göster'],
      ['cd',      'git',       'gt',  'Çalışma dizinini değiştir'],
      ['pwd',     'nerede',    'nr',  'Şu anki dizini yazdır'],
      ['mkdir',   'klasör',    'kls', 'Yeni klasör oluştur'],
      ['rmdir',   'klasörsil', 'klss','Boş klasörü sil'],
      ['cp',      'kopyala',   'kp',  'Dosya ya da klasör kopyala'],
      ['mv',      'taşı',      'tş',  'Dosya ya da klasör taşı'],
      ['rm',      'sil',       'sl',  'Dosya ya da klasör sil'],
      ['touch',   'oluştur',   'olş', 'Boş dosya oluştur'],
      ['cat',     'oku',       'ok',  'Dosya içeriğini ekrana yazdır'],
      ['find',    'bul',       'bl',  'Dosya sisteminde dosya ara'],
      ['grep',    'ara',       'ar',  'Dosya içeriğinde metin ara'],
    ]
  },
  { key:'sistem', label:'Sistem', count:9, glyph:'◎',
    rows:[
      ['uname',    'sistem',    'sis', 'Sistem bilgisini yazdır'],
      ['top',      'canlı',     'cnl', 'Çalışan işlemleri canlı göster'],
      ['ps',       'işlemler',  'işl', 'Anlık işlem listesi'],
      ['kill',     'durdur',    'drd', 'Bir işlemi sonlandır'],
      ['df',       'disk',      'dsk', 'Disk doluluğunu göster'],
      ['du',       'boyut',     'byt', 'Klasör boyutunu hesapla'],
      ['free',     'bellek',    'blk', 'RAM kullanımını göster'],
      ['shutdown', 'kapat',     'kpt', 'Sistemi kapat'],
      ['reboot',   'yeniden',   'yn',  'Sistemi yeniden başlat'],
    ]
  },
  { key:'ag', label:'Ağ', count:6, glyph:'≈',
    rows:[
      ['ping', 'dene',        'dn',  'Bir ana bilgisayara erişimi sına'],
      ['curl', 'iste',        'ist', 'HTTP isteği gönder'],
      ['wget', 'indir',       'ind', 'Bir bağlantıdan dosya indir'],
      ['ip a', 'ağ',          'ağ',  'Ağ arayüzlerini listele'],
      ['ssh',  'bağlan',      'bğl', 'Uzak sunucuya bağlan'],
      ['scp',  'uzakkopyala', 'uzk', 'Uzak sunucuya dosya kopyala'],
    ]
  },
  { key:'paket', label:'Paket & Pazar', count:5, glyph:'⌂',
    rows:[
      ['apt install','kur',      'kr',  'Pazar\'dan yazılım kur'],
      ['apt remove', 'kaldır',   'kld', 'Yazılımı kaldır'],
      ['apt update', 'güncelle', 'gnc', 'Pazar listesini güncelle'],
      ['apt search', 'pazarara', 'pza', 'Pazar\'da yazılım ara'],
      ['apt list',   'kurulu',   'krl', 'Kurulu yazılımları listele'],
    ]
  },
  { key:'ai', label:'Yapay zekâ', count:5, glyph:'K',
    rows:[
      ['—', 'sor',    'sr',  'AI\'ya Türkçe ile soru sor'],
      ['—', 'kodla',  'kd',  'Açıklamadan kod üret'],
      ['—', 'açıkla', 'ack', 'Bir komutu ya da hatayı açıkla'],
      ['—', 'özet',   'öz',  'Bir dosyayı ya da metni özetle'],
      ['—', 'çevir',  'çv',  '50+ dil arası çeviri yap'],
    ]
  },
];

function CmdTable({ rows, showGroup, accent = 'var(--crimson)' }) {
  const cols = showGroup
    ? '120px 110px 1fr 90px 1.6fr'
    : '130px 1fr 110px 1.7fr';
  return (
    <div style={{border:'1px solid var(--ink-line)', borderRadius:8, overflow:'hidden', background:'var(--ink-2)'}}>
      <div style={{
        display:'grid',
        gridTemplateColumns: cols,
        padding:'18px 24px',
        background:'var(--ink-3)',
        borderBottom:'1px solid var(--ink-line)',
        fontFamily:'var(--mono)', fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--sand)'
      }}>
        {showGroup && <span>Grup</span>}
        <span>POSIX</span>
        <span style={{color: accent}}>KAPiTaN</span>
        <span>Kısa</span>
        <span>Açıklama</span>
      </div>
      {rows.map((r, i) => (
        <div key={i} style={{
          display:'grid',
          gridTemplateColumns: cols,
          padding:'16px 24px',
          alignItems:'baseline',
          borderBottom: i < rows.length - 1 ? '1px solid var(--ink-line)' : 'none',
          background: i % 2 === 0 ? 'transparent' : 'var(--ink-wash)',
          transition:'background 0.15s ease'
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--crimson-wash)'}
        onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'var(--ink-wash)'}>
          {showGroup && <span className="mono" style={{fontSize:12, color:'var(--sand)'}}>{r.group}</span>}
          <code style={{fontFamily:'var(--mono)', fontSize:13, color:'var(--sand)'}}>{r[0]}</code>
          <code style={{fontFamily:'var(--mono)', fontSize:14, color: accent, fontWeight:500}}>{r[1]}</code>
          <code style={{fontFamily:'var(--mono)', fontSize:13, color:'var(--ink)', opacity:0.85}}>{r[2]}</code>
          <span style={{fontSize:14, color:'var(--fg-soft)'}}>{r[3]}</span>
        </div>
      ))}
    </div>
  );
}

function Komutlar() {
  const [active, setActive] = useState('dosya');
  const [q, setQ] = useState('');

  const currentGroup = cmdGroups.find(g => g.key === active);
  const allRows = q ? cmdGroups.flatMap(g => g.rows.map(r => ({...r, group: g.label})))
                          .filter(r => r[0].toLowerCase().includes(q.toLowerCase())
                                    || r[1].toLowerCase().includes(q.toLowerCase())
                                    || r[2].toLowerCase().includes(q.toLowerCase())
                                    || r[3].toLowerCase().includes(q.toLowerCase()))
                    : null;

  return (
    <>
      <PageHead
        crumbs={[{label:'Ana sayfa', to:'/'},{label:'Komutlar'}]}
        title={<>Komut <em>rehberi</em>.</>}
        lede="37 Türkçe uçbirim komutu, POSIX karşılığı ve kısa aliasıyla birlikte. Hem İngilizce komutlarınızı kullanabilir, hem Türkçe uzun adıyla, hem de iki-üç harflik kısa biçimiyle çağırabilirsiniz."
        ornamentColor="var(--crimson)"
      >
        <div style={{display:'flex', gap:14, alignItems:'center', marginTop:36, border:'1px solid var(--ink-line-2)', borderRadius:999, padding:'8px 8px 8px 24px', background:'var(--ink-2)', maxWidth:520}}>
          <span style={{fontFamily:'var(--mono)', fontSize:14, color:'var(--crimson)'}}>›</span>
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="komut ara — örneğin: kopyala, ls, sil, kp"
            style={{flex:1, border:0, background:'transparent', outline:'none', fontFamily:'var(--mono)', fontSize:14, padding:'8px 0', color:'var(--ink)'}}
          />
          {q && <button onClick={() => setQ('')} className="mono" style={{color:'var(--sand)', fontSize:12, paddingRight:14}}>Temizle ×</button>}
        </div>
      </PageHead>

      {!q && (
        <section style={{padding:'48px 0 0', background:'var(--ink-1)', borderBottom:'1px solid var(--ink-line)'}}>
          <div className="wrap" style={{display:'flex', gap:8, overflowX:'auto', paddingBottom:32}}>
            {cmdGroups.map(g => (
              <button key={g.key} onClick={() => setActive(g.key)} style={{
                padding:'14px 20px',
                borderRadius:6,
                fontSize:13,
                fontFamily:'var(--sans)',
                background: active === g.key ? 'var(--crimson)' : 'var(--ink-2)',
                color: active === g.key ? 'var(--pearl)' : 'var(--fg-soft)',
                border:'1px solid ' + (active === g.key ? 'var(--crimson)' : 'var(--ink-line)'),
                cursor:'pointer',
                display:'inline-flex', alignItems:'center', gap:12, whiteSpace:'nowrap'
              }}>
                <span style={{fontFamily:'var(--display)', fontSize:16, opacity:0.9}}>{g.glyph}</span>
                {g.label}
                <span style={{fontFamily:'var(--mono)', fontSize:11, opacity:0.7}}>{g.count}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <div className="wrap">
          {q ? (
            <>
              <SectionHead no="—" eyebrow="Arama sonuçları"
                title={<>«{q}» için <em>{allRows.length} sonuç</em></>}
              />
              <div style={{marginTop:48}}>
                <CmdTable rows={allRows} showGroup />
              </div>
            </>
          ) : (
            <>
              <div className="reveal" style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:16}}>
                <SectionHead no={String(cmdGroups.findIndex(g => g.key === active) + 1).padStart(2,'0')}
                  eyebrow={currentGroup.label}
                  title={<><em>{currentGroup.count}</em> komut bu grupta.</>}
                />
                <span className="mono" style={{color:'var(--sand)'}}>{currentGroup.rows.length} listeleniyor</span>
              </div>
              <div className="reveal" style={{marginTop:56}}>
                <CmdTable rows={currentGroup.rows} />
              </div>
            </>
          )}
        </div>
      </section>

      {/* Try it section */}
      <section className="section" style={{background:'var(--ink-1)', borderTop:'1px solid var(--ink-line)', borderBottom:'1px solid var(--ink-line)', position:'relative', overflow:'hidden'}}>
        <div className="ornament-wrap" style={{right:'-180px', top:'10%'}}>
          <MandalaBg color="var(--crimson)" size={600} opacity={0.05}/>
        </div>
        <div className="wrap" style={{position:'relative', zIndex:2}}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:64, alignItems:'start'}} className="try-grid">
            <div className="reveal">
              <SectionHead no="—" eyebrow="Üç ad, tek komut"
                title={<>POSIX, uzun, kısa — <em>hepsi aynı</em>.</>}
                lede={<>Aynı işi üç şekilde çağırabilirsiniz. <code style={{fontFamily:'var(--mono)', color:'var(--saffron)'}}>ls</code>, <code style={{fontFamily:'var(--mono)', color:'var(--saffron)'}}>listele</code> ve <code style={{fontFamily:'var(--mono)', color:'var(--saffron)'}}>lst</code> aynı dizini gösterir. Hangisi alışkanlığınızdaysa onu kullanın.</>}
              />
              <div style={{marginTop:32, display:'flex', gap:10, flexWrap:'wrap'}}>
                <span className="pill"><span className="ldot"/>37 KOMUT</span>
                <span className="pill pill--saffron"><span className="ldot"/>POSIX UYUMLU</span>
                <span className="pill pill--jade"><span className="ldot"/>KISA ALIAS</span>
              </div>
            </div>
            <div className="reveal delay-1">
              <LiveTerminal title="kapitan@deneme ~ uçbirim" height={360}/>
            </div>
          </div>
        </div>
      </section>

      {/* All groups summary */}
      <section className="section">
        <div className="wrap">
          <div className="reveal">
            <SectionHead no="—" eyebrow="Tüm gruplar"
              title={<>Toplam <em>37</em> komut, beş grupta.</>}
            />
          </div>
          <div className="grid grid-5 reveal" style={{marginTop:56}}>
            {cmdGroups.map((g, i) => (
              <button key={g.key} onClick={() => { setActive(g.key); setQ(''); window.scrollTo({top:520, behavior:'smooth'}); }}
                className="card" style={{
                  textAlign:'left', cursor:'pointer',
                  display:'flex', flexDirection:'column'
                }}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
                  <span style={{fontFamily:'var(--display)', fontSize:36, color:'var(--crimson)', lineHeight:1}}>{g.glyph}</span>
                  <span className="mono" style={{fontSize:11, color:'var(--sand)'}}>{String(i+1).padStart(2,'0')}</span>
                </div>
                <h4 className="h4" style={{marginTop:24}}>{g.label}</h4>
                <div className="eyebrow" style={{marginTop:8}}>{g.count} komut</div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

window.Komutlar = Komutlar;
