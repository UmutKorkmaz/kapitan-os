import { useEffect, useRef, useState } from 'react';

const TR_CMDS = {
  yardım: ['KAPiTaN uçbirim — örnek: listele, gir, kur, sor, temizle'],
  temizle: ['__clear__'],
  sistem: ['Linux kapitan 6.8.0 #1 SMP x86_64 GNU/Linux'],
  sis: ['Linux kapitan 6.8.0 #1 SMP x86_64 GNU/Linux'],
  listele: ['Belgeler  İndirilenler  Masaüstü  Projeler'],
  lst: ['Belgeler  İndirilenler  Masaüstü  Projeler'],
  gir: ['Dizin değiştirildi.'],
  gr: ['Dizin değiştirildi.'],
  kur: ['Paket kurulumu simülasyonu — henüz bağlı değil.'],
  kr: ['Paket kurulumu simülasyonu — henüz bağlı değil.'],
  sor: ['AI yanıtı simülasyonu — yerel model henüz bağlı değil.'],
  sr: ['AI yanıtı simülasyonu — yerel model henüz bağlı değil.'],
};

export default function LiveTerminal({ title = 'kapitan@deneme ~ uçbirim', initial = [], height = 320 }) {
  const [history, setHistory] = useState(initial);
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

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
    setHistory((h) => [...h, { type: 'cmd', text: cmd }, ...out.map((t) => ({ type: 'out', text: t }))]);
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  const onSubmit = (e) => {
    e.preventDefault();
    run(input);
    setInput('');
  };

  const quick = ['sistem', 'listele', 'gir', 'kur', 'yardım', 'temizle'];

  return (
    <div className="term" onClick={() => inputRef.current?.focus()} style={{ cursor: 'text' }}>
      <div className="term-bar">
        <div className="dotgroup"><span /><span /><span /></div>
        <span>{title}</span>
        <span style={{ marginLeft: 'auto', color: 'var(--sand)', fontSize: 10 }}>CANLI · YAZIN</span>
      </div>
      <div ref={scrollRef} className="term-body" style={{ height, overflow: 'auto' }}>
        {history.length === 0 && (
          <div style={{ color: 'var(--sand)', marginBottom: 8 }}>
            <div className="out">Hoş geldiniz. Bir komut yazın veya kısayollardan birini seçin.</div>
            <div className="out" style={{ marginTop: 8 }}>
              kısayollar:
              {' '}
              {quick.map((q) => (
                <span
                  key={q}
                  onClick={(e) => { e.stopPropagation(); run(q); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); run(q); } }}
                  role="button"
                  tabIndex={0}
                  style={{
                    color: 'var(--saffron)',
                    cursor: 'pointer',
                    marginRight: 10,
                    textDecoration: 'underline',
                    textDecorationColor: 'rgba(232,178,62,0.4)',
                  }}
                >
                  {q}
                </span>
              ))}
            </div>
          </div>
        )}
        {history.map((ln, i) => {
          if (ln.type === 'cmd') {
            return (
              <div key={i}>
                <span className="prompt">›</span>
                {' '}
                <span className="cmd">{ln.text}</span>
              </div>
            );
          }
          return <div key={i}><span className="out">{ln.text}</span></div>;
        })}
        <form onSubmit={onSubmit} className="term-input">
          <span className="prompt">›</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="komut yazın…"
            autoComplete="off"
            spellCheck={false}
          />
        </form>
      </div>
    </div>
  );
}