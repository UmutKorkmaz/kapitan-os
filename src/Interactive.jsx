/* Interactive components — ⌘K palette, live terminal, AI prompt, draggable window */

const { useState: useStateI, useEffect: useEffectI, useRef: useRefI, useCallback: useCallbackI } = React;

/* ============================================================
   ⌘K Command Palette
   ============================================================ */

const CMDK_ITEMS = [
  { group: 'Sayfalar', items: [
    { id:'home',  label:'Ana sayfa',           glyph:'#', go:'/' },
    { id:'sur',   label:'Sürümler',            glyph:'#', go:'/surumler' },
    { id:'gel',   label:'Geliştirici sürümü',  glyph:'›', go:'/surumler/gelistirici' },
    { id:'ofi',   label:'Ofis sürümü',         glyph:'›', go:'/surumler/ofis' },
    { id:'bar',   label:'Bar sürümü',          glyph:'›', go:'/surumler/bar' },
    { id:'paz',   label:'Pazar',               glyph:'#', go:'/pazar' },
    { id:'kom',   label:'Komutlar',            glyph:'#', go:'/komutlar' },
    { id:'bel',   label:'Belgeler',            glyph:'#', go:'/belgeler' },
    { id:'top',   label:'Topluluk',            glyph:'#', go:'/topluluk' },
    { id:'hak',   label:'Hakkında & indir',    glyph:'#', go:'/hakkinda' },
  ]},
  { group: 'Komutlar', items: [
    { id:'cmd1', label:'listele',  glyph:'›', desc:'~ dizin', action:'cmd' },
    { id:'cmd2', label:'sistem',   glyph:'›', desc:'os',     action:'cmd' },
    { id:'cmd3', label:'kur',      glyph:'›', desc:'paket',  action:'cmd' },
    { id:'cmd4', label:'sor',      glyph:'›', desc:'AI',     action:'cmd' },
    { id:'cmd5', label:'indir',    glyph:'›', desc:'ISO',    action:'cmd' },
  ]},
  { group: 'Hızlı eylem', items: [
    { id:'iso',   label:'ISO indir',           glyph:'↓', go:'/hakkinda' },
    { id:'forum', label:'Foruma git',          glyph:'→', go:'/topluluk' },
  ]},
];

function CommandPalette({ open, onClose }) {
  const [q, setQ] = useStateI('');
  const [sel, setSel] = useStateI(0);
  const inputRef = useRefI(null);

  // Filter
  const filteredGroups = CMDK_ITEMS.map(g => ({
    ...g,
    items: g.items.filter(it => it.label.toLowerCase().includes(q.toLowerCase()))
  })).filter(g => g.items.length);
  const flat = filteredGroups.flatMap(g => g.items);

  useEffectI(() => {
    if (open) {
      setQ(''); setSel(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffectI(() => { setSel(0); }, [q]);

  const run = (item) => {
    if (item.go) { window.location.hash = item.go; onClose(); }
    else if (item.action === 'cmd') {
      onClose();
      // toast?
    }
  };

  const onKey = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setSel(s => Math.min(s+1, flat.length-1)); }
    else if (e.key === 'ArrowUp')   { e.preventDefault(); setSel(s => Math.max(s-1, 0)); }
    else if (e.key === 'Enter')     { e.preventDefault(); if (flat[sel]) run(flat[sel]); }
  };

  if (!open) return null;

  let runningIdx = -1;
  return (
    <div className="cmdk-backdrop" onClick={onClose} onKeyDown={onKey}>
      <div className="cmdk" onClick={e => e.stopPropagation()} onKeyDown={onKey}>
        <div className="cmdk-input">
          <span>›</span>
          <input
            ref={inputRef}
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="komut, sayfa ya da yazılım ara…"
          />
          <span className="kbd">ESC</span>
        </div>
        <div className="cmdk-list">
          {filteredGroups.length === 0 ? (
            <div style={{padding:'40px 14px', textAlign:'center', color:'var(--sand)', fontFamily:'var(--mono)', fontSize:13}}>
              sonuç yok — başka deneyin
            </div>
          ) : filteredGroups.map(g => (
            <div key={g.group}>
              <div className="cmdk-group">{g.group}</div>
              {g.items.map(it => {
                runningIdx += 1;
                const isSel = runningIdx === sel;
                return (
                  <div key={it.id}
                    className={'cmdk-item ' + (isSel ? 'sel' : '')}
                    onMouseEnter={() => setSel(runningIdx)}
                    onClick={() => run(it)}>
                    <span className="glyph">{it.glyph}</span>
                    <span>{it.label}</span>
                    {it.desc && <span className="desc">{it.desc}</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div style={{padding:'10px 14px', borderTop:'1px solid var(--ink-line)', display:'flex', justifyContent:'space-between', fontFamily:'var(--mono)', fontSize:11, color:'var(--sand)'}}>
          <span><span className="kbd">↑↓</span> gezin · <span className="kbd">↵</span> seç</span>
          <span><span className="kbd">⌘K</span> aç/kapat</span>
        </div>
      </div>
    </div>
  );
}

/* Hook to wire global ⌘K shortcut */
function useCmdK() {
  const [open, setOpen] = useStateI(false);
  useEffectI(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(o => !o);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return [open, setOpen];
}

/* ============================================================
   Live Terminal — accepts user input
   ============================================================ */

const TR_CMDS = {
  'listele':  ['rapor.docx · 12 KB · 17/05', 'sunum.pptx · 4.1 MB · dün', 'notlar.md · 3 KB · 09:14', 'projeler/ · klasör'],
  'lst':      ['rapor.docx · 12 KB · 17/05', 'sunum.pptx · 4.1 MB · dün', 'notlar.md · 3 KB · 09:14', 'projeler/ · klasör'],
  'ls':       ['rapor.docx · 12 KB · 17/05', 'sunum.pptx · 4.1 MB · dün', 'notlar.md · 3 KB · 09:14', 'projeler/ · klasör'],
  'sistem':   ['KAPiTaN OS v3.2 — Türkiye sürümü', 'Çekirdek: 6.8.0-kapitan', 'Bellek: 14.2/16 GB · CPU: %23'],
  'sis':      ['KAPiTaN OS v3.2 — Türkiye sürümü', 'Çekirdek: 6.8.0-kapitan', 'Bellek: 14.2/16 GB · CPU: %23'],
  'yardım':   ['kullanılabilir komutlar:', '  listele (lst) · sistem (sis) · yardım', '  pazarara (pza) · sor (sr) · temizle (tmz)', '', 'tam liste: /komutlar — belgeler: /belgeler'],
  'yardim':   ['kullanılabilir komutlar:', '  listele (lst) · sistem (sis) · yardım', '  pazarara (pza) · sor (sr) · temizle (tmz)'],
  'temizle':  ['__clear__'],
  'tmz':      ['__clear__'],
  'pazarara': ['arama: "kod" — 3 sonuç', '  1. KodDüzenleyici Pro ★4.9', '  2. KodDüzenleyici Lite ★4.3', '  3. KodAna ★4.1'],
  'pza':      ['arama: "kod" — 3 sonuç', '  1. KodDüzenleyici Pro ★4.9', '  2. KodDüzenleyici Lite ★4.3', '  3. KodAna ★4.1'],
  'sor':      ['KAPiTaN AI: Lütfen sorunuzu komuttan sonra yazın.', 'örnek: sor "neden Türkçe?"'],
  'sr':       ['KAPiTaN AI: Lütfen sorunuzu komuttan sonra yazın.', 'örnek: sr "neden Türkçe?"'],
  'ağ':       ['arayüz: wlan0 · etkin', 'IP: 192.168.1.42', 'hız: 145 Mbps · gecikme: 8 ms'],
  'kur':      ['kullanım: kur <paket-adı>', 'örnek: kur kod-duzenleyici-pro'],
  'kr':       ['kullanım: kr <paket-adı>'],
  'nerede':   ['/ev/sen'],
  'nr':       ['/ev/sen'],
  'tarih':    [new Date().toLocaleString('tr-TR')],
};

function LiveTerminal({ title = 'kapitan@deneme ~ uçbirim', initial = [], height = 320 }) {
  const [history, setHistory] = useStateI(initial);
  const [input, setInput] = useStateI('');
  const inputRef = useRefI(null);
  const scrollRef = useRefI(null);

  const run = (raw) => {
    const cmd = raw.trim();
    if (!cmd) return;
    const key = cmd.split(/\s+/)[0];
    let out;
    if (TR_CMDS[cmd]) out = TR_CMDS[cmd];
    else if (TR_CMDS[key]) out = TR_CMDS[key];
    else out = [`komut bulunamadı: "${key}". \`yardım\` yazın.`];

    if (out[0] === '__clear__') {
      setHistory([]);
      return;
    }
    setHistory(h => [...h, { type:'cmd', text: cmd }, ...out.map(t => ({type:'out', text:t}))]);
  };

  useEffectI(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  const onSubmit = (e) => {
    e.preventDefault();
    run(input);
    setInput('');
  };

  const quick = ['sistem','listele','pazarara','yardım','temizle'];

  return (
    <div className="term" onClick={() => inputRef.current?.focus()} style={{cursor:'text'}}>
      <div className="term-bar">
        <div className="dotgroup"><span/><span/><span/></div>
        <span>{title}</span>
        <span style={{marginLeft:'auto', color:'var(--sand)', fontSize:10}}>CANLI · YAZIN</span>
      </div>
      <div ref={scrollRef} className="term-body" style={{height, overflow:'auto'}}>
        {history.length === 0 && (
          <div style={{color:'var(--sand)', marginBottom:8}}>
            <div className="out">Hoş geldiniz. Bir komut yazın veya kısayollardan birini seçin.</div>
            <div className="out" style={{marginTop:8}}>kısayollar: {quick.map((q, i) => (
              <span key={q} onClick={(e) => { e.stopPropagation(); run(q); }}
                style={{color:'var(--saffron)', cursor:'pointer', marginRight:10, textDecoration:'underline', textDecorationColor:'rgba(232,178,62,0.4)'}}>{q}</span>
            ))}</div>
          </div>
        )}
        {history.map((ln, i) => {
          if (ln.type === 'cmd') return <div key={i}><span className="prompt">›</span> <span className="cmd">{ln.text}</span></div>;
          return <div key={i}><span className="out">{ln.text}</span></div>;
        })}
        <form onSubmit={onSubmit} className="term-input">
          <span className="prompt">›</span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="komut yazın…"
            autoComplete="off"
            spellCheck={false}
          />
        </form>
      </div>
    </div>
  );
}

/* ============================================================
   AI Prompt Box — uses window.claude.complete
   ============================================================ */

function AIPrompt({ placeholder = 'AI\'ya Türkçe bir şey sorun…', presets = [] }) {
  const [q, setQ] = useStateI('');
  const [out, setOut] = useStateI('');
  const [loading, setLoading] = useStateI(false);
  const [err, setErr] = useStateI(null);

  const ask = async (text) => {
    const prompt = (text ?? q).trim();
    if (!prompt) return;
    setLoading(true); setErr(null); setOut('');
    try {
      const sys = 'Sen KAPiTaN AI adlı, KAPiTaN OS (Türkçe komutlu açık kaynak işletim sistemi) için tasarlanmış kısa, samimi, doğal Türkçe konuşan bir asistansın. Yanıtların 3–5 cümleyi geçmesin. Sadece Türkçe yanıtla; gerektiğinde Türkçe komut örnekleri ver (örn. listele, sistem, kur, sor — kısa biçim: lst, sis, kr, sr). Noktalı sözdizimini kullanma.';
      const resp = await window.claude.complete({
        messages: [
          { role: 'user', content: `${sys}\n\nKullanıcı sorusu: ${prompt}` }
        ]
      });
      setOut(resp);
    } catch (e) {
      setErr(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      border:'1px solid var(--paper-line-2)',
      background: 'linear-gradient(180deg, var(--paper), var(--paper-1))',
      borderRadius: 10,
      overflow: 'hidden',
      boxShadow: 'var(--shadow-lift)'
    }}>
      <div style={{
        padding:'14px 18px', borderBottom:'1px solid var(--ink-line)',
        display:'flex', justifyContent:'space-between', alignItems:'center',
        background:'var(--ink-3)'
      }}>
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <span style={{
            width:8, height:8, borderRadius:'50%',
            background:'var(--jade)',
            boxShadow:'0 0 12px var(--jade)'
          }} />
          <span style={{fontFamily:'var(--mono)', fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--sand)'}}>
            KAPiTaN AI · sor
          </span>
        </div>
        <span style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--sand)'}}>YEREL · {loading ? 'YANIT…' : 'HAZIR'}</span>
      </div>

      <div style={{padding:'22px 22px'}}>
        <form onSubmit={(e) => { e.preventDefault(); ask(); }} style={{display:'flex', gap:10, alignItems:'flex-start'}}>
          <span style={{color:'var(--crimson)', fontFamily:'var(--mono)', fontSize:16, paddingTop:8}}>›</span>
          <textarea
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder={placeholder}
            rows={2}
            style={{
              flex:1, background:'transparent', border:0, outline:0, resize:'vertical',
              color:'var(--ink)', fontFamily:'var(--sans)', fontSize:15, lineHeight:1.5,
              padding:'6px 0'
            }}
          />
          <button type="submit" className="btn btn-crimson" disabled={loading} style={{padding:'10px 18px', fontSize:13, opacity: loading ? 0.6 : 1}}>
            {loading ? 'Düşünüyor…' : 'Sor →'}
          </button>
        </form>

        {presets.length > 0 && !out && !loading && (
          <div style={{display:'flex', gap:8, flexWrap:'wrap', marginTop:18}}>
            <span style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--sand)', alignSelf:'center', marginRight:6}}>örnek:</span>
            {presets.map(p => (
              <button key={p} onClick={() => { setQ(p); ask(p); }}
                style={{
                  padding:'6px 12px', borderRadius:999, fontSize:12,
                  background:'var(--ink-3)', border:'1px solid var(--ink-line)',
                  color:'var(--fg-soft)', cursor:'pointer'
                }}>
                {p}
              </button>
            ))}
          </div>
        )}

        {(out || loading || err) && (
          <div style={{
            marginTop:22, padding:'18px 20px',
            background:'rgba(200,16,46,0.04)',
            border:'1px solid rgba(200,16,46,0.15)',
            borderRadius:6,
            display:'flex', gap:12, alignItems:'flex-start'
          }}>
            <span style={{
              fontFamily:'var(--serif)', fontStyle:'italic', fontSize:22,
              color:'var(--crimson)', lineHeight:1
            }}>K</span>
            <div style={{flex:1, color:'var(--fg)', fontSize:15, lineHeight:1.6, whiteSpace:'pre-wrap'}}>
              {err ? <span style={{color:'var(--ember)'}}>Hata: {err}</span>
                : loading ? <span style={{color:'var(--sand)'}}>KAPiTaN AI düşünüyor<span className="caret" /></span>
                : out}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   Draggable Window
   ============================================================ */

function DraggableWindow({ title, x = 60, y = 60, width = 380, children, z = 1, onFocus, accent }) {
  const [pos, setPos] = useStateI({ x, y });
  const [dragging, setDragging] = useStateI(false);
  const dragRef = useRefI({ ox: 0, oy: 0 });

  const onMouseDown = (e) => {
    onFocus?.();
    setDragging(true);
    dragRef.current = { ox: e.clientX - pos.x, oy: e.clientY - pos.y };
  };
  useEffectI(() => {
    if (!dragging) return;
    const onMove = (e) => setPos({ x: e.clientX - dragRef.current.ox, y: e.clientY - dragRef.current.oy });
    const onUp = () => setDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [dragging]);

  return (
    <div className="win" style={{position:'absolute', left:pos.x, top:pos.y, width, zIndex:z, userSelect: dragging ? 'none':'auto'}}
         onMouseDown={onFocus}>
      <div className="win-bar" onMouseDown={onMouseDown} style={{cursor: dragging ? 'grabbing':'grab', borderTop: accent ? `2px solid ${accent}` : undefined}}>
        <span className="d"/><span className="d"/><span className="d"/>
        <span className="title">{title}</span>
      </div>
      <div className="win-body">{children}</div>
    </div>
  );
}

Object.assign(window, {
  CommandPalette, useCmdK, LiveTerminal, AIPrompt, DraggableWindow
});
