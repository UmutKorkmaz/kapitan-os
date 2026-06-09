import { useState, useEffect } from 'react';
import Link from '../components/Link.jsx';
import { PageHead } from '../components/Shell.jsx';
import { getVersion, getSsotCommandCount } from '../lib/siteConfig.js';

const VERSION = getVersion();
const SSOT_COUNT = getSsotCommandCount();

const docToc = [
  {
    label: 'Başlangıç',
    items: [
      ['baslangic', '00 · Hızlı başlangıç'],
      ['kurulum', '01 · Kurulum'],
    ],
  },
  {
    label: 'Günlük kullanım',
    items: [
      ['sozdizimi', '02 · Komut sözdizimi'],
      ['kabuk', '03 · Kabuk & kısayollar'],
      ['paket', '04 · Paket yönetimi'],
    ],
  },
  {
    label: 'İleri',
    items: [
      ['ai', '05 · Yapay zekâ'],
      ['sorun', '06 · Sorun giderme'],
    ],
  },
];

function useActiveDocSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) setActive(en.target.id);
        });
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [ids]);
  return active;
}

function DocsTOC({ active }) {
  return (
    <nav className="doc-toc" aria-label="Belge içindekiler">
      {docToc.map((group) => (
        <div key={group.label}>
          <div className="doc-toc-label">{group.label}</div>
          {group.items.map(([id, label]) => (
            <a
              key={id}
              href={'#/belgeler'}
              className={active === id ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(id);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              {label}
            </a>
          ))}
        </div>
      ))}
    </nav>
  );
}

function Kbd({ children }) {
  return (
    <kbd
      style={{
        display: 'inline-block',
        padding: '1px 7px',
        fontFamily: 'var(--mono)',
        fontSize: 11,
        background: 'var(--paper-2)',
        border: '1px solid var(--paper-line-2)',
        borderBottom: '2px solid var(--paper-line-2)',
        borderRadius: 4,
        color: 'var(--ink)',
      }}
    >
      {children}
    </kbd>
  );
}

function Callout({ tone = 'info', glyph, title, children }) {
  return (
    <div className={'doc-callout doc-callout--' + tone}>
      <div className="ico">{glyph || (tone === 'warn' ? '!' : tone === 'ok' ? '✓' : 'i')}</div>
      <div>
        {title && <strong style={{ display: 'block', marginBottom: 6 }}>{title}</strong>}
        {children}
      </div>
    </div>
  );
}

export default function Belgeler() {
  const ids = ['baslangic', 'kurulum', 'sozdizimi', 'kabuk', 'paket', 'ai', 'sorun', 'daha'];
  const active = useActiveDocSection(ids);

  return (
    <>
      <PageHead
        crumbs={[{ label: 'Ana sayfa', to: '/' }, { label: 'Belgeler' }]}
        title={
          <>
            Belgeler. <em>Türkçe</em>, ferman-temiz.
          </>
        }
        lede="Kurulumdan komut sözdizimine, paket yönetiminden yapay zekâya. KAPiTaN OS'i tanımak için ihtiyacınız olan her şey — fazlası değil."
        ornamentColor="var(--saffron)"
      >
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 36 }}>
          <span className="pill">
            <span className="ldot" />
            {VERSION} · TR
          </span>
          <span className="pill pill--saffron">
            <span className="ldot" />
            ALPHA BELGELER
          </span>
          <span className="pill pill--jade">
            <span className="ldot" />
            OKUMA ~12 DK
          </span>
        </div>
      </PageHead>

      <section className="section" style={{ paddingTop: 64 }}>
        <div className="wrap">
          <div className="doc-layout">
            <DocsTOC active={active} />

            <article>
              <section id="baslangic" className="doc-section">
                <div className="kicker">
                  <span className="glyph" />
                  <span style={{ color: 'var(--crimson)' }}>00</span>
                  <span style={{ color: 'var(--fg-faint)' }}>·</span>
                  <span>Hızlı başlangıç</span>
                </div>
                <h2 style={{ marginTop: 20 }}>
                  Üç komut, beş <em>dakika</em>.
                </h2>
                <p>ISO'nuz yandıysa, açılışta hoş geldin sihirbazı sizi karşılar. Aşağıdaki üç komut kabuğun nasıl çalıştığını gösterir.</p>
                <pre className="doc-code">
                  <span className="c-prompt">›</span> <span className="c-cmd">sistem</span>
                  {'\n'}
                  <span className="c-out">KAPiTaN OS {VERSION} — önizleme</span>
                  {'\n'}
                  <span className="c-out">Çekirdek: planlanan · Bellek: —</span>
                  {'\n\n'}
                  <span className="c-prompt">›</span> <span className="c-cmd">listele</span>
                  {'\n'}
                  <span className="c-out">rapor.docx    12 KB    17/05</span>
                  {'\n'}
                  <span className="c-out">sunum.pptx    4.1 MB   dün</span>
                  {'\n'}
                  <span className="c-out">projeler/     klasör</span>
                  {'\n\n'}
                  <span className="c-prompt">›</span> <span className="c-cmd">sor "ev klasörümün boyutu ne?"</span>
                  {'\n'}
                  <span className="c-out">KAPiTaN AI: Ev klasörünüz 12.4 GB.</span>
                  {'\n'}
                  <span className="c-out">
                    İsterseniz <span className="c-key">boyut ~</span> komutuyla da bakabilirsiniz.
                  </span>
                </pre>
                <p>
                  Her komutun POSIX karşılığı, Türkçe uzun adı ve <em>iki-üç harflik</em> kısa biçimi vardır. <code>ls</code>,{' '}
                  <code>listele</code>, <code>lst</code> — üçü de aynı. Hangisi alışkanlığınızdaysa onu kullanın.
                </p>
              </section>

              <section id="kurulum" className="doc-section">
                <div className="kicker">
                  <span className="glyph" />
                  <span style={{ color: 'var(--crimson)' }}>01</span>
                  <span style={{ color: 'var(--fg-faint)' }}>·</span>
                  <span>Kurulum</span>
                </div>
                <h2 style={{ marginTop: 20 }}>
                  USB hazırlayın, <em>15 dakika</em>.
                </h2>

                <Callout tone="warn" title="Alpha ISO henüz yayınlanmadı">
                  Kurulum adımları alpha ISO build'i tamamlandığında güncellenecek. Şimdilik{' '}
                  <Link to="/hakkinda" style={{ color: 'var(--crimson)' }}>
                    duyuru listesine
                  </Link>{' '}
                  katılabilirsiniz.
                </Callout>

                <p>KAPiTaN OS yan yana ya da tek başına kurulabilir. Bilgisayarınızda Windows ya da macOS varsa, dual-boot sihirbazı verilerinize dokunmadan kurulum yapar.</p>

                <h3>1. ISO'yu indirin</h3>
                <p>
                  <Link to="/hakkinda" style={{ color: 'var(--crimson)' }}>
                    /hakkinda
                  </Link>{' '}
                  sayfasından Geliştirici, Ofis ya da Bar sürümünü seçin. Alpha ISO yayınlandığında gerçek SHA-256 imzası burada görünecek.
                </p>

                <h3>2. USB'ye yazın</h3>
                <pre className="doc-code">
                  <span className="c-comment"># Linux / macOS</span>
                  {'\n'}
                  <span className="c-cmd">sudo dd if=kapitan-{VERSION}-gelistirici.iso of=/dev/diskN bs=4M status=progress</span>
                  {'\n\n'}
                  <span className="c-comment"># Windows: Rufus, balenaEtcher ya da Ventoy kullanın</span>
                </pre>

                <h3>3. Hedef makineyi USB'den başlatın</h3>
                <p>Açılışta hoş geldin sihirbazı sorduğu üç şeyi yanıtlayın: dil, klavye, disk düzeni.</p>

                <Callout tone="warn" title="Önemli">
                  Dual-boot kurarken bölümleme adımında <code>"yan yana kur"</code> seçeneğini işaretleyin. "Diski tamamen sil" Windows / macOS dahil her şeyi siler — geri alınamaz.
                </Callout>

                <h3>Donanım gereksinimleri</h3>
                <table className="doc-table">
                  <thead>
                    <tr>
                      <th>Sürüm</th>
                      <th>Bellek</th>
                      <th>Disk</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code>Geliştirici</code>
                      </td>
                      <td>8 GB</td>
                      <td>50 GB</td>
                    </tr>
                    <tr>
                      <td>
                        <code>Ofis</code>
                      </td>
                      <td>4 GB</td>
                      <td>30 GB</td>
                    </tr>
                    <tr>
                      <td>
                        <code>Bar</code>
                      </td>
                      <td>2 GB</td>
                      <td>15 GB</td>
                    </tr>
                  </tbody>
                </table>
              </section>

              <section id="sozdizimi" className="doc-section">
                <div className="kicker">
                  <span className="glyph" />
                  <span style={{ color: 'var(--crimson)' }}>02</span>
                  <span style={{ color: 'var(--fg-faint)' }}>·</span>
                  <span>Komut sözdizimi</span>
                </div>
                <h2 style={{ marginTop: 20 }}>
                  Bir komut, üç <em>ad</em>.
                </h2>
                <p>Her komut üç adla çağrılabilir: POSIX (İngilizce), uzun Türkçe, iki-üç harflik kısa biçim. Üçü de aynı işi yapar.</p>
                <p>
                  Sözdiziminde <strong style={{ color: 'var(--ink)' }}>nokta yoktur</strong>. Bir komut bir kelimedir; argümanlar boşlukla ayrılır. Bu, kabuk borularıyla (
                  <code>|</code>) ve yönlendirmelerle (<code>{`>`}</code>, <code>{`<`}</code>) uyumlu çalışır.
                </p>

                <pre className="doc-code">
                  <span className="c-prompt">›</span> <span className="c-cmd">listele -uzun</span> <span className="c-comment"># uzun biçimde liste</span>
                  {'\n'}
                  <span className="c-prompt">›</span> <span className="c-cmd">lst -u</span> <span className="c-comment"># aynı şey, kısa biçim</span>
                  {'\n'}
                  <span className="c-prompt">›</span> <span className="c-cmd">ls -l</span> <span className="c-comment"># aynı şey, POSIX</span>
                  {'\n\n'}
                  <span className="c-prompt">›</span> <span className="c-cmd">ara "TODO" *.md</span> <span className="c-comment"># markdown dosyalarında ara</span>
                  {'\n'}
                  <span className="c-prompt">›</span> <span className="c-cmd">bul ~ -ad "*.pdf"</span> <span className="c-comment"># ev klasöründe pdf bul</span>
                  {'\n\n'}
                  <span className="c-prompt">›</span> <span className="c-cmd">listele | ara rapor</span> <span className="c-comment"># boru: çıktıda 'rapor' geçenler</span>
                  {'\n'}
                  <span className="c-prompt">›</span> <span className="c-cmd">sistem &gt; sistem.txt</span> <span className="c-comment"># yönlendirme: çıktıyı dosyaya yaz</span>
                </pre>

                <Callout tone="info" title="Neden noktasız?" glyph="?">
                  Nokta sözdizimi (örn. <code>dosyalar.listele</code>) bir mülk erişimi gibi okunur — bir SDK için doğru, bir kabuk için yanlış. Kabukta hızlı yazıp boruya bağlamak istersiniz; <strong>tek kelime + argüman</strong> bunu mümkün kılar.
                </Callout>

                <p>
                  Tam komut listesi için{' '}
                  <Link to="/komutlar" style={{ color: 'var(--crimson)' }}>
                    komut rehberini
                  </Link>{' '}
                  ziyaret edin — {SSOT_COUNT} SSOT komut, yedi grupta.
                </p>
              </section>

              <section id="kabuk" className="doc-section">
                <div className="kicker">
                  <span className="glyph" />
                  <span style={{ color: 'var(--crimson)' }}>03</span>
                  <span style={{ color: 'var(--fg-faint)' }}>·</span>
                  <span>Kabuk & kısayollar</span>
                </div>
                <h2 style={{ marginTop: 20 }}>
                  Kabukta <em>hızlı</em> yaşam.
                </h2>
                <p>kapitan-sh, bash uyumludur ama Türkçe komut adlarını, akıllı tamamlamayı ve geri alma desteğini içerir.</p>

                <h3>Otomatik tamamlama</h3>
                <p>
                  Bir komutun ilk harflerini yazıp <Kbd>Tab</Kbd> tuşuna basın. Belirsizlik varsa öneriler listelenir.
                </p>
                <pre className="doc-code">
                  <span className="c-prompt">›</span> <span className="c-cmd">li</span>
                  <span className="c-key">⇥</span>
                  {'\n'}
                  <span className="c-out">listele   liste   lst</span>
                  {'\n\n'}
                  <span className="c-prompt">›</span> <span className="c-cmd">li</span>
                  <span className="c-key">⇥</span>
                  <span className="c-cmd">st</span>
                  <span className="c-key">⇥</span>
                  {'\n'}
                  <span className="c-out">listele</span>
                </pre>

                <h3>Tarihçe ve düzenleme</h3>
                <ul>
                  <li>
                    <Kbd>↑</Kbd> / <Kbd>↓</Kbd> &nbsp;Komut tarihçesinde gezin
                  </li>
                  <li>
                    <Kbd>Ctrl</Kbd> + <Kbd>R</Kbd> &nbsp;Geriye doğru ara
                  </li>
                  <li>
                    <Kbd>Ctrl</Kbd> + <Kbd>C</Kbd> &nbsp;Çalışan komutu durdur
                  </li>
                  <li>
                    <Kbd>Ctrl</Kbd> + <Kbd>D</Kbd> &nbsp;Kabuktan çık
                  </li>
                  <li>
                    <Kbd>Ctrl</Kbd> + <Kbd>L</Kbd> &nbsp;Ekranı temizle (≡ <code>temizle</code>)
                  </li>
                  <li>
                    <Kbd>Ctrl</Kbd> + <Kbd>A</Kbd> / <Kbd>E</Kbd> &nbsp;Satır başı / sonu
                  </li>
                </ul>

                <Callout tone="ok" title="Geri alma" glyph="✓">
                  Silmeden önce her zaman sorulur. <code>sil -kalıcı</code> bayrağı geri alma olmadan siler.
                </Callout>
              </section>

              <section id="paket" className="doc-section">
                <div className="kicker">
                  <span className="glyph" />
                  <span style={{ color: 'var(--crimson)' }}>04</span>
                  <span style={{ color: 'var(--fg-faint)' }}>·</span>
                  <span>Paket yönetimi</span>
                </div>
                <h2 style={{ marginTop: 20 }}>
                  KAPiTaN <em>Pazar</em>.
                </h2>
                <p>Pazar tek bir kayıt defterine bağlıdır; resmi paketler imzalıdır. apt, npm, pip, cargo ve go paket yöneticileri de yan yana çalışır.</p>

                <pre className="doc-code">
                  <span className="c-prompt">›</span> <span className="c-cmd">kur kod-duzenleyici-pro</span> <span className="c-comment"># yeni paket kur</span>
                  {'\n'}
                  <span className="c-prompt">›</span> <span className="c-cmd">güncelle</span> <span className="c-comment"># tüm paketleri güncelle</span>
                  {'\n'}
                  <span className="c-prompt">›</span> <span className="c-cmd">kaldır müzikçalar</span> <span className="c-comment"># paketi kaldır</span>
                  {'\n'}
                  <span className="c-prompt">›</span> <span className="c-cmd">tara "metin editörü"</span> <span className="c-comment"># pazar'da ara</span>
                  {'\n'}
                  <span className="c-prompt">›</span> <span className="c-cmd">kurulu</span> <span className="c-comment"># kurulu paketleri listele</span>
                  {'\n\n'}
                  <span className="c-comment"># kısa biçim:</span>
                  {'\n'}
                  <span className="c-prompt">›</span> <span className="c-cmd">kr kod-duzenleyici-pro</span>
                  {'\n'}
                  <span className="c-prompt">›</span> <span className="c-cmd">gnc</span>
                  {'\n'}
                  <span className="c-prompt">›</span> <span className="c-cmd">kld müzikçalar</span>
                  {'\n'}
                  <span className="c-prompt">›</span> <span className="c-cmd">tr "metin editörü"</span>
                  {'\n'}
                  <span className="c-prompt">›</span> <span className="c-cmd">krl</span>
                </pre>

                <p>
                  Bir paket apt'tan kurulmuşsa, KAPiTaN Pazar onu görür ve günceller. apt komutları doğrudan da çalışır:
                </p>
                <pre className="doc-code">
                  <span className="c-prompt">›</span> <span className="c-cmd">apt install ripgrep</span> <span className="c-comment"># POSIX biçim</span>
                  {'\n'}
                  <span className="c-prompt">›</span> <span className="c-cmd">kur ripgrep</span> <span className="c-comment"># KAPiTaN biçim — aynı şey</span>
                </pre>

                <Callout tone="info" title="İmza doğrulama" glyph="i">
                  <code>doğrula iso ./dosya.iso</code> ile ISO imzasını kontrol edin. Pazar'dan inen tüm paketler arka planda otomatik doğrulanır.
                </Callout>
              </section>

              <section id="ai" className="doc-section">
                <div className="kicker">
                  <span className="glyph" />
                  <span style={{ color: 'var(--crimson)' }}>05</span>
                  <span style={{ color: 'var(--fg-faint)' }}>·</span>
                  <span>Yapay zekâ</span>
                </div>
                <h2 style={{ marginTop: 20 }}>
                  KAPiTaN <em>AI</em>.
                </h2>
                <p>Yerel ve bulut karışık çalışır. Hassas işler için yerelde, daha büyük modelleri çalıştırmak için buluttadır. Tüm sorularınız ve yanıtlar şifrelidir.</p>

                <h3>Beş ana komut</h3>
                <pre className="doc-code">
                  <span className="c-prompt">›</span> <span className="c-cmd">sor "İstanbul'da hava nasıl?"</span>
                  {'\n'}
                  <span className="c-prompt">›</span> <span className="c-cmd">kodla "fastapi ile bir hesap makinesi"</span>
                  {'\n'}
                  <span className="c-prompt">›</span> <span className="c-cmd">açıkla "rsync -avz src dst"</span> <span className="c-comment"># ne yaptığını anlatır</span>
                  {'\n'}
                  <span className="c-prompt">›</span> <span className="c-cmd">özet ./uzun-belge.pdf</span> <span className="c-comment"># üç paragraf özet</span>
                  {'\n'}
                  <span className="c-prompt">›</span> <span className="c-cmd">çevir tr en "İyi günler"</span> <span className="c-comment"># 50+ dil</span>
                </pre>

                <h3>Komut zincirleme</h3>
                <p>AI'yı boruya bağlayabilirsiniz.</p>
                <pre className="doc-code">
                  <span className="c-prompt">›</span> <span className="c-cmd">canlı | sor "hangi işlem en çok bellek tüketiyor?"</span>
                  {'\n'}
                  <span className="c-prompt">›</span> <span className="c-cmd">oku rapor.md | özet</span>
                </pre>

                <Callout tone="warn" title="Gizlilik">
                  Varsayılan olarak yerel modelle yanıt verilir. Bulut modeline geçmek için
                  <code>--bulut</code> bayrağı gerekir. Hiçbir veri rızanız olmadan gönderilmez.
                </Callout>
              </section>

              <section id="sorun" className="doc-section">
                <div className="kicker">
                  <span className="glyph" />
                  <span style={{ color: 'var(--crimson)' }}>06</span>
                  <span style={{ color: 'var(--fg-faint)' }}>·</span>
                  <span>Sorun giderme</span>
                </div>
                <h2 style={{ marginTop: 20 }}>
                  Bir şey <em>ters mi</em> gitti?
                </h2>
                <p>Sık karşılaşılan sorunlar ve çözümleri. Çözümünüzü bulamazsanız forumda arayın.</p>

                <h3>"komut bulunamadı"</h3>
                <p>
                  Komut adı yanlış yazılmış olabilir. <code>yardım</code> ile tam liste, <Kbd>Tab</Kbd> ile tamamlama. Kısa biçim de unutmayın: <code>lst</code> = <code>listele</code>.
                </p>

                <h3>Açılış sırasında siyah ekran</h3>
                <p>
                  Çoğunlukla NVIDIA sürücüsü uyumsuzluğu. Açılışta <Kbd>e</Kbd> ile GRUB'u düzenleyin ve <code>nomodeset</code> ekleyin. Kalıcı çözüm için <code>kur nvidia-driver</code>.
                </p>

                <h3>Wi-Fi bağlanmıyor</h3>
                <p>
                  <code>ağ</code> komutuyla arayüz durumunu kontrol edin. Sürücü yoksa <code>kur firmware-iwlwifi</code> (Intel) ya da <code>kur firmware-realtek</code>.
                </p>

                <h3>Disk dolu uyarısı</h3>
                <p>
                  <code>disk</code> ile genel bakış, <code>boyut ~ -azalan</code> ile en büyük klasörleri görürsünüz. Pazar önbelleğini boşaltmak için <code>güncelle -önbelleksil</code>.
                </p>

                <h3>AI yanıt vermiyor</h3>
                <p>
                  Yerel model belleği aşıyor olabilir. <code>sistem</code> ile RAM kullanımını kontrol edin; gerekirse <code>--bulut</code> bayrağıyla bulut moduna geçin.
                </p>
              </section>

              <section id="daha" className="doc-section" style={{ borderBottom: 'none' }}>
                <div className="kicker">
                  <span className="glyph" />
                  <span>Daha fazlası</span>
                </div>
                <h2 style={{ marginTop: 20 }}>Devam edin.</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 36 }}>
                  <Link to="/komutlar" className="card" style={{ textDecoration: 'none' }}>
                    <div className="eyebrow">REFERANS</div>
                    <h4 className="h4" style={{ marginTop: 10 }}>
                      Komut rehberi →
                    </h4>
                    <p style={{ marginTop: 8, fontSize: 14, color: 'var(--ink-mute)' }}>
                      {SSOT_COUNT} SSOT komut, POSIX karşılığı ve kısa biçimleriyle.
                    </p>
                  </Link>
                  <Link to="/topluluk" className="card" style={{ textDecoration: 'none' }}>
                    <div className="eyebrow">TOPLULUK</div>
                    <h4 className="h4" style={{ marginTop: 10 }}>
                      Forum →
                    </h4>
                    <p style={{ marginTop: 8, fontSize: 14, color: 'var(--ink-mute)' }}>
                      Sorular, geliştiriciye ulaşma, dağıtık çalışan grupları.
                    </p>
                  </Link>
                </div>
              </section>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}