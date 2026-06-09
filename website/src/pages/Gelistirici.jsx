/* Geliştirici sürümü — code-native, terminal-centric */

import { Link, PageHead, SectionHead } from '../components/Shell';
import GithubReleaseLink from '../components/GithubReleaseLink.jsx';
import { MandalaBg, TileBand, CornerOrnament } from '../components/Ornaments';
import { AIPrompt, LiveTerminal } from '../components/Interactive';
import { getEditionById, formatCommandTarget } from '@data/editions';

const edition = getEditionById('gelistirici');
const devFeatures = edition.devFeatures;
const devTools = edition.devTools;
const devSpecs = edition.devSpecs;
const downloadLabel = edition.marketing.downloadLabel;
const commandTargetLabel = formatCommandTarget(edition.edition_command_target);

export default function Gelistirici() {
  return (
    <>
      <PageHead
        crumbs={[{label:'Ana sayfa',to:'/'},{label:'Sürümler',to:'/surumler'},{label:'Geliştirici'}]}
        title={<>Kod yazmanın yeni <em>dili</em>, Türkçe.</>}
        lede={`Yapay zekâ entegre, ${commandTargetLabel} Türkçe komut, önderlenmiş geliştirme araçları ve Türkçe doğal dil programlama.`}
        ornamentColor="var(--crimson)"
      >
        <div style={{display:'flex', gap:12, marginTop:36, flexWrap:'wrap', alignItems:'center'}}>
          <GithubReleaseLink className="btn btn-crimson">{downloadLabel} →</GithubReleaseLink>
          <Link to="/komutlar" className="btn btn-line">Komutları incele</Link>
          <span className="pill"><span className="ldot"/>YAPAY ZEKÂ DESTEKLİ</span>
        </div>
      </PageHead>

      <section className="section">
        <div className="wrap">
          <div className="reveal">
            <SectionHead no="01" eyebrow="Sürüm özellikleri"
              title={<>Geliştirici için <em>tasarlandı</em>.</>}
            />
          </div>
          <div className="grid grid-2 reveal" style={{marginTop:64, gap:0, borderTop:'1px solid var(--ink-line)'}}>
            {devFeatures.map((f, i) => (
              <div key={f.no} style={{
                padding:'48px 40px',
                borderBottom:'1px solid var(--ink-line)',
                borderRight: i % 2 === 0 ? '1px solid var(--ink-line)' : 'none',
                position:'relative'
              }}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
                  <span className="mono" style={{color:'var(--crimson)'}}>№ {f.no}</span>
                  <CornerOrnament size={20} color="var(--crimson)"/>
                </div>
                <h3 className="h3" style={{marginTop:18}}>{f.title}</h3>
                <p className="body" style={{marginTop:16, maxWidth:'44ch'}}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{background:'var(--ink-1)', borderTop:'1px solid var(--ink-line)', borderBottom:'1px solid var(--ink-line)', position:'relative', overflow:'hidden'}}>
        <div className="ornament-wrap" style={{right:'-180px', top:'5%'}}>
          <MandalaBg color="var(--crimson)" size={700} opacity={0.06}/>
        </div>
        <div className="wrap" style={{position:'relative', zIndex:2}}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1.3fr', gap:64}} className="ai-grid">
            <div className="reveal">
              <div className="kicker"><span className="glyph"/><span style={{color:'var(--crimson)'}}>02</span><span style={{color:'var(--fg-faint)'}}>·</span><span>Yapay zekâ</span></div>
              <h2 className="h2" style={{marginTop:22}}>
                AI sizin <i>kod ortağınız</i>.
              </h2>
              <p className="lede" style={{marginTop:24, maxWidth:'40ch'}}>
                Doğal Türkçe ile söyleyin, KAPiTaN AI yazsın. Aşağıdaki kutuya bir kod isteği yazın.
              </p>
              <ul style={{listStyle:'none', padding:0, margin:'40px 0 0', display:'grid', gap:0}}>
                {[
                  ['Doğal dil kodlama','Türkçe söyleyin, AI yazsın'],
                  ['Akıllı hata ayıklama','Hata mesajlarını açıklar'],
                  ['Güvenlik analizi','Zafiyetleri tarar'],
                  ['Türkçe belgeleme','Fonksiyon belgelerini üretir'],
                ].map(([t,b], i, a) => (
                  <li key={t} style={{padding:'18px 0', borderTop:'1px solid var(--ink-line)', borderBottom: i === a.length-1 ? '1px solid var(--ink-line)' : 'none'}}>
                    <div style={{fontSize:15, color:'var(--ink)', fontWeight:500}}>{t}</div>
                    <div style={{fontSize:13, color:'var(--sand)', marginTop:4}}>{b}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="reveal delay-1">
              <AIPrompt
                placeholder="örnek: bana fibonacci dizisi üreten kısa bir python fonksiyonu yaz"
                presets={[
                  'Python ile fibonacci yaz',
                  'JSON dosyasını oku',
                  'Bir REST API iskeleti yaz',
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div style={{display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:64, alignItems:'start'}} className="try-grid">
            <div className="reveal">
              <SectionHead no="03" eyebrow="Uçbirimi deneyin"
                title={<>{commandTargetLabel} komut, hepsi <em>Türkçe</em>.</>}
                lede={<>Aşağıdaki uçbirim canlı. <code style={{fontFamily:'var(--mono)', color:'var(--saffron)'}}>sistem</code> ya da <code style={{fontFamily:'var(--mono)', color:'var(--saffron)'}}>listele</code> yazıp dene.</>}
              />
            </div>
            <div className="reveal delay-1">
              <LiveTerminal title="kapitan@dev ~ uçbirim" height={340}/>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{background:'var(--ink-1)', borderTop:'1px solid var(--ink-line)', borderBottom:'1px solid var(--ink-line)'}}>
        <div className="wrap">
          <div className="reveal">
            <SectionHead no="04" eyebrow="Önyüklü araçlar"
              title={<>Kurulum gerektirmeyen <em>{edition.apps}</em> araç.</>}
            />
          </div>
          <div className="grid grid-5 reveal" style={{marginTop:64}}>
            {devTools.map((t, i) => (
              <div key={t.name} className="card" style={{padding:'24px 20px', background:'var(--ink-2)'}}>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                  <span style={{
                    fontFamily:'var(--mono)', fontSize:11, color:'var(--crimson)',
                    border:'1px solid var(--ink-line)', borderRadius:3,
                    padding:'2px 8px'
                  }}>{String(i+1).padStart(2,'0')}</span>
                  <span style={{fontFamily:'var(--serif)', fontStyle:'italic', color:'var(--sand)', fontSize:14}}>{t.category}</span>
                </div>
                <div style={{marginTop:18, fontSize:14, color:'var(--ink)', fontWeight:500}}>{t.name}</div>
                <code style={{display:'block', marginTop:16, fontFamily:'var(--mono)', fontSize:12, color:'var(--saffron)'}}>{t.cmd}</code>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="reveal">
            <SectionHead no="05" eyebrow="Teknik detaylar"
              title={<>Saç teli inceliğinde <em>ayrıntılar</em>.</>}
            />
          </div>
          <div className="reveal" style={{
            marginTop:64,
            display:'grid', gridTemplateColumns:'1fr 1fr', gap:0,
            border:'1px solid var(--ink-line)', background:'var(--ink-2)',
            borderRadius:8, overflow:'hidden'
          }}>
            {devSpecs.map((s, i) => {
              const lastTwo = i >= devSpecs.length - 2;
              return (
                <div key={s.label} style={{
                  display:'grid', gridTemplateColumns:'200px 1fr',
                  padding:'20px 24px', alignItems:'baseline',
                  borderBottom: !lastTwo ? '1px solid var(--ink-line)' : 'none',
                  borderRight: i % 2 === 0 ? '1px solid var(--ink-line)' : 'none'
                }}>
                  <span className="eyebrow">{s.label}</span>
                  <span style={{fontSize:14, color:'var(--fg)', fontFamily:'var(--mono)'}}>{s.value}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <TileBand color="var(--crimson)" height={24}/>
      <section className="section" style={{position:'relative', overflow:'hidden'}}>
        <div className="ornament-wrap" style={{left:'50%', top:'50%', transform:'translate(-50%, -50%)', opacity:1}}>
          <MandalaBg color="var(--crimson)" size={700} opacity={0.06}/>
        </div>
        <div className="wrap" style={{textAlign:'center', position:'relative', zIndex:2}}>
          <h2 className="h1 reveal">
            <i style={{fontFamily:'var(--serif)', fontStyle:'italic', color:'var(--crimson)'}}>Geliştirici</i> sürümünü indirin.
          </h2>
          <p className="lede reveal delay-1" style={{marginInline:'auto', marginTop:24}}>Ücretsiz, açık kaynak, tamamen Türkçe.</p>
          <div className="reveal delay-2" style={{display:'flex', gap:12, justifyContent:'center', marginTop:36, flexWrap:'wrap'}}>
            <GithubReleaseLink className="btn btn-crimson">ISO {downloadLabel} →</GithubReleaseLink>
            <Link to="/hakkinda" className="btn btn-line">Docker görseli</Link>
          </div>
        </div>
      </section>
    </>
  );
}