import { useMemo, useState } from 'react';
import { useApp } from '../store.jsx';
import { useI18n } from '../i18n/index.jsx';
import { DS } from '../components/ds.js';
import { Btn, Input, Modal, SectionHeader, EmptyState, StatCard } from '../components/UI.jsx';
import { IcoSearch, IcoUpload, IcoCheck, IcoTasks, IcoXp, IcoFlame } from '../components/Icons.jsx';
import {
  daysUntilDeadline, isOverdue, submissionFor, canSubmit, SUBMISSION_STATUS,
} from '../utils/tasks.js';

const SUBJECT_COLORS = {
  'Ing. de Software': '#4f8ef7',
  'Base de Datos':    '#0fd9a0',
  'Programación OO':  '#f5a623',
  'Redes':            '#a78bfa',
  'Cálculo':          '#f43f5e',
};

function StatusBadge({ submission, deadline, t }) {
  if (!submission) {
    if (isOverdue(deadline)) {
      return <span style={pill(DS.red, 'rgba(244,63,94,0.12)')}>{t('tasks.overdue')}</span>;
    }
    return <span style={pill(DS.t2, DS.card2)}>{t('tasks.pending')}</span>;
  }
  if (submission.status === SUBMISSION_STATUS.APPROVED) {
    return <span style={pill(DS.green, 'rgba(15,217,160,0.12)')}>✓ Aprobada</span>;
  }
  if (submission.status === SUBMISSION_STATUS.REJECTED) {
    return <span style={pill(DS.red, 'rgba(244,63,94,0.12)')}>✗ Rechazada</span>;
  }
  return <span style={pill(DS.blue, DS.blueDim)}>{t('tasks.submitted')}</span>;
}
function pill(color, bg) {
  return {
    fontSize: 10, fontWeight: 700, color, background: bg,
    border: `1px solid ${color}33`, borderRadius: 5, padding: '2px 8px', letterSpacing: '.04em',
  };
}

function Countdown({ deadline }) {
  const days = daysUntilDeadline(deadline);
  if (days == null) return null;
  if (days < 0) return <span style={{ color: DS.red, fontWeight: 700 }}>Vencida hace {Math.abs(days)}d</span>;
  if (days === 0) return <span style={{ color: DS.red, fontWeight: 700 }}>¡Vence hoy!</span>;
  if (days <= 2) return <span style={{ color: DS.red, fontWeight: 700 }}>⏰ {days}d restantes</span>;
  if (days <= 7) return <span style={{ color: DS.gold, fontWeight: 600 }}>{days}d restantes</span>;
  return <span style={{ color: DS.t2 }}>{days}d restantes</span>;
}

function SubmitModal({ open, onClose, task, onSubmit }) {
  const [note, setNote] = useState('');
  if (!task) return null;
  function handleSubmit() {
    onSubmit(task.id, note.trim());
    setNote('');
    onClose();
  }
  return (
    <Modal open={open} onClose={onClose} title={`Entregar: ${task.title}`} width={460}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ background: DS.card2, border: `1px solid ${DS.bd}`, borderRadius: 10, padding: '12px 14px' }}>
          <div style={{ fontSize: 11, color: DS.t3, letterSpacing: '.06em', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Recompensa</div>
          <div className="num" style={{ fontSize: 24, fontWeight: 800, color: DS.gold }}>+{task.xp} XP</div>
          <div style={{ fontSize: 11, color: DS.t2, marginTop: 4 }}>Se otorgará automáticamente al aprobar la entrega.</div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: DS.t2, marginBottom: 6, letterSpacing: '.06em', textTransform: 'uppercase' }}>Nota / enlace (opcional)</label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)}
            placeholder="Resumen, enlace al repo, notas para el docente…"
            style={{
              width: '100%', boxSizing: 'border-box', padding: '9px 13px',
              border: `1px solid ${DS.bdMd}`, borderRadius: 9, fontSize: 13,
              fontFamily: "'Inter',sans-serif", background: DS.bg, color: DS.t1,
              outline: 'none', height: 90, resize: 'vertical',
            }} />
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
          <Btn variant="primary" onClick={handleSubmit}>
            <IcoUpload size={14} /> Enviar entrega
          </Btn>
        </div>
      </div>
    </Modal>
  );
}

function TaskRow({ task, submission, onSubmit, t }) {
  const color = SUBJECT_COLORS[task.subject] || DS.blue;
  const can = canSubmit(task, submission);
  const approved = submission?.status === SUBMISSION_STATUS.APPROVED;

  return (
    <div style={{
      background: DS.card, border: `1px solid ${approved ? DS.green + '40' : DS.bd}`,
      borderRadius: 14, padding: '16px 18px',
      display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: 14, alignItems: 'center',
      position: 'relative', overflow: 'hidden',
      transition: 'border-color .15s, transform .15s',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 4, background: color, boxShadow: `0 0 12px ${color}66` }} />
      <div style={{
        width: 44, height: 44, borderRadius: 11,
        background: color + '18', border: `1px solid ${color}44`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color, fontSize: 18, fontWeight: 800,
      }}>
        <IcoTasks size={20} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
          <span className="head" style={{ fontSize: 14, fontWeight: 700, color: DS.t1 }}>{task.title}</span>
          <StatusBadge submission={submission} deadline={task.deadline} t={t} />
        </div>
        <p style={{ margin: '0 0 6px', fontSize: 12, color: DS.t2, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{task.desc}</p>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 11, color: DS.t3 }}>
          <span style={{ color, fontWeight: 600 }}>{task.subject}</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span>{task.deadline}</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <Countdown deadline={task.deadline} />
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div className="num" style={{ fontSize: 20, fontWeight: 800, color: approved ? DS.green : DS.gold, lineHeight: 1 }}>+{task.xp}</div>
        <div style={{ fontSize: 9, color: DS.t3, fontWeight: 700, letterSpacing: '.06em', marginTop: 2 }}>XP</div>
      </div>
      <div>
        {can && <Btn variant="primary" size="sm" onClick={() => onSubmit(task)}><IcoUpload size={13} /> Entregar</Btn>}
        {!can && approved && <span style={{ fontSize: 11, color: DS.green, fontWeight: 700, display: 'inline-flex', gap: 4, alignItems: 'center' }}><IcoCheck size={13} /> +{task.xp} XP</span>}
        {!can && submission?.status === SUBMISSION_STATUS.SUBMITTED && <span style={{ fontSize: 11, color: DS.blue, fontWeight: 600 }}>En revisión</span>}
        {!can && !submission && isOverdue(task.deadline) && <span style={{ fontSize: 11, color: DS.red, fontWeight: 600 }}>Vencida</span>}
        {!can && submission?.status === SUBMISSION_STATUS.REJECTED && <Btn variant="ghost" size="sm" onClick={() => onSubmit(task)}>Reintentar</Btn>}
      </div>
    </div>
  );
}

export default function ViewStudentTasks() {
  const { tasks, submissions, myStudent, submitTask } = useApp();
  const { t } = useI18n();
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('all'); // all | pending | submitted | approved | overdue
  const [submitModal, setSubmitModal] = useState({ open: false, task: null });

  const my = useMemo(() => tasks.map((task) => ({
    task,
    submission: submissionFor(task, submissions, myStudent.id),
  })), [tasks, submissions, myStudent.id]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return my.filter(({ task, submission }) => {
      if (q && !task.title.toLowerCase().includes(q) && !task.subject.toLowerCase().includes(q)) return false;
      if (filter === 'pending'   && (submission || isOverdue(task.deadline))) return false;
      if (filter === 'submitted' && submission?.status !== SUBMISSION_STATUS.SUBMITTED) return false;
      if (filter === 'approved'  && submission?.status !== SUBMISSION_STATUS.APPROVED) return false;
      if (filter === 'overdue'   && !(isOverdue(task.deadline) && !submission)) return false;
      return true;
    });
  }, [my, search, filter]);

  const counts = useMemo(() => ({
    all: my.length,
    pending:   my.filter(({ task, submission }) => !submission && !isOverdue(task.deadline)).length,
    submitted: my.filter(({ submission }) => submission?.status === SUBMISSION_STATUS.SUBMITTED).length,
    approved:  my.filter(({ submission }) => submission?.status === SUBMISSION_STATUS.APPROVED).length,
    overdue:   my.filter(({ task, submission }) => isOverdue(task.deadline) && !submission).length,
  }), [my]);

  const xpEarned = my.reduce((a, { task, submission }) => a + (submission?.status === SUBMISSION_STATUS.APPROVED ? task.xp : 0), 0);
  const xpPotential = my.reduce((a, { task, submission }) => a + (submission?.status !== SUBMISSION_STATUS.APPROVED && !isOverdue(task.deadline) ? task.xp : 0), 0);

  const FILTERS = [
    { id: 'all',       label: 'Todas',       count: counts.all      },
    { id: 'pending',   label: 'Pendientes',  count: counts.pending  },
    { id: 'submitted', label: 'Entregadas',  count: counts.submitted },
    { id: 'approved',  label: 'Aprobadas',   count: counts.approved },
    { id: 'overdue',   label: 'Vencidas',    count: counts.overdue  },
  ];

  return (
    <div className="rise-in" style={{ padding: 'clamp(14px,3vw,28px)', maxWidth: 1100, margin: '0 auto' }}>

      <div style={{ marginBottom: 22, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="head" style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: DS.t1, letterSpacing: '-.02em' }}>{t('tasks.titleStudent')}</h1>
          <p style={{ margin: 0, fontSize: 13, color: DS.t2 }}>
            <IcoCheck size={12} /> {t('tasks.auto')} · {counts.approved} de {counts.all} aprobadas
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(170px,1fr))', gap: 14, marginBottom: 22 }}>
        <div className="float-up d1"><StatCard label="Tareas activas"   value={counts.all}        sub={`${counts.pending} pendientes`} icon={<IcoTasks size={16} />} accent={DS.blue} /></div>
        <div className="float-up d2"><StatCard label="XP obtenido"      value={xpEarned}          sub="De tareas aprobadas"            icon={<IcoXp size={16} />}    accent={DS.gold} /></div>
        <div className="float-up d3"><StatCard label="XP por ganar"     value={xpPotential}       sub="Si entregas todas"              icon={<IcoXp size={16} />}    accent={DS.green} /></div>
        <div className="float-up d4"><StatCard label="Vencidas"         value={counts.overdue}    sub="Sin entregar"                   icon={<IcoFlame size={16} />} accent={DS.red} /></div>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
        <Input placeholder={t('common.search')} value={search} onChange={(e) => setSearch(e.target.value)} icon={<IcoSearch size={15} />} style={{ flex: 1, minWidth: 220 }} />
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
        {FILTERS.map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id)} className={`pill-btn${filter === f.id ? ' active' : ''}`}>
            {f.label} <span style={{ opacity: 0.6, marginLeft: 4 }}>({f.count})</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ background: DS.card, border: `1px solid ${DS.bd}`, borderRadius: 16, padding: 24 }}>
          <EmptyState
            icon="📋"
            title={search ? 'Sin resultados' : t('tasks.none')}
            sub={search ? 'Prueba con otra búsqueda' : t('tasks.noneSub')} />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(({ task, submission }, i) => (
            <div key={task.id} className={`float-up d${Math.min(i+1, 6)}`}>
              <TaskRow task={task} submission={submission} t={t}
                onSubmit={(task) => setSubmitModal({ open: true, task })} />
            </div>
          ))}
        </div>
      )}

      <SubmitModal
        open={submitModal.open}
        onClose={() => setSubmitModal({ open: false, task: null })}
        task={submitModal.task}
        onSubmit={(taskId, note) => submitTask(taskId, myStudent.id, note)}
      />
    </div>
  );
}
