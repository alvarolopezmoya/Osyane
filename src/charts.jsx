
// ─── Chart Components (Recharts wrappers) ─────────────────────────────────────

const {
  AreaChart, Area, BarChart, Bar, RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie, Legend
} = Recharts;

function XPAreaChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#FFB800" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#FFB800" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e6e8f1" vertical={false} />
        <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#9097b5', fontFamily: 'JetBrains Mono, monospace' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#9097b5', fontFamily: 'JetBrains Mono, monospace' }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: '#fff', border: '1px solid #e6e8f1', borderRadius: 8, fontSize: 12, fontFamily: 'Inter, sans-serif' }}
          labelStyle={{ fontWeight: 700, color: '#1b2036' }}
          formatter={(v) => [`${v} XP`, 'XP ganado']} />
        <Area type="monotone" dataKey="xp" stroke="#FFB800" strokeWidth={2.5} fill="url(#xpGrad)" dot={{ r: 3, fill: '#FFB800', strokeWidth: 0 }} activeDot={{ r: 5 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function SubjectBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={18}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e6e8f1" vertical={false} />
        <XAxis dataKey="subject" tick={{ fontSize: 11, fill: '#9097b5', fontFamily: 'Inter, sans-serif' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#9097b5', fontFamily: 'JetBrains Mono, monospace' }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: '#fff', border: '1px solid #e6e8f1', borderRadius: 8, fontSize: 12, fontFamily: 'Inter, sans-serif' }}
          formatter={(v) => [`${v} XP`, 'XP acumulado']} />
        <Bar dataKey="xp" radius={[4, 4, 0, 0]}>
          {data.map((_, i) => {
            const colors = ['#1a56c4','#1f7a4a','#b87d00','#003087','#7c3aed'];
            return <Cell key={i} fill={colors[i % colors.length]} />;
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function MiniSparkline({ data, color = '#FFB800' }) {
  return (
    <ResponsiveContainer width="100%" height={48}>
      <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`spark-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="xp" stroke={color} strokeWidth={2} fill={`url(#spark-${color.replace('#','')})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function SubjectProgressBars({ data }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {data.map((s, i) => {
        const colors = ['#1a56c4','#1f7a4a','#b87d00','#003087','#7c3aed'];
        const pct = Math.round((s.xp / s.maxXp) * 100);
        return (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#2b3250' }}>{s.subject}</span>
              <span style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: '#6b7293' }}>{s.xp.toLocaleString()} / {s.maxXp.toLocaleString()} XP</span>
            </div>
            <div style={{ background: '#ebeef7', borderRadius: 99, height: 8, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: colors[i % colors.length], borderRadius: 99, transition: 'width .8s cubic-bezier(.4,0,.2,1)' }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { XPAreaChart, SubjectBarChart, MiniSparkline, SubjectProgressBars });
