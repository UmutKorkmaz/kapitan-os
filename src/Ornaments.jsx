/* Ottoman-inspired ornaments and motifs (SVG components) */

function StarSeal({ size = 80, color = 'var(--crimson)', stroke = 0.6, className, style }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} style={style} aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth={stroke}>
        {/* Outer 8-point star (rotated squares) */}
        <rect x="20" y="20" width="60" height="60" />
        <rect x="20" y="20" width="60" height="60" transform="rotate(45 50 50)" />
        {/* Inner star */}
        <rect x="32" y="32" width="36" height="36" />
        <rect x="32" y="32" width="36" height="36" transform="rotate(45 50 50)" />
        {/* Center circle + dot */}
        <circle cx="50" cy="50" r="6" />
        <circle cx="50" cy="50" r="1.4" fill={color} />
        {/* 8 outer dots */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map(a => {
          const r = 46;
          const x = 50 + r * Math.cos(a * Math.PI / 180);
          const y = 50 + r * Math.sin(a * Math.PI / 180);
          return <circle key={a} cx={x} cy={y} r="1" fill={color} stroke="none" />;
        })}
      </g>
    </svg>
  );
}

function HexRosette({ size = 100, color = 'var(--saffron)', stroke = 0.5, className, style }) {
  // 6-fold symmetric çini-style rosette
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = (i * 60 - 90) * Math.PI / 180;
    pts.push([50 + 38 * Math.cos(a), 50 + 38 * Math.sin(a)]);
  }
  const path = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(2) + ' ' + p[1].toFixed(2)).join(' ') + ' Z';
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} style={style} aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth={stroke}>
        <path d={path} />
        <path d={path} transform="rotate(30 50 50)" />
        <circle cx="50" cy="50" r="22" />
        <circle cx="50" cy="50" r="12" />
        <circle cx="50" cy="50" r="3" />
        {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="1.4" fill={color} stroke="none" />)}
      </g>
    </svg>
  );
}

/* Tug̃ra (signature)-inspired flourish — abstract calligraphic mark */
function Tugra({ width = 220, height = 80, color = 'var(--crimson)', className, style }) {
  return (
    <svg viewBox="0 0 220 80" width={width} height={height} className={className} style={style} aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth="1" strokeLinecap="round">
        {/* Three vertical hasta strokes */}
        <path d="M30 70 C 25 50, 35 30, 30 6 M50 70 C 45 50, 55 30, 50 6 M70 70 C 65 50, 75 30, 70 6" />
        {/* Sweeping bowl */}
        <path d="M16 56 C 30 76, 120 84, 170 58 C 196 44, 210 26, 198 14 C 188 4, 170 8, 160 22 C 154 30, 158 42, 168 44" />
        {/* Inner curls */}
        <path d="M90 50 C 110 56, 140 50, 150 38" />
        <path d="M110 64 C 130 70, 155 64, 168 52" />
        {/* Dots */}
        <circle cx="195" cy="20" r="1.4" fill={color} />
        <circle cx="100" cy="40" r="1.2" fill={color} />
        <circle cx="125" cy="46" r="1.0" fill={color} />
      </g>
    </svg>
  );
}

/* Tile band — repeating geometric stripe used as section divider */
function TileBand({ color = 'var(--crimson)', height = 22 }) {
  const unit = 22;
  const count = 60;
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${unit * count} ${height}`} preserveAspectRatio="none" aria-hidden="true" style={{display:'block'}}>
      <g fill="none" stroke={color} strokeWidth="0.6" opacity="0.55">
        {Array.from({length: count}).map((_, i) => {
          const x = i * unit;
          return (
            <g key={i} transform={`translate(${x} 0)`}>
              <path d={`M${unit/2} 2 L${unit-2} ${height/2} L${unit/2} ${height-2} L2 ${height/2} Z`} />
              <circle cx={unit/2} cy={height/2} r="2" />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

/* Large back ornament — abstract tile mandala for hero backdrops */
function MandalaBg({ color = 'var(--crimson)', size = 800, opacity = 0.06, className, style }) {
  return (
    <svg viewBox="0 0 400 400" width={size} height={size} className={className} style={{opacity, ...(style||{})}} aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth="0.6">
        <circle cx="200" cy="200" r="180" />
        <circle cx="200" cy="200" r="150" />
        <circle cx="200" cy="200" r="120" />
        <circle cx="200" cy="200" r="90" />
        <circle cx="200" cy="200" r="60" />
        <circle cx="200" cy="200" r="30" />
        {/* Star polygons */}
        <g transform="translate(200 200)">
          {Array.from({length: 12}).map((_, i) => {
            const a = (i * 30) * Math.PI / 180;
            const x = 180 * Math.cos(a);
            const y = 180 * Math.sin(a);
            return <line key={i} x1="0" y1="0" x2={x} y2={y} strokeWidth="0.3"/>;
          })}
        </g>
        {/* 8-point star */}
        <g transform="translate(200 200)">
          {[0, 45].map(rot => (
            <rect key={rot} x="-90" y="-90" width="180" height="180" transform={`rotate(${rot})`} />
          ))}
        </g>
        {/* outer flourishes */}
        {Array.from({length: 16}).map((_, i) => {
          const a = (i * 22.5) * Math.PI / 180;
          const cx = 200 + 160 * Math.cos(a);
          const cy = 200 + 160 * Math.sin(a);
          return <circle key={i} cx={cx} cy={cy} r="8" />;
        })}
      </g>
    </svg>
  );
}

/* Section opener — small ornament for between sections */
function SectionOrnament({ color = 'var(--crimson)', width = 240 }) {
  return (
    <svg width={width} height="40" viewBox="0 0 240 40" aria-hidden="true" style={{display:'block'}}>
      <g fill="none" stroke={color} strokeWidth="0.7" opacity="0.7">
        <line x1="0" y1="20" x2="90" y2="20" />
        <line x1="150" y1="20" x2="240" y2="20" />
        <g transform="translate(120 20)">
          <circle r="10" />
          <circle r="5" />
          <rect x="-7" y="-7" width="14" height="14" transform="rotate(45)" />
          <circle r="1.4" fill={color} />
        </g>
      </g>
    </svg>
  );
}

/* Frame corner ornaments */
function CornerOrnament({ size = 32, color = 'var(--crimson)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth="0.8">
        <path d="M2 2 L14 2 M2 2 L2 14" />
        <path d="M2 10 L8 10 L8 2" />
      </g>
    </svg>
  );
}

Object.assign(window, {
  StarSeal, HexRosette, Tugra, TileBand, MandalaBg, SectionOrnament, CornerOrnament,
});
