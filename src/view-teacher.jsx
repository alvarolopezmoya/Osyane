// ─── Teacher / Docente View — Premium + Task Management ──────────────────────

function exportToExcel(students) {
  const rows = [...students].sort((a,b) => b.xp - a.xp).map((s, i) => {
    const lvl = getLevelInfo(s.xp);
    return { 'Puesto': i+1, 'Nombre': s.name, 'XP Total': s.xp, 'Nivel': lvl.n, 'Título': lvl.title, 'Racha (días)': s.streak, 'Insignias': s.earnedBadges.length };
  });
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  ws['!cols'] = [{ wch:8 },{ wch:24 },{ wch:12 },{ wch:8 },{ wch:18 },{ wch:14 },{ wch:10 }];
  XLSX.utils.book_append_sheet(wb, ws, 'Ranking');
  XLSX.writeFile(wb, 'Osyane_Ranking.xlsx');
}

function exportToPDF(students) {
  const sorted = [...students].sort((a,b) => b.xp - a.xp);
  const rows = sorted.map((s, i) => {
    const lvl = getLevelInfo(s.xp);
    return `<tr style="background:${i%2===0?'#0b1121':'#080e1e'}">
      <td style="padding:7px 12px;text-align:center;font-weight:700;color:#4f8ef7">${i+1}</td>
      <td style="padding:7px 12px;font-weight:600;color:#e8edf8">${s.name}</td>
      <td style="padding:7px 12px;text-align:right;font-family:monospace;font-weight:700;color:#f5a623">${s.xp.toLocaleString()}</td>
      <td style="padding:7px 12px;text-align:center;color:#7db3ff">N${lvl.n}</td>
      <td style="padding:7px 12px;color:#5a6a8a">${lvl.title}</td>
      <td style="padding:7px 12px;text-align:center;color:#f5a623">${s.streak>0?`🔥 ${s.streak}d`:'—'}</td>
      <td style="padding:7px 12px;text-align:center;color:#e8edf8">${s.earnedBadges.length}</td>
    </tr>`;
  }).join('');
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Reporte Osyane</title>
  <style>body{font-family:Inter,Arial,sans-serif;color:#e8edf8;margin:32px;background:#060912;}
  h1{color:#4f8ef7;font-size:22px;margin:0 0 4px;}p{color:#5a6a8a;font-size:13px;margin:0 0 24px;}
  table{width:100%;border-collapse:collapse;font-size:13px;}
  thead{background:linear-gradient(135deg,#1d4ed8,#4f8ef7);}
  th{padding:10px 12px;text-align:left;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#fff;}
  .footer{margin-top:24px;font-size:11px;color:#2c3a58;border-top:1px solid #111c35;padding-top:12px;}
  @media print{@page{margin:20mm}}</style></head><body>
  <h1>Reporte de Rendimiento</h1>
  <p>Osyane · FISEI · UTA · ${new Date().toLocaleDateString('es-EC',{year:'numeric',month:'long',day:'numeric'})}</p>
  <table><thead><tr><th>#</th><th>Estudiante</th><th>XP</th><th>Nivel</th><th>Título</th><th>Racha</th><th>Insignias</th></tr></thead>
  <tbody>${rows}</tbody></table>
  <div class="footer">Total: ${sorted.length} estudiantes</div>
  <script>window.onload=()=>{window.print();}<\/script></body></html>`;
  const win = window.open('','_blank');
  win.document.write(html); win.document.close();
}

// ── Subject colors ──────────────────────────────────────────────────────────
const SUBJECT_COLORS = {
  'Ing. de Software': '#4f8ef7',
  'Base de Datos':    '#0fd9a0',
  'Programación OO':  '#f5a623',
  'Redes':            '#a78bfa',
  'Cálculo':          '#f43f5e',
};

// ── Task Card ────────────────────────────────────────────────────────────────
function TaskCard({ task, onDelete }) {
  const color = SUBJECT_COLORS[task.subject] || DS.blue;
  const daysLeft = Math.ceil((new Date(task.deadline) - new Date()) / 86400000);
  return (
    <div style={{
      background: DS.card, border: `1px solid ${DS.bd}`,
      borderRadius: 14, padding: '18px 18px 14px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
      display: 'flex', flexDirection: 'column', gap: 10,
      position: 'relative', overflow: 'hidden',
      transition: 'border-color .15s',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = DS.bdMd}
      onMouseLeave={e => e.currentTarget.style.borderColor = DS.bd}>
      {/* Color accent bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color, borderRadius: '14px 14px 0 0', boxShadow: `0 0 12px ${color}66` }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="head" style={{ fontSize: 14, fontWeight: 700, color: DS.t1, marginBottom: 4, lineHeight: 1.3 }}>{task.title}</div>
          <span style={{ fontSize: 10, fontWeight: 700, color, background: color + '18', border: `1px solid ${color}33`, borderRadius: 5, padding: '2px 7px', letterSpacing: '.04em' }}>
            {task.subject}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
          <div style={{ textAlign: 'center' }}>
            <div className="num" style={{ fontSize: 18, fontWeight: 800, color: DS.gold, lineHeight: 1 }}>{task.xp}</div>
            <div style={{ fontSize: 9, color: DS.t3, fontWeight: 700, letterSpacing: '.06em' }}>XP</div>
          </div>
        </div>
      </div>
      <p style={{ margin: 0, fontSize: 12, color: DS.t2, lineHeight: 1.5 }}>{task.desc}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ color: daysLeft < 3 ? DS.red : DS.t3 }}>
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span style={{ fontSize: 11, color: daysLeft < 3 ? DS.red : DS.t2 }}>
            {task.deadline} · {daysLeft > 0 ? `${daysLeft}d restantes` : 'Vencida'}
          </span>
        </div>
        <button onClick={() => onDelete(task.id)} style={{
          background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)',
          borderRadius: 7, cursor: 'pointer', color: '#f87171',
          padding: '4px 10px', fontSize: 11, fontWeight: 600,
          fontFamily: "'Inter',sans-serif", transition: 'all .15s',
        }}
          onMouseEnter={e => e.currentTarget.style.background='rgba(244,63,94,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background='rgba(244,63,94,0.1)'}>
          Eliminar
        </button>
      </div>
    </div>
  );
}

// ── New Task Modal ────────────────────────────────────────────────────────────
const TASK_SUBJECTS = ['Programación OO','Base de Datos','Redes','Ing. de Software','Cálculo'];

function NewTaskModal({ open, onClose, onSave }) {
  const [title, setTitle]     = React.useState('');
  const [desc, setDesc]       = React.useState('');
  const [subject, setSubject] = React.useState(TASK_SUBJECTS[0]);
  const [xp, setXp]           = React.useState('100');
  const [deadline, setDeadline] = React.useState('');

  function handleSave() {
    if (!title.trim() || !deadline) return;
    onSave({ title: title.trim(), desc: desc.trim(), subject, xp: parseInt(xp) || 100, deadline });
    setTitle(''); setDesc(''); setSubject(TASK_SUBJECTS[0]); setXp('100'); setDeadline('');
    onClose();
  }

  const inputStyle = {
    width: '100%', boxSizing: 'border-box', padding: '9px 13px',
    border: `1px solid ${DS.bdMd}`, borderRadius: 9, fontSize: 13,
    fontFamily: "'Inter',sans-serif", background: DS.bg, color: DS.t1, outline: 'none',
  };
  const label = txt => <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: DS.t2, marginBottom: 6, letterSpacing: '.06em', textTransform: 'uppercase' }}>{txt}</label>;

  return (
    <Modal open={open} onClose={onClose} title="Nueva tarea" width={480}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>{label('Título')}<Input placeholder="Ej: Proyecto API REST" value={title} onChange={e => setTitle(e.target.value)} /></div>
        <div>
          {label('Descripción')}
          <textarea value={desc} onChange={e => setDesc(e.target.value)}
            placeholder="Describe el objetivo de la tarea…"
            style={{ ...inputStyle, height: 80, resize: 'vertical' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            {label('Asignatura')}
            <select value={subject} onChange={e => setSubject(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
              {TASK_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            {label('Fecha límite')}
            <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} style={{ ...inputStyle, colorScheme: 'dark' }} />
          </div>
        </div>
        <div>
          {label('XP de recompensa')}
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 8 }}>
            {[50,100,150,200,300].map(v => (
              <button key={v} onClick={() => setXp(String(v))}
                className={`xp-pick${xp === String(v) ? ' active' : ''}`}>+{v}</button>
            ))}
          </div>
          <Input placeholder="Valor personalizado" value={xp} onChange={e => setXp(e.target.value.replace(/\D/g,''))} />
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
          <Btn variant="primary" onClick={handleSave} disabled={!title.trim() || !deadline}>
            <IcoPlus size={14} /> Crear tarea
          </Btn>
        </div>
      </div>
    </Modal>
  );
}

// ── Main Teacher View ─────────────────────────────────────────────────────────
function ViewTeacher() {
  const { students, leaderboard, awardXp, awardBadge, tasks, addTask, deleteTask } = useApp();
  const [tab, setTab]               = React.useState('students');
  const [search, setSearch]         = React.useState('');
  const [selectedStudent, setSelectedStudent] = React.useState(null);
  const [xpModal, setXpModal]       = React.useState(false);
  const [badgeModal, setBadgeModal] = React.useState(false);
  const [taskModal, setTaskModal]   = React.useState(false);
  const [xpAmount, setXpAmount]     = React.useState('');
  const [xpReason, setXpReason]     = React.useState('');
  const [selectedBadge, setSelectedBadge] = React.useState('');

  const sorted = [...leaderboard].filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
  const totalXp   = students.reduce((a,s) => a+s.xp, 0);
  const avgXp     = Math.round(totalXp / students.length);
  const topStudent = leaderboard[0];

  function handleAwardXp() {
    const amt = parseInt(xpAmount);
    if (!selectedStudent || !amt || amt <= 0) return;
    awardXp(selectedStudent.id, amt, xpReason || 'Otorgado por docente');
    setXpModal(false); setXpAmount(''); setXpReason('');
  }
  function handleAwardBadge() {
    if (!selectedStudent || !selectedBadge) return;
    awardBadge(selectedStudent.id, selectedBadge);
    setBadgeModal(false); setSelectedBadge('');
  }
  const availableBadges = selectedStudent ? BADGES.filter(b => !selectedStudent.earnedBadges.includes(b.id)) : [];
  const C = { background: DS.card, border: `1px solid ${DS.bd}`, borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.38)' };

  return (
    <div className="rise-in" style={{ padding: 'clamp(14px,3vw,28px)', maxWidth: 1140, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 22, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="head" style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: DS.t1, letterSpacing: '-.02em' }}>Panel del Docente</h1>
          <p style={{ margin: 0, fontSize: 13, color: DS.t2 }}>Administración · Ingeniería en Software · 2025-A</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Btn variant="ghost" size="sm" onClick={() => exportToExcel(students)}><span>📊</span> Excel</Btn>
          <Btn variant="ghost" size="sm" onClick={() => exportToPDF(students)}><span>📄</span> PDF</Btn>
          {tab === 'tasks' && <Btn variant="primary" size="sm" onClick={() => setTaskModal(true)}><IcoPlus size={13} /> Nueva tarea</Btn>}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 22 }}>
        {[
          { label: 'Estudiantes', value: students.length,              sub: 'En el grupo',      icon: <IcoTeacher size={16} />, accent: DS.blue   },
          { label: 'XP promedio', value: avgXp.toLocaleString(),       sub: 'Por estudiante',   icon: <IcoXp size={16} />,      accent: DS.gold   },
          { label: 'Líder',       value: topStudent?.name ?? '—',      sub: `${topStudent?.xp.toLocaleString()} XP`, icon: <IcoTrophy size={16} />, accent: DS.gold },
          { label: 'Tareas',      value: tasks.length,                 sub: 'Activas',          icon: <IcoCheck size={16} />,   accent: DS.green  },
          { label: 'XP total',    value: (totalXp/1000).toFixed(1)+'K',sub: 'En el grupo',      icon: <IcoStar size={16} />,    accent: DS.purple },
        ].map((s, i) => (
          <div key={i} className={`float-up d${i+1}`} style={{ flex: '0 0 auto', minWidth: 160 }}>
            <StatCard label={s.label} value={s.value} sub={s.sub} icon={s.icon} accent={s.accent} />
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
        {[{ id:'students', label:'Estudiantes' }, { id:'tasks', label:`Tareas (${tasks.length})` }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`tab${tab === t.id ? ' active' : ''}`}
            style={{ borderRadius: '8px 8px 0 0', borderBottom: tab === t.id ? `2px solid ${DS.blue}` : '2px solid transparent' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── STUDENTS TAB ── */}
      {tab === 'students' && (
        <div style={{ ...C, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${DS.bd}`, display: 'flex', gap: 12, alignItems: 'center' }}>
            <Input placeholder="Buscar estudiante…" value={search} onChange={e => setSearch(e.target.value)} icon={<IcoSearch size={15} />} style={{ flex: 1 }} />
            <span style={{ fontSize: 12, color: DS.t2, whiteSpace: 'nowrap' }}>{sorted.length} estudiantes</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr 110px 80px 80px 130px', padding: '9px 20px', borderBottom: `1px solid ${DS.bd}`, fontSize: 10, fontWeight: 700, color: DS.t3, textTransform: 'uppercase', letterSpacing: '.07em' }}>
            <span>#</span><span>Estudiante</span>
            <span style={{ textAlign:'right' }}>XP</span>
            <span style={{ textAlign:'center' }}>Nivel</span>
            <span style={{ textAlign:'center' }}>Insignias</span>
            <span style={{ textAlign:'center' }}>Acciones</span>
          </div>
          {sorted.map((s, i) => {
            const lvl = getLevelInfo(s.xp);
            return (
              <div key={s.id} className="tr" style={{
                display: 'grid', gridTemplateColumns: '44px 1fr 110px 80px 80px 130px',
                padding: '11px 20px', alignItems: 'center',
                background: s.isMe ? `${DS.blue}0a` : 'transparent',
                borderBottom: `1px solid ${DS.bd}`,
                borderLeft: s.isMe ? `3px solid ${DS.blue}` : '3px solid transparent',
              }}>
                <span className="num" style={{ fontSize: 11, color: DS.t3 }}>#{s.rank}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar initials={s.initials} size={30} colorIndex={parseInt(s.id.slice(1))-1} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: DS.t1 }}>{s.name}</div>
                    <div style={{ fontSize: 10, color: DS.t2 }}>{lvl.title}</div>
                  </div>
                </div>
                <div style={{ textAlign:'right' }}><span className="num" style={{ fontSize: 13, fontWeight: 700, color: DS.t1 }}>{s.xp.toLocaleString()}</span></div>
                <div style={{ textAlign:'center' }}><span style={{ background: DS.blueDim, color: DS.blueBright, borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 700 }}>N{lvl.n}</span></div>
                <div style={{ textAlign:'center', fontSize: 13, color: DS.t1 }}>{s.earnedBadges.length}</div>
                <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                  <button onClick={() => { setSelectedStudent(s); setXpModal(true); }}
                    style={{ padding: '5px 12px', borderRadius: 7, border: `1px solid ${DS.blue}44`, background: DS.blueDim, cursor: 'pointer', fontSize: 12, fontWeight: 700, color: DS.blueBright, fontFamily: "'Inter',sans-serif", transition: 'all .15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = DS.blueMid}
                    onMouseLeave={e => e.currentTarget.style.background = DS.blueDim}>+XP</button>
                  <button onClick={() => { setSelectedStudent(s); setBadgeModal(true); }}
                    style={{ padding: '5px 10px', borderRadius: 7, border: `1px solid ${DS.gold}44`, background: DS.goldDim, cursor: 'pointer', fontSize: 12, fontWeight: 700, color: DS.goldBright, fontFamily: "'Inter',sans-serif", transition: 'all .15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = `${DS.gold}22`}
                    onMouseLeave={e => e.currentTarget.style.background = DS.goldDim}>🏅</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── TASKS TAB ── */}
      {tab === 'tasks' && (
        tasks.length === 0 ? (
          <div style={{ ...C, padding: 40 }}>
            <EmptyState icon="📋" title="Sin tareas creadas" sub="Haz clic en «Nueva tarea» para crear la primera." />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 14 }}>
            {tasks.map((t, i) => (
              <div key={t.id} className={`float-up d${Math.min(i+1,6)}`}>
                <TaskCard task={t} onDelete={deleteTask} />
              </div>
            ))}
          </div>
        )
      )}

      {/* Award XP Modal */}
      <Modal open={xpModal} onClose={() => setXpModal(false)} title={`Otorgar XP — ${selectedStudent?.name}`} width={420}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: DS.t2, marginBottom: 8 }}>Cantidad de XP</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
              {[25,50,100,150,200,300].map(v => (
                <button key={v} onClick={() => setXpAmount(String(v))} className={`xp-pick${xpAmount===String(v)?' active':''}`}>+{v}</button>
              ))}
            </div>
            <Input placeholder="O escribe un valor…" value={xpAmount} onChange={e => setXpAmount(e.target.value.replace(/\D/g,''))} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: DS.t2, marginBottom: 6 }}>Motivo</label>
            <Input placeholder="Ej: Proyecto entregado con excelencia" value={xpReason} onChange={e => setXpReason(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Btn variant="ghost" onClick={() => setXpModal(false)}>Cancelar</Btn>
            <Btn variant="gold" onClick={handleAwardXp} disabled={!xpAmount || parseInt(xpAmount)<=0}>
              <IcoXp size={14} /> Otorgar {xpAmount ? `+${xpAmount} XP` : 'XP'}
            </Btn>
          </div>
        </div>
      </Modal>

      {/* Award Badge Modal */}
      <Modal open={badgeModal} onClose={() => setBadgeModal(false)} title={`Otorgar insignia — ${selectedStudent?.name}`} width={500}>
        <div>
          <p style={{ margin: '0 0 14px', fontSize: 13, color: DS.t2 }}>Selecciona una insignia no obtenida por el estudiante:</p>
          {availableBadges.length === 0 ? (
            <EmptyState icon="🏆" title="Sin insignias disponibles" sub="Este estudiante ya tiene todas las insignias" />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
              {availableBadges.map(b => (
                <div key={b.id} onClick={() => setSelectedBadge(b.id)} style={{
                  border: `1px solid ${selectedBadge===b.id ? DS.gold : DS.bd}`,
                  background: selectedBadge===b.id ? DS.goldDim : DS.card2,
                  borderRadius: 11, padding: '10px 8px', textAlign: 'center', cursor: 'pointer', transition: 'all .15s',
                  boxShadow: selectedBadge===b.id ? `0 0 14px ${DS.goldDim}` : 'none',
                }}>
                  <div style={{ fontSize: 24 }}>{b.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: DS.t1, marginTop: 5 }}>{b.name}</div>
                  <div className="num" style={{ fontSize: 10, color: DS.t2, marginTop: 2 }}>+{b.xp} XP</div>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Btn variant="ghost" onClick={() => setBadgeModal(false)}>Cancelar</Btn>
            <Btn variant="primary" onClick={handleAwardBadge} disabled={!selectedBadge}>
              <IcoGift size={14} /> Otorgar insignia
            </Btn>
          </div>
        </div>
      </Modal>

      {/* New Task Modal */}
      <NewTaskModal open={taskModal} onClose={() => setTaskModal(false)} onSave={addTask} />
    </div>
  );
}

Object.assign(window, { ViewTeacher });
