/* Ofis sürümü — saffron-tinted, document-centric, ceremonial */

import { Link, PageHead, SectionHead } from '../components/Shell';
import GithubReleaseLink from '../components/GithubReleaseLink.jsx';
import SimulationBadge from '../components/SimulationBadge.jsx';
import { HexRosette, MandalaBg, TileBand } from '../components/Ornaments';
import { getEditionById } from '@data/editions';

const edition = getEditionById('ofis');
const ofisSuite = edition.ofisSuite;
const ofisApps = edition.bundledApps;
const downloadLabel = edition.marketing.downloadLabel;

export default function Ofis() {
  return (
    <>
      <PageHead
        crumbs={[{label:'Ana sayfa',to:'/'},{label:'Sürümler',to:'/surumler'},{label:'Ofis'}]}
        title={<>İşinizi Türkçe <em style={{color:'var(--saffron)'}}>yapın</em>.</>}
        lede={edition.lede}
        ornamentColor="var(--saffron)"
      >
        <div style={{display:'flex', gap:12, marginTop:36, flexWrap:'wrap', alignItems:'center'}}>
          <GithubReleaseLink className="btn btn-crimson" style={{background:'var(--saffron)', color:'var(--ink)', boxShadow:'0 12px 30px -10px rgba(232,178,62,0.4)'}}>{downloadLabel} →</GithubReleaseLink>
          <Link to="/surumler" className="btn btn-line">Karşılaştır</Link>
          <span className="pill pill--saffron"><span className="ldot"/>ÜRETKENLİK ODAKLI</span>
          <SimulationBadge />
        </div>
      </PageHead>

      <section className="section">
        <div className="wrap">
          <div className="reveal">
            <SectionHead no="01" eyebrow="Ofis paketi"
              title={<>Üretkenliğinizi <em style={{color:'var(--saffron)'}}>artıran</em> araçlar.</>}
            />
          </div>
          <div className="grid grid-2 reveal" style={{marginTop:64}}>
            {ofisSuite.map((a, i) => (
              <div key={a.name} className="card card--saffron" style={{padding:'40px', position:'relative', overflow:'hidden'}}>
                <div style={{position:'absolute', top:-30, right:-30, opacity:0.07}}>
                  <HexRosette size={180} color="var(--saffron)" stroke={0.5}/>
                </div>
                <div style={{position:'relative', zIndex:2}}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
                    <span style={{
                      width:46, height:46, display:'grid', placeItems:'center',
                      border:'1px solid rgba(232,178,62,0.3)',
                      borderRadius:6,
                      fontFamily:'var(--display)', fontSize:24,
                      color:'var(--saffron)'
                    }}>{a.icon}</span>
                    <span className="mono" style={{color:'var(--saffron)', fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase'}}>№ 0{i+1}</span>
                  </div>
                  <h3 className="h3" style={{marginTop:24}}>{a.name}</h3>
                  <p className="body" style={{marginTop:14}}>{a.desc}</p>
                  <code className="cmd-strip" style={{ display: 'inline-block', marginTop: 18, padding: '6px 12px', color: 'var(--saffron)' }}>
                    <span className="cmd-strip__prompt">›</span>{a.cmd}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{background:'var(--ink-1)', borderTop:'1px solid var(--ink-line)', borderBottom:'1px solid var(--ink-line)', position:'relative', overflow:'hidden'}}>
        <div className="ornament-wrap" style={{left:'-180px', top:'10%'}}>
          <MandalaBg color="var(--saffron)" size={600} opacity={0.04}/>
        </div>
        <div className="wrap" style={{position:'relative', zIndex:2}}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:64, alignItems:'start'}} className="mail-grid">
            <div className="reveal">
              <SectionHead no="02" eyebrow="E-posta"
                title={<>E-postanızı <em style={{color:'var(--saffron)'}}>akıllıca</em> yönetin.</>}
              />
              <ul style={{listStyle:'none', padding:0, margin:'40px 0 0', display:'grid', gap:16}}>
                {[
                  'Çoklu hesap: Gmail, Outlook, Yahoo — tek arayüz',
                  'Akıllı sınıflandırma: AI otomatik kategorize eder',
                  'Türkçe imla: Yazarken denetim',
                  'AI özetleme: Uzun e-postaları tek tıkla',
                  'Güvenlik: Uçtan uca şifreleme, oltalama koruması',
                ].map((item, i) => (
                  <li key={item} style={{display:'flex', gap:18, alignItems:'flex-start', fontSize:15, color:'var(--fg-soft)', paddingBottom:14, borderBottom:'1px solid var(--ink-line)'}}>
                    <span style={{fontFamily:'var(--mono)', color:'var(--saffron)', minWidth:24}}>0{i+1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="reveal delay-1 win" style={{boxShadow:'0 30px 80px -20px rgba(0,0,0,0.6)'}}>
              <div className="win-bar">
                <span className="d"/><span className="d"/><span className="d"/>
                <span className="title">EpostaYöneticisi · Gelen kutusu</span>
                <span style={{marginLeft:'auto', fontFamily:'var(--mono)', fontSize:10, color:'var(--saffron)', letterSpacing:'0.18em'}}>12 YENİ</span>
              </div>
              <div style={{display:'flex'}}>
                <div style={{width:160, borderRight:'1px solid var(--ink-line)', padding:'18px 16px', display:'grid', gap:8, alignSelf:'stretch', background:'var(--ink-1)'}}>
                  {['Gelen kutusu','Önemli','Taslaklar','Gönderilmiş','Çöp','AI özetleri'].map((l, i) => (
                    <div key={l} style={{
                      fontSize:13, padding:'7px 10px', borderRadius:4,
                      background: i === 0 ? 'rgba(232,178,62,0.10)' : 'transparent',
                      color: i === 0 ? 'var(--saffron)' : 'var(--sand)',
                      borderLeft: i === 0 ? '2px solid var(--saffron)' : '2px solid transparent',
                    }}>{l}</div>
                  ))}
                </div>
                <div style={{flex:1, background:'var(--ink-2)'}}>
                  {[
                    { from:'Ahmet Y.', subj:'Proje güncellemesi', prev:'Merhaba, proje dosyalarını ekte bulabilirsiniz…', tag:'ÖNEMLİ', time:'09:14' },
                    { from:'KAPiTaN AI', subj:'Toplantı özeti', prev:'Bugünkü toplantı notları hazır. 5 aksiyon maddesi…', tag:'AI', time:'08:42' },
                    { from:'Zeynep K.', subj:'Rapor değerlendirmesi', prev:'Raporu inceledim, harika görünüyor…', tag:null, time:'dün' },
                    { from:'Pazar', subj:'2 güncelleme bekliyor', prev:'KodDüzenleyici 4.2 için yeni sürüm…', tag:null, time:'dün' },
                  ].map((m, i, a) => (
                    <div key={i} style={{
                      padding:'16px 20px',
                      borderBottom: i < a.length - 1 ? '1px solid var(--ink-line)' : 'none',
                      display:'grid', gridTemplateColumns:'1fr auto', gap:12, alignItems:'baseline'
                    }}>
                      <div>
                        <div style={{display:'flex', gap:10, alignItems:'baseline'}}>
                          <span style={{fontSize:13, fontWeight:500, color:'var(--ink)'}}>{m.from}</span>
                          {m.tag && <span className="mono" style={{
                            fontSize:9, letterSpacing:'0.16em', padding:'2px 6px',
                            color: m.tag === 'AI' ? 'var(--crimson)' : 'var(--saffron)',
                            border: '1px solid ' + (m.tag === 'AI' ? 'var(--crimson)' : 'var(--saffron)'),
                            borderRadius:2
                          }}>{m.tag}</span>}
                        </div>
                        <div style={{fontSize:14, color:'var(--fg)', marginTop:3}}>{m.subj}</div>
                        <div style={{fontSize:12, color:'var(--sand)', marginTop:3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{m.prev}</div>
                      </div>
                      <span className="mono" style={{fontSize:11, color:'var(--fg-faint)'}}>{m.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div style={{display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:64, alignItems:'start'}} className="ai-mail-grid">
            <div className="reveal win" style={{boxShadow:'0 30px 80px -30px rgba(0,0,0,0.6)'}}>
              <div className="win-bar">
                <span className="d"/><span className="d"/><span className="d"/>
                <span className="title">KAPiTaN AI · Yazı asistanı</span>
                <span style={{marginLeft:'auto', fontFamily:'var(--mono)', fontSize:10, color:'var(--jade)'}}>● BAĞLI</span>
              </div>
              <div className="win-body" style={{padding:'28px', display:'grid', gap:18}}>
                <div style={{justifySelf:'end', background:'var(--ink-3)', padding:'12px 16px', borderRadius:'14px 14px 4px 14px', maxWidth:'72%', fontSize:14}}>
                  Bir proje gecikmesi e-postası yaz.
                </div>
                <div style={{justifySelf:'start', background:'rgba(232,178,62,0.08)', border:'1px solid rgba(232,178,62,0.20)', padding:'16px 18px', borderRadius:'14px 14px 14px 4px', maxWidth:'85%', fontSize:14, lineHeight:1.6, whiteSpace:'pre-line', color:'var(--ink)'}}>
{`Konu: Proje Durum Güncellemesi

Sayın [Alıcı],

Proje takviminde kısa bir gecikme yaşanmıştır.
Yeni teslim tarihi: 24 Mayıs. Gecikme nedeni: dış servis bağımlılığı.
Telafi planı: hafta sonu çalışması ile süreç kapatılacak.

Saygılarımla,
[Gönderen]`}
                </div>
                <div style={{justifySelf:'end', background:'var(--ink-3)', padding:'10px 14px', borderRadius:'14px 14px 4px 14px', maxWidth:'72%', fontSize:13, color:'var(--sand)'}}>
                  Daha resmî ve kısa olsun.
                </div>
              </div>
            </div>

            <div className="reveal delay-1">
              <div className="kicker"><span className="glyph"/><span style={{color:'var(--saffron)'}}>03</span><span style={{color:'var(--fg-faint)'}}>·</span><span>Yazı asistanı</span></div>
              <h2 className="h2" style={{marginTop:22}}>
                Yazmak için <i style={{color:'var(--crimson)'}}>değil</i>, yazdıran AI.
              </h2>
              <ul style={{listStyle:'none', padding:0, margin:'40px 0 0', display:'grid', gap:0}}>
                {[
                  ['E-posta taslağı','Konuyu söyle, AI yazsın'],
                  ['Belge özetleme','Uzun belgeleri tek tıkla'],
                  ['Türkçe imla', 'Bağlam duyarlı denetim'],
                  ['Çeviri',      '50+ dil arası'],
                ].map(([t,b], i, a) => (
                  <li key={t} style={{padding:'16px 0', borderTop:'1px solid var(--ink-line)', borderBottom: i === a.length-1 ? '1px solid var(--ink-line)' : 'none'}}>
                    <div style={{fontSize:15, color:'var(--ink)', fontWeight:500}}>{t}</div>
                    <div style={{fontSize:13, color:'var(--sand)', marginTop:4}}>{b}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{background:'var(--ink-1)', borderTop:'1px solid var(--ink-line)', borderBottom:'1px solid var(--ink-line)'}}>
        <div className="wrap">
          <div className="reveal">
            <SectionHead no="04" eyebrow="Önyüklü uygulamalar"
              title={<><em style={{color:'var(--saffron)'}}>{edition.apps}</em> uygulama, hepsi Türkçe.</>}
            />
          </div>
          <div className="reveal" style={{
            marginTop:64, display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:0,
            border:'1px solid var(--ink-line)', borderRadius:8, overflow:'hidden'
          }}>
            {ofisApps.map((app, i) => (
              <div key={app.name} style={{
                aspectRatio:'1/1',
                borderRight: (i+1) % 6 !== 0 ? '1px solid var(--ink-line)' : 'none',
                borderBottom: i < 6 ? '1px solid var(--ink-line)' : 'none',
                display:'flex', flexDirection:'column', justifyContent:'space-between',
                padding:18, background:'var(--ink-2)'
              }}>
                <span className="mono" style={{fontSize:11, color:'var(--saffron)'}}>{String(i+1).padStart(2,'0')}</span>
                <div>
                  <div style={{fontFamily:'var(--display)', fontSize:40, lineHeight:1, color:'var(--saffron)'}}>{app.icon}</div>
                  <div style={{fontSize:12, color:'var(--sand)', marginTop:8}}>{app.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TileBand color="var(--saffron)" height={24}/>
      <section className="section" style={{position:'relative', overflow:'hidden'}}>
        <div className="ornament-wrap" style={{left:'50%', top:'50%', transform:'translate(-50%, -50%)', opacity:1}}>
          <MandalaBg color="var(--saffron)" size={700} opacity={0.06}/>
        </div>
        <div className="wrap" style={{textAlign:'center', position:'relative', zIndex:2}}>
          <h2 className="h1 reveal">
            <i style={{color:'var(--saffron)'}}>Ofis</i> sürümünü indirin.
          </h2>
          <p className="lede reveal delay-1" style={{marginInline:'auto', marginTop:24}}>Ücretsiz, Türkçe, üretkenliğiniz için tasarlandı.</p>
          <div className="reveal delay-2" style={{display:'flex', gap:12, justifyContent:'center', marginTop:36, flexWrap:'wrap'}}>
            <GithubReleaseLink className="btn btn-crimson" style={{background:'var(--saffron)', color:'var(--ink)', boxShadow:'0 12px 30px -10px rgba(232,178,62,0.4)'}}>ISO {downloadLabel} →</GithubReleaseLink>
          </div>
          <div className="eyebrow reveal delay-3" style={{marginTop:28}}>Minimum {edition.requirements.ramMinLabel} RAM · {edition.requirements.diskMinLabel} disk</div>
        </div>
      </section>
    </>
  );
}