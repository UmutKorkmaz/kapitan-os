/* Bar sürümü — jade, minimal, contemplative */

import { Link, PageHead, SectionHead } from '../components/Shell';
import GithubReleaseLink from '../components/GithubReleaseLink.jsx';
import { MandalaBg, SectionOrnament, TileBand } from '../components/Ornaments';
import { getEditionById } from '@data/editions';

const edition = getEditionById('bar');
const barApps = edition.bundledApps;
const barNot = edition.excludedApps;
const stats = edition.stats;
const downloadLabel = edition.marketing.downloadLabel;

export default function Bar() {
  return (
    <>
      <PageHead
        crumbs={[{label:'Ana sayfa',to:'/'},{label:'Sürümler',to:'/surumler'},{label:'Bar'}]}
        title={<>Sadece <em style={{color:'var(--jade)'}}>ihtiyacınız</em> olan.</>}
        lede={edition.lede}
        ornamentColor="var(--jade)"
      >
        <div style={{display:'flex', gap:12, marginTop:36, flexWrap:'wrap', alignItems:'center'}}>
          <GithubReleaseLink className="btn btn-crimson" style={{background:'var(--jade)', boxShadow:'0 12px 30px -10px rgba(63,142,99,0.4)'}}>{downloadLabel} →</GithubReleaseLink>
          <span className="pill pill--jade"><span className="ldot"/>TEMİZ VE SADE</span>
        </div>
      </PageHead>

      <section className="section--loose section" style={{position:'relative', overflow:'hidden'}}>
        <div className="ornament-wrap" style={{left:'50%', top:'50%', transform:'translate(-50%, -50%)', opacity:1}}>
          <MandalaBg color="var(--jade)" size={800} opacity={0.04}/>
        </div>
        <div className="wrap" style={{maxWidth:920, textAlign:'center', margin:'0 auto', position:'relative', zIndex:2}}>
          <div className="reveal" style={{display:'inline-flex', marginBottom:36}}>
            <SectionOrnament color="var(--jade)"/>
          </div>
          <h2 className="display reveal" style={{fontSize:'clamp(56px, 8vw, 120px)'}}>
            <i style={{color:'var(--jade)'}}>Az</i>, bazen<br/>
            çok daha <span className="sub">fazladır</span>.
          </h2>
          <p className="lede reveal delay-1" style={{marginInline:'auto', marginTop:44}}>
            Bar Sürümü, gereksiz her şeyi arındırarak size sadece ihtiyacınız olan araçları
            sunar. {edition.requirements.ramMinLabel} RAM ile çalışır, {edition.bootTime.replace('~', '')} açılır, pil ömrü diğer sürümlere göre
            %40 daha uzundur.
          </p>

          <div className="reveal delay-2" style={{
            marginTop:72, display:'grid',
            gridTemplateColumns:'repeat(3, 1fr)', gap:0,
            borderTop:'1px solid var(--ink-line)', borderBottom:'1px solid var(--ink-line)'
          }}>
            {stats.map((stat, i) => (
              <div key={stat.label} style={{
                padding:'48px 24px',
                borderRight: i < 2 ? '1px solid var(--ink-line)' : 'none'
              }}>
                <div style={{fontFamily:'var(--display)', fontSize:'clamp(48px, 5vw, 80px)', lineHeight:1, color:'var(--ink)'}}>{stat.value}</div>
                <div className="eyebrow" style={{marginTop:16, color:'var(--jade)'}}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{background:'var(--ink-1)', borderTop:'1px solid var(--ink-line)', borderBottom:'1px solid var(--ink-line)'}}>
        <div className="wrap">
          <div className="reveal">
            <SectionHead no="01" eyebrow="Önyüklü uygulamalar"
              title={<>Sadece <em style={{color:'var(--jade)'}}>sekiz</em> uygulama. Hepsi gerekli.</>}
            />
          </div>
          <div className="reveal" style={{
            marginTop:64,
            display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:0,
            border:'1px solid var(--ink-line)', borderRadius:8, overflow:'hidden'
          }}>
            {barApps.map((a, i) => (
              <div key={a.name} style={{
                padding:'32px 28px',
                borderRight: (i+1) % 4 !== 0 ? '1px solid var(--ink-line)' : 'none',
                borderBottom: i < 4 ? '1px solid var(--ink-line)' : 'none',
                background:'var(--ink-2)',
                position:'relative'
              }}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
                  <span style={{
                    width:42, height:42, display:'grid', placeItems:'center',
                    border:'1px solid rgba(63,142,99,0.3)',
                    borderRadius:6,
                    fontFamily:'var(--display)', fontSize:20,
                    color:'var(--jade)'
                  }}>{a.icon}</span>
                  <span className="mono" style={{color:'var(--jade)', fontSize:11}}>№ {String(i+1).padStart(2,'0')}</span>
                </div>
                <h4 style={{marginTop:24, fontSize:17, color:'var(--ink)', fontWeight:500}}>{a.name}</h4>
                <p style={{fontSize:13, color:'var(--sand)', marginTop:8, minHeight:'3em'}}>{a.desc}</p>
                <code style={{display:'block', marginTop:14, fontFamily:'var(--mono)', fontSize:12, color:'var(--jade)'}}>{a.cmd}</code>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="reveal">
            <SectionHead no="02" eyebrow="Bilinçli sadelik"
              title={<><em>Gereksiz</em> hiçbir şey yok.</>}
              lede="İhtiyacınız olanları KAPiTaN Pazar'dan istediğiniz zaman ekleyebilirsiniz. Bar sürümü size tam olarak yetecek kadar yüklü gelir."
            />
          </div>
          <div className="grid grid-3 reveal" style={{marginTop:48}}>
            {barNot.map((n) => (
              <div key={n} style={{
                padding:'24px 28px',
                border:'1px solid var(--ink-line)',
                borderRadius:6,
                display:'flex', justifyContent:'space-between', alignItems:'center',
                background:'var(--ink-2)'
              }}>
                <span style={{
                  textDecoration:'line-through',
                  textDecorationColor:'var(--crimson)',
                  textDecorationThickness:'1.5px',
                  color:'var(--sand)', fontSize:15
                }}>{n}</span>
                <span className="mono" style={{color:'var(--crimson)', fontSize:11, letterSpacing:'0.18em'}}>YOK</span>
              </div>
            ))}
          </div>
          <div style={{marginTop:36, textAlign:'center'}}>
            <Link to="/pazar" className="tlink">İhtiyaç duyduğunuzu Pazar'dan ekleyin →</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{background:'var(--ink-1)', borderTop:'1px solid var(--ink-line)', borderBottom:'1px solid var(--ink-line)', position:'relative', overflow:'hidden'}}>
        <div className="ornament-wrap" style={{left:'-100px', bottom:'-100px'}}>
          <MandalaBg color="var(--jade)" size={500} opacity={0.04}/>
        </div>
        <div className="wrap" style={{position:'relative', zIndex:2}}>
          <div className="reveal">
            <SectionHead no="03" eyebrow="Kimler için?"
              title={<>Bar sürümü kimler <em style={{color:'var(--jade)'}}>için</em>?</>}
            />
          </div>
          <div className="grid grid-3 reveal" style={{marginTop:64}}>
            {edition.useCases.map((uc, i) => (
              <div key={uc.title} className="card card--jade">
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
                  <span className="mono" style={{color:'var(--jade)'}}>№ 0{i+1}</span>
                  <span style={{fontFamily:'var(--display)', fontSize:32, color:'var(--jade)', lineHeight:1}}>{uc.icon}</span>
                </div>
                <h3 className="h3" style={{marginTop:24}}>{uc.title}</h3>
                <p className="body" style={{marginTop:16}}>{uc.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TileBand color="var(--jade)" height={24}/>
      <section className="section" style={{position:'relative', overflow:'hidden'}}>
        <div className="ornament-wrap" style={{left:'50%', top:'50%', transform:'translate(-50%, -50%)', opacity:1}}>
          <MandalaBg color="var(--jade)" size={700} opacity={0.05}/>
        </div>
        <div className="wrap" style={{textAlign:'center', position:'relative', zIndex:2}}>
          <h2 className="h1 reveal">
            <i style={{color:'var(--jade)'}}>Bar</i> sürümünü indirin.
          </h2>
          <p className="lede reveal delay-1" style={{marginInline:'auto', marginTop:24}}>En hafif, en hızlı, en sade.</p>
          <div className="reveal delay-2" style={{display:'flex', gap:12, justifyContent:'center', marginTop:36, flexWrap:'wrap'}}>
            <GithubReleaseLink className="btn btn-crimson" style={{background:'var(--jade)', boxShadow:'0 12px 30px -10px rgba(63,142,99,0.4)'}}>ISO {downloadLabel} →</GithubReleaseLink>
          </div>
          <div className="eyebrow reveal delay-3" style={{marginTop:28}}>Minimum {edition.requirements.ramMinLabel} RAM · {edition.requirements.diskMinLabel} disk</div>
        </div>
      </section>
    </>
  );
}