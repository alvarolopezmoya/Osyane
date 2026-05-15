// ─── Charts (Dark Theme) ─────────────────────────────────────────────────────

const {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} = Recharts;

const CHART_TICK  = { fontSize: 11, fill: '#5a6a8a', fontFamily: 'JetBrains Mono, monospace' };
const CHART_TIP   = { background: '#0b1121', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 9, fontSize: 12, fontFamily: 'Inter, sans-serif', color: '#e8edf8' };
const CHART_GRID  = 'rgba(255,255,255,0.05)';
const CHART_LABEL = { fontWeight: 600, color: '#e8edf8' };
const CHART_ITEM  = { color: '#e8edf8' };

function XPAreaChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 6, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#f5a623" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#f5a623" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
        <XAxis dataKey="week" tick={CHART_TICK} axisLine={false} tickLine={false} />
        <YAxis tick={CHART_TICK} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={CHART_TIP} itemStyle={CHART_ITEM} labelStyle={CHART_LABEL} formatter={(v) => [`${v} XP`, 'XP ganado']} cursor={{ stroke: 'rgba(255,255,255,0.08)' }} />
        <Area type="monotone" dataKey="xp" stroke="#f5a623" strokeWidth={2.5}
          fill="url(#xpGrad)" dot={{ r: 3, fill: '#f5a623', strokeWidth: 0 }}
          activeDot={{ r: 5, fill: '#ffcc5c', stroke: '#f5a623', strokeWidth: 2 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function SubjectBarChart({ data }) {
  const COLORS = ['#4f8ef7','#0fd9a0','#f5a623','#a78bfa','#f43f5e'];
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 6, right: 4, left: -20, bottom: 0 }} barSize={18}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
        <XAxis dataKey="subject" tick={{ ...CHART_TICK, fontFamily: 'Inter, sans-serif' }} axisLine={false} tickLine={false} />
        <YAxis tick={CHART_TICK} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={CHART_TIP} itemStyle={CHART_ITEM} formatter={(v) => [`${v} XP`, 'XP acumulado']} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
        <Bar dataKey="xp" radius={[5, 5, 0, 0]}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function MiniSparkline({ data, color = '#f5a623' }) {
  return (
    <ResponsiveContainer width="100%" height={44}>
      <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`sp${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={color} stopOpacity={0.35} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="xp" stroke={color} strokeWidth={2}
          fill={`url(#sp${color.replace('#','')})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function SubjectProgressBars({ data }) {
  const COLORS = ['#4f8ef7','#0fd9a0','#f5a623','#a78bfa','#f43f5e'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {data.map((s, i) => {
        const pct = Math.round((s.xp / s.maxXp) * 100);
        const c = COLORS[i % COLORS.length];
        return (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: DS.t1 }}>{s.subject}</span>
              <span className="num" style={{ fontSize: 11, color: DS.t2 }}>{s.xp.toLocaleString()} / {s.maxXp.toLocaleString()} XP</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 99, height: 7, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${pct}%`, background: c, borderRadius: 99,
                boxShadow: `0 0 10px ${c}55`,
                transition: 'width .9s cubic-bezier(.4,0,.2,1)',
              }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

const COMPETENCIAS_DATA = [
  { area: 'Algoritmos',     value: 78 },
  { area: 'Bases de Datos', value: 65 },
  { area: 'POO',            value: 88 },
  { area: 'Redes',          value: 52 },
  { area: 'Matemáticas',    value: 70 },
  { area: 'Soft Skills',    value: 83 },
];

function CompetenciasRadar({ data = COMPETENCIAS_DATA, height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart cx="50%" cy="50%" outerRadius="72%" data={data}>
        <PolarGrid stroke="rgba(255,255,255,0.08)" />
        <PolarAngleAxis dataKey="area" tick={{ fontSize: 11, fill: '#5a6a8a', fontFamily: 'Inter,sans-serif', fontWeight: 600 }} />
        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9, fill: '#2c3a58' }} tickCount={4} axisLine={false} />
        <Radar dataKey="value" stroke="#4f8ef7" strokeWidth={2} fill="#4f8ef7" fillOpacity={0.14}
          dot={{ r: 4, fill: '#f5a623', stroke: '#f5a623', strokeWidth: 0 }} />
        <Tooltip contentStyle={CHART_TIP} itemStyle={CHART_ITEM} formatter={(v) => [`${v}%`, 'Competencia']} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

Object.assign(window, { XPAreaChart, SubjectBarChart, MiniSparkline, SubjectProgressBars, CompetenciasRadar, COMPETENCIAS_DATA });
